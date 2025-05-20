// grade11screen.js - Render 11th grade subjects

document.addEventListener('DOMContentLoaded', () => {
    const subjects = [
        { name: 'English', file: '11th English.html' },
        { name: '(name)', file: '11th (name).html' },
        { name: '(name2)', file: '11th (name2).html' }
    ];
    const list = document.getElementById('subjectsList11');
    subjects.forEach(subject => {
        const btn = document.createElement('a');
        btn.className = 'subject-btn';
        btn.textContent = subject.name;
        btn.href = subject.file;
        btn.target = '_blank';
        list.appendChild(btn);
    });
});
