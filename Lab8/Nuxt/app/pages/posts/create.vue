<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <UButton to="/posts" variant="link" icon="i-heroicons-arrow-left" class="mb-4">
      Назад до списку
    </UButton>

    <h1 class="text-2xl font-bold mb-6 text-center md:text-left">
      Створення публікації
    </h1>

    <UCard>
      <form class="flex flex-col gap-5" @submit.prevent="handleCustomSubmit">

        <UFormField label="Заголовок публікації" :error="errors.title" required class="w-full">
          <UInput
            v-model="state.title"
            placeholder="Введіть заголовок статті..."
            icon="i-heroicons-document-text"
            class="w-full"
            @input="errors.title = ''"
          />
        </UFormField>

        <UFormField label="Категорія" class="w-full">
          <USelectMenu
            v-model="selectedCategory"
            :items="categoryOptions"
            value-key="value"
            label-key="label"
            placeholder="Оберіть категорію (необов'язково)"
            icon="i-heroicons-folder"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Вміст публікації" :error="errors.content_raw" required class="w-full">
          <UTextarea
            v-model="state.content_raw"
            placeholder="Напишіть щось цікаве тут..."
            :rows="8"
            class="w-full"
            @input="errors.content_raw = ''"
          />
        </UFormField>

        <div class="flex items-center gap-2 mt-2">
          <UCheckbox
            v-model="state.is_published"
            name="is_published"
            label="Опублікувати відразу"
          />
        </div>

        <div class="flex justify-end gap-3 border-t pt-5 mt-4">
          <UButton type="button" variant="ghost" to="/posts">
            Скасувати
          </UButton>
          <UButton type="submit" color="primary" icon="i-heroicons-check" :loading="submitting">
            Зберегти
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const state = reactive({
  title: '',
  category_id: null as number | null,
  content_raw: '',
  is_published: false
})

const errors = reactive({
  title: '',
  content_raw: ''
})

const submitting = ref(false)
const selectedCategory = ref(null)
const categoryOptions = ref<{ label: string, value: number | null }[]>([])

// Синхронізація селекту з кодом
watch(selectedCategory, (newVal: any) => {
  if (newVal && typeof newVal === 'object') {
    state.category_id = newVal.value
  } else {
    state.category_id = newVal
  }
})

const createSlugFromTitle = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

onMounted(async () => {
  try {
    // Тягнемо категорії для селекту
    const response: any = await $fetch('http://localhost/api/admin/blog/categories?per_page=100')
    const rawCategories = response.data || response

    if (Array.isArray(rawCategories)) {
      categoryOptions.value = [
        { label: '--- Без категорії ---', value: null },
        ...rawCategories.map((cat: any) => ({
          label: cat.title,
          value: cat.id
        }))
      ]
    }
  } catch (e) {
    console.error('Не вдалося завантажити категорії:', e)
  }
})

const validateForm = () => {
  let isValid = true
  if (!state.title.trim()) {
    errors.title = 'Заголовок є обовʼязковим'
    isValid = false
  }
  if (!state.content_raw.trim()) {
    errors.content_raw = 'Вміст статті не може бути порожнім'
    isValid = false
  }
  return isValid
}

const handleCustomSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    const generatedSlug = createSlugFromTitle(state.title) || `post-${Date.now()}`

    const payload = {
      title: state.title,
      slug: generatedSlug,
      category_id: state.category_id ? Number(state.category_id) : null,
      content_raw: state.content_raw,
      is_published: state.is_published ? 1 : 0
    }

    await $fetch('http://localhost/api/admin/blog/posts', {
      method: 'POST',
      body: payload
    })

    navigateTo('/posts')
  } catch (error: any) {
    console.error('Помилка сервера Laravel:', error.data)
    if (error.data?.errors?.title) {
      errors.title = error.data.errors.title[0]
    } else {
      alert('Помилка збереження публікації.')
    }
  } finally {
    submitting.value = false
  }
}
</script>
