const usr_email = document.getElementById("email");
const err_div = document.getElementById("err-div");
const form = document.getElementById("ver-form");

async function sendCode(e) {
    e.preventDefault();
    err_div.style.opacity = "0";
    document.getElementById("submit_btn").textContent = ". . . . . . .";

  try {
    const res = await fetch("https://i-press-backend-production.up.railway.app/files/resendcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: usr_email.value, operation: "reset"})
    });

    if (res.status === 400) {
        err_div.style.opacity = "1";
        document.getElementById("submit_btn").textContent = "Send verification code";
        return
    }
    else if (res.status === 200) {                
      localStorage.setItem("email", usr_email.value);
      localStorage.setItem("op", "reset");
      window.location.href = "verify-email.html";
    }
  } catch (err) {
    console.error("Error sending code:", err);
    //errorMsg.textContent = "Network error.";
  }

  }

  form.addEventListener("submit", sendCode);