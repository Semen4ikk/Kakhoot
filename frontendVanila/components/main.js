let allQuizzes = [];
let filteredQuizzes = [];
const QUIZZES_PER_PAGE = 3;
let currentPage = 1;

if (!localStorage.getItem('isAuthenticated')) {
    window.location.href = 'auth.html';
} else {
    const userEmail = localStorage.getItem('userEmail');
    const userLoginSpan = document.getElementById('user-login');
    if (userLoginSpan && userEmail) {
        userLoginSpan.textContent = userEmail;
    }

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userEmail');
            window.location.href = 'auth.html';
        });
    }
    function renderQuizzesPage(quizzes, page) {
        const container = document.getElementById('quizzes-container');
        const startIndex = (page - 1) * QUIZZES_PER_PAGE;
        const paginated = quizzes.slice(startIndex, startIndex + QUIZZES_PER_PAGE);

        container.innerHTML = '';

        if (paginated.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted">Квизы не найдены</div>';
            document.getElementById('pagination').style.display = 'none';
            return;
        }

        paginated.forEach(quiz => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${quiz.name}</h5>
            <p class="card-text text-muted">
              <small>Категория: <strong>${quiz.category}</strong></small>
            </p>
            <button class="btn btn-primary mt-auto" onclick="location.href='quiz.html?quizId=${quiz.id}'">
            Начать
            </button>
          </div>
        </div>
      `;
            container.appendChild(col);
        });

        renderPagination(quizzes.length, page);
    }
    function renderPagination(totalItems, currentPage) {
        const totalPages = Math.ceil(totalItems / QUIZZES_PER_PAGE);
        const paginationEl = document.getElementById('pagination');

        if (totalPages <= 1) {
            paginationEl.style.display = 'none';
            return;
        }

        paginationEl.style.display = 'flex';
        paginationEl.innerHTML = '';

        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" tabindex="-1" aria-disabled="${currentPage === 1}">Назад</a>`;
        if (currentPage > 1) {
            prevLi.addEventListener('click', (e) => {
                e.preventDefault();
                goToPage(currentPage - 1);
            });
        }
        paginationEl.appendChild(prevLi);
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                goToPage(i);
            });
            paginationEl.appendChild(li);
        }

        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#">Вперёд</a>`;
        if (currentPage < totalPages) {
            nextLi.addEventListener('click', (e) => {
                e.preventDefault();
                goToPage(currentPage + 1);
            });
        }
        paginationEl.appendChild(nextLi);
    }
    function goToPage(page) {
        currentPage = page;
        renderQuizzesPage(filteredQuizzes, currentPage);
    }
    function applyFilter(query) {
        if (query.trim() === '') {
            filteredQuizzes = allQuizzes;
        } else {
            const q = query.toLowerCase();
            filteredQuizzes = allQuizzes.filter(quiz =>
                quiz.category.toLowerCase().includes(q)
            );
        }
        currentPage = 1;
        renderQuizzesPage(filteredQuizzes, currentPage);
    }
    async function loadQuizzes() {
        const loadingEl = document.getElementById('loading');
        try {
            const response = await fetch('http://localhost:4200/quiz');
            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
            allQuizzes = await response.json();
            filteredQuizzes = [...allQuizzes];
            loadingEl?.remove();
            renderQuizzesPage(filteredQuizzes, currentPage);
        } catch (error) {
            console.error('Ошибка загрузки квизов:', error);
            if (loadingEl) {
                loadingEl.textContent = 'Не удалось загрузить квизы';
                loadingEl.className = 'col-12 text-center text-danger';
            }
        }
    }

    function setupSearch() {
        const searchInput = document.getElementById('category-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                applyFilter(e.target.value);
            });
        }
    }
    loadQuizzes().then(setupSearch);
}