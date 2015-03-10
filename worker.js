var Firebase = require('firebase'),
    WorkQueue = require('./workqueue.js'),
    workqueueRef = new Firebase('https://YOUR-INSTANCE.firebaseio.com/workqueue'),
    errorMessage = null;

var workCallback = function(data, whenFinished) {
    //This is where we actually process the data. We need to call 'whenFinished' when we're done
    //to let the queue know we're ready to handle a new job.
    console.log('Started Processing: ' + data.number);

    //This demo task simply pauses for the amount of time specified in data.time
    setTimeout(function() {
        //errorMessage = 'This is an error';

        console.log('Finished Processing: ' + data.number + ' for ' + data.time + ' milliseconds');

        whenFinished(errorMessage);

        errorMessage = null;
    }, data.time);
};

new WorkQueue(workqueueRef, workCallback);
