export function generateDialoguePrompt({ sourceLanguage, character1, character2, topic, lesson, level, sentenceCount }) {
  return `
You are a content assistant creating ${sourceLanguage} learning material for foreign learners.
Please create a short dialogue between two characters named ${character1} and ${character2}.
Topic: ${topic}.
Lesson: ${lesson} under the topic ${topic}.
Level: ${level} (beginner in ${sourceLanguage}).
The dialogue should contain about ${sentenceCount} sentences.

The output must be in JSON format with the following structure:

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

Detailed requirements:
- Use simple language with basic vocabulary and sentence structures.
- The dialogue should contain around ${sentenceCount} sentences.
- The conversation should be in ${sourceLanguage}.
- Vocabulary should include words that are relatively new for learners at the ${level} level.
- Include a maximum of 5 vocabulary words, related to the topic ${topic}.
- Only output valid JSON as specified above. No extra explanations or comments.
  `.trim();
}
