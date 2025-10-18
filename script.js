document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeButton = document.getElementById('theme-toggle');
    const nameInput = document.getElementById('user-name');
    const greeting = document.getElementById('greeting');
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');
    const loadButton = document.getElementById('load-content');
    const contentContainer = document.getElementById('content-container');
    const loadJsonButton = document.getElementById('load-json');
    const jsonContainer = document.getElementById('json-container');

    // ----- Зміна теми -----
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        body.classList.add('light-theme');
    }

    themeButton.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');
        localStorage.setItem('theme', body.className);
    });

    // ----- Реактивне вітання -----
    nameInput.addEventListener('input', (event) => {
        const name = event.target.value.trim();
        greeting.textContent = name ? `Вітаємо, ${name}!` : '';
    });

    // ----- Динамічне додавання елементів -----
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('comment-name').value.trim();
        const text = document.getElementById('comment-text').value.trim();

        if (name && text) {
            const comment = document.createElement('div');
            comment.className = 'comment';
            comment.innerHTML = `<strong>${name}</strong>: ${text}`;
            commentList.appendChild(comment);
            commentForm.reset();
        }
    });

    // ----- Динамічне завантаження контенту -----
    loadButton.addEventListener('click', async () => {
        contentContainer.textContent = 'Завантаження...';
        try {
            const response = await fetch('https://web2025-test-data.ikto.net/motivation.html');
            if (!response.ok) throw new Error('Помилка завантаження');
            const html = await response.text();
            contentContainer.innerHTML = html;
        } catch {
            contentContainer.textContent = 'Не вдалося завантажити дані';
        }
    });

    // ----- Динамічне завантаження структурованих даних (JSON) -----
    loadJsonButton.addEventListener('click', async () => {
        jsonContainer.textContent = 'Завантаження...';
        const urls = [
            'https://web2025-test-data.ikto.net/comments.json',
            'https://web2025-test-data.ikto.net/news.json',
            'https://web2025-test-data.ikto.net/schedule.json'
        ];
        const randomUrl = urls[Math.floor(Math.random() * urls.length)];

        try {
            const response = await fetch(randomUrl);
            if (!response.ok) throw new Error('Помилка завантаження');
            const data = await response.json();

            jsonContainer.innerHTML = `<p><em>Дані завантажено з:</em> ${randomUrl}</p>`;

            // Відображення даних у залежності від типу файлу
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'comment';
                    div.innerHTML = Object.entries(item)
                        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                        .join('<br>');
                    jsonContainer.appendChild(div);
                });
            } else {
                jsonContainer.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            }

        } catch {
            jsonContainer.textContent = 'Не вдалося завантажити дані';
        }
    });
});
