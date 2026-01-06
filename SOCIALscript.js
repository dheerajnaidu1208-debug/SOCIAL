let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")||"{}");
let requests = JSON.parse(localStorage.getItem("requests")||"{}");
let chats = JSON.parse(localStorage.getItem("chats")||"{}");

// Swap auth UI
function swap(){
  document.getElementById("signupUI").style.display =
  document.getElementById("signupUI").style.display==="none" ? "block" : "none";

  document.getElementById("loginUI").style.display =
  document.getElementById("loginUI").style.display==="none" ? "block" : "none";
}

// Signup
function signup(){
  let u=document.getElementById("suU").value.trim(), p=document.getElementById("suP").value.trim();
  if(!u||!p){alert("Fill all!");return}
  if(users[u]){alert("User exists!");return}
  users[u]=p;
  localStorage.setItem("users",JSON.stringify(users));
  alert("Account Created! Now Login.");
  swap();
}

// Login
function login(){
  let u=document.getElementById("lgU").value.trim(), p=document.getElementById("lgP").value.trim();
  if(users[u]===p){
    localStorage.setItem("currentUser",u);
    location.reload();
  } else alert("Invalid login!");
}

// Logout
function logout(){localStorage.removeItem("currentUser");location.reload()}

// Navigation
function go(pg){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById(pg).style.display="flex";
  if(pg==="chat") loadChat();
}

// Send request
function addFriend(u){
  if(!requests[u]) requests[u]=[];
  if(requests[u].includes(currentUser)){alert("Already sent");return}
  requests[u].push(currentUser);
  localStorage.setItem("requests",JSON.stringify(requests));
  alert("Request sent!");
}

// Accept request
function accept(i){
  let list = requests[currentUser];
  let u = list[i];
  chats[currentUser]=chats[currentUser]||{};
  chats[u]=chats[u]||{};
  chats[currentUser][u]=[];
  chats[u][currentUser]=[];
  list.splice(i,1);
  localStorage.setItem("requests",JSON.stringify(requests));
  localStorage.setItem("chats",JSON.stringify(chats));
  render();
}

// Open chat
function openChat(u){
  localStorage.setItem("chatUser",u);
  go("chat");
  document.getElementById("chatWith").innerText=u;
}

// Load chat
function loadChat(){
  let u = localStorage.getItem("chatUser");
  if(!u) return;
  chats[currentUser]=chats[currentUser]||{};
  chats[currentUser][u]=chats[currentUser][u]||[];
  chats[u]=chats[u]||{};
  chats[u][currentUser]=chats[u][currentUser]||[];

  document.getElementById("chatBox").innerHTML = chats[currentUser][u].map(m=>`<div class='msg ${m.me?"me":"you"}'>${m.text}</div>`).join("");
}

// Send msg
function send(){
  let u=localStorage.getItem("chatUser");
  let t=document.getElementById("msgIn").value.trim();
  if(!t)return;
  chats[currentUser][u].push({text:t,me:true});
  chats[u][currentUser].push({text:t,me:false});
  localStorage.setItem("chats",JSON.stringify(chats));
  document.getElementById("msgIn").value="";
  loadChat();
}

// Render UI
function render(){
  if(!currentUser){document.getElementById("authUI").style.display="flex";return}
  document.getElementById("authUI").style.display="none";
  go("inbox");

  document.getElementById("friends").innerHTML = Object.keys(users).filter(u=>u!==currentUser).map(u=>
    `<div class='friend'><span>${u}</span><button onclick="addFriend('${u}')">Add Friend</button><button onclick="openChat('${u}')">Chat</button></div>`
  ).join("");

  document.getElementById("reqs").innerHTML = (requests[currentUser]||[]).map((u,i)=>
    `<div class='req'><span>${u}</span><button onclick="accept(${i})">Accept</button></div>`
  ).join("");
}

render();
