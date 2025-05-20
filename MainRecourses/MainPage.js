// MainPage.js - Handles login and grade/subject selection

document.addEventListener('DOMContentLoaded', async () => {
    // Modal Elements
    const authModal = document.getElementById('authModal');
    const registerModal = document.getElementById('registerModal');
    const accountSection = document.querySelector('.account-section');
    const gradeSelectorSection = document.querySelector('.grade-selector-section');
    const loginSection = document.querySelector('.login-section');

    // Button Elements
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const closeRegisterModalBtn = document.getElementById('closeRegisterModal');

    // Form Elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const apiStatus = document.getElementById('apiStatus');
    const accessibleGrades = document.getElementById('accessibleGrades');

    // Helper function to lock/unlock body scroll
    const toggleBodyScroll = (lock) => {
        if (lock) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = scrollbarWidth + 'px';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    };

    // Initialize modals
    [authModal, registerModal].forEach(modal => {
        if (modal) modal.classList.remove('active');
    });

    // Initialize sections
    [accountSection, gradeSelectorSection].forEach(section => {
        if (section) section.classList.remove('active');
    });

    // Show Login Modal
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (authModal) {
                authModal.classList.add('active');
                if (loginSection) loginSection.style.display = 'block';
                if (accountSection) accountSection.classList.remove('active');
                if (gradeSelectorSection) gradeSelectorSection.classList.remove('active');
                toggleBodyScroll(true);
            }
        });
    }

    // Show Register Modal
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerModal) {
                registerModal.classList.add('active');
                toggleBodyScroll(true);
            }
        });
    }

    // Close Login Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (authModal) {
                authModal.classList.remove('active');
                toggleBodyScroll(false);
                setTimeout(() => {
                    if (loginSection) loginSection.style.display = 'block';
                    if (accountSection) accountSection.classList.remove('active');
                    if (gradeSelectorSection) gradeSelectorSection.classList.remove('active');
                }, 300);
            }
        });
    }

    // Close Register Modal
    if (closeRegisterModalBtn) {
        closeRegisterModalBtn.addEventListener('click', () => {
            if (registerModal) {
                registerModal.classList.remove('active');
                toggleBodyScroll(false);
            }
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
            toggleBodyScroll(false);
            setTimeout(() => {
                if (loginSection) loginSection.style.display = 'block';
                if (accountSection) accountSection.classList.remove('active');
                if (gradeSelectorSection) gradeSelectorSection.classList.remove('active');
            }, 300);
        }
        if (e.target === registerModal) {
            registerModal.classList.remove('active');
            toggleBodyScroll(false);
        }
    });

    // Check for existing API key
    if (window.userAuth.apiKey) {
        const isValid = await window.userAuth.validateApiKey();
        updateApiStatus(isValid);
    }

    // Login form handler with smooth transitions
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username')?.value.trim();
            const password = document.getElementById('password')?.value.trim();
            
            if (username && password) {
                if (loginMessage) {
                    loginMessage.style.color = '#22c55e';
                    loginMessage.textContent = `Welcome, ${username}!`;
                }
                
                if (loginSection) loginSection.style.display = 'none';
                if (accountSection) accountSection.classList.add('active');
                
                if (window.userAuth?.apiKey) {
                    const isValid = await window.userAuth.validateApiKey();
                    if (isValid) {
                        setTimeout(() => {
                            if (accountSection) accountSection.classList.remove('active');
                            if (gradeSelectorSection) gradeSelectorSection.classList.add('active');
                        }, 500);
                    }
                    updateApiStatus(isValid);
                }
            } else {
                if (loginMessage) {
                    loginMessage.style.color = '#ef4444';
                    loginMessage.textContent = 'Please enter both username and password.';
                }
            }
        });
    }

    // Register form handler with improved feedback
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('newUsername')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const password = document.getElementById('newPassword')?.value.trim();
            const confirmPassword = document.getElementById('confirmPassword')?.value.trim();

            if (!username || !email || !password || !confirmPassword) {
                if (registerMessage) {
                    registerMessage.textContent = 'Please fill in all fields.';
                    registerMessage.style.color = '#ef4444';
                }
                return;
            }

            if (password !== confirmPassword) {
                if (registerMessage) {
                    registerMessage.textContent = 'Passwords do not match.';
                    registerMessage.style.color = '#ef4444';
                }
                return;
            }

            if (registerMessage) {
                registerMessage.textContent = 'Account created successfully!';
                registerMessage.style.color = '#22c55e';
            }
            
            setTimeout(() => {
                if (registerModal) registerModal.classList.remove('active');
                toggleBodyScroll(false);
                if (registerForm) registerForm.reset();
                if (authModal) authModal.classList.add('active');
            }, 1500);
        });
    }

    // API key handling with visual feedback
    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener('click', async () => {
            const apiKey = apiKeyInput?.value.trim();
            if (apiKey && window.userAuth) {
                window.userAuth.apiKey = apiKey;
                const isValid = await window.userAuth.validateApiKey();
                updateApiStatus(isValid);
                
                if (isValid) {
                    setTimeout(() => {
                        if (accountSection) accountSection.classList.remove('active');
                        if (gradeSelectorSection) gradeSelectorSection.classList.add('active');
                    }, 500);
                }
            }
        });
    }

    // Update API status display with animations
    function updateApiStatus(isValid) {
        if (apiStatus) {
            apiStatus.textContent = isValid ? 'API Key: Valid' : 'API Key: Invalid';
            apiStatus.style.color = isValid ? '#22c55e' : '#ef4444';
        }
        if (accessibleGrades) {
            accessibleGrades.textContent = isValid ? 'Access: All Grades' : '';
        }
    }

    // Handle Account Section Display
    function showAccountSection() {
        document.querySelector('.login-section').classList.add('hidden');
        accountSection.classList.add('active');
    }

    // Handle Grade Selector Display
    function showGradeSelector() {
        accountSection.classList.remove('active');
        gradeSelectorSection.classList.add('active');
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

    // Add smooth transitions for all interactive elements
    document.querySelectorAll('.feature-card, .primary-btn, .secondary-btn, .contact-btn')
        .forEach(element => {
            element.style.transition = 'all 0.3s ease';
        });
});
