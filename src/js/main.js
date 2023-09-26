import {
	playfield,
	figures,
	main,
	gameOver,
	levelElem,
	scoreElem,
	nextTetroElem,
	startBtn,
	pauseBtn,
	levelsLimits,
	state
} from './statments.js'; // импортируем состояния

// рандомайзер номера цвета, далее пригодится для установки на стиль нашей фигуры
const setColor = () => {
	const res = Math.ceil(Math.random() * 6);
	console.log(res);
	return res; // здесь мы получим рандомный цвет для нашей фигуры
}
const color = setColor(); // получили цвет
let activeTetro = getNewTetro();  // сгенерировали текущую фигуру
let nextTetro = getNewTetro(); // сгенерировали следующую фигуру

function renderField() { // рендерим поле, где также есть наша движущаяся фигура и уже упавшие ячейки
	let innerHTML = '';
	for (let y = 0; y < playfield.length; y++) {
		for (let x = 0; x < playfield[y].length; x++) {
			if (playfield[y][x] === 1) {
				innerHTML += `<div class="cell movingCell color${activeTetro.color}"></div>`;
			} else if (playfield[y][x] === 2) {
				innerHTML += `<div class="cell movingCell fixedCell color${color}"></div>`;
			} else {
				innerHTML += '<div class="cell"></div>';
			}
		}
	}
	main.innerHTML = innerHTML;
}

function renderNextTetro() { // рендерим след фигуру также как и поле
	let nextTetroInnerHTML = '';
	for (let y = 0; y < nextTetro.shape.length; y++) {
		for (let x = 0; x < nextTetro.shape[y].length; x++) {
			if (nextTetro.shape[y][x]) {
				nextTetroInnerHTML += `<div class="cell movingCell color${nextTetro.color}"></div>`;
			} else {
				nextTetroInnerHTML += '<div class="cell"></div>';
			}
		}
		nextTetroInnerHTML += '<br/>'
	}
	nextTetroElem.innerHTML = nextTetroInnerHTML;
}

function changeStatusTetro() { // когда фигура дошла до низа - меняем статус ее ячеек
	for (let y = 0; y < playfield.length; y++) {
		for (let x = 0; x < playfield[y].length; x++) {
			if (playfield[y][x] === 1) {
				playfield[y][x] = 0;
			}
		}
	}
}

function throwActiveTetro() { // при запуске новой фигуры - чистим старую и добавляем новую
	changeStatusTetro();
	for (let y = 0; y < activeTetro.shape.length; y++) {
		for (let x = 0; x < activeTetro.shape[y].length; x++) {
			if (activeTetro.shape[y][x] === 1) {
				playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
			}
		}
	}
}

function rotateTetro() { // фукнция повора фигуры путем смещения координат
	const prevTetroState = activeTetro.shape;
	
	activeTetro.shape = activeTetro.shape[0].map((val, index) =>
		activeTetro.shape.map((row) => row[index]).reverse()
	);
	
	if (isCrossed()) { // проверяем на пересечение фигур
		activeTetro.shape = prevTetroState;
	}
}

function isCrossed() { // проверяем на совпадение координат у фигур, чтоб фигура не вылазила за границы поля
	for (let y = 0; y < activeTetro.shape.length; y++) {
		for (let x = 0; x < activeTetro.shape[y].length; x++) {
			if (activeTetro.shape[y][x] &&
				(playfield[activeTetro.y + y] === undefined ||
					playfield[activeTetro.y + y][activeTetro.x + x] === undefined ||
					playfield[activeTetro.y + y][activeTetro.x + x] === 2)
			) {
				return true;
			}
		}
	}
	return false;
}

function removeFullLines() { // проверяем, удаляем полную строчку/ строки и начисляем баллы
	let removeBoolean = true, // апруф на удаление строки
		numLines = 0;
	for (let y = 0; y < playfield.length; y++) {
		for (let x = 0; x < playfield[y].length; x++) {
			if (playfield[y][x] !== 2) {  // если строчка не заполнена - меняем статус на нельзя удалят
				removeBoolean = false;
				break;
			}
		}
		if (removeBoolean) { // если все строчки заполнены - заменяем строку на строку нулей
			playfield.splice(y, 1);
			playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]);
			numLines += 1;
		}
		removeBoolean = true;
	}
	
	switch (numLines) { // посчитываем комбо кейсы
		case 1:
			state.score += levelsLimits[state.currentLevel].scorePerLine;
			break;
		case 2:
			state.score += levelsLimits[state.currentLevel].scorePerLine * 3;
			break;
		case 3:
			state.score += levelsLimits[state.currentLevel].scorePerLine * 6;
			break;
		case 4:
			state.score += levelsLimits[state.currentLevel].scorePerLine * 12;
			break;
	}
	
	scoreElem.innerHTML = state.score; // установим новыц счет
	
	if (state.score >= levelsLimits[state.currentLevel].nextLevelScore) { // проверяем на соответствие уровню
		state.currentLevel++;
		levelElem.innerHTML = state.currentLevel;
	}
}

