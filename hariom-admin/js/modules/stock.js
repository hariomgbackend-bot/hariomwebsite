var stockUnsubscribe = null
var _allStockRows = []
var _cachedCategories = []

var _DEFAULT_CATEGORIES = [
  { id: 'televisions', name: 'Televisions' },
  { id: 'air-conditioners', name: 'Air Conditioners' },
  { id: 'refrigerators', name: 'Refrigerators' },
  { id: 'washing-machines', name: 'Washing Machines' },
  { id: 'mobile-phones', name: 'Mobile Phones' },
  { id: 'tablets', name: 'Tablets' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'audio-systems', name: 'Audio Systems' },
  { id: 'kitchen-appliances', name: 'Kitchen Appliances' },
  { id: 'industrial-appliances', name: 'Industrial Appliances' },
  { id: 'atta-chakki', name: 'Atta Chakki / Flour Mills' },
  { id: 'small-appliances', name: 'Small Appliances' }
]

function categoryOptions(selected) {
  var cats = _cachedCategories.length > 0 ? _cachedCategories : _DEFAULT_CATEGORIES
  var opts = '<option value="">— Select website category —</option>'
  cats.forEach(function (c) {
    var sel = c.id === selected ? ' selected' : ''
    opts += '<option value="' + c.id + '"' + sel + '>' + escapeHtml(c.name) + '</option>'
  })
  return opts
}

function loadCategoryCache() {
  db.collection('categories').orderBy('order', 'asc').get().then(function (snap) {
    var cats = []
    snap.forEach(function (doc) {
      var d = doc.data()
      cats.push({ id: d.id || doc.id, name: d.name })
    })
    if (cats.length > 0) _cachedCategories = cats
  }).catch(function () {})
}

function renderStock() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Stock &amp; Pricing</h1>' +
    '    <p>Names synced from Tally · add price, images &amp; go live</p>' +
    '  </div>' +
    '  <div class="flex gap-2" style="flex-wrap:wrap;">' +
    '    <button class="btn btn-outline btn-sm" id="btn-visible-all" onclick="bulkVisibility(true, this)">&#10003; Visible All</button>' +
    '    <button class="btn btn-outline btn-sm" id="btn-invisible-all" onclick="bulkVisibility(false, this)">&#10007; Invisible All</button>' +
    '    <button class="btn btn-outline btn-sm" onclick="showAddCategoryFromStock()">+ Add Category</button>' +
    '    <button class="btn btn-primary" onclick="showAddProductForm()">+ Add Product</button>' +
    '  </div>' +
    '</div>' +
    '<div class="table-controls" style="display:flex;align-items:center;gap:10px;">' +
    '  <input type="text" id="stock-search" placeholder="Search products, brands, categories..." oninput="filterStockTable()" />' +
    '  <span id="stock-result-count" class="text-muted" style="font-size:0.8rem;white-space:nowrap;"></span>' +
    '</div>' +
    '<div id="stock-table"></div>'

  loadCategoryCache()
  loadStock()
}

