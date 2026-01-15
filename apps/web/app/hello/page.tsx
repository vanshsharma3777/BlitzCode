'use client'

import axios from "axios"
import { useEffect, useState } from "react"

interface Question {
  topic: string;
  description: string;
  options: { id: string; text: string }[];
  correctOptions: string[];
  difficulty: string;
  language: string;
  questionType: "single correct" | "multiple correct" | "bugfixer";
  timeLimit: number;
};

export default function Hello() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await axios.post("http://localhost:3002/", {
          topic: "array",
          difficulty: "hard",
          language: "java",
          questionType: "multiple correct",
        });
        console.log(res.data.data)
        setQuestions(res.data.data);
      } catch (err) {
        console.error("Questions not fetched", err);
      }
    }

    getDetails();
  }, []);

  return (
    <div>
      {questions.map((q, index) => (
        <div key={index}>
          <h3>Q{index + 1}. {q.description}</h3>

          <ul>
            {q.options.map(opt => (
              <li key={opt.id}>
                {opt.id}. {opt.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
