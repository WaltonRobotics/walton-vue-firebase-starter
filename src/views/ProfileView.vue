<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { db, storage } from '@/firebase/config'
import { useAuth } from '@/composables/useAuth'

const { currentUser } = useAuth()
const uid = currentUser.value!.uid

const avatarUrl = ref('')
const isUploading = ref(false)
const errorMessage = ref('')

// Load a previously-saved avatar, if any, so it's still there after a refresh.
onMounted(async () => {
  const profileSnapshot = await getDoc(doc(db, 'profiles', uid))
  if (profileSnapshot.exists()) {
    avatarUrl.value = (profileSnapshot.data().avatarUrl as string) ?? ''
  }
})

async function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  errorMessage.value = ''
  isUploading.value = true
  try {
    // Storing at avatars/<uid>/<filename> lets storage.rules check that a
    // user can only upload into their own folder.
    const fileRef = storageRef(storage, `avatars/${uid}/${file.name}`)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)

    // Save the download URL in Firestore too, so this page can find it again
    // on the next visit without re-uploading.
    await setDoc(doc(db, 'profiles', uid), { avatarUrl: url }, { merge: true })
    avatarUrl.value = url
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to upload photo.'
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <section class="page">
    <h1>Profile</h1>

    <img v-if="avatarUrl" :src="avatarUrl" alt="Your avatar" class="avatar" />

    <label class="upload-label">
      {{ isUploading ? 'Uploading…' : 'Choose a profile photo' }}
      <input type="file" accept="image/*" :disabled="isUploading" @change="handleFileChange" />
    </label>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p>
      Signed in as <strong>{{ currentUser?.email }}</strong>
    </p>
  </section>
</template>

<style scoped>
.page {
  max-width: 360px;
  margin: 0 auto;
}

.avatar {
  display: block;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.upload-label {
  display: inline-block;
  cursor: pointer;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.upload-label input {
  display: none;
}

.error {
  color: var(--color-error);
}
</style>
