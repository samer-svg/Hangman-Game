import { wordList } from "./word-list.js";

const wordDisplay = document.querySelector('.word-display');
const keyBoard = document.querySelector('.keyboard');
const guessesText = document.querySelector('.guesses-text b');
const hangmanImage = document.querySelector('.hangman-box img');
const gameModel = document.querySelector('.game-model');
const playAgain = document.querySelector('.play-again');

let currentWord,currentLetters,guessesWrong ,maxGuesses=6;

const resetGame= () => {
  //resetting all game variables and UI elements
  currentLetters = [];
  guessesWrong =0;
  wordDisplay.innerHTML=currentWord.split('').map(() => `<li class="letter"></li>`).join('');
  gameModel.classList.remove('show');
  keyBoard.querySelectorAll('button').forEach(btn => {
    btn.disabled=false;
  })
  hangmanImage.src=`images/hangman-${guessesWrong}.svg`;
    guessesText.innerText=`${Math.min(guessesWrong,maxGuesses)} / ${maxGuesses}`;
}

const getRandomWord = () => {
  //selecting a random word and hint from the wordList
  const randomIndex=Math.ceil(Math.random() * wordList.length);
  const {word , hint}=wordList[randomIndex];
  currentWord=word;
  document.querySelector('.hint-text b').innerHTML=hint;
  resetGame();
}

getRandomWord();

const gameOver = (isVictory) => {
  //after 600ms if game complete. showing modal with relevant details
    const modelText = isVictory ? 'You Found the Word: ' : 'The correct word was: ';
    gameModel.querySelector('img').src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModel.querySelector('h4').innerHTML=isVictory ? 'congregates! ' : 'Game Over';
    gameModel.querySelector('p').innerHTML=`${modelText} <b>${currentWord}</b>`;
    gameModel.classList.add('show');}

const initGame = (button,clickLetter) => {
  //checking if clickedLetter is exist on the word
  if (currentWord.includes(clickLetter)) {
    //showing all correct letters on the word display
    [...currentWord].forEach((letter,index) => {
      if (letter === clickLetter) {
        currentLetters.push(letter);
        wordDisplay.querySelectorAll('li')[index].innerText=clickLetter;
        wordDisplay.querySelectorAll('li')[index].classList.add('guessed');
      }
    });
  }
  else {
    //if clicked letter doesn't exist then updata the wrongGuessCount and hangman image
    guessesWrong++;
    hangmanImage.src=`images/hangman-${guessesWrong,maxGuesses}.svg`
  }
  button.disabled = true;
  guessesText.innerText=`${Math.min(guessesWrong,maxGuesses)} / ${maxGuesses}`

  //calling gameOver function if any of these condition meets
  if (guessesWrong === maxGuesses) return gameOver(false);
  if (currentLetters.length === [...currentWord].length ) return gameOver(true);
}

//creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
  const button = document.createElement('button');
  button.innerHTML = String.fromCharCode(i);
  keyBoard.appendChild(button);
  button.addEventListener('click',e => {
    initGame(e.target,String.fromCharCode(i));
  });
}

playAgain.addEventListener('click',getRandomWord);