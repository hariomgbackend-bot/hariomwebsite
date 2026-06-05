/* ═══════════════════════════════════════════
   Data Table Utility
   Renders a sortable, responsive table from Firestore data.
   ═══════════════════════════════════════════ */

function renderTable(containerId, columns, rows, actionsFn) {
  var container = document.getElementById(containerId)
  if (!container) return

  if (!rows || rows.length === 0) {
    container.innerHTML =
      '<div class="empty-state">' +
      '  <div style="font-size:2rem;margin-bottom:8px">&#128196;</div>' +
      '  <p>No records found.</p>' +
      '</div>'
    return
  }

  var html = '<div class="table-wrapper"><table class="data-table"><thead><tr>'
  columns.forEach(function (col) {
    html += '<th>' + col.label + '</th>'
  })
  if (actionsFn) html += '<th class="text-right">Actions</th>'
  html += '</tr></thead><tbody>'

  rows.forEach(function (row, idx) {
    html += '<tr>'
    columns.forEach(function (col) {
      var val = resolveValue(row, col.key)
      html += '<td>' + (col.render ? col.render(val, row, idx) : escapeHtml(String(val))) + '</td>'
    })
    if (actionsFn) {
      html += '<td class="actions">' + actionsFn(row, idx) + '</td>'
    }
    html += '</tr>'
  })

  html += '</tbody></table></div>'
  container.innerHTML = html
}

function resolveValue(obj, path) {
  var parts = path.split('.')
  var val = obj
  for (var i = 0; i < parts.length; i++) {
    if (val == null) return ''
    val = val[parts[i]]
  }
  return val != null ? val : ''
}

function escapeHtml(str) {
  var div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function showToast(message, type) {
  type = type || 'info'
  var container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    container.className = 'toast-container'
    document.body.appendChild(container)
  }

  var toast = document.createElement('div')
  toast.className = 'toast ' + type
  toast.textContent = message
  container.appendChild(toast)

  setTimeout(function () {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 0.3s'
    setTimeout(function () { toast.remove() }, 300)
  }, 3000)
}

function openModal(title, bodyHtml, actionsHtml) {
  var overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML =
    '<div class="modal">' +
    '  <h2>' + title + '</h2>' +
    '  ' + bodyHtml +
    '  <div class="modal-actions">' + (actionsHtml || '') + '</div>' +
    '</div>'

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) overlay.remove()
  })

  document.body.appendChild(overlay)
  return overlay.querySelector('.modal')
}

function closeModal(overlay) {
  if (overlay && overlay.parentNode) overlay.parentNode.remove()
}
