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
              showResults(response)
            $("#collegeName").html(`<h1>${response.results[0].school.name}</h1>`);
            $("#location").html(`<b>Location:</b> ${response.results[0].school.city}, ${response.results[0].school.state}`)
            $("#tuitionInstate").html(`<b>In state cost:</b> $${response.results[0].latest.cost.tuition.in_state}`);
            $("#tuitionOutstate").html(`<b>Out of state cost:</b> $${response.results[0].latest.cost.tuition.out_of_state}`);
            $("#acceptanceRate").html(`<b>Acceptance Rate:</b> ${response.results[0].latest.admissions.admission_rate.overall}%`);
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
    
    // Button that pushes var for firebase

    function showResults(data) {$("#add-college-btn").on("click", function(event) {
          event.preventDefault();
          console.log(newCity);

          var newCollegeinfo = {
            
            college: newCollege,
            city: newCity + "," + newstate,
            tuition_Instate: newtuition_Instate,
            tuition_Outstate: newtuition_Outstate,
            acceptRate: newacceptRate,
            // income: newIncome,
          };
          
          // push's new info to database
          
          database.ref().push(newCollegeinfo);
       });
    }