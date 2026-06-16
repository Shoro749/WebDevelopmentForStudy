<template>
  <div class="container mx-auto p-6 max-w-3xl">
    <div class="mb-6">
      <NuxtLink to="/posts" class="text-primary hover:underline flex items-center gap-2">
        ← Назад до списку
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-center py-12">
      <USpinner size="lg" />
      <p class="mt-2 text-gray-500">Завантаження публікації...</p>
    </div>

    <UCard v-else-if="post">
      <template #header>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 text-xs text-gray-500">
            <span class="bg-gray-100 px-2 py-1 rounded">
              Категорія: {{ post.category?.title || 'Без категорії' }}
            </span>
            <span class="bg-gray-100 px-2 py-1 rounded">
              Автор: {{ post.user?.name || 'Невказаний' }}
            </span>
          </div>
          <h1 class="text-3xl font-bold text-gray-200 mt-2">{{ post.title }}</h1>
          <p class="text-xs text-gray-400" v-if="post.published_at">
            Опубліковано: {{ post.published_at }}
          </p>
        </div>
      </template>

      <div class="prose max-w-none text-gray-400 leading-relaxed">
        <p class="whitespace-pre-line">{{ post.content_raw }}</p>

      </div>
    </UCard>

    <div v-else class="text-center py-12 text-red-500">
      <p class="text-xl font-semibold">Публікацію не знайдено 404</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { BlogPost } from '~/../types/BlogPost'

const route = useRoute()
const post = ref<BlogPost | null>(null)
const pending = ref(true)

const postId = route.params.id

const fetchPost = async () => {
  pending.value = true
  try {
    const response: any = await $fetch(`http://localhost/api/blog/posts/${postId}`)

    post.value = response.data || response
  } catch (error) {
    console.error('Помилка завантаження поста:', error)
  } finally {
    pending.value = false
  }
}

fetchPost()
</script>
