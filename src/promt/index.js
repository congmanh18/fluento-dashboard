import { generateDialoguePrompt } from './dialogue';
import { generateStoryPrompt } from './story';
import { generateKaraokePrompt } from './karaoke';
// import { generateQuizPrompt } from './quiz';
// import { generateTranslationPrompt } from './translation';

export default {
  dialogue: generateDialoguePrompt,
  story: generateStoryPrompt,
  karaoke: generateKaraokePrompt,
  // quiz: generateQuizPrompt,
  // translation: generateTranslationPrompt
};
