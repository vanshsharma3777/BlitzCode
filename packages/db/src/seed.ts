import { db } from "./index";
import { questions, type Question } from "./schema";
import data from "./data2.json";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    await db.insert(questions).values(
      data.map((q : any ) => ({
        topic: q.topic,
        description: q.description,
        explanation: q.explanation,

        difficulty: q.difficulty,
        language: q.language,
        questionType: q.questionType,

        code: q.code ?? null,

        options: q.options,
        correctOptions: q.correctOptions,

        timeLimit: q.timeLimit ?? 30,
      }))
    );

    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Seeding failed:");
    console.error(error);
  }

  process.exit(0);
}

seed();