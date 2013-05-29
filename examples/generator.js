var Firebase = require("firebase");
var newWorkPeriod = 700;
var workItems = new Firebase("https://workqueue.firebaseio-demo.com/");

var i = 0;
setInterval(function() {
 workItems.push({number: i, time: Math.floor(Math.random()*2000)});
 i++;
}, newWorkPeriod);
