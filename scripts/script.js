import { wordList } from "./word-list.js";

// DOM Elements
const wordDisplay = document.querySelector('.word-display');
const keyBoard = document.querySelector('.keyboard');
const guessesText = document.querySelector('.guesses-text b');
const hangmanImage = document.querySelector('.hangman-box img');
const gameModel = document.querySelector('.game-model');
const playAgain = document.querySelector('.play-again');

// Game State
let currentWord, currentLetters, guessesWrong, maxGuesses = 6;

/**
 * Resets the game state and UI elements
 */
const resetGame = () => {
  currentLetters = [];
  guessesWrong = 0;
  
  // Reset word display
  if (currentWord) {
    wordDisplay.innerHTML = currentWord.split('').map(() => 
      `<li class="letter"></li>`
    ).join('');
  }
  
  // Hide game over modal
  gameModel.classList.remove('show');
  
  // Re-enable all keyboard buttons and reset their styles
  keyBoard.querySelectorAll('button').forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.transform = 'scale(1)';
    btn.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
    btn.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
  });
  
  // Reset hangman image and guesses counter
  hangmanImage.src = `images/hangman-${guessesWrong}.svg`;
  hangmanImage.style.opacity = '1';
  hangmanImage.style.animation = 'none';
  guessesText.innerText = `${guessesWrong} / ${maxGuesses}`;
  
  // Add subtle animation to reset
  setTimeout(() => {
    hangmanImage.style.animation = 'fadeIn 0.5s ease-in';
  }, 10);
};

/**
 * Selects a random word and hint from the word list
 */
const getRandomWord = () => {
  try {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const { word, hint } = wordList[randomIndex];
    currentWord = word.toLowerCase();
    
    // Update hint text
    document.querySelector('.hint-text b').innerHTML = hint;
    
    // Reset game after setting the new word
    resetGame();
  } catch (error) {
    console.error('Error getting random word:', error);
    // Fallback word
    currentWord = 'hangman';
    document.querySelector('.hint-text b').innerHTML = 'A word game';
    resetGame();
  }
};

const gameOver = (isVictory) => {
  setTimeout(() => {
    const modelText = isVictory ? 'You Found the Word: ' : 'The correct word was: ';
    const imageSrc = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    const title = isVictory ? 'Congratulations! 🎉' : 'Game Over 💀';
    
    gameModel.querySelector('img').src = imageSrc;
    gameModel.querySelector('h4').innerHTML = title;
    gameModel.querySelector('p').innerHTML = `${modelText} <b>${currentWord}</b>`;
    gameModel.classList.add('show');
  }, 600);
};

const initGame = (button, clickLetter) => {
  // Disable the button immediately
  button.disabled = true;
  button.style.opacity = '0.6';
  button.style.transform = 'scale(0.95)';
  
  if (currentWord.includes(clickLetter)) {
    // Correct letter found
    let lettersFound = 0;
    
    [...currentWord].forEach((letter, index) => {
      if (letter === clickLetter) {
        currentLetters.push(letter);
        const letterElement = wordDisplay.querySelectorAll('li')[index];
        letterElement.innerText = clickLetter;
        letterElement.classList.add('guessed');
        lettersFound++;
      }
    });
    
    // Add success animation
    button.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
    button.style.boxShadow = '0 8px 25px rgba(39, 174, 96, 0.4)';
    
  } else {
    // Wrong letter
    guessesWrong++;
    
    // Add fade effect when updating hangman image
    hangmanImage.style.opacity = '0.7';
    setTimeout(() => {
      hangmanImage.src = `images/hangman-${guessesWrong}.svg`;
      hangmanImage.style.opacity = '1';
    }, 150);
    
    // Add error animation
    button.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    button.style.boxShadow = '0 8px 25px rgba(231, 76, 60, 0.4)';
    
    // Shake animation for hangman
    hangmanImage.style.animation = 'shake 0.5s ease-in-out';
  }
  
  // Update guesses counter
  guessesText.innerText = `${Math.min(guessesWrong, maxGuesses)} / ${maxGuesses}`;
  
  // Check game end conditions
  if (guessesWrong === maxGuesses) {
    return gameOver(false);
  }
  if (currentLetters.length === [...currentWord].length) {
    return gameOver(true);
  }
};

/**
 * Creates keyboard buttons with event listeners
 */
const createKeyboard = () => {
  for (let i = 97; i <= 122; i++) {
    const button = document.createElement('button');
    button.innerHTML = String.fromCharCode(i).toUpperCase();
    button.setAttribute('aria-label', `Letter ${String.fromCharCode(i).toUpperCase()}`);
    keyBoard.appendChild(button);
    
    button.addEventListener('click', (e) => {
      initGame(e.target, String.fromCharCode(i));
    });
    
    // Add keyboard support
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  }
};

/**
 * Adds CSS animations for better UX
 */
const addAnimations = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    .hangman-box img {
      animation: fadeIn 0.5s ease-in;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Completely restarts the game with a new word
 */
const restartGame = () => {
  // Hide the modal first
  gameModel.classList.remove('show');
  
  // Get a new word and reset everything
  setTimeout(() => {
    getRandomWord();
  }, 300);
};

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
  addAnimations();
  createKeyboard();
  getRandomWord();
});

// Event listeners
playAgain.addEventListener('click', restartGame);

// Keyboard support for the entire game
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key >= 'a' && key <= 'z') {
    // Find the specific button for this letter
    const buttons = keyBoard.querySelectorAll('button');
    const targetButton = Array.from(buttons).find(btn => 
      btn.textContent.toLowerCase() === key && !btn.disabled
    );
    
    if (targetButton) {
      initGame(targetButton, key);
    }
  }
});
