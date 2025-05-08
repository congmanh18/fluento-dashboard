export function generateKaraokePrompt({
  sourceLanguage,
  topic,
  lesson,
  level,
  lineCount
}) {
  return `
You are a content assistant creating ${sourceLanguage} learning material for international learners.

Please write a short, simple, and easy-to-sing song in ${sourceLanguage} for language learners.
Topic: ${topic}.
Lesson: ${lesson} under the topic ${topic}.
Level: ${level} (beginner level in ${sourceLanguage}).
The song should be around ${lineCount} lines long and suitable for karaoke-style singing.

The lyrics must be written in beginner-friendly ${sourceLanguage}, with basic grammar, repetition, and a clear rhythm. The content should reflect the topic naturally, and be fun or emotionally light (e.g., greetings, daily life, food, nature, etc.).

Avoid robotic or textbook-like phrasing. Focus on making the lyrics catchy, culturally appropriate, and educational. If possible, use rhymes or repeated structures.

Also include a list of key vocabulary words that are helpful for learners at this level and relevant to the topic. Do not hard-limit the number of vocabulary words — instead, choose the most useful and appropriate words.

Output only a valid JSON object in the following format:

{
  "karaoke": {
    "title": "Song title",
    "lyrics": [
      "line 1",
      "line 2",
      ...
    ]
  },
  "vocabulary": [
    "word1",
    "word2",
    "word3"
  ]
}

Do not include any explanation — only output valid JSON in the format above.
  `.trim();
}
