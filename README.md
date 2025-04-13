 IT Job — Платформа вакансий для IT-стартапов
🚀 О проекте
IT Job — это веб-приложение, предназначенное для размещения и поиска вакансий в сфере IT, с фокусом на стартапы. Платформа помогает разработчикам, дизайнерам, аналитикам и другим IT-специалистам находить интересные предложения, а стартапам — быстро находить подходящих кандидатов.

🔧 Стек технологий
Frontend: React, Redux, React Router

Backend: Node.js, Express,Django

База данных: Postman

Стилизация: Tailwind CSS / CSS Modules

Дополнительно: localStorage для фильтров, REST API (в разработке)

✨ Функционал
🔍 Фильтрация вакансий по:

Ключевому слову

Категории (Frontend, Backend, Design и т.д.)

Городу

🏙 Выбор города через CityDropdown, с сохранением в localStorage

📄 Просмотр подробной информации о вакансии

➕ Добавление новых вакансий (для HR/стартапов)

🧠 Удобный и минималистичный UI

📦 Установка
bash
Copy
Edit
git clone https://github.com/your-username/it-job-board.git
cd it-job-board
npm install
npm start
📁 Структура проекта
css
Copy
Edit
src/
├── components/
│   ├── JobCard.jsx
│   ├── CityDropdown.jsx
│   └── ...
├── pages/
│   ├── JobsPage.jsx
│   ├── JobDetailPage.jsx
│   └── ...
├── store/
│   └── filtersSlice.js
├── utils/
│   └── localStorageHelpers.js
└── App.jsx
📈 Планы по развитию
Авторизация и личный кабинет

Панель администратора для модерации вакансий

Интеграция с внешними API (например, GitHub Jobs)

Подписка на вакансии по интересам

Уведомления на email

📝 Лицензия


