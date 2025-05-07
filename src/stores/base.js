import { defineStore } from 'pinia'
import { contentApi, imageApi } from 'boot/axios'
import { useLanguageStore } from './language'
import axios from 'axios'

export const useBaseStore = defineStore('base', {
  state: () => ({
    characters: [],
    languageLevels: [],
    images: [],
    loading: false,
    error: null,
    uploadProgress: 0
  }),

  getters: {
    getCharacters: (state) => state.characters,
    getLanguageLevels: (state) => state.languageLevels,
    getImages: (state) => state.images,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getUploadProgress: (state) => state.uploadProgress
  },

  actions: {
    async fetchCharacters(languageCode = useLanguageStore().sourceLanguage) {
      this.loading = true
      try {
        const response = await contentApi.getCharacters({ language_code: languageCode, mode: 'full' })
        this.characters = response.detail
        this.error = null
      } catch (error) {
        this.error = error.message
        console.error('Error fetching characters:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchLanguageLevels() {
      this.loading = true
      try {
        const response = await contentApi.getLanguageLevels()
        this.languageLevels = response.detail
        this.error = null
      } catch (error) {
        this.error = error.message
        console.error('Error fetching language levels:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchImages(params = {}) {
      this.loading = true
      try {
        const response = await contentApi.getImages(params)
        this.images = response.detail.rows
        this.error = null
        return response.detail
      } catch (error) {
        this.error = error.message
        console.error('Error fetching images:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async initializeBaseData() {
      await Promise.all([
        this.fetchCharacters(),
        this.fetchLanguageLevels()
      ])
    },

    async uploadImage(file, metadata = {}) {
      this.loading = true
      this.uploadProgress = 0
      try {
        const formData = new FormData()
        formData.append('image', file)

        // Add metadata fields
        if (metadata.name) formData.append('name', metadata.name)
        if (metadata.type) formData.append('type', metadata.type)
        if (metadata.created_by) formData.append('created_by', metadata.created_by)

        // Debug log the FormData contents
        console.log('Uploading file:', file.name, 'size:', file.size, 'type:', file.type)
        console.log('Metadata:', metadata)
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], pair[1])
        }

        const response = await imageApi.createImage(formData, (progressEvent) => {
          this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        })

        console.log('Upload response:', response)

        if (response && response.detail && response.detail.url) {
          return response.detail.url
        } else {
          throw new Error('Invalid response format from server')
        }
      } catch (error) {
        this.error = error.message
        if (error.response) {
          console.error('Error uploading image (API response):', error.response.data)
          throw new Error(error.response.data.message || error.response.data.detail || 'Upload failed')
        } else if (error.request) {
          console.error('Error uploading image (no response):', error.request)
          throw new Error('No response from server. Please check your connection.')
        } else {
          console.error('Error uploading image:', error)
          throw new Error(error.message || 'Upload failed')
        }
      } finally {
        this.loading = false
        this.uploadProgress = 0
      }
    },

    async searchImagesByName(name, { limit = 10, page = 1, sort = 'desc' } = {}) {
      return await this.fetchImages({ name, limit, page, sort })
    }
  }
})

