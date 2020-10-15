let rawResults = "";
function readFile (file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0){
                var allText = rawFile.responseText;
                rawResults = allText;
            }
        }
    }
    rawFile.send(null);
}

// let pathToDataFile = "../data.txt"
let pathToDataFile = "https://github.com/itsmais/us-presidential-elections-map/blob/main/data.txt";
readFile(pathToDataFile)

let DOM_MAP = document.getElementById("interactive-map");
let US_States = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", 
"GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", 
"MN", "MO", "MS", "MT", "NC", "ND", "NE",  "NH", "NJ", "NM", "NV", "NY", "OH", 
"OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]; 

let US_Sates_full = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
'District of Columbia','Florida','Georgia', 'Hawaii', 'Idaho','Illinois',
'Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York',
'North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington',
'West Virginia','Wisconsin','Wyoming'];

let state_averages_dem = {}; // dictionary of STATE : AVERAGE for Democrats
let state_averages_rep = {}; // dictionary of STATE : AVERAGE for Republicans
let state_averages_occs = {}; // dictionary of STATE : NUM of Occurrences
// Fata format from source:
// State  Dem-%    GOP-%    Ind-%    Starting-month    Starting-day    Ending-month    Ending-day    Pollster

let rawResultsList = rawResults.split("\n");
// console.log(rawResultsList);

// Initializing the occ's with 0's
// Initializing the sums with 0's
for (i in US_States){
  state_averages_occs[US_States[i]]=0;
  state_averages_dem[US_States[i]]=0;
  state_averages_rep[US_States[i]]=0;
}

// Calculating the state sums
for (i in rawResultsList){
    let line = rawResultsList[i].split(" ");
    state_averages_occs[line[0]]++;
    state_averages_dem[line[0]]+=parseInt(line[1]);
    state_averages_rep[line[0]]+=parseInt(line[2]);
} 

for (i in US_States){
  state_averages_dem[US_States[i]]/=state_averages_occs[US_States[i]];
  state_averages_rep[US_States[i]]/=state_averages_occs[US_States[i]];
}

// console.log(state_averages_dem);
// console.log(state_averages_rep);

let max_diff = state_averages_rep[US_States[0]] - state_averages_dem[US_States[0]];
let min_diff = state_averages_rep[US_States[0]] - state_averages_dem[US_States[0]];

for (i =1; i< US_States.length; i++){
  if (max_diff<state_averages_rep[US_States[i]] - state_averages_dem[US_States[i]]){
      max_diff=state_averages_rep[US_States[i]] - state_averages_dem[US_States[i]];
  }
  if (min_diff>state_averages_rep[US_States[i]] - state_averages_dem[US_States[i]]){
    min_diff=state_averages_rep[US_States[i]] - state_averages_dem[US_States[i]];
  }
}

// console.log(min_diff);
// console.log(max_diff);
let med = (min_diff + max_diff) / 2;
let colors = [];
let polling_outcomes = [];

for (i in US_States){
  polling_outcomes[i]="Dem=" + Math.floor(state_averages_dem[US_States[i]]) + "%, Rep=" + Math.floor(state_averages_rep[US_States[i]]) +"<br>" + US_Sates_full[i];
  if (state_averages_dem[US_States[i]]-state_averages_rep[US_States[i]] > 0){
    // blue
    colors[i] = Math.floor(med - Math.abs(state_averages_dem[US_States[i]] - state_averages_rep[US_States[i]]));
  }
  else { // red
    colors[i] = Math.floor(med + Math.abs(state_averages_dem[US_States[i]] - state_averages_rep[US_States[i]]));
  }
}

var data = [{
  type: "choroplethmapbox", 
  locations: US_States, 
  text: polling_outcomes,
  z: colors, 
  zmin: min_diff, 
  zmax: max_diff,
  geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json"
}];
let lat =  38;
let long = -96;
var layout = {mapbox: {center: {lon: long, lat: lat}, zoom: 2.8},
              width: 1000, height:490};

var config = {mapboxAccessToken: "pk.eyJ1IjoibWhhdGVtIiwiYSI6ImNrZzl6MXN2cTAyNDgycWxsanZ5YnRvYzQifQ.U2Wlr7Ok0SNY1jA2Kn6dUQ"};

Plotly.newPlot('main-content', data, layout, config);
