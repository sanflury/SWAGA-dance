//  ДОЖДАТЬСЯ ЗАГРУЗКИ ДОКУМЕНТА 
document.addEventListener('DOMContentLoaded', function() {
    
    // ЭЛЕМЕНТЫ СТРАНИЦЫ 
    const menuButton = document.querySelector('.menu-button');
    const siteMenu = document.querySelector('.site-menu');
    const signupButton = document.querySelector('.signup-button');
    const modal = document.getElementById('signup-modal');
    const closeModal = document.querySelector('.modal-close');
    const signupForm = document.querySelector('.signup-form');

    // ОТКРЫТИЕ/ЗАКРЫТИЕ МЕНЮ 
    if (menuButton && siteMenu) {
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('active');
            siteMenu.classList.toggle('active');
            
            // Блокируем скролл при открытом меню
            if (siteMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ НА ПУНКТ
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                menuButton.classList.remove('active');
                siteMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // ПЛАВНАЯ ПРОКРУТКА
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Пропускаем пустые якоря
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                
                // Закрываем меню если открыто
                if (siteMenu && siteMenu.classList.contains('active')) {
                    menuButton.classList.remove('active');
                    siteMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                // Плавная прокрутка
                target.scrollIntoView({ 
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ 
    if (signupButton && modal && closeModal) {
        // ОТКРЫТИЕ МОДАЛЬНОГО ОКНА
        signupButton.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Блокируем скролл
        });

        // ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Возвращаем скролл
        });

        // ЗАКРЫТИЕ ПО КЛИКУ ВНЕ ОКНА
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // ЗАКРЫТИЕ ПО КЛАВИШЕ ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ОБРАБОТКА ФОРМЫ С ВАЛИДАЦИЕЙ 
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Собираем данные формы
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Очищаем предыдущие сообщения об ошибках
            clearErrorMessages();
            
            let hasError = false;
            
            // ВАЛИДАЦИЯ ИМЕНИ
            const name = data.name ? data.name.trim() : '';
            if (!name) {
                showError('name', 'Пожалуйста, введите ваше имя');
                hasError = true;
            } else if (name.length < 2) {
                showError('name', 'Имя должно содержать минимум 2 символа');
                hasError = true;
            } else if (/\d/.test(name)) {
                showError('name', 'Имя не должно содержать цифры');
                hasError = true;
            }
            
            // ВАЛИДАЦИЯ ТЕЛЕФОНА
            const phone = data.phone ? data.phone.trim() : '';
            if (!phone) {
                showError('phone', 'Пожалуйста, введите ваш телефон');
                hasError = true;
            } else if (/[a-zA-Zа-яА-Я]/.test(phone)) {
                showError('phone', 'Телефон не должен содержать буквы');
                hasError = true;
            } else if (phone.replace(/\D/g, '').length < 7) {
                showError('phone', 'Телефон должен содержать минимум 7 цифр');
                hasError = true;
            }
            
            // Если есть ошибки - показываем сообщение и останавливаем отправку
            if (hasError) {
                alert('Пожалуйста, исправьте ошибки в форме');
                return;
            }
            
            // Здесь будет отправка на сервер
            console.log('Данные формы:', data);
            
            // Сообщение пользователю
            alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
            
            // Закрываем модальное окно
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Очищаем форму
            this.reset();
        });
        
        // Добавляем проверку при вводе для лучшего UX
        signupForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }

    // СВОРАЧИВАНИЕ/РАЗВОРАЧИВАНИЕ ОПИСАНИЙ СТИЛЕЙ ТАНЦЕВ 
    document.querySelectorAll('.style-top').forEach(top => {
        top.addEventListener('click', function() {
            const card = this.closest('.style-card');
            if (card) {
                card.classList.toggle('active');
            }
        });
    });

    //  FAQ АККОРДЕОН 
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const wasActive = faqItem.classList.contains('active');
            
            // Закрываем все вопросы
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Открываем текущий, если он был закрыт
            if (!wasActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ 
    
    // Показать ошибку под полем
    function showError(fieldName, message) {
        const field = signupForm.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        // Создаем элемент с ошибкой
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ff0000';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        
        // Добавляем стиль для поля с ошибкой
        field.style.borderColor = '#ff0000';
        
        // Вставляем сообщение об ошибке после поля
        const parent = field.parentNode;
        parent.appendChild(errorElement);
    }
    
    // Очистить ошибку для конкретного поля
    function clearFieldError(field) {
        field.style.borderColor = '';
        
        // Удаляем сообщение об ошибке
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Очистить все сообщения об ошибках
    function clearErrorMessages() {
        // Удаляем все сообщения об ошибках
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        
        // Убираем стили ошибок
        if (signupForm) {
            signupForm.querySelectorAll('input, textarea').forEach(field => {
                field.style.borderColor = '';
            });
        }
    }

});