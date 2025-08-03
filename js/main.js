function getColorValue(colorName) {
    const colors = {
        'light blue': '#70d6ff',
        'pink': '#e89b94',
        'orange': '#ffa500'
    };
    return colors[colorName] || '#84cb9f'; // Зеленый по умолчанию
}

//ЛОГИКА ВЫБОРА ДНЕЙ
document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('daysContainer');
    const monthHeader = document.getElementById('monthHeader');
    let currentDate = new Date();
    let touchStartX = 0;
    let touchEndX = 0;

    // Форматирование названий дней недели
    const dayNames = ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    // Инициализация
    updateWeekDisplay();

    // Обработчики свайпа
    daysContainer.addEventListener('touchstart', handleTouchStart, false);
    daysContainer.addEventListener('touchend', handleTouchEnd, false);
    daysContainer.addEventListener('mousedown', handleMouseStart, false);
    daysContainer.addEventListener('mouseup', handleMouseEnd, false);

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleMouseStart(e) {
        touchStartX = e.screenX;
    }

    function handleMouseEnd(e) {
        touchEndX = e.screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const threshold = 50; // Минимальная дистанция свайпа

        if (touchStartX - touchEndX > threshold) {
            // Свайп влево - следующая неделя
            currentDate.setDate(currentDate.getDate() + 7);
            updateWeekDisplay();
        } else if (touchEndX - touchStartX > threshold) {
            // Свайп вправо - предыдущая неделя
            currentDate.setDate(currentDate.getDate() - 7);
            updateWeekDisplay();
        }
    }

    function updateWeekDisplay() {
        daysContainer.innerHTML = '';
        monthHeader.textContent = `${monthNames[currentDate.getMonth()]} `;

        const monday = getMonday(new Date(currentDate));
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);

            const dayBlock = document.createElement('div');
            dayBlock.className = 'day-block';
            dayBlock.dataset.date = day.toISOString(); // Сохраняем дату

            if (day.toDateString() === today.toDateString()) {
                dayBlock.classList.add('current-day');
            }

            // Создаём элементы дня
            const dayNameElement = document.createElement('div');
            dayNameElement.className = 'day-name';
            dayNameElement.textContent = dayNames[day.getDay()];

            const dayNumberElement = document.createElement('div');
            dayNumberElement.className = 'day-number';
            dayNumberElement.textContent = day.getDate();

            // Добавляем в DOM
            dayBlock.appendChild(dayNameElement);
            dayBlock.appendChild(dayNumberElement);
            daysContainer.appendChild(dayBlock);

            // --- ОБРАБОТЧИК ДОБАВЛЯЕМ ЗДЕСЬ --- //
            dayBlock.addEventListener('click', function() {
                // Убираем выделение у всех дней
                document.querySelectorAll('.day-block').forEach(d => {
                    d.classList.remove('selected-day');
                });

                // Выделяем текущий день
                this.classList.add('selected-day');

                // Показываем привычки для этого дня
                showHabitsForDay(this);
            });
        }
    }

    // Функция для получения понедельника текущей недели
    function getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Коррекция для воскресенья
        return new Date(d.setDate(diff));
    }
});

const selectedDay = document.querySelectorAll('.day-block');

// Обработчик клика на день
selectedDay.forEach(block => {
    block.addEventListener('click', function() {
        // Выделяем текущий день
        this.classList.add('current-day');
    });
});



//ЛОГИКА ПЕРЕКЛЮЧЕНИЯ РАЗДЕЛОВ

document.addEventListener("DOMContentLoaded", function() {
    // Получаем все кнопки и блоки
    const buttons = document.querySelectorAll('.btn-foot');
    const blocks = document.querySelectorAll('.section');

    // Функция сброса активных состояний
    function resetActive() {
        buttons.forEach(button => button.classList.remove('button-active'));
        blocks.forEach(block => block.classList.remove('active'));
    }

    // Обработчик клика на кнопку
    buttons.forEach(button => {
        button.addEventListener('click', function() {

            resetActive();

            // Добавляем активный класс к нажатой кнопке
            this.classList.add('button-active');


            // Находим соответствующий блок и показываем его
            const targetBlock = document.getElementById(this.getAttribute('data-target'));
            if (targetBlock) {
                targetBlock.classList.add('active');
            }
        });
    });

    // По умолчанию активируем первую кнопку и блок
    if (buttons.length > 0 && blocks.length > 0) {
        buttons[0].classList.add('button-active');
        blocks[0].classList.add('active');
    }
});






