"use client";

import { useCallback, useEffect, useState, useRef } from "react";

function AnswerChoice({ word, gameOver, picked, correct, callback }: { word: string, gameOver: boolean, picked: boolean, correct: boolean, callback: () => void }) {
  let extraClasses = "";
  if (picked) {
    extraClasses += correct ? "btn-success" : "btn-error";
  }
  if (picked || gameOver) {
    extraClasses += " pointer-events-none";
    callback = () => {};
  }
  return (
      <button className={`btn w-[98%] h-[94%] m-auto text-4xl ${extraClasses}`} onClick={callback}>
        {word}
      </button>
  );
}

function Next({ selectable, callback }: { selectable: boolean, callback: () => void }) {
  if (!selectable) {
    callback = () => {};
  }
  return (
      <button className={`btn ${selectable ? "" : "btn-disabled"} h-[75%] w-[75%] sm:w-[30%] m-4 text-xl`} onClick={callback}>
          Next
      </button>
  );
}

export default function Game() {
  const [sentence, setSentence] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>(new Array(4).fill(""));
  const [picked, setPicked] = useState<boolean[]>(new Array(4).fill(false));
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");
  const [statusColor, setStatusColor] = useState<string>("");

  const initialRender = useRef(true);

  const handleSelection = useCallback((idx: number) => {
    if (gameOver || picked[idx]) return;
    let newPicked = picked.map((v, i) => (i === idx || v));
    let newGameOver = (correctAnswer === idx || picked.filter(v => v).length === 3);
    let newStatus = "";
    let newStatusColor = "";

    if (correctAnswer != idx) {
      if (newPicked.filter(v => v).length === 3) {
        newPicked = newPicked.map((v, i) => (v || i === correctAnswer));
        newGameOver = true;
      }
      newStatus = `Incorrect.${newGameOver ? "" : " Try again."}`;
      newStatusColor = "text-red-600";
    } else {
      newStatus = "Correct!";
      newStatusColor = "text-green-600";
    }
    if (newGameOver) {
      newStatus += " Click Next to continue.";
    }
    setPicked(newPicked);
    setGameOver(newGameOver);
    setStatus(newStatus);
    setStatusColor(newStatusColor);
  }, [gameOver, picked, correctAnswer]);

  const nextQuestion = useCallback(() => {
    if (!gameOver) return;
    fetch("/api/getQuestion", { cache: "no-store"})
      .then(res => res.json())
      .then(data => {
        setSentence(data.sentence);
        setAnswers(data.answers);
        setPicked(new Array(4).fill(false));
        setCorrectAnswer(data.correctAnswer);
        setGameOver(false);
        setStatus("Choose the word that best fits in the sentence.");
        setStatusColor("text-gray-400");
      })
      .catch(err => {
        console.error(err);
      });
  }, [gameOver]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      nextQuestion();
    }
  }, [nextQuestion]);

  return (
    <main className="h-screen">
      <div className="h-1/7 flex flex-col justify-end">
        <h1 className="m-6 text-center text-4xl">
          Latin Vocabulary Quiz
        </h1>
      </div>

      <div className="-m-5 h-[30%] flex justify-center items-center">
        <h2 className="max-w-6xl text-center text-2xl">
          {sentence.split("____")[0]}
          <span className={gameOver ? "underline font-bold" : ""}>
            {gameOver ? answers[correctAnswer] : "____"}
          </span>
          {sentence.split("____")[1]}
        </h2>
      </div>

      <div className="h-[5%] flex flex-col justify-end">
        <h3 className={`mb-[1%] text-center text-xl ${statusColor}`}>
          {status}
        </h3>
      </div>

      <div className="h-[45%] grid grid-rows-4 sm:grid-rows-2 grid-cols-1 sm:grid-cols-2">
        <AnswerChoice word={answers[0]} gameOver={gameOver} picked={picked[0]} correct={correctAnswer === 0} callback={() => handleSelection(0)} />
        <AnswerChoice word={answers[1]} gameOver={gameOver} picked={picked[1]} correct={correctAnswer === 1} callback={() => handleSelection(1)} />
        <AnswerChoice word={answers[2]} gameOver={gameOver} picked={picked[2]} correct={correctAnswer === 2} callback={() => handleSelection(2)} />
        <AnswerChoice word={answers[3]} gameOver={gameOver} picked={picked[3]} correct={correctAnswer === 3} callback={() => handleSelection(3)} />
      </div>

      <div className="h-[10%] flex flex-row justify-end items-center">
        <Next selectable={gameOver} callback={nextQuestion} />
      </div>
    </main>
  );
}
