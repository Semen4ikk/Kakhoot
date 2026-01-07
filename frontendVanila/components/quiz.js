if (!localStorage.getItem('isAuthenticated')) {
    window.location.href = 'auth.html';
}

const urlParams = new URLSearchParams(window.location.search);
const quizId = parseInt(urlParams.get('quizId'));

if (!quizId || isNaN(quizId)) {
    alert('Некорректный ID квиза');
    window.location.href = 'main.html';
}

const questionContainer = document.getElementById('question-container');
const loadingEl = document.getElementById('loading');
const navigationEl = document.getElementById('navigation');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');


let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function loadQuestions() {
    try {
        const response = await fetch(`http://localhost:4200/question/quiz/${quizId}`);

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            questionContainer.innerHTML = '<div class="text-center text-muted">В этом квизе нет вопросов</div>';
            navigationEl.style.display = 'none';
            return;
        }
        questions = data.map(q => {
            const allAnswers = [q.correct_answer, ...q.incorrect_answers];
            const shuffledAnswers = shuffle(allAnswers);
            return {
                id: q.id,
                text: q.ques,
                correctAnswer: q.correct_answer,
                answers: shuffledAnswers
            };
        });

        showQuestion(currentQuestionIndex);
    } catch (error) {
        console.error('Ошибка загрузки вопросов:', error);
        loadingEl.innerHTML = '<div class="text-center text-danger">Не удалось загрузить вопросы. Проверьте подключение.</div>';
    }
}
function showQuestion(index) {
    const question = questions[index];
    loadingEl.style.display = 'none';
    navigationEl.style.display = 'flex';

    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === questions.length - 1 ? 'Завершить' : 'Далее';
    const selectedValue = userAnswers[question.id] || '';

    let answersHtml = '';
    question.answers.forEach((answer, i) => {
        const isChecked = answer === selectedValue ? 'checked' : '';
        answersHtml += `
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="answer" id="ans-${i}" value="${answer}" ${isChecked}>
        <label class="form-check-label" for="ans-${i}">${answer}</label>
      </div>
    `;
    });

    questionContainer.innerHTML = `
    <h4>Вопрос ${index + 1} из ${questions.length}</h4>
    <p class="lead mt-3">${question.text || 'Без текста'}</p>
    <div class="mt-4">
      ${answersHtml}
    </div>
  `;
}

prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
});

nextBtn.addEventListener('click', () => {
    const selectedRadio = document.querySelector('input[name="answer"]:checked');
    if (!selectedRadio) {
        alert('Пожалуйста, выберите ответ');
        return;
    }
    const currentQuestion = questions[currentQuestionIndex];
    userAnswers[currentQuestion.id] = selectedRadio.value;

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        const correctCount = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
        const total = questions.length;
        alert(`Квиз завершён!\nПравильных ответов: ${correctCount} из ${total}`);
        window.location.href = 'main.html';
    }
});
backBtn.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите выйти? Прогресс будет потерян.')) {
        window.location.href = 'main.html';
    }
});
loadQuestions();