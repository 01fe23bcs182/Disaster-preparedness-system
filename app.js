'use strict';

// Firebase config
// Your Firebase config (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyDltjsOUXO9APY-2d5QvJFd2iyCsA2iREc",
  authDomain: "disaster-preparedness-sy-6b6fe.firebaseapp.com",
  projectId: "disaster-preparedness-sy-6b6fe",
  storageBucket: "disaster-preparedness-sy-6b6fe.appspot.com",
  messagingSenderId: "760849452390",
  appId: "1:760849452390:web:453f13c470286c01240ca7",
  measurementId: "G-8X9D8DXSJ1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


function by(id){ return document.getElementById(id); }

// Save student login to Firestore
function saveUser(user){
  db.collection('users').doc(user.id).set(user);
}

// Save drill response to Firestore
function saveResponse(resp){
  db.collection('responses').add(resp);
}

// Login page
function initLogin(){
  const form = by('loginForm');
  if(!form) return;
  form.addEventListener('submit', ev=>{
    ev.preventDefault();
    const fm = new FormData(form);
    const role = fm.get('role');
    const name = fm.get('name');
    const cls = fm.get('cls') || '';
    const roll = fm.get('roll') || '';
    const user = { id:'u-'+Date.now(), role, name, cls, roll };
    localStorage.setItem('user', JSON.stringify(user));
    saveUser(user);
    if(role==='student') location.href='student.html';
    else if(role==='teacher') location.href='teacher.html';
    else location.href='admin.html';
  });
}

// Student page
function initStudent(){
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user) { location.href='login.html'; return; }
  by('greetStudent').innerText = `${user.name} — ${user.cls}`;
  // Load leaderboard
  db.collection('responses').where('cls','==',user.cls).onSnapshot(snapshot=>{
    let scores = {};
    snapshot.forEach(doc=>{
      const d = doc.data();
      if(!scores[d.name]) scores[d.name]=0;
      scores[d.name]++;
    });
    let html='<table><tr><th>Student</th><th>Points</th></tr>';
    for(const s in scores) html+=`<tr><td>${s}</td><td>${scores[s]}</td></tr>`;
    html+='</table>';
    by('leaderboard').innerHTML = html;
  });
}

// Teacher page
function initTeacher(){
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user) { location.href='login.html'; return; }
  by('greetTeacher').innerText = `${user.name} — Teacher`;
  // Show student submissions
  db.collection('responses').onSnapshot(snapshot=>{
    let html='<ul>';
    snapshot.forEach(doc=>{ const d=doc.data(); html+=`<li>${d.name} (${d.cls}): ${d.drill || 'No drill'}</li>`; });
    html+='</ul>';
    by('reportList').innerHTML = html;
  });
}
