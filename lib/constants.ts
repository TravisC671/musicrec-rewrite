export const ratingLabels = ["F", "D", "C", "B", "A", "S"];

export function isFriend(clerk_user_id: string) {
  const friends = [
    "user_2wQoNj3NuxTBtjdYsGUQmgN3TWP",
    "user_2wQy4sLjvjtNuM411E6iVs24S7Y",
  ];
  return friends.includes(clerk_user_id);
}
