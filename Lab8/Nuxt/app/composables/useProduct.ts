import type { Product } from '~/../types/product'

export const useProduct = () => {
  const fetchAll = () => useFetch<Product[]>('/api/products')

  const fetchById = async (id: number) => {
    const { data } = await useFetch<Product[]>('/api/products')

    return data.value?.find(p => p.id === id) || null
  }

  return {
    fetchAll,
    fetchById
  }
}
