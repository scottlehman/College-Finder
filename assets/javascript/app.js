var collegeScoreCardApiKey = "&api_key=h9FV3Fo58pfjzQYWYFNBjwf8imebCZj2t18pebBA";
var collegeNameInput = "";
var collegeScoreCardURL = "https://api.data.gov/ed/collegescorecard/v1/";

$("#submit-search").on("click", function(){
    event.preventDefault();
    collegeNameInput = $("#college-name-input").val().trim();

    var collegeScoreCardSchoolName = `schools?school.name=${collegeNameInput}`;
    $.ajax({
        url: `https://api.data.gov/ed/collegescorecard/v1/${collegeScoreCardSchoolName}${collegeScoreCardApiKey}`,
            method: "GET"
          }).then(function(response) {
              
            $("#collegeName").html(`<h1>${response.results[0].school.name}</h1>`);
            $("#location").html(`<b>Location:</b> ${response.results[0].school.city}, ${response.results[0].school.state}`)
            $("#tuitionInstate").html(`<b>In state cost:</b> $${response.results[0].latest.cost.tuition.in_state}`);
            $("#tuitionOutstate").html(`<b>Out of state cost:</b> $${response.results[0].latest.cost.tuition.out_of_state}`);
            $("#acceptanceRate").html(`<b>Acceptance Rate:</b> ${response.results[0].latest.admissions.admission_rate.overall}%`);
            // $("#SixYearIncome").html(`<b>Median income after six years: </b>$${respsone.results[0].latest.earnings..median}`)
            console.log(response);
            console.log(`${response.results[0].school.city}`)
          });

    console.log("button works");

});

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

  // pulls user input/new college info
  var newCollege = $("#collegeName").val().trim();
  var newCity = $("#location").val().trim();
  var newtuition_Instate = $("#tuitonInstate");
  var newtuition_Outstate = $("#tuitionOutstate");
  var newacceptRate = $("#acceptanceRate");

  var newCollegeinfo = {

      college: newCollege,
      city: newCity,
      tuition_Instate: newtuition_Instate,
      tuition_Outstate: newtuition_Outstate,
      acceptRate: newacceptRate,
      // income: newIncome,
  };

  // push's new info to database
  database.ref().push(newCollegeinfo);

});


database.ref().on("child_added", function(childSnapshot) {

  var newCollege = childSnapshot.val().college;
  var newCity = childSnapshot.val().city;
  var newtuition_Instate = childSnapshot.val().tuition_Instate;
  var newtuition_Outstate = childSnapshot.val().tuition_Outstate;
  var newacceptRate = childSnapshot.val().acceptRate;
  // var newIncome = childSnapshot.val().income;ß

  // new row for college
  var savedCollege= $("<tr>").append(

      $("<td>").text(newCollege),
      $("<td>").text(newCity),
      $("<td>").text(newtuition_Instate),
      $("<td>").text(newtuition_Outstate),        
      $("<td>").text(newacceptRate),
      // $("<td>").text(newIncome),

  );

  $("#collegeInfo-table > tbody").append(savedCollege);

});