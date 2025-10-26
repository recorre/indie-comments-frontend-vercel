const API_BASE = 'http://localhost:8000/api/v1';

function showSection(sectionId) {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById(sectionId).classList.remove('hidden');
}

function showError(message) {
    document.getElementById('login-error').textContent = message;
}

function showSuccess(message) {
    alert(message); // Simple alert for success
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('api_key', data.api_key);
            showSection('dashboard-section');
            loadPendingComments();
        } else {
            const error = await response.json();
            showError(error.detail || 'Login failed');
        }
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function loadPendingComments() {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
        showSection('login-section');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin/comments/pending`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (response.ok) {
            const data = await response.json();
            displayComments(data.pending);
        } else if (response.status === 401) {
            localStorage.removeItem('api_key');
            showSection('login-section');
            showError('Session expired, please login again');
        } else {
            const error = await response.json();
            document.getElementById('comments-list').innerHTML = `<p class="error">Error: ${error.detail || 'Failed to load comments'}</p>`;
        }
    } catch (error) {
        document.getElementById('comments-list').innerHTML = `<p class="error">Network error: ${error.message}</p>`;
    }
}

function displayComments(comments) {
    const list = document.getElementById('comments-list');
    if (comments.length === 0) {
        list.innerHTML = '<p>No pending comments.</p>';
        return;
    }

    list.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <h3>${comment.author_name || 'Unknown Author'}</h3>
            <p><strong>Thread:</strong> ${comment.thread_referencia_id || 'N/A'}</p>
            <p><strong>Content:</strong> ${comment.content}</p>
            <p><strong>Created:</strong> ${new Date(comment.created_at).toLocaleString()}</p>
            <button class="approve-btn" onclick="approveComment(${comment.id})">Approve</button>
        </div>
    `).join('');
}

async function approveComment(commentId) {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
        showSection('login-section');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin/comments/${commentId}/approve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (response.ok) {
            showSuccess('Comment approved successfully');
            loadPendingComments(); // Refresh the list
        } else if (response.status === 401) {
            localStorage.removeItem('api_key');
            showSection('login-section');
            showError('Session expired, please login again');
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail || 'Failed to approve comment'}`);
        }
    } catch (error) {
        alert(`Network error: ${error.message}`);
    }
}

// Check if already logged in
if (localStorage.getItem('api_key')) {
    showSection('dashboard-section');
    loadPendingComments();
} else {
    showSection('login-section');
}