const logoutBtn = document.getElementById('logout');
const imSafeBtn = document.getElementById('im-safe');

logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = '../index.html';
  });
});

// Respond to drill
if(imSafeBtn){
imSafeBtn.addEventListener('click', () => {
  const user = auth.currentUser;
  if(user){
    db.collection('drills').doc('current').set({
      [user.uid]: 'safe'
    }, {merge: true});
    alert('Your status has been recorded!');
  }
});
}

// Listen for drills
db.collection('drills').doc('current')
.onSnapshot((doc) => {
  if(doc.exists){
    console.log('Drill active');
    // You can add popup/notification
  }
});

