// Данные игры
const gameData = {
  alphabets: {
    russian: ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я"],
    english: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  },
  defaultSettings: {
    language: "russian",
    roundTime: 60,
    excludedLetters: [],
    players: ["Игрок 1", "Игрок 2"]
  }
};

// Состояние игры
let gameState = {
  currentPage: 'settings',
  gameStatus: 'waiting', // waiting, playing, finished
  settings: {
    language: "russian",
    roundTime: 60,
    excludedLetters: [],
    players: ["Игрок 1", "Игрок 2"]
  },
  players: ["Игрок 1", "Игрок 2"],
  currentPlayerIndex: 0,
  currentLetter: '',
  remainingLetters: [],
  usedLetters: [],
  scores: {},
  currentRoundPoints: 0,
  timeLeft: 0,
  timer: null,
  totalRound: 1
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, initializing app...');
  initializeApp();
});

function initializeApp() {
  console.log('Initializing app...');
  setupLanguageSelection();
  setupTimeSlider();
  setupPlayerManagement();
  setupGameControls();
  updatePlayersDisplay();
  updateLettersGrid();
  console.log('App initialization complete');
}

// Настройка выбора языка
function setupLanguageSelection() {
  const languageSelect = document.getElementById('language-select');
  console.log('Language select element:', languageSelect);

  if (languageSelect) {
    languageSelect.value = gameState.settings.language;

    languageSelect.addEventListener('change', function (e) {
      console.log('Language changed to:', e.target.value);
      gameState.settings.language = e.target.value;
      gameState.settings.excludedLetters = [];
      updateLettersGrid();
    });

    console.log('Language selection setup complete');
  } else {
    console.error('Language select element not found');
  }
}

function updateLettersGrid() {
  const lettersGrid = document.getElementById('letters-grid');
  const alphabet = gameData.alphabets[gameState.settings.language];

  console.log('Updating letters grid for language:', gameState.settings.language);

  if (!lettersGrid) {
    console.error('Letters grid element not found');
    return;
  }

  lettersGrid.innerHTML = '';

  alphabet.forEach(letter => {
    const letterDiv = document.createElement('div');
    letterDiv.className = 'letter-checkbox';
    letterDiv.setAttribute('data-letter', letter);
    letterDiv.innerHTML = `<span>${letter}</span>`;

    const isExcluded = gameState.settings.excludedLetters.includes(letter);
    if (isExcluded) {
      letterDiv.classList.add('excluded');
    }

    letterDiv.addEventListener('click', function () {
      console.log('Letter clicked:', letter);
      toggleLetterExclusion(letter, letterDiv);
    });

    lettersGrid.appendChild(letterDiv);
  });
}

function toggleLetterExclusion(letter, element) {
  const isCurrentlyExcluded = gameState.settings.excludedLetters.includes(letter);

  if (isCurrentlyExcluded) {
    gameState.settings.excludedLetters = gameState.settings.excludedLetters.filter(l => l !== letter);
    element.classList.remove('excluded');
  } else {
    gameState.settings.excludedLetters.push(letter);
    element.classList.add('excluded');
  }

  console.log('Excluded letters:', gameState.settings.excludedLetters);
}

// Настройка слайдера времени
function setupTimeSlider() {
  const timeSlider = document.getElementById('time-slider');
  const timeDisplay = document.getElementById('time-display');

  console.log('Time slider element:', timeSlider);
  console.log('Time display element:', timeDisplay);

  if (timeSlider && timeDisplay) {
    timeSlider.value = gameState.settings.roundTime;
    timeDisplay.textContent = gameState.settings.roundTime;

    timeSlider.addEventListener('input', function (e) {
      gameState.settings.roundTime = parseInt(e.target.value);
      timeDisplay.textContent = e.target.value;
      console.log('Round time changed to:', gameState.settings.roundTime);
    });

    console.log('Time slider setup complete');
  } else {
    console.error('Time slider or display element not found');
  }
}

// Управление игроками
function setupPlayerManagement() {
  const playerNameInput = document.getElementById('player-name-input');
  const addPlayerBtn = document.getElementById('add-player-btn');

  console.log('Player name input:', playerNameInput);
  console.log('Add player button:', addPlayerBtn);

  if (addPlayerBtn) {
    addPlayerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('Add player button clicked');
      addPlayer();
    });
  }

  if (playerNameInput) {
    playerNameInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log('Enter pressed in player input');
        addPlayer();
      }
    });
  }

  console.log('Player management setup complete');
}

