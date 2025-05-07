import { useBaseStore } from 'stores/base'

export default async ({ app }) => {
  const baseStore = useBaseStore()
  await baseStore.initializeBaseData()
}
