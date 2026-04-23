<script setup lang="ts">
import type { Subscription } from '~/../types/subscription'
import type { Product } from '~/../types/product'
import { useSubscriptionStore } from '~/composables/stores/useSubscriptionStore'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const subscriptionStore = useSubscriptionStore()

const props = defineProps<{
  product: Product
}>()

const form = reactive<Subscription>({
  productId: props.product.id,
  fullName: '',
  address: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  agreeToTerms: false
})

const errors = reactive({
  fullName: '',
  address: '',
  cardNumber: '',
  expiry: '',
  cvc: ''
})

const validate = () => {
  let isValid = true

  errors.fullName = ''
  errors.address = ''
  errors.cardNumber = ''
  errors.expiry = ''
  errors.cvc = ''

  if (!form.fullName || form.fullName.length < 3) {
    errors.fullName = 'Мінімум 3 символи'
    isValid = false
  }

  if (!form.address || form.address.length < 5) {
    errors.address = 'Введіть адресу'
    isValid = false
  }

  if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, ''))) {
    errors.cardNumber = 'Невірний номер карти (16 цифр)'
    isValid = false
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
    errors.expiry = 'Формат MM/YY'
    isValid = false
  }

  if (!/^\d{3}$/.test(form.cvc)) {
    errors.cvc = 'CVC має бути 3 цифри'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validate()) return

  if (!form.agreeToTerms) {
    alert('Потрібно погодитись з умовами')
    return
  }

  try {
    const result = await subscriptionStore.createSubscription(form)

    if (result) {
      router.push('/checkout')
    }
  } catch (e) {
    alert('Помилка при створенні підписки: ' + (e as any)?.message)
  }
}
</script>

<template>
  <form @submit.prevent="submitForm" class="max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6">

    <h2 class="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

    <div class="space-y-3 mb-6">
      <div class="flex justify-between">
      <span class="text-gray-600">
        {{ product.isAnnual ? 'Annual Plan' : 'Monthly Plan' }}
      </span>
        <span class="font-medium text-gray-600">${{ product.trueYearly }}</span>
      </div>

      <div class="flex justify-between border-t pt-3">
        <span class="text-gray-600">Total Due</span>
        <span class="font-medium text-gray-600">${{ product.trueYearly }}</span>
      </div>

      <div class="flex justify-between font-bold text-lg">
        <span class="text-gray-600">Due Today</span>
        <span class="text-gray-600">$0.00</span>
      </div>
    </div>

    <div class="bg-gray-100 text-center py-3 rounded-md mb-6 font-medium text-gray-700">
      Includes 3-Day Free Trial
    </div>

    <h3 class="text-lg font-semibold text-gray-800 mb-4">Billing Information ⓘ</h3>

    <div class="space-y-4">

      <!-- Card -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">Card Details</label>
        <div class="flex border border-gray-300 rounded-md p-3 text-gray-400 bg-gray-50">
          <input v-model="form.cardNumber" type="text" placeholder="Number" class="bg-transparent w-full outline-none" />
          <input v-model="form.expiry" type="text" placeholder="MM / YY" class="bg-transparent w-20 outline-none border-l pl-2" />
          <input v-model="form.cvc" type="text" placeholder="CVC" class="bg-transparent w-16 outline-none border-l pl-2" />
        </div>

        <div class="mt-1 space-y-1">
          <p v-if="errors.cardNumber" class="text-red-500 text-[10px] leading-tight">
            {{ errors.cardNumber }}
          </p>
          <p v-if="errors.expiry" class="text-red-500 text-[10px] leading-tight">
            {{ errors.expiry }}
          </p>
          <p v-if="errors.cvc" class="text-red-500 text-[10px] leading-tight">
            {{ errors.cvc }}
          </p>
        </div>
      </div>

      <label class="block text-sm text-gray-600 mb-1">Adress</label>
      <div class="border border-gray-300 rounded-md p-3 text-gray-400 bg-gray-50">
        <!-- Name -->
        <div class="mb-3">
          <label class="block text-sm text-gray-600 mb-1">Full name</label>
          <input v-model="form.fullName" type="text"
                 class="w-full border text-gray-600 bg-white border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-blue-500" />
          <p v-if="errors.fullName" class="text-red-500 text-xs mt-1">
            {{ errors.fullName }}
          </p>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">Address</label>
          <input v-model="form.address" type="text"
                    class="w-full border text-gray-600 bg-white border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-blue-500"/>
          <p v-if="errors.address" class="text-red-500 text-xs mt-1">
            {{ errors.address }}
          </p>
        </div>
      </div>

      <!-- Checkbox -->
      <div class="flex items-start gap-2 text-xs text-gray-500">
        <input v-model="form.agreeToTerms" type="checkbox" class="mt-1" />
        <p>
          I consent to Terms of Use...
        </p>
      </div>

      <!-- Submit -->
      <button type="submit"
              class="w-35 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 rounded-md transition">
        Try It Free
      </button>

    </div>
  </form>
</template>

<style scoped>

</style>
