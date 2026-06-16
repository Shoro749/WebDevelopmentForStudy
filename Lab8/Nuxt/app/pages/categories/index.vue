<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Панель категорій</h1>
      <UButton to="/categories/create" icon="i-heroicons-plus" color="primary">
        Додати категорію
      </UButton>
    </div>

    <UCard>
      <UTable :data="categories" :columns="columns" :loading="pending">
        <template #title-cell="{ row }">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ row.original.title }}
          </span>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="getDropdownItems(row.original)">
            <UButton variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid"/>
          </UDropdownMenu>
        </template>
      </UTable>

      <div v-if="totalCategories > perPage" class="flex justify-center mt-4 border-t pt-4">
        <UPagination v-model:page="page" :total="Number(totalCategories)" :items-per-page="Number(perPage)"/>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const page = ref(1)
const perPage = ref(5)
const totalCategories = ref(0)
const pending = ref(false)
const categories = ref<any[]>([])

const columns = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'title', header: 'Назва категорії' },
  { accessorKey: 'parent_title', header: 'Батьківська категорія' },
  { accessorKey: 'actions', header: 'Дії' }
]

const loadData = async () => {
  pending.value = true
  try {
    const response: any = await $fetch(`http://localhost/api/admin/blog/categories?page=${page.value}`)

    if (response.data) {
      categories.value = response.data
      totalCategories.value = response.meta?.total ?? 0
      perPage.value = response.meta?.per_page ?? 5
    }
  } catch (error) {
    console.error('Помилка завантаження категорій:', error)
  } finally {
    pending.value = false
  }
}

const deleteCategory = async (id: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цю категорію?')) return

  try {
    // Фікс тайпінгу для Nuxt v4
    await $fetch<any>(`http://localhost/api/admin/blog/categories/${id}`, {
      method: 'DELETE'
    } as any)
    await loadData()
  } catch (error) {
    console.error('Помилка видалення:', error)
    alert('Не вдалося видалити категорію.')
  }
}

const getDropdownItems = (row: any) => [
  [
    {
      label: 'Редагувати',
      icon: 'i-heroicons-pencil-square',
      onSelect: () => navigateTo(`/categories/${row.id}/edit`)
    },
    {
      label: 'Видалити',
      icon: 'i-heroicons-trash',
      onSelect: () => deleteCategory(row.id)
    }
  ]
]

watch(page, () => {
  loadData()
})

onMounted(loadData)
</script>
