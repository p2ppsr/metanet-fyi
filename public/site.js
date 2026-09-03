(() => {
  'use strict'
  const endpoint = 'https://usercom.babbage.systems/signal'
  const allowedEvents = new Set(['page.view', 'guide.started', 'pathway.selected', 'resource.clicked', 'recovery.check', 'recovery.reset'])
  const privacySignal = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1'

  function sessionId () {
    const key = 'metanet_fyi_session'
    try {
      const current = sessionStorage.getItem(key)
      if (current) return current
      const next = crypto.randomUUID()
      sessionStorage.setItem(key, next)
      return next
    } catch { return 'ephemeral' }
  }
  function signal (event, detail = {}) {
    if (privacySignal || !allowedEvents.has(event)) return
    const cleanUrl = new URL(location.href)
    cleanUrl.search = ''
    cleanUrl.hash = ''
    const body = JSON.stringify({
      source: 'metanet.fyi',
      surface: 'field-guide',
      name: event,
      url: cleanUrl.toString(),
      path: location.pathname,
      tags: ['site:metanet-fyi', `event:${event}`],
      context: { ...detail, sessionId: sessionId(), timestamp: new Date().toISOString() }
    })
    try {
      fetch(endpoint, { method: 'POST', body, mode: 'cors', credentials: 'omit', keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {})
    } catch {}
  }
  signal('page.view')
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-event]')
    if (!link) return
    const detail = link.href ? { host: new URL(link.href, location.href).host } : {}
    signal(link.dataset.event, detail)
  })

  const checks = [...document.querySelectorAll('[data-recovery-check]')]
  const score = document.querySelector('#recovery-score')
  const reset = document.querySelector('#reset-checks')
  if (!checks.length || !score) return
  const storageKey = 'metanet_fyi_recovery_checks_v1'
  function updateScore (track = false) {
    const state = checks.map(check => check.checked)
    score.value = String(state.filter(Boolean).length)
    try { localStorage.setItem(storageKey, JSON.stringify(state)) } catch {}
    if (track) signal('recovery.check', { score: state.filter(Boolean).length })
  }
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]')
    checks.forEach((check, index) => { check.checked = stored[index] === true })
  } catch {}
  updateScore()
  checks.forEach(check => check.addEventListener('change', () => updateScore(true)))
  reset?.addEventListener('click', () => {
    checks.forEach(check => { check.checked = false })
    updateScore()
    signal('recovery.reset')
  })
})()
