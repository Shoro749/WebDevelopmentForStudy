<template>
  <div class="container mx-auto p-6 max-w-xl">
    <UButton to="/categories" variant="link" icon="i-heroicons-arrow-left" class="mb-4">
      Назад до списку
    </UButton>

    <h1 class="text-2xl font-bold mb-6 text-center md:text-left">
      Створення категорії
    </h1>

    <UCard>
      <form class="flex flex-col gap-5" @submit.prevent="handleCustomSubmit">

        <UFormField label="Назва категорії" :error="errors.title" required class="w-full">
          <UInput
            v-model="state.title"
            placeholder="Наприклад: Новини IT"
            icon="i-heroicons-tag"
            class="w-full"
            @input="errors.title = ''"
          />
        </UFormField>

        <UFormField label="Батьківська категорія" class="w-full">
          <USelectMenu
            v-model="selectedParent"
            :items="parentOptions"
            value-key="value"
            label-key="label"
            placeholder="Оберіть батьківську категорію (необов'язково)"
            icon="i-heroicons-folder"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-3 border-t pt-5 mt-4">
          <UButton type="button" variant="ghost" to="/categories">
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
  parent_id: null as string | number | null
})

const errors = reactive({
  title: ''
})

const submitting = ref(false)
const selectedParent = ref(null)
const parentOptions = ref<{ label: string, value: string | number | null }[]>([])

watch(selectedParent, (newVal: any) => {
  if (newVal && typeof newVal === 'object') {
    state.parent_id = newVal.value
  } else {
    state.parent_id = newVal
  }
})

// Допоміжна функція для бекенду: робимо безпечний slug з title перед відправкою
const createSlugFromTitle = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // замінюємо пробіли на дефіси
    .replace(/[^a-z0-9-]/g, '') // видаляємо кирилицю та спецсимволи
    .replace(/-+/g, '-') // прибираємо подвійні дефіси
    .replace(/^-+|-+$/g, '') // зрізаємо дефіси по краях
}

onMounted(async () => {
  try {
    const response: any = await $fetch('http://localhost/api/admin/blog/categories')
    const rawCategories = response.data || response

    if (Array.isArray(rawCategories)) {
      parentOptions.value = [
        { label: '--- Без батьківської категорії ---', value: null },
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
    errors.title = 'Назва категорії є обовʼязковою'
    isValid = false
  }
  return isValid
}

const handleCustomSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    const generatedSlug = createSlugFromTitle(state.title) || `category-${Date.now()}`

    const payload = {
      title: state.title,
      slug: generatedSlug,
      parent_id: (state.parent_id === null || state.parent_id === '') ? null : Number(state.parent_id)
    }

    await $fetch('http://localhost/api/admin/blog/categories', {
      method: 'POST',
      body: payload
    })

    navigateTo('/categories')
  } catch (error: any) {
    console.error('Помилка сервера Laravel:', error.data)
    if (error.data?.errors?.title) {
      errors.title = error.data.errors.title[0]
    } else {
      alert('Помилка збереження. Перевірте логи Laravel (storage/logs/laravel.log).')
    }
  } finally {
    submitting.value = false
  }
}
</script>
