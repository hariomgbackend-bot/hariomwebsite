/* ═══════════════════════════════════════════
   Website Categories Module
   CRUD for Firestore 'categories' collection
   ═══════════════════════════════════════════ */

var catsUnsubscribe = null
var _seeding = false

var CATEGORY_ICONS = ['tv', 'ac', 'fridge', 'washing', 'mobile', 'tablet', 'laptop', 'audio', 'kitchen', 'industrial', 'flour', 'small']

var DEFAULT_CATEGORIES = [
  { id: 'televisions', name: 'Televisions', nameHi: 'टेलीविजन', nameMr: 'टेलिव्हिजन', description: 'LED, OLED, QLED, 4K and Smart TVs from top brands', descriptionHi: 'शीर्ष ब्रांडों से LED, OLED, QLED, 4K और स्मार्ट टीवी', descriptionMr: 'शीर्ष ब्रँडकडून LED, OLED, QLED, 4K आणि स्मार्ट टीव्ही', icon: 'tv', order: 1 },
  { id: 'air-conditioners', name: 'Air Conditioners', nameHi: 'एयर कंडीशनर', nameMr: 'एअर कंडिशनर्स', description: 'Split, window, inverter, and smart ACs for every room', descriptionHi: 'हर कमरे के लिए स्प्लिट, विंडो, इन्वर्टर और स्मार्ट AC', descriptionMr: 'प्रत्येक खोलीसाठी स्प्लिट, विंडो, इन्व्हर्टर आणि स्मार्ट AC', icon: 'ac', order: 2 },
  { id: 'refrigerators', name: 'Refrigerators', nameHi: 'रेफ्रिजरेटर', nameMr: 'रेफ्रिजरेटर्स', description: 'Single door, double door, side-by-side, and French door refrigerators', descriptionHi: 'सिंगल डोर, डबल डोर, साइड-बाय-साइड और फ्रेंच डोर रेफ्रिजरेटर', descriptionMr: 'सिंगल डोर, डबल डोर, साइड-बाय-साइड आणि फ्रेंच डोर रेफ्रिजरेटर्स', icon: 'fridge', order: 3 },
  { id: 'washing-machines', name: 'Washing Machines', nameHi: 'वॉशिंग मशीन', nameMr: 'वॉशिंग मशिन्स', description: 'Front load, top load, semi-automatic, and fully automatic washers', descriptionHi: 'फ्रंट लोड, टॉप लोड, सेमी-ऑटोमैटिक और फुली ऑटोमैटिक वॉशर', descriptionMr: 'फ्रंट लोड, टॉप लोड, सेमी-ऑटोमॅटिक आणि फुली ऑटोमॅटिक वॉशर्स', icon: 'washing', order: 4 },
  { id: 'mobile-phones', name: 'Mobile Phones', nameHi: 'मोबाइल फोन', nameMr: 'मोबाइल फोन', description: 'Smartphones and feature phones from all leading brands', descriptionHi: 'सभी प्रमुख ब्रांडों के स्मार्टफोन और फीचर फोन', descriptionMr: 'सर्व प्रमुख ब्रँडचे स्मार्टफोन आणि फीचर फोन', icon: 'mobile', order: 5 },
  { id: 'tablets', name: 'Tablets', nameHi: 'टैबलेट', nameMr: 'टॅब्लेट', description: 'Tablets for work, study, and entertainment', descriptionHi: 'काम, पढ़ाई और मनोरंजन के लिए टैबलेट', descriptionMr: 'काम, अभ्यास आणि मनोरंजनासाठी टॅब्लेट', icon: 'tablet', order: 6 },
  { id: 'laptops', name: 'Laptops', nameHi: 'लैपटॉप', nameMr: 'लॅपटॉप', description: 'Laptops for home, business, gaming, and education', descriptionHi: 'घर, व्यवसाय, गेमिंग और शिक्षा के लिए लैपटॉप', descriptionMr: 'घर, व्यवसाय, गेमिंग आणि शिक्षणासाठी लॅपटॉप', icon: 'laptop', order: 7 },
  { id: 'audio-systems', name: 'Audio Systems', nameHi: 'ऑडियो सिस्टम', nameMr: 'ऑडिओ सिस्टम्स', description: 'Home theatres, soundbars, speakers, and music systems', descriptionHi: 'होम थिएटर, साउंडबार, स्पीकर और म्यूजिक सिस्टम', descriptionMr: 'होम थिएटर, साउंडबार, स्पीकर आणि म्युझिक सिस्टम्स', icon: 'audio', order: 8 },
  { id: 'kitchen-appliances', name: 'Kitchen Appliances', nameHi: 'रसोई उपकरण', nameMr: 'स्वयंपाकघर उपकरणे', description: 'Microwaves, mixers, grinders, ovens, and more', descriptionHi: 'माइक्रोवेव, मिक्सर, ग्राइंडर, ओवन और अधिक', descriptionMr: 'मायक्रोवेव्ह, मिक्सर, ग्राइंडर, ओव्हन आणि अधिक', icon: 'kitchen', order: 9 },
  { id: 'industrial-appliances', name: 'Industrial Appliances', nameHi: 'औद्योगिक उपकरण', nameMr: 'औद्योगिक उपकरणे', description: 'Professional kitchen and commercial-grade equipment', descriptionHi: 'पेशेवर रसोई और व्यावसायिक-ग्रेड उपकरण', descriptionMr: 'व्यावसायिक स्वयंपाकघर आणि व्यावसायिक-ग्रेड उपकरणे', icon: 'industrial', order: 10 },
  { id: 'atta-chakki', name: 'Atta Chakki / Flour Mills', nameHi: 'आटा चक्की / फ्लोर मिल', nameMr: 'पीठ दळणारी यंत्रे / फ्लोर मिल', description: 'Domestic and commercial flour mills for fresh atta', descriptionHi: 'ताजा आटा के लिए घरेलू और व्यावसायिक आटा चक्की', descriptionMr: 'ताजे पीठासाठी घरगुती आणि व्यावसायिक पीठ दळणारी यंत्रे', icon: 'flour', order: 11 },
  { id: 'small-appliances', name: 'Small Appliances', nameHi: 'छोटे उपकरण', nameMr: 'लहान उपकरणे', description: 'Irons, fans, mixers, blenders, and everyday essentials', descriptionHi: 'आयरन, पंखे, मिक्सर, ब्लेंडर और रोजमर्रा की जरूरी चीजें', descriptionMr: 'इस्त्री, पंखे, मिक्सर, ब्लेंडर आणि रोजच्या आवश्यक वस्तू', icon: 'small', order: 12 }
]

