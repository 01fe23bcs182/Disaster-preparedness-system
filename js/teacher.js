const startBtn = document.createElement('button');
startBtn.textContent = "Start Drill";
document.body.appendChild(startBtn);

const endBtn = document.createElement('button');
endBtn.textContent = "End Drill";
document.body.appendChild(endBtn);

const statusList = document.getElementById('student-status');

startBtn.onclick = () => alert("Drill started (simulation).");
endBtn.onclick = () => alert("Drill ended and report saved (simulation).");

// You can simulate live student status updates if needed
