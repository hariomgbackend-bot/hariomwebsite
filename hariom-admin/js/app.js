/* ═══════════════════════════════════════════
   Hariom Electronics — Admin Portal
   Application Entry Point & Router
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  // ── DOM refs ──
  var refs = {
    loginScreen: document.getElementById('login-screen'),
    dashboard: document.getElementById('dashboard'),
    loginForm: document.getElementById('login-form'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginError: document.getElementById('login-error'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    userEmailEl: document.getElementById('user-email'),
    mainContent: document.getElementById('main-content'),
  }

  // ── Init Auth ──
  initAuth(refs)

  // ── Sidebar Navigation ──
  var navBtns = document.querySelectorAll('.nav-btn')
  navBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active state
      navBtns.forEach(function (b) { b.classList.remove('active') })
      btn.classList.add('active')

      // Route to module
      var module = btn.getAttribute('data-module')
      switch (module) {
        case 'dashboard':
          renderDashboard()
          break
        case 'stock':
          renderStock()
          break
        case 'offers':
          renderOffers()
          break
        case 'enquiries':
          renderEnquiries()
          break
        case 'categories':
          renderCategories()
          break
        case 'published':
          renderPublished()
          break
        default:
          refs.mainContent.innerHTML = '<h1>Module not found</h1>'
      }
    })
  })

  // ── Load dashboard by default on login ──
  // Auth state change in auth.js handles showing dashboard;
  // we add a one-time observer to load dashboard after auth
  var authReady = false
  auth.onAuthStateChanged(function (user) {
    if (user && !authReady) {
      authReady = true
      renderDashboard()
    }
  })
})
