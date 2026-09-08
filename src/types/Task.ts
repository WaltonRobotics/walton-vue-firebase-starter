import type { Timestamp } from 'firebase/firestore'

// Shape of one document in the "tasks" collection in Firestore.
export interface Task {
  id: string
  uid: string
  title: string
  done: boolean
  createdAt: Timestamp | null
}
