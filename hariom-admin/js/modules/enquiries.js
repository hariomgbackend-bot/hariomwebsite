/* Live Enquiry Inbox Module */

var enquiriesUnsubscribe = null
var _enquiryInitialLoad = true
var _lastEnquiryUnread = 0

function renderEnquiries() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div><h1>Live Enquiries</h1><p>Customer messages appear here in real time</p></div>' +
    '  <div class="flex gap-2">' +
    '    <button class="btn btn-outline btn-sm" onclick="markAllRead()">Mark All Read</button>' +
    '  </div>' +
    '</div>' +
    '<div id="enquiries-list" class="enquiry-list">' +
    '  <div class="empty-state"><p>Listening for enquiries...</p></div>' +
    '</div>'

  _enquiryInitialLoad = true
  listenEnquiries()
}

function listenEnquiries() {
  if (enquiriesUnsubscribe) enquiriesUnsubscribe()

  enquiriesUnsubscribe = db.collection('enquiries')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(function (snapshot) {

      // FIX: count unread from actual document data only (not docChanges which double-counts on load)
      var unreadCount = 0
      snapshot.forEach(function (doc) {
        if (doc.data().read !== true) unreadCount++
      })

      // Update sidebar badge
      var badge = document.getElementById('enquiry-badge')
      if (badge) {
        if (unreadCount > 0) {
          badge.textContent = unreadCount
          badge.classList.remove('hidden')
        } else {
          badge.classList.add('hidden')
        }
      }

      // FIX: only play alert when genuinely new messages arrive (not on initial page load)
      if (!_enquiryInitialLoad && unreadCount > _lastEnquiryUnread) {
        playEnquiryAlert()
      }
      _enquiryInitialLoad = false
      _lastEnquiryUnread = unreadCount

      // Render list
      if (snapshot.empty) {
        document.getElementById('enquiries-list').innerHTML =
          '<div class="empty-state"><p>No enquiries yet.</p></div>'
        return
      }

      var html = ''
      snapshot.forEach(function (doc) {
        var d = doc.data()
        var id = doc.id
        var isUnread = d.read !== true
        var time = d.createdAt
          ? new Date(d.createdAt.seconds * 1000).toLocaleString('en-IN')
          : 'Just now'
        var name = escapeHtml(d.name || 'Anonymous')
        var email = escapeHtml(d.email || '')
        var phone = escapeHtml(d.phone || '')
        var message = escapeHtml(d.message || 'No message')
        var product = d.product ? escapeHtml(d.product) : ''

        html +=
          '<div class="enquiry-card' + (isUnread ? ' unread' : '') + '">' +
          '  <div class="enquiry-header">' +
          '    <div>' +
          '      <div class="enquiry-name">' + name + (isUnread ? ' <span class="unread-dot"></span>' : '') + '</div>' +
          '      <div class="enquiry-contact">' +
          (email ? '<a href="mailto:' + email + '">' + email + '</a>' : '') +
          (phone ? ' &middot; <a href="tel:' + phone + '">' + phone + '</a>' : '') +
          '      </div>' +
          '    </div>' +
          '    <span class="enquiry-time">' + time + '</span>' +
          '  </div>' +
          (product ? '<div class="enquiry-product-tag">Re: ' + product + '</div>' : '') +
          '  <div class="enquiry-message">' + message + '</div>' +
          '  <div class="enquiry-actions">' +
          (isUnread ? '<button class="btn btn-sm btn-success" onclick="markEnquiryRead(\'' + id + '\')">Mark Read</button>' : '') +
          '    <button class="btn btn-sm btn-outline" onclick="replyEnquiry(\'' + email + '\', \'' + phone + '\')">Reply</button>' +
          '    <button class="btn btn-sm btn-danger" onclick="deleteEnquiry(\'' + id + '\')">Delete</button>' +
          '  </div>' +
          '</div>'
      })

      document.getElementById('enquiries-list').innerHTML = html
    }, function (error) {
      document.getElementById('enquiries-list').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error: ' + error.message + '</p></div>'
    })
}

function markEnquiryRead(docId) {
  db.collection('enquiries').doc(docId).update({ read: true })
    .catch(function (err) { showToast('Error: ' + err.message, 'error') })
}

function markAllRead() {
  db.collection('enquiries').get().then(function (snapshot) {
    var batch = db.batch()
    snapshot.forEach(function (doc) {
      if (doc.data().read !== true) batch.update(doc.ref, { read: true })
    })
    return batch.commit()
  }).then(function () {
    showToast('All enquiries marked as read', 'success')
  }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
}

function replyEnquiry(email, phone) {
  if (!email && !phone) { showToast('No contact information available', 'warning'); return }
  if (email) window.location.href = 'mailto:' + email + '?subject=Reply from Hariom Electronics'
  else window.location.href = 'tel:' + phone
}

function deleteEnquiry(docId) {
  if (!confirm('Delete this enquiry permanently?')) return
  db.collection('enquiries').doc(docId).delete()
    .then(function () { showToast('Enquiry deleted', 'success') })
    .catch(function (err) { showToast('Error: ' + err.message, 'error') })
}
