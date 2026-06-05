/* ═══════════════════════════════════════════
   Hariom Electronics — Admin Portal
   Firebase Authentication Module
   ═══════════════════════════════════════════ */

let currentUser = null

// DOM refs set by app.js after DOMContentLoaded
let loginScreen, dashboard, loginForm, loginEmail, loginPassword
let loginError, loginBtn, logoutBtn, userEmailEl

function initAuth(refs) {
  loginScreen = refs.loginScreen
  dashboard = refs.dashboard
  loginForm = refs.loginForm
  loginEmail = refs.loginEmail
  loginPassword = refs.loginPassword
  loginError = refs.loginError
  loginBtn = refs.loginBtn
  logoutBtn = refs.logoutBtn
  userEmailEl = refs.userEmailEl

  loginForm.addEventListener('submit', handleLogin)
  logoutBtn.addEventListener('click', handleLogout)

  // Listen for auth state changes
  auth.onAuthStateChanged(function (user) {
    if (user) {
      currentUser = user
      showDashboard(user)
    } else {
      currentUser = null
      showLogin()
    }
  })
}

function handleLogin(e) {
  e.preventDefault()
  const email = loginEmail.value.trim()
  const password = loginPassword.value

  loginError.classList.add('hidden')
  loginBtn.disabled = true
  loginBtn.textContent = 'Signing in...'

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      loginForm.reset()
    })
    .catch(function (err) {
      let msg = 'Login failed. Please try again.'
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.'
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.'
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.'
      }
      loginError.textContent = msg
      loginError.classList.remove('hidden')
    })
    .finally(function () {
      loginBtn.disabled = false
      loginBtn.textContent = 'Sign In'
    })
}

function handleLogout() {
  auth.signOut()
}

function showDashboard(user) {
  loginScreen.classList.add('hidden')
  dashboard.classList.remove('hidden')
  userEmailEl.textContent = user.email
}

function showLogin() {
  loginScreen.classList.remove('hidden')
  dashboard.classList.add('hidden')
}

// Export for use by other modules
function getCurrentUser() {
  return currentUser
}