function loadStock() {
  if (stockUnsubscribe) stockUnsubscribe()

  stockUnsubscribe = db.collection('products')
    .onSnapshot(function (snapshot) {
      var enrichment = {}
      snapshot.forEach(function (doc) {
        var d = doc.data()
        d._id = doc.id
        enrichment[d.name] = d
      })

      // FIX: tally_products is now in Firestore rules — if doc missing, gracefully show enriched products only
      db.collection('tally_products').doc('index').get().then(function (tallyDoc) {
        var names = []
        if (tallyDoc.exists) {
          names = tallyDoc.data().names || []
        }

        var seen = {}
        var rows = []

        names.forEach(function (n) {
          var e = enrichment[n] || {}
          rows.push({
            _id: e._id || '',
            name: n,
            brand: e.brand || '',
            category: e.category || '',
            price: e.price || '',
            description: e.description || '',
            images: e.images || (e.image ? [e.image] : []),
            is_visible: e.is_visible !== false,
            featured: e.featured === true,
            updatedAt: e.updatedAt || null,
            created_at: e.created_at || ''
          })
          seen[n] = true
        })

        // Also include any products in Firestore not in Tally index
        Object.keys(enrichment).forEach(function (n) {
          if (!seen[n]) {
            var e = enrichment[n]
            rows.push({
              _id: e._id,
              name: n,
              brand: e.brand || '',
              category: e.category || '',
              price: e.price || '',
              description: e.description || '',
              images: e.images || (e.image ? [e.image] : []),
              is_visible: e.is_visible !== false,
              featured: e.featured === true,
              updatedAt: e.updatedAt || null,
              created_at: e.created_at || ''
            })
          }
        })

        _allStockRows = rows
        renderStockTable(rows)
      }).catch(function (err) {
        // tally_products/index missing — just show enrichment data
        var rows = []
        Object.keys(enrichment).forEach(function (n) {
          var e = enrichment[n]
          rows.push({
            _id: e._id,
            name: n,
            brand: e.brand || '',
            category: e.category || '',
            price: e.price || '',
            description: e.description || '',
            images: e.images || (e.image ? [e.image] : []),
            is_visible: e.is_visible !== false,
            featured: e.featured === true,
            updatedAt: e.updatedAt || null,
            created_at: e.created_at || ''
          })
        })
        _allStockRows = rows
        renderStockTable(rows)

        if (rows.length === 0) {
          var el = document.getElementById('stock-table')
          if (el) el.innerHTML =
            '<div class="empty-state">' +
            '<div style="font-size:2rem;margin-bottom:8px;">📦</div>' +
            '<p style="font-weight:600;color:var(--brand-700);">No Tally products synced yet</p>' +
            '<p style="font-size:0.8rem;margin-top:4px;">Create a document <code>tally_products/index</code> in Firestore with a <code>names</code> array of your Tally item names, or add products manually using the button above.</p>' +
            '</div>'
        }
      })
    }, function (error) {
      document.getElementById('stock-table').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error loading products: ' + error.message + '</p></div>'
    })
}

function getProductFirstWord(name) {
  if (!name) return '?'
  var first = name.trim().split(/\s+/)[0]
  return first ? first.toUpperCase() : '?'
}

function filterStockTable() {
  var q = document.getElementById('stock-search').value.trim().toLowerCase()
  if (!q) { renderStockTable(_allStockRows); return }
  var filtered = _allStockRows.filter(function (r) {
    return (r.name && r.name.toLowerCase().indexOf(q) !== -1) ||
           (r.brand && r.brand.toLowerCase().indexOf(q) !== -1) ||
           (r.category && r.category.toLowerCase().indexOf(q) !== -1)
  })
  renderStockTable(filtered)
}

// FIX: group by actual category field first, fall back to first word
function groupByCategory(rows) {
  var groups = {}
  rows.forEach(function (r) {
    // Use the mapped website category if set, otherwise fall back to first word of product name
    var cat = r.category ? r.category : getProductFirstWord(r.name)
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(r)
  })
  var sorted = Object.keys(groups).sort()
  var result = []
  sorted.forEach(function (k) {
    result.push({ category: k, products: groups[k] })
  })
  return result
}

