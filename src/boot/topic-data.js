import { useTopicStore } from 'stores/topic'

export default async ({ app }) => {
  const topicStore = useTopicStore()
  await topicStore.fetchTopics()
}
