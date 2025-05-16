<template>
  <div class="q-pa-md">
    <!-- Top controls -->
    <div class="row q-mb-md items-center">
      <div class="col-4">
        <q-btn
          color="primary"
          label="Create"
          icon="add"
          @click="openCreateDialog"
        />
      </div>
      <div class="col-4">
      </div>
      <div class="col-4">
        <q-btn-dropdown
          flat
          dense
          label="Columns"
          class="full-width"
        >
          <q-list>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Name</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.name" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Gender</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.gender" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Age</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.age" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Region</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.region" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Origin</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.origin" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Occupation</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.occupation" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Description</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.description" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <!-- Character list -->
    <div class="character-list q-mt-md">
      <div class="character-header row items-center q-pa-sm bg-grey-2">
        <div class="col-1 text-center">
        </div>

        <div class="col-1" v-if="visibleColumns.name">
          <div class="text-weight-bold">Name</div>
        </div>

        <div class="col-1" v-if="visibleColumns.gender">
          <div class="text-weight-bold">Gender</div>
        </div>

        <div class="col-1" v-if="visibleColumns.age">
          <div class="text-weight-bold">Age</div>
        </div>

        <div class="col-1" v-if="visibleColumns.region">
          <div class="text-weight-bold">Region</div>
        </div>

        <div class="col-1" v-if="visibleColumns.origin">
          <div class="text-weight-bold">Origin</div>
        </div>

        <div class="col-2" v-if="visibleColumns.occupation">
          <div class="text-weight-bold">Occupation</div>
        </div>

        <div class="col-4" v-if="visibleColumns.description">
          <div class="text-weight-bold">Description</div>
        </div>
      </div>

      <div class="character-items">
        <template v-for="character in characters" :key="character.name">
          <q-card flat bordered class="q-mb-sm">
            <q-card-section class="row items-center">
              <div class="col-1 text-left">
              </div>

              <div class="col-1" v-if="visibleColumns.name">
                {{ character.name }}
              </div>

              <div class="col-1" v-if="visibleColumns.gender">
                {{ character.gender }}
              </div>

              <div class="col-1" v-if="visibleColumns.age">
                {{ character.age }}
              </div>

              <div class="col-1" v-if="visibleColumns.region">
                {{ character.region }}
              </div>

              <div class="col-1" v-if="visibleColumns.origin">
                {{ character.origin }}
              </div>

              <div class="col-2" v-if="visibleColumns.occupation">
                {{ character.occupation }}
              </div>

              <div class="col-4" v-if="visibleColumns.description">
                {{ character.description }}
              </div>
            </q-card-section>
          </q-card>
        </template>
      </div>
    </div>

    <!-- Create Character Dialog -->
    <q-dialog v-model="createDialog" persistent>
      <q-card style="min-width: 800px">
        <q-card-section class="q-px-xl q-py-md">
          <div class="text-h6">Create New Character</div>
        </q-card-section>

        <q-card-section class="q-px-xl q-py-md">
          <q-form @submit="onSubmit" class="q-gutter-lg">
            <div class="row q-col-gutter-lg">
              <!-- Left Column -->
              <div class="col-6">
                <q-input
                  v-model="newCharacter.name"
                  label="Name"
                  :rules="[val => !!val || 'Name is required']"
                  outlined
                  class="q-mb-md"
                />

                <q-select
                  v-model="newCharacter.gender"
                  :options="genderOptions"
                  label="Gender"
                  :rules="[val => !!val || 'Gender is required']"
                  outlined
                  class="q-mb-md"
                />

                <q-input
                  v-model.number="newCharacter.age"
                  type="number"
                  label="Age"
                  :rules="[
                    val => !!val || 'Age is required',
                    val => val > 0 || 'Age must be greater than 0'
                  ]"
                  outlined
                  class="q-mb-md"
                />

                <q-select
                  v-model="newCharacter.region"
                  :options="regionOptions"
                  label="Region"
                  :rules="[val => !!val || 'Region is required']"
                  outlined
                  class="q-mb-md"
                />
              </div>

              <!-- Right Column -->
              <div class="col-6">
                <q-input
                  v-model="newCharacter.origin"
                  label="Origin"
                  :rules="[val => !!val || 'Origin is required']"
                  outlined
                  class="q-mb-md"
                />

                <q-input
                  v-model="newCharacter.occupation"
                  label="Occupation"
                  :rules="[val => !!val || 'Occupation is required']"
                  outlined
                  class="q-mb-md"
                />

                <q-input
                  v-model="newCharacter.voice_code"
                  label="Voice Code"
                  :rules="[val => !!val || 'Voice code is required']"
                  outlined
                  class="q-mb-md"
                />
              </div>

              <!-- Full Width Description -->
              <div class="col-12">
                <q-input
                  v-model="newCharacter.description"
                  type="textarea"
                  label="Description"
                  :rules="[val => !!val || 'Description is required']"
                  rows="3"
                  outlined
                  class="q-mb-md"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-px-xl q-py-md">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Create" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mockCharacters } from '../mock/characters'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'Characters',

  setup() {
    const characters = ref(mockCharacters)
    const createDialog = ref(false)

    const visibleColumns = ref({
      name: true,
      gender: true,
      age: true,
      region: true,
      origin: true,
      occupation: true,
      description: true
    })

    const genderOptions = ['male', 'female']
    const regionOptions = ['native', 'asia', 'america', 'europe']

    const newCharacter = ref({
      name: '',
      gender: null,
      age: null,
      region: null,
      origin: '',
      occupation: '',
      description: '',
      voice_code: ''
    })

    const openCreateDialog = () => {
      createDialog.value = true
      // Reset form
      newCharacter.value = {
        name: '',
        gender: null,
        age: null,
        region: null,
        origin: '',
        occupation: '',
        description: '',
        voice_code: ''
      }
    }

    const onSubmit = () => {
      // Add new character to the list
      characters.value.push({
        ...newCharacter.value,
        voice_code: newCharacter.value.voice_code || 'vi-VN-NamMinhNeural' // Default voice code
      })

      // Close dialog
      createDialog.value = false

      // Show success notification
      Notify.create({
        type: 'positive',
        message: 'Character created successfully'
      })
    }

    return {
      characters,
      visibleColumns,
      createDialog,
      newCharacter,
      genderOptions,
      regionOptions,
      openCreateDialog,
      onSubmit
    }
  }
})
</script>

<style scoped>
.character-list {
  flex: 1 1 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.character-header {
  flex: 0 0 auto;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.character-items {
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 50px;
}

.character-items .q-card {
  transition: all 0.3s;
  margin: 4px 0;
  border: 1px solid #e0e0e0;
  width: 100%;
  height: auto;
}

.character-items .q-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.character-items .q-card-section {
  padding: 8px;
  display: flex;
  align-items: center;
  min-height: 60px;
}

.character-items .q-card-section > div {
  padding: 4px;
  display: flex;
  align-items: center;
}
</style>
