/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase

var config = {
    apiKey: "AIzaSyCJIUanO_FdhSjU8Udh0p83E_w8Uybb5T4",
    authDomain: "my-unique-project-c48df.firebaseapp.com",
    databaseURL: "https://my-unique-project-c48df.firebaseio.com",
    projectId: "my-unique-project-c48df",
    storageBucket: "my-unique-project-c48df.appspot.com",
    messagingSenderId: "962652607350"
  };
  firebase.initializeApp(config);
  
  
  
  var database = firebase.database();
  
  // 2. Button for adding Employees
  $("#add-train-btn").on("click", function (event) {
    event.preventDefault();
  
    // Grabs user input
    var name = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = moment($("#firstTrain-input").val().trim(), "HH:mm").format("X");
    var frequency = $("#frequency-input").val().trim();
    console.log(firstTrain);
    console.log(frequency);
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
      
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    // Alert
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function (childSnapshot, prevChildKey) {
  
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;
  
    // Employee Info
    console.log(name);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);
  

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "X").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minutes Awayx
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("h:mm A");
    
   

  
   
  
    // // Add each train's data into the table
     $("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + " minutes" + "</td><td>" +
     nextTrain + "</td><td>" + tMinutesTillTrain + "</td><td>");
  }, function(errorObject){

      console.log("Errors handled: " + errorObject.code);
  });

  