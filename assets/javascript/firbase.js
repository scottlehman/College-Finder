var config = {
    apiKey: "AIzaSyCyWIXZHywteI0KWaauMi7sjWeyL_DDDcc",
    authDomain: "college-finder-f2730.firebaseapp.com",
    databaseURL: "https://college-finder-f2730.firebaseio.com",
    projectId: "college-finder-f2730",
    storageBucket: "college-finder-f2730.appspot.com",
    messagingSenderId: "109608559117"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// add new college info
$("#add-college-btn").on("click", function(event) {
    event.preventDefault();

    // pulls user input/new train info
    var newCollege = $("#College-name").val().trim();
    var newCity = $("#city").val().trim();
    var newDegree = $("#degree").val().trim();
    var newPGIncome = $("#PGIncome").val().trim();
    var newTuition = $("#tuition").val().trim();
    var newRate = $("#gradutation-Rate").val().trim();
    var newLiving = $("#livingCost").val().trim();    
    var newJobs = $("#jobs").val().trim();
    
    
    // new train objecct

    var newCollege = {
        college: newCollege,
        city: newCity,
        degree: newDegree,
        PGIncome: newPGIncome,
        tuition: newTuition,
        gradutationRate: newRate,
        livingCost: newLiving,
        jobs: newJobs,
    };

    // push's new info to database
    database.ref().push(newTrain);


    // clear inputs
    $("#College-name").val("");
    $("#city").val("");
    $("#degree").val("");
    $("#PGIncome").val("");    
    $("#tuition").val("");
    $("#graduation-Rate").val("");
    $("#livingCost").val("");
    $("#jobs").val("");

});


database.ref().on("child_added", function(childSnapshot) {

    var newCollege = childSnapshot.val().college;
    var newCity = childSnapshot.val().city;
    var newDegree = childSnapshot.val().degree;
    var newPGIncome = childSnapshot.val().PGIncome;
    var newTuition = childSnapshot.val().tuition;
    var newRate = childSnapshot.val().gradutationRate;
    var newLiving =childSnapshot.val().livingCost;
    var newJobs = childSnapshot.val().jobs;


    // new row for train
    var newCollegeINFO = $("<tr>").append(
        $("<td>").text(newCollege),
        $("<td>").text(newCity),
        $("<td>").text(newDegree),
        $("<td>").text(newPGIncome),        
        $("<td>").text(newTuition),
        $("<td>").text(newRate),
        $("<td>").text(newLiving),
        $("<td>").text(newJobs)
    );

    $("#collegeInfo-table > tbody").append(newcollegeINFO);

});