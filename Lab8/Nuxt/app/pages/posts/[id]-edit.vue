<template>
  <div class="container mx-auto p-6 max-w-xl">
    <UButton to="/posts" variant="link" icon="i-heroicons-arrow-left" class="mb-4">
      Назад до списку
    </UButton>

    <h1 class="text-2xl font-bold mb-6 text-center md:text-left">
      Редагування публікації
    </h1>

    <UCard>
      <form class="flex flex-col gap-5" @submit.prevent="handleCustomSubmit">

        <UFormField label="Заголовок публікації" :error="errors.title" required class="w-full">
          <UInput
            v-model="state.title"
            placeholder="Введіть заголовок..."
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
            placeholder="Введіть текст статті..."
            :rows="8"
            class="w-full"
            @input="errors.content_raw = ''"
          />
        </UFormField>

        <div class="flex items-center gap-2 mt-2">
          <UCheckbox
            v-model="state.is_published"
            name="is_published"
            label="Опубліковано"
          />
        </div>

        <div class="flex justify-end gap-3 border-t pt-5 mt-4">
          <UButton type="button" variant="ghost" to="/posts">
            Скасувати
          </UButton>
          <UButton type="submit" color="primary" icon="i-heroicons-check" :loading="submitting">
            Оновити
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const postId = route.params.id

const state = reactive({
  title: '',
  category_id: null as string | number | null,
  content_raw: '',
  is_published: false
})

const errors = reactive({
  title: '',
  content_raw: ''
})

const submitting = ref(false)
const selectedCategory = ref<any>(null)
const categoryOptions = ref<{ label: string, value: string | number | null }[]>([])

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
    const listResponse: any = await $fetch('http://localhost/api/admin/blog/categories?per_page=100')
    const rawCategories = listResponse.data || listResponse

    if (Array.isArray(rawCategories)) {
      categoryOptions.value = [
        { label: '--- Без категорії ---', value: null },
        ...rawCategories.map((cat: any) => ({
          label: cat.title,
          value: cat.id
        }))
      ]
    }

    const currentPost: any = await $fetch(`http://localhost/api/blog/posts/${postId}`)
    const data = currentPost.data || currentPost

    state.title = data.title
    state.content_raw = data.content_raw || data.content || ''
    state.category_id = data.category_id || data.category?.id || null
    state.is_published = data.is_published === 1 || !!data.published_at

    if (state.category_id) {
      const foundCategory = categoryOptions.value.find(opt => String(opt.value) === String(state.category_id))
      if (foundCategory) selectedCategory.value = foundCategory
    } else {
      selectedCategory.value = categoryOptions.value[0]
    }

  } catch (e) {
    console.error('Помилка завантаження даних публікації:', e)
    alert('Не вдалося завантажити дані публікації.')
  }
})

const handleCustomSubmit = async () => {
  if (!state.title.trim()) {
    errors.title = 'Заголовок публікації є обовʼязковим'
    return
  }
  if (!state.content_raw.trim()) {
    errors.content_raw = 'Вміст статті не може бути порожнім'
    return
  }

  submitting.value = true
  try {
    const payload = {
      title: state.title,
      slug: createSlugFromTitle(state.title) || `post-${Date.now()}`,
      category_id: (state.category_id === null || state.category_id === '' || state.category_id === 0) ? null : Number(state.category_id),
      content_raw: state.content_raw,
      is_published: state.is_published ? 1 : 0,
      _method: 'PUT'
    }

    await $fetch<any>(`http://localhost/api/admin/blog/posts/${postId}`, {
      method: 'POST',
      body: payload
    } as any)

    navigateTo('/posts')
  } catch (error: any) {
    console.error('Помилка збереження зміни поста:', error.data)
    if (error.data?.errors?.title) {
      errors.title = error.data.errors.title[0]
    } else {
      alert('Помилка при оновленні публікації.')
    }
  } finally {
    submitting.value = false
  }
}
</script>
