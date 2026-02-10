// ========================================
// REGISTRATION PAGE LOGIC
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
        
        // Clear errors on input
        const inputs = registerForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                clearFieldError(this.name);
            });
        });
    }
});

async function handleRegistration(e) {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value;
    const level = document.getElementById('level').value;
    const campus = document.getElementById('campus').value;
    const semester = document.getElementById('semester').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms').checked;

    // Clear all previous errors
    clearAllErrors();

    // Validation
    let hasErrors = false;

    if (!fullName) {
        showFieldError('fullName', 'Full name is required');
        hasErrors = true;
    } else if (fullName.length < 3) {
        showFieldError('fullName', 'Full name must be at least 3 characters');
        hasErrors = true;
    }

    if (!studentId) {
        showFieldError('studentId', 'Student ID is required');
        hasErrors = true;
    } else if (studentId.length < 4) {
        showFieldError('studentId', 'Invalid student ID format');
        hasErrors = true;
    }

    if (!email) {
        showFieldError('email', 'Email is required');
        hasErrors = true;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        hasErrors = true;
    }

    if (!course) {
        showFieldError('course', 'Please select a course');
        hasErrors = true;
    }

    if (!level) {
        showFieldError('level', 'Please select a program level');
        hasErrors = true;
    }

    if (!campus) {
        showFieldError('campus', 'Please select a campus');
        hasErrors = true;
    }

    if (!semester) {
        showFieldError('semester', 'Please select a semester');
        hasErrors = true;
    }

    if (!password) {
        showFieldError('password', 'Password is required');
        hasErrors = true;
    } else if (password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        hasErrors = true;
    }

    if (!confirmPassword) {
        showFieldError('confirmPassword', 'Please confirm your password');
        hasErrors = true;
    } else if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        hasErrors = true;
    }

    if (!termsAccepted) {
        showMessage('errorMessage', 'You must accept the terms and conditions', 'error');
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    // Prepare registration data
    const registrationData = {
        fullName,
        studentId,
        email,
        course: `${course} - ${level}`,
        campus,
        password
    };

    try {
        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        // Send registration request
        const response = await apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify(registrationData)
        });

        // Registration successful
        showMessage('successMessage', 'Registration successful! Redirecting to login...', 'success');
        
        // Reset form
        document.getElementById('registerForm').reset();

        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        showMessage('errorMessage', error.message || 'Registration failed. Please try again.', 'error');
        
        // Re-enable submit button
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });

    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });

    const msgElements = document.querySelectorAll('.message');
    msgElements.forEach(msg => {
        msg.classList.remove('show');
    });
}
