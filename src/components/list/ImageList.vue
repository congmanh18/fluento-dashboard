<template>
  <q-dialog v-model="showDialog" persistent @hide="handleClose">
    <q-card style="min-width: 1100px; max-width: 90vw;">
      <q-card-section class="row items-center q-pa-sm">
        <div class="text-h6">Image Repository</div>
        <q-space />
        <q-btn flat round icon="close" @click="handleClose" />
      </q-card-section>

      <q-card-section class="row items-center q-gutter-sm">
        <q-btn color="orange" label="Upload Image" icon="cloud_upload" @click="openFileDialog" />
        <q-btn color="primary" label="Select Image" :disable="!selectedImage" @click="selectImage" />
        <q-input dense outlined v-model="search" placeholder="Search images in system" class="q-ml-md" style="width: 300px;">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md q-row-gutter-md">
          <div
            v-for="img in pagedImages"
            :key="img.id"
            class="col-3"
            @click="selectedImage = img"
            :class="{'bg-grey-2': selectedImage && selectedImage.id === img.id}"
            style="cursor: pointer; border-radius: 8px;"
          >
            <q-img :src="img.url" :ratio="4/3" style="border-radius: 8px;" />
            <div class="q-mt-xs text-caption ellipsis">{{ img.name }}</div>
            <div class="text-caption text-grey">
              {{ img.width }} x {{ img.height }} | {{ img.size }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row justify-center">
        <q-pagination
          v-model="page"
          :max="maxPage"
          max-pages="5"
          boundary-numbers
        />
      </q-card-section>
    </q-card>

    <q-dialog v-model="showUploadDialog">
      <q-card style="min-width:400px">
        <q-card-section>
          <div class="text-h6">Upload Image Info</div>
          <q-input v-model="uploadName" label="Name" />
          <q-input v-model="uploadType" label="Type" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" :loading="uploadLoading" label="Upload" @click="handleUpload" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <input id="image-upload-input" type="file" accept="image/*" style="display:none" @change="onFileChange" />
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBaseStore } from 'src/stores/base'
import { Notify } from 'quasar'

const emit = defineEmits(['select', 'close'])

const baseStore = useBaseStore()
const showDialog = ref(true)
const search = ref('')
const page = ref(1)
const perPage = 8
const selectedImage = ref(null)
const total = ref(0)
const totalPages = ref(1)
const showUploadDialog = ref(false)
const uploadFile = ref(null)
const uploadName = ref('')
const uploadType = ref('')
const uploadLoading = ref(false)

const fetchImages = async () => {
  const res = await baseStore.fetchImages({ name: search.value, limit: perPage, page: page.value })
  totalPages.value = res.total_pages
  total.value = res.total
}
onMounted(fetchImages)
watch([search, page], fetchImages)

const images = computed(() => baseStore.images)
const maxPage = computed(() => totalPages.value)
const pagedImages = computed(() => images.value)

function openFileDialog() {
  document.getElementById('image-upload-input').click()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    uploadFile.value = file
    showUploadDialog.value = true
    console.log('Selected file:', uploadFile.value)
  }
}

async function handleUpload() {
  if (!uploadFile.value) return
  uploadLoading.value = true
  try {
    const metadata = {
      name: uploadName.value,
      type: uploadType.value,
      created_by: 'contributor'
    }

    const response = await baseStore.uploadImage(uploadFile.value, metadata)
    showUploadDialog.value = false
    uploadFile.value = null
    uploadName.value = ''
    uploadType.value = ''
    // Refresh lại danh sách ảnh
    fetchImages()

    Notify.create({
      type: 'positive',
      message: 'Image uploaded successfully'
    })
  } catch (e) {
    console.error('Upload error:', e)
    Notify.create({
      type: 'negative',
      message: e.message || 'Failed to upload image'
    })
  } finally {
    uploadLoading.value = false
  }
}

function selectImage() {
  if (selectedImage.value) {
    emit('select', selectedImage.value)
    showDialog.value = false
    emit('close')
  } else {
    Notify.create({
      type: 'warning',
      message: 'Please select an image first'
    })
  }
}

function handleClose() {
  showDialog.value = false
  emit('close')
}
</script>
