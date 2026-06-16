<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Панель публікацій</h1>
      <UButton to="/posts/create" icon="i-heroicons-plus" color="primary">
        Додати публікацію
      </UButton>
    </div>

    <UCard>
      <UTable :data="posts" :columns="columns" :loading="pending">
        <template #title-cell="{ row }">
          <NuxtLink :to="`/posts/${row.original.id}`" class="text-primary hover:underline font-medium">
            {{ row.original.title }}
          </NuxtLink>
        </template>

        <template #published_at-cell="{ row }">
          <span class="text-sm text-gray-500">
            {{
              row.original.published_at ? new Date(row.original.published_at).toLocaleDateString('uk-UA') : 'Чернетка' }}
          </span>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="getDropdownItems(row.original)">
            <UButton variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid"/>
          </UDropdownMenu>
        </template>
      </UTable>

      <div v-if="totalPosts > perPage" class="flex justify-center mt-4 border-t pt-4">
        <UPagination
          v-model:page="page"
          :total="Number(totalPosts)"
          :items-per-page="Number(perPage)"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, onMounted} from 'vue'
import type {BlogPost} from '~/../types/BlogPost'

const page = ref(1)
const perPage = ref(15)
const totalPosts = ref(0)
const pending = ref(false)
const posts = ref<BlogPost[]>([])

const columns = [
  {accessorKey: 'id', header: '#'},
  {accessorKey: 'title', header: 'Заголовок'},
  {accessorKey: 'published_at', header: 'Дата публікації'},
  {accessorKey: 'actions', header: 'Дії'}
]

const loadData = async () => {
  pending.value = true
  try {
    const response: any = await $fetch(`http://localhost/api/admin/blog/posts?page=${page.value}`)

    if (response.data) {
      posts.value = response.data
      totalPosts.value = response.meta?.total ?? response.total ?? 0
      perPage.value = response.meta?.per_page ?? response.per_page ?? 15
    } else if (Array.isArray(response)) {
      posts.value = response
      totalPosts.value = response.length
    }
  } catch (error) {
    console.error('Помилка завантаження постів:', error)
  } finally {
    pending.value = false
  }
}

const deletePost = async (id: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цю публікацію?')) return

  try {
    await $fetch<any>(`http://localhost/api/admin/blog/posts/${id}`, {
      method: 'DELETE'
    } as any)

    await loadData()
  } catch (error) {
    console.error('Помилка видалення:', error)
    alert('Не вдалося видалити публікацію.')
  }
}

const getDropdownItems = (row: any) => [
  [
    {
      label: 'Редагувати',
      icon: 'i-heroicons-pencil-square',
      onSelect: () => navigateTo(`/posts/${row.id}-edit`)
    },
    {
      label: 'Видалити',
      icon: 'i-heroicons-trash',
      onSelect: () => deletePost(row.id)
    }
  ]
]

watch(page, () => {
  loadData()
})

onMounted(loadData)
</script>
