$(document).ready(function() {
    $("#cardResult").hide();
});

var collegeScoreCardApiKey = "&api_key=h9FV3Fo58pfjzQYWYFNBjwf8imebCZj2t18pebBA";
var collegeNameInput = "";
var collegeScoreCardURL = "https://api.data.gov/ed/collegescorecard/v1/";
    // var lat = "";
    // var long = "";
    // var county = "";

$("#submit-search").on("click", function(collegeINFO){
    event.preventDefault();
    collegeNameInput = $("#college-name-input").val().trim();
    // var lat = "";
    // var long = "";
    // var county = "";

    var collegeScoreCardSchoolName = `schools?school.name=${collegeNameInput}`;
    
    function initialAPICall() {
      return new Promise((resolve, reject) => {
        
        $.ajax({
          url: `https://api.data.gov/ed/collegescorecard/v1/${collegeScoreCardSchoolName}${collegeScoreCardApiKey}`,
          method: "GET"
        }).then(function(response) {
          // showResults(response)
          // $("#SixYearIncome").html(`<b>Median income after six years: </b>$${respsone.results[0].latest.earnings..median}`)
          console.log(response);
          
          // Saves search variables for firebase to capture when save button is clicked
          
          var newCollege = response.results[0].school.name;
          var newCity = response.results[0].school.city;
          var newtuition_Instate = numeral(response.results[0].latest.cost.tuition.in_state).format('$0,0.00');
          var newtuition_Outstate = numeral(response.results[0].latest.cost.tuition.out_of_state).format('$0,0.00');
          var newacceptRate  = numeral(response.results[0].latest.admissions.admission_rate.overall).format('0.00%');
          console.log(newCity);
          var newstate = response.results[0].school.state;
          var lat = response.results[0].location.lat;
          var long =  response.results[0].location.lon;
          collegeURL = response.results[0].school.school_url;
          lowerCaseURL = collegeURL.toLowerCase();
          console.log(long);
          
          return resolve({ lat, long, newCollege, newCity, newtuition_Instate, newtuition_Outstate, newacceptRate, newstate, collegeURL, lowerCaseURL });
          
        });
      });
    }
    
    function callCensusForPopulationAndJobs(data) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: 'https://api.census.gov/data/2012/ewks?get=EMP,OPTAX&for=county:' + data.county + '&in=state:' + data.state + '&NAICS2012=54&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
          method: "GET"
        }).then(function (response) {
          console.log(response)
          var newJobs = numeral(parseInt(response[1][0]) + parseInt(response[2][0]) + parseInt(response[3][0])).format('0,0');
          
          data.newJobs = newJobs;
          console.log(newJobs);
          return resolve(data);
        });
      });
    }

    function callCensusForHousing (data) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: 'https://api.census.gov/data/2017/pep/housing?get=DATE,GEONAME,HUEST&for=county:' + data.county + '&in=state:' + data.state + '&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
          method: "GET"
        }).then(function (response) {
          console.log(response)
          var newHousing = numeral(response[1][2]).format('0,0');
          data.newHousing = newHousing;
          console.log(newHousing);
          return resolve(data);
          // $("#housing").html(`<b>Housing: </b> ${response[1][2]}`);
        });
      });
    }

    function callCensusForPOP (data) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: 'https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=county:' + data.county + '&in=state:' + data.state + '&DATE=9&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
          method: "GET"
        }).then(function (response) {
          console.log(response)
          var newPOP= numeral(response[1][0]).format('0,0');
          data.newPOP = newPOP;
          console.log(newPOP);
          return resolve(data);
          // $("#housing").html(`<b>Housing: </b> ${response[1][2]}`);
        });
      });
    }
    
    function callLOC (data) {
      return new Promise((resolve, reject) => {
        $.ajax({ 
          url: 'https://tigerweb.geo.census.gov/ArcGIS/rest/services/Census2010/State_County/MapServer/1/query?text=&geometry={%22x%22:'+ data.long + ',%22y%22:'+ data.lat +',%22spatialReference%22:{%22wkid%22:4326}}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&returnGeometry=false&outFields=STATE,COUNTY&f=json',
          method: "GET"    
        }).then(function(response) {
          var state = response[273] + response[274];
          var county = response[287] + response[288] + response[289];
          console.log(response);
          
          data.state = state;
          data.county = county;
          return resolve(data);
        });
      });
    }
    
    initialAPICall()
    .then((data) => callLOC(data))
    .then((data) => callCensusForPopulationAndJobs(data))
    .then((data) => callCensusForHousing(data)) 
    .then((data) => callCensusForPOP(data))
    .then((data) => {
      console.log('Manipulate the DOM here...');
      console.log(data)
      $("#cardResult").attr('data-college-data', JSON.stringify(data));
      $("#collegeName").html(`<h1>${data.newCollege}</h1>`);
      $("#collegeUrl").html(`<a href="https://${data.lowerCaseURL}" target="_blank">${data.lowerCaseURL}</a>`)
      $("#location").html("<b>Location: </b>" + data.newCity +", "+ data.newstate);
      $("#tuitionInstate").html("<b>In state cost: </b>" + data.newtuition_Instate);
      $("#tuitionOutstate").html("<b>Out of state cost: </b>" + data.newtuition_Outstate);
      $("#acceptanceRate").html("<b>Acceptance Rate: </b>" + data.newacceptRate);
      $("#population").html("<b>Population: </b>" + data.newPOP);
      $("#jobs").html("<b>Total Jobs in Area: </b>" + data.newJobs);
      $("#housing").html("<b>Housing: </b>" + data.newHousing);
      showResults(data);
      $("#cardResult").show();
      
    })
    .catch(error => console.error(error));
    
    // JS for linking info to firebase
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
    
    // Button that pushes var for firebase

    function showResults() {
      // console.log(data)
    }

    $("#save-search").on("click", function(event) {
      event.preventDefault();

      var data = JSON.parse($("#cardResult").attr('data-college-data'));
      console.log(data);

      var newCollegeinfo = {
        
        college: data.newCollege,
        city: data.newCity + ", " + data.newstate,
        tuition_Instate: data.newtuition_Instate,
        tuition_Outstate: data.newtuition_Outstate,
        acceptRate: data.newacceptRate,
        POP: data.newPOP,
        Housing: data.newHousing,
        Jobs: data.newJobs

        // income: newIncome,
      };
      
      // push's new info to database

      database.ref().push(newCollegeinfo);
      
  });
});