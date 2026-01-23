export function extractJsonFromAI(text: string) : any {
  if (typeof text !== "string") {
    throw new Error("AI response is not a string");
  }

  let cleaned = text.trim();

  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    try {
      cleaned = JSON.parse(cleaned);
    } catch {
    }
  }

  cleaned = cleaned
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstObj = cleaned.indexOf("{");
  const firstArr = cleaned.indexOf("[");

  let start = -1;
  if (firstArr !== -1 && (firstArr < firstObj || firstObj === -1)) {
    start = firstArr;
  } else {
    start = firstObj;
  }

  const lastObj = cleaned.lastIndexOf("}");
  const lastArr = cleaned.lastIndexOf("]");

  const end = Math.max(lastObj, lastArr);

  if (start === -1 || end === -1) {
    throw new Error("No JSON found in AI response");
  }

  const jsonText = cleaned.slice(start, end + 1);

  return JSON.parse(jsonText);
}
