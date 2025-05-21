// grade11screen.js - Render 11th grade subjects

document.addEventListener('DOMContentLoaded', function() {
    const subjects = [
        { name: 'English', link: '11th English.html' },
        { name: 'Biology', link: '11th Biology.html' },
        { name: 'History', link: '11th History.html' }
    ];

    const subjectsList = document.getElementById('subjectsList11');
    
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
