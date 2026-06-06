var returnsUnsubscribe = null

function renderReturns() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Returns &amp; Support</h1>' +
    '    <p>Customer return, replacement, refund and service requests</p>' +
    '  </div>' +
    '</div>' +
    '<div id="returns-list" class="enquiry-list">' +
    '  <div class="empty-state"><p>Listening for return requests...</p></div>' +
    '</div>'

  listenReturns()
}

function listenReturns() {
  if (returnsUnsubscribe) returnsUnsubscribe()

  returnsUnsubscribe = db.collection('returns')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(function (snapshot) {
      if (snapshot.empty) {
        document.getElementById('returns-list').innerHTML = '<div class="empty-state"><p>No return requests yet.</p></div>'
        return
      }

      var html = ''
      snapshot.forEach(function (doc) {
        var d = doc.data()
        var customer = d.customer || {}
        var time = d.createdAt && d.createdAt.seconds ? new Date(d.createdAt.seconds * 1000).toLocaleString() : 'Just now'
        var items = (d.items || []).join(', ')
        var status = d.status || 'requested'

        html +=
          '<div class="enquiry-card' + (d.read !== true ? ' unread' : '') + '">' +
          '  <div class="enquiry-header">' +
          '    <div>' +
          '      <div class="enquiry-name">' + escapeHtml(d.preferredResolution || 'Return') + ' - Order #' + escapeHtml((d.orderId || '').slice(0, 8)) + '</div>' +
          '      <div class="enquiry-contact">' + escapeHtml(customer.name || 'Customer') +
          (customer.phone ? ' &middot; <a href="tel:' + escapeHtml(customer.phone) + '">' + escapeHtml(customer.phone) + '</a>' : '') +
          (d.alternatePhone ? ' &middot; Alt: <a href="tel:' + escapeHtml(d.alternatePhone) + '">' + escapeHtml(d.alternatePhone) + '</a>' : '') +
          '      </div>' +
          '    </div>' +
          '    <span class="enquiry-time">' + time + '</span>' +
          '  </div>' +
          '  <div class="enquiry-message">' +
          '    <strong>Status:</strong> ' + escapeHtml(status) + '<br />' +
          '    <strong>Items:</strong> ' + escapeHtml(items || 'Not specified') + '<br />' +
          '    <strong>Reason:</strong> ' + escapeHtml(d.reason || '-') + '<br />' +
          '    <strong>Issue:</strong> ' + escapeHtml(d.issue || '-') + '<br />' +
          '    <strong>Pickup:</strong> ' + escapeHtml(d.pickupAddress || '-') +
          '  </div>' +
          '  <div class="enquiry-actions" style="flex-wrap:wrap;">' +
          '    <select onchange="updateReturnStatus(\'' + doc.id + '\', this.value)" style="padding:7px 10px;border:1px solid var(--outline-variant);border-radius:8px;">' +
          optionHtml('requested', status, 'Requested') +
          optionHtml('reviewing', status, 'Reviewing') +
          optionHtml('approved', status, 'Approved') +
          optionHtml('pickup_scheduled', status, 'Pickup Scheduled') +
          optionHtml('resolved', status, 'Resolved') +
          optionHtml('rejected', status, 'Rejected') +
          '    </select>' +
          (d.read !== true ? '<button class="btn btn-sm btn-success" onclick="markReturnRead(\'' + doc.id + '\')">Mark Read</button>' : '') +
          '    <button class="btn btn-sm btn-danger" onclick="deleteReturnRequest(\'' + doc.id + '\')">Delete</button>' +
          '  </div>' +
          '</div>'
      })

      document.getElementById('returns-list').innerHTML = html
    }, function (error) {
      document.getElementById('returns-list').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error: ' + error.message + '</p></div>'
    })
}

function updateReturnStatus(docId, status) {
  db.collection('returns').doc(docId).update({
    status: status,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function () {
    showToast('Return status updated', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function markReturnRead(docId) {
  db.collection('returns').doc(docId).update({ read: true })
}

function deleteReturnRequest(docId) {
  if (!confirm('Delete this return request permanently?')) return
  db.collection('returns').doc(docId).delete().then(function () {
    showToast('Return request deleted', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}
