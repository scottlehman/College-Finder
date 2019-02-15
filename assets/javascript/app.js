$(document).ready(function() {
    $("#cardResult").hide();
});

var collegeScoreCardApiKey = "&api_key=h9FV3Fo58pfjzQYWYFNBjwf8imebCZj2t18pebBA";
var collegeNameInput = "";
var collegeScoreCardURL = "https://api.data.gov/ed/collegescorecard/v1/";
    var lat = "";
    var long = "";
    var county = "";

$("#submit-search").on("click", function(collegeINFO){
    event.preventDefault();
    collegeNameInput = $("#college-name-input").val().trim();
    // var lat = "";
    // var long = "";
    // var county = "";

var collegeScoreCardSchoolName = `schools?school.name=${collegeNameInput}`;
$.ajax({
    url: `https://api.data.gov/ed/collegescorecard/v1/${collegeScoreCardSchoolName}${collegeScoreCardApiKey}`,
        method: "GET"
      }).then(function(response) {
          $("#cardResult").show();
          showResults(response)
          // $("#SixYearIncome").html(`<b>Median income after six years: </b>$${respsone.results[0].latest.earnings..median}`)
          console.log(response);
          
          // Saves search variables for firebase to capture when save button is clicked
          
          newCollege = `${response.results[0].school.name}`
          newCity = `${response.results[0].school.city}`
          newtuition_Instate = `${response.results[0].latest.cost.tuition.in_state}`
          newtuition_Outstate = `${response.results[0].latest.cost.tuition.out_of_state}`
          newacceptRate  = `${response.results[0].latest.admissions.admission_rate.overall}`
          console.log(newCity);
          newstate = `${response.results[0].school.state}`
          lat = response.results[0].location.lat
          long =  response.results[0].location.lon
          collegeURL = `${response.results[0].school.school_url}`;
          lowerCaseURL = collegeURL.toLowerCase();

          console.log(long);
          console.log(lat);
          $("#collegeName").html(`<h1>${response.results[0].school.name}</h1>`);
          $("#collegeUrl").html(`<a href="${lowerCaseURL}" target="_blank">${lowerCaseURL}</a>`);
          $("#location").html("<b>Location: </b>" + newCity +", "+ newstate)
          $("#tuitionInstate").html("<b>In state cost: $</b>" + newtuition_Instate);
          $("#tuitionOutstate").html("<b>Out of state cost: $</b>" + newtuition_Outstate);
          $("#acceptanceRate").html("<b>Acceptance Rate: </b>" + newacceptRate + "%");
          
          $.ajax({
            method: "GET"
          }).then(function (response) {
            console.log(response)
          });
          console.log("button works");
          callLOC();       
              
      });
  });
            

  function callCensus () {
    $.ajax({
      url: 'https://api.census.gov/data/2017/pep/housing?get=DATE,GEONAME,HUEST&for=county:' + county + '&in=state:' + state + '&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
      method: "GET"
    }).then(function (response) {
      console.log(response)
      newHousing = `${response[1][2]}`
      $("#housing").html(`<b>Housing: </b> ${response[1][2]}`);
    });

    $.ajax({
      url: 'https://api.census.gov/data/2012/ewks?get=EMP,OPTAX&for=county:' + county + '&in=state:' + state + '&NAICS2012=54&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
      method: "GET"
    }).then(function (response) {
      console.log(response)
      newPOP= `${response[1][0]}`
      newJobs = `${parseInt(response[1][0]) + parseInt(response[2][0]) + parseInt(response[3][0])}`
      $("#population").html(`<b>Population: </b> ${response[1][0]}`);
      $("#jobs").html(`<b>Total Jobs in Area: </b> ${parseInt(response[1][0]) + parseInt(response[2][0]) + parseInt(response[3][0])}`);
    });


  }
  
  function callLOC () {
    $.ajax({ 
      url: 'https://tigerweb.geo.census.gov/ArcGIS/rest/services/Census2010/State_County/MapServer/1/query?text=&geometry={%22x%22:'+ long + ',%22y%22:'+ lat +',%22spatialReference%22:{%22wkid%22:4326}}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&returnGeometry=false&outFields=STATE,COUNTY&f=json',
      method: "GET"    
    }).then(function(response) {
      state = response[273] + response[274]
      county = response[287] + response[288] + response[289]
      console.log(response);
      console.log(response[287]);
      console.log(response[273]);
      console.log(state);
      console.log(county);
      callCensus();
      
    })
  }
  
  // JS for linking info to firebase
    var config = {
      piKey: "AIzaSyCyWIXZHywteI0KWaauMi7sjWeyL_DDDcc",
      authDomain: "college-finder-f2730.firebaseapp.com",
      databaseURL: "https://college-finder-f2730.firebaseio.com",
      projectId: "college-finder-f2730",
      storageBucket: "college-finder-f2730.appspot.com",
      messagingSenderId: "109608559117"
      
  };

    firebase.initializeApp(config);
    
    var database = firebase.database();
    
    // Button that pushes var for firebase

    function showResults(data) {$("#add-college-btn").on("click", function(event) {
          event.preventDefault();
          console.log(newCity);

          var newCollegeinfo = {
            
            college: newCollege,
            city: newCity + ", " + newstate,
            tuition_Instate: newtuition_Instate,
            tuition_Outstate: newtuition_Outstate,
            acceptRate: newacceptRate,
            POP: newPOP,
            Housing: newHousing,
            Jobs: newJobs

            // income: newIncome,
          };
          
          // push's new info to database

          database.ref().push(newCollegeinfo);
      });
    }