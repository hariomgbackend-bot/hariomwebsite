import stores from '@/data/stores'

const ELECTRONICS_STORE_IDS = stores
  .filter(function (s) { return s.placeId })
  .map(function (s) { return s.id })

var cache = null
var inflight = null

export async function getGoogleReviews(force) {
  if (cache && !force) return cache
  if (inflight && !force) return inflight
  inflight = fetch('/api/google-reviews' + (force ? '?force=1' : ''))
    .then(function (res) {
      if (!res.ok) throw new Error('Unable to load reviews')
      return res.json()
    })
    .then(function (data) {
      var list = (data && data.stores) || []
      cache = list.filter(function (s) { return ELECTRONICS_STORE_IDS.indexOf(s.storeId) !== -1 })
      return cache
    })
    .catch(function (err) {
      cache = null
      throw err
    })
    .finally(function () {
      inflight = null
    })
  return inflight
}
