const signup_form = document.getElementById("signup_form");
const togglePassword = document.getElementById("togglePassword");

function loadTemplate() {    
  if(window.innerWidth > 800) 
    window.location.href = "signup.html";
}

   function togglePwdView() {
      var pwd = document.getElementById("password");
      var pwd_t = document.getElementById("pwd-toggle");

  if (pwd.type === "password") {
    pwd.type = "text";
    pwd_t.className = "fa fa-eye-slash";
  } else {
    pwd.type = "password";
    pwd_t.className = "fa fa-eye";
  }      
    }


async function handleSignup(event) {

  event.preventDefault(); // stop form from reloading the page
  document.getElementById("err-msg").innerText = "";

  const btn = document.getElementById("signup_btn");
  const email = document.getElementById("email").value;
  const country = document.getElementById("country").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const displayName = document.getElementById("displayName").value;
  const password = document.getElementById("password").value;

  btn.textContent = ". . . . . .";
  btn.disabled = true;

  const userData = {
    email: email,
    country: country,
    f_name: firstName,
    l_name: lastName,
    disp_name: displayName,
    pwd: password,
  };

  try {
    const res = await fetch("https://i-press-backend-production.up.railway.app/files/adduser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (res.status === 409) {
      document.getElementById("err-msg").innerText = "This email address is already registered";
      btn.textContent = "Sign up";
      btn.disabled = false;
    }
    else if (res.status === 200) {
      localStorage.setItem("email", email);
      localStorage.setItem("fname", firstName);
      localStorage.setItem("op", "activate");
      window.location.href = "verify-email.html";
    }
  } catch (err) {
    console.error("Login error:", err);
    //errorMsg.textContent = "Network error.";
  }
}

window.addEventListener("DOMContentLoaded", loadTemplate);
signup_form.addEventListener("submit", handleSignup);
togglePassword.addEventListener("click", togglePwdView);