function addPlayer() {
  const playerNameInput = document.getElementById('player-name-input');
  if (!playerNameInput) {
    console.error('Player name input not found');
    return;
  }

  const name = playerNameInput.value.trim();
  console.log('Adding player:', name);

  if (name && !gameState.players.includes(name)) {
    gameState.players.push(name);
    playerNameInput.value = '';
    updatePlayersDisplay();
    console.log('Player added successfully. Current players:', gameState.players);
  } else if (!name) {
    console.log('Empty name, not adding player');
  } else {
    console.log('Player already exists:', name);
  }
}

function removePlayer(playerName) {
  console.log('Removing player:', playerName);
  gameState.players = gameState.players.filter(p => p !== playerName);
  updatePlayersDisplay();
  console.log('Player removed. Current players:', gameState.players);
}

window.removePlayer = removePlayer;

function updatePlayersDisplay() {
  const playersList = document.getElementById('players-list');

  if (!playersList) {
    console.error('Players list element not found');
    return;
  }

  console.log('Updating players display:', gameState.players);

  playersList.innerHTML = '';

  gameState.players.forEach(player => {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-item';
    playerDiv.innerHTML = `
      <span class="player-name">${player}</span>
      <button type="button" class="remove-player-btn" data-player="${player}">✕</button>
    `;

    const removeBtn = playerDiv.querySelector('.remove-player-btn');
    removeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const playerToRemove = e.target.getAttribute('data-player');
      console.log('Remove button clicked for:', playerToRemove);
      removePlayer(playerToRemove);
    });

    playersList.appendChild(playerDiv);
  });

  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) {
    startBtn.disabled = gameState.players.length < 2;
    console.log('Start button disabled:', gameState.players.length < 2);
  }
}

// Настройка внутриигровых действий
function setupGameControls() {
  const startGameBtn = document.getElementById('start-game-btn');

  console.log('Start game button:', startGameBtn);

  if (startGameBtn) {
    startGameBtn.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('Start game button clicked');
      startGame();
    });
  }

  console.log('Game controls setup complete');
}

function setupGamePageControls() {
  const startRoundBtn = document.getElementById('start-round-btn');
  const endRoundBtn = document.getElementById('end-round-btn');
  const endGameBtn = document.getElementById('end-game-btn');
  const plusPointBtn = document.getElementById('plus-point-btn');
  const minusPointBtn = document.getElementById('minus-point-btn');

  if (startRoundBtn) {
    startRoundBtn.addEventListener('click', function (e) {
      e.preventDefault();
      startRound();
    });
  }

  if (endRoundBtn) {
    endRoundBtn.addEventListener('click', function (e) {
      e.preventDefault();
      endRound();
    });
  }

  if (endGameBtn) {
    endGameBtn.addEventListener('click', function (e) {
      e.preventDefault();
      endGame();
    });
  }

  if (plusPointBtn) {
    plusPointBtn.addEventListener('click', function (e) {
      e.preventDefault();
      addPoint();
    });
  }

  if (minusPointBtn) {
    minusPointBtn.addEventListener('click', function (e) {
      e.preventDefault();
      removePoint();
    });
  }
}

function setupResultsPageControls() {
  const newGameBtn = document.getElementById('new-game-btn');
  const changeSettingsBtn = document.getElementById('change-settings-btn');

  if (newGameBtn) {
    newGameBtn.addEventListener('click', function (e) {
      e.preventDefault();
      newGame();
    });
  }

  if (changeSettingsBtn) {
    changeSettingsBtn.addEventListener('click', function (e) {
      e.preventDefault();
      changeSettings();
    });
  }
}

// Начало игры
function startGame() {
  console.log('Starting game...');

  if (gameState.players.length < 2) {
    alert('Добавьте минимум 2 игроков!');
    return;
  }

  const alphabet = gameData.alphabets[gameState.settings.language];
  gameState.remainingLetters = alphabet.filter(letter =>
    !gameState.settings.excludedLetters.includes(letter)
  );

  console.log('Remaining letters:', gameState.remainingLetters);

  if (gameState.remainingLetters.length === 0) {
    alert('Должна остаться хотя бы одна буква!');
    return;
  }

  gameState.remainingLetters = shuffleArray([...gameState.remainingLetters]);
  gameState.usedLetters = [];

  gameState.scores = {};
  gameState.players.forEach(player => {
    gameState.scores[player] = 0;
  });

  gameState.currentPlayerIndex = 0;
  gameState.totalRound = 1;
  gameState.gameStatus = 'waiting';

  console.log('Game state initialized:', gameState);

  showPage('game-page');
  setupGamePageControls();
  prepareNextRound();
}

