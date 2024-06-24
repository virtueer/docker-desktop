import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/volumes/')({
  component: () => <div>Hello /volumes/!</div>
})