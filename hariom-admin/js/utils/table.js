/* ═══════════════════════════════════════════
   Data Table Utility
   Renders a sortable, searchable, paginated table from data,
   plus CSV export and modal/toast helpers shared across modules.
   ═══════════════════════════════════════════ */

/* ── Per-instance state registry (so search/pagination stay in sync) ── */
var __tableInstances = {}
var __instanceSeq = 0

function nextInstanceId() {
  __instanceSeq += 1
  return 'tbl-' + __instanceSeq
}

/**
 * Escape a string for safe insertion into HTML.
 */
function escapeHtml(str) {
  if (str == null) return ''
  var div = document.createElement('div')
  div.textContent = String(str)
  return div.innerHTML
}

/**
 * Resolve a possibly-nested value from an object via dot path, e.g. "customer.name".
 */
function resolveValue(obj, path) {
  var parts = path.split('.')
  var val = obj
  for (var i = 0; i < parts.length; i++) {
    if (val == null) return ''
    val = val[parts[i]]
  }
  return val != null ? val : ''
}

/* ═══════════════════════════════════════════
   Simple table renderer (backward compatible).
   Signature unchanged: renderTable(containerId, columns, rows, actionsFn)
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

/* ═══════════════════════════════════════════
   Full table view: search box + page-size + export + pagination.
   Call: renderDataTable(containerId, {
     columns, rows, actionsFn, searchKeys, exportFilename, exportColumns
   })
   ═══════════════════════════════════════════ */
function renderDataTable(containerId, opts) {
  var container = document.getElementById(containerId)
  if (!container) return

  var columns = opts.columns || []
  var rows = opts.rows || []
  var actionsFn = opts.actionsFn
  var searchKeys = opts.searchKeys || columns.map(function (c) { return c.key })
  var exportFilename = opts.exportFilename || 'export'
  var exportColumns = opts.exportColumns || columns.map(function (c) {
    return { label: c.label, key: c.key }
  })

  // Register instance state
  var instanceId = container.getAttribute('data-instance')
  if (!instanceId || !__tableInstances[instanceId]) {
    instanceId = nextInstanceId()
    container.setAttribute('data-instance', instanceId)
    __tableInstances[instanceId] = {
      query: '',
      page: 1,
      pageSize: 25
    }
  }
  var state = __tableInstances[instanceId]

  // Cache latest rows for this instance
  state.rows = rows
  state.columns = columns
  state.actionsFn = actionsFn
  state.searchKeys = searchKeys
  state.exportFilename = exportFilename
  state.exportColumns = exportColumns

  __drawDataTable(container, instanceId)
}

