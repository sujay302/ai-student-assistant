import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyDfQN2ACyIMUwR7erB1zDPaf_2RMNJkUAg",
    authDomain: "ai-assistant-281b4.firebaseapp.com",
    projectId: "ai-assistant-281b4",
    storageBucket: "ai-assistant-281b4.appspot.com",
    messagingSenderId: "495654908257",
    appId: "1:495654908257:web:9f19cc1a5deca3213f5520"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const authWrapper = document.getElementById('auth-ui-wrapper');

// --- Auth State Monitor ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        authWrapper.innerHTML = `
            <div class="profile-container" onclick="document.getElementById('profilePopup').classList.toggle('active')">
                <img src="${user.photoURL || 'image/user-icon.png'}" class="profile-circle">
                <div class="profile-popup" id="profilePopup">
                    <p><strong>${user.displayName || 'Student'}</strong></p>
                    <button onclick="handleLogout()">Logout</button>
                </div>
            </div>`;
    } else {
        authWrapper.innerHTML = `<button class="btn-login" onclick="openModal()">Login</button>`;
    }
});

// --- Floating Pomodoro Logic ---
let timer;
let timeLeft = 1500;
let isRunning = false;
let sessions = 0;

window.activateFloatingTimer = () => { document.getElementById('floating-timer').classList.remove('hidden'); };
window.toggleMinimize = () => { document.getElementById('timerBody').classList.toggle('hidden'); };

window.startTimer = () => {
    if (isRunning) return;
    isRunning = true;
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('pauseBtn').classList.remove('hidden');
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            sessions++;
            document.getElementById('sessionCount').innerText = sessions;
            document.getElementById('alarmSound').play();
            alert("Focus Session Complete! Take a break.");
            resetTimer();
        }
    }, 1000);
};

window.pauseTimer = () => {
    clearInterval(timer);
    isRunning = false;
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
};

window.resetTimer = () => { pauseTimer(); timeLeft = 1500; updateDisplay(); };

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- Auth Functions ---
window.openModal = () => document.getElementById('authModal').classList.add('active');
window.closeModal = () => document.getElementById('authModal').classList.remove('active');
window.loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(() => closeModal()).catch(err => alert(err.message));
};
window.handleLogout = () => signOut(auth).then(() => location.reload());

// Loader Logic
window.addEventListener('load', () => { document.getElementById('loader').style.display = 'none'; });