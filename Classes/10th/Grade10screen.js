// grade10screen.js - Render 10th grade subjects

document.addEventListener('DOMContentLoaded', function() {
    const subjects = [
        { name: 'Biology', link: '10th Biology.html' },
        { name: 'English', link: '10th English.html' },
        { name: 'History', link: '10th History.html' }
    ];

    const subjectsList = document.getElementById('subjectsList10');
    
    subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        
        card.innerHTML = `
            <i class="fas fa-book"></i>
            <h3>${subject.name}</h3>
            <button class="subject-btn" onclick="window.location.href='${subject.link}'">
                <i class="fas fa-arrow-right"></i>
                View Content
            </button>
        `;
        
        subjectsList.appendChild(card);
    });
});