// Подготовка следующего раунда
function prepareNextRound() {
  if (gameState.remainingLetters.length === 0) {
    endGame();
    return;
  }

  gameState.currentLetter = gameState.remainingLetters.shift();
  gameState.usedLetters.push(gameState.currentLetter);
  gameState.currentRoundPoints = 0;
  gameState.timeLeft = gameState.settings.roundTime;
  gameState.gameStatus = 'waiting';

  console.log('Next round prepared - Letter:', gameState.currentLetter);

  updateGameDisplay();
  updateGameUI();
}

// Запуск раунда
function startRound() {
  console.log('Starting round for player:', gameState.players[gameState.currentPlayerIndex]);

  gameState.gameStatus = 'playing';
  gameState.currentRoundPoints = 0;

  updateGameDisplay();
  updateGameUI();
  startTimer();
}

// Завершение раунда
function endRound() {
  console.log('Ending round');
  stopTimer();

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  gameState.scores[currentPlayer] += gameState.currentRoundPoints;

  console.log(`Round ended. ${currentPlayer} scored ${gameState.currentRoundPoints} points`);

  nextPlayer();
}

// Добавление очка
function addPoint() {
  if (gameState.gameStatus !== 'playing') return;

  gameState.currentRoundPoints++;
  updateGameDisplay();
  console.log('Point added. Current round points:', gameState.currentRoundPoints);
}

// Удаление очка
function removePoint() {
  if (gameState.gameStatus !== 'playing') return;
  if (gameState.currentRoundPoints <= 0) return;

  gameState.currentRoundPoints--;
  updateGameDisplay();
  console.log('Point removed. Current round points:', gameState.currentRoundPoints);
}

// Следующий игрок
function nextPlayer() {
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

  if (gameState.currentPlayerIndex === 0) {
    gameState.totalRound++;
  }

  prepareNextRound();
}

// Обновление игрового дисплея
function updateGameDisplay() {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const elements = {
    currentPlayerName: document.getElementById('current-player-name'),
    currentPlayerScore: document.getElementById('current-player-score'),
    currentLetter: document.getElementById('current-letter'),
    currentRound: document.getElementById('current-round'),
    totalRoundCounter: document.getElementById('total-round-counter'),
    lettersLeft: document.getElementById('letters-left'),
    roundPoints: document.getElementById('round-points')
  };

  if (elements.currentPlayerName) elements.currentPlayerName.textContent = currentPlayer;
  if (elements.currentPlayerScore) elements.currentPlayerScore.textContent = gameState.scores[currentPlayer];
  if (elements.currentLetter) elements.currentLetter.textContent = gameState.currentLetter;
  if (elements.currentRound) elements.currentRound.textContent = (gameState.currentPlayerIndex + 1);
  if (elements.totalRoundCounter) elements.totalRoundCounter.textContent = gameState.totalRound;
  if (elements.lettersLeft) elements.lettersLeft.textContent = gameState.remainingLetters.length;
  if (elements.roundPoints) elements.roundPoints.textContent = gameState.currentRoundPoints;

  updateScoreboard();
  updateUsedLetters();
  updateTimer();
}

// Обновление интерфейса в зависимости от состояния игры
function updateGameUI() {
  const startRoundBtn = document.getElementById('start-round-btn');
  const endRoundBtn = document.getElementById('end-round-btn');
  const pointsControl = document.getElementById('points-control');
  const notesCard = document.getElementById('notes-card');

  if (gameState.gameStatus === 'waiting') {
    // Ожидание начала раунда
    if (startRoundBtn) {
      startRoundBtn.style.display = 'block';
      startRoundBtn.textContent = 'Начать раунд';
    }
    if (endRoundBtn) endRoundBtn.style.display = 'none';
    if (pointsControl) pointsControl.style.display = 'none';
    if (notesCard) notesCard.style.display = 'none';

  } else if (gameState.gameStatus === 'playing') {
    // Раунд в процессе
    if (startRoundBtn) startRoundBtn.style.display = 'none';
    if (endRoundBtn) endRoundBtn.style.display = 'block';
    if (pointsControl) pointsControl.style.display = 'block';
    if (notesCard) notesCard.style.display = 'block';
  }
}

