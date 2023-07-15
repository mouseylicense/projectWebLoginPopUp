const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
var loginbutton = document.getElementById('button');
console.log(popup2)
app.set('views', path.join(__dirname, "views"));
popup2.innerHTML = "test"
function checkCreds(){
  // define elements
  var closeBtn = document.getElementById("closeBtn")
  var popup2 = document.getElementById('popup');

  // checks the values from the form inputs
  var name = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  
  // send post request with data from form
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
    //endpoint returns false if user dosent exist, true if exists and admin if Admin
  .then((response) => response.json())
  .then((json) => {if (json["Exists"] == false)
  {
    // if exists
    popup2.style.display = 'block';
  } 
  else if (json["Exists"] == "Admin") {
  // if Admin
    window.location.href = '/indexAdmin'; //redirect to admin page
  }
  else if (json["Exists"] == true){
  // if exists
  window.location.href = '/index'; // redirect to next page
}
}
  
);
  

};