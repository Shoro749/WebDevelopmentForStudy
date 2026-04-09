export interface Feature {
  title: string
  note?: string
}

export interface Product {
  id: number
  title: string
  price: number
  isAnnual: boolean
  yearly: number
  trueYearly: number
  savings: number

  features: Feature[]
}
