import { CATEGORIES } from '../../lib/constants'

export default function CategoryBadge({ categoryId, size = 'sm' }) {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  if (!category) return null

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  }

  return (
    <span
      className={`rounded-full font-medium ${sizes[size]}`}
      style={{ backgroundColor: `${category.color}20`, color: category.color }}
    >
      {category.label}
    </span>
  )
}
