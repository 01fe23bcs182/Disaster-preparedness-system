const logoutBtn = document.getElementById('logout');
const startDrillBtn = document.getElementById('start-drill');
const studentStatusList = document.getElementById('student-status');

logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = '../index.html';
  });
});

startDrillBtn.addEventListener('click', () => {
  db.collection('drills').doc('current').set({active: true});
  alert('Drill started!');
});

// Show student status
db.collection('drills').doc('current')
.onSnapshot((doc) => {
  if(doc.exists){
    studentStatusList.innerHTML = '';
    const data = doc.data();
    for(const uid in data){
      if(uid !== 'active'){
        const li = document.createElement('li');
        li.textContent = uid + ': ' + data[uid];
        studentStatusList.appendChild(li);
      }
    }
  }
});