function renderStockTable(rows) {
  var container = document.getElementById('stock-table')
  var countEl = document.getElementById('stock-result-count')
  if (!container) return

  var groups = groupByCategory(rows)
  var total = rows.length

  if (countEl) {
    countEl.textContent = total + ' product' + (total !== 1 ? 's' : '') +
      ' in ' + groups.length + ' categor' + (groups.length !== 1 ? 'ies' : 'y')
  }

  if (total === 0) {
    container.innerHTML = '<div class="empty-state"><p>No products match your search.</p></div>'
    return
  }

  var html = '<div class="category-tile-grid">'

  groups.forEach(function (g) {
    var catLabel = g.category
    var catCount = g.products.length
    var visibleCount = g.products.filter(function (p) { return p.is_visible !== false }).length
    var firstImg = ''
    for (var i = 0; i < g.products.length; i++) {
      var imgs = g.products[i].images || []
      if (imgs.length > 0) { firstImg = imgs[0]; break }
    }

    var encLabel = escapeHtml(catLabel).replace(/'/g, "\\'")

    html +=
      '<div class="category-tile" data-cat="' + escapeHtml(catLabel) + '">' +
      '  <div style="position:absolute;top:6px;right:6px;display:flex;gap:4px;">' +
      '    <button class="category-tile-btn" onclick="event.stopPropagation();renameCategory(\'' + encLabel + '\')" title="Rename">&#9998;</button>' +
      '    <button class="category-tile-del" onclick="event.stopPropagation();deleteCategoryGroup(\'' + encLabel + '\')" title="Delete all">&#10005;</button>' +
      '  </div>' +
      '  <div class="category-tile-icon">' +
      (firstImg ? '<img src="' + escapeHtml(firstImg) + '" style="width:36px;height:36px;object-fit:cover;border-radius:8px;" onerror="this.style.display=\'none\'" />' : '&#128193;') +
      '  </div>' +
      '  <div class="category-tile-name">' + escapeHtml(catLabel) + '</div>' +
      '  <div class="category-tile-count">' + catCount + ' product' + (catCount !== 1 ? 's' : '') + '</div>' +
      '  <div class="category-tile-vis">' + visibleCount + ' visible</div>' +
      '</div>'
  })

  html += '</div>'
  container.innerHTML = html

  Array.from(container.querySelectorAll('.category-tile')).forEach(function (el) {
    el.addEventListener('click', function () {
      showCategoryView(el.getAttribute('data-cat'))
    })
  })
}

function deleteCategoryGroup(category) {
  showToast('Finding products in "' + category + '"...', 'info')
  db.collection('products').get().then(function (snap) {
    var batch = db.batch()
    var matched = 0
    snap.forEach(function (doc) {
      var d = doc.data()
      var cat = d.category ? d.category : getProductFirstWord(d.name || '')
      if (cat === category) { batch.delete(doc.ref); matched++ }
    })
    if (matched === 0) {
      showToast('No Firestore documents found in "' + category + '"', 'info')
      return
    }
    if (!confirm('Permanently DELETE ' + matched + ' product' + (matched !== 1 ? 's' : '') + ' in "' + category + '"?')) return
    batch.commit().then(function () {
      showToast('Deleted ' + matched + ' product' + (matched !== 1 ? 's' : '') + ' from "' + category + '"', 'success')
    }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
  }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
}

function renameCategory(category) {
  var newWord = prompt('New name for category "' + category + '":', category)
  if (!newWord || newWord.trim() === '') return
  newWord = newWord.trim()

  db.collection('products').get().then(function (snap) {
    var batch = db.batch()
    var updated = 0
    snap.forEach(function (doc) {
      var d = doc.data()
      var cat = d.category ? d.category : getProductFirstWord(d.name || '')
      if (cat === category) {
        batch.update(doc.ref, { category: newWord, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
        updated++
      }
    })
    if (updated === 0) { showToast('No products found in "' + category + '"', 'info'); return }
    batch.commit().then(function () {
      showToast('Renamed ' + updated + ' products from "' + category + '" to "' + newWord + '"', 'success')
    }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
  }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
}

// FIX: renamed to avoid clash with categories.js showAddCategoryForm
function showAddCategoryFromStock() {
  var newWord = prompt('Enter a name for the new category:', '')
  if (!newWord || newWord.trim() === '') return
  newWord = newWord.trim()

  db.collection('products').add({
    name: newWord + ' Product',
    brand: '',
    category: newWord,
    price: '',
    description: '',
    images: [],
    is_visible: true,
    featured: false,
    created_at: new Date().toISOString(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function () {
    showToast('Category "' + newWord + '" created. Edit the product to add details.', 'success')
  }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
}

function showCategoryView(category) {
  var container = document.getElementById('stock-table')
  var countEl = document.getElementById('stock-result-count')
  if (!container) return

  var catProducts = _allStockRows.filter(function (r) {
    var cat = r.category ? r.category : getProductFirstWord(r.name)
    return cat === category
  })

  if (catProducts.length === 0) { renderStockTable(_allStockRows); return }
  if (countEl) countEl.textContent = catProducts.length + ' product' + (catProducts.length !== 1 ? 's' : '') + ' in ' + escapeHtml(category)

  var html =
    '<div style="margin-bottom:14px;display:flex;align-items:center;gap:10px;">' +
    '  <button class="btn btn-outline btn-sm" onclick="renderStockTable(_allStockRows)">&#8592; All Categories</button>' +
    '  <span style="font-weight:700;font-size:1rem;color:var(--brand-800);">' + escapeHtml(category) + '</span>' +
    '</div>' +
    '<div class="table-wrapper">' +
    '  <table class="data-table">' +
    '    <thead><tr>' +
    '      <th>Image</th><th>Name</th><th>Brand</th><th>Price</th><th>Visible</th><th>Featured</th><th>Updated</th>' +
    '      <th class="text-right">Actions</th>' +
    '    </tr></thead><tbody>'

  catProducts.forEach(function (r) {
    var imgs = r.images || []
    var imgHtml = '<span style="color:var(--outline);font-size:18px;">&#128247;</span>'
    if (imgs.length > 0) {
      imgHtml = '<div style="display:flex;gap:4px;align-items:center;">' +
        '<img src="' + escapeHtml(imgs[0]) + '" style="width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid var(--outline-variant);" onerror="this.style.display=\'none\'" />'
      if (imgs.length > 1) imgHtml += '<span style="font-size:10px;color:var(--on-surface-variant);font-weight:600;">+' + (imgs.length - 1) + '</span>'
      imgHtml += '</div>'
    }

    var visHtml = '<label class="switch"><input type="checkbox" ' + (r.is_visible !== false ? 'checked' : '') +
      ' onchange="toggleProductVisibility(\'' + escapeHtml(r.name) + '\', this.checked)" />' +
      '<span class="slider"></span></label>'

    var featHtml = '<label class="switch"><input type="checkbox" ' + (r.featured === true ? 'checked' : '') +
      ' onchange="toggleProductFeatured(\'' + escapeHtml(r.name) + '\', this.checked)" />' +
      '<span class="slider"></span></label>'

    var updated = r.updatedAt ? new Date(r.updatedAt.seconds * 1000).toLocaleDateString('en-IN') : '—'
    var encName = escapeHtml(r.name).replace(/'/g, "\\'")

    html += '<tr>' +
      '<td>' + imgHtml + '</td>' +
      '<td style="font-weight:600;max-width:240px;">' + escapeHtml(r.name) + '</td>' +
      '<td>' + escapeHtml(r.brand || '—') + '</td>' +
      '<td><span class="price">' + escapeHtml(r.price || '—') + '</span></td>' +
      '<td>' + visHtml + '</td>' +
      '<td>' + featHtml + '</td>' +
      '<td style="font-size:0.78rem;color:var(--on-surface-variant);">' + updated + '</td>' +
      '<td class="actions">' +
      '  <button class="btn btn-outline btn-sm" onclick="showProductPreview(\'' + encName + '\')">Preview</button>' +
      '  <button class="btn btn-outline btn-sm" onclick="showEditProductForm(\'' + encName + '\')">Edit</button>' +
      '  <button class="btn btn-danger btn-sm" onclick="deleteProduct(\'' + encName + '\')">Delete</button>' +
      '</td></tr>'
  })

  html += '</tbody></table></div>'
  container.innerHTML = html
}

/* ── Bulk Visibility — FIX: pass button element directly ── */
function bulkVisibility(visible, btnEl) {
  var label = visible ? 'visible' : 'hidden'
  if (!confirm('Set ALL products as ' + label + ' on the website?')) return

  if (btnEl) { btnEl.disabled = true; btnEl.textContent = 'Updating...' }

  var pending = []
  var productsRef = db.collection('products')

  _allStockRows.forEach(function (row) {
    if (row._id) {
      pending.push(productsRef.doc(row._id).update({
        is_visible: visible,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }))
    } else {
      pending.push(productsRef.add({
        name: row.name,
        is_visible: visible,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }))
    }
  })

  if (pending.length === 0) { showToast('No products to update', 'info'); return }

  Promise.all(pending).then(function () {
    showToast('All products set to ' + label, 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  }).finally(function () {
    if (btnEl) { btnEl.disabled = false; btnEl.textContent = visible ? '✓ Visible All' : '✗ Invisible All' }
  })
}

/* ── Preview Card ── */
function renderPreviewCard(data) {
  var img = data.images && data.images.length > 0 ? data.images[0] : ''
  var brandInit = data.brand ? data.brand[0].toUpperCase() : '?'
  // FIX: only show FEATURED badge if actually featured
  var featuredBadge = data.featured
    ? '<span style="position:absolute;top:12px;left:12px;background:#8b1a35;color:white;font-size:10px;font-weight:bold;padding:4px 10px;border-radius:20px;letter-spacing:0.5px;">FEATURED</span>'
    : ''
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
    '      <span style="font-size:16px;font-weight:bold;color:#001847;">' + escapeHtml(data.price || '—') + '</span>' +
    '      <button style="background:#001847;color:white;border:none;padding:6px 14px;border-radius:12px;font-size:12px;font-weight:600;cursor:default;">Enquire</button>' +
    '    </div>' +
    '  </div>' +
    '</div>'
}

function refreshAddPreview() {
  var el = document.getElementById('add-preview-container')
  if (!el) return
  var data = {
    name: (document.getElementById('pf-name') || {}).value || '',
    brand: (document.getElementById('pf-brand') || {}).value || '',
    price: (document.getElementById('pf-price') || {}).value || '',
    description: (document.getElementById('pf-desc') || {}).value || '',
    images: [],
    featured: (document.getElementById('pf-featured') || {}).checked || false
  }
  el.innerHTML = renderPreviewCard(data)
}

function showAddProductForm() {
  var body =
    '<div class="form-with-preview">' +
    '  <div class="form-with-preview-form">' +
    '    <form id="product-form">' +
    '      <div class="field"><label>Product Name *</label><input type="text" id="pf-name" oninput="refreshAddPreview()" required /></div>' +
    '      <div class="field"><label>Brand</label><input type="text" id="pf-brand" oninput="refreshAddPreview()" /></div>' +
    '      <div class="field"><label>Website Category</label><select id="pf-category">' + categoryOptions() + '</select></div>' +
    '      <div class="field"><label>Price (display text)</label><input type="text" id="pf-price" oninput="refreshAddPreview()" placeholder="e.g. ₹54,990" /></div>' +
    '      <div class="field"><label>Description</label><textarea id="pf-desc" rows="2" oninput="refreshAddPreview()" placeholder="Brief product description"></textarea></div>' +
    '      <div class="field">' +
    '        <label>Product Images * (max 5, at least 1)</label>' +
    '        <input type="file" id="pf-images" accept="image/*" multiple onchange="previewProductImages(event)" />' +
    '        <div id="pf-images-preview" class="images-preview-grid"></div>' +
    '      </div>' +
    '      <div class="field"><label><input type="checkbox" id="pf-visible" checked /> Visible on website</label></div>' +
    '      <div class="field"><label><input type="checkbox" id="pf-featured" onchange="refreshAddPreview()" /> Show in Featured on homepage</label></div>' +
    '    </form>' +
    '  </div>' +
    '  <div class="form-with-preview-preview">' +
    '    <div style="font-size:11px;font-weight:600;color:var(--on-surface-variant);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">Live Preview</div>' +
    '    <div id="add-preview-container">' + renderPreviewCard({ name: '', brand: '', price: '', description: '', featured: false }) + '</div>' +
    '  </div>' +
    '</div>'

  openModal('Add Product', body,
    '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveNewProduct()">Save Product</button>'
  )
}

function previewProductImages(e) {
  var files = Array.from(e.target.files)
  var container = document.getElementById('pf-images-preview')
  if (!container) return

  var existingContainer = document.getElementById('pf-existing-images')
  var existingCount = existingContainer ? existingContainer.children.length : 0
  var totalAfter = existingCount + files.length

  if (totalAfter > 5) {
    showToast('Maximum 5 images total (have ' + existingCount + ', selected ' + files.length + ')', 'warning')
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

function saveNewProduct() {
  var name = document.getElementById('pf-name').value.trim()
  if (!name) { showToast('Product name is required', 'error'); return }
  var brand = document.getElementById('pf-brand').value.trim()
  var category = document.getElementById('pf-category').value.trim()
  var price = document.getElementById('pf-price').value.trim()
  var description = document.getElementById('pf-desc').value.trim()
  var visible = document.getElementById('pf-visible').checked
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
    // FIX: use random suffix to avoid timestamp collision
    var ref = storage.ref('product_images/' + Date.now() + '_' + Math.random().toString(36).slice(2) + '_' + f.name)
    uploads.push(ref.put(f).then(function (s) { return s.ref.getDownloadURL() }))
  }

  Promise.all(uploads).then(function (urls) {
    return db.collection('products').add({
      name: name,
      brand: brand || '',
      category: category || '',
      price: price || '',
      description: description || '',
      images: urls,
      is_visible: visible,
      featured: featured,
      created_at: new Date().toISOString(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }).then(function () {
    showToast('Product added with ' + files.length + ' image(s)', 'success')
    document.querySelector('.modal-overlay').remove()
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
    if (btn) { btn.disabled = false; btn.textContent = 'Save Product' }
  })
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
    var visible = d ? d.is_visible !== false : true
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
      '      <div class="field"><label>Website Category</label><select id="pf-category">' + categoryOptions(category) + '</select></div>' +
      '      <div class="field"><label>Price (display text)</label><input type="text" id="pf-price" value="' + escapeHtml(price) + '" oninput="refreshEditPreview()" /></div>' +
      '      <div class="field"><label>Description</label><textarea id="pf-desc" rows="2" oninput="refreshEditPreview()">' + escapeHtml(description) + '</textarea></div>' +
      '      <div class="field">' +
      '        <label>Product Images (max 5 total)</label>' +
      '        <div id="pf-existing-images" class="images-preview-grid">' + existingHtml + '</div>' +
      '        <input type="file" id="pf-images" accept="image/*" multiple onchange="previewProductImages(event)" style="margin-top:8px;" />' +
      '        <div id="pf-images-preview" class="images-preview-grid" style="margin-top:6px;"></div>' +
      '      </div>' +
      '      <div class="field"><label><input type="checkbox" id="pf-visible" ' + (visible ? 'checked' : '') + ' /> Visible on website</label></div>' +
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
  var visible = document.getElementById('pf-visible').checked
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
      is_visible: visible,
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

function toggleProductVisibility(productName, isVisible) {
  db.collection('products').where('name', '==', productName).get().then(function (snap) {
    if (snap.empty) {
      db.collection('products').add({ name: productName, is_visible: isVisible, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
        .then(function () { showToast(isVisible ? 'Product visible' : 'Product hidden', 'success') })
        .catch(function (err) { showToast('Error: ' + err.message, 'error') })
    } else {
      var promises = []
      snap.forEach(function (doc) {
        promises.push(doc.ref.update({ is_visible: isVisible, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }))
      })
      Promise.all(promises).then(function () {
        showToast(isVisible ? 'Product visible on website' : 'Product hidden', 'success')
      }).catch(function (err) { showToast('Error: ' + err.message, 'error') })
    }
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

function showProductPreview(productName) {
  var row = null
  for (var i = 0; i < _allStockRows.length; i++) {
    if (_allStockRows[i].name === productName) { row = _allStockRows[i]; break }
  }
  if (!row) { showToast('Product not found', 'error'); return }

  var body =
    '<div class="preview-frame">' +
    '  <div class="preview-statusbar"><span>9:41</span><span>📶 🔋</span></div>' +
    '  <div class="preview-browser-bar"><span style="color:white;font-size:11px;font-weight:600;">hariomelectronics.com</span></div>' +
    '  <div class="preview-content" style="background:#f5f3f7;padding:16px;">' +
    renderPreviewCard(row) +
    '    <div style="margin-top:12px;text-align:center;font-size:10px;color:#999;">Product card on mobile view</div>' +
    '  </div>' +
    '</div>'

  openModal('Preview — ' + escapeHtml(row.name), body,
    '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Close</button>'
  )
}
