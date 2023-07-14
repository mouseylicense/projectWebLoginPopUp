var signbutton = document.getElementById('signbutton');
var closeBtn = document.querySelector('.close-btn');
const CRUD = require('../DB/CRUD')

if (signbutton) {
  signbutton.addEventListener('click', function (event) {
    event.preventDefault();
    // Get the values from the form inputs
    var nameUser = document.getElementById('nameUser').value;
    var email = parseInt(document.getElementById('email').value);
    var password = document.getElementById('password').value;
    var password2 = document.getElementById('password2').value;

    if (!(password == password2)) {

      // Show validation error popup
      popup.style.display = 'block';
      closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
      });
    }
  });
}


