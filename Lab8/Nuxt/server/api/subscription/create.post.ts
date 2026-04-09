export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // щось

  return {
    success: true,
    message: 'Subscription created',
    data: body
  }
})
