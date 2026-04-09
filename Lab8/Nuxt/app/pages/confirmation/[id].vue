<script setup lang="ts">
import ProductCard from "~/components/ProductCard.vue";
import OrderCard from "~/components/OrderCard.vue";

const { data: products, pending, error } = await useProduct()
const route = useRoute()
const id = Number(route.params.id)
const product = products.value?.find(p => p.id === id);

useHead({
  title: 'Subscription Confirmation',
})
</script>

<template>
  <div v-if="pending" class="text-center py-20 text-xl font-medium text-gray-500">
    Loading...
  </div>

  <div v-else-if="error" class="text-center py-20 text-red-500">
    Error: {{ error.message }}
  </div>

  <div class="max-w-7xl mx-auto px-4 py-10">
    <div v-if="product" class="flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
      <ProductCard :product="product" :showButton="false" class="w-full max-w-lg flex-1"/>
      <OrderCard :product="product" class="w-full max-w-lg flex-1"/>
    </div>
  </div>
</template>

<style scoped>

</style>
