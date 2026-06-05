/* ═══════════════════════════════════════════
   Published Monitor Module
   Shows what is currently live on the website
   ═══════════════════════════════════════════ */

var publishedUnsubs = []

function renderPublished() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Published Content</h1>' +
    '    <p>Monitor what is currently live on the public website</p>' +
    '  </div>' +
    '  <button class="btn btn-outline btn-sm" onclick="refreshPublished()">&#8635; Refresh</button>' +
    '</div>' +
    '<div class="stats-grid" id="pub-stats">' +
    '  <div class="stat-card"><div class="stat-label">Visible Products</div><div class="stat-value" id="pub-products-count">—</div></div>' +
    '  <div class="stat-card"><div class="stat-label">Featured Products</div><div class="stat-value" id="pub-featured-count">—</div></div>' +
    '  <div class="stat-card"><div class="stat-label">Active Promotions</div><div class="stat-value" id="pub-offers-count">—</div></div>' +
    '  <div class="stat-card"><div class="stat-label">Published Categories</div><div class="stat-value" id="pub-categories-count">—</div></div>' +
    '  <div class="stat-card"><div class="stat-label">Unread Enquiries</div><div class="stat-value" id="pub-enquiries-count">—</div></div>' +
    '</div>' +
    '<div id="pub-sections"></div>'

  loadPublishedData()
}

function refreshPublished() {
  publishedUnsubs.forEach(function (u) { if (u) u() })
  publishedUnsubs = []
  loadPublishedData()
}

function loadPublishedData() {
  // Visible Products (get ALL, filter client-side to match stock.js behavior)
  var prodUnsub = db.collection('products')
    .onSnapshot(function (snap) {
      var rows = []
      var visibleCount = 0
      var featuredCount = 0
      snap.forEach(function (doc) {
        var d = doc.data()
        d._id = doc.id
        rows.push(d)
        if (d.is_visible !== false) visibleCount++
        if (d.featured === true) featuredCount++
      })
      document.getElementById('pub-products-count').textContent = visibleCount
      document.getElementById('pub-featured-count').textContent = featuredCount

      var visible = rows.filter(function (r) { return r.is_visible !== false })
      showPublishedSection('products', visible, rows.length)
    }, function () {
      document.getElementById('pub-products-count').textContent = '?'
    })
  publishedUnsubs.push(prodUnsub)

  // Active Promotions (get ALL, filter client-side)
  var offerUnsub = db.collection('promotions')
    .onSnapshot(function (snap) {
      var rows = []
      snap.forEach(function (doc) {
        var d = doc.data()
        d._id = doc.id
        rows.push(d)
      })
      var active = rows.filter(function (r) { return r.isActive === true })
      document.getElementById('pub-offers-count').textContent = active.length

      if (active.length === 0) {
        showPublishedSection('offers', [], rows.length)
        showStaticOffersFallback()
      } else {
        showPublishedSection('offers', active, rows.length)
        removeStaticOffersFallback()
      }
    }, function () {
      document.getElementById('pub-offers-count').textContent = '?'
    })
  publishedUnsubs.push(offerUnsub)

  // Categories count
  var catUnsub = db.collection('categories')
    .onSnapshot(function (snap) {
      document.getElementById('pub-categories-count').textContent = snap.size
    }, function () {
      document.getElementById('pub-categories-count').textContent = '?'
    })
  publishedUnsubs.push(catUnsub)

  // Unread Enquiries (get ALL, filter client-side)
  var enqUnsub = db.collection('enquiries')
    .onSnapshot(function (snap) {
      var unread = 0
      snap.forEach(function (doc) {
        if (doc.data().read !== true) unread++
      })
      document.getElementById('pub-enquiries-count').textContent = unread
    }, function () {
      document.getElementById('pub-enquiries-count').textContent = '?'
    })
  publishedUnsubs.push(enqUnsub)
}

