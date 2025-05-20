// grade10screen.js - Render 10th grade subjects

document.addEventListener('DOMContentLoaded', () => {
    const subjects = [
        { name: 'Biology', file: '10th Biology.html' },
        { name: 'English', file: '10th English.html' },
        { name: 'History', file: '10th History.html' }
    ];
    const list = document.getElementById('subjectsList10');
    subjects.forEach(subject => {
        const btn = document.createElement('a');
        btn.className = 'subject-btn';
        btn.textContent = subject.name;
        btn.href = subject.file;
        btn.target = '_blank';
        list.appendChild(btn);
    });
});
