import { useTopicStore } from 'src/modules/store/contents/topic.store'

export default async ({ app }) => {
  const topicStore = useTopicStore()
  await topicStore.fetchTopics()
}
