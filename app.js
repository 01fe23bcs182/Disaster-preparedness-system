'use strict';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDltjsOUXO9APY-2d5QvJFd2iyCsA2iREc",
  authDomain: "disaster-preparedness-sy-6b6fe.firebaseapp.com",
  projectId: "disaster-preparedness-sy-6b6fe",
  storageBucket: "disaster-preparedness-sy-6b6fe.appspot.com",
  messagingSenderId: "760849452390",
  appId: "1:760849452390:web:453f13c470286c01240ca7",
  measurementId: "G-8X9D8DXSJ1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ----------------- Login -----------------
function initLogin(){
  const form = document.getElementById('loginForm');
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
    db.collection('users').doc(user.id).set(user);

    if(role==='student') location.href='student.html';
    else if(role==='teacher') location.href='teacher.html';
    else location.href='admin.html';
  });
}

// ----------------- Student -----------------
function initStudent(){
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user || user.role!=='student'){ location.href='login.html'; return; }
  document.getElementById('greetStudent').innerText = `${user.name} — ${user.cls}`;

  const alertBox = document.getElementById('alertBox');
  db.collection('drills')
    .where('cls','in',[user.cls,'ALL'])
    .onSnapshot(snapshot=>{
      let html='No active drills';
      snapshot.forEach(doc=>{
        const drill = doc.data();
        html = `<div class="card"><strong>${drill.type}</strong>: ${drill.message || ''}</div>`;
      });
      alertBox.innerHTML = html;
    });

  const leaderboard = document.getElementById('leaderboard');
  db.collection('responses')
    .where('cls','==',user.cls)
    .onSnapshot(snapshot=>{
      const scores = {};
      snapshot.forEach(doc=>{
        const r = doc.data();
        scores[r.name] = (scores[r.name] || 0) + 1;
      });
      let html='<table><tr><th>Student</th><th>Points</th></tr>';
      for(const s in scores) html+=`<tr><td>${s}</td><td>${scores[s]}</td></tr>`;
      html+='</table>';
      leaderboard.innerHTML = html;
    });
}

// ----------------- Teacher -----------------
function initTeacher(){
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user || user.role!=='teacher'){ location.href='login.html'; return; }
  document.getElementById('greetTeacher').innerText = `${user.name} — Teacher`;

  const form = document.getElementById('startDrillForm');
  const reportList = document.getElementById('reportList');

  form.addEventListener('submit', ev=>{
    ev.preventDefault();
    const fm = new FormData(form);
    const type = fm.get('type');
    const cls = fm.get('cls') || 'ALL';
    const message = fm.get('message') || type;
    const drill = { id:'d-'+Date.now(), type, cls, message, time: Date.now() };
    db.collection('drills').doc(drill.id).set(drill);
  });

  db.collection('responses').onSnapshot(snapshot=>{
    let html='<ul>';
    snapshot.forEach(doc=>{
      const r = doc.data();
      html += `<li>${r.name} (${r.cls}) responded to ${r.drill}</li>`;
    });
    html += '</ul>';
    reportList.innerHTML = html;
  });
}
