// Chat client for dashboard
(async function(){
  const API = 'http://localhost:3000/api';
  const token = localStorage.getItem('token');
  const chatMessagesEl = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatAttachmentsInput = document.getElementById('chatAttachments');
  const attachBtn = document.getElementById('attachBtn');
  const cameraBtn = document.getElementById('cameraBtn');
  const attachmentsPreview = document.getElementById('attachmentsPreview');
  const cameraModal = document.getElementById('cameraModal');
  const cameraVideo = document.getElementById('cameraVideo');
  const capturePhotoBtn = document.getElementById('capturePhoto');
  const startRecordBtn = document.getElementById('startRecord');
  const stopRecordBtn = document.getElementById('stopRecord');
  const closeCameraBtn = document.getElementById('closeCamera');
  const chatSearchInput = document.getElementById('chatSearchInput');
  const searchMeta = document.getElementById('searchMeta');

  let lastFetch = null;
  let replyToId = null;
  let replyIndicatorEl = null;
  let replyContainer = null;
  let allMessages = []; // store all messages for search

  function ensureReplyContainer(){
    if(!replyContainer){
      replyContainer = document.createElement('div');
      if(chatForm && chatForm.parentNode){
        chatForm.parentNode.insertBefore(replyContainer, chatForm);
      } else if (chatMessagesEl && chatMessagesEl.parentNode){
        chatMessagesEl.parentNode.insertBefore(replyContainer, chatMessagesEl.nextSibling);
      } else {
        document.body.appendChild(replyContainer);
      }
    }
  }

  // Search and filter messages
  function performSearch(){
    const query = (chatSearchInput?.value || '').trim().toLowerCase();
    const wrappers = document.querySelectorAll('.chat-message-wrapper');
    let matchCount = 0;

    if(!query){
      // clear search: show all
      wrappers.forEach(w => {
        w.classList.remove('hidden');
        const msg = w.querySelector('.chat-message');
        if(msg) msg.innerHTML = msg.innerHTML.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
      });
      if(searchMeta) searchMeta.textContent = '';
      return;
    }

    wrappers.forEach(w => {
      const msg = w.querySelector('.chat-message');
      if(!msg) { w.classList.add('hidden'); return; }
      
      // Get original text (remove any previous highlights first)
      let text = msg.textContent;
      const headerEl = msg.querySelector('.chat-header');
      const bodyEl = msg.querySelector('.chat-text');
      
      const matchesInBody = bodyEl && bodyEl.textContent.toLowerCase().includes(query);
      const matchesInMeta = text.toLowerCase().includes(query);
      
      if(matchesInBody || matchesInMeta){
        w.classList.remove('hidden');
        matchCount++;
        
        // highlight in body
        if(bodyEl && matchesInBody){
          let content = bodyEl.textContent;
          const regex = new RegExp(`(${query})`, 'gi');
          content = content.replace(regex, '<mark>$1</mark>');
          bodyEl.innerHTML = content;
        }
      } else {
        w.classList.add('hidden');
      }
    });

    if(searchMeta) searchMeta.textContent = `${matchCount} match${matchCount !== 1 ? 'es' : ''}`;
  }

  function ensureReplyContainer(){

  function showReplyIndicator(target){
    ensureReplyContainer();
    replyToId = target.id;
    if(replyIndicatorEl) replyIndicatorEl.remove();
    replyIndicatorEl = document.createElement('div');
    replyIndicatorEl.className = 'replying-indicator';
    const short = (target.text || '').slice(0, 120);
    replyIndicatorEl.innerHTML = `Replying to <strong>${escapeHtml(target.userName)}</strong>: "${escapeHtml(short)}" <button type="button" id="cancelReply" style="margin-left:8px;padding:4px 8px;">Cancel</button>`;
    replyContainer.appendChild(replyIndicatorEl);
    const cancel = document.getElementById('cancelReply');
    if(cancel) cancel.addEventListener('click', ()=> { replyToId = null; replyIndicatorEl.remove(); replyIndicatorEl = null; });
    if(chatInput) chatInput.focus();
  }

  function startReply(target){
    showReplyIndicator(target);
  }

  function createMessageElement(m){
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-message-wrapper';

    const msg = document.createElement('div');
    msg.className = 'chat-message';

    const header = document.createElement('div');
    header.className = 'chat-header';
    header.innerHTML = `<strong>${escapeHtml(m.userName)}</strong> <span class="meta">${new Date(m.createdAt).toLocaleString()}</span>`;
    msg.appendChild(header);

    if(m.replyTo){
      const quote = document.createElement('div');
      quote.className = 'chat-reply-quote';
      quote.innerHTML = `<em>Replying to <strong>${escapeHtml(m.replyTo.userName)}</strong>: ${escapeHtml(m.replyTo.text||'')}</em>`;
      msg.appendChild(quote);
    }

    if(m.text){
      const body = document.createElement('div');
      body.className = 'chat-text';
      body.textContent = m.text;
      msg.appendChild(body);
    }

    if(m.attachments && m.attachments.length){
      const attWrap = document.createElement('div');
      attWrap.className = 'chat-attachments';
      m.attachments.forEach(aMeta => {
        const att = document.createElement('div');
        att.className = 'chat-attachment';
        const a = document.createElement('a');
        a.href = `/uploads/${encodeURIComponent(aMeta.filename)}`;
        a.target = '_blank';
        a.textContent = aMeta.originalName || aMeta.filename || 'attachment';
        att.appendChild(a);
        attWrap.appendChild(att);
      });
      msg.appendChild(attWrap);
    }

    // Reply action
    const actions = document.createElement('div');
    actions.className = 'chat-actions';
    const replyBtn = document.createElement('button');
    replyBtn.className = 'reply-btn';
    replyBtn.type = 'button';
    replyBtn.textContent = 'Reply';
    replyBtn.addEventListener('click', ()=> startReply(m));
    actions.appendChild(replyBtn);
    wrapper.appendChild(msg);
    wrapper.appendChild(actions);

    // touch / slide handling for small screens: reveal actions on left swipe
    let startX = 0;
    let moved = false;
    wrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; moved = false; });
    wrapper.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - startX;
      if (dx < -20) {
        wrapper.style.transform = 'translateX(-80px)';
        moved = true;
      }
    });
    wrapper.addEventListener('touchend', () => { if (!moved) wrapper.style.transform = ''; });

    // mouse drag for desktop (optional): allow small slide
    let isDown = false; let mouseStartX = 0;
    wrapper.addEventListener('mousedown', e => { isDown = true; mouseStartX = e.clientX; });
    window.addEventListener('mousemove', e => {
      if(!isDown) return;
      const dx = e.clientX - mouseStartX;
      if(dx < -20) wrapper.style.transform = 'translateX(-80px)';
    });
    window.addEventListener('mouseup', ()=> { isDown = false; });

    return wrapper;
  }

  function escapeHtml(s){
    if(!s) return '';
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function loadMessages(){
    try{
      const url = lastFetch ? `${API}/chat/messages?since=${encodeURIComponent(lastFetch)}` : `${API}/chat/messages`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if(!res.ok) throw new Error('Failed to load messages');
      const messages = await res.json();
      if(!messages || messages.length===0) return;
      // append messages
      messages.forEach(m => {
        const el = createMessageElement(m);
        chatMessagesEl.appendChild(el);
      });
      lastFetch = new Date().toISOString();
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }catch(err){
      console.error('Chat load error', err);
    }
  }

  if(chatForm){
    // reply container and handlers are created lazily via ensureReplyContainer/showReplyIndicator
    // attachments managed client-side (can be multiple)
    let attachmentsList = [];

    // wire up search
    if(chatSearchInput){
      chatSearchInput.addEventListener('input', performSearch);
    }
    if(attachBtn && chatAttachmentsInput){
      attachBtn.addEventListener('click', ()=> chatAttachmentsInput.click());
      chatAttachmentsInput.addEventListener('change', (ev)=>{
        const files = Array.from(ev.target.files || []);
        files.forEach(f => { attachmentsList.push(f); renderAttachments(); });
        // clear native input so same file can be re-selected if needed
        chatAttachmentsInput.value = '';
      });
    }

    // camera handling
    let mediaStream = null;
    let mediaRecorder = null;
    let recordedChunks = [];
    function openCamera(){
      if(!cameraModal) return;
      cameraModal.style.display = 'flex';
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        mediaStream = stream;
        cameraVideo.srcObject = stream;
      }).catch(err => { alert('Camera access denied or unavailable'); console.error(err); });
    }
    function closeCamera(){
      cameraModal.style.display = 'none';
      if(mediaStream){ mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
      if(mediaRecorder && mediaRecorder.state !== 'inactive'){ mediaRecorder.stop(); }
      recordedChunks = [];
    }
    function capturePhoto(){
      if(!cameraVideo) return;
      const canvas = document.createElement('canvas');
      canvas.width = cameraVideo.videoWidth || 640;
      canvas.height = cameraVideo.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        const file = new File([blob], `photo-${Date.now()}.png`, { type: 'image/png' });
        attachmentsList.push(file);
        renderAttachments();
      }, 'image/png');
    }
    function startRecording(){
      if(!mediaStream) return alert('Camera not open');
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm;codecs=vp8' });
      mediaRecorder.ondataavailable = e => { if(e.data && e.data.size) recordedChunks.push(e.data); };
      mediaRecorder.onstop = ()=>{
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
        attachmentsList.push(file);
        renderAttachments();
        recordedChunks = [];
      };
      mediaRecorder.start();
      startRecordBtn.disabled = true; stopRecordBtn.disabled = false;
    }
    function stopRecording(){
      if(mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      startRecordBtn.disabled = false; stopRecordBtn.disabled = true;
    }

    if(cameraBtn) cameraBtn.addEventListener('click', openCamera);
    if(closeCameraBtn) closeCameraBtn.addEventListener('click', closeCamera);
    if(capturePhotoBtn) capturePhotoBtn.addEventListener('click', capturePhoto);
    if(startRecordBtn) startRecordBtn.addEventListener('click', startRecording);
    if(stopRecordBtn) stopRecordBtn.addEventListener('click', stopRecording);

    function renderAttachments(){
      if(!attachmentsPreview) return;
      attachmentsPreview.innerHTML = '';
      attachmentsList.forEach((f, idx) => {
        const item = document.createElement('div'); item.className = 'attachment-item';
        if(f.type.startsWith('image/')){
          const img = document.createElement('img'); img.className = 'attachment-thumb'; img.src = URL.createObjectURL(f);
          item.appendChild(img);
        } else if (f.type.startsWith('video/')){
          const vid = document.createElement('video'); vid.className = 'attachment-thumb'; vid.src = URL.createObjectURL(f); vid.muted = true; vid.controls = false; vid.play(); item.appendChild(vid);
        } else {
          const icon = document.createElement('div'); icon.textContent = f.name; item.appendChild(icon);
        }
        const remove = document.createElement('button'); remove.textContent = 'x'; remove.style.marginTop='4px'; remove.addEventListener('click', ()=>{ attachmentsList.splice(idx,1); renderAttachments(); });
        item.appendChild(remove);
        attachmentsPreview.appendChild(item);
      });
    }

    chatForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const text = chatInput.value.trim();
      if(!text && attachmentsList.length === 0) return;

      const form = new FormData();
      form.append('text', text);
      if(replyToId) form.append('replyTo', replyToId);
      // append attachmentsList as multiple 'attachments' fields
      attachmentsList.forEach(f => form.append('attachments', f, f.name));

      try{
        const res = await fetch(`${API}/chat/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: form
        });
        if(!res.ok) throw new Error('Send failed');
        const data = await res.json();
        // append message
        const el = createMessageElement(data.data);
        chatMessagesEl.appendChild(el);
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        chatInput.value = '';
        attachmentsList = [];
        renderAttachments();
        // clear reply state
        if(replyIndicatorEl){ replyIndicatorEl.remove(); replyIndicatorEl = null; replyToId = null; }
      }catch(err){
        console.error('Send error', err);
        alert('Failed to send message');
      }
    });

    // initial load and polling
    await loadMessages();
    setInterval(loadMessages, 4000);
  }
})();