//ЛОГИКА ОТКРЫТИЯ И ЗАКРЫТИЯ ФОРМЫ ДЛЯ ДОБАВЛЕНИЯ ПРИВЫЧЕК

const form_addHabits = document.querySelector('.form_addHabits');
// Логика свайпа формы
let startY = 0;
let isSwiping = false;

form_addHabits.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY; // Используем clientY вместо pageY
    isSwiping = false;
});

form_addHabits.addEventListener('touchmove', function(e) {
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - startY;

    if (deltaY > 0) {
        form_addHabits.style.transform = `translateY(${deltaY}px)`;
        isSwiping = true; // Подтверждаем, что это свайп
    }
    e.preventDefault(); // Предотвращаем скролл страницы
});

form_addHabits.addEventListener('touchend', function(e) {
    if (!isSwiping) return; // Если не было свайпа — ничего не делаем

    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 100) {
        closeForm();
    } else {
        form_addHabits.style.transform = 'translateY(0)';
    }
});

// Закрытие формы с анимацией
function closeForm() {
    form_addHabits.style.transform = 'translateY(100%)';
    setTimeout(() => {
        form_addHabits.style.display = 'none';
    }, 300);
}

document.addEventListener('click', function(e) {
    // Если клик вне формы и не по кнопке добавления
    if (!form_addHabits.contains(e.target) && e.target !== btn_addHabits) {
        closeForm();
    }
});

//ЛОГИКА РАБОТЫ КНОПКИ ОТКРЫТИЯ ФОРМЫ

const btn_addHabits = document.querySelector('.btn_addHabits');
btn_addHabits.addEventListener('click', function() {

    form_addHabits.style.display = 'block';
    form_addHabits.style.transform = 'translateY(0)';
})

//ЛОГИКА РАБОТЫ ВЫПАДАЮЩЕГО СПИСКА ВЫБОРА ИКОНКИ

document.addEventListener('DOMContentLoaded', function() {
    const selectedIcon = document.getElementById('selectedIcon');
    const iconDropdown = document.getElementById('iconDropdown');
    const iconOptions = document.querySelectorAll('.icon-option');
    const triangleIcon = selectedIcon.querySelector('img[src="icons/icon-dropdown.png"]'); // Находим треугольник

    // Открытие и закрытие выпадающего списка
    selectedIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        iconDropdown.classList.toggle('show');
    });

    // Выбор иконки
    iconOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const iconImg = this.querySelector('img').cloneNode(true);
            const iconName = this.dataset.icon;

            // 2. Сохраняем в скрытое поле
            document.getElementById('habitIcon').value = iconName;


            // Очищаем только первую иконку (основную), оставляя треугольник
            const mainIcon = selectedIcon.querySelector('img:not([src="icons/icon-dropdown.png"])');
            if (mainIcon) {
                selectedIcon.removeChild(mainIcon);
            }

            // Вставляем новую иконку перед треугольником
            selectedIcon.insertBefore(iconImg, triangleIcon);

            // Сохраняем выбранную иконку
            document.getElementById('habitIcon').value = this.dataset.icon;

            console.log('Выбрана иконка:', iconName);

            // Закрываем dropdown
            iconDropdown.classList.remove('show');
        });
    });

    // Закрытие при клике вне списка
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.icon-picker')) {
            iconDropdown.classList.remove('show');
        }
    });
});

//ЛОГИКА РАБОТЫ ВЫПАДАЮЩЕГО СПИСКА ВЫБОРА ЦВЕТА

