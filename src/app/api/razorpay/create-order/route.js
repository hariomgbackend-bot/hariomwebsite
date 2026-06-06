export async function POST(request) {
  try {
    var body = await request.json()
    var amount = Math.round(Number(body.amount || 0) * 100)

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return Response.json({ error: 'Razorpay keys are not configured on the server.' }, { status: 500 })
    }
    if (!amount || amount < 100) {
      return Response.json({ error: 'Invalid payment amount.' }, { status: 400 })
    }

    var auth = Buffer.from(process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET).toString('base64')
    var response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'INR',
        receipt: body.receipt || ('hariom_' + Date.now()),
        notes: body.notes || {}
      })
    })
    var data = await response.json()
    if (!response.ok) {
      return Response.json({ error: data.error ? data.error.description : 'Razorpay order failed.' }, { status: response.status })
    }
    return Response.json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (err) {
    return Response.json({ error: err.message || 'Unable to create Razorpay order.' }, { status: 500 })
  }
}
