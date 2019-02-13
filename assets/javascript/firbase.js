
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
    var savedlocation = childSnapshot.val().city;
    var savednewtuition_Instate = childSnapshot.val().tuition_Instate;
    var savednewtuition_Outstate = childSnapshot.val().tuition_Outstate;
    var savednewacceptRate = childSnapshot.val().acceptRate;


    // new row for college
    var favColleges= $("<tr>").append(
        
        $("<td>").text(savedCollege),
        $("<td>").text(savedlocation),
        $("<td>").text(savednewtuition_Instate),
        $("<td>").text(savednewtuition_Outstate),        
        $("<td>").text(savednewacceptRate),
        // $("<td>").text(costofliving),
        // $("<td>").text(medianwage),        
        // $("<td>").text(jobs),
        // $("<td>").text(newIncome),

        );
        
        $("#collegeInfo-table > tbody").append(favColleges);

});