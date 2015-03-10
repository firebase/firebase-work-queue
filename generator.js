var Firebase = require('firebase'),
    workqueueRef = new Firebase('https://YOUR-INSTANCE.firebaseio.com/workqueue'),
    i = 0,
    createRecord = function() {
        workqueueRef.push({
            number: i,
            time: Math.floor(Math.random() * 2000),
            createdAt: Firebase.ServerValue.TIMESTAMP
        });

        i++; 
    };

(function loop() {
    setTimeout(function() {
        createRecord();
        loop();
    }, Math.floor(Math.random() * 1000)); // Randomize between 0 and 1 seconds
}());

