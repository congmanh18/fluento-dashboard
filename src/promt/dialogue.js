export function generateDialoguePrompt({
  sourceLanguage,
  character1,
  character2,
  topic,
  lesson,
  level,
  sentenceCount
}) {
  return `
You are a content assistant creating ${sourceLanguage} learning material for international learners.

Please write a short, natural-sounding conversation between two characters named ${character1} and ${character2}.
Topic: ${topic}.
Lesson: ${lesson} under the topic ${topic}.
Level: ${level} (beginner level in ${sourceLanguage}).
The dialogue should contain around ${sentenceCount} sentences.

Focus on making the dialogue feel human and culturally authentic — not robotic or overly textbook-like. Include elements of natural daily conversation such as greetings, small talk, or cultural norms (e.g., how people greet or address each other in ${sourceLanguage}).

The language must be simple and appropriate for ${level} learners, using basic structures and beginner-level vocabulary. Prefer real-life situations or everyday settings.

You should also provide a list of key vocabulary that is thematically relevant to the topic and useful for learners at this level. Do not hard-limit the number of vocabulary words, but select only those that are clearly appropriate and helpful.

Output only a valid JSON object in the following format:

{
  "dialog": [
    {"speaker": "${character1}", "text": "..."},
    {"speaker": "${character2}", "text": "..."}
  ],
  "vocabulary": [
    "word1",
    "word2",
    "word3"
  ]
}

Do not include any explanation or additional text. Only output the JSON.
  `.trim();
}
