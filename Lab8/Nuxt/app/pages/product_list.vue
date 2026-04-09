<script setup>
import ProductCard from "~/components/ProductCard.vue";
import { ref, computed } from 'vue'

const isAnnual = ref(true)
const { data: products, pending, error } = await useProduct()

const visibleProducts = computed(() => {
  if (!products.value) return []
  return isAnnual.value ? products.value.slice(0, 3) : products.value.slice(3, 6)
})

useHead({
  title: 'Список продуктів'
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
      <h1 class="text-4xl font-bold text-slate-900">Start Your 3 Day Free Trial</h1>

      <div class="flex items-center gap-4">
        <span class="text-emerald-600 font-medium text-sm">Save up to 20%</span>

        <div class="bg-gray-100 p-1 rounded-xl flex items-center">
          <button
            @click="isAnnual = true" :class="[isAnnual ? 'bg-white shadow-sm text-gray-500' : 'text-gray-600 hover:text-gray-700']"
            class="px-6 py-2 rounded-lg text-sm font-semibold transition-all">
            Annual
          </button>
          <button @click="isAnnual = false" :class="[!isAnnual ? 'bg-white shadow-sm text-gray-500' :
          'text-gray-600 hover:text-gray-700']" class="px-6 py-2 rounded-lg text-sm font-semibold transition-all">
            Monthly
          </button>
        </div>
      </div>
    </div>

    <div v-if="pending" class="text-center py-20 text-xl font-medium text-gray-500">
      Loading...
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500">
      Error: {{ error.message }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product" :showButton="true"/>
    </div>
  </div>
</template>
