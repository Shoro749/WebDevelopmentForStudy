<script setup lang="ts">
import type { Product } from '~/../types/product'

const props = defineProps<{
  product: Product
  showButton?: boolean
}>()
</script>

<template>
  <div>
    <div class="relative bg-white rounded-3xl p-8 ring-1 ring-gray-200 overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-cyan-400"></div>

      <h1 class="text-2xl font-semibold text-black">
        {{ product.title }}
      </h1>

      <p class="mt-6 text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded">
        7-day free then:
      </p>

      <p class="mt-4 flex items-baseline gap-x-2">
          <span class="text-5xl font-semibold text-black">
            ${{ product.price }}
          </span>
        <span class="text-gray-500">/month</span>
      </p>

      <p class="mt-2 text-gray-500">
        Billed yearly at
        <span class="text-gray-500 line-through">${{ product.yearly }}</span>
        <span class="text-gray-500"> ${{ product.trueYearly }}</span>
      </p>

      <p class="mt-3.5 bg-green-200 text-emerald-700 font-bold inline-block px-3 py-1.5 rounded text-sm">
        {{ product.savings }} in savings
      </p>

      <NuxtLink v-if="showButton !== false" :to="`/confirmation/${product.id}`">
        <a class="mt-4 block bg-gray-200 text-center py-2 rounded hover:bg-gray-300">
            <span class="text-black">
              Get started
            </span>
        </a>
      </NuxtLink>

      <hr class="my-6" />

      <ul class="mt-8 space-y-3 text-sm">
        <li
          v-for="(feature, index) in product.features" :key="index" class="flex gap-x-3">
          <svg class="h-6 w-5 flex-none" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="green-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#86efac" /> <stop offset="100%" stop-color="#166534" /> </linearGradient>
            </defs>
            <path fill="url(#green-gradient)" d="M15.38 8.65L12 .986L8.62 8.65L.953 12.03l7.667 3.38L12 23.078l3.38-7.668l7.667-3.38z"/>
          </svg>

          <div>
            <span class="text-black">{{ feature.title }}</span>

            <span v-if="feature.note" class="block text-gray-500 text-xs mt-1">
                  {{ feature.note }}
                </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>
