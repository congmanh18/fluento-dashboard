<template>
  <div class="q-pa-md">
    <!-- Header -->
    <h2 class="text-h5 text-purple-800">Tree Table</h2>
    <p class="text-subtitle1 text-grey-7 q-mb-md">A simple Tree Collapsed/Expanded Table</p>

    <!-- Tree Table -->
    <div class="custom-table">
      <!-- Table Header -->
      <div class="table-header row q-pa-sm bg-grey-2">
        <div class="col-4">Content</div>
        <div class="col-4">Description</div>
        <div class="col-4">Note</div>
      </div>

      <!-- Table Body -->
      <div class="table-body">
        <div v-for="node in treeData" :key="node.id" class="node-wrapper">
          <!-- Parent Node -->
          <div class="table-row row q-pa-sm items-center">
            <div class="col-4 row items-center">
              <q-icon
                v-if="node.children && node.children.length"
                :name="node.expanded ? 'remove' : 'add'"
                class="q-mr-sm cursor-pointer"
                @click="toggleNode(node)"
              />
              <span>{{ node.content }}</span>
            </div>
            <div class="col-4">{{ node.description }}</div>
            <div class="col-4">{{ node.note }}</div>
          </div>

          <!-- Child Nodes (recursive) -->
          <div v-if="node.expanded && node.children && node.children.length" class="child-nodes">
            <TreeNode
              v-for="child in node.children"
              :key="child.id"
              :node="child"
              :level="1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { useQuasar } from 'quasar'

const q = useQuasar()

// TreeNode component for recursive rendering
const TreeNode = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    resolve({
      name: 'TreeNode',
      props: {
        node: Object,
        level: {
          type: Number,
          default: 0,
        },
      },
      template: `
        <div class="node-wrapper">
          <!-- Node Row -->
          <div class="table-row row q-pa-sm items-center">
            <div class="col-4 row items-center">
              <div :style="{ width: \`\${level * 20}px\` }" />
              <q-icon
                v-if="node.children && node.children.length"
                :name="node.expanded ? 'remove' : 'add'"
                class="q-mr-sm cursor-pointer"
                @click="toggleNode(node)"
              />
              <span>{{ node.content }}</span>
            </div>
            <div class="col-4">{{ node.description }}</div>
            <div class="col-4">{{ node.note }}</div>
          </div>

          <!-- Recursive Child Nodes -->
          <div v-if="node.expanded && node.children && node.children.length" class="child-nodes">
            <TreeNode
              v-for="child in node.children"
              :key="child.id"
              :node="child"
              :level="level + 1"
            />
          </div>
        </div>
      `,
      setup(props) {
        const toggleNode = (node) => {
          node.expanded = !node.expanded
        }
        return { toggleNode }
      },
    })
  })
})

// Sample tree data
const treeData = ref([
  {
    id: 1,
    content: 'Node 1',
    description: 'Node 1 description',
    note: 'Node 1 note',
    expanded: true,
    children: [
      {
        id: 1.1,
        content: 'Node 1.1',
        description: 'Node 1.1 description',
        note: 'Node 1.1 note',
        children: [],
      },
      {
        id: 1.2,
        content: 'Node 1.2',
        description: 'Node 1.2 description',
        note: 'Node 1.2 note',
        expanded: true,
        children: [],
      },
    ],
  },
  {
    id: 2,
    content: 'Node 2',
    description: 'Node 2 description',
    note: 'Node 2 note',
    expanded: false,
    children: [
      {
        id: 2.1,
        content: 'Node 2.1',
        description: 'Node 2.1 description',
        note: 'Node 2.1 note',
        children: [],
      },
      {
        id: 2.2,
        content: 'Node 2.2',
        description: 'Node 2.2 description',
        note: 'Node 2.2 note',
        children: [],
      },
      {
        id: 2.3,
        content: 'Node 2.3',
        description: 'Node 2.3 description',
        note: 'Node 2.3 note',
        children: [],
      },
    ],
  },
])

// Methods
const toggleNode = (node) => {
  node.expanded = !node.expanded
}
</script>

<style scoped>
.custom-table {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  background-color: #f5f5f5;
}

.table-header > div {
  padding: 12px;
  border-right: 1px solid #ddd;
}

.table-header > div:last-child {
  border-right: none;
}

.table-body {
  border-bottom: 1px solid #ddd;
}

.table-row {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.table-row > div {
  padding: 12px;
  border-right: 1px solid #eee;
  min-height: 50px;
  display: flex;
  align-items: center;
}

.table-row > div:last-child {
  border-right: none;
}

.table-row:nth-child(even) {
  background-color: #f9f9f9;
}

.table-row:hover {
  background-color: #f5f5f5;
}

.child-nodes {
  margin-left: 20px;
}
</style>
