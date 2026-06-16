<template>
  <div class="container mx-auto p-6 max-w-xl">
    <UButton to="/categories" variant="link" icon="i-heroicons-arrow-left" class="mb-4">
      Назад до списку
    </UButton>

    <h1 class="text-2xl font-bold mb-6 text-center md:text-left">
      Редагування категорії
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
const categoryId = route.params.id

const state = reactive({
  title: '',
  parent_id: null as string | number | null
})

const errors = reactive({
  title: ''
})

const submitting = ref(false)
const selectedParent = ref<any>(null)
const parentOptions = ref<{ label: string, value: string | number | null }[]>([])

watch(selectedParent, (newVal: any) => {
  if (newVal && typeof newVal === 'object') {
    state.parent_id = newVal.value
  } else {
    state.parent_id = newVal
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
    const listResponse: any = await $fetch('http://localhost/api/admin/blog/categories')
    const rawCategories = listResponse.data || listResponse

    if (Array.isArray(rawCategories)) {
      const filtered = rawCategories.filter((cat: any) => String(cat.id) !== String(categoryId))

      parentOptions.value = [
        { label: '--- Без батьківської категорії ---', value: null },
        ...filtered.map((cat: any) => ({
          label: cat.title,
          value: cat.id
        }))
      ]
    }

    const currentCategory: any = await $fetch(`http://localhost/api/admin/blog/categories/${categoryId}`)
    const data = currentCategory.data || currentCategory

    state.title = data.title
    state.parent_id = data.parent_id

    if (data.parent_id) {
      const foundParent = parentOptions.value.find(opt => String(opt.value) === String(data.parent_id))
      if (foundParent) selectedParent.value = foundParent
    } else {
      selectedParent.value = parentOptions.value[0]
    }

  } catch (e) {
    console.error('Помилка завантаження даних категорії:', e)
    alert('Не вдалося завантажити дані категорії.')
  }
})

const handleCustomSubmit = async () => {
  if (!state.title.trim()) {
    errors.title = 'Назва категорії є обовʼязковою'
    return
  }

  submitting.value = true
  try {
    const payload = {
      title: state.title,
      slug: createSlugFromTitle(state.title) || `category-${Date.now()}`,
      parent_id: (state.parent_id === null || state.parent_id === '' || state.parent_id === 0) ? null : Number(state.parent_id),
      _method: 'PUT'
    }

    await $fetch<any>(`http://localhost/api/admin/blog/categories/${categoryId}`, {
      method: 'POST',
      body: payload
    } as any)

    navigateTo('/categories')
  } catch (error: any) {
    console.error('Помилка збереження:', error.data)
    if (error.data?.errors?.title) {
      errors.title = error.data.errors.title[0]
    } else {
      alert('Помилка при оновленні категорії.')
    }
  } finally {
    submitting.value = false
  }
}
</script>
