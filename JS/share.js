  if(!localStorage.getItem("loginToken"))  
    window.location.href = "/";
  else if(window.innerWidth < 800) 
    window.location.href = "share-s.html";

    // === Modal show/hide ===
    const modal = document.getElementById("formModal");
    const closeBtn = document.getElementById("closeModal");
    const fileInput = document.getElementById("user-file");
    const prev = document.getElementById("preview");
    const bar_con = document.getElementById("bar-container");
    const token = localStorage.getItem("loginToken");
    var conID = ""; 
    var file_ext = "";

    document.getElementById("home_btn").onclick = () => {
      window.location.href = "/";
    };

    function showModal() {
      modal.classList.add("active");
    }

    fileInput.addEventListener('change', function(event) {
        const selectedFiles = event.target.files; // FileList object
        const next = document.getElementById("next1");
        
        if (selectedFiles.length > 0) {
        file_ext = selectedFiles[0].name.split('.').pop();
        next.disabled = false;

        } else {
            next.disabled = true;
        }
    });

    // Show modal automatically on page load
    window.addEventListener("load", () => {
      modal.classList.add("active");
    });

    // Close modal when user clicks X
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });

    // === Multi-step form logic ===
    const form = document.getElementById("multi-step-form");
    const steps = document.querySelectorAll(".step");
    const progressBar = document.getElementById("progress-bar");
    let currentStep = 0;

    function updateFormPosition() {
      form.style.transform = `translateX(-${currentStep * 100}%)`;
      progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
      closeBtn.style.zIndex = 1001;
    }

    document.getElementById("next1").onclick = () => {
      handleNext1();
    };
    document.getElementById("next2").onclick = () => {
      const title = document.getElementById("title");
      const desc = document.getElementById("desc");
      const err = document.getElementById("err-msg-1");
      err.style.opacity = 0;

      if(title.value === "" || desc.value === "") {
      err.style.opacity = 1;
      return;
      }

      prev.style.opacity = 0;
      currentStep = 2;
      updateFormPosition();
    };
    document.getElementById("prev3").onclick = () => {
      prev.style.opacity = 0;
      currentStep = 1;
      updateFormPosition();
    };

    modal.addEventListener('click', (e) => {
    if (e.target === modal && currentStep === 0)
    modal.classList.remove('active');
  });

    form.onsubmit = (e) => {
      e.preventDefault();
      alert("Form submitted successfully!");
      modal.classList.remove("active");
    };

    form.ontransitionend = (e) => {
      if(currentStep > 0) {  
        prev.style.opacity = 1; 
      }
    };

async function handleNext1() {
      document.getElementById("next1").disabled = true;
      closeBtn.style.opacity = 0;
      currentStep = 1;
      bar_con.style.opacity = 1;
      await handleUpload();
      bar_con.style.opacity = 0;
      updateFormPosition();
}

  async function handleUpload() {
  const userFile = document.getElementById("user-file");
  const file = userFile.files[0];

  // Create FormData (used for file uploads)
  const formData = new FormData();
  formData.append('file', file);

  try {
  const response = await fetch('https://i-press-backend-production.up.railway.app/files/upload', {
  method: 'POST',
  headers: {
          "Authorization": `Bearer ${token}`
  },
  body: formData,
});

  if (!response.ok) {
    throw new Error("Sorry ! Could not fetch your feeds.");
      }

  const data = await response.json(); // JSONPlaceholder returns an array

conID = data.ContentID;
loadFilePreview(conID);
prev.style.opacity = 0;

  } catch(err) {
    console.log("Error uploading data: ", err);
    }
}


async function handleShare() {

  const title_inp = document.getElementById("title").value;
  const desc_inp = document.getElementById("desc").value;
  const dldyes = document.getElementById("dld_yes");
  const dldno = document.getElementById("dld_no");
  const dld_inp = dldyes.checked ? '1' : '0';
  const author_inp = document.getElementById("author").value;
  const cat_inp = document.getElementById("cat").value;
  const author = document.getElementById("author");
  const err = document.getElementById("err-msg-2");
  const preloader = document.getElementById("loading3");
  err.style.opacity = 0;

  if(author.value === "") {
    err.style.opacity = 1;
    return;
  } 

    preloader.style.display = "flex";

    const res = await fetch("https://i-press-backend-production.up.railway.app/files/recordmetadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    body: JSON.stringify({
    contentid: conID,
    title: title_inp,
    des: desc_inp,
    downloadable: dld_inp,
    author: author_inp,
    cat: cat_inp
  })
    });

    preloader.style.display = "none";

    if (res.status === 200) {
      document.getElementById("link").innerText = "https://gopress.online/view?id=" + conID;
      document.getElementById("success_msg").style.opacity = 1;
      conID = "";
      file_ext = "";
      modal.classList.remove("active");
    } else {
      errorMsg.textContent = "Server error, try again later.";
    }
  }

  async function resourceExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (err) {
    return false;
  }
}


    function loadFilePreview(contID) {
      var HTMLString = "";
      var prevURL = "";

          if(file_ext === "pdf") {
          prevURL = `https://i-press-backend-production.up.railway.app/files/getContent/${contID}.jpg/big`;
          HTMLString = `<div class="preview-box bg-img-setting" style="background-image: url('${prevURL}');"></div>`;
          }
          else if(file_ext === "jpg" || file_ext === "jpeg" || file_ext === "gif" || file_ext === "png" || file_ext === "tiff") {
              prevURL = `https://i-press-backend-production.up.railway.app/files/getContent/${contID}.${file_ext}/big`;
                HTMLString = `<div class="preview-box bg-img-setting" style="background-image: url('${prevURL}');"></div>`;
          }
          else if(file_ext === "mp3" || file_ext === "mp4" || file_ext === "mpeg") {
            prevURL = `https://i-press-backend-production.up.railway.app/files/getContent/${contID}.${file_ext}/big`;
            HTMLString = `<div class="preview-box"><video playbackRate=1.4 loop muted playsinline preload="metadata" oncontextmenu="return false"><source src="${prevURL}" type="video/mp4"></video></div>`;
    }
                prev.innerHTML = HTMLString;
    }

    document.getElementById("show_modal").addEventListener("click", showModal);
    document.getElementById("share").addEventListener("click", handleShare);