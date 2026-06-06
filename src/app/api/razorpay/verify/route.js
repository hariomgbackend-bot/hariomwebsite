import crypto from 'crypto'

export async function POST(request) {
  try {
    var body = await request.json()
    var orderId = body.razorpay_order_id
    var paymentId = body.razorpay_payment_id
    var signature = body.razorpay_signature

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return Response.json({ error: 'Razorpay secret is not configured.' }, { status: 500 })
    }
    if (!orderId || !paymentId || !signature) {
      return Response.json({ error: 'Missing Razorpay verification fields.' }, { status: 400 })
    }

    var expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex')

    return Response.json({ verified: expected === signature })
  } catch (err) {
    return Response.json({ error: err.message || 'Unable to verify payment.' }, { status: 500 })
  }
}