function __drawDataTable(container, instanceId) {
  var state = __tableInstances[instanceId]
  if (!state) return

  var rows = state.rows || []
  var columns = state.columns || []
  var actionsFn = state.actionsFn
  var searchKeys = state.searchKeys && state.searchKeys.length ? state.searchKeys : columns.map(function (c) { return c.key })

  // ── Filter ──
  var filtered = rows
  if (state.query) {
    var q = state.query.toLowerCase()
    filtered = rows.filter(function (row) {
      return searchKeys.some(function (key) {
        var v = resolveValue(row, key)
        if (v == null) return false
        if (typeof v === 'object') {
          try { v = JSON.stringify(v) } catch (e) { v = '' }
        }
        return String(v).toLowerCase().indexOf(q) !== -1
      })
    })
  }

  // ── Paginate ──
  var pageSize = state.pageSize
  var total = filtered.length
  var totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (state.page > totalPages) state.page = totalPages
  var startIdx = (state.page - 1) * pageSize
  var endIdx = startIdx + pageSize
  var pageRows = filtered.slice(startIdx, endIdx)

  // ── Build HTML ──
  var html = ''

  // Controls: search + page size + export
  html += '<div class="table-controls">'
  html += '  <input type="text" placeholder="Search..." value="' + escapeHtml(state.query) + '" oninput="__tableSearch(\'' + instanceId + '\', this.value)" />'
  html += '  <select class="page-size-select" onchange="__tablePageSize(\'' + instanceId + '\', this.value)">'
  ;[10, 25, 50, 100].forEach(function (n) {
    html += '<option value="' + n + '"' + (pageSize === n ? ' selected' : '') + '>' + n + ' / page</option>'
  })
  html += '  </select>'
  html += '  <span class="spacer"></span>'
  html += '  <button class="btn btn-outline btn-sm" onclick="__tableExport(\'' + instanceId + '\')">&#11015; Export CSV</button>'
  html += '</div>'

  // Table
  if (pageRows.length === 0) {
    html += '<div class="empty-state"><p>No records found' + (state.query ? ' for "' + escapeHtml(state.query) + '"' : '') + '.</p></div>'
  } else {
    html += '<div class="table-wrapper"><table class="data-table"><thead><tr>'
    columns.forEach(function (col) { html += '<th>' + col.label + '</th>' })
    if (actionsFn) html += '<th class="text-right">Actions</th>'
    html += '</tr></thead><tbody>'
    pageRows.forEach(function (row, idx) {
      html += '<tr>'
      columns.forEach(function (col) {
        var val = resolveValue(row, col.key)
        html += '<td>' + (col.render ? col.render(val, row, idx) : escapeHtml(String(val))) + '</td>'
      })
      if (actionsFn) html += '<td class="actions">' + actionsFn(row, startIdx + idx) + '</td>'
      html += '</tr>'
    })
    html += '</tbody></table></div>'

    // Pagination
    if (totalPages > 1) {
      html += '<div class="pagination">'
      html += '  <button onclick="__tablePage(\'' + instanceId + '\', ' + (state.page - 1) + ')"' + (state.page <= 1 ? ' disabled' : '') + '>&#8592; Prev</button>'

      // Page number window (max ~7 buttons)
      var winStart = Math.max(1, state.page - 3)
      var winEnd = Math.min(totalPages, winStart + 6)
      winStart = Math.max(1, winEnd - 6)
      if (winStart > 1) html += '<button onclick="__tablePage(\'' + instanceId + '\', 1)">1</button>'
      if (winStart > 2) html += '<span class="pagination-info">…</span>'
      for (var p = winStart; p <= winEnd; p++) {
        html += '<button class="' + (p === state.page ? 'active' : '') + '" onclick="__tablePage(\'' + instanceId + '\', ' + p + ')">' + p + '</button>'
      }
      if (winEnd < totalPages - 1) html += '<span class="pagination-info">…</span>'
      if (winEnd < totalPages) html += '<button onclick="__tablePage(\'' + instanceId + '\', ' + totalPages + ')">' + totalPages + '</button>'

      html += '  <button onclick="__tablePage(\'' + instanceId + '\', ' + (state.page + 1) + ')"' + (state.page >= totalPages ? ' disabled' : '') + '>Next &#8594;</button>'
      html += '  <span class="pagination-info">Showing ' + (startIdx + 1) + '–' + Math.min(endIdx, total) + ' of ' + total + '</span>'
      html += '</div>'
    } else {
      html += '<div class="pagination"><span class="pagination-info">Showing ' + (startIdx + 1) + '–' + Math.min(endIdx, total) + ' of ' + total + '</span></div>'
    }
  }

  container.innerHTML = html
}

/* ── Control callbacks (attached via inline handlers) ── */
function __tableSearch(instanceId, value) {
  var state = __tableInstances[instanceId]
  if (!state) return
  state.query = value
  state.page = 1
  __drawDataTable(document.querySelector('[data-instance="' + instanceId + '"]'), instanceId)
}

function __tablePageSize(instanceId, value) {
  var state = __tableInstances[instanceId]
  if (!state) return
  state.pageSize = parseInt(value, 10) || 25
  state.page = 1
  __drawDataTable(document.querySelector('[data-instance="' + instanceId + '"]'), instanceId)
}

function __tablePage(instanceId, page) {
  var state = __tableInstances[instanceId]
  if (!state) return
  state.page = page
  __drawDataTable(document.querySelector('[data-instance="' + instanceId + '"]'), instanceId)
}

function __tableExport(instanceId) {
  var state = __tableInstances[instanceId]
  if (!state) return
  var rows = state.rows || []
  var cols = state.exportColumns || state.columns || []

  // Apply current search filter to the export
  var exportRows = rows
  if (state.query) {
    var q = state.query.toLowerCase()
    exportRows = rows.filter(function (row) {
      return cols.some(function (c) {
        var v = resolveValue(row, c.key)
        if (v == null) return false
        return String(v).toLowerCase().indexOf(q) !== -1
      })
    })
  }

  // Build CSV
  var lines = []
  lines.push(cols.map(function (c) { return csvCell(c.label) }).join(','))
  exportRows.forEach(function (row) {
    lines.push(cols.map(function (c) {
      var v = resolveValue(row, c.key)
      if (v == null) v = ''
      if (v.seconds) v = new Date(v.seconds * 1000).toLocaleString('en-IN')
      return csvCell(v)
    }).join(','))
  })

  var csv = '\uFEFF' + lines.join('\r\n') // BOM for Excel UTF-8
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  var url = URL.createObjectURL(blob)
  var a = document.createElement('a')
  a.href = url
  a.download = (state.exportFilename || 'export') + '-' + new Date().toISOString().slice(0, 10) + '.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showToast('Exported ' + exportRows.length + ' rows', 'success')
}

function csvCell(value) {
  var s = String(value)
  if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

/* ═══════════════════════════════════════════
   Toast notifications
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   Modal dialog
   ═══════════════════════════════════════════ */
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
