<script setup lang="ts">
import { useSubscriptionStore } from '~/composables/stores/useSubscriptionStore'
import { storeToRefs } from 'pinia'
import OrderCard from "~/components/OrderCard.vue";
import ProductCard from "~/components/ProductCard.vue";

const subscriptionStore = useSubscriptionStore()
const { subscription } = storeToRefs(subscriptionStore)
const product = subscription.value
  ? await useProduct().fetchById(subscription.value.productId)
  : null
</script>

<template>
  <div class="flex">
    <div class="max-w-3xl mx-auto p-10">
      <h1 class="text-3xl font-bold mb-6">Checkout</h1>

      <div v-if="subscription">
        <p><b>ID:</b> {{ subscription.id }}</p>
        <p><b>Product ID:</b> {{ subscription.productId }}</p>
        <p><b>Name:</b> {{ subscription.fullName }}</p>
        <p><b>Address:</b> {{ subscription.address }}</p>

        <p class="text-green-600 mt-4">
          ✅ Payment successful
        </p>
      </div>

      <div v-else>
        <p class="text-red-500">No subscription data</p>
      </div>
    </div>

    <div v-if="product" class="max-w-3xl mx-auto p-10">
      <ProductCard :product="product" :showButton="false" class="w-full max-w-lg flex-1"/>
    </div>
  </div>
</template>

<style scoped>

</style>
