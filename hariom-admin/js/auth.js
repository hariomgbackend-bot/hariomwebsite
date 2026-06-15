/* ═══════════════════════════════════════════
   Hariom Electronics — Admin Portal
   Firebase Authentication Module
   ═══════════════════════════════════════════ */

let currentUser = null
let authorized = false

// DOM refs set by app.js after DOMContentLoaded
let loginScreen, dashboard, loginForm, loginEmail, loginPassword
let loginError, loginBtn, logoutBtn, userEmailEl

/**
 * Whitelist of admin email addresses. Any signed-in user whose email is NOT in
 * this list (and not in the Firestore `admins` collection) is denied access.
 * Add the owner/staff emails here. Lowercase comparison.
 */
var ADMIN_EMAIL_WHITELIST = [
  'hariom_elect@live.com','amitgodguru@gmail.com'
]

/**
 * Returns true if the signed-in user is allowed to use the admin portal.
 * Checks (1) the local whitelist and (2) a Firestore `admins` collection doc
 * keyed by the user's uid.
 */
async function isAuthorizedAdmin(user) {
  if (!user || !user.email) return false
  var email = String(user.email).toLowerCase().trim()

  // 1) Local whitelist — instant
  if (ADMIN_EMAIL_WHITELIST.indexOf(email) !== -1) return true

  // 2) Firestore `admins` collection — runtime manageable
  try {
    var doc = await db.collection('admins').doc(user.uid).get()
    if (doc.exists && doc.data().enabled !== false) return true
  } catch (e) {
    console.error('Admin lookup failed:', e)
  }
  return false
}

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
  auth.onAuthStateChanged(async function (user) {
    if (user) {
      currentUser = user
      // Verify admin role before showing dashboard
      var allowed = await isAuthorizedAdmin(user)
      if (allowed) {
        authorized = true
        showDashboard(user)
      } else {
        // Not authorized — sign out and explain
        authorized = false
        loginError.textContent = 'Access denied. This account is not authorized for the admin portal.'
        loginError.classList.remove('hidden')
        try { await auth.signOut() } catch (e) { /* ignore */ }
        showLogin()
      }
    } else {
      currentUser = null
      authorized = false
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
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.'
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.'
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.'
      } else if (err.code === 'auth/user-disabled') {
        msg = 'This account has been disabled.'
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
  authorized = false
  auth.signOut()
}

function showDashboard(user) {
  loginScreen.classList.add('hidden')
  dashboard.classList.remove('hidden')
  userEmailEl.textContent = user.email
  var avatarEl = document.getElementById("user-avatar")
  if (avatarEl) avatarEl.textContent = user.email ? user.email[0].toUpperCase() : "A"
}

function showLogin() {
  loginScreen.classList.remove('hidden')
  dashboard.classList.add('hidden')
}

// Export for use by other modules
function getCurrentUser() {
  return currentUser
}

function isAuthorized() {
  return authorized === true
}