document.addEventListener('DOMContentLoaded', function() {
    const selectedColor = document.getElementById('selectedColor');
    const colorDropdown = document.getElementById('colorDropdown');
    const colorOptions = document.querySelectorAll('.color-option');
    const selected = document.getElementById('selected'); // Круг для отображения цвета

    // Открытие/закрытие выпадающего списка
    selectedColor.addEventListener('click', function(e) {
        e.stopPropagation(); // Предотвращаем всплытие
        colorDropdown.classList.toggle('show');
    });

    // Выбор цвета
    colorOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const color = this.dataset.color;

            // 1. Визуально показываем выбранный цвет
            selected.style.backgroundColor = getColorValue(color);

            // 2. Сохраняем значение в скрытое поле
            document.getElementById('habitColor').value = color;

            // 3. Закрываем dropdown
            colorDropdown.classList.remove('show');
        });
    });

    // Закрытие при клике вне списка
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.color-picker')) {
            colorDropdown.classList.remove('show');
        }
    });

    // Функция для получения HEX-кода цвета
    function getColorValue(colorName) {
        const colors = {
            'light blue': '#70d6ff',
            'pink': '#e89b94',
            'orange': '#ffa500'
        };
        return colors[colorName] || '#333333';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('CheckGoalForHabit');
    const daysContainer = document.getElementById('noDailyHabits');

    // Обработчик изменения состояния переключателя
    checkbox.addEventListener('change', function() {
        if(this.checked) {
            daysContainer.classList.add('hide');
        } else {
            daysContainer.classList.remove('hide');
        }
    });

    // Обработчики для выбора дней недели
    document.querySelectorAll('.weekday, .weekend').forEach(day => {
        day.addEventListener('click', function() {
            this.classList.toggle('selected');

            // Добавим анимацию для лучшей обратной связи
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    let touchStartX = 0;
    const slider = document.querySelector('.slider');

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (Math.abs(touchEndX - touchStartX) > 30) { // Минимальная дистанция свайпа
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
});


// ЛОГИКА ДОБАВЛЕНИЯ НОВЫХ ПРИВЫЧЕК
document.addEventListener('DOMContentLoaded', function() {
    const saveHabit = document.querySelector('.btn_saveHabit');
    const habitsContainer = document.querySelector('#Habits');
    const nameHabitInput = document.getElementById('nameHabit');
    const habitColorInput = document.getElementById('habitColor');
    const habitIconInput = document.getElementById('habitIcon');

    saveHabit.addEventListener('click', function() {
        // Получаем значения из формы
        const habitName = nameHabitInput.value.trim();
        const habitColor = habitColorInput.value;
        const iconName = habitIconInput.value;

        // Проверяем, что название привычки не пустое
        if (!habitName) {
            alert('Пожалуйста, введите название привычки');
            return;
        }

        // Создаём объект привычки
        const newHabit = {
            id: Date.now(), // Уникальный ID
            name: habitName,
            color: habitColor,
            icon: iconName,
            created: new Date().toISOString(),
            completed: false,
            isDaily: document.getElementById('CheckGoalForHabit').checked,
            days: getSelectedDays()
        };

        // Создаём DOM-элемент
        const habitElement = document.createElement('div');
        habitElement.className = 'habit';
        habitElement.innerHTML = `
            <div><img src="icons/iconsTeg/icon-${newHabit.icon}.png" height="24" width="24"/></div>
            <p>${newHabit.name}</p>
        `;

        // Добавляем стиль цвета, если он выбран
        if (newHabit.color) {
            const colorValue = getColorValue(newHabit.color);
            habitElement.style.backgroundColor = colorValue;
        }

        // Добавляем в список привычек
        habitsContainer.appendChild(habitElement);

        // Сохраняем в localStorage
        saveHabitToStorage(newHabit);

        // Очищаем форму
        nameHabitInput.value = '';
        closeForm();
    });

    // Функция для получения выбранных дней
    function getSelectedDays() {
        const selectedDays = [];
        document.querySelectorAll('.weekday.selected, .weekend.selected').forEach(day => {
            selectedDays.push(day.textContent);
        });
        return selectedDays;
    }

    // Функция сохранения в localStorage
    function saveHabitToStorage(habit) {
        let habits = JSON.parse(localStorage.getItem('habits')) || [];
        habits.push(habit);
        localStorage.setItem('habits', JSON.stringify(habits));
        // После сохранения привычки
        localStorage.setItem('habits', JSON.stringify(habits));
        initSwipeHabits(); // Переинициализируем свайп
    }

    // Функция для получения HEX-кода цвета (добавьте если нет)
    function getColorValue(colorName) {
        const colors = {
            'light blue': '#70d6ff',
            'pink': '#e89b94',
            'orange': '#ffa500'
        };
        return colors[colorName] || '#84cb9f'; // Зеленый по умолчанию
    }
});

// Функция отображения привычек для выбранного дня
function showHabitsForDay(dayBlock) {
    const dayName = dayBlock.querySelector('.day-name').textContent;
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const unfulfilledContainer = document.getElementById('unfulfilledHabits');
    const fulfilledContainer = document.getElementById('fulfilledHabits');

    // Очищаем контейнеры
    unfulfilledContainer.innerHTML = '<span>Habits</span>';
    fulfilledContainer.innerHTML = '<span>Done</span>';

    const filteredHabits = habits.filter(habit => {
        return habit.isDaily || (habit.days && habit.days.includes(dayName));
    });

    filteredHabits.forEach(habit => {
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-swipe-container';
        habitElement.dataset.id = habit.id;

        habitElement.innerHTML = `
            <div class="habit-main-content ${habit.completed ? 'completed' : ''}">
                <img src="icons/iconsTeg/icon-${habit.icon}.png" width="24" height="24">
                <p>${habit.name}</p>
            </div>
            ${!habit.completed ? `
            <div class="habit-action habit-complete">
                <span>✓ Выполнено</span>
            </div>` : ''}
        `;

        if (habit.color) {
            habitElement.querySelector('.habit-main-content').style.backgroundColor = getColorValue(habit.color);
        }

        // Добавляем в соответствующий контейнер
        if (habit.completed) {
            fulfilledContainer.appendChild(habitElement);
        } else {
            unfulfilledContainer.appendChild(habitElement);
        }
    });

    // Инициализируем свайп для новых элементов
    initSwipeHabits();
}
// В обработчике переключения на раздел "Привычки"
document.querySelector('.btn-foot[data-target="Habits"]').addEventListener('click', function() {
    showAllHabits();
});

function showAllHabits() {
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const habitsContainer = document.querySelector('#Habits .habits-list'); // Создайте этот контейнер

    habitsContainer.innerHTML = ''; // Очищаем контейнер

    habits.forEach(habit => {
        const habitElement = document.createElement('div');
        habitElement.className = 'habit';
        habitElement.innerHTML = `
            <div><img src="icons/iconsTeg/icon-${habit.icon}.png" height="24" width="24"/></div>
            <p>${habit.name}</p>
            
        `;

        if (habit.color) {
            habitElement.style.backgroundColor = getColorValue(habit.color);
        }

        habitsContainer.appendChild(habitElement);
    });
}

// ЛОГИКА СВАЙПА ПРИВЫЧЕК ДЛЯ ВЫПОЛНЕНИЯ
function initSwipeHabits() {
    document.querySelectorAll('.habit-swipe-container').forEach(container => {
        let startX = 0;
        let isSwiping = false;

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            container.style.transition = 'none'; // Убираем анимацию во время свайпа
        });

        container.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;

            // Ограничиваем свайп до 120px
            if (Math.abs(diffX) > 120) return;

            // Двигаем только влево (для выполнения) или в обе стороны (для удаления)
            if (diffX > 0 || container.closest('#Habits')) {
                container.style.transform = `translateX(-${Math.abs(diffX)}px`;
            }
        });

        container.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            isSwiping = false;
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            // Определяем действие
            if (diffX > 60) {
                completeHabit(container); // Свайп влево → выполнение
            } else if (diffX < -60 && container.closest('#Habits')) {
                showDeleteButton(container); // Свайп вправо → удаление (только в разделе Habits)
            } else {
                container.style.transform = ''; // Возвращаем на место
            }
        });
    });
}



