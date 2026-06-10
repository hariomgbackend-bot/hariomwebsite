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
    .orderBy('name')
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
          label: 'Link',
          key: 'link',
          render: function (v) {
            return v ? '<a href="' + escapeHtml(v) + '" target="_blank" style="color:var(--brand-500);font-size:0.78rem;">' + escapeHtml(v).slice(0, 30) + '…</a>' : '—'
          }
        }
      ], rows, function (row) {
        var id = escapeHtml(row._id)
        var encName = escapeHtml(row.name || '').replace(/'/g, "\\'")
        return '<button class="btn btn-outline btn-sm" onclick="showEditBrandForm(\'' + id + '\')">Edit</button>' +
          '<button class="btn btn-danger btn-sm" onclick="deleteBrand(\'' + id + '\')">Delete</button>'
      })
    }, function (error) {
      document.getElementById('brands-table').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error: ' + error.message + '</p></div>'
    })
}

function showAddBrandForm() {
  var body =
    '<form id="brand-form">' +
    '  <div class="field"><label>Brand Name *</label><input type="text" id="br-name" required /></div>' +
    '  <div class="field"><label>Logo Image</label><input type="file" id="br-image" accept="image/*" /></div>' +
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
  var link = document.getElementById('br-link').value.trim() || ''

  if (file) {
    var uploadTask = storage.ref('brands/' + Date.now() + '_' + file.name).put(file)
    uploadTask.on('state_changed', null, function (err) {
      showToast('Upload error: ' + err.message, 'error')
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        db.collection('brands').add({
          name: name,
          image: downloadURL,
          link: link,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function () {
          showToast('Brand added', 'success')
          document.querySelector('.modal-overlay').remove()
        }).catch(function (err) {
          showToast('Error: ' + err.message, 'error')
        })
      })
    })
  } else {
    db.collection('brands').add({
      name: name,
      image: '',
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
      '  <div class="field">' +
      '    <label>Logo Image</label>' +
      currentImageHtml +
      '    <input type="file" id="br-image" accept="image/*" />' +
      '    <div style="font-size:0.72rem;color:var(--outline);margin-top:4px;">Leave empty to keep current logo</div>' +
      '  </div>' +
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
  var link = document.getElementById('br-link').value.trim() || ''

  if (file) {
    var uploadTask = storage.ref('brands/' + Date.now() + '_' + file.name).put(file)
    uploadTask.on('state_changed', null, function (err) {
      showToast('Upload error: ' + err.message, 'error')
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        db.collection('brands').doc(docId).update({
          name: name,
          image: downloadURL,
          link: link,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function () {
          showToast('Brand updated', 'success')
          document.querySelector('.modal-overlay').remove()
        }).catch(function (err) {
          showToast('Error: ' + err.message, 'error')
        })
      })
    })
  } else {
    db.collection('brands').doc(docId).update({
      name: name,
      link: link,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () {
      showToast('Brand updated', 'success')
      document.querySelector('.modal-overlay').remove()
    }).catch(function (err) {
      showToast('Error: ' + err.message, 'error')
    })
  }
}

function deleteBrand(docId) {
  if (!confirm('Delete this brand permanently?')) return

  db.collection('brands').doc(docId).get().then(function (doc) {
    if (doc.exists) {
      var d = doc.data()
      if (d.image && d.image.startsWith('http')) {
        var storageRef = storage.refFromURL(d.image)
        storageRef.delete().catch(function () { /* ignore delete errors */ })
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
