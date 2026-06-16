<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">
      Панель публікацій через Nuxt UI
    </h1>

    <UCard>
      <UTable :data="posts" :columns="columns" :loading="pending">
        <template #title-cell="{ row }">
          <NuxtLink :to="`/posts/${row.original.id}`" class="text-primary hover:underline font-medium">
            {{ row.original.title }}
          </NuxtLink>
        </template>
      </UTable>

      <div v-if="totalPosts > perPage" class="flex justify-center mt-4 border-t pt-4">
        <UPagination v-model:page="page" :total="totalPosts" :per-page="perPage"/>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted } from 'vue'
import type { BlogPost } from '~/../types/BlogPost'

const page = ref(1)
const perPage = 15
const totalPosts = ref(0)
const pending = ref(false)
const posts = ref<BlogPost[]>([])

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
    const response: any = await $fetch(`http://localhost/api/admin/blog/posts?page=${page.value}`)

    console.log(response)

    if (response.data) {
      posts.value = response.data
      totalPosts.value = response.meta?.total ?? response.total ?? 0
    } else if (Array.isArray(response)) {
      posts.value = response
      totalPosts.value = response.length
    }
  } catch (error) {
    console.error('Помилка завантаження:', error)
  } finally {
    pending.value = false
  }
}

watch(page, () => {
  loadData()
})

onMounted(loadData)
</script>
