var customersUnsubscribe = null

var CUSTOMER_COLUMNS = [
  { label: 'Name', key: 'name', render: function (v, row) {
    return '<strong>' + escapeHtml(v || 'Unnamed') + '</strong>'
  } },
  { label: 'Contact', key: 'email', render: function (v, row) {
    var html = v ? '<a href="mailto:' + escapeHtml(v) + '">' + escapeHtml(v) + '</a>' : ''
    if (row.phone) html += (html ? '<br>' : '') + '<a href="tel:' + escapeHtml(row.phone) + '">' + escapeHtml(row.phone) + '</a>'
    if (row.alternatePhone) html += '<br><span class="text-muted">Alt: ' + escapeHtml(row.alternatePhone) + '</span>'
    return html
  } },
  { label: 'City', key: 'city', render: function (v, row) {
    return escapeHtml([row.city, row.state, row.pincode].filter(Boolean).join(', '))
  } },
  { label: 'Address', key: 'address', render: function (v, row) {
    return escapeHtml([row.address, row.landmark].filter(Boolean).join(', ')) || '<span class="text-muted">—</span>'
  } },
  { label: 'Updated', key: 'updatedAt', render: function (v) {
    if (!v || !v.seconds) return '<span class="text-muted">—</span>'
    return new Date(v.seconds * 1000).toLocaleDateString('en-IN')
  } }
]

var CUSTOMER_EXPORT_COLUMNS = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'Alt Phone', key: 'alternatePhone' },
  { label: 'Address', key: 'address' },
  { label: 'Landmark', key: 'landmark' },
  { label: 'City', key: 'city' },
  { label: 'State', key: 'state' },
  { label: 'Pincode', key: 'pincode' },
  { label: 'Updated', key: 'updatedAt' }
]

function customerActions(row) {
  var html = ''
  if (row.email || row.phone) {
    html += '<button class="btn btn-sm btn-outline" onclick="replyCustomer(\'' + escapeHtml(row.email || '') + '\', \'' + escapeHtml(row.phone || '') + '\')">Contact</button>'
  }
  html += ' <button class="btn btn-sm btn-danger" onclick="deleteCustomer(\'' + row.id + '\')">Delete</button>'
  return html
}

function renderCustomers() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Customers</h1>' +
    '    <p>Registered customer profiles · search, paginate &amp; export</p>' +
    '  </div>' +
    '  <button class="btn btn-outline" onclick="syncAuthUsers()" id="sync-auth-btn">Sync from Auth</button>' +
    '</div>' +
    '<div id="customers-list">' +
    '  <div class="empty-state"><p>Loading customers...</p></div>' +
    '</div>'

  listenCustomers()
}

function listenCustomers() {
  if (customersUnsubscribe) customersUnsubscribe()

  customersUnsubscribe = db.collection('customer_profiles')
    .onSnapshot(function (snapshot) {
      var container = document.getElementById('customers-list')
      if (!container) return

      if (snapshot.empty) {
        container.innerHTML = '<div class="empty-state"><p>No customers yet.</p></div>'
        return
      }

      var rows = []
      snapshot.forEach(function (doc) {
        var d = doc.data()
        d.id = doc.id
        rows.push(d)
      })
      rows.sort(function (a, b) {
        var ta = a.updatedAt ? a.updatedAt.seconds || 0 : 0
        var tb = b.updatedAt ? b.updatedAt.seconds || 0 : 0
        return tb - ta
      })

      renderDataTable('customers-list', {
        columns: CUSTOMER_COLUMNS,
        rows: rows,
        actionsFn: customerActions,
        searchKeys: ['name', 'email', 'phone', 'alternatePhone', 'city', 'state', 'pincode'],
        exportFilename: 'customers',
        exportColumns: CUSTOMER_EXPORT_COLUMNS
      })
    }, function (error) {
      var container = document.getElementById('customers-list')
      if (container) {
        container.innerHTML = '<div class="empty-state"><p style="color:var(--danger)">Error: ' + escapeHtml(error.message) + '</p></div>'
      }
    })
}

function replyCustomer(email, phone) {
  if (email) window.location.href = 'mailto:' + email + '?subject=Hariom Electronics'
  else if (phone) window.location.href = 'tel:' + phone
  else showToast('No contact information available', 'warning')
}

function deleteCustomer(docId) {
  if (!confirm('Delete this customer profile permanently?')) return
  db.collection('customer_profiles').doc(docId).delete().then(function () {
    showToast('Customer deleted', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function syncAuthUsers() {
  var btn = document.getElementById('sync-auth-btn')
  btn.disabled = true
  btn.textContent = 'Syncing...'

  var apiUrl = localStorage.getItem('mainSiteUrl') || 'https://hariomwebsite.vercel.app'

  fetch(apiUrl + '/api/admin/sync-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }).then(function (res) {
    return res.json()
  }).then(function (data) {
    btn.disabled = false
    btn.textContent = 'Sync from Auth'
    if (data.ok) {
      showToast(data.message, 'success')
    } else {
      showToast(data.message || 'Sync failed', 'error')
    }
  }).catch(function (err) {
    btn.disabled = false
    btn.textContent = 'Sync from Auth'
    showToast('Error: ' + err.message, 'error')
  })
}
