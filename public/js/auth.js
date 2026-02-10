// ========================================
// AUTHENTICATION UTILITY FUNCTIONS
// ========================================

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Token Management
function setToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function clearToken() {
    localStorage.removeItem('token');
}

function isAuthenticated() {
    return !!getToken();
}

// User Management
function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function clearUser() {
    localStorage.removeItem('user');
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Add token to headers if authenticated
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// Show Message
function showMessage(elementId, message, type = 'success') {
    const msgElement = document.getElementById(elementId);
    if (msgElement) {
        msgElement.textContent = message;
        msgElement.className = `message ${type} show`;
        
        if (type === 'success') {
            setTimeout(() => {
                msgElement.classList.remove('show');
            }, 5000);
        }
    }
}

// Show Error in Form Field
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    if (inputElement) {
        inputElement.style.borderColor = '#e53e3e';
    }
}

// Clear Field Error
function clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    if (inputElement) {
        inputElement.style.borderColor = '';
    }
}

// Check Authentication on Page Load
function checkAuthOnPageLoad() {
    const currentPath = window.location.pathname;
    
    // Pages that require authentication
    const protectedPages = ['/dashboard.html'];
    
    // Pages that should redirect if authenticated
    const guestPages = ['/login.html', '/register.html'];

    const isProtectedPage = protectedPages.some(page => currentPath.includes(page));
    const isGuestPage = guestPages.some(page => currentPath.includes(page));

    if (isProtectedPage && !isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    if (isGuestPage && isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }
}

// Logout
function logout() {
    clearToken();
    clearUser();
    window.location.href = 'index.html';
}

// Run check on page load
document.addEventListener('DOMContentLoaded', checkAuthOnPageLoad);

// Setup logout button if it exists
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// Display user name in navbar if authenticated
const userNameElement = document.querySelector('.user-name');
if (userNameElement && isAuthenticated()) {
    const user = getUser();
    if (user) {
        userNameElement.textContent = user.fullName || user.studentId;
    }
}
