// начинаем с поля - у нас это матрица нулей 10 на 20
export let playfield = [];
export function initPlayField() {
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
}
// заготовки фигур
export let figures = {
	O: [
		[1, 1],
		[1, 1],
	],
	I: [
		[0, 0, 0, 0,],
		[1, 1, 1, 1,],
		[0, 0, 0, 0,],
		[0, 0, 0, 0,],
	],
	S: [
		[0, 1, 1,],
		[1, 1, 0,],
		[0, 0, 0,],
	],
	Z: [
		[1, 1, 0,],
		[0, 1, 1,],
		[0, 0, 0,],
	],
	L: [
		[1, 0, 0,],
		[1, 1, 1,],
		[0, 0, 0,],
	],
	J: [
		[0, 0, 1,],
		[1, 1, 1,],
		[0, 0, 0,],
	],
	T: [
		[1, 1, 1,],
		[0, 1, 0,],
		[0, 0, 0,],
	],
}


// выбираем необходимые html элементы
export let main = document.querySelector(".playfield__container");
export const scoreElem = document.getElementById('game__score');
export const levelElem = document.getElementById('game__level');
export const nextTetroElem = document.getElementById('next-tetro');
export const startBtn = document.getElementById('game__start');
export const pauseBtn = document.getElementById('game__pause');
export const gameOver = document.getElementById('game-over');

export const state = {
	score: 0, // состояние счета
	gameTimeID: null, // переменная для таймера
	currentLevel: 1, // состояние уровня
	isPaused: true // состояние паузы
}

export const levelsLimits = { // рамки уровней
	1: {
		scorePerLine: 10,
		speed: 400,
		nextLevelScore: 100,
	},
	2: {
		scorePerLine: 15,
		speed: 300,
		nextLevelScore: 250,
	},
	3: {
		scorePerLine: 20,
		speed: 250,
		nextLevelScore: 500,
	},
	4: {
		scorePerLine: 30,
		speed: 175,
		nextLevelScore: 750,
	},
	5: {
		scorePerLine: 50,
		speed: 100,
		nextLevelScore: Infinity,
	},
};

initPlayField();