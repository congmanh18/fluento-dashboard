import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { debounce } from 'lodash';
import { useLanguageStore } from 'src/stores/language.js';
import { contentApi } from 'src/boot/axios';
import prompts from 'src/promt';
import { mockCharacters } from '../../pages/master-data/characters/mock/characters';

export const useCharacterStore = defineStore('character', {
  state: () => ({
    characters: mockCharacters,
    selectedCharacter: null,
    isLoading: false,
    error: null
  }),

  getters: {
    getCharacters: (state) => state.characters,
    getCharacterById: (state) => (id) => state.characters.find(char => char.id === id),
    getCharactersByRole: (state) => (role) => state.characters.filter(char => char.role === role),
    getCharactersByRegion: (state) => (region) => state.characters.filter(char => char.region === region),
    getNativeCharacters: (state) => state.characters.filter(char => char.region === 'native'),
    getForeignCharacters: (state) => state.characters.filter(char => char.region !== 'native')
  },

  actions: {
    setSelectedCharacter(character) {
      this.selectedCharacter = character;
    },

    clearSelectedCharacter() {
      this.selectedCharacter = null;
    },

    // Add more actions as needed for CRUD operations
  }
});
