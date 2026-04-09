import type { Product } from '../../types/product'

export  const useProduct = () => {
  return useFetch<Product[]>('/api/products')
}
