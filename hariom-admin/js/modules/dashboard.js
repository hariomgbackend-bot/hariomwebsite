/* Dashboard Module — real-time stats */

var dashboardUnsubscribers = []

function stopDashboardListeners() {
  dashboardUnsubscribers.forEach(function (unsub) {
    try { if (unsub) unsub() } catch (e) { /* ignore */ }
  })
  dashboardUnsubscribers = []
}

function formatOrderTime(value) {
  if (!value) return 'Just now'
  if (value.seconds) return new Date(value.seconds * 1000).toLocaleString('en-IN')
  return String(value)
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(Number(value || 0))
}

function renderDashboard() {
  // Stop any listeners from a previous dashboard render
  stopDashboardListeners()

  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div><h1>Dashboard</h1><p>Live overview of your store</p></div>' +
    '</div>' +
    '<div class="stats-grid" id="stats-grid">' +
    '  <div class="stat-card stat-card--blue"><div class="stat-icon">&#9783;</div><div class="stat-label">Total Products</div><div class="stat-value" id="stat-products">—</div></div>' +
    '  <div class="stat-card stat-card--green"><div class="stat-icon">&#9679;</div><div class="stat-label">Visible on Site</div><div class="stat-value" id="stat-visible">—</div></div>' +
    '  <div class="stat-card stat-card--orange"><div class="stat-icon">&#9733;</div><div class="stat-label">Active Offers</div><div class="stat-value" id="stat-offers">—</div></div>' +
    '  <div class="stat-card stat-card--crimson"><div class="stat-icon">&#9993;</div><div class="stat-label">Unread Enquiries</div><div class="stat-value" id="stat-enquiries">—</div></div>' +
    '  <div class="stat-card stat-card--purple"><div class="stat-icon">&#9745;</div><div class="stat-label">Open Orders</div><div class="stat-value" id="stat-orders">—</div></div>' +
    '</div>' +
    '<div class="dashboard-grid-2">' +
    '  <div class="panel">' +
    '    <div class="panel-header"><h3>Recent Orders</h3></div>' +
    '    <div id="recent-orders" class="recent-list"><p class="text-muted text-sm">Loading...</p></div>' +
    '  </div>' +
    '  <div class="panel">' +
    '    <div class="panel-header"><h3>Recent Enquiries</h3></div>' +
    '    <div id="recent-enquiries" class="recent-list"><p class="text-muted text-sm">Loading...</p></div>' +
    '  </div>' +
    '</div>'

  // ── Products (one-shot is fine — catalog doesn't change second-to-second)
  db.collection('products').get().then(function (snap) {
    var total = snap.size
    var visible = 0
    snap.forEach(function (d) { if (d.data().is_visible !== false) visible++ })
    document.getElementById('stat-products').textContent = total
    document.getElementById('stat-visible').textContent = visible
  }).catch(function () {
    document.getElementById('stat-products').textContent = '?'
    document.getElementById('stat-visible').textContent = '?'
  })

  // ── Active offers (one-shot)
  db.collection('promotions').where('isActive', '==', true).get().then(function (snap) {
    document.getElementById('stat-offers').textContent = snap.size
  }).catch(function () {
    document.getElementById('stat-offers').textContent = '?'
  })

  // ── Enquiries — LIVE
  var enquiriesFirst = true
  var lastUnread = 0
  var unsubEnquiries = db.collection('enquiries')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(function (snap) {
      var unread = 0
      snap.forEach(function (d) { if (d.data().read !== true) unread++ })
      document.getElementById('stat-enquiries').textContent = unread

      // Play alert only on genuine new arrivals (not initial load)
      if (!enquiriesFirst && unread > lastUnread) playEnquiryAlert()
      enquiriesFirst = false
      lastUnread = unread

      // Render recent enquiries (top 5)
      var html = ''
      var count = 0
      snap.forEach(function (d) {
        if (count >= 5) return
        var data = d.data()
        var name = escapeHtml(data.name || 'Anonymous')
        var msg = escapeHtml((data.message || '').slice(0, 80))
        var time = formatOrderTime(data.createdAt)
        html += '<div class="recent-item">' +
          '  <div class="recent-name">' + name + (data.read !== true ? ' <span class="unread-dot"></span>' : '') + '</div>' +
          '  <div class="recent-sub">' + msg + (data.message && data.message.length > 80 ? '…' : '') + '</div>' +
          '  <div class="recent-time">' + time + '</div>' +
          '</div>'
        count++
      })
      var el = document.getElementById('recent-enquiries')
      if (el) el.innerHTML = html || '<p class="text-muted text-sm">No enquiries yet.</p>'
    }, function (err) {
      document.getElementById('stat-enquiries').textContent = '?'
      var el = document.getElementById('recent-enquiries')
      if (el) el.innerHTML = '<p class="text-sm" style="color:var(--danger)">Error: ' + escapeHtml(err.message) + '</p>'
    })
  dashboardUnsubscribers.push(unsubEnquiries)

  // ── Orders — LIVE
  var unsubOrders = db.collection('orders')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(function (snap) {
      var open = 0
      snap.forEach(function (d) {
        var s = d.data().status || 'new'
        if (s !== 'delivered' && s !== 'cancelled') open++
      })
      document.getElementById('stat-orders').textContent = open

      // Render recent orders (top 5)
      var html = ''
      var count = 0
      snap.forEach(function (d) {
        if (count >= 5) return
        var data = d.data()
        var customer = data.customer || {}
        var name = escapeHtml(customer.name || 'Guest')
        var amt = formatMoney(data.total || data.subtotal)
        var status = escapeHtml(data.status || 'new')
        var time = formatOrderTime(data.createdAt)
        html += '<div class="recent-item">' +
          '  <div class="recent-name">#' + escapeHtml(d.id.slice(0, 8)) + ' · ' + name + '</div>' +
          '  <div class="recent-sub">' + amt + ' · ' + status + '</div>' +
          '  <div class="recent-time">' + time + '</div>' +
          '</div>'
        count++
      })
      var el = document.getElementById('recent-orders')
      if (el) el.innerHTML = html || '<p class="text-muted text-sm">No orders yet.</p>'
    }, function (err) {
      document.getElementById('stat-orders').textContent = '?'
      var el = document.getElementById('recent-orders')
      if (el) el.innerHTML = '<p class="text-sm" style="color:var(--danger)">Error: ' + escapeHtml(err.message) + '</p>'
    })
  dashboardUnsubscribers.push(unsubOrders)
}
