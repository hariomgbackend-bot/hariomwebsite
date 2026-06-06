/* ═══════════════════════════════════════════
   Dashboard Module — Overview Stats
   ═══════════════════════════════════════════ */

function renderDashboard() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Dashboard</h1>' +
    '    <p>Overview of your store operations</p>' +
    '  </div>' +
    '</div>' +
    '<div class="stats-grid" id="stats-grid">' +
    '  <div class="stat-card"><div class="stat-label">Total Products</div><div class="stat-value" id="stat-products">—</div></div>' +
    '  <div class="stat-card"><div class="stat-label">Active Offers</div><div class="stat-value" id="stat-offers">—</div></div>' +
    '  <div class="stat-card"><div class="stat-label">New Enquiries</div><div class="stat-value" id="stat-enquiries">—</div></div>' +
    '  <div class="stat-card"><div class="stat-label">New Orders</div><div class="stat-value" id="stat-orders">—</div></div>' +
    '  <div class="stat-card"><div class="stat-label">Visible Products</div><div class="stat-value" id="stat-visible">—</div></div>' +
    '</div>' +
    '<div class="card" style="background:#fff;border-radius:12px;border:1px solid var(--outline-variant);padding:20px;margin-top:8px">' +
    '  <p class="text-muted text-sm">Select a module from the sidebar to manage your data.</p>' +
    '</div>'

  // Fetch counts
  db.collection('products').get().then(function (snap) {
    document.getElementById('stat-products').textContent = snap.size
    var visible = 0
    snap.forEach(function (d) { if (d.data().is_visible !== false) visible++ })
    document.getElementById('stat-visible').textContent = visible
  }).catch(function () {
    document.getElementById('stat-products').textContent = '?'
  })

  db.collection('promotions').where('isActive', '==', true).get().then(function (snap) {
    document.getElementById('stat-offers').textContent = snap.size
  }).catch(function () {
    document.getElementById('stat-offers').textContent = '?'
  })

  db.collection('enquiries').where('read', '==', false).get().then(function (snap) {
    document.getElementById('stat-enquiries').textContent = snap.size
  }).catch(function () {
    document.getElementById('stat-enquiries').textContent = '?'
  })

  db.collection('orders').where('read', '==', false).get().then(function (snap) {
    document.getElementById('stat-orders').textContent = snap.size
  }).catch(function () {
    document.getElementById('stat-orders').textContent = '?'
  })
}
