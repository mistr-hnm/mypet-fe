import { OAuth } from '../../modules/auth/oauth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/oauth')({
  component: OAuth,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      data: search.data ?? ""
    }
  }
})