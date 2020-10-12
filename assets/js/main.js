var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("https://www.electoral-vote.com/evp2020/Pres/pres_polls.txt", requestOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result)
    })
    .catch(error => console.log('error', error));