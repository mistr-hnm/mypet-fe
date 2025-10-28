
import { PetForm  } from '../../../modules/pet/PetForm';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/pet/$id')({
  component: PetForm,
  beforeLoad : () => ({
    id : ''
  })
})
 