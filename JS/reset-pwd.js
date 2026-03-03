const pwd_controls = {"pwd-toggle1":"password", "pwd-toggle2":"con-password"};
const usr_email = localStorage.getItem("email");
const pass = document.getElementById("password");
const con_pass = document.getElementById("con-password");
const err = document.getElementById("errorMsg");
const login_btn = document.getElementById("login_btn");
const home_btn = document.getElementById("home_btn");
const dots = document.getElementById("loading");
const resetForm = document.getElementById("resetForm");
const togglePassword1 = document.getElementById("togglePassword1");
const togglePassword2 = document.getElementById("togglePassword2");

const screen = (window.innerWidth < 1000) ? "small" : "big";

if(screen === "small") {
document.getElementById("con").className = "container-mobile";
document.getElementById("logo").className = "logo-panel-mobile";
document.getElementById("reset").className = "login-panel-mobile";
document.getElementById("ads").className = "ads-panel-mobile";
}


if(!usr_email) {
    window.location.href = "/";
  }
else {
  localStorage.clear();
}

login_btn.addEventListener("click", (event) => {
    window.location.href = "login.html";
  });

home_btn.addEventListener("click", (event) => {
    window.location.href = "/";
  });


function togglePwdView(e) {

const pwd_control = document.getElementById(pwd_controls[e.target.id]);

  if (pwd_control.type === "password") {
    pwd_control.type = "text";
    e.target.className = "fa fa-eye-slash";
  } else {
    pwd_control.type = "password";
    e.target.className = "fa fa-eye";
  }      
    }

async function changePwd(e) {
    e.preventDefault();
    err.innerText = "";
    
    if(pass.value != con_pass.value) {
      err.innerText = "Values in both password fields do not match";
      return;
    }

    dots.style.display = "flex";

  try {
    const res = await fetch("https://i-press-backend-production.up.railway.app/files/resetpass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: usr_email, new_pass: pass.value})
    });

        dots.style.display = "none";

    if (res.status === 200) {                
      document.getElementById("successModal").style.display = "flex";
    }
  } catch (err) {
    console.error("Error sending code:", err);
    //errorMsg.textContent = "Network error.";
  }

  }

  resetForm.addEventListener("submit", changePwd);
  togglePassword1.addEventListener("click", togglePwdView);
  togglePassword2.addEventListener("click", togglePwdView);
