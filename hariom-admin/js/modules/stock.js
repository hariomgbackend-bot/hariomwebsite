var stockUnsubscribe = null
var _allProducts = []
var _tallyNames = []

function renderStock() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Stock &amp; Pricing</h1>' +
    '    <p>Categories synced from website · add products from Tally list</p>' +
    '  </div>' +
    '  <button class="btn btn-primary" onclick="showAddCategoryFromStock()">+ Add Category</button>' +
    '</div>' +
    '<div id="stock-table"></div>'

  loadTallyNames()
  loadStock()
}

function loadTallyNames() {
  db.collection('tally_products').doc('index').get().then(function (doc) {
    if (doc.exists) {
      _tallyNames = doc.data().names || []
    }
  }).catch(function () {})
}

function loadStock() {
  if (stockUnsubscribe) stockUnsubscribe()

  stockUnsubscribe = db.collection('products')
    .onSnapshot(function (snapshot) {
      var products = []
      snapshot.forEach(function (doc) {
        var d = doc.data()
        d._id = doc.id
        products.push(d)
      })
      _allProducts = products
      renderCategoryTiles()
    }, function (error) {
      document.getElementById('stock-table').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error loading products: ' + error.message + '</p></div>'
    })
}

function renderCategoryTiles() {
  var container = document.getElementById('stock-table')
  if (!container) return

  db.collection('categories').orderBy('order', 'asc').get().then(function (snap) {
    var cats = []
    snap.forEach(function (doc) {
      var d = doc.data()
      cats.push({ id: d.id || doc.id, name: d.name, icon: d.icon || '' })
    })

    if (cats.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
        '<div style="font-size:2rem;margin-bottom:8px;">📂</div>' +
        '<p style="font-weight:600;color:var(--brand-700);">No categories yet</p>' +
        '<p style="font-size:0.8rem;margin-top:4px;">Click <strong>+ Add Category</strong> to create your first category.</p>' +
        '</div>'
      return
    }

    var validCatIds = {}
    cats.forEach(function (c) { validCatIds[c.id] = true })

    var uncategorized = _allProducts.filter(function (p) { return !p.category || !validCatIds[p.category] })

    var html = '<div class="category-tile-grid">'

    cats.forEach(function (c) {
      var count = _allProducts.filter(function (p) { return p.category === c.id }).length
      html +=
        '<div class="category-tile" data-cat="' + escapeHtml(c.id) + '">' +
        '  <div class="category-tile-icon">&#128230;</div>' +
        '  <div class="category-tile-name">' + escapeHtml(c.name) + '</div>' +
        '  <div class="category-tile-count">' + count + ' product' + (count !== 1 ? 's' : '') + '</div>' +
        '</div>'
    })

    if (uncategorized.length > 0) {
      html +=
        '<div class="category-tile" data-cat="__uncategorized__" style="border:2px dashed var(--danger);">' +
        '  <div class="category-tile-icon">&#9888;&#65039;</div>' +
        '  <div class="category-tile-name" style="color:var(--danger);">Uncategorized</div>' +
        '  <div class="category-tile-count" style="color:var(--danger);">' + uncategorized.length + ' product' + (uncategorized.length !== 1 ? 's' : '') + '</div>' +
        '</div>'
    }

    html += '</div>'
    container.innerHTML = html

    Array.from(container.querySelectorAll('.category-tile')).forEach(function (el) {
      el.addEventListener('click', function () {
        var cat = el.getAttribute('data-cat')
        if (cat === '__uncategorized__') {
          showUncategorizedView()
        } else {
          showCategoryView(cat)
        }
      })
    })
  }).catch(function () {
    container.innerHTML = '<div class="empty-state"><p>Error loading categories.</p></div>'
  })
}

function showAddCategoryFromStock() {
  if (typeof showAddCategoryForm === 'function') {
    showAddCategoryForm()
  }
}

