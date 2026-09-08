<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/composables/useAuth'
import type { Task } from '@/types/Task'

// The router guard (see src/router/index.ts) only lets logged-in users reach
// this page, so currentUser is guaranteed to be set here.
const { currentUser } = useAuth()
const uid = currentUser.value!.uid

const tasks = ref<Task[]>([])
const newTaskTitle = ref('')
const errorMessage = ref('')

// Only ever fetch tasks that belong to this user, newest first.
const tasksQuery = query(
  collection(db, 'tasks'),
  where('uid', '==', uid),
  orderBy('createdAt', 'desc'),
)

// onSnapshot keeps `tasks` updated live -- add, edit, or delete a task from
// another tab and this list updates on its own, no refresh needed.
const unsubscribe = onSnapshot(
  tasksQuery,
  (snapshot) => {
    tasks.value = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as Omit<Task, 'id'>),
    }))
  },
  (error) => {
    errorMessage.value = error.message
  },
)

onUnmounted(unsubscribe)

async function addTask() {
  const title = newTaskTitle.value.trim()
  if (!title) return

  await addDoc(collection(db, 'tasks'), {
    uid,
    title,
    done: false,
    createdAt: serverTimestamp(),
  })
  newTaskTitle.value = ''
}

async function toggleTask(task: Task) {
  await updateDoc(doc(db, 'tasks', task.id), { done: !task.done })
}

async function removeTask(task: Task) {
  await deleteDoc(doc(db, 'tasks', task.id))
}
</script>

<template>
  <section class="page">
    <h1>My Tasks</h1>

    <form class="add-form" @submit.prevent="addTask">
      <input v-model="newTaskTitle" type="text" placeholder="Add a task..." required />
      <button type="submit">Add</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="tasks.length === 0">No tasks yet — add one above!</p>

    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ done: task.done }">
        <label>
          <input type="checkbox" :checked="task.done" @change="toggleTask(task)" />
          {{ task.title }}
        </label>
        <button class="delete-button" type="button" @click="removeTask(task)">Delete</button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.page {
  max-width: 480px;
  margin: 0 auto;
}

.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-form input {
  flex: 1;
}

.task-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.task-list li.done label {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.error {
  color: var(--color-error);
}
</style>
