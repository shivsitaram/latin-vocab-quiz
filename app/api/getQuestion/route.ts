import { NextResponse } from "next/server";
import answerPrompt from "@/app/utils/sendRequest";

export async function GET() {
  const sentenceAndWord = await answerPrompt("Print no other characters than those that satisfy the following requests.\nPrint a grammatically correct intermediate-level sentence in Latin, possibly containing multiple clauses.\nChoose a random word from the sentence that appears in the sentence once, and print it on the next line in the exact same form it appears in the sentence.\nPrint no other characters.");
  const word = sentenceAndWord.split("\n")[1].trim();
  const sentence = sentenceAndWord.split("\n")[0].replace(word, "____");
  const answerString = await answerPrompt(`Print no other characters than those that satisfy the following requests. Print three intermediate-level Latin vocabulary words (all the same part of speech/case (n.)/number (n.)/person (v.)/number (v.)/tense (v.)/mood (v.)/voice (v.) as each other and ${word}, as it fits in the sentence), separated by commas, that grammatically fit into the sentence but very obviously do not logically make sense in the sentence.\n${sentence}\nPrint no other characters.`);
  const answers = answerString.split(",").map((answer: string) => answer.trim());
  const correctAnswer = Math.floor(Math.random() * 4);
  answers.splice(correctAnswer, 0, word);

  const res = NextResponse.json({ 
    sentence: sentence,
    answers: answers,
    correctAnswer: correctAnswer
  });
  return res;
}

export const dynamic = "force-dynamic";
