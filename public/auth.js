if(typeof window !== 'undefined') {
// Get elements
const signinBtn = document.getElementById('signin-btn');
const signupBtn = document.getElementById('signup-btn');
const signinDiv = document.getElementById('signin-div');
const signupDiv = document.getElementById('signup-div');
const signUpForm = document.getElementById('signUpForm');
const signInForm = document.getElementById('signInForm');
const signinToSignup = document.getElementById('signin-to-signup');
const signupToSignin = document.getElementById('signup-to-signin');
const navLoginDiv = document.getElementById('nav-login');


let isLoggedIn = false;
isLoggedIn = sessionStorage.getItem('isLoggedIn');

if (signinBtn) {
    signinBtn.addEventListener('click', () => {
        signinDiv.style.display = 'block';
        signupDiv.style.display = 'none';
        signinBtn.classList.add('active');
        signupBtn.classList.remove('active');
    });
}
document.addEventListener('DOMContentLoaded', isUserLoggedIn());

function isUserLoggedIn() {
    console.log("Is user logged in? ", isLoggedIn);
    if (isLoggedIn) {
        console.log("User is logged in - updating nav");
        navLoginDiv.innerHTML = `<p>Welcome back, ${sessionStorage.getItem('email')}</p>`;
    }
}

if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        signinDiv.style.display = 'none';
        signupDiv.style.display = 'block';
        signinBtn.classList.remove('active');
        signupBtn.classList.add('active');
    });
}


// Quick links between forms
if (signinToSignup) {
    signinToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        signupBtn.click();
    });
}

if (signupToSignin) {
    signupToSignin.addEventListener('click', (e) => {
        e.preventDefault();
        signinBtn.click();
    });
}


// Handle sign up form submission
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const fullName = document.getElementById('signup-name').value;

    console.log("User details: ", fullName, email, password, confirmPassword);
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    // connect it to the server.js endpoint for signup
    try {
        const response = await fetch('/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName })
        });
        const data = await response.json();
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Sign up successful! Please check your email to confirm your account.');
            signinBtn.click();
        }
    } catch (error) {
        console.error('Error during sign up:', error);
        alert('An error occurred during sign up. Please try again later.');
    }
});

// Handle sign in form submission
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    try {
        const response = await fetch('/log-in-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Sign in successful!');
            console.log(data);

        }
        if (data.message === 'Sign in successful') {
            console.log("User is logged in");
            sessionStorage.setItem('isLoggedIn', true);
            sessionStorage.setItem('email', email);
            isUserLoggedIn();
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error during sign in:', error);
        alert('An error occurred during sign in. Please try again later.', error);
    }
});
}