<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-center">
      <div class="w-full">
        <nav class="navbar bg-gray-100 p-3 mb-4 rounded">
          <a href="/admin/blog/posts/create" class="text-blue-500 font-bold">Додати новий пост</a>
        </nav>
        <div class="card border rounded shadow">
          <div class="card-body p-4">
            <table class="table-auto w-full text-left border-collapse">
              <thead>
              <tr class="bg-gray-200">
                <th class="p-2 border">#</th>
                <th class="p-2 border">Автор</th>
                <th class="p-2 border">Категорія</th>
                <th class="p-2 border">Заголовок</th>
                <th class="p-2 border">Дата публікації</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
                <td class="p-2 border">{{ post.id }}</td>
                <td class="p-2 border">{{ post.user?.name || 'Анонім' }}</td>
                <td class="p-2 border">{{ post.category?.title || 'Без категорії' }}</td>
                <td class="p-2 border">
                  <a :href="'/admin/blog/posts/' + post.id + '/edit'" class="text-blue-600 hover:underline">
                    {{ post.title }}
                  </a>
                </td>
                <td class="p-2 border">{{ post.published_at || 'Чернетка' }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const posts = ref([])

const getPosts = async () => {
  try {
    // Вказуй повний URL до свого Laravel, якщо не налаштований proxy в nuxt.config
    const response: any = await $fetch('http://localhost/api/blog/posts')
    console.log('Дані з Laravel:', response)

    // Якщо репозиторій Laravel повертає пагінацію, масив лежить в response.data
    posts.value = response.data || response
  } catch (error) {
    console.error('Помилка завантаження постів:', error)
  }
}

// Викликаємо функцію при завантаженні компонента
getPosts()
</script>
