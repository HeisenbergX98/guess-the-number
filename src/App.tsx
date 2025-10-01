
import { useMemo, useState } from 'react';
import './App.css'

type GameState = 'start' | 'no-start' | 'main' | 'win';

function generateRandomNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}

function handleGuess({ userGuess, targetNumber, setFeedback, setGuessCount, setGameState }: { userGuess: number, targetNumber: number, setFeedback: React.Dispatch<React.SetStateAction<string>>, setGuessCount: React.Dispatch<React.SetStateAction<number>>, setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  setGuessCount((prevCount) => prevCount + 1);

  if (userGuess < 1 || userGuess > 100 || isNaN(userGuess)) {
    setFeedback("Please enter a valid number between 1 and 100.");
    return;
  }

  if (userGuess < targetNumber) {
    setFeedback('Too low! Try again.');
  } else if (userGuess > targetNumber) {
    setFeedback('Too high! Try again.');
  } else {
    setGameState('win');
  }
}

function startNewGame({ setTargetNumber, setGuessCount, setUserGuess, setFeedback, setGameState }: { setTargetNumber: React.Dispatch<React.SetStateAction<number>>, setGuessCount: React.Dispatch<React.SetStateAction<number>>, setUserGuess: React.Dispatch<React.SetStateAction<number>>, setFeedback: React.Dispatch<React.SetStateAction<string>>, setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  setTargetNumber(generateRandomNumber());
  setGuessCount(0);
  setUserGuess(1);
  setFeedback("");
  setGameState('main');
}

// Start Screen ----------------------->
function StartScreen({ setGameState }: { setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  return (
    <div className='start-container'>
      <h1>Guess the Number</h1>
      <p>I'm thinking of a number between 1 and 100. Can you guess it?</p>
      <div className="button-div">
        <button onClick={() => setGameState('main')}>Yes!</button>
        <NoButton setGameState={setGameState} />
      </div>
    </div>
  );
}
function NoButton({ setGameState }: { setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  return (
    <button onClick={() => setGameState('no-start')}>No!</button>
  );
}

// No Start Screen ----------------------->

function NoStartScreen({ setGameState }: { setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  return (
    <div className='no-container'>
      <h1>ARE YOU SURE?</h1>
      <div className="button-div">
        <button onClick={() => setGameState('start')}>No, go back</button>
      </div>
    </div>
  );
}

// Main Screen ----------------------->
function MainScreen({ userGuess, setUserGuess, feedback, guessCount, targetNumber, setGameState, setFeedback, setGuessCount }: { userGuess: number, setUserGuess: React.Dispatch<React.SetStateAction<number>>, feedback: string, guessCount: number, targetNumber: number, setGameState: React.Dispatch<React.SetStateAction<GameState>>, setFeedback: React.Dispatch<React.SetStateAction<string>>, setGuessCount: React.Dispatch<React.SetStateAction<number>> }) {
  return (
    <div className='main-container'>
      <h1>Guess the Number</h1>
      <p>What's your guess? (min = 1 max = 100)</p>
      <input
        type="number"
        min="1"
        max="100"
        value={userGuess}
        onChange={e => setUserGuess(Number(e.target.value))}
      />
      <div className="button-div">
        <button
          onClick={() =>
            handleGuess({
              userGuess,
              targetNumber,
              setFeedback,
              setGuessCount,
              setGameState,
            })
          }
        >
          Submit Guess
        </button>
      </div>
      <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>{feedback}</div>
      <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>Number of guesses: {guessCount}</div>
    </div>
  )
}

// Win Screen ----------------------->
function WinScreen({ guessCount, startNewGame }: { guessCount: number, startNewGame: () => void }) {
  return (
    <div className="win-container">
      <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
        Congratulations! You guessed the number!
      </div>
      <div style={{ marginTop: '1rem', fontStyle: 'italic' }}>
        Number of guesses: {guessCount}
      </div>
      <div className="button-div">
        <button onClick={startNewGame}>Play Again</button>
      </div>
    </div>
  );
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [userGuess, setUserGuess] = useState<number>(1);
  const [feedback, setFeedback] = useState<string>('');
  const [guessCount, setGuessCount] = useState<number>(0);
  const [targetNumber, setTargetNumber] = useState<number>(generateRandomNumber());

  const renderScreen = useMemo(() => {
    switch (gameState) {
      case 'start':
        return <StartScreen setGameState={setGameState} />;
      case 'no-start':
        return <NoStartScreen setGameState={setGameState} />;
      case 'main':
        return (
          <MainScreen
            userGuess={userGuess}
            setUserGuess={setUserGuess}
            feedback={feedback}
            guessCount={guessCount}
            targetNumber={targetNumber}
            setGameState={setGameState}
            setFeedback={setFeedback}
            setGuessCount={setGuessCount}
          />
        );
      case 'win':
        return (
          <WinScreen
            guessCount={guessCount}
            startNewGame={() =>
              startNewGame({
                setTargetNumber,
                setGuessCount,
                setUserGuess,
                setFeedback,
                setGameState,
              })
            }
          />
        );
      default:
        return 'start';
    }
  }, [gameState, userGuess, feedback, guessCount, targetNumber]);
  return (
    <>
      {renderScreen}
    </>
  );
}
export default App