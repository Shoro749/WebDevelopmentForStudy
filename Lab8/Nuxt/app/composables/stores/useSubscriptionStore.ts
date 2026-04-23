import { defineStore } from 'pinia'
import type { Subscription } from '~/../types/subscription'

export const useSubscriptionStore = defineStore('subscription', () => {
  // state
  const subscription = ref<Subscription | null>(null)
  const isLoading = ref(false)

  // action
  async function createSubscription(data: Subscription) {
    isLoading.value = true
    try {
      const response = await $fetch('/api/subscription/create', {
        method: 'POST',
        body: data
      })

      subscription.value = response.data

      return response.data
    } finally {
      isLoading.value = false
    }
  }

  return {
    subscription,
    isLoading,
    createSubscription,
  }
})