// Функция отметки привычки выполненной (исправленная)
function completeHabit(habitElement) {
    if (!habitElement) return;

    // Вибрация (если поддерживается)
    if (navigator.vibrate) navigator.vibrate(50);

    const habitContent = habitElement.querySelector('.habit-main-content');
    if (!habitContent) return;
    // 1. Удаляем блок действия перед перемещением
    const actionBlock = habitElement.querySelector('.habit-action.habit-complete');
    if (actionBlock) {
        actionBlock.remove();
    }

    // 1. Визуальные изменения
    habitContent.classList.add('completed');

    // 2. Анимация
    habitElement.style.transition = 'all 0.3s ease';
    const startHeight = habitElement.offsetHeight;
    habitElement.style.height = `${startHeight}px`;

    // Даем время для применения начальной высоты
    requestAnimationFrame(() => {
        habitElement.style.height = '0';
        habitElement.style.opacity = '0';
        habitElement.style.margin = '0';

        setTimeout(() => {
            // 3. Переносим в раздел выполненных
            const fulfilledContainer = document.getElementById('fulfilledHabits');
            if (fulfilledContainer) {
                fulfilledContainer.appendChild(habitElement);

                // 4. Восстанавливаем стили
                setTimeout(() => {
                    habitElement.style.height = '';
                    habitElement.style.opacity = '';
                    habitElement.style.margin = '';
                    habitContent.style.transform = '';

                    // 5. Обновляем данные в localStorage
                    updateHabitInStorage(habitElement, true);
                }, 50);
            }
        }, 300);
    });
}