// Обновление табло
function updateScoreboard() {
  const scoreboard = document.getElementById('scoreboard');
  if (!scoreboard) return;

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  scoreboard.innerHTML = '';

  const sortedPlayers = [...gameState.players].sort((a, b) =>
    gameState.scores[b] - gameState.scores[a]
  );

  sortedPlayers.forEach(player => {
    const scoreItem = document.createElement('div');
    scoreItem.className = `score-item ${player === currentPlayer ? 'current' : ''}`;
    scoreItem.innerHTML = `
      <span class="player-name">${player}</span>
      <span class="player-score">${gameState.scores[player]}</span>
    `;
    scoreboard.appendChild(scoreItem);
  });
}

// Обновление использованных букв
function updateUsedLetters() {
  const usedLettersDisplay = document.getElementById('used-letters-display');
  if (!usedLettersDisplay) return;

  usedLettersDisplay.innerHTML = '';

  gameState.usedLetters.forEach(letter => {
    const letterSpan = document.createElement('span');
    letterSpan.className = 'used-letter';
    letterSpan.textContent = letter;
    usedLettersDisplay.appendChild(letterSpan);
  });
}

// Таймер
function startTimer() {
  stopTimer();

  gameState.timer = setInterval(() => {
    gameState.timeLeft--;
    updateTimer();

    if (gameState.timeLeft <= 0) {
      endRound();
    }
  }, 1000);
}

function stopTimer() {
  if (gameState.timer) {
    clearInterval(gameState.timer);
    gameState.timer = null;
  }
}

function updateTimer() {
  const timerElement = document.getElementById('timer');
  if (!timerElement) return;

  const minutes = Math.floor(gameState.timeLeft / 60);
  const seconds = gameState.timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  timerElement.textContent = timeString;

  timerElement.className = 'timer-display';
  if (gameState.timeLeft <= 10) {
    timerElement.classList.add('danger');
  } else if (gameState.timeLeft <= 30) {
    timerElement.classList.add('warning');
  }
}

// Завершение игры
function endGame() {
  console.log('Ending game');
  stopTimer();
  showResults();
}

// Показ результатов
function showResults() {
  const sortedPlayers = [...gameState.players].sort((a, b) =>
    gameState.scores[b] - gameState.scores[a]
  );

  const winner = sortedPlayers[0];

  const elements = {
    winnerName: document.getElementById('winner-name'),
    winnerScore: document.getElementById('winner-score'),
    finalScores: document.getElementById('final-scores')
  };

  if (elements.winnerName) elements.winnerName.textContent = winner;
  if (elements.winnerScore) elements.winnerScore.textContent = gameState.scores[winner];

  if (elements.finalScores) {
    elements.finalScores.innerHTML = '';

    sortedPlayers.forEach((player, index) => {
      const scoreItem = document.createElement('div');
      scoreItem.className = `final-score-item ${index === 0 ? 'winner' : ''}`;
      scoreItem.innerHTML = `
        <span>${index + 1}. ${player}</span>
        <span>${gameState.scores[player]} очков</span>
      `;
      elements.finalScores.appendChild(scoreItem);
    });
  }

  showPage('results-page');
  setupResultsPageControls();
}

// Новая игра
function newGame() {
  console.log('Starting new game');
  stopTimer();

  gameState = {
    currentPage: 'settings',
    gameStatus: 'waiting',
    settings: {
      language: "russian",
      roundTime: 60,
      excludedLetters: [],
      players: ["Игрок 1", "Игрок 2"]
    },
    players: ["Игрок 1", "Игрок 2"],
    currentPlayerIndex: 0,
    currentLetter: '',
    remainingLetters: [],
    usedLetters: [],
    scores: {},
    currentRoundPoints: 0,
    timeLeft: 0,
    timer: null,
    totalRound: 1
  };

  updatePlayersDisplay();
  updateLettersGrid();
  showPage('settings-page');
}

// Изменить настройки
function changeSettings() {
  console.log('Changing settings');
  stopTimer();
  showPage('settings-page');
}

// Переключение страниц
function showPage(pageId) {
  console.log('Showing page:', pageId);

  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.classList.add('hidden');
  });

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    targetPage.classList.add('active');
    gameState.currentPage = pageId;
    console.log('Page switched successfully to:', pageId);
  } else {
    console.error('Target page not found:', pageId);
  }
}

// Утилиты
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