function showPublishedSection(type, rows, total) {
  var container = document.getElementById('pub-sections')
  if (!container) return

  var existing = container.querySelector('[data-section="' + type + '"]')
  if (existing) existing.remove()

  var colDefs, title

  if (type === 'products') {
    title = 'Visible Products (' + rows.length + (total > rows.length ? '/' + total + ' total' : '') + ')'
    colDefs = [
      { label: 'Name', key: 'name' },
      { label: 'Brand', key: 'brand', render: function (v) { return v || '—' } },
      { label: 'Category', key: 'category', render: function (v) { return v || '—' } },
      { label: 'Price', key: 'price', render: function (v) { return v || '—' } },
      { label: 'Featured', key: 'featured', render: function (v) { return v === true ? '✓' : '—' } },
      { label: 'Images', key: 'images', render: function (v) { return v && v.length > 0 ? v.length + ' image(s)' : 'none' } },
    ]
  } else if (type === 'offers') {
    title = 'Active Promotions (' + rows.length + (total > rows.length ? '/' + total + ' total' : '') + ')'
    colDefs = [
      { label: 'Title', key: 'title' },
      { label: 'Badge', key: 'badge', render: function (v) { return v || '—' } },
      { label: 'Valid Till', key: 'validTill', render: function (v) { return v || '—' } },
    ]
  }

  if (!colDefs) return

  var html =
    '<div class="card" data-section="' + type + '" style="background:#fff;border-radius:12px;border:1px solid var(--outline-variant);padding:20px;margin-top:12px;">' +
    '  <h3 style="font-size:14px;font-weight:700;color:var(--on-surface);margin:0 0 12px 0;">' + title + '</h3>'

  if (rows.length === 0) {
    html += '<p class="text-muted" style="font-size:13px;">No published items in Firestore. The website may be showing static fallback data — add items via the relevant module or check your Firestore data.</p>'
  } else {
    html += '<div style="overflow-x:auto;"><table class="data-table" style="width:100%;font-size:13px;">'
    html += '<thead><tr>'
    colDefs.forEach(function (col) {
      html += '<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--outline-variant);font-weight:600;">' + escapeHtml(col.label) + '</th>'
    })
    html += '</tr></thead><tbody>'

    rows.forEach(function (row) {
      html += '<tr>'
      colDefs.forEach(function (col) {
        var val = row[col.key]
        if (col.render) val = col.render(val, row)
        else val = val !== undefined && val !== null ? String(val) : ''
        html += '<td style="padding:8px 12px;border-bottom:1px solid var(--outline-variant);">' + val + '</td>'
      })
      html += '</tr>'
    })

    html += '</tbody></table></div>'
  }

  html += '</div>'
  container.insertAdjacentHTML('beforeend', html)
}

var STATIC_OFFERS_FALLBACK = [
  { title: 'Summer Sale - Up to 30% Off', badge: 'SALE', validTill: '30 Jun 2026' },
  { title: 'Exchange Bonus ₹5,000', badge: 'EXCHANGE', validTill: 'Ongoing' },
  { title: 'No Cost EMI on All Products', badge: 'EMI', validTill: 'Ongoing' },
  { title: 'Combo Offer - Save More', badge: 'COMBO', validTill: 'Limited Period' },
]

function showStaticOffersFallback() {
  var existing = document.querySelector('[data-section="offers-fallback"]')
  if (existing) return
  var container = document.getElementById('pub-sections')
  if (!container) return
  var html =
    '<div class="card" data-section="offers-fallback" style="background:#fff;border-radius:12px;border:1px solid var(--outline-variant);padding:20px;margin-top:12px;">' +
    '  <h3 style="font-size:14px;font-weight:700;color:var(--on-surface);margin:0 0 12px 0;">Static Fallback Offers (no active promotions in Firestore)</h3>' +
    '  <div style="overflow-x:auto;"><table class="data-table" style="width:100%;font-size:13px;">' +
    '    <thead><tr><th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--outline-variant);font-weight:600;">Title</th>' +
    '    <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--outline-variant);font-weight:600;">Badge</th>' +
    '    <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--outline-variant);font-weight:600;">Valid Till</th></tr></thead><tbody>'
  STATIC_OFFERS_FALLBACK.forEach(function (o) {
    html += '<tr><td style="padding:8px 12px;border-bottom:1px solid var(--outline-variant);">' + escapeHtml(o.title) + '</td>' +
      '<td style="padding:8px 12px;border-bottom:1px solid var(--outline-variant);">' + (o.badge ? escapeHtml(o.badge) : '—') + '</td>' +
      '<td style="padding:8px 12px;border-bottom:1px solid var(--outline-variant);">' + (o.validTill || '—') + '</td></tr>'
  })
  html += '</tbody></table></div></div>'
  container.insertAdjacentHTML('beforeend', html)
}

function removeStaticOffersFallback() {
  var el = document.querySelector('[data-section="offers-fallback"]')
  if (el) el.remove()
}