function seedCategories() {
  if (_seeding) return
  _seeding = true
  var batch = db.batch()
  DEFAULT_CATEGORIES.forEach(function (cat) {
    var ref = db.collection('categories').doc()
    batch.set(ref, cat)
  })
  batch.commit().then(function () {
    _seeding = false
  }).catch(function (err) {
    _seeding = false
    console.error('Seed error:', err)
  })
}

function renderCategories() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Website Categories</h1>' +
    '    <p>Manage categories shown on the public website</p>' +
    '  </div>' +
    '  <button class="btn btn-primary" onclick="showAddCategoryForm()">+ Add Category</button>' +
    '</div>' +
    '<div id="categories-table"></div>'

  loadCategories()
}

function loadCategories() {
  if (catsUnsubscribe) catsUnsubscribe()

  catsUnsubscribe = db.collection('categories')
    .orderBy('order', 'asc')
    .onSnapshot(function (snapshot) {
      var rows = []
      snapshot.forEach(function (doc) {
        var d = doc.data()
        d._id = doc.id
        rows.push(d)
      })

      if (rows.length === 0 && !_seeding) {
        seedCategories()
        return
      }

      renderTable('categories-table', [
        { label: 'Order', key: 'order', render: function (v) { return v || '—' } },
        { label: 'ID (slug)', key: 'id' },
        { label: 'Name', key: 'name' },
        { label: 'Icon', key: 'icon', render: function (v) { return v || '—' } },
        { label: 'Description', key: 'description', render: function (v) { return v ? escapeHtml(v).slice(0, 50) + '…' : '—' } }
      ], rows, function (row) {
        var id = escapeHtml(row._id)
        return '<button class="btn btn-outline btn-sm" onclick="showEditCategoryForm(\'' + id + '\')">Edit</button>' +
          '<button class="btn btn-danger btn-sm" onclick="deleteCategory(\'' + id + '\')">Delete</button>'
      })
    }, function (error) {
      document.getElementById('categories-table').innerHTML =
        '<div class="empty-state"><p style="color:var(--danger)">Error: ' + error.message + '</p></div>'
    })
}

