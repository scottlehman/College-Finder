var collegeScoreCardApiKey = "&api_key=h9FV3Fo58pfjzQYWYFNBjwf8imebCZj2t18pebBA";
var collegeNameInput = ""
var collegeScoreCardURL = "https://api.data.gov/ed/collegescorecard/v1/" 
var long = 0;


$("#submit-search").on("click", function(){
    event.preventDefault();
    collegeNameInput = $("#college-name-input").val()
    var collegeScoreCardSchoolName = "schools?school.name=" + collegeNameInput
    var lat = "";
    var test = [];
    var county = "";
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
                url: 'https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=county:'+ county+'&in=state:'+ state +'&DATE=9&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
                method: "GET"    
            }).then(function(response) {
                console.log(response[1][0])
            });
            $.ajax({ 
                url: 'https://api.census.gov/data/2017/pep/housing?get=DATE,GEONAME,HUEST&for=county:'+ county +'&in=state:'+ state +'&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
                method: "GET"    
            }).then(function(response) {
                console.log(response[1][2])
            });
            $.ajax({ 
                url: 'https://api.census.gov/data/2012/ewks?get=EMP,OPTAX&for=county:'+ county +'&in=state:'+ state +'&NAICS2012=54&key=dd80d72396b6e496fdf7a5ea00ee31be40962944',
                method: "GET"    
            }).then(function(response) {
                console.log(parseInt(response[1][0]) + parseInt(response [2][0]) + parseInt(response [3][0]))
            });
        }); 
})

});