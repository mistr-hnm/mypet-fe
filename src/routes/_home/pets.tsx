import { createFileRoute } from '@tanstack/react-router'
import { PetList } from '../../modules/pet/PetList'

export const Route = createFileRoute('/_home/pets')({
  component: PetList,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page ?? 1),
      limit: Number(search.limit ?? 10)
    }
  }
})
