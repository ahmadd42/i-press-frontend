  if(!localStorage.getItem("userId"))  
    window.location.href = "/";
  else if(window.innerWidth >= 800) 
    window.location.href = "share.html";

  const menu_btn = document.getElementById("menu-btn");
  const side_nav = document.getElementById("side-nav");
  const user_file = document.getElementById("user-file");
  const upload_btn = document.getElementById("upload");
  const p_bar = document.getElementById("bar-container");
  const cat = document.getElementById("cat");
  const title = document.getElementById("title");
  const desc = document.getElementById("desc");
  const dld_yes = document.getElementById("dld_yes");
  const dld_no = document.getElementById("dld_no");
  const author = document.getElementById("author");
  const share_btn = document.getElementById("share");
  const bar_con = document.getElementById("bar-container");
  const token = localStorage.getItem("loginToken");

  var conID = ""; 
  var file_ext = "";


  async function handleUpload() {
  const file = user_file.files[0];

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
//loadFilePreview(conID);
//prev.style.opacity = 0;

  } catch(err) {
    console.log("Error uploading data: ", err);
    }
}


async function handleShare() {

if(title.value === "" || desc.value === "" || author.value === "") {
  alert("Please enter information for all fields");
  return;
}

  const title_inp = document.getElementById("title").value;
  const desc_inp = document.getElementById("desc").value;
  const dldyes = document.getElementById("dld_yes");
  const dldno = document.getElementById("dld_no");
  const dld_inp = dldyes.checked ? '1' : '0';
  const author_inp = document.getElementById("author").value;
  const cat_inp = document.getElementById("cat").value;

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

    if (res.status === 200) {
      document.getElementById("link").innerText = "/view?id=" + conID;
      document.getElementById("success_msg").classList.add("active");
      conID = "";
      file_ext = "";
    } else {
      alert("Server error, try again later.");
    }
  }

      user_file.addEventListener('change', function(event) {
        const selectedFiles = event.target.files; // FileList object
        
        if (selectedFiles.length > 0) {
        file_ext = selectedFiles[0].name.split('.').pop();
        upload_btn.disabled = false;

        } else {
            upload_btn.disabled = true;
        }
    });

  async function upload_clicked() {
  user_file.disabled = true;
  upload_btn.disabled = true;

  bar_con.style.opacity = 1;
  await handleUpload();
  bar_con.style.opacity = 0;

  cat.disabled = false;
  title.disabled = false;
  desc.disabled = false;
  dld_no.disabled = false;
  dld_yes.disabled = false;
  author.disabled = false;
  share_btn.disabled = false;

  }

upload_btn.addEventListener("click", upload_clicked);

document.getElementById("posted").addEventListener("click", () => {
  window.location.href = "/";
});

document.getElementById("share").addEventListener("click", handleShare);

  menu_btn.addEventListener("click", () => {
    side_nav.classList.toggle("active");
  });