function showCategoryView(categoryId) {
  var container = document.getElementById('stock-table')
  if (!container) return

  db.collection('categories').where('id', '==', categoryId).get().then(function (snap) {
    var catName = categoryId
    if (!snap.empty) {
      snap.forEach(function (d) { catName = d.data().name || categoryId })
    }

    var catProducts = _allProducts.filter(function (p) { return p.category === categoryId })

    var html =
      '<div style="margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">' +
      '  <button class="btn btn-outline btn-sm" onclick="renderCategoryTiles()">&#8592; All Categories</button>' +
      '  <span style="font-weight:700;font-size:1rem;color:var(--brand-800);flex:1;">' + escapeHtml(catName) + '</span>' +
      '  <button class="btn btn-primary" onclick="showAddProductForm(\'' + escapeHtml(categoryId).replace(/'/g, "\\'") + '\')">+ Add Product</button>' +
      '</div>'

    if (catProducts.length === 0) {
      html += '<div class="empty-state"><p>No products in this category yet.</p></div>'
      container.innerHTML = html
      return
    }

    html +=
      '<div class="table-wrapper">' +
      '  <table class="data-table">' +
      '    <thead><tr>' +
      '      <th>Image</th><th>Name</th><th>Brand</th><th>Price</th><th>Featured</th><th>Updated</th>' +
      '      <th class="text-right">Actions</th>' +
      '    </tr></thead><tbody>'

    catProducts.forEach(function (p) {
      var imgs = p.images || []
      var imgHtml = '<span style="color:var(--outline);font-size:18px;">&#128247;</span>'
      if (imgs.length > 0) {
        imgHtml = '<div style="display:flex;gap:4px;align-items:center;">' +
          '<img src="' + escapeHtml(imgs[0]) + '" style="width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid var(--outline-variant);" onerror="this.style.display=\'none\'" />'
        if (imgs.length > 1) imgHtml += '<span style="font-size:10px;color:var(--on-surface-variant);font-weight:600;">+' + (imgs.length - 1) + '</span>'
        imgHtml += '</div>'
      }

      var featHtml = p.featured === true
        ? '<span style="color:var(--accent);font-weight:700;">&#9733;</span>'
        : '<span style="color:var(--outline);">&#9734;</span>'

      var updated = p.updatedAt ? new Date(p.updatedAt.seconds * 1000).toLocaleDateString('en-IN') : '—'
      var encName = escapeHtml(p.name).replace(/'/g, "\\'")

      html += '<tr>' +
        '<td>' + imgHtml + '</td>' +
        '<td style="font-weight:600;max-width:240px;">' + escapeHtml(p.name) + '</td>' +
        '<td>' + escapeHtml(p.brand || '—') + '</td>' +
        '<td><span class="price">&#8377;' + escapeHtml(String(p.price || '').replace(/^₹\s*/, '') || '—') + '</span></td>' +
        '<td>' + featHtml + '</td>' +
        '<td style="font-size:0.78rem;color:var(--on-surface-variant);">' + updated + '</td>' +
        '<td class="actions">' +
        '  <button class="btn btn-outline btn-sm" onclick="showEditProductForm(\'' + encName + '\')">Edit</button>' +
        '  <button class="btn btn-danger btn-sm" onclick="deleteProduct(\'' + encName + '\')">Delete</button>' +
        '</td></tr>'
    })

    html += '</tbody></table></div>'
    container.innerHTML = html
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function showUncategorizedView() {
  var container = document.getElementById('stock-table')
  if (!container) return

  var validCatIds = {}
  db.collection('categories').get().then(function (snap) {
    snap.forEach(function (doc) { var d = doc.data(); validCatIds[d.id || doc.id] = true })

    var uncategorized = _allProducts.filter(function (p) { return !p.category || !validCatIds[p.category] })

    var html =
      '<div style="margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">' +
      '  <button class="btn btn-outline btn-sm" onclick="renderCategoryTiles()">&#8592; All Categories</button>' +
      '  <span style="font-weight:700;font-size:1rem;color:var(--danger);flex:1;">Uncategorized (' + uncategorized.length + ')</span>' +
      '  <button class="btn btn-danger btn-sm" onclick="deleteAllUncategorized()">Delete All</button>' +
      '</div>'

    if (uncategorized.length === 0) {
      html += '<div class="empty-state"><p>No uncategorized products.</p></div>'
      container.innerHTML = html
      return
    }

    html +=
      '<div class="table-wrapper">' +
      '  <table class="data-table">' +
      '    <thead><tr>' +
      '      <th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Actions</th>' +
      '    </tr></thead><tbody>'

    uncategorized.forEach(function (p) {
      var imgs = p.images || []
      var imgHtml = '<span style="color:var(--outline);font-size:18px;">&#128247;</span>'
      if (imgs.length > 0) {
        imgHtml = '<img src="' + escapeHtml(imgs[0]) + '" style="width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid var(--outline-variant);" onerror="this.style.display=\'none\'" />'
      }
      var encName = escapeHtml(p.name).replace(/'/g, "\\'")
      html += '<tr>' +
        '<td>' + imgHtml + '</td>' +
        '<td style="font-weight:600;max-width:200px;">' + escapeHtml(p.name) + '</td>' +
        '<td style="color:var(--danger);">' + escapeHtml(p.category || '—') + '</td>' +
        '<td>' + escapeHtml(p.brand || '—') + '</td>' +
        '<td>&#8377;' + escapeHtml(String(p.price || '').replace(/^₹\s*/, '') || '—') + '</td>' +
        '<td class="actions">' +
        '  <button class="btn btn-outline btn-sm" onclick="showEditProductForm(\'' + encName + '\')">Edit</button>' +
        '  <button class="btn btn-danger btn-sm" onclick="deleteProduct(\'' + encName + '\')">Delete</button>' +
        '</td></tr>'
    })

    html += '</tbody></table></div>'
    container.innerHTML = html
  })
}

function deleteAllUncategorized() {
  var validCatIds = {}
  db.collection('categories').get().then(function (snap) {
    snap.forEach(function (doc) { var d = doc.data(); validCatIds[d.id || doc.id] = true })

    var toDelete = _allProducts.filter(function (p) { return !p.category || !validCatIds[p.category] })
    if (toDelete.length === 0) { showToast('No uncategorized products', 'info'); return }
    if (!confirm('Permanently DELETE all ' + toDelete.length + ' uncategorized products?')) return

    var batch = db.batch()
    var count = 0
    toDelete.forEach(function (p) {
      if (p._id) { batch.delete(db.collection('products').doc(p._id)); count++ }
    })
    if (count === 0) { showToast('No products with valid IDs to delete', 'info'); return }
    batch.commit().then(function () {
      showToast('Deleted ' + count + ' uncategorized products', 'success')
    }).catch(function (err) {
      showToast('Error: ' + err.message, 'error')
    })
  })
}

function showAddProductForm(categoryId) {
  var tallyData = ''
  if (_tallyNames.length > 0) {
    tallyData = _tallyNames.map(function (n) { return escapeHtml(n) }).join('|')
  }

  var body =
    '<div class="form-with-preview">' +
    '  <div class="form-with-preview-form">' +
    '    <form id="product-form" autocomplete="off">' +
    '      <div class="field"><label>Product Name (search Tally list) *</label>' +
    '        <div class="searchable-select" style="position:relative;">' +
    '          <input type="text" id="pf-name" placeholder="Type to search Tally products..." oninput="onTallySearch(this)" onblur="onTallyBlur(this)" onfocus="onTallyFocus(this)" style="width:100%;" />' +
    '          <div id="pf-name-dropdown" style="position:absolute;top:100%;left:0;right:0;max-height:200px;overflow-y:auto;background:white;border:1px solid var(--outline-variant);border-radius:8px;z-index:100;display:none;box-shadow:0 4px 12px rgba(0,0,0,0.1);"></div>' +
    '        </div>' +
    '        <input type="hidden" id="tally-data" value="' + tallyData + '" />' +
    '      </div>' +
    '      <div class="field"><label>Brand</label><input type="text" id="pf-brand" oninput="refreshAddPreview()" /></div>' +
    '      <div class="field"><label>Category</label><input type="text" id="pf-category" value="' + escapeHtml(categoryId) + '" readonly style="background:var(--surface-variant);color:var(--on-surface-variant);" /></div>' +
    '      <div class="field"><label>Price (display text)</label><div style="display:flex;align-items:center;gap:4px;"><span style="font-size:1rem;font-weight:600;color:var(--on-surface);">&#8377;</span><input type="text" id="pf-price" oninput="refreshAddPreview()" placeholder="54,990" style="flex:1;" /></div></div>' +
    '      <div class="field"><label>Description</label><textarea id="pf-desc" rows="2" oninput="refreshAddPreview()" placeholder="Brief product description"></textarea></div>' +
    '      <div class="field">' +
    '        <label>Product Images * (max 5, at least 1)</label>' +
    '        <input type="file" id="pf-images" accept="image/*" multiple onchange="previewProductImages(event)" />' +
    '        <div id="pf-images-preview" class="images-preview-grid"></div>' +
    '      </div>' +
    '      <div class="field"><label><input type="checkbox" id="pf-featured" onchange="refreshAddPreview()" /> Show in Featured on homepage</label></div>' +
    '    </form>' +
    '  </div>' +
    '  <div class="form-with-preview-preview">' +
    '    <div style="font-size:11px;font-weight:600;color:var(--on-surface-variant);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">Live Preview</div>' +
    '    <div id="add-preview-container">' + renderPreviewCard({ name: '', brand: '', price: '', description: '', featured: false }) + '</div>' +
    '  </div>' +
    '</div>'

  openModal('Add Product to ' + escapeHtml(categoryId), body,
    '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveNewProduct(\'' + escapeHtml(categoryId).replace(/'/g, "\\'") + '\')">Save Product</button>'
  )
}

function onTallySearch(input) {
  var dropdown = document.getElementById('pf-name-dropdown')
  var q = input.value.trim().toLowerCase()

  if (!q) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return }

  var names = (document.getElementById('tally-data').value || '').split('|').filter(Boolean)
  var matches = names.filter(function (n) { return n.toLowerCase().indexOf(q) !== -1 }).slice(0, 20)

  if (matches.length === 0) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return }

  dropdown.innerHTML = matches.map(function (n) {
    return '<div style="padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--outline-variant);font-size:0.85rem;" onmousedown="selectTallyName(\'' + n.replace(/'/g, "\\'") + '\')">' + n + '</div>'
  }).join('')
  dropdown.style.display = 'block'
  refreshAddPreview()
}

function onTallyFocus(input) {
  if (input.value.trim()) onTallySearch(input)
}

function onTallyBlur(input) {
  setTimeout(function () {
    var dropdown = document.getElementById('pf-name-dropdown')
    if (dropdown) dropdown.style.display = 'none'
  }, 200)
}

function selectTallyName(name) {
  var input = document.getElementById('pf-name')
  if (input) { input.value = name }
  var dropdown = document.getElementById('pf-name-dropdown')
  if (dropdown) dropdown.style.display = 'none'
  refreshAddPreview()
}

function saveNewProduct(categoryId) {
  var name = document.getElementById('pf-name').value.trim()
  if (!name) { showToast('Product name is required', 'error'); return }

  var alreadyInCategory = {}
  _allProducts.forEach(function (p) {
    if (p.category === categoryId) alreadyInCategory[p.name] = true
  })
  if (alreadyInCategory[name]) {
    showToast('Product "' + name + '" already exists in this category', 'error')
    return
  }

  var brand = document.getElementById('pf-brand').value.trim()
  var price = document.getElementById('pf-price').value.trim()
  var description = document.getElementById('pf-desc').value.trim()
  var featured = document.getElementById('pf-featured').checked
  var files = document.getElementById('pf-images').files

  if (!files || files.length === 0) {
    showToast('At least one product image is required', 'error')
    return
  }

  var btn = document.querySelector('.modal .btn-primary')
  if (btn) { btn.disabled = true; btn.textContent = 'Uploading... (' + files.length + ' images)' }

  var uploads = []
  for (var i = 0; i < files.length; i++) {
    var f = files[i]
    var ref = storage.ref('product_images/' + Date.now() + '_' + Math.random().toString(36).slice(2) + '_' + f.name)
    uploads.push(ref.put(f).then(function (s) { return s.ref.getDownloadURL() }))
  }

  Promise.all(uploads).then(function (urls) {
    return db.collection('products').add({
      name: name,
      brand: brand || '',
      category: categoryId,
      price: price || '',
      description: description || '',
      images: urls,
      is_visible: true,
      featured: featured,
      created_at: new Date().toISOString(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }).then(function () {
    showToast('Product added to ' + escapeHtml(categoryId), 'success')
    document.querySelector('.modal-overlay').remove()
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
    if (btn) { btn.disabled = false; btn.textContent = 'Save Product' }
  })
}

function previewProductImages(e) {
  var files = Array.from(e.target.files)
  var container = document.getElementById('pf-images-preview')
  if (!container) return
  if (files.length > 5) {
    showToast('Maximum 5 images', 'warning')
    e.target.value = ''
    container.innerHTML = ''
    return
  }
  container.innerHTML = ''
  files.forEach(function (file) {
    var reader = new FileReader()
    reader.onload = function (ev) {
      var wrap = document.createElement('div')
      wrap.className = 'image-preview-item'
      wrap.innerHTML = '<img src="' + ev.target.result + '" />'
      container.appendChild(wrap)
    }
    reader.readAsDataURL(file)
  })
}

function refreshAddPreview() {
  var el = document.getElementById('add-preview-container')
  if (!el) return
  var name = document.getElementById('pf-name').value.trim()
  var data = {
    name: name || '',
    brand: (document.getElementById('pf-brand') || {}).value || '',
    price: (document.getElementById('pf-price') || {}).value || '',
    description: (document.getElementById('pf-desc') || {}).value || '',
    images: [],
    featured: (document.getElementById('pf-featured') || {}).checked || false
  }
  el.innerHTML = renderPreviewCard(data)
}

/* ── Preview Card ── */
function renderPreviewCard(data) {
  var img = data.images && data.images.length > 0 ? data.images[0] : ''
  var brandInit = data.brand ? data.brand[0].toUpperCase() : '?'
  var featuredBadge = data.featured
    ? '<span style="position:absolute;top:12px;left:12px;background:#8b1a35;color:white;font-size:10px;font-weight:bold;padding:4px 10px;border-radius:20px;letter-spacing:0.5px;">FEATURED</span>'
    : ''
  var displayPrice = data.price ? '&#8377;' + String(data.price).replace(/^₹\s*/, '') : '—'
  return '<div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);font-family:-apple-system,BlinkMacSystemFont,sans-serif;">' +
    '  <div style="aspect-ratio:4/3;background:linear-gradient(135deg,#e8e0f0,#f0edf2);display:flex;align-items:center;justify-content:center;position:relative;padding:24px;">' +
    (img
      ? '<img src="' + escapeHtml(img) + '" style="max-width:80%;max-height:80%;object-fit:contain;" onerror="this.style.display=\'none\'" />'
      : '<div style="width:80px;height:80px;border-radius:16px;background:rgba(26,63,168,0.08);display:flex;align-items:center;justify-content:center;"><span style="font-size:32px;font-weight:bold;color:#1a3fa8;">' + escapeHtml(brandInit) + '</span></div>'
    ) +
    featuredBadge +
    '  </div>' +
    '  <div style="padding:16px;">' +
    '    <span style="font-size:11px;font-weight:bold;color:#ea5f1e;text-transform:uppercase;letter-spacing:0.5px;">' + escapeHtml(data.brand || '') + '</span>' +
    '    <h3 style="font-size:14px;font-weight:600;color:#1b1b1d;margin:4px 0 6px 0;line-height:1.3;">' + escapeHtml(data.name || '') + '</h3>' +
    (data.description ? '<p style="font-size:12px;color:#666;margin:0 0 8px 0;line-height:1.4;">' + escapeHtml(data.description) + '</p>' : '') +
    '    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #e0dde3;">' +
    '      <span style="font-size:16px;font-weight:bold;color:#001847;">' + displayPrice + '</span>' +
    '      <button style="background:#001847;color:white;border:none;padding:6px 14px;border-radius:12px;font-size:12px;font-weight:600;cursor:default;">Enquire</button>' +
    '    </div>' +
    '  </div>' +
    '</div>'
}

function refreshEditPreview() {
  var el = document.getElementById('edit-preview-container')
  if (!el) return
  var existingContainer = document.getElementById('pf-existing-images')
  var firstExisting = existingContainer ? existingContainer.querySelector('img') : null
  var data = {
    name: (document.getElementById('pf-name') || {}).value || '',
    brand: (document.getElementById('pf-brand') || {}).value || '',
    price: (document.getElementById('pf-price') || {}).value || '',
    description: (document.getElementById('pf-desc') || {}).value || '',
    images: firstExisting && firstExisting.src ? [firstExisting.src] : [],
    featured: (document.getElementById('pf-featured') || {}).checked || false
  }
  el.innerHTML = renderPreviewCard(data)
}

/* ── Edit Product — FIX: use doc.id directly from Firestore query ── */
function showEditProductForm(productName) {
  db.collection('products').where('name', '==', productName).get().then(function (snap) {
    var docRef = null
    var d = null
    if (!snap.empty) {
      snap.forEach(function (s) { docRef = s; d = s.data() })
    }

    var name = d ? d.name : productName
    var brand = d ? (d.brand || '') : ''
    var category = d ? (d.category || '') : ''
    var price = d ? (d.price || '') : ''
    var description = d ? (d.description || '') : ''
    var images = d ? (d.images || (d.image ? [d.image] : [])) : []
    var featured = d ? d.featured === true : false
    // FIX: get docId directly from docRef.id, not from d._id
    var docId = docRef ? docRef.id : ''

    var existingHtml = ''
    images.forEach(function (url) {
      existingHtml += '<div class="image-preview-item">' +
        '<img src="' + escapeHtml(url) + '" onerror="this.style.display=\'none\'" />' +
        '<button type="button" class="image-remove-btn" onclick="removeExistingImage(this)" title="Remove">&times;</button>' +
        '</div>'
    })

    var previewData = { name: name, brand: brand, price: price, description: description, images: images, featured: featured }

    var body =
      '<div class="form-with-preview">' +
      '  <div class="form-with-preview-form">' +
      '    <form id="product-form">' +
      '      <div class="field"><label>Product Name</label><input type="text" id="pf-name" value="' + escapeHtml(name) + '" oninput="refreshEditPreview()" required /></div>' +
      '      <div class="field"><label>Brand</label><input type="text" id="pf-brand" value="' + escapeHtml(brand) + '" oninput="refreshEditPreview()" /></div>' +
      '      <div class="field"><label>Category</label><input type="text" id="pf-category" value="' + escapeHtml(category) + '" readonly style="background:var(--surface-variant);color:var(--on-surface-variant);" /></div>' +
'      <div class="field"><label>Price (display text)</label><div style="display:flex;align-items:center;gap:4px;"><span style="font-size:1rem;font-weight:600;color:var(--on-surface);">&#8377;</span><input type="text" id="pf-price" value="' + escapeHtml(price.replace(/^₹\s*/, '')) + '" oninput="refreshEditPreview()" style="flex:1;" /></div></div>' +
    '      <div class="field"><label>Description</label><textarea id="pf-desc" rows="2" oninput="refreshEditPreview()">' + escapeHtml(description) + '</textarea></div>' +
    '      <div class="field">' +
    '        <label>Product Images (max 5 total)</label>' +
    '        <div id="pf-existing-images" class="images-preview-grid">' + existingHtml + '</div>' +
    '        <input type="file" id="pf-images" accept="image/*" multiple onchange="previewProductImages(event)" style="margin-top:8px;" />' +
    '        <div id="pf-images-preview" class="images-preview-grid" style="margin-top:6px;"></div>' +
    '      </div>' +
    '      <div class="field"><label><input type="checkbox" id="pf-featured" ' + (featured ? 'checked' : '') + ' onchange="refreshEditPreview()" /> Show in Featured on homepage</label></div>' +
    '    </form>' +
    '  </div>' +
    '  <div class="form-with-preview-preview">' +
    '    <div style="font-size:11px;font-weight:600;color:var(--on-surface-variant);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">Live Preview</div>' +
    '    <div id="edit-preview-container">' + renderPreviewCard(previewData) + '</div>' +
    '  </div>' +
    '</div>'

    openModal('Edit: ' + escapeHtml(name), body,
      '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="updateProduct(\'' + escapeHtml(docId) + '\')">Update Product</button>'
    )
  }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
}

function uploadImages(files) {
  var promises = []
  for (var i = 0; i < files.length; i++) {
    var f = files[i]
    // FIX: random suffix
    var ref = storage.ref('product_images/' + Date.now() + '_' + Math.random().toString(36).slice(2) + '_' + f.name)
    promises.push(ref.put(f).then(function (s) { return s.ref.getDownloadURL() }))
  }
  return Promise.all(promises)
}

function updateProduct(docId) {
  var name = document.getElementById('pf-name').value.trim()
  if (!name) { showToast('Product name is required', 'error'); return }
  var brand = document.getElementById('pf-brand').value.trim()
  var category = document.getElementById('pf-category').value.trim()
  var price = document.getElementById('pf-price').value.trim()
  var description = document.getElementById('pf-desc').value.trim()
  var featured = document.getElementById('pf-featured').checked
  var newFiles = document.getElementById('pf-images').files

  var existingContainer = document.getElementById('pf-existing-images')
  var existingImgs = existingContainer ? existingContainer.querySelectorAll('.image-preview-item img') : []
  var currentUrls = []
  existingImgs.forEach(function (img) { if (img.src) currentUrls.push(img.src) })

  var totalCount = currentUrls.length + (newFiles ? newFiles.length : 0)
  if (totalCount === 0) { showToast('At least one product image is required', 'error'); return }
  if (totalCount > 5) { showToast('Maximum 5 images total (have ' + totalCount + ')', 'error'); return }

  var btn = document.querySelector('.modal .btn-primary')
  if (btn) { btn.disabled = true; btn.textContent = 'Saving...' }

  function finalize(urls) {
    var allUrls = currentUrls.concat(urls || [])
    var data = {
      name: name,
      brand: brand || '',
      category: category || '',
      price: price || '',
      description: description || '',
      images: allUrls,
      featured: featured,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }

    if (docId) {
      db.collection('products').doc(docId).update(data).then(function () {
        showToast('Product updated', 'success')
        document.querySelector('.modal-overlay').remove()
      }).catch(function (err) {
        showToast('Error: ' + err.message, 'error')
        if (btn) { btn.disabled = false; btn.textContent = 'Update Product' }
      })
    } else {
      db.collection('products').add(data).then(function () {
        showToast('Product saved', 'success')
        document.querySelector('.modal-overlay').remove()
      }).catch(function (err) {
        showToast('Error: ' + err.message, 'error')
        if (btn) { btn.disabled = false; btn.textContent = 'Update Product' }
      })
    }
  }

  if (newFiles && newFiles.length > 0) {
    uploadImages(newFiles).then(function (urls) { finalize(urls) }).catch(function (err) {
      showToast('Upload error: ' + err.message, 'error')
      if (btn) { btn.disabled = false; btn.textContent = 'Update Product' }
    })
  } else {
    finalize([])
  }
}

function removeExistingImage(btn) {
  btn.parentNode.remove()
}

function deleteProduct(productName) {
  if (!confirm('Are you sure you want to delete "' + productName + '"?')) return
  db.collection('products').where('name', '==', productName).get().then(function (snap) {
    var promises = []
    snap.forEach(function (doc) { promises.push(doc.ref.delete()) })
    return Promise.all(promises)
  }).then(function () {
    showToast('Product deleted', 'success')
  }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
}

function toggleProductFeatured(productName, isFeatured) {
  db.collection('products').where('name', '==', productName).get().then(function (snap) {
    if (snap.empty) {
      db.collection('products').add({ name: productName, featured: isFeatured, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
        .then(function () { showToast(isFeatured ? 'Product featured' : 'Removed from featured', 'success') })
        .catch(function (err) { showToast('Error: ' + err.message, 'error') })
    } else {
      var promises = []
      snap.forEach(function (doc) {
        promises.push(doc.ref.update({ featured: isFeatured, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }))
      })
      Promise.all(promises).then(function () {
        showToast(isFeatured ? 'Product featured on homepage' : 'Removed from featured', 'success')
      }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
    }
  }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
}
