// Get elements
const signinBtn = document.getElementById('signin-btn');
const signupBtn = document.getElementById('signup-btn');
const signinDiv = document.getElementById('signin-div');
const signupDiv = document.getElementById('signup-div');
const signUpForm = document.getElementById('signUpForm');
const signInForm = document.getElementById('signin-form');
const signinToSignup = document.getElementById('signin-to-signup');
const signupToSignin = document.getElementById('signup-to-signin');

// Toggle between sign in and sign up
signinBtn.addEventListener('click', () => {
    signinDiv.style.display = 'block';
    signupDiv.style.display = 'none';
    signinBtn.classList.add('active');
    signupBtn.classList.remove('active');
});

signupBtn.addEventListener('click', () => {
    signinDiv.style.display = 'none';
    signupDiv.style.display = 'block';
    signinBtn.classList.remove('active');
    signupBtn.classList.add('active');
});

// Quick links between forms
signinToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    signupBtn.click();
});

signupToSignin.addEventListener('click', (e) => {
    e.preventDefault();
    signinBtn.click();
});

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