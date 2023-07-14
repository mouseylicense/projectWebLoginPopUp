const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

var loginbutton = document.getElementById('button');
var closeBtn = document.querySelector('.close-btn');

app.set('views', path.join(__dirname, "views"));

function checkCreds(){
  // checks the values from the form inputs
  var name = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var closeBtn = document.getElementById("closeBtn")
  fetch("/loginButton", {
    method: "POST",
    body: JSON.stringify({
      "email": name,
      "password": password,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then((response) => response.json())
  .then((json) => {if (json["Exists"] == false)
  {
    console.log(json["Exists"])
    popup.style.display = 'block';
    closeBtn.addEventListener('click', function () {
      popup.style.display = 'none';
  })} else if (json["Exists"] == "Admin") {
    window.location.href = '/indexAdmin';
}else if (json["Exists"] == true){
  window.location.href = '/index';

}
}
  
);
  

};