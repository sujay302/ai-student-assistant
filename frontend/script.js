// =========================================
// 1. LOADER LOGIC
// =========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const content = document.getElementById('main-content');

    // Reduced loading time to 1.5 seconds (1500ms) for better UX
    setTimeout(() => {
        loader.classList.add('loader-hidden');
        
        loader.addEventListener('transitionend', () => {
            loader.style.display = 'none';
        });

        content.classList.add('content-visible');
    }, 500); 
});

// =========================================
// 2. MOBILE MENU TOGGLE
// =========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const icon = hamburger.querySelector('i');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Toggle Icon between Bars and X
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    });
});

// =========================================
// 3. STICKY NAVBAR EFFECT
// =========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    } else {
        navbar.style.boxShadow = "none";
    }
});

// =========================================
// 4. MODAL POPUP & AUTH LOGIC
// =========================================
const modal = document.getElementById('authModal');
const closeBtn = document.getElementById('closeModal');
const loginContainer = document.getElementById('loginContainer');
const signupContainer = document.getElementById('signupContainer');
const modalServiceName = document.getElementById('modalServiceName'); // Note: This element was in previous HTML, if removed ensure code handles null

// --- Open/Close Modal Functions ---
function openModal(mode = 'login') {
    modal.classList.add('active');
    switchAuthMode(mode); // Open in specifically requested mode
}

function closeModal() {
    modal.classList.remove('active');
    // Reset forms when closing
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
}

// --- Toggle Password Visibility (Eye Icon) ---
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// --- Switch between Login and Signup ---
function switchAuthMode(mode) {
    if (mode === 'signup') {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    } else {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }
}

// --- Event Listeners ---
document.getElementById('openLoginBtn').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('login');
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// --- Form Submissions (Simulation) ---

// 1. Handle Login Submit
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = "Authenticating...";
    btn.style.opacity = "0.7";

    setTimeout(() => {
        btn.innerText = "Success!";
        btn.style.backgroundColor = "#10b981";
        
        setTimeout(() => {
            closeModal();
            alert("Login Successful! Welcome back.");
            btn.innerText = originalText;
            btn.style.backgroundColor = ""; 
            btn.style.opacity = "1";
        }, 800);
    }, 1500);
});

// 2. Handle Signup Submit
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    const name = document.getElementById('signupName').value;

    btn.innerText = "Creating Account...";
    btn.style.opacity = "0.7";

    setTimeout(() => {
        btn.innerText = "Account Created!";
        btn.style.backgroundColor = "#10b981";
        
        setTimeout(() => {
            alert(`Welcome ${name}! Your account has been created. Please Login.`);
            switchAuthMode('login'); // Switch to login screen after signup
            btn.innerText = originalText;
            btn.style.backgroundColor = ""; 
            btn.style.opacity = "1";
        }, 1000);
    }, 1500);
});