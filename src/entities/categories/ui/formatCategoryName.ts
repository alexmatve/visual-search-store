import { CategoryName } from '../model/typing'

export function formatCategoryName(categoryName: CategoryName) {
  const words = categoryName.split('_')

  return words.map((word, index) => (index === 0 ? word : word.toLowerCase())).join(' ')
}
