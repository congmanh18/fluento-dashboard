<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Characters</div>
      <q-btn color="primary" icon="add" label="Add Character" @click="openDialog()" />
    </div>

    <!-- Filters -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-select
          v-model="filters.language"
          :options="languageOptions"
          label="Language"
          clearable
          emit-value
          map-options
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-select
          v-model="filters.role"
          :options="roleOptions"
          label="Role"
          clearable
          emit-value
          map-options
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-select
          v-model="filters.region"
          :options="regionOptions"
          label="Region"
          clearable
          emit-value
          map-options
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-input
          v-model="filters.search"
          label="Search"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Data Table -->
    <q-table
      :rows="filteredCharacters"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination.sync="pagination"
      :rows-per-page-options="[10, 20, 50, 100]"
      @request="onRequest"
    >
      <!-- Custom cell templates -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div class="row items-center">
            <q-avatar size="40px" class="q-mr-sm">
              <q-icon :name="getGenderIcon(props.row.role)" size="30px" />
            </q-avatar>
            <div>
              <div class="text-weight-medium">{{ props.row.name }}</div>
              <div class="text-caption text-grey">{{ props.row.role }}</div>
            </div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-language="props">
        <q-td :props="props">
          <q-chip
            :color="getLanguageColor(props.row.language_code)"
            text-color="white"
            size="sm"
          >
            {{ props.row.language_name }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn
            flat
            round
            color="primary"
            icon="visibility"
            size="sm"
            @click="viewCharacter(props.row)"
          >
            <q-tooltip>View Details</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            size="sm"
            @click="editCharacter(props.row)"
          >
            <q-tooltip>Edit</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            size="sm"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Character Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEdit ? 'Edit Character' : 'Add Character' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="Name"
              :rules="[val => !!val || 'Name is required']"
            />
            <q-select
              v-model="form.language_code"
              :options="languageOptions"
              label="Language"
              :rules="[val => !!val || 'Language is required']"
            />
            <q-select
              v-model="form.role"
              :options="roleOptions"
              label="Role"
              :rules="[val => !!val || 'Role is required']"
            />
            <q-input
              v-model="form.voice_code"
              label="Voice Code"
              :rules="[val => !!val || 'Voice code is required']"
            />
            <q-input
              v-model.number="form.age"
              type="number"
              label="Age"
              :rules="[val => !!val || 'Age is required']"
            />
            <q-input
              v-model="form.description"
              label="Description"
              type="textarea"
              :rules="[val => !!val || 'Description is required']"
            />
            <q-select
              v-model="form.region"
              :options="regionOptions"
              label="Region"
              :rules="[val => !!val || 'Region is required']"
            />
            <q-input
              v-model="form.origin"
              label="Origin"
              :rules="[val => !!val || 'Origin is required']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- View Dialog -->
    <q-dialog v-model="viewDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Character Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedCharacter">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-h6">{{ selectedCharacter.name }}</div>
              <q-chip
                :color="getLanguageColor(selectedCharacter.language_code)"
                text-color="white"
              >
                {{ selectedCharacter.language_name }}
              </q-chip>
              <q-chip color="primary" text-color="white">
                {{ selectedCharacter.role }}
              </q-chip>
            </div>
            <div class="col-12">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Voice Code</q-item-label>
                    <q-item-label>{{ selectedCharacter.voice_code }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Age</q-item-label>
                    <q-item-label>{{ selectedCharacter.age }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Description</q-item-label>
                    <q-item-label>{{ selectedCharacter.description }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Region</q-item-label>
                    <q-item-label>{{ selectedCharacter.region }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Origin</q-item-label>
                    <q-item-label>{{ selectedCharacter.origin }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'CharactersPage',
  setup () {
    const $q = useQuasar()
    const loading = ref(false)
    const characters = ref([])
    const dialog = ref(false)
    const viewDialog = ref(false)
    const isEdit = ref(false)
    const selectedCharacter = ref(null)
    const pagination = ref({
      sortBy: 'name',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })

    const form = ref({
      name: '',
      language_code: '',
      role: '',
      voice_code: '',
      age: null,
      description: '',
      region: '',
      origin: ''
    })

    const filters = ref({
      language: null,
      role: null,
      region: null,
      search: ''
    })

    const columns = [
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        field: row => row.name,
        sortable: true
      },
      {
        name: 'language',
        required: true,
        label: 'Language',
        align: 'left',
        field: row => row.language_name,
        sortable: true
      },
      {
        name: 'role',
        required: true,
        label: 'Role',
        align: 'left',
        field: row => row.role,
        sortable: true
      },
      {
        name: 'age',
        required: true,
        label: 'Age',
        align: 'left',
        field: row => row.age,
        sortable: true
      },
      {
        name: 'region',
        required: true,
        label: 'Region',
        align: 'left',
        field: row => row.region,
        sortable: true
      },
      {
        name: 'actions',
        required: true,
        label: 'Actions',
        align: 'right',
        field: row => row.id
      }
    ]

    const languageOptions = computed(() => {
      const languages = new Set(characters.value.map(c => c.language_code))
      return Array.from(languages).map(code => ({
        label: characters.value.find(c => c.language_code === code).language_name,
        value: code
      }))
    })

    const roleOptions = computed(() => {
      const roles = new Set(characters.value.map(c => c.role))
      return Array.from(roles).map(role => ({
        label: role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        value: role
      }))
    })

    const regionOptions = computed(() => {
      const regions = new Set(characters.value.map(c => c.region))
      return Array.from(regions).map(region => ({
        label: region.charAt(0).toUpperCase() + region.slice(1),
        value: region
      }))
    })

    const filteredCharacters = computed(() => {
      return characters.value.filter(char => {
        if (filters.value.language && char.language_code !== filters.value.language) return false
        if (filters.value.role && char.role !== filters.value.role) return false
        if (filters.value.region && char.region !== filters.value.region) return false
        if (filters.value.search) {
          const search = filters.value.search.toLowerCase()
          return (
            char.name.toLowerCase().includes(search) ||
            char.description.toLowerCase().includes(search) ||
            char.origin.toLowerCase().includes(search)
          )
        }
        return true
      })
    })

    const getGenderIcon = (role) => {
      return role.includes('male') ? 'male' : 'female'
    }

    const getLanguageColor = (languageCode) => {
      const colors = {
        en: 'blue',
        vi: 'red',
        fr: 'purple',
        de: 'grey-8',
        ja: 'pink',
        zh: 'orange',
        es: 'green',
        hi: 'deep-orange',
        ar: 'teal',
        ru: 'indigo',
        pt: 'cyan',
        bn: 'amber',
        ko: 'light-blue',
        id: 'lime',
        tr: 'deep-purple',
        it: 'green-8',
        tl: 'blue-8',
        th: 'red-8',
        fa: 'purple-8',
        sw: 'orange-8',
        ur: 'green-9',
        ta: 'deep-orange-8',
        nl: 'orange-9',
        pl: 'red-9',
        uk: 'blue-9',
        ms: 'green-10',
        my: 'amber-9',
        el: 'blue-10',
        ro: 'red-10',
        ha: 'green-11'
      }
      return colors[languageCode] || 'grey'
    }

    const openDialog = (character = null) => {
      isEdit.value = !!character
      if (character) {
        form.value = { ...character }
      } else {
        form.value = {
          name: '',
          language_code: '',
          role: '',
          voice_code: '',
          age: null,
          description: '',
          region: '',
          origin: ''
        }
      }
      dialog.value = true
    }

    const viewCharacter = (character) => {
      selectedCharacter.value = character
      viewDialog.value = true
    }

    const editCharacter = (character) => {
      openDialog(character)
    }

    const confirmDelete = (character) => {
      $q.dialog({
        title: 'Confirm',
        message: `Are you sure you want to delete ${character.name}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        // TODO: Implement delete logic
        $q.notify({
          color: 'positive',
          message: 'Character deleted successfully'
        })
      })
    }

    const onSubmit = () => {
      // Implement save logic
      dialog.value = false
      $q.notify({
        color: 'positive',
        message: isEdit.value ? 'Character updated successfully' : 'Character added successfully'
      })
    }

    const onRequest = (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      // Implement pagination and sorting logic
    }

    // Load initial data
    const loadData = async () => {
      loading.value = true
      try {
        // Replace with actual API call
        characters.value = [] // Your character data here
        pagination.value.rowsNumber = characters.value.length
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'Failed to load characters'
        })
      } finally {
        loading.value = false
      }
    }

    loadData()

    return {
      loading,
      characters,
      dialog,
      viewDialog,
      isEdit,
      selectedCharacter,
      pagination,
      form,
      filters,
      columns,
      languageOptions,
      roleOptions,
      regionOptions,
      filteredCharacters,
      getGenderIcon,
      getLanguageColor,
      openDialog,
      viewCharacter,
      editCharacter,
      confirmDelete,
      onSubmit,
      onRequest
    }
  }
}
</script>

<style lang="scss" scoped>
.q-table__card {
  box-shadow: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
