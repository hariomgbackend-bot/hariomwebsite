/* ═══════════════════════════════════════════
   Brands Manager Module
   CRUD for Firestore 'brands' collection
   ═══════════════════════════════════════════ */

var brandsUnsubscribe = null

function renderBrands() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Brands</h1>' +
    '    <p>Manage brands displayed on the public website</p>' +
    '  </div>' +
    '  <button class="btn btn-primary" onclick="showAddBrandForm()">+ Add Brand</button>' +
    '</div>' +
    '<div id="brands-table"></div>'

  loadBrands()
}

function loadBrands() {
  if (brandsUnsubscribe) brandsUnsubscribe()

  brandsUnsubscribe = db.collection('brands')
    .orderBy('order')
    .onSnapshot(function (snapshot) {
      var rows = []
      snapshot.forEach(function (doc) {
        var d = doc.data()
        d._id = doc.id
        rows.push(d)
      })

      renderTable('brands-table', [
        {
          label: 'Logo',
          key: 'image',
          render: function (val, row) {
            if (val && val.startsWith('http')) {
              return '<img src="' + escapeHtml(val) + '" alt="' + escapeHtml(row.name) + '" style="width:36px;height:36px;border-radius:8px;object-fit:contain;background:#f0f0f0;" />'
            }
            return '<div style="width:36px;height:36px;border-radius:8px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#999;">' + escapeHtml((row.name || '??').slice(0, 2).toUpperCase()) + '</div>'
          }
        },
        { label: 'Name', key: 'name' },
        {
          label: 'Tagline',
          key: 'description',
          render: function (v) { return v ? '<span style="color:var(--on-surface-variant);font-size:0.78rem;">' + escapeHtml(v).slice(0, 40) + (v.length > 40 ? '…' : '') + '</span>' : '—' }
        },
        { label: 'Order', key: 'order', render: function (v) { return v != null ? v : '—' } },
        {
          label: 'Link',
          key: 'link',
          render: function (v) {
            return v ? '<a href="' + escapeHtml(v) + '" target="_blank" style="color:var(--brand-500);font-size:0.78rem;">link</a>' : '—'
          }
        }
      ], rows, function (row) {
        var id = escapeHtml(row._id)
        var order = row.order != null ? row.order : 0
        return '<button class="btn btn-outline btn-sm" onclick="moveBrand(\'' + id + '\', ' + (order - 1) + ')">&#9650;</button>' +
          '<button class="btn btn-outline btn-sm" onclick="moveBrand(\'' + id + '\', ' + (order + 1) + ')">&#9660;</button>' +
          '<button class="btn btn-outline btn-sm" onclick="showEditBrandForm(\'' + id + '\')">Edit</button>' +
          '<button class="btn btn-danger btn-sm" onclick="deleteBrand(\'' + id + '\')">Delete</button>'
      })
    }, function (error) {
      document.getElementById('brands-table').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error: ' + error.message + '</p></div>'
    })
}

