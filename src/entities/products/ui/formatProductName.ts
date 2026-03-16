export function formatProductName(productName: string) {
  const words = productName.split('_')

  return words.map((word, index) => (index === 0 ? word : word.toLowerCase())).join(' ')
}
