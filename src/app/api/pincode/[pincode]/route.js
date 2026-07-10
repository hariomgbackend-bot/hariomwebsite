export async function GET(request, context) {
  var params = await context.params
  var pincode = params.pincode
  if (!/^\d{6}$/.test(pincode || '')) {
    return Response.json({ error: 'Enter a valid 6 digit pincode.' }, { status: 400 })
  }

  try {
    var res = await fetch('https://api.postalpincode.in/pincode/' + pincode, {
      next: { revalidate: 86400 }
    })
    var data = await res.json()
    var first = Array.isArray(data) ? data[0] : null
    var offices = first && Array.isArray(first.PostOffice) ? first.PostOffice : []
    if (!first || first.Status !== 'Success' || offices.length === 0) {
      return Response.json({ error: 'Pincode not found.' }, { status: 404 })
    }
    return Response.json({
      pincode: pincode,
      city: offices[0].District || '',
      state: offices[0].State || '',
      locality: offices[0].Name || '',
      postOffices: offices.map(function (office) {
        return {
          name: office.Name,
          district: office.District,
          state: office.State
        }
      })
    })
  } catch (err) {
    return Response.json({ error: 'Pincode lookup is unavailable right now.' }, { status: 502 })
  }
}
