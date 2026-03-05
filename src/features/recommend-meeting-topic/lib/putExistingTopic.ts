import type { TopicItem } from "../model/types";

export function putExistingTopic(initialTopics?: TopicItem[]) {
  const topics = ["", "", ""];
  if (!initialTopics) return topics;

  initialTopics.forEach((item) => {
    const index = item.topicNo - 1;
    if (index >= 0 && index < 3) {
      topics[index] = item.topic ?? "";
    }
  });

  return topics;
}
