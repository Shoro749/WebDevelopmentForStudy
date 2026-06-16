<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">
      Панель публікацій через Nuxt UI
    </h1>

    <UCard>
      <UTable :data="visiblePosts" :columns="columns">
        <template #title-cell="{ row }">
          <NuxtLink :to="`/posts/${row.original.id}`" class="text-primary hover:underline font-medium">
            {{ row.original.title }}
          </NuxtLink>
        </template>
      </UTable>

      <div v-if="totalPosts > perPage" class="flex justify-center mt-4 border-t pt-4">
        <UPagination v-model:page="page" :total="totalPosts" :items-per-page="perPage"/>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { BlogPost } from '~/../types/BlogPost'

const page = ref(1)
const perPage = 15

const totalPosts = ref(0)
const allPosts = ref<BlogPost[]>([])
const pending = ref(false)

const visiblePosts = computed(() => {
  const start = (page.value - 1) * perPage
  const end = start + perPage

  return allPosts.value.slice(start, end)
})

const columns = [
  {
    accessorKey: 'id',
    header: '#'
  },
  {
    accessorKey: 'title',
    header: 'Заголовок'
  },
  {
    accessorKey: 'published_at',
    header: 'Дата публікації'
  }
]

const loadData = async () => {
  pending.value = true

  try {
    const response: any = await $fetch(
      'http://localhost/api/blog/posts'
    )

    console.log('Отримані дані:', response)

    if (Array.isArray(response)) {
      allPosts.value = response
      totalPosts.value = response.length
    } else if (response.data) {
      allPosts.value = response.data
      totalPosts.value =
        response.meta?.total ?? response.data.length
    }

    console.log('Всі пости:', allPosts.value)
  } catch (error) {
    console.error('Помилка завантаження:', error)
  } finally {
    pending.value = false
  }
}

onMounted(loadData)
</script>
