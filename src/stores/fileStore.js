import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileStore = defineStore('file', () => {
  const uploadProgress = ref(0)
  const uploadedFiles = ref([])

  const uploadFile = async (file) => {
    try {
      // Here you would typically upload to your backend
      // For now, we'll simulate an upload and return a mock URL
      uploadProgress.value = 0

      // Simulate upload progress
      const interval = setInterval(() => {
        uploadProgress.value += 10
        if (uploadProgress.value >= 100) {
          clearInterval(interval)
        }
      }, 100)

      // Simulate successful upload
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate a mock URL (in production, this would come from your backend)
      const mockUrl = URL.createObjectURL(file)
      uploadedFiles.value.push({
        name: file.name,
        url: mockUrl,
        size: file.size
      })

      return mockUrl
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  return {
    uploadProgress,
    uploadedFiles,
    uploadFile
  }
})
