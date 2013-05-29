firebase-work-queue - A Simple Firebase Queue
===================

This is an example of processing data using Firebase as a queuing system.

To run, first you'll need to install the Firebase node package:
    
    npm install firebase

To process elements in the work queue, start a worker like this:

    node worker.js

To add new elements to the work queue, start the generator, like this:
    
    node generator.js

You can start as many workers or generators as you like. The WorkQueue uses transactions to ensure that each job is only given to one worker.

License
-------
[MIT](http://firebase.mit-license.org).