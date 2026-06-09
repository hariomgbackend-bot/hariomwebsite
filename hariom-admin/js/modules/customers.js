var customersUnsubscribe = null

function renderCustomers() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Customers</h1>' +
    '    <p>Registered customer profiles</p>' +
    '  </div>' +
    '  <button class="btn btn-outline" onclick="syncAuthUsers()" id="sync-auth-btn">Sync from Auth</button>' +
    '</div>' +
    '<div id="customers-list" class="enquiry-list">' +
    '  <div class="empty-state"><p>Loading customers...</p></div>' +
    '</div>'

  listenCustomers()
}

function listenCustomers() {
  if (customersUnsubscribe) customersUnsubscribe()

  customersUnsubscribe = db.collection('customer_profiles')
    .onSnapshot(function (snapshot) {
      if (snapshot.empty) {
        document.getElementById('customers-list').innerHTML = '<div class="empty-state"><p>No customers yet.</p></div>'
        return
      }

      var docs = []
      snapshot.forEach(function (doc) { docs.push({ id: doc.id, data: doc.data() }) })
      docs.sort(function (a, b) {
        var ta = a.data.updatedAt ? a.data.updatedAt.seconds || 0 : 0
        var tb = b.data.updatedAt ? b.data.updatedAt.seconds || 0 : 0
        return tb - ta
      })

      var html = ''
      docs.forEach(function (doc) {
        var d = doc.data
        html +=
          '<div class="enquiry-card">' +
          '  <div class="enquiry-header">' +
          '    <div>' +
          '      <div class="enquiry-name">' + escapeHtml(d.name || 'Unnamed') + '</div>' +
          '      <div class="enquiry-contact">' +
          (d.email ? '<a href="mailto:' + escapeHtml(d.email) + '">' + escapeHtml(d.email) + '</a>' : '') +
          (d.phone ? ' &middot; <a href="tel:' + escapeHtml(d.phone) + '">' + escapeHtml(d.phone) + '</a>' : '') +
          (d.alternatePhone ? ' &middot; <a href="tel:' + escapeHtml(d.alternatePhone) + '">Alt: ' + escapeHtml(d.alternatePhone) + '</a>' : '') +
          '      </div>' +
          '    </div>' +
          '    <span class="enquiry-time">' + (d.updatedAt ? new Date(d.updatedAt.seconds * 1000).toLocaleDateString() : '') + '</span>' +
          '  </div>' +
          '  <div class="enquiry-message">' +
          '    <div style="color:var(--on-surface-variant);font-size:13px;">' +
          escapeHtml([d.address, d.landmark, d.city, d.state, d.pincode].filter(Boolean).join(', ')) +
          '    </div>' +
          '  </div>' +
          '  <div class="enquiry-actions">' +
          (d.email ? '<button class="btn btn-sm btn-outline" onclick="replyCustomer(\'' + escapeHtml(d.email) + '\', \'' + escapeHtml(d.phone || '') + '\')">Contact</button>' : '') +
          '    <button class="btn btn-sm btn-danger" onclick="deleteCustomer(\'' + doc.id + '\')">Delete</button>' +
          '  </div>' +
          '</div>'
      })

      document.getElementById('customers-list').innerHTML = html
    }, function (error) {
      document.getElementById('customers-list').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error: ' + error.message + '</p></div>'
    })
}

function replyCustomer(email, phone) {
  if (email) window.location.href = 'mailto:' + email + '?subject=Hariom Electronics'
  else if (phone) window.location.href = 'tel:' + phone
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
