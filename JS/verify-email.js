  const ver_code = document.getElementById("ver_code");
  const submit_btn = document.getElementById("submit_btn");
  const usr_email = localStorage.getItem("email");
  const f_name = localStorage.getItem("fname");
  const op = localStorage.getItem("op");
  const attemptModal = document.getElementById("attemptModal");
  const resendModal = document.getElementById("resendModal");
  const login_btn = document.getElementById("login_btn");
  const home_btn = document.getElementById("home_btn");
  const dots = document.getElementById("loading");
  const ver_form = document.getElementById("verifyForm");
  const close_btn1 = document.getElementById("close_btn1");
  const close_btn2 = document.getElementById("close_btn2");

  if(!usr_email) {
    window.location.href = "/";
  }
  else {
    let html = "";
    localStorage.clear();
    if(op === "activate") {
    html = `<h1>Congratulations ${f_name} !</h1><p></p><p class="lead">Your account has been successfully created. Enter the code you received in your email to activate your account:</p>`;
    }
    else {
    html = `<p class="lead">To reset your password, enter the code you received in your email:</p>`;
    }
    document.getElementById("desc").innerHTML = html;
  }

const screen = (window.innerWidth < 1000) ? "small" : "big";

if(screen === "small") {
document.getElementById("con").className = "container-mobile";
document.getElementById("logo").className = "logo-panel-mobile";
document.getElementById("ads").className = "ads-panel-mobile";
}

  ver_code.addEventListener("input", (event) => {
    if(event.target.value === "") submit_btn.disabled = true;
    else submit_btn.disabled = false;
  });

  login_btn.addEventListener("click", (event) => {
    window.location.href = "login.html";
  });

  home_btn.addEventListener("click", (event) => {
    window.location.href = "/";
  });


  function OKClicked() {
    attemptModal.style.display = "none";
    resendModal.style.display = "none";
  }

  async function handleVerify(event) {

  event.preventDefault(); // stop form from reloading the page
  submit_btn.disabled = true;
  dots.style.display = "flex";
  document.getElementById("errorMsg").innerText = "";

  try {
    const res = await fetch("https://i-press-backend-production.up.railway.app/files/verifyemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: usr_email, vcode: ver_code.value})
    });

      dots.style.display = "none";

    if (res.status === 200) {
      if(op === "activate") {
      ver_code.disabled = true;
      submit_btn.disabled = true;                
      document.getElementById("successModal").style.display = "flex";
      }
      else {
        localStorage.setItem("email",usr_email);
        window.location.href = "reset-pwd.html";
      }
    }
    else if (res.status === 429) {
      ver_code.value = "";
      attemptModal.style.display = "flex";  
    }
    else if (res.status === 400) {
      document.getElementById("errorMsg").innerText = "Invalid or expired code";
      submit_btn.disabled = false;
      return;
    }

  } catch (err) {
    console.error("Login error:", err);
    //errorMsg.textContent = "Network error.";
  }
}

  async function handleResend() {
  try {
    const res = await fetch("https://i-press-backend-production.up.railway.app/files/resendcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: usr_email, operation: op})
    });

    if (res.status === 200) {                
      document.getElementById("resendModal").style.display = "flex";
    }
  } catch (err) {
    console.error("Login error:", err);
    //errorMsg.textContent = "Network error.";
  }

  }

  ver_form.addEventListener("submit", handleVerify);
  close_btn1.addEventListener("click", OKClicked);
  close_btn2.addEventListener("click", OKClicked);