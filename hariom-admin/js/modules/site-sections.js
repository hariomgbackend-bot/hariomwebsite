/* ═══════════════════════════════════════════
   Site Sections Module
   Toggle visibility of homepage sections + edit messages
   ═══════════════════════════════════════════ */

var SECTION_DEFS = [
  { id: 'featured', label: 'Featured Products' },
  { id: 'products', label: 'Products Page' },
  { id: 'offers', label: 'Offers Carousel' },
  { id: 'promotions', label: 'Promotions Space' },
]

var sectionsUnsub = null

function renderSiteSections() {
  var main = document.getElementById('main-content')
  main.innerHTML =
    '<div class="module-header">' +
    '  <div>' +
    '    <h1>Site Sections</h1>' +
    '    <p>Toggle visibility of homepage sections and set custom messages</p>' +
    '  </div>' +
    '</div>' +
    '<div class="card" style="background:#fff;border-radius:12px;border:1px solid var(--outline-variant);padding:20px;margin-top:4px;">' +
    '  <div id="sections-list"></div>' +
    '</div>'

  loadSections()
}

function loadSections() {
  if (sectionsUnsub) sectionsUnsub()

  var container = document.getElementById('sections-list')
  container.innerHTML = '<p style="text-align:center;color:var(--on-surface-variant);font-size:0.85rem;padding:24px;">Loading...</p>'

  sectionsUnsub = db.collection('site_sections')
    .onSnapshot(function (snap) {
      var sections = {}
      snap.forEach(function (doc) {
        sections[doc.id] = doc.data()
      })

      var html = ''
      SECTION_DEFS.forEach(function (def) {
        var data = sections[def.id] || {}
        var active = data.active !== false
        var message = data.message || ''

        html +=
          '<div class="section-row" style="display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid var(--outline-variant);flex-wrap:wrap;">' +
          '  <div style="flex:1;min-width:140px;">' +
          '    <div style="font-weight:700;font-size:0.9rem;color:var(--on-surface);">' + escapeHtml(def.label) + '</div>' +
          '    <div style="font-size:0.75rem;color:var(--on-surface-variant);margin-top:2px;">' + escapeHtml(def.id) + '</div>' +
          '  </div>' +
          '  <label class="toggle-switch" style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;">' +
          '    <input type="checkbox" ' + (active ? 'checked' : '') + ' onchange="toggleSection(\'' + def.id + '\', this.checked)" style="opacity:0;width:0;height:0;" />' +
          '    <span class="toggle-slider" style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:' + (active ? 'var(--brand-600, #0B1F4B)' : '#ccc') + ';border-radius:24px;transition:0.3s;"></span>' +
          '    <span class="toggle-knob" style="position:absolute;content:\"\";height:18px;width:18px;border-radius:50%;background:white;top:3px;left:' + (active ? '23px' : '3px') + ';transition:0.3s;"></span>' +
          '  </label>' +
          '  <div style="flex:2;min-width:200px;">' +
          '    <input type="text" id="msg-' + def.id + '" value="' + escapeHtml(message) + '" placeholder="Custom message when inactive" ' +
          '      style="width:100%;padding:8px 12px;border:1px solid var(--outline-variant);border-radius:8px;font-size:0.82rem;background:' + (active ? 'var(--surface-variant)' : '#fff') + ';" ' +
          '      onchange="updateSectionMsg(\'' + def.id + '\')" />' +
          '  </div>' +
          '</div>'
      })

      container.innerHTML = html ||
        '<p style="text-align:center;color:var(--on-surface-variant);padding:24px;">No sections configured. They will be created automatically when you toggle them.</p>'
    }, function (err) {
      container.innerHTML = '<p style="color:var(--danger);text-align:center;">Error: ' + err.message + '</p>'
    })
}

function toggleSection(id, active) {
  var data = { active: active, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }
  var msgInput = document.getElementById('msg-' + id)
  if (msgInput && msgInput.value.trim()) {
    data.message = msgInput.value.trim()
  }

  db.collection('site_sections').doc(id).set(data, { merge: true }).then(function () {
    showToast((active ? 'Enabled' : 'Disabled') + ' section: ' + id, 'success')
  }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}

function updateSectionMsg(id) {
  var msgInput = document.getElementById('msg-' + id)
  if (!msgInput) return

  db.collection('site_sections').doc(id).set({
    message: msgInput.value.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).catch(function (err) {
    showToast('Error: ' + err.message, 'error')
  })
}
