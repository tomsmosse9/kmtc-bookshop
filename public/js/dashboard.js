// ========================================
// DASHBOARD PAGE LOGIC
// ========================================

let currentUser = null;
let allFiles = [];

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    currentUser = getUser();
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.fullName;
    }

    // Initialize dashboard
    initDashboard();
    loadUserProfile();
    loadDashboardData();
});

function initDashboard() {
    // Setup sidebar menu
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            switchSection(section);
        });
    });

    // Setup action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            switchSection(section);
        });
    });

    // Setup upload form
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleFileUpload);
    }

    // Setup file search
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchFiles);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchFiles();
            }
        });
    }

    // Setup filters
    const fileTypeFilter = document.getElementById('fileTypeFilter');
    const semesterFilter = document.getElementById('semesterFilter');
    
    if (fileTypeFilter) {
        fileTypeFilter.addEventListener('change', applyFilters);
    }
    if (semesterFilter) {
        semesterFilter.addEventListener('change', applyFilters);
    }

    // Setup file upload drag and drop
    const fileUploadArea = document.querySelector('.file-upload-area');
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', handleDragOver);
        fileUploadArea.addEventListener('dragleave', handleDragLeave);
        fileUploadArea.addEventListener('drop', handleDrop);
        fileUploadArea.addEventListener('click', function() {
            document.getElementById('fileInput').click();
        });
    }

    // Setup delete account button
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', deleteAccount);
    }
}

function switchSection(section) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(s => s.classList.remove('active'));

    // Remove active class from menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    // Show selected section
    const selectedSection = document.getElementById(`${section}-section`);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Set active menu item
    const activeMenuItem = document.querySelector(`[data-section="${section}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }

    // Load section-specific data
    if (section === 'browse') {
        loadFiles();
    }
}

async function loadUserProfile() {
    try {
        const response = await apiRequest('/user-profile');
        
        // Update profile section
        document.getElementById('profileName').textContent = response.fullName;
        document.getElementById('profileStudentId').textContent = response.studentId;
        document.getElementById('profileEmail').textContent = response.email;
        document.getElementById('profileCourse').textContent = response.course;
        document.getElementById('profileCampus').textContent = response.campus;
        
        // Format date
        const date = new Date(response.createdAt);
        document.getElementById('profileMemberSince').textContent = date.toLocaleDateString('en-KE');

        // Update dashboard overview
        document.getElementById('userCourse').textContent = response.course;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadDashboardData() {
    try {
        // Load all files
        const response = await apiRequest('/files');
        allFiles = response;

        // Display recent files
        const recentFiles = allFiles.slice(0, 5);
        displayFilesList(recentFiles, 'recentFiles');

        // Update stats
        updateStats();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateStats() {
    // Total materials
    document.getElementById('totalMaterials').textContent = allFiles.length;

    // Files uploaded by user
    const userUploadedCount = allFiles.filter(f => f.uploadedBy === currentUser.id).length;
    document.getElementById('uploadedFiles').textContent = userUploadedCount;

    // Files downloaded - stored in localStorage
    const downloadCount = localStorage.getItem('downloadCount') || 0;
    document.getElementById('downloadedFiles').textContent = downloadCount;
}

async function loadFiles() {
    try {
        const response = await apiRequest('/files');
        allFiles = response;
        displayFiles(allFiles);
    } catch (error) {
        console.error('Error loading files:', error);
        showMessage('errorMessage', 'Error loading files', 'error');
    }
}

function displayFiles(files) {
    const filesList = document.getElementById('filesList');
    
    if (!files || files.length === 0) {
        filesList.innerHTML = '<p class="loading">No files found</p>';
        return;
    }

    filesList.innerHTML = files.map(file => createFileItemHTML(file)).join('');

    // Add event listeners to file action buttons
    const downloadBtns = filesList.querySelectorAll('.file-btn-download');
    const deleteBtns = filesList.querySelectorAll('.file-btn-delete');

    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadFile(this.dataset.fileId);
        });
    });

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this file?')) {
                deleteFile(this.dataset.fileId);
            }
        });
    });
}

function displayFilesList(files, containerId) {
    const container = document.getElementById(containerId);
    
    if (!files || files.length === 0) {
        container.innerHTML = '<p class="loading">No files available yet</p>';
        return;
    }

    container.innerHTML = files.map(file => createFileItemHTML(file)).join('');

    // Add event listeners
    const downloadBtns = container.querySelectorAll('.file-btn-download');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadFile(this.dataset.fileId);
        });
    });
}

function createFileItemHTML(file) {
    const uploadDate = new Date(file.uploadedAt).toLocaleDateString('en-KE');
    const fileSize = (file.size / 1024 / 1024).toFixed(2);

    return `
        <div class="file-item">
            <div class="file-info">
                <div class="file-name">📄 ${file.originalName}</div>
                <div class="file-meta">
                    <span><strong>Type:</strong> ${file.fileType}</span>
                    <span><strong>Course:</strong> ${file.course}</span>
                    <span><strong>Semester:</strong> ${file.semester}</span>
                    <span><strong>Size:</strong> ${fileSize} MB</span>
                    <span><strong>Shared:</strong> ${uploadDate}</span>
                </div>
                <p style="margin-top: 0.5rem; color: #718096; font-size: 0.9rem;">${file.description}</p>
            </div>
            <div class="file-actions">
                <button class="file-btn file-btn-download" data-file-id="${file.id}">⬇️ Download</button>
                ${currentUser.id === file.uploadedBy ? `<button class="file-btn file-btn-delete" data-file-id="${file.id}">🗑️ Delete</button>` : ''}
            </div>
        </div>
    `;
}

async function downloadFile(fileId) {
    try {
        const response = await fetch(`http://localhost:3000/api/download/${fileId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Download failed');
        }

        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition 
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : 'download';

        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Update download count
        const downloadCount = parseInt(localStorage.getItem('downloadCount') || 0) + 1;
        localStorage.setItem('downloadCount', downloadCount);
        updateStats();

        showMessage('successMessage', 'File downloaded successfully', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showMessage('errorMessage', 'Error downloading file', 'error');
    }
}

