import type { Subscription } from '~/../types/subscription'

let subscriptions: (Subscription & { id: number })[] = []
let currentId = 1

export default defineEventHandler(async (event) => {
  const body = await readBody<Subscription>(event)

  const newSubscription = {
    ...body,
    id: currentId++
  }

  subscriptions.push(newSubscription)

  return {
    success: true,
    data: newSubscription
  }
})
