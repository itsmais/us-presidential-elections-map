var myHeaders = new Headers();
myHeaders.append("Access-Control-Allow-Origin", "*");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://www.electoral-vote.com/evp2020/Pres/pres_polls.txt", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));