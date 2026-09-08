// Shared login state for the whole app, using a plain composable instead of a
// state-management library. `currentUser` lives here, at module scope, so every
// component that calls useAuth() shares the exact same ref instead of getting
// its own copy.
import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '@/firebase/config'

const currentUser = ref<User | null>(null)

// Firebase checks whether the user is already logged in (e.g. from a previous
// visit) asynchronously. `authReady` resolves once that first check finishes,
// so the router can wait for it before deciding whether to redirect to /login.
let markAuthReady: () => void
export const authReady = new Promise<void>((resolve) => {
  markAuthReady = resolve
})

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
  markAuthReady()
})

export function useAuth() {
  async function signup(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function loginWithGoogle() {
    await signInWithPopup(auth, new GoogleAuthProvider())
  }

  async function logout() {
    await signOut(auth)
  }

  return { currentUser, signup, login, loginWithGoogle, logout }
}
