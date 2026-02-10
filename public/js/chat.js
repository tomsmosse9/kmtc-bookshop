// Group-based Chat Client
(async function () {
  const API = 'http://localhost:3000/api';
  const token = localStorage.getItem('token');

  // Elements
  const groupsListEl = document.getElementById('groupsList');
  const chatMessagesEl = document.getElementById('chatMessages');
  const activeGroupHeader = document.getElementById('activeGroupHeader');
  const currentGroupNameEl = document.getElementById('currentGroupName');
  const groupMemberCountEl = document.getElementById('groupMemberCount');
  const chatComposer = document.getElementById('chatComposer');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatAttachmentsInput = document.getElementById('chatAttachments');
  const attachmentsPreview = document.getElementById('attachmentsPreview');

  // Modals
  const createGroupModal = document.getElementById('createGroupModal');
  const addMemberModal = document.getElementById('addMemberModal');
  const showCreateGroupModalBtn = document.getElementById('showCreateGroupModal');
  const showAddMemberModalBtn = document.getElementById('showAddMemberModal');
  const closeModals = document.querySelectorAll('.close-modal');
  const createGroupForm = document.getElementById('createGroupForm');
  const studentSearchInput = document.getElementById('studentSearchInput');
  const studentSearchResultsEl = document.getElementById('studentSearchResults');

  // State
  let currentGroupId = null;
  let groups = [];
  let pollingInterval = null;
  let searchTimeout = null;

  // Initialization
  if (token) {
    setupEventListeners();
    await loadGroups();
  }

  function setupEventListeners() {
    // Modal toggling
    showCreateGroupModalBtn.onclick = () => createGroupModal.classList.add('show');
    showAddMemberModalBtn.onclick = () => addMemberModal.classList.add('show');

    closeModals.forEach(btn => {
      btn.onclick = () => {
        document.getElementById(btn.dataset.modal).classList.remove('show');
      };
    });

    // Create Group
    createGroupForm.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('newGroupName').value;
      try {
        const res = await fetch(`${API}/groups`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        if (res.ok) {
          createGroupModal.classList.remove('show');
          createGroupForm.reset();
          await loadGroups();
        }
      } catch (err) { console.error(err); }
    };

    // Student Search
    studentSearchInput.oninput = (e) => {
      clearTimeout(searchTimeout);
      const q = e.target.value;
      if (q.length < 2) {
        studentSearchResultsEl.innerHTML = '<p class="hint">Type at least 2 characters</p>';
        return;
      }
      searchTimeout = setTimeout(() => searchStudents(q), 300);
    };

    // Send Message
    chatForm.onsubmit = async (e) => {
      e.preventDefault();
      if (!currentGroupId) return;
      const text = chatInput.value.trim();
      if (!text) return;

      try {
        const res = await fetch(`${API}/groups/${currentGroupId}/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        if (res.ok) {
          chatInput.value = '';
          await loadMessages();
        }
      } catch (err) { console.error(err); }
    };

    // UI Helpers
    document.getElementById('attachBtn').onclick = () => chatAttachmentsInput.click();
  }

  async function loadGroups() {
    try {
      const res = await fetch(`${API}/groups`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      groups = await res.json();
      renderGroups();
    } catch (err) { console.error(err); }
  }

  function renderGroups() {
    groupsListEl.innerHTML = groups.map(g => `
            <div class="group-item ${g.id === currentGroupId ? 'active' : ''}" onclick="switchGroup('${g.id}')">
                ${g.name}
            </div>
        `).join('') || '<p class="hint">No groups yet</p>';
  }

  window.switchGroup = async function (groupId) {
    currentGroupId = groupId;
    const group = groups.find(g => g.id === groupId);

    // Update UI
    currentGroupNameEl.textContent = group.name;
    groupMemberCountEl.textContent = group.isDefault ? 'All students' : `${group.members.length} members`;
    activeGroupHeader.style.display = 'flex';
    chatComposer.style.display = 'block';
    showAddMemberModalBtn.style.display = group.isDefault ? 'none' : 'block';

    renderGroups();
    await loadMessages();

    // Start polling for this group
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(loadMessages, 4000);
  };

  async function loadMessages() {
    if (!currentGroupId) return;
    try {
      const res = await fetch(`${API}/groups/${currentGroupId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const messages = await res.json();
      renderMessages(messages);
    } catch (err) { console.error(err); }
  }

  function renderMessages(messages) {
    chatMessagesEl.innerHTML = messages.map(m => `
            <div class="chat-message-wrapper">
                <div class="chat-message">
                    <div class="chat-header">
                        <strong>${escapeHtml(m.userName)}</strong>
                        <span class="meta">${new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div class="chat-text">${escapeHtml(m.text)}</div>
                </div>
            </div>
        `).join('') || '<div class="empty-chat"><p>No messages yet. Say hi!</p></div>';
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  async function searchStudents(q) {
    try {
      const res = await fetch(`${API}/students/search?q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const results = await res.json();
      renderSearchResults(results);
    } catch (err) { console.error(err); }
  }

  function renderSearchResults(results) {
    if (results.length === 0) {
      studentSearchResultsEl.innerHTML = '<p class="hint">No students found</p>';
      return;
    }
    studentSearchResultsEl.innerHTML = results.map(u => `
            <div class="student-result">
                <div class="student-info">
                    <h4>${escapeHtml(u.fullName)}</h4>
                    <p>${escapeHtml(u.studentId)} | ${u.campus}</p>
                </div>
                <button class="btn btn-sm btn-secondary" onclick="addMember('${u.id}')">Add</button>
            </div>
        `).join('');
  }

  window.addMember = async function (userId) {
    if (!currentGroupId) return;
    try {
      const res = await fetch(`${API}/groups/${currentGroupId}/members`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        alert('Member added!');
        await loadGroups();
      }
    } catch (err) { console.error(err); }
  };

  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
