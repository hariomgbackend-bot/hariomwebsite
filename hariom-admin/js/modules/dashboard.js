/* Dashboard Module */

function renderDashboard() {
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
    '<div class="dashboard-hint"><p>Select a module from the sidebar to manage your store.</p></div>'

  db.collection('products').get().then(function (snap) {
    document.getElementById('stat-products').textContent = snap.size
    var visible = 0
    snap.forEach(function (d) { if (d.data().is_visible !== false) visible++ })
    document.getElementById('stat-visible').textContent = visible
  }).catch(function () { document.getElementById('stat-products').textContent = '?' })

  db.collection('promotions').where('isActive', '==', true).get().then(function (snap) {
    document.getElementById('stat-offers').textContent = snap.size
  }).catch(function () { document.getElementById('stat-offers').textContent = '?' })

  // FIX: count unread enquiries correctly (field may not exist, so get all and filter)
  db.collection('enquiries').get().then(function (snap) {
    var unread = 0
    snap.forEach(function (d) { if (d.data().read !== true) unread++ })
    document.getElementById('stat-enquiries').textContent = unread
  }).catch(function () { document.getElementById('stat-enquiries').textContent = '?' })

  // FIX: count open orders by status, not by 'read' field
  db.collection('orders').get().then(function (snap) {
    var open = 0
    snap.forEach(function (d) {
      var s = d.data().status || 'new'
      if (s !== 'delivered' && s !== 'cancelled') open++
    })
    document.getElementById('stat-orders').textContent = open
  }).catch(function () { document.getElementById('stat-orders').textContent = '?' })
}