async function deleteFile(fileId) {
    try {
        const response = await apiRequest(`/files/${fileId}`, {
            method: 'DELETE'
        });

        // Reload files
        loadFiles();
        updateStats();
        showMessage('successMessage', 'File deleted successfully', 'success');
    } catch (error) {
        console.error('Delete error:', error);
        showMessage('errorMessage', error.message || 'Error deleting file', 'error');
    }
}

async function handleFileUpload(e) {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName').value.trim();
    const fileType = document.getElementById('uploadFileType').value;
    const semester = document.getElementById('uploadSemester').value;
    const description = document.getElementById('description').value.trim();

    // Validation
    if (!fileInput.files.length) {
        showMessage('uploadMessage', 'Please select a file', 'error');
        return;
    }

    if (!fileName) {
        showFieldError('fileName', 'File name is required');
        return;
    }

    if (!fileType) {
        showFieldError('uploadFileType', 'File type is required');
        return;
    }

    if (!semester) {
        showFieldError('uploadSemester', 'Semester is required');
        return;
    }

    if (!description) {
        showFieldError('description', 'Description is required');
        return;
    }

    // Check file size (50MB max)
    const file = fileInput.files[0];
    if (file.size > 50 * 1024 * 1024) {
        showMessage('uploadMessage', 'File size exceeds 50MB limit', 'error');
        return;
    }

    try {
        // Show loading state
        const submitBtn = document.querySelector('#uploadForm button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading...';

        // Prepare form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);
        formData.append('description', description);
        formData.append('course', currentUser.course);
        formData.append('semester', semester);

        // Send upload request
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }

        const result = await response.json();

        // Success
        showMessage('uploadMessage', 'File uploaded successfully!', 'success');
        document.getElementById('uploadForm').reset();

        // Reload files
        setTimeout(() => {
            loadDashboardData();
            switchSection('browse');
        }, 1000);

    } catch (error) {
        showMessage('uploadMessage', error.message || 'Error uploading file', 'error');
    } finally {
        // Re-enable submit button
        const submitBtn = document.querySelector('#uploadForm button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload File';
    }
}

function applyFilters() {
    const fileType = document.getElementById('fileTypeFilter').value;
    const semester = document.getElementById('semesterFilter').value;

    let filtered = allFiles;

    if (fileType) {
        filtered = filtered.filter(f => f.fileType === fileType);
    }

    if (semester) {
        filtered = filtered.filter(f => f.semester === semester);
    }

    displayFiles(filtered);
}

async function searchFiles() {
    const searchTerm = document.getElementById('searchInput').value.trim();

    if (!searchTerm) {
        loadFiles();
        return;
    }

    try {
        const response = await apiRequest(`/search?q=${encodeURIComponent(searchTerm)}`);
        displayFiles(response);
    } catch (error) {
        console.error('Search error:', error);
        showMessage('errorMessage', 'Search failed', 'error');
    }
}

async function deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }

    if (!confirm('This will permanently delete your account and all associated data. Are you absolutely sure?')) {
        return;
    }

    try {
        clearToken();
        clearUser();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Delete account error:', error);
        showMessage('errorMessage', 'Error deleting account', 'error');
    }
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.backgroundColor = 'rgba(44, 82, 130, 0.1)';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.backgroundColor = '';
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.backgroundColor = '';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('fileInput').files = files;
    }
}
