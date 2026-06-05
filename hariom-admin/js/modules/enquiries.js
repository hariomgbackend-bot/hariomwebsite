/* ═══════════════════════════════════════════
   Live Enquiry Inbox (CRM) Module
   Real-time listener on Firestore 'enquiries' collection
   ═══════════════════════════════════════════ */

var enquiriesUnsubscribe = null
var lastEnquiryCount = 0

function renderEnquiries() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Live Enquiries</h1>' +
    '    <p>Customer messages appear here in real time</p>' +
    '  </div>' +
    '  <div class="flex gap-2">' +
    '    <button class="btn btn-outline btn-sm" onclick="markAllRead()">Mark All Read</button>' +
    '  </div>' +
    '</div>' +
    '<div id="enquiries-list" class="enquiry-list">' +
    '  <div class="empty-state"><p>Listening for enquiries...</p></div>' +
    '</div>'

  listenEnquiries()
}

function listenEnquiries() {
  if (enquiriesUnsubscribe) enquiriesUnsubscribe()

  enquiriesUnsubscribe = db.collection('enquiries')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(function (snapshot) {
      var html = ''
      var unreadCount = 0

      // Detect new enquiries (added in this snapshot change)
      snapshot.docChanges().forEach(function (change) {
        if (change.type === 'added') {
          unreadCount++
        }
      })

      // Also count total unread from all docs
      snapshot.forEach(function (doc) {
        var d = doc.data()
        if (d.read !== true) unreadCount++
      })

      // Update badge
      var badge = document.getElementById('enquiry-badge')
      if (badge) {
        if (unreadCount > 0) {
          badge.textContent = unreadCount
          badge.classList.remove('hidden')
        } else {
          badge.classList.add('hidden')
        }
      }

      // Play alert if new unread count > previous
      if (unreadCount > lastEnquiryCount) {
        playEnquiryAlert()
      }
      lastEnquiryCount = unreadCount

      // Render the list
      if (snapshot.empty) {
        html = '<div class="empty-state"><p>No enquiries yet.</p></div>'
      } else {
        html = ''
        snapshot.forEach(function (doc) {
          var d = doc.data()
          var id = doc.id
          var isUnread = d.read !== true
          var time = d.createdAt
            ? new Date(d.createdAt.seconds * 1000).toLocaleString()
            : 'Just now'
          var name = escapeHtml(d.name || 'Anonymous')
          var email = escapeHtml(d.email || '')
          var phone = escapeHtml(d.phone || '')
          var message = escapeHtml(d.message || 'No message')

          html +=
            '<div class="enquiry-card' + (isUnread ? ' unread' : '') + '">' +
            '  <div class="enquiry-header">' +
            '    <div>' +
            '      <div class="enquiry-name">' + name + '</div>' +
            '      <div class="enquiry-contact">' +
            (email ? '<a href="mailto:' + email + '">' + email + '</a>' : '') +
            (phone ? ' &middot; <a href="tel:' + phone + '">' + phone + '</a>' : '') +
            '      </div>' +
            '    </div>' +
            '    <span class="enquiry-time">' + time + '</span>' +
            '  </div>' +
            '  <div class="enquiry-message">' + message + '</div>' +
            '  <div class="enquiry-actions">' +
            (isUnread
              ? '<button class="btn btn-sm btn-success" onclick="markEnquiryRead(\'' + id + '\')">Mark Read</button>'
              : '') +
            '    <button class="btn btn-sm btn-outline" onclick="replyEnquiry(\'' + email + '\', \'' + phone + '\')">Reply</button>' +
            '    <button class="btn btn-sm btn-danger" onclick="deleteEnquiry(\'' + id + '\')">Delete</button>' +
            '  </div>' +
            '</div>'
        })
      }

      document.getElementById('enquiries-list').innerHTML = html
    }, function (error) {
      document.getElementById('enquiries-list').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error: ' + error.message + '</p></div>'
    })
}

function markEnquiryRead(docId) {
  db.collection('enquiries').doc(docId).update({
    read: true
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function markAllRead() {
  db.collection('enquiries')
    .where('read', '==', false)
    .get()
    .then(function (snapshot) {
      var batch = db.batch()
      snapshot.forEach(function (doc) {
        batch.update(doc.ref, { read: true })
      })
      return batch.commit()
    })
    .then(function () {
      showToast('All enquiries marked as read', 'success')
    })
    .catch(function (err) {
      showToast('Error: ' + err.message, 'error')
    })
}

function replyEnquiry(email, phone) {
  var contact = email || phone
  if (!contact) {
    showToast('No contact information available', 'warning')
    return
  }

  var target = email ? 'mailto:' + email : 'tel:' + phone
  if (email) {
    window.location.href = target + '?subject=Reply from Hariom Electronics'
  } else {
    window.location.href = target
  }
}

function deleteEnquiry(docId) {
  if (!confirm('Delete this enquiry permanently?')) return
  db.collection('enquiries').doc(docId).delete().then(function () {
    showToast('Enquiry deleted', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}
