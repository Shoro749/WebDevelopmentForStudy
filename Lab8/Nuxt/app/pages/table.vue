<script setup>
const { data } = await useFetch('https://dummyjson.com/products')

const products = computed(() => data.value?.products || [])

const search = ref('')

// пагінація
const page = ref(1)
const perPage = 5

// сортування
const sortKey = ref('')
const sortOrder = ref('asc')

// фільтрація із сортуванням
const filteredProducts = computed(() => {
  let result = [...products.value]

  // пошук
  if (search.value) {
    result = result.filter(p =>
      p.title.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  // сортування
  if (sortKey.value) {
    result.sort((a, b) => {
      const valA = a[sortKey.value]
      const valB = b[sortKey.value]

      if (sortOrder.value === 'asc') return valA > valB ? 1 : -1
      else return valA < valB ? 1 : -1
    })
  }

  return result
})

// сторінки
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / perPage)
)

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})

// сортування при натискані
function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

useHead({
  title: 'Таблиця продуктів'
})
</script>

<template>
  <div class="sticky top-0 flex items-center justify-between p-4 bg-white border-b z-20">
    <div class="flex items-center space-x-2">
      <div class="flex items-center mb-4">
        <input id="default-checkbox" type="checkbox" value="" class="w-5 h-5 rounded-md accent-blue-600 cursor-pointer border-gray-300">
        <label for="default-checkbox" class="hidden"></label>
      </div>
      <div class="inline-flex rounded-md shadow-sm">
        <button class="px-4 py-2 text-sm font-medium bg-gray-100 rounded-l-lg border">
                <span class="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 35 35">
                    <path fill="currentColor" d="M21 16V6H7v10zm0-12c.53 0 1.04.21 1.41.59c.38.37.59.88.59 1.41v10c0 .53-.21 1.04-.59 1.41c-.37.38-.88.59-1.41.59H7a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2zM3 20h15v2H3c-.53 0-1.04-.21-1.41-.59C1.21 21.04 1 20.53 1 20V9h2z"/>
                </svg>
                Card
                </span>
        </button>
        <button class="px-4 py-2 text-sm font-medium bg-white rounded-r-lg border-y border-r border-gray-200 text-blue-600">
                <span class="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 35 35">
                        <path fill="currentColor" d="M9 19v-2h12v2zm0-6v-2h12v2zm0-6V5h12v2zM5 20q-.825 0-1.412-.587T3 18t.588-1.412T5 16t1.413.588T7 18t-.587 1.413T5 20m0-6q-.825 0-1.412-.587T3 12t.588-1.412T5 10t1.413.588T7 12t-.587 1.413T5 14m0-6q-.825 0-1.412-.587T3 6t.588-1.412T5 4t1.413.588T7 6t-.587 1.413T5 8"/>
                    </svg>
                    List
                </span>
        </button>
      </div>
    </div>
    <div>
      <input v-model="search" placeholder="Search..." class="border p-2 rounded text-black"/>
    </div>
    <div class="flex space-x-4 text-sm text-gray-500">
        <span class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 35 35">
                <path fill="currentColor" d="M2 16V4q0-.825.588-1.412T4 2h14v2H4v12zm9 6v-2H8q-.825 0-1.412-.587T6 18V8q0-.825.588-1.412T8 6h13q.825 0 1.413.588T23 8v10q0 .825-.587 1.413T21 20h-3v2zm-3-4h13V8H8zm6.5-5"/>
            </svg>
            Display
        </span>
      <span class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 35 35">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M.75 4.293h22.5M3.146 9.431h17.708M8.72 19.707h6.56m-9.737-5.138h12.914"/>
            </svg>
            Sort by
        </span>
      <span class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 35 35">
                <path fill="currentColor" d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2"/>
            </svg>
            Actions
        </span>
    </div>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <thead class="sticky top-0 bg-[#333] text-white text-sm">
      <tr>
        <th @click="sortBy('title')" class="cursor-pointer p-4 text-right font-medium">Title</th>
        <th class="p-4 text-center font-medium">Description</th>
        <th @click="sortBy('price')" class="cursor-pointer p-4 text-right font-medium">Price</th>
        <th @click="sortBy('rating')" class="cursor-pointer p-4 text-right font-medium">Rating</th>
        <th class="p-4 text-center font-medium">Brand</th>
        <th class="p-4 text-center font-medium">Category</th>
        <th class="p-4 text-center font-medium">Photo</th>
      </tr>
      </thead>

      <tbody v-for="product in paginatedProducts" :key="product.id" class="divide-y divide-gray-100 bg-white">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="p-4 text-right text-sm text-gray-600">{{product.title}}</td>
        <td class="p-4 text-right text-sm text-gray-600">{{product.description}}</td>
        <td class="p-4 text-right text-sm text-gray-600">{{product.price}}</td>
        <td class="p-4 text-right text-sm" :class="product.rating < 4.5 ? 'text-red-500' : 'text-green-500'">
          {{product.rating}}
        </td>
        <td class="p-4 text-right text-sm text-gray-600">{{product.brand}}</td>
        <td class="p-4 text-right text-sm text-gray-600">{{product.category}}</td>
        <td class="p-4 text-center">
          <img :src="product.thumbnail" class="w-100px h-100px object-cover" />
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <div class="flex gap-2 mt-4">
    <button @click="page--" :disabled="page === 1" class="cursor-pointer px-3 py-1 border">Prev</button>
    <span>Page {{ page }} / {{ totalPages }}</span>
    <button @click="page++" :disabled="page === totalPages" class="cursor-pointer px-3 py-1 border">Next</button>
  </div>
</template>
