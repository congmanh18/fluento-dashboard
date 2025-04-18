import { defineStore, acceptHMRUpdate } from 'pinia'

export const useMyStore = defineStore('myStore', {
  state: () => ({}),
  getters: {},
  actions: {},
})

export const useLanguageStore = defineStore('language', {
  state: () => ({
    sourceLanguage: 'vi',
    nativeLanguage: 'en',
  }),
  actions: {
    setSourceLanguage(lang) {
      this.sourceLanguage = lang
    },
    setNativeLanguage(lang) {
      this.nativeLanguage = lang
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMyStore, import.meta.hot))
}
