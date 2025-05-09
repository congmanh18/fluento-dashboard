export function generateStoryPrompt({
  sourceLanguage,
  character1,
  topic,
  lesson,
  level,
  sentenceCount
}) {
  return `
You are a content assistant creating ${sourceLanguage} learning material for international learners.

Please write a short, culturally relevant **narrative story** (not a dialogue) with a main character named ${character1}.
Topic: ${topic}.
Lesson: ${lesson} under the topic ${topic}.
Level: ${level} (beginner level in ${sourceLanguage}).
The story should be about ${sentenceCount} sentences long.

The story must be written in simple, beginner-friendly ${sourceLanguage}. Use sentence structures and vocabulary that are appropriate for ${level} learners.

The story should reflect everyday life or culturally meaningful situations in ${sourceLanguage}-speaking communities. It must be a **narrative**, with a clear beginning, middle, and end — not just a conversation. You may include natural expressions or cultural references where suitable.

Avoid robotic or textbook-style phrasing. Make the story feel human and relatable, even with limited vocabulary.

Please also include a list of vocabulary words that are important for understanding the story and relevant to the topic. Choose words that are useful and level-appropriate — no need to hard-limit the number of vocabulary items.

Output only a valid JSON object in the following format:

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

Do not include any explanations — only output valid JSON in the format above.
  `.trim();
}
