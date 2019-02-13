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
          });

    console.log("button works");

});