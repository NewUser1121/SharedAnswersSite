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
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Show Register Modal
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerModal) {
                registerModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Close Login Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (authModal) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
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
                document.body.style.overflow = '';
            }
        });
    }    // Close modals when clicking outside
    window.addEventListener('mousedown', (e) => {
        // Only close if clicking the backdrop (not the modal content)
        if ((e.target === authModal || e.target === registerModal) && !e.target.closest('.glass')) {
            e.preventDefault();
            if (e.target === authModal) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => {
                    if (loginSection) loginSection.style.display = 'block';
                    if (accountSection) accountSection.classList.remove('active');
                    if (gradeSelectorSection) gradeSelectorSection.classList.remove('active');
                }, 300);
            } else if (e.target === registerModal) {
                registerModal.classList.remove('active');
                document.body.style.overflow = '';
            }
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

// Bubble generator for main page
window.addEventListener('DOMContentLoaded', () => {
    const bubbleContainer = document.getElementById('bubble-container');
    if (!bubbleContainer) return;
    const colors = [
        'rgba(79,140,255,0.18)',
        'rgba(162,89,255,0.16)',
        'rgba(255, 99, 132, 0.13)',
        'rgba(255, 205, 86, 0.13)',
        'rgba(54, 162, 235, 0.13)',
        'rgba(153, 102, 255, 0.13)'
    ];
    function createBubble() {
        const bubble = document.createElement('div');
        const size = Math.random() * 60 + 40;
        bubble.className = 'bubble';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.bottom = `-${size}px`;
        bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
        bubble.style.opacity = Math.random() * 0.5 + 0.2;
        bubble.style.position = 'absolute';
        bubble.style.borderRadius = '50%';
        bubble.style.zIndex = 0;
        bubble.style.pointerEvents = 'none';
        bubble.style.filter = 'blur(1.5px)';
        bubble.style.animation = `bubbleFloat ${Math.random() * 8 + 10}s linear forwards`;
        bubbleContainer.appendChild(bubble);
        bubble.addEventListener('animationend', () => bubble.remove());
    }
    setInterval(createBubble, 900);
});

// Modal logic (class toggling, fade in/out)
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('show');
    modal.style.display = 'flex';
    setTimeout(() => { modal.style.opacity = 1; }, 10);
}
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.opacity = 0;
    setTimeout(() => {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }, 350);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('showLoginBtn')?.addEventListener('click', () => showModal('authModal'));
    document.getElementById('showRegisterBtn')?.addEventListener('click', () => showModal('registerModal'));
    document.getElementById('closeModal')?.addEventListener('click', () => hideModal('authModal'));
    document.getElementById('closeRegisterModal')?.addEventListener('click', () => hideModal('registerModal'));
    // Hide modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
});
