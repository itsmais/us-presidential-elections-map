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

let pathToDataFile = "../data.txt"
readFile(pathToDataFile)

let DOM_MAP = document.getElementById("interactive-map");
let US_States = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", 
"GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", 
"MN", "MO", "MS", "MT", "NC", "ND", "NE",  "NH", "NJ", "NM", "NV", "NY", "OH", 
"OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]; 

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

console.log(state_averages_dem);
console.log(state_averages_rep);
