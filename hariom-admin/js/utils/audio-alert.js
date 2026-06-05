/* ═══════════════════════════════════════════
   Audio Alert Utility
   Plays a notification sound for new enquiries.
   Uses a generated beep as fallback if no audio file.
   ═══════════════════════════════════════════ */

function playEnquiryAlert() {
  const audioEl = document.getElementById('enquiry-alert')

  if (audioEl) {
    audioEl.currentTime = 0
    audioEl.play().catch(function () {
      // Auto-play blocked or file missing — use Web Audio API beep
      playBeep()
    })
  } else {
    playBeep()
  }
}

function playBeep() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)()
    var osc = ctx.createOscillator()
    var gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 800
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch (e) {
    console.log('Audio not available')
  }
}
