/**
 * This class manages a list of Firebase elements and dispatches items in it to
 * be processed. It is designed to only process one item at a time.
 *
 * It uses transactions to grab queue elements, so it's safe to run multiple
 * workers at the same time processing the same queue.
 *
 * @param queueRef A Firebase reference to the list of work items
 * @param processingCallback The callback to be called for each work item
 */
function WorkQueue(queueRef, processingCallback) {
  this.processingCallback = processingCallback;
  this.busy = false;
  this.shutdownRequested = false;
  queueRef.limitToFirst(1).on("child_added", function(snap) {
    this.currentItem = snap.ref();
    this.tryToProcess();
  }, this);
  this.queueRef = queueRef;
}

WorkQueue.prototype.readyToProcess = function() {
  this.busy = false;
  if (this.shutdownRequested) {
    console.log('Finished processing. Shutting down.');
    process.exit();
  }
  this.tryToProcess();
}

WorkQueue.prototype.shutdown = function() {
  this.queueRef.off();
  this.shutdownRequested = true;
  if (!this.busy) {
    console.log('Not busy. Shutting down.');
    process.exit();
  }
}

WorkQueue.prototype.tryToProcess = function() {
  if (!this.busy && this.currentItem) {
    this.busy = true;
    var dataToProcess = null;
    var self = this;
    var toProcess = this.currentItem;
    this.currentItem = null;
    toProcess.transaction(function(theItem) {
      dataToProcess = theItem;
      if (theItem) {
        return null;
      } else {
        return;
      }
    }, function(error, committed, snapshot, dummy) {
      if (error) throw error;
      if (committed) {
        console.log("Claimed a job.");
        self.processingCallback(dataToProcess, function() {
          self.readyToProcess();
        });
      } else {
        console.log("Another worker beat me to the job.");
        self.readyToProcess();
      }
    });
  }
}

module.exports = WorkQueue;
