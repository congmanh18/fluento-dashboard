<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h5">📚 Quản lý Topic học tiếng Việt</div>
      </q-card-section>

      <!-- Form Create Topic -->
      <q-card-section>
        <q-form @submit.prevent="onCreateTopic">
          <div class="row q-col-gutter-md">
            <!-- Cột 1: Form Input -->
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-md">
                <!-- Thứ tự -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.order"
                    label="Thứ tự hiển thị"
                    type="number"
                    outlined
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <!-- Tên topic -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.name"
                    label="Tên Topic"
                    outlined
                    dense
                    :rules="[(val) => !!val || 'Không được bỏ trống!']"
                    class="q-mb-sm"
                  />
                </div>

                <!-- Upload ảnh bên trái -->
                <div class="col-12 col-md-6">
                  <q-uploader
                    label="Ảnh đại diện"
                    ref="uploaderRef"
                    accept="image/*"
                    :auto-upload="false"
                    max-files="1"
                    :factory="fakeUploadFactory"
                    bordered
                    flat
                    class="full-width"
                  />
                </div>

                <!-- Upload ảnh bên phải (cân xứng layout) -->
                <div class="col-12 col-md-6">
                  <q-uploader
                    label="(Tùy chọn ảnh 2)"
                    accept="image/*"
                    auto-upload="false"
                    max-files="1"
                    bordered
                    flat
                    class="full-width"
                    disable
                  />
                </div>
              </div>
            </div>

            <!-- Cột 2: Nút tạo + kết quả API -->
            <div class="col-12 col-md-4">
              <div class="q-mb-md">
                <q-btn
                  label="➕ Tạo Topic"
                  type="submit"
                  color="primary"
                  class="full-width"
                  style="height: 56px"
                />
              </div>

              <!-- Kết quả nhận từ API (hiện chỉ mock) -->
              <q-card flat bordered class="q-pa-sm">
                <div class="text-subtitle2">📦 Kết quả từ API:</div>
                <div class="q-mt-sm">
                  <q-banner dense class="bg-grey-2 text-dark">
                    <template v-if="mockApiResult">
                      <div><b>ID:</b> {{ mockApiResult.id }}</div>
                      <div><b>Tên:</b> {{ mockApiResult.name }}</div>
                      <div><b>Thứ tự:</b> {{ mockApiResult.order }}</div>
                    </template>
                    <template v-else>
                      <i>Chưa có dữ liệu ~</i>
                    </template>
                  </q-banner>
                </div>
              </q-card>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <!-- Danh sách Topic -->
      <q-card-section>
        <q-table
          :rows="topics"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          @request="onRequest"
          flat
          bordered
        >
          <template v-slot:body-cell-image="props">
            <q-td>
              <q-img :src="props.row.image_url" contain style="width: 80px; height: 60px" />
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td>
              <q-btn dense flat icon="edit" color="primary" @click="onEdit(props.row)" />
              <q-btn dense flat icon="delete" color="negative" @click="onDelete(props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 100,
  rowsNumber: 0,
})

const form = reactive({
  name: '',
  order: null,
})

// Dữ liệu mock
const mockData = ref([
  {
    id: 'AvisstrKLfAo',
    order: 1,
    name: 'Chào hỏi - giao tiếp căn bản',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviC2R7FLQM7',
    order: 2,
    name: 'Đây là, kia là, cái này là cái gì?',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW61J',
    order: 3,
    name: 'Giao thông công cộng',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW62J',
    order: 4,
    name: 'Ngày tháng, giờ phút',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW63J',
    order: 5,
    name: 'Người, con người',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW64J',
    order: 6,
    name: 'Các loại hình công việc',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW65J',
    order: 7,
    name: 'Môi trường làm việc',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW66J',
    order: 8,
    name: 'Làm việc với công an',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW67J',
    order: 9,
    name: 'Làm việc với bác sĩ',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW68J',
    order: 10,
    name: 'Làm việc với giáo viên',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW69J',
    order: 11,
    name: 'Làm việc với nhân viên ngân hàng',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
  {
    id: 'AviyLHEFW70J',
    order: 12,
    name: 'Làm việc với nhân viên bưu điện',
    image_url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  },
])

const topics = ref([])

const columns = [
  { name: 'order', label: 'Thứ tự', field: 'order', sortable: true },
  { name: 'image', label: 'Ảnh', field: 'image_url' },
  { name: 'name', label: 'Tên Topic', field: 'name', sortable: true },
  { name: 'action', label: 'Thao tác', field: 'action' },
]

const fetchTopics = async () => {
  loading.value = true
  const { page, rowsPerPage } = pagination.value

  // Sort by order
  const sorted = [...mockData.value].sort((a, b) => a.order - b.order)

  await new Promise((resolve) => setTimeout(resolve, 500))
  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  topics.value = sorted.slice(start, end)
  pagination.value.rowsNumber = sorted.length
  loading.value = false
}

const onRequest = async ({ pagination: pag }) => {
  pagination.value = { ...pagination.value, ...pag }
  await fetchTopics()
}

const onCreateTopic = async () => {
  if (!form.name) return

  const newId = `new_${Date.now()}`
  mockData.value.push({
    id: newId,
    name: form.name,
    order: form.order || mockData.value.length + 1,
    image_url: 'https://via.placeholder.com/80x60?text=No+Image',
  })

  form.name = ''
  form.order = null
  await fetchTopics()
}

const onEdit = async (row) => {
  const newName = prompt('Nhập tên mới:', row.name)
  if (newName) {
    const index = mockData.value.findIndex((x) => x.id === row.id)
    if (index !== -1) {
      mockData.value[index].name = newName
      await fetchTopics()
    }
  }
}

const onDelete = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xoá?')) {
    mockData.value = mockData.value.filter((x) => x.id !== id)
    await fetchTopics()
  }
}

onMounted(fetchTopics)
</script>
