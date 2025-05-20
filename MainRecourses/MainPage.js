// MainPage.js - Handles login and grade/subject selection

document.addEventListener('DOMContentLoaded', async () => {
    // Modal Elements
    const authModal = document.getElementById('authModal');
    const registerModal = document.getElementById('registerModal');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const closeRegisterBtn = document.getElementById('closeRegisterModal');

    // Form Elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');
    const accountSection = document.querySelector('.account-section');
    const gradeSelector = document.querySelector('.grade-selector-section');
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const apiStatus = document.getElementById('apiStatus');
    const accessibleGrades = document.getElementById('accessibleGrades');

    // Modal Controls with smooth transitions
    function showModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }

    function hideModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    showLoginBtn.addEventListener('click', () => showModal(authModal));
    showRegisterBtn.addEventListener('click', () => showModal(registerModal));
    closeModalBtn.addEventListener('click', () => hideModal(authModal));
    closeRegisterBtn.addEventListener('click', () => hideModal(registerModal));

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) hideModal(authModal);
        if (e.target === registerModal) hideModal(registerModal);
    });

    // Check for existing API key
    if (window.userAuth.apiKey) {
        const isValid = await window.userAuth.validateApiKey();
        updateApiStatus(isValid);
    }

    // Login form handler with smooth transitions
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (username && password) {
            loginMessage.style.color = '#22c55e';
            loginMessage.textContent = `Welcome, ${username}!`;
            
            // Smooth transition for sections
            accountSection.style.display = 'flex';
            accountSection.style.opacity = '0';
            setTimeout(() => accountSection.style.opacity = '1', 10);
            
            if (window.userAuth.apiKey) {
                const isValid = await window.userAuth.validateApiKey();
                if (isValid) {
                    gradeSelector.style.display = 'flex';
                    gradeSelector.style.opacity = '0';
                    setTimeout(() => gradeSelector.style.opacity = '1', 10);
                }
                updateApiStatus(isValid);
            }
        } else {
            loginMessage.style.color = '#ef4444';
            loginMessage.textContent = 'Invalid credentials.';
            loginMessage.style.animation = 'shake 0.5s ease-in-out';
        }
    });

    // Register form handler with improved feedback
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('newUsername').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('newPassword').value.trim();
        const confirmPass = document.getElementById('confirmPassword').value.trim();

        registerMessage.className = '';
        
        if (password !== confirmPass) {
            registerMessage.textContent = 'Passwords do not match.';
            registerMessage.classList.add('error');
            return;
        }

        // TODO: Add your registration API call here
        registerMessage.textContent = 'Account created successfully! Please login.';
        registerMessage.classList.add('success');
        
        setTimeout(() => {
            hideModal(registerModal);
            setTimeout(() => showModal(authModal), 300);
        }, 2000);
    });

    // API key handling with visual feedback
    saveApiKeyBtn.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            saveApiKeyBtn.disabled = true;
            saveApiKeyBtn.textContent = 'Validating...';
            
            window.userAuth.setApiKey(key);
            const isValid = await window.userAuth.validateApiKey();
            updateApiStatus(isValid);
            
            if (isValid) {
                gradeSelector.style.display = 'flex';
                gradeSelector.style.opacity = '0';
                setTimeout(() => gradeSelector.style.opacity = '1', 10);
                apiKeyInput.value = '';
            }
            
            saveApiKeyBtn.disabled = false;
            saveApiKeyBtn.textContent = 'Save API Key';
        }
    });

    // Update API status display with animations
    function updateApiStatus(isValid) {
        apiStatus.className = isValid ? 'valid' : 'invalid';
        apiStatus.textContent = isValid 
            ? '✓ API Key Valid' 
            : '✗ Invalid API Key';
        
        if (isValid) {
            const grades = window.userAuth.getAccessibleGrades();
            accessibleGrades.textContent = `Access granted to: ${grades.join(', ')}`;
            accessibleGrades.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            accessibleGrades.textContent = '';
        }
    }

    // Grade selection handling with improved feedback
    const gradeButtons = document.querySelectorAll('.grade-btn');
    gradeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const grade = btn.getAttribute('data-grade');
            
            if (!window.userAuth.hasAccessToGrade(grade)) {
                const message = document.createElement('div');
                message.className = 'grade-access-error';
                message.textContent = `You don't have access to ${grade}. Please upgrade your API key.`;
                document.body.appendChild(message);
                setTimeout(() => message.remove(), 3000);
                return;
            }
            
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
                if (grade === '10th') {
                    window.location.href = 'Classes/10th/grade10screen.html';
                } else if (grade === '11th') {
                    window.location.href = 'Classes/11th/grade11screen.html';
                }
            }, 150);
        });
    });

    // Add some animations
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    });

    setTimeout(() => {
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
});