function iconOptions(selected) {
  var opts = '<option value="">— Select icon —</option>'
  CATEGORY_ICONS.forEach(function (ic) {
    var sel = ic === selected ? ' selected' : ''
    opts += '<option value="' + ic + '"' + sel + '>' + ic + '</option>'
  })
  return opts
}

function getCategoryFormHtml(data) {
  data = data || {}
  return '<form id="category-form">' +
    '  <div class="field"><label>Category ID (slug) *</label><input type="text" id="cf-id" value="' + escapeHtml(data.id || '') + '" required placeholder="e.g. televisions" /></div>' +
    '  <div class="field"><label>Name (English) *</label><input type="text" id="cf-name" value="' + escapeHtml(data.name || '') + '" required /></div>' +
    '  <div class="field"><label>Name (Hindi)</label><input type="text" id="cf-name-hi" value="' + escapeHtml(data.nameHi || '') + '" /></div>' +
    '  <div class="field"><label>Name (Marathi)</label><input type="text" id="cf-name-mr" value="' + escapeHtml(data.nameMr || '') + '" /></div>' +
    '  <div class="field"><label>Description (English)</label><textarea id="cf-desc" rows="2">' + escapeHtml(data.description || '') + '</textarea></div>' +
    '  <div class="field"><label>Description (Hindi)</label><textarea id="cf-desc-hi" rows="2">' + escapeHtml(data.descriptionHi || '') + '</textarea></div>' +
    '  <div class="field"><label>Description (Marathi)</label><textarea id="cf-desc-mr" rows="2">' + escapeHtml(data.descriptionMr || '') + '</textarea></div>' +
    '  <div class="field"><label>Icon</label><select id="cf-icon">' + iconOptions(data.icon) + '</select></div>' +
    '  <div class="field"><label>Display Order</label><input type="number" id="cf-order" value="' + (data.order || '0') + '" min="0" /></div>' +
    '</form>'
}

function showAddCategoryForm() {
  openModal('Add Category', getCategoryFormHtml(),
    '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveNewCategory()">Save Category</button>'
  )
}

function saveNewCategory() {
  var id = document.getElementById('cf-id').value.trim()
  if (!id) { showToast('Category ID is required', 'error'); return }
  var name = document.getElementById('cf-name').value.trim()
  if (!name) { showToast('Category name is required', 'error'); return }

  db.collection('categories').add({
    id: id,
    name: name,
    nameHi: document.getElementById('cf-name-hi').value.trim() || '',
    nameMr: document.getElementById('cf-name-mr').value.trim() || '',
    description: document.getElementById('cf-desc').value.trim() || '',
    descriptionHi: document.getElementById('cf-desc-hi').value.trim() || '',
    descriptionMr: document.getElementById('cf-desc-mr').value.trim() || '',
    icon: document.getElementById('cf-icon').value || '',
    order: parseInt(document.getElementById('cf-order').value) || 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function () {
    showToast('Category added', 'success')
    document.querySelector('.modal-overlay').remove()
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function showEditCategoryForm(docId) {
  db.collection('categories').doc(docId).get().then(function (doc) {
    if (!doc.exists) { showToast('Category not found', 'error'); return }
    var d = doc.data()

    openModal('Edit Category', getCategoryFormHtml(d),
      '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="updateCategory(\'' + docId + '\')">Update Category</button>'
    )
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function updateCategory(docId) {
  var id = document.getElementById('cf-id').value.trim()
  if (!id) { showToast('Category ID is required', 'error'); return }
  var name = document.getElementById('cf-name').value.trim()
  if (!name) { showToast('Category name is required', 'error'); return }

  db.collection('categories').doc(docId).update({
    id: id,
    name: name,
    nameHi: document.getElementById('cf-name-hi').value.trim() || '',
    nameMr: document.getElementById('cf-name-mr').value.trim() || '',
    description: document.getElementById('cf-desc').value.trim() || '',
    descriptionHi: document.getElementById('cf-desc-hi').value.trim() || '',
    descriptionMr: document.getElementById('cf-desc-mr').value.trim() || '',
    icon: document.getElementById('cf-icon').value || '',
    order: parseInt(document.getElementById('cf-order').value) || 0
  }).then(function () {
    showToast('Category updated', 'success')
    document.querySelector('.modal-overlay').remove()
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function deleteCategory(docId) {
  if (!confirm('Delete this category permanently? Products in this category will become uncategorised.')) return
  db.collection('categories').doc(docId).delete().then(function () {
    showToast('Category deleted', 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}
