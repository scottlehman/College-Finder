
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

database.ref().on("child_added", function(childSnapshot) {

    var savedCollege = childSnapshot.val().college;
    var savedLocation = childSnapshot.val().city;
    var savedTuition_Instate = childSnapshot.val().tuition_Instate;
    var savedTuition_Outstate = childSnapshot.val().tuition_Outstate;
    var savedAcceptRate = childSnapshot.val().acceptRate;
    var savedPOP = childSnapshot.val().POP;
    var savedHousing = childSnapshot.val().Housing;
    var savedJobs = childSnapshot.val().Jobs;
    var key = childSnapshot.key;

    // new row for college
    var favColleges= $("<tr>").append(
        
        $("<td>").text(savedCollege),
        $("<td>").text(savedLocation),
        $("<td>").text(savedTuition_Instate),
        $("<td>").text(savedTuition_Outstate),        
        $("<td>").text(savedAcceptRate),        
        $("<td>").text(savedPOP),
        $("<td>").text(savedHousing),        
        $("<td>").text(savedJobs),
        $("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>")
        // $("<td>").text(costofliving),
        // $("<td>").text(medianwage),        
        // $("<td>").text(jobs),
        // $("<td>").text(newIncome),

        );
        
        $("#collegeInfo-table > tbody").append(favColleges);

    });

    
    $(document).on("click", ".arrival", function() {
        keyref = $(this).attr("data-key");
        database.ref().child(keyref).remove();
        window.location.reload();

    });