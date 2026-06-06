var ordersUnsubscribe = null

function formatOrderTime(value) {
  if (!value) return 'Just now'
  if (value.seconds) return new Date(value.seconds * 1000).toLocaleString()
  return String(value)
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0))
}

function optionHtml(value, selected, label) {
  return '<option value="' + value + '"' + (value === selected ? ' selected' : '') + '>' + label + '</option>'
}

function renderOrders() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Orders</h1>' +
    '    <p>Website checkout orders, guest reservations, and payment status</p>' +
    '  </div>' +
    '</div>' +
    '<div id="orders-list" class="enquiry-list">' +
    '  <div class="empty-state"><p>Listening for orders...</p></div>' +
    '</div>'

  listenOrders()
}

function listenOrders() {
  if (ordersUnsubscribe) ordersUnsubscribe()

  ordersUnsubscribe = db.collection('orders')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(function (snapshot) {
      if (snapshot.empty) {
        document.getElementById('orders-list').innerHTML = '<div class="empty-state"><p>No orders yet.</p></div>'
        return
      }

      var html = ''
      snapshot.forEach(function (doc) {
        var d = doc.data()
        var customer = d.customer || {}
        var items = d.items || []
        var itemHtml = items.map(function (item) {
          return '<li>' + escapeHtml(item.name || '') + ' x ' + escapeHtml(String(item.quantity || 1)) + '</li>'
        }).join('')
        var status = d.status || 'new'
        var paymentStatus = d.paymentStatus || 'pending'

        html +=
          '<div class="enquiry-card' + (d.read !== true ? ' unread' : '') + '">' +
          '  <div class="enquiry-header">' +
          '    <div>' +
          '      <div class="enquiry-name">Order #' + escapeHtml(doc.id.slice(0, 8)) + ' - ' + escapeHtml(customer.name || 'Guest') + '</div>' +
          '      <div class="enquiry-contact">' +
          (customer.email ? '<a href="mailto:' + escapeHtml(customer.email) + '">' + escapeHtml(customer.email) + '</a>' : '') +
          (customer.phone ? ' &middot; <a href="tel:' + escapeHtml(customer.phone) + '">' + escapeHtml(customer.phone) + '</a>' : '') +
          '      </div>' +
          '    </div>' +
          '    <span class="enquiry-time">' + formatOrderTime(d.createdAt) + '</span>' +
          '  </div>' +
          '  <div class="enquiry-message">' +
          '    <strong>Total:</strong> ' + formatMoney(d.total || d.subtotal) + ' &middot; ' +
          '    <strong>Payment:</strong> ' + escapeHtml(d.paymentMethod || '-') + ' / ' + escapeHtml(paymentStatus) + ' &middot; ' +
          '    <strong>Status:</strong> ' + escapeHtml(status) +
          '    <ul style="margin:8px 0 0 18px;">' + itemHtml + '</ul>' +
          '    <div style="margin-top:8px;color:var(--on-surface-variant);font-size:12px;">' +
          escapeHtml([customer.address, customer.city, customer.pincode].filter(Boolean).join(', ')) +
          '    </div>' +
          '  </div>' +
          '  <div class="enquiry-actions" style="flex-wrap:wrap;">' +
          '    <select onchange="updateOrderStatus(\'' + doc.id + '\', this.value)" style="padding:7px 10px;border:1px solid var(--outline-variant);border-radius:8px;">' +
          optionHtml('new', status, 'New') +
          optionHtml('confirmed', status, 'Confirmed') +
          optionHtml('processing', status, 'Processing') +
          optionHtml('delivered', status, 'Delivered') +
          optionHtml('cancelled', status, 'Cancelled') +
          '    </select>' +
          '    <select onchange="updateOrderPayment(\'' + doc.id + '\', this.value)" style="padding:7px 10px;border:1px solid var(--outline-variant);border-radius:8px;">' +
          optionHtml('pending', paymentStatus, 'Pending') +
          optionHtml('initiated', paymentStatus, 'Initiated') +
          optionHtml('paid', paymentStatus, 'Paid') +
          optionHtml('failed', paymentStatus, 'Failed') +
          optionHtml('refunded', paymentStatus, 'Refunded') +
          '    </select>' +
          '    <input value="' + escapeHtml((d.tracking && d.tracking.carrier) || '') + '" onchange="updateOrderTracking(\'' + doc.id + '\', \'carrier\', this.value)" placeholder="Courier" style="padding:7px 10px;border:1px solid var(--outline-variant);border-radius:8px;" />' +
          '    <input value="' + escapeHtml((d.tracking && d.tracking.number) || '') + '" onchange="updateOrderTracking(\'' + doc.id + '\', \'number\', this.value)" placeholder="Tracking/AWB" style="padding:7px 10px;border:1px solid var(--outline-variant);border-radius:8px;" />' +
          '    <input value="' + escapeHtml((d.tracking && d.tracking.url) || '') + '" onchange="updateOrderTracking(\'' + doc.id + '\', \'url\', this.value)" placeholder="Tracking URL" style="padding:7px 10px;border:1px solid var(--outline-variant);border-radius:8px;" />' +
          (d.read !== true ? '<button class="btn btn-sm btn-success" onclick="markOrderRead(\'' + doc.id + '\')">Mark Read</button>' : '') +
          '    <button class="btn btn-sm btn-outline" onclick="replyOrder(\'' + escapeHtml(customer.email || '') + '\', \'' + escapeHtml(customer.phone || '') + '\')">Reply</button>' +
          '    <button class="btn btn-sm btn-danger" onclick="deleteOrder(\'' + doc.id + '\')">Delete</button>' +
          '  </div>' +
          '</div>'
      })

      document.getElementById('orders-list').innerHTML = html
    }, function (error) {
      document.getElementById('orders-list').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error: ' + error.message + '</p></div>'
    })
}

function updateOrderTracking(docId, field, value) {
  var data = {}
  data['tracking.' + field] = value
  data['tracking.updatedAt'] = firebase.firestore.FieldValue.serverTimestamp()
  db.collection('orders').doc(docId).update(data).then(function () {
    showToast('Tracking updated', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function updateOrderStatus(docId, status) {
  db.collection('orders').doc(docId).update({
    status: status,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function () {
    showToast('Order status updated', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function updateOrderPayment(docId, paymentStatus) {
  db.collection('orders').doc(docId).update({
    paymentStatus: paymentStatus,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function () {
    showToast('Payment status updated', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function markOrderRead(docId) {
  db.collection('orders').doc(docId).update({ read: true })
}

function replyOrder(email, phone) {
  if (email) window.location.href = 'mailto:' + email + '?subject=Hariom Electronics Order'
  else if (phone) window.location.href = 'tel:' + phone
  else showToast('No contact information available', 'warning')
}

function deleteOrder(docId) {
  if (!confirm('Delete this order permanently?')) return
  db.collection('orders').doc(docId).delete().then(function () {
    showToast('Order deleted', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}
