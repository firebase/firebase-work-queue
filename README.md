firebase-work-queue - A Simple Firebase Queue
=============================================

Usage
-----

Install using npm:

    npm install firebase
    npm install firebase-work-queue

You can generate a job by pusing data to a Firebase list:

```
var Firebase = require("firebase");
var workItems = new Firebase("https://workqueue.firebaseio-demo.com/");
workItems.push({data: 'some data')});
```

The WorkQueue uses transactions to ensure that each job is only given to one worker:

```
var Firebase = require("firebase");
var WorkQueue = require("firebase-work-queue");
var itemsRef = new Firebase("https://workqueue.firebaseio-demo.com/");
var queue = new WorkQueue(itemsRef, function(job, done) () {
  console.log(job);
  done()
});
```

You can start as many workers or generators as you like.

Example
-------

The `examples/` folder illustrates processing data using Firebase as a queuing system.

To run, first you'll need to install the Firebase node package:
    
    npm install firebase

To process elements in the work queue, start a worker like this:

    node examples/worker.js

To add new elements to the work queue, start the generator, like this:
    
    node examples/generator.js

License
-------
[MIT](http://firebase.mit-license.org).