// Обновляем статус привычки в хранилище
function updateHabitInStorage(habitElement, isCompleted) {
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const habitId = parseInt(habitElement.dataset.id);

    const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
            return {...habit, completed: isCompleted, completedDate: new Date().toISOString()};
        }
        return habit;
    });

    localStorage.setItem('habits', JSON.stringify(updatedHabits));

    if (!habitElement || !habitElement.dataset.id) return;
}

// Вызываем инициализацию при загрузке и после добавления новых привычек
document.addEventListener('DOMContentLoaded', initSwipeHabits);


// ЛОГИКА СВАЙПА ПРИВЫЧЕК ДЛЯ УДАЛЕНИЯ И РЕДАКТИРОВАНИЯ
// ЛОГИКА СВАЙПА ПРИВЫЧЕК

// Функция отметки привычки выполненной
function completeHabit(habitElement) {
    // Вибрация (если поддерживается)
    if (navigator.vibrate) navigator.vibrate(50);

    // Визуальные изменения
    const content = habitElement.querySelector('.habit-main-content');
    content.classList.add('completed');

    // Анимация
    habitElement.style.transition = 'all 0.3s ease';
    habitElement.style.height = `${habitElement.offsetHeight}px`;

    setTimeout(() => {
        habitElement.style.height = '0';
        habitElement.style.opacity = '0';
        habitElement.style.margin = '0';

        setTimeout(() => {
            // Переносим в раздел выполненных
            const fulfilledContainer = document.getElementById('fulfilledHabits');
            if (fulfilledContainer) {
                fulfilledContainer.appendChild(habitElement);
            }

            // Восстанавливаем стили
            habitElement.style.height = '';
            habitElement.style.opacity = '';
            habitElement.style.margin = '';
            content.style.transform = '';

            // Обновляем данные
            updateHabitInStorage(habitElement, true);
        }, 300);
    }, 10);
}

// Функция показа дополнительных действий
function showDeleteButton(container) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.style.backgroundColor = '#ff6b6b';

    deleteBtn.addEventListener('click', () => {
        container.remove();
        removeHabitFromStorage(container.dataset.id);
    });

    container.appendChild(deleteBtn);
}

// Функция редактирования привычки
function editHabit(habitElement) {
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const habitId = parseInt(habitElement.dataset.id);
    const habit = habits.find(h => h.id === habitId);

    if (!habit) return;

    // Заполняем форму редактирования
    document.getElementById('nameHabit').value = habit.name;
    document.getElementById('habitColor').value = habit.color;
    document.getElementById('habitIcon').value = habit.icon;
    document.getElementById('CheckGoalForHabit').checked = habit.isDaily;

    // Выбираем дни недели
    document.querySelectorAll('.weekday, .weekend').forEach(day => {
        if (habit.days && habit.days.includes(day.textContent)) {
            day.classList.add('selected');
        } else {
            day.classList.remove('selected');
        }
    });

    // Показываем форму
    form_addHabits.style.display = 'block';

    // Удаляем старую привычку при сохранении
    const originalSave = saveHabit.click;
    saveHabit.onclick = function() {
        const updatedHabits = habits.filter(h => h.id !== habitId);
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        originalSave();
        saveHabit.onclick = originalSave;
    };
}

// Функция удаления привычки
function deleteHabit(habitElement) {

        // Анимация удаления
        habitElement.style.transition = 'all 0.3s ease';
        habitElement.style.height = `${habitElement.offsetHeight}px`;

        setTimeout(() => {
            habitElement.style.height = '0';
            habitElement.style.opacity = '0';
            habitElement.style.margin = '0';

            setTimeout(() => {
                habitElement.remove();

                // Обновляем хранилище
                const habits = JSON.parse(localStorage.getItem('habits')) || [];
                const habitId = parseInt(habitElement.dataset.id);
                const updatedHabits = habits.filter(h => h.id !== habitId);
                localStorage.setItem('habits', JSON.stringify(updatedHabits));
            }, 300);
        }, 10);

}

// Обновляем статус привычки в хранилище
function updateHabitInStorage(habitElement, isCompleted) {
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const habitId = parseInt(habitElement.dataset.id);

    const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
            return {
                ...habit,
                completed: isCompleted,
                completedDate: isCompleted ? new Date().toISOString() : null
            };
        }
        return habit;
    });

    localStorage.setItem('habits', JSON.stringify(updatedHabits));
}


// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initSwipeHabits();

    // Также вызываем initSwipeHabits() после:
    // 1. Добавления новой привычки
    // 2. Загрузки привычек для дня
    // 3. Переключения между разделами
});