function moveBrand(docId, newOrder) {
  if (newOrder < 0) newOrder = 0
  db.collection('brands').doc(docId).update({ order: newOrder }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function showAddBrandForm() {
  var body =
    '<form id="brand-form">' +
    '  <div class="field"><label>Brand Name *</label><input type="text" id="br-name" required /></div>' +
    '  <div class="field"><label>Tagline</label><textarea id="br-desc" rows="2" placeholder="e.g. Innovative consumer electronics leader"></textarea></div>' +
    '  <div class="field"><label>Logo Image</label><input type="file" id="br-image" accept="image/*" /></div>' +
    '  <div class="field"><label>Order</label><input type="number" id="br-order" value="0" min="0" /></div>' +
    '  <div class="field"><label>Link (optional)</label><input type="url" id="br-link" placeholder="https://example.com/brand-page" /></div>' +
    '  <div style="font-size:0.78rem;color:var(--on-surface-variant);">When clicked, opens this URL on the website. Leave empty for no link.</div>' +
    '</form>'

  openModal('Add Brand', body,
    '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveNewBrand()">Save Brand</button>'
  )
}

function saveNewBrand() {
  var name = document.getElementById('br-name').value.trim()
  if (!name) { showToast('Brand name is required', 'error'); return }

  var fileInput = document.getElementById('br-image')
  var file = fileInput && fileInput.files ? fileInput.files[0] : null
  var desc = document.getElementById('br-desc').value.trim() || ''
  var order = parseInt(document.getElementById('br-order').value) || 0
  var link = document.getElementById('br-link').value.trim() || ''

  function saveToFirestore(imageUrl) {
    db.collection('brands').add({
      name: name,
      description: desc,
      image: imageUrl || '',
      order: order,
      link: link,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () {
      showToast('Brand added', 'success')
      document.querySelector('.modal-overlay').remove()
    }).catch(function (err) {
      showToast('Error: ' + err.message, 'error')
    })
  }

  if (file) {
    var uploadTask = storage.ref('brands/' + Date.now() + '_' + file.name).put(file)
    uploadTask.on('state_changed', null, function (err) {
      showToast('Upload error: ' + err.message, 'error')
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        saveToFirestore(downloadURL)
      })
    })
  } else {
    saveToFirestore('')
  }
}

function showEditBrandForm(docId) {
  db.collection('brands').doc(docId).get().then(function (doc) {
    if (!doc.exists) { showToast('Not found', 'error'); return }
    var d = doc.data()

    var currentImageHtml = d.image && d.image.startsWith('http')
      ? '<div style="margin-bottom:8px;"><img src="' + escapeHtml(d.image) + '" alt="Current logo" style="width:60px;height:60px;border-radius:10px;object-fit:contain;background:#f0f0f0;border:1px solid var(--outline-variant);" /></div>'
      : ''

    var body =
      '<form id="brand-form">' +
      '  <div class="field"><label>Brand Name *</label><input type="text" id="br-name" value="' + escapeHtml(d.name || '') + '" required /></div>' +
      '  <div class="field"><label>Tagline</label><textarea id="br-desc" rows="2">' + escapeHtml(d.description || '') + '</textarea></div>' +
      '  <div class="field">' +
      '    <label>Logo Image</label>' +
      currentImageHtml +
      '    <input type="file" id="br-image" accept="image/*" />' +
      '    <div style="font-size:0.72rem;color:var(--outline);margin-top:4px;">Leave empty to keep current logo</div>' +
      '  </div>' +
      '  <div class="field"><label>Order</label><input type="number" id="br-order" value="' + (d.order != null ? d.order : 0) + '" min="0" /></div>' +
      '  <div class="field"><label>Link</label><input type="url" id="br-link" value="' + escapeHtml(d.link || '') + '" /></div>' +
      '</form>'

    openModal('Edit Brand', body,
      '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="updateBrand(\'' + docId + '\')">Update</button>'
    )
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function updateBrand(docId) {
  var name = document.getElementById('br-name').value.trim()
  if (!name) { showToast('Brand name is required', 'error'); return }

  var fileInput = document.getElementById('br-image')
  var file = fileInput && fileInput.files ? fileInput.files[0] : null
  var desc = document.getElementById('br-desc').value.trim() || ''
  var order = parseInt(document.getElementById('br-order').value) || 0
  var link = document.getElementById('br-link').value.trim() || ''

  function updateInFirestore(imageUrl) {
    var data = {
      name: name,
      description: desc,
      order: order,
      link: link,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
    if (imageUrl !== undefined) data.image = imageUrl

    db.collection('brands').doc(docId).update(data).then(function () {
      showToast('Brand updated', 'success')
      document.querySelector('.modal-overlay').remove()
    }).catch(function (err) {
      showToast('Error: ' + err.message, 'error')
    })
  }

  if (file) {
    var uploadTask = storage.ref('brands/' + Date.now() + '_' + file.name).put(file)
    uploadTask.on('state_changed', null, function (err) {
      showToast('Upload error: ' + err.message, 'error')
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        updateInFirestore(downloadURL)
      })
    })
  } else {
    updateInFirestore()
  }
}

function deleteBrand(docId) {
  if (!confirm('Delete this brand permanently?')) return

  db.collection('brands').doc(docId).get().then(function (doc) {
    if (doc.exists) {
      var d = doc.data()
      if (d.image && d.image.startsWith('http')) {
        try { storage.refFromURL(d.image).delete().catch(function () {}) } catch (e) {}
      }
    }
    db.collection('brands').doc(docId).delete().then(function () {
      showToast('Brand deleted', 'success')
    }).catch(function (err) {
      showToast('Error: ' + err.message, 'error')
    })
  }).catch(function () {
    db.collection('brands').doc(docId).delete().then(function () {
      showToast('Brand deleted', 'success')
    }).catch(function (err) {
      showToast('Error: ' + err.message, 'error')
    })
  })
}
