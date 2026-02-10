// ========================================
// LOGIN PAGE LOGIC
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Clear errors on input
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                clearFieldError(this.name);
            });
        });
    }

    // Load remembered student ID if exists
    const rememberedId = localStorage.getItem('rememberedStudentId');
    if (rememberedId) {
        const studentIdInput = document.getElementById('studentId');
        const rememberMeCheckbox = document.getElementById('rememberMe');
        if (studentIdInput) {
            studentIdInput.value = rememberedId;
        }
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }
});

async function handleLogin(e) {
    e.preventDefault();

    // Get form values
    const studentId = document.getElementById('studentId').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Clear previous errors
    clearAllErrors();

    // Validation
    let hasErrors = false;

    if (!studentId) {
        showFieldError('studentId', 'Student ID is required');
        hasErrors = true;
    }

    if (!password) {
        showFieldError('password', 'Password is required');
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    try {
        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        // Send login request
        const response = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({
                studentId,
                password
            })
        });

        // Login successful
        setToken(response.token);
        setUser(response.user);

        // Remember student ID if checked
        if (rememberMe) {
            localStorage.setItem('rememberedStudentId', studentId);
        } else {
            localStorage.removeItem('rememberedStudentId');
        }

        showMessage('successMessage', 'Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        // Re-enable submit button
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login to Account';

        // Show error message
        if (error.message.includes('Invalid credentials')) {
            showMessage('errorMessage', 'Invalid student ID or password. Please try again.', 'error');
        } else {
            showMessage('errorMessage', error.message || 'Login failed. Please try again.', 'error');
        }
    }
}

function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });

    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });

    const msgElements = document.querySelectorAll('.message');
    msgElements.forEach(msg => {
        msg.classList.remove('show');
    });
}
