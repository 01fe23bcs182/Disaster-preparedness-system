// Signup
const signupForm = document.getElementById('signup-form');
if(signupForm){
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;
  const role = document.getElementById('role').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Save user role in Firestore
      db.collection('users').doc(user.uid).set({
        username,
        role
      }).then(() => {
        alert('Signup Successful! Login now.');
        window.location.href = 'index.html';
      });
    })
    .catch((error) => {
      alert(error.message);
    });
});
}

// Login
const loginForm = document.getElementById('login-form');
if(loginForm){
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Get role from Firestore
      db.collection('users').doc(user.uid).get().then((doc) => {
        if(doc.exists){
          const role = doc.data().role;
          if(role === 'student'){
            window.location.href = 'student/dashboard.html';
          } else {
            window.location.href = 'teacher/dashboard.html';
          }
        }
      });
    })
    .catch((error) => {
      alert(error.message);
    });
});
}

