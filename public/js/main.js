document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetPasswordForm = document.getElementById('reset-password-form');

    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const loginLinkContainer = document.getElementById('login-link-container');
    const logoutButton = document.getElementById('logout-button');

    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('d-none');
            forgotPasswordForm.classList.add('d-none');
            signupForm.classList.remove('d-none');
            signupLink.parentElement.classList.add('d-none');
            loginLinkContainer.classList.remove('d-none');
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.add('d-none');
            forgotPasswordForm.classList.add('d-none');
            loginForm.classList.remove('d-none');
            loginLinkContainer.classList.add('d-none');
            signupLink.parentElement.classList.remove('d-none');
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('d-none');
            signupForm.classList.add('d-none');
            forgotPasswordForm.classList.remove('d-none');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
                alert('Server error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });
                const data = await res.json();
                if (res.ok) {
                    const loginRes = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });
                    const loginData = await loginRes.json();
                    if (loginRes.ok) {
                        localStorage.setItem('token', loginData.token);
                        window.location.href = 'dashboard.html';
                    } else {
                        alert(loginData.message);
                    }
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
                alert('Server error');
            }
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;
            try {
                const res = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
                const data = await res.json();
                alert(data.message);
            } catch (err) {
                console.error(err);
                alert('Server error');
            }
        });
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const password = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                return alert('Passwords do not match');
            }

            try {
                const res = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, password }),
                });
                const data = await res.json();
                alert(data.message);
                if(res.ok) {
                    window.location.href = 'index.html';
                }
            } catch (err) {
                console.error(err);
                alert('Server error');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
});