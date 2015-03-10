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
var Firebase = require('firebase');

function WorkQueue(queueRef, processingCallback) {
    this.processingCallback = processingCallback;
    this.busy = false;

    queueRef.orderByChild('status').limitToFirst(1).on('child_added', function(snapshot) {
        this.currentItem = snapshot.ref();
        this.tryToProcess();
    }, this);
}

WorkQueue.prototype.readyToProcess = function() {
    this.busy = false;
    this.tryToProcess();
};

WorkQueue.prototype.tryToProcess = function() {
    if (this.busy || !this.currentItem) return;

    var dataToProcess = null,
        self = this,
        toProcess = this.currentItem;

    this.busy = true;
    this.currentItem = null;

    toProcess.transaction(function(theItem) {
        dataToProcess = theItem;

        if (theItem && !theItem.status) {
            theItem.status = 'processing';
            theItem.statusChanged = Firebase.ServerValue.TIMESTAMP;

            return theItem;
        }
    }, function(error, committed, snapshot) {
        if (error) throw error;

        if (!committed) {
            console.log('Another worker beat me to the job.');
            self.readyToProcess();
            return;
        }

        var ref = snapshot.ref();

        console.log('Claimed a job.');

        self.processingCallback(dataToProcess, function(errorMessage) {
            if (errorMessage) {
                ref.update({
                    status: 'error',
                    errorMessage: errorMessage,
                    statusChanged: Firebase.ServerValue.TIMESTAMP
                });
            } else {
                ref.remove();
            }

            self.readyToProcess();
        });
    });
};

module.exports = WorkQueue;
