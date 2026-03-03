let captchaToken = null;
const forgot = document.getElementById("forgot");
const dots = document.getElementById("loading");

window.onCaptchaSuccess = function(token) {
  captchaToken = token;
};

window.onCaptchaExpired = function() {
  captchaToken = null;
};

const screen = (window.innerWidth < 1000) ? "small" : "big";

if(screen === "small") {
document.getElementById("con").className = "container-mobile";
document.getElementById("logo").className = "logo-panel-mobile";
document.getElementById("login").className = "login-panel-mobile";
document.getElementById("ads").className = "ads-panel-mobile";
}

forgot.addEventListener("click", (event) => {
    window.location.href = "enter-email.html";
  });


async function handleLogin(event) {
  event.preventDefault(); // stop form from reloading the page

    if (!captchaToken) {
    alert("Please verify captcha");
    return;
  }

  const btn = document.getElementById("submit_btn");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  btn.textContent = ". . . . . . .";
dots.style.display = "flex";
  btn.disabled = true;

  try {
    const res = await fetch("https://i-press-backend-production.up.railway.app/files/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, captchaToken })
    });

      const data = await res.json();

    if (res.status === 200) {

      // Save JWT access token & displayname
      localStorage.setItem("loginToken", data.loginToken);
      localStorage.setItem("displayName", data.displayName);

      // Redirect to main page
      window.location.href = "/";
    } else if (res.status === 401) {
      errorMsg.textContent = "Invalid credentials";
      btn.textContent = "Sign in";
      dots.style.display = "none";
      btn.disabled = false;
      captchaToken = null;
      turnstile.reset();
    } else if (res.status === 402) {
      if(!localStorage.getItem("email")) {
      localStorage.setItem("email", email);
      localStorage.setItem("fname", data.f_name);
      localStorage.setItem("op","activate");
      }
      window.location.href = "verify-email.html";
    } else {
      errorMsg.textContent = "Server error, try again later.";
      btn.textContent = "Sign in";
      dots.style.display = "none";
      btn.disabled = false;
      captchaToken = null;
      turnstile.reset();
    }
  } catch (err) {
    console.error("Login error:", err);
    errorMsg.textContent = "Network error.";
  }
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


// Attach event listener
document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("togglePassword").addEventListener("click", togglePwdView);