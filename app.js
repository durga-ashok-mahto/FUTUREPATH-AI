/* ==========================================
   FuturePath AI - Login UI Interactivity
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const emailSuccessIcon = document.getElementById('email-success-icon');
  
  const passwordToggle = document.getElementById('passwordToggle');
  const eyeIconShow = document.getElementById('eyeIconShow');
  const eyeIconHide = document.getElementById('eyeIconHide');
  
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnText = submitBtn.querySelector('.btn-text');
  
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const signUpLink = document.getElementById('signUpLink');
  const toastContainer = document.getElementById('toastContainer');

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /* ==========================================
     Password Show/Hide Toggle
     ========================================== */
  passwordToggle.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    
    // Toggle type
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    
    // Toggle icons
    if (isPassword) {
      eyeIconShow.style.display = 'none';
      eyeIconHide.style.display = 'block';
      passwordToggle.setAttribute('aria-label', 'Hide password');
    } else {
      eyeIconShow.style.display = 'block';
      eyeIconHide.style.display = 'none';
      passwordToggle.setAttribute('aria-label', 'Show password');
    }
    
    // Focus back to input
    passwordInput.focus();
  });

  /* ==========================================
     Validation Functions
     ========================================== */
  function validateEmail() {
    const emailVal = emailInput.value.trim();
    
    if (emailVal === '') {
      setError(emailInput, emailError, 'Email address is required');
      emailSuccessIcon.style.display = 'none';
      return false;
    } else if (!emailRegex.test(emailVal)) {
      setError(emailInput, emailError, 'Please enter a valid email address');
      emailSuccessIcon.style.display = 'none';
      return false;
    } else {
      setSuccess(emailInput, emailError);
      emailSuccessIcon.style.display = 'flex';
      return true;
    }
  }

  function validatePassword() {
    const passwordVal = passwordInput.value;
    
    if (passwordVal === '') {
      setError(passwordInput, passwordError, 'Password is required');
      return false;
    } else if (passwordVal.length < 6) {
      setError(passwordInput, passwordError, 'Password must be at least 6 characters');
      return false;
    } else {
      setSuccess(passwordInput, passwordError);
      return true;
    }
  }

  function setError(inputElement, errorElement, message) {
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function setSuccess(inputElement, errorElement) {
    inputElement.classList.add('is-valid');
    inputElement.classList.remove('is-invalid');
    errorElement.style.display = 'none';
  }

  // Real-time listener checks
  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', validatePassword);
  
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);

  submitBtn.addEventListener('click', (e) => {
    if (submitBtn.disabled) return;
    createRipple(e, submitBtn);
  });

  /* ==========================================
     Google Social Login Simulation
     ========================================== */
  googleLoginBtn.addEventListener('click', (e) => {
    if (googleLoginBtn.disabled || submitBtn.disabled) return;

    // Simulate OAuth loading
    googleLoginBtn.disabled = true;
    submitBtn.disabled = true;
    emailInput.disabled = true;
    passwordInput.disabled = true;
    
    const originalText = googleLoginBtn.querySelector('span').textContent;
    googleLoginBtn.querySelector('span').textContent = 'Connecting to Google...';
    googleLoginBtn.style.opacity = '0.8';

    showToast('Opening Google authentication window...', 'success');

    setTimeout(() => {
      // Re-enable
      googleLoginBtn.disabled = false;
      submitBtn.disabled = false;
      emailInput.disabled = false;
      passwordInput.disabled = false;
      googleLoginBtn.querySelector('span').textContent = originalText;
      googleLoginBtn.style.opacity = '1';

      showToast('Successfully authenticated via Google! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
    }, 2000);
  });

  /* ==========================================
     Form Submission (Simulated API Call)
     ========================================== */
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Trigger validation
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      showToast('Please correct the validation errors in the form.', 'error');
      return;
    }

    const emailVal = emailInput.value.trim();

    // Simulate login state
    submitBtn.disabled = true;
    googleLoginBtn.disabled = true;
    btnSpinner.style.display = 'block';
    btnText.textContent = 'Verifying Account...';

    // Disable inputs during load
    emailInput.disabled = true;
    passwordInput.disabled = true;

    // Simulate API Response latency
    setTimeout(() => {
      // Re-enable input states
      emailInput.disabled = false;
      passwordInput.disabled = false;
      submitBtn.disabled = false;
      googleLoginBtn.disabled = false;
      btnSpinner.style.display = 'none';
      btnText.textContent = 'Sign In to FuturePath';

      // Check special emails for simulation
      if (emailVal === 'error@futurepath.ai') {
        showToast('Invalid credentials. Please verify your email and password.', 'error');
        passwordInput.classList.add('is-invalid');
        passwordInput.classList.remove('is-valid');
      } else {
        showToast('Successfully logged in! Redirecting to FuturePath AI Dashboard...', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1200);
      }
    }, 1800);
  });

  /* ==========================================
     Static Link Mock Handlers
     ========================================== */
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const emailVal = emailInput.value.trim();

    if (emailVal !== '' && emailRegex.test(emailVal)) {
      showToast(`A secure password reset link has been emailed to: ${emailVal}`, 'success');
    } else {
      showToast('Enter a valid email address first to reset your password.', 'error');
      emailInput.focus();
    }
  });

  signUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('FuturePath AI student registration is launching soon! Keep checking back.', 'success');
  });

});
