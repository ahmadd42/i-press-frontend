const screen = (window.innerWidth < 1000) ? "small" : "big";
const logout = document.getElementById("logout");
const share_btn = document.getElementById("share_btn");
const container = document.getElementById('doc-panel');
const search_box = document.getElementById("search_box");
const search_btn = document.getElementById("search_btn");


function getElapsedTime(GivenDatetime) {

var msg = "";
const now = new Date();
const givenDate = new Date(GivenDatetime);  // your given date-time

const diffMs = now - givenDate;  // difference in milliseconds

// Convert milliseconds to more useful units:
const diffSeconds = Math.floor(diffMs / 1000);
const diffMinutes = Math.floor(diffMs / (1000 * 60));
const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
const diffYears = (diffMonths / 12).toFixed(1);

if(diffMinutes <= 60) { msg = diffMinutes + " minute" + (diffMinutes > 1 ? "s" : "") + " ago"; }
else if(diffHours <= 24) { msg = diffHours + " hour" + (diffHours > 1 ? "s" : "") + " ago"; }
else if(diffDays <= 30) { msg = diffDays + " day" + (diffDays > 1 ? "s" : "") + " ago"; }
else if(diffMonths <= 12) { msg = diffMonths + " month" + (diffMonths > 1 ? "s" : "") + " ago"; }
else { msg = diffYears + " year" + (diffYears > 1 ? "s" : "") + " ago"; }

return msg;

}

function loadFeeds() {

if(screen === "big") {
  window.location.href = "index.html";
}

getSigninStatus();
fetchFeeds();
}

function goShare() {
    if(localStorage.getItem("loginToken"))  {
    if(window.innerWidth < 800)
      window.location.href = "users/share-s.html";
    else
      window.location.href = "users/share.html";
  }
}

async function fetchFeeds() {
  
  try {
//    const response = await fetch("http://192.168.100.99:3000/files/getfeeds", {      
    const response = await fetch("https://i-press-backend-production.up.railway.app/files/getfeeds", {      

    method: "POST",
      });

  if (!response.ok) {
    throw new Error("Sorry ! Could not fetch your feeds.");
      }

  const data = await response.json(); // JSONPlaceholder returns an array
  renderContentFeeds(data);
    
  }
catch (error) {
        //alert(error);
        console.log("Error fetching data:", error);
        document.getElementById("doc-panel").innerHTML = "<div class=\"error-div\">Couldn't fetch your feeds</div>";
        }        
    }

async function handleSearch() {

  if(search_box.value != "") {
    container.innerHTML = "";

  try {
//    const response = await fetch("http://192.168.100.99:3000/files/getfeeds", {      
    const response = await fetch("https://i-press-backend-production.up.railway.app/files/searchkeyword", {      
    method: "POST",
    headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify({keyword: search_box.value})
      });

      if(response.status === 400) { /// If keyword search returned nothing, fetch the regular feeds
        fetchFeeds();
      }
      else {
      const data = await response.json(); // JSONPlaceholder returns an array
      renderContentFeeds(data);  
      }
  }
catch (error) {
        //alert(error);
        console.log("Error fetching data:", error);
        document.getElementById("doc-panel").innerHTML = `<div class=\"error-div\">Couldn't fetch your feeds. ${error}</div>`;
        }        
      }
    }

function renderContentFeeds(feedsData) {

  for(let record of feedsData) {
    const elapsedTime = getElapsedTime(record.shared_on);
    const isTruncated = record.descr.length > 150;
    const shortText = record.descr.slice(0, 150);
    //const conURL = `http://192.168.100.99:3000/files/getContent/${record.ContentID}${record.Extension}/${screen}`
    //const conURL = `https://i-press-backend-production.up.railway.app/files/getContent/${record.ContentID}${record.Extension}/${screen}`;
    const conURL = `https://preview.gopress.online/preview/${record.content_id}${record.extension}`;

  const div = document.createElement('div');
  div.className = (screen === "big") ? 'doc-item' : 'doc-item-mobile';
  var HTMLString = '';

          if(record.extension === ".pdf") {
          //let prevURL = `http://192.168.100.99:3000/files/getContent/${record.ContentID}.jpg/${screen}`;
          //let prevURL = `https://i-press-backend-production.up.railway.app/files/getContent/${record.ContentID}.jpg/${screen}`;
          let prevURL = `https://preview.gopress.online/preview/${record.content_id}.jpg`;

          HTMLString += (screen === "big") 
                        ? `<div class="doc-img"><div class="username"><p class="grid-text uploader">PDF Document</p></div><div class="content-icon bg-img-setting" style="background-image: url('${prevURL}');"></div>` 
                        : `<div class="doc-img-mobile"><div class="username"><p class="grid-text uploader">PDF Document</p></div><div class="content-icon-mobile bg-img-setting" style="background-image: url('${prevURL}');"></div>`;
        }
          else if(record.extension === ".jpg" || record.extension === ".jpeg" || record.extension === ".gif" || record.extension === ".png" || record.extension === ".tiff") {
                HTMLString += (screen === "big") 
                              ? `<div class="doc-img"><div class="username"><p class="grid-text uploader">Image</p></div><div class="content-icon bg-img-setting" style="background-image: url('${conURL}');"></div>` 
                              : `<div class="doc-img-mobile"><div class="username"><p class="grid-text uploader">Image</p></div><div class="content-icon-mobile bg-img-setting" style="background-image: url('${conURL}');"></div>`;
          }
          else if(record.extension === ".mp3" || record.extension === ".mp4" || record.extension === ".mpeg") {
            //const prevURL = `http://192.168.100.99:3000/files/getContent/${record.ContentID}${record.Extension}/${screen}`;
            const prevURL = `https://i-press-backend-production.up.railway.app/files/getContent/${record.content_id}${record.extension}/${screen}`;

            HTMLString += (screen === "big")
                          ? `<div class="video-prev-container"><div class="username"><p class="grid-text uploader">MP4 Video</p></div><div class="video-prev"><video class="inline-video" playbackRate=1.4 loop muted playsinline preload="metadata" oncontextmenu="return false"><source src="${prevURL}" type="video/mp4"></video></div>`
                          : `<div class="video-prev-container-mobile"><div class="username"><p class="grid-text uploader">MP4 Video</p></div><div class="video-prev-mobile"><video class="inline-video" playbackRate=1.4 loop muted playsinline preload="metadata" oncontextmenu="return false"><source src="${prevURL}" type="video/mp4"></video></div>`;  
          }
          HTMLString += `<div class="username"><p class="grid-text uploader">${record.user_id}</p></div></div>`;

        if(record.extension === ".mp3" || record.extension === ".mp4" || record.extension === ".mpeg") {        
          HTMLString += `<div class="video-desc">`;
          }
          else {
          HTMLString += `<div class="doc-desc">`;
          }
          HTMLString += `<div><a href="view?id=${record.content_id}"><p class="grid-text title"><b>${record.title}</b></p></a></div>
            <div><span class="descr">
            ${isTruncated ? shortText + '...' : record.descr}
              </span></div>
          <div><p class="grid-text"><b>Author: </b>${record.author}</p></div>
          <div><p class="grid-text"><b>Shared: </b>${elapsedTime}</p></div>
        </div>`

        div.innerHTML = HTMLString;
          
  /// Code to play video preview on mouse over
//const previewVideo = (screen === "big") ? div.querySelector(".video-prev") : div.querySelector(".video-prev-mobile");
const previewVideo = div.querySelector(".inline-video");

if(previewVideo) {

previewVideo.playbackRate = 1.5;
let lastTime = 0; // store the last playback position

// On hover → start playing preview from last stopped time
previewVideo.parentElement.addEventListener("mouseenter", () => {
  previewVideo.currentTime = lastTime;
  //previewVideo.loop = true;
  previewVideo.play().catch(console.error);
});

// On mouse leave → pause and remember last stopped frame
previewVideo.parentElement.addEventListener("mouseleave", () => {
  lastTime = previewVideo.currentTime; // save position
  previewVideo.pause();
  previewVideo.currentTime = 0;
});
}

  container.appendChild(div);

    }
}    

function getSigninStatus() {
  const profile_area = document.getElementById("profile");
  const display_name = localStorage.getItem("displayName");
  if (display_name) {
    profile_area.className = "me";
    profile_area.innerHTML = `<button id="profile_btn">Me</button>`;
    document.getElementById("disp_name").innerHTML = display_name;  
  }
  else {
    if(screen === "big") profile_area.className = "signin"; else profile_area.className = "profile-mobile";
    profile_area.innerHTML = `<a href="users/login.html">Sign in or create your account to get personalized feeds, and to upload and engage with the content</a>`;
  }
}

function signOut() {
  localStorage.clear();
  document.getElementById("top-menu").style.opacity = 0;
  getSigninStatus();
}    

async function resourceExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (err) {
    return false;
  }
}

window.onclick = function(event) {
  const profile_area = document.getElementById("profile");
  profile_btn = document.getElementById("profile_btn");
  topmenu = document.getElementById("top-menu");
  const menu_btn = document.getElementById("menu-btn");
  const side_nav = document.getElementById("side-nav");

  if(menu_btn && event.target === menu_btn) {
//    if(side_nav.style.display === "none") side_nav.style.display = "block"; else side_nav.style.display = "none";
side_nav.classList.toggle("active");
  }
  else if (event.target === profile_area || event.target === profile_btn ) {
    topmenu.style.opacity = 1;
  }
  else if(topmenu.style.opacity == 1) {
    topmenu.style.opacity = 0;
  }
};

window.addEventListener("storage", function (event) {
document.getElementById("top-menu").style.opacity = 0;  
getSigninStatus();
});

window.addEventListener("DOMContentLoaded", loadFeeds);
logout.addEventListener("click", signOut);
share_btn.addEventListener("click", goShare);
search_btn.addEventListener("click", handleSearch);
search_box.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    handleSearch();
  }
});