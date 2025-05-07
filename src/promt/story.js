export function generateStoryPrompt({ sourceLanguage, character, topic, lesson, level, sentenceCount }) {
  return `
You are a content assistant creating ${sourceLanguage} learning material for foreign learners.
Please write a short story with a main character named ${character}.
Topic: ${topic}.
Lesson: ${lesson} under the topic ${topic}.
Level: ${level} (beginner in ${sourceLanguage}).
The story should be about ${sentenceCount} sentences long.

The output must be in JSON format with the following structure:

{
  "story": {
    "title": "Story title",
    "content": "Full story content (about ${sentenceCount} sentences)"
  },
  "vocabulary": [
    "word1",
    "word2",
    "word3"
  ]
}

Detailed requirements:
- Use simple sourceLanguage with vocabulary and sentence structures appropriate for the ${level} level.
- The content should be relatable to daily life and aligned with the topic ${topic}.
- The story must be written in ${sourceLanguage}.
- Vocabulary should include words that are relatively new for learners at the ${level} level.
- Include a maximum of 5 vocabulary words, related to the topic ${topic}.
- Do not include any explanations — only output valid JSON in the format above.
  `.trim();
}
