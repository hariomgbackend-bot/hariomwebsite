/* ═══════════════════════════════════════════
   Offers & Campaign Manager Module
   CRUD for Firestore 'promotions' collection
   ═══════════════════════════════════════════ */

var offersUnsubscribe = null

function renderOffers() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Offers &amp; Campaigns</h1>' +
    '    <p>Manage promotions that appear on the public website</p>' +
    '  </div>' +
    '  <button class="btn btn-primary" onclick="showAddOfferForm()">+ New Promotion</button>' +
    '</div>' +
    '<div id="offers-table"></div>'

  loadOffers()
}

function loadOffers() {
  if (offersUnsubscribe) offersUnsubscribe()

  offersUnsubscribe = db.collection('promotions')
    .orderBy('createdAt', 'desc')
    .onSnapshot(function (snapshot) {
      var rows = []
      snapshot.forEach(function (doc) {
        var d = doc.data()
        d._id = doc.id
        rows.push(d)
      })

      renderTable('offers-table', [
        { label: 'Title', key: 'title' },
        {
          label: 'Active',
          key: 'isActive',
          render: function (val, row) {
            var checked = val === true ? 'checked' : ''
            return '<label class="switch"><input type="checkbox" ' + checked +
              ' onchange="toggleOffer(\'' + escapeHtml(row._id) + '\', this.checked)" />' +
              '<span class="slider"></span></label>'
          }
        },
        {
          label: 'Badge',
          key: 'badge',
          render: function (v) { return v ? '<span class="badge">' + escapeHtml(v) + '</span>' : '—' }
        },
        { label: 'Description', key: 'description', render: function (v) { return v ? escapeHtml(v).slice(0, 60) + '…' : '—' } },
        { label: 'Valid Till', key: 'validTill', render: function (v) { return v || '—' } }
      ], rows, function (row) {
        var id = escapeHtml(row._id)
        var encTitle = escapeHtml(row.title || '').replace(/'/g, "\\'")
        return '<button class="btn btn-outline btn-sm" onclick="showOfferPreview(\'' + id + '\')">Preview</button>' +
          '<button class="btn btn-outline btn-sm" onclick="showEditOfferForm(\'' + id + '\')">Edit</button>' +
          '<button class="btn btn-danger btn-sm" onclick="deleteOffer(\'' + id + '\')">Delete</button>'
      })
    }, function (error) {
      document.getElementById('offers-table').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error: ' + error.message + '</p></div>'
    })
}

function showAddOfferForm() {
  var body =
    '<form id="offer-form">' +
    '  <div class="field"><label>Title *</label><input type="text" id="of-title" required /></div>' +
    '  <div class="field"><label>Hindi Title</label><input type="text" id="of-title-hi" /></div>' +
    '  <div class="field"><label>Marathi Title</label><input type="text" id="of-title-mr" /></div>' +
    '  <div class="field"><label>Description</label><textarea id="of-desc" rows="2"></textarea></div>' +
    '  <div class="field"><label>Badge (e.g. SALE, EMI, EXCHANGE)</label><input type="text" id="of-badge" /></div>' +
    '  <div class="field"><label>Valid Till</label><input type="text" id="of-valid" placeholder="e.g. 30 Jun 2026" /></div>' +
    '  <div class="field">' +
    '    <label><input type="checkbox" id="of-active" checked /> Active on website</label>' +
    '  </div>' +
    '</form>'

  openModal('Add Promotion', body,
    '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveNewOffer()">Save Promotion</button>'
  )
}

function saveNewOffer() {
  var title = document.getElementById('of-title').value.trim()
  if (!title) { showToast('Title is required', 'error'); return }

  db.collection('promotions').add({
    title: title,
    titleHi: document.getElementById('of-title-hi').value.trim() || '',
    titleMr: document.getElementById('of-title-mr').value.trim() || '',
    description: document.getElementById('of-desc').value.trim() || '',
    badge: document.getElementById('of-badge').value.trim() || '',
    validTill: document.getElementById('of-valid').value.trim() || '',
    isActive: document.getElementById('of-active').checked,
    color: 'brand',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function () {
    showToast('Promotion added', 'success')
    document.querySelector('.modal-overlay').remove()
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function showEditOfferForm(docId) {
  db.collection('promotions').doc(docId).get().then(function (doc) {
    if (!doc.exists) { showToast('Not found', 'error'); return }
    var d = doc.data()

    var body =
      '<form id="offer-form">' +
      '  <div class="field"><label>Title *</label><input type="text" id="of-title" value="' + escapeHtml(d.title || '') + '" required /></div>' +
      '  <div class="field"><label>Hindi Title</label><input type="text" id="of-title-hi" value="' + escapeHtml(d.titleHi || '') + '" /></div>' +
      '  <div class="field"><label>Marathi Title</label><input type="text" id="of-title-mr" value="' + escapeHtml(d.titleMr || '') + '" /></div>' +
      '  <div class="field"><label>Description</label><textarea id="of-desc" rows="2">' + escapeHtml(d.description || '') + '</textarea></div>' +
      '  <div class="field"><label>Badge</label><input type="text" id="of-badge" value="' + escapeHtml(d.badge || '') + '" /></div>' +
      '  <div class="field"><label>Valid Till</label><input type="text" id="of-valid" value="' + escapeHtml(d.validTill || '') + '" /></div>' +
      '  <div class="field"><label><input type="checkbox" id="of-active" ' + (d.isActive === true ? 'checked' : '') + ' /> Active on website</label></div>' +
      '</form>'

    openModal('Edit Promotion', body,
      '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="updateOffer(\'' + docId + '\')">Update</button>'
    )
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function updateOffer(docId) {
  var title = document.getElementById('of-title').value.trim()
  if (!title) { showToast('Title is required', 'error'); return }

  db.collection('promotions').doc(docId).update({
    title: title,
    titleHi: document.getElementById('of-title-hi').value.trim(),
    titleMr: document.getElementById('of-title-mr').value.trim(),
    description: document.getElementById('of-desc').value.trim(),
    badge: document.getElementById('of-badge').value.trim(),
    validTill: document.getElementById('of-valid').value.trim(),
    isActive: document.getElementById('of-active').checked
  }).then(function () {
    showToast('Promotion updated', 'success')
    document.querySelector('.modal-overlay').remove()
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function toggleOffer(docId, isActive) {
  db.collection('promotions').doc(docId).update({
    isActive: isActive
  }).then(function () {
    showToast(isActive ? 'Promotion activated' : 'Promotion deactivated', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function deleteOffer(docId) {
  if (!confirm('Delete this promotion permanently?')) return
  db.collection('promotions').doc(docId).delete().then(function () {
    showToast('Promotion deleted', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

/* ── Offer Preview (website mockup) ── */
function showOfferPreview(docId) {
  db.collection('promotions').doc(docId).get().then(function (doc) {
    if (!doc.exists) { showToast('Promotion not found', 'error'); return }
    var d = doc.data()

    var badgeColor = d.color === 'accent' ? '#ea5f1e' : '#1a3fa8'

    var body =
      '<div class="preview-frame">' +
      '  <div class="preview-statusbar">' +
      '    <span>9:41</span>' +
      '    <span>📶 🔋</span>' +
      '  </div>' +
      '  <div class="preview-browser-bar">' +
      '    <span style="color:white;font-size:11px;font-weight:600;">hariomelectronics.com</span>' +
      '  </div>' +
      '  <div class="preview-content" style="background:#0e1a3a;padding:16px;display:flex;flex-direction:column;gap:12px;">' +
      '    <div style="text-align:center;padding:8px 0 4px;">' +
      '      <span style="color:white;font-size:14px;font-weight:700;">Offers &amp; Campaigns</span>' +
      '    </div>' +
      '    <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);border-radius:12px;padding:20px;border:1px solid rgba(255,255,255,0.1);">' +
      '      <span style="display:inline-block;background:' + badgeColor + ';color:white;font-size:10px;font-weight:bold;padding:4px 10px;border-radius:6px;letter-spacing:0.5px;margin-bottom:10px;">' + escapeHtml(d.badge || '') + '</span>' +
      '      <h3 style="color:white;font-size:15px;font-weight:600;margin:0 0 6px 0;">' + escapeHtml(d.title || '') + '</h3>' +
      '      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">' + escapeHtml(d.description || '') + '</p>' +
      '      <p style="color:#ea5f1e;font-size:11px;font-weight:500;margin:12px 0 0 0;">Valid till: ' + escapeHtml(d.validTill || '—') + '</p>' +
      '    </div>' +
      '    <div style="margin-top:4px;text-align:center;font-size:10px;color:rgba(255,255,255,0.3);">Offer card on mobile view</div>' +
      '  </div>' +
      '</div>'

    openModal('Promotion Preview — ' + escapeHtml(d.title || ''), body,
      '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Close</button>'
    )
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}