function getNewTetro() { // рандомайзер новых фигур
	const possibleFigures = 'IOLJTSZ';
	const rand = Math.floor(Math.random() * 7);
	const newTetro = figures[possibleFigures[rand]];
	
	return { // вернем объект фигуры
		x: Math.floor((10 - newTetro[0].length) / 2),
		y: 0,
		shape: newTetro,
		color: setColor()
	};
}

function fixTetro() { // меняем статус ячеек упавшей фигуры на статик
	for (let y = 0; y < playfield.length; y++) {
		for (let x = 0; x < playfield[y].length; x++) {
			if (playfield[y][x] === 1) {
				playfield[y][x] = 2;
			}
		}
	}
}

function moveDown() {  // сдвигаем фигуру вниз
	activeTetro.y += 1;
	if (isCrossed()) { // если будет пересечение с нижними фигурам - меняем ячеек фигуры на статик
		activeTetro.y -= 1;
		fixTetro();
		removeFullLines(); // проверяем на заполненность линии
		activeTetro = nextTetro; // забираем след фигуру на "выдачу"
		if (isCrossed()) { // если все равно пересечение - ты проиграл
			reset();
			// alert('game over');
		}
		nextTetro = getNewTetro(); // генерим новую след фигуру
	}
}

function dropeTetro() { // сброс фигуры
	for (let y = activeTetro.y; y < playfield.length; y++) {
		activeTetro.y += 1;
		if (isCrossed()) { // если есть персечение - прерываем сброс
			activeTetro.y -= 1;
			break;
		}
	}
}

function reset() { // очистка поля к новой игре
	state.isPaused = true;
	clearTimeout(state.gameTimeID); // ичистка таймера игры
	playfield = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	];
	
	renderField();
	gameOver.style.display = 'block';
}

document.onkeydown = function (e) { // устанавливем слушателей на клавиши
	if (!state.isPaused) {
		if (e.keyCode === 37) { // сдвиг влево при нажатии стрелки влево
			activeTetro.x -= 1;
			if (isCrossed()) { // проверка на пересечения
				activeTetro.x += 1;
			}
		} else if (e.keyCode === 39) { // сдвиг направо при нажатии стрелки вправо
			activeTetro.x += 1;
			if (isCrossed()) { // проверка на пересечения
				activeTetro.x -= 1;
			}
		} else if (e.keyCode === 40) {  // сброс фигуры при нажатии стрелки вниз
			moveDown();
		} else if (e.keyCode === 38) { // разворот фигуры при нажатии стрелки наверх
			rotateTetro();
		} else if (e.keyCode === 32) { // полный сброс фигуры
			e.preventDefault()
			dropeTetro();
		}
		updateGameState(); // обновить состояние игры
	}
};

function updateGameState() { // если нет паузы - добавляем падающую фигуру и перерисовываем игровое поле
	if (!state.isPaused) {
		throwActiveTetro();
		renderField();
		renderNextTetro();  // перерисовываем след фигуру
	}
}

pauseBtn.addEventListener('click', (e) => { // слушатель на паузу
	if (e.target.innerHTML === 'Pause') { // меняем слова на кнопках
		e.target.innerHTML = 'Continue'
		clearTimeout(state.gameTimeID); // очищаем таймер
	} else {
		e.target.innerHTML = 'Pause'
		state.gameTimeID = setTimeout(startGame, levelsLimits[state.currentLevel].speed);  // запускаем игру
	}
	state.isPaused = !state.isPaused; // меняем состояние паузы
});

startBtn.addEventListener('click', (e) => { // слушатель на старт
	if (e.target.innerHTML === 'Start') { // меняем названия кнопки
		e.target.innerHTML = 'Start again';
		state.isPaused = false; // меняем состояние паузы
		state.gameTimeID = setTimeout(startGame, levelsLimits[state.currentLevel].speed);  // запускаем игру
	} else {
		clearTimeout(state.gameTimeID)   // очищаем таймер
		gameOver.style.display = 'block'; // показываем сообщение конец игры
		setTimeout(() => window.location.reload(), 1000); // обновляем страницу
	}
});
// передаем данные в табло
scoreElem.innerHTML = state.score;
levelElem.innerHTML = state.currentLevel;

renderField(); // рендерим поле

function startGame() { // вызов игры
	moveDown(); // начинаем двидениеи фигуры вниз
	if (!state.isPaused) {
		updateGameState(); // обновляем состояния игры
		state.gameTimeID = setTimeout(startGame, levelsLimits[state.currentLevel].speed); // записываем текущий такмер в состояние
	}
}