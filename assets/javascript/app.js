var collegeScoreCardApiKey = "&api_key=h9FV3Fo58pfjzQYWYFNBjwf8imebCZj2t18pebBA";
var collegeNameInput = "";
var collegeScoreCardURL = "https://api.data.gov/ed/collegescorecard/v1/";

$("#submit-search").on("click", function(){
    event.preventDefault();
    collegeNameInput = $("#college-name-input").val().trim();
    var lat = "";
    var long = 0;
    var county = "";
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

    $.ajax({
        url: `https://api.data.gov/ed/collegescorecard/v1/${collegeScoreCardSchoolName}${collegeScoreCardApiKey}`,
        method: "GET"
    }).then(function(response) {
        lat = response.results[0].location.lat
        long =  response.results[0].location.lon
        console.log(long);
        console.log(lat);
    $.ajax({ 
      url: 'https://tigerweb.geo.census.gov/ArcGIS/rest/services/Census2010/State_County/MapServer/1/query?text=&geometry={%22x%22:'+ long + ',%22y%22:'+ lat +',%22spatialReference%22:{%22wkid%22:4326}}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&returnGeometry=false&outFields=STATE,COUNTY&f=json',
      method: "GET"    
  }).then(function(response) {
      state = response[273] + response[274]
      county = response[287] + response[288] + response[289]
      $.ajax({
        url: 'https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=county:' + county + '&in=state:' + state + '&DATE=9&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
        method: "GET"
    }).then(function (response) {
        console.log(response[1][0])
        $("#population").html(`<b>Population: </b> ${response[1][0]}`);
    });
    $.ajax({
        url: 'https://api.census.gov/data/2017/pep/housing?get=DATE,GEONAME,HUEST&for=county:' + county + '&in=state:' + state + '&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
        method: "GET"
    }).then(function (response) {
        console.log(response[1][2])
        $("#housing").html(`<b>Housing: </b> ${response[1][2]}`);
    });
    $.ajax({
        url: 'https://api.census.gov/data/2012/ewks?get=EMP,OPTAX&for=county:' + county + '&in=state:' + state + '&NAICS2012=54&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
        method: "GET"
    }).then(function (response) {
        console.log(parseInt(response[1][0]) + parseInt(response[2][0]) + parseInt(response[3][0]))
        $("#jobs").html(`<b>Total Jobs in Area: </b> ${parseInt(response[1][0]) + parseInt(response[2][0]) + parseInt(response[3][0])}`);
    });
});
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