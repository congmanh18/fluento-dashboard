export function generateStoryPrompt({
  sourceLanguage,
  character,
  topic,
  lesson,
  level,
  sentenceCount
}) {
  return `
You are a content assistant creating ${sourceLanguage} learning material for international learners.

Please write a short, culturally relevant story with a main character named ${character}.
Topic: ${topic}.
Lesson: ${lesson} under the topic ${topic}.
Level: ${level} (beginner level in ${sourceLanguage}).
The story should be about ${sentenceCount} sentences long.

The story must be written in simple, beginner-friendly ${sourceLanguage}. Use language structures and vocabulary appropriate for ${level} learners. The story should reflect real-life situations that are common in daily life or culturally meaningful in ${sourceLanguage}-speaking communities.

Avoid robotic or textbook-like phrasing. Make the story feel human and natural, even with limited vocabulary. You may include natural expressions or cultural references if suitable.

Please also include a list of vocabulary words that are important to understanding the story and related to the topic. Do not hard-limit the number of vocabulary words — instead, select only those that are most useful and appropriate for learners at this level.

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
