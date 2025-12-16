document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
        console.warn('Кнопка переключения темы не найдена. Пропуск.');
        return;
    }

    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'pikmi') {
        html.classList.add('pikmi-theme');
        updateToggleButton(true);
    }

    themeToggle.addEventListener('click', () => {
        const isPikmi = html.classList.toggle('pikmi-theme');
        localStorage.setItem('theme', isPikmi ? 'pikmi' : 'default');
        updateToggleButton(isPikmi);
    });

    function updateToggleButton(isPikmi) {
        themeToggle.textContent = isPikmi ? '🌸 Пикми тема' : 'Обычная тема';
    }
});