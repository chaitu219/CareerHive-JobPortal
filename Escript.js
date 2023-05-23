const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const empusername = document.getElementById('us');
const empemail = document.getElementById('em');
const emppassword1 = document.getElementById('ps1');
const emppassword2 = document.getElementById('ps2');


form2.addEventListener('submit', e => {

const isValidEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

  const empusernameValue = empusername.value;
  const empemailValue = empemail.value.trim();
  const emppassword1Value = emppassword1.value.trim();
  const emppassword2Value = emppassword2.value.trim();

  if(empusernameValue === ''||empusernameValue === null) {
    e.preventDefault();
    alert("Username is required")  
  }else if(empemailValue === '') {
    e.preventDefault();
    alert("Email is required")
  }else if (!isValidEmail(empemailValue)) {
    e.preventDefault();
    alert("Provide valid email address")
  }else if(emppassword1Value === '') {
    e.preventDefault();
    alert("Password is required")
  }else if (emppassword1Value.length < 8 ) {
    e.preventDefault();
    alert("Password must be 8 characters")
  }else if(emppassword2Value === '') {
    e.preventDefault();
    alert("Please confirm your password")
  }else if (emppassword2Value !== emppassword1Value) {
    e.preventDefault();
    alert("Password doesn't match")
  }
});