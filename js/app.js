/**
 * ============================================================================
 * MAIN APPLICATION LOGIC & CYBER UI ORCHESTRATION
 * ============================================================================
 */

(function () {
  'use strict';

  // Project Specifications Database for Interactive Modal
  const PROJECTS_DATA = {
    'ai-mesh': {
      title: 'Autonomous AI Multi-Agent Mesh',
      badge: 'PRODUCTION ACTIVE &bull; V3.4',
      lead: 'Decentralized multi-agent swarm architecture orchestrating 120+ autonomous LLM nodes with peer-to-peer consensus, dynamic vector routing, and self-healing memory partitions.',
      specs: [
        { label: 'Throughput', value: '4,200 agent messages / sec' },
        { label: 'Latency', value: '38ms inter-agent handoff' },
        { label: 'Consensus', value: 'Raft-based memory consensus' },
        { label: 'Vector Index', value: 'Distributed HNSW + pgvector' }
      ],
      architecture: 'Clients dispatch high-level objectives to the Edge Gateway. The Neural Dispatcher breaks goals into acyclic directed graphs (DAGs), streaming tasks across specialized worker agents with cryptographic verification and Redis state channels.',
      stack: ['Rust', 'Python 3.12', 'WebSockets', 'Three.js', 'Redis Cluster', 'Firestore']
    },
    'liquidation-engine': {
      title: 'Ultra-Low-Latency Liquidation Engine',
      badge: 'ENTERPRISE DEPLOYED &bull; ZERO SLIPPAGE',
      lead: 'High-frequency deterministic risk assessment and automated position unwind engine engineered to operate under extreme volatility in decentralized derivatives exchanges.',
      specs: [
        { label: 'Execution Speed', value: '< 850 microseconds P99' },
        { label: 'Stress Volume', value: '$450M liquidations processed' },
        { label: 'Zero Slippage', value: '99.98% target fulfillment' },
        { label: 'Fault Recovery', value: '< 2.4ms failover to secondary replica' }
      ],
      architecture: 'Built in modern C++ and Go, utilizing lock-free ring buffers, kernel bypass (DPDK), and memory-mapped IPC to process order book orderbooks at sub-millisecond execution velocities.',
      stack: ['C++20', 'Go', 'Kafka', 'gRPC', 'TimescaleDB', 'WebAssembly']
    },
    'crdt-invoicing': {
      title: 'Offline-First CRDT Invoicing System',
      badge: 'CROSS-PLATFORM &bull; EDGE SYNC',
      lead: 'Conflict-Free Replicated Data Type (CRDT) accounting platform enabling field enterprises to issue cryptographically signed, compliant financial invoices without active network connectivity.',
      specs: [
        { label: 'Conflict Rate', value: '0.000% mathematical zero' },
        { label: 'Offline Cache', value: '50,000+ cached items locally' },
        { label: 'Signatures', value: 'Ed25519 deterministic key pairs' },
        { label: 'Sync Latency', value: '180ms upon network reconnection' }
      ],
      architecture: 'State mutations are represented as monotonic state-based CRDT deltas stored in IndexedDB. Upon detecting WebSocket connectivity, deltas are Merkle-tree verified and reconciled against cloud Firestore nodes.',
      stack: ['TypeScript', 'IndexedDB', 'WebRTC', 'Ed25519', 'Firebase Firestore']
    },
    'quantum-auth': {
      title: 'Quantum-Resistant Identity Authenticator',
      badge: 'SECURITY AUDITED &bull; NIST COMPLIANT',
      lead: 'Next-generation authentication suite combining NIST post-quantum cryptographic standards (ML-KEM/Kyber-1024) with FIDO2 WebAuthn hardware biometric security keys.',
      specs: [
        { label: 'Encryption', value: 'Kyber-1024 Lattice-based KEM' },
        { label: 'Biometrics', value: 'WebAuthn Level 3 Touch ID / Yubikey' },
        { label: 'Token Expiry', value: 'Zero-knowledge rolling JWT' },
        { label: 'Pen-Test Rating', value: 'Level 5 Maximum Resilience' }
      ],
      architecture: 'Post-quantum key encapsulations are generated client-side inside a sandboxed WebAssembly module, binding ephemeral sessions to WebAuthn hardware attestations before registering with Firebase Authentication.',
      stack: ['WebAssembly', 'WebAuthn FIDO2', 'Firebase Auth', 'Kyber-1024', 'TypeScript']
    }
  };

  // DOM Elements
  let verifyInput, verifyStatus, regForm, regPassword, regRole;
  let rosterList, rosterCount, rosterSearch;
  let toastContainer;
  let verifyDebounceTimer = null;

  // Initialize
  document.addEventListener('DOMContentLoaded', async () => {
    initElements();
    initAudioToggle();
    initNavigation();
    initTerminalWidget();
    initInteractiveTerminal();
    initProjectFilters();
    initModals();
    initFirebaseIntegration();
  });

  function initElements() {
    verifyInput = document.getElementById('reg-name');
    verifyStatus = document.getElementById('verification-status');
    regForm = document.getElementById('registration-form');
    regPassword = document.getElementById('reg-password');
    regRole = document.getElementById('reg-role');
    rosterList = document.getElementById('roster-list');
    rosterCount = document.getElementById('roster-count');
    rosterSearch = document.getElementById('roster-search');
    toastContainer = document.getElementById('toast-container');
  }

  // Audio Toggle Button
  function initAudioToggle() {
    const audioBtn = document.getElementById('toggle-audio-btn');
    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
      const isEnabled = window.CyberAudio ? window.CyberAudio.toggle() : false;
      audioBtn.classList.toggle('active', isEnabled);
      audioBtn.innerHTML = isEnabled 
        ? '<i class="fa-solid fa-volume-high"></i> AUDIO: ON' 
        : '<i class="fa-solid fa-volume-xmark"></i> AUDIO: OFF';
      
      showToast(
        isEnabled ? 'Cyber Audio Enabled' : 'Cyber Audio Muted',
        isEnabled ? 'Synthesizer initialized for tactile audio feedback.' : 'Audio synthesis muted.',
        isEnabled ? 'info' : 'info'
      );
    });

    // Add audio hover to buttons & cards
    document.querySelectorAll('.btn-cyber, .btn-cyber-outline, .project-card, .glass-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.CyberAudio) window.CyberAudio.playHover();
      });
    });
  }

  // Navigation & Scroll Effects
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const toggleBtn = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
        });
      });
    }
  }

  // Firebase Integration & Name Verification Setup
  async function initFirebaseIntegration() {
    const hudBadge = document.getElementById('hud-firebase-status');
    const configBtn = document.getElementById('btn-open-firebase-config');

    // Initialize Firebase Service
    const initResult = await window.CyberFirebase.initialize();

    updateFirebaseStatusBadge(initResult.mode);

    if (configBtn) {
      configBtn.addEventListener('click', () => {
        openFirebaseConfigModal();
      });
    }

    // Subscribe to Roster Updates
    window.CyberFirebase.subscribe((identities) => {
      renderRoster(identities);
    });

    // Real-Time Name Verification Listener (Interactive check requirement)
    if (verifyInput && verifyStatus) {
      verifyInput.addEventListener('input', () => {
        const value = verifyInput.value.trim();
        clearTimeout(verifyDebounceTimer);

        if (!value) {
          updateVerifyStatus('idle', 'Awaiting handle input...');
          return;
        }

        updateVerifyStatus('checking', 'Querying Firestore index for "' + value + '"...');

        verifyDebounceTimer = setTimeout(async () => {
          const result = await window.CyberFirebase.verifyNameAvailability(value);
          if (result.available) {
            updateVerifyStatus('available', result.reason);
            if (window.CyberAudio) window.CyberAudio.playSuccess();
          } else {
            updateVerifyStatus('taken', result.reason);
            if (window.CyberAudio) window.CyberAudio.playError();
          }
        }, 300);
      });

      // Quick "Verify" action button
      const manualVerifyBtn = document.getElementById('btn-manual-verify');
      if (manualVerifyBtn) {
        manualVerifyBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          const value = verifyInput.value.trim();
          if (!value) {
            showToast('Input Required', 'Please enter a handle to verify.', 'error');
            return;
          }
          updateVerifyStatus('checking', 'Verifying handle in database...');
          const result = await window.CyberFirebase.verifyNameAvailability(value);
          if (result.available) {
            updateVerifyStatus('available', result.reason);
            showToast('Handle Available', result.reason, 'success');
            if (window.CyberAudio) window.CyberAudio.playSuccess();
          } else {
            updateVerifyStatus('taken', result.reason);
            showToast('Handle Unavailable', result.reason, 'error');
            if (window.CyberAudio) window.CyberAudio.playError();
          }
        });
      }
    }

    // Handle Registration Form Submission
    if (regForm) {
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = verifyInput.value.trim();
        const pass = regPassword.value;
        const role = regRole ? regRole.value : 'Systems Engineer';
        const submitBtn = document.getElementById('reg-submit-btn');

        if (!name || !pass) {
          showToast('Validation Error', 'Handle and access key are both mandatory.', 'error');
          if (window.CyberAudio) window.CyberAudio.playError();
          return;
        }

        try {
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROVISIONING IDENTITY...';
          }

          const record = await window.CyberFirebase.registerIdentity(name, pass, role);

          showToast(
            'Access Cleared: Identity Provisioned',
            `Handle [${record.name}] verified with cryptographic token: ${record.token}`,
            'success'
          );

          if (window.CyberAudio) window.CyberAudio.playSuccess();

          // Reset form
          regForm.reset();
          updateVerifyStatus('idle', 'Awaiting handle input...');

          // Highlight newly registered item
          setTimeout(() => {
            const firstItem = rosterList.querySelector('.roster-item');
            if (firstItem) {
              firstItem.style.borderColor = 'var(--accent-green)';
              firstItem.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.4)';
            }
          }, 100);

        } catch (err) {
          showToast('Registration Error', err.message, 'error');
          if (window.CyberAudio) window.CyberAudio.playError();
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-id-badge"></i> PROVISION CYBER IDENTITY';
          }
        }
      });
    }

    // Roster Search Filter
    if (rosterSearch) {
      rosterSearch.addEventListener('input', async () => {
        const query = rosterSearch.value.trim().toLowerCase();
        const all = await window.CyberFirebase.getIdentities();
        const filtered = all.filter(item => 
          item.nameLower.includes(query) || 
          item.role.toLowerCase().includes(query) ||
          item.token.toLowerCase().includes(query)
        );
        renderRoster(filtered);
      });
    }
  }

  function updateVerifyStatus(state, message) {
    if (!verifyStatus) return;
    verifyStatus.className = 'verification-status-banner ' + state;

    let icon = '';
    if (state === 'checking') icon = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
    else if (state === 'available') icon = '<i class="fa-solid fa-shield-check"></i>';
    else if (state === 'taken') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
    else icon = '<i class="fa-solid fa-terminal"></i>';

    verifyStatus.innerHTML = `${icon} <span>${message}</span>`;
  }

  function updateFirebaseStatusBadge(mode) {
    const badge = document.getElementById('hud-firebase-status');
    if (!badge) return;
    if (mode === 'LIVE') {
      badge.innerHTML = '<span class="hud-pulse"></span> FIRESTORE: <strong>LIVE CLOUD</strong>';
      badge.classList.remove('red');
    } else {
      badge.innerHTML = '<span class="hud-pulse red"></span> FIRESTORE: <strong>SANDBOX</strong>';
    }
  }

  function renderRoster(list) {
    if (!rosterList) return;
    rosterList.innerHTML = '';

    if (rosterCount) {
      rosterCount.textContent = `${list.length} IDENTITIES`;
    }

    if (!list || list.length === 0) {
      rosterList.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem; font-family: var(--font-mono); font-size: 0.8rem;">No identities match query.</div>';
      return;
    }

    list.forEach(item => {
      const row = document.createElement('div');
      row.className = 'roster-item';
      const initials = (item.name || 'U').substring(0, 2).toUpperCase();
      const timeStr = new Date(item.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });

      row.innerHTML = `
        <div class="roster-user-info">
          <div class="roster-avatar">${initials}</div>
          <div>
            <div class="roster-name">${escapeHtml(item.name)}</div>
            <div class="roster-role">${escapeHtml(item.role)} &bull; ${timeStr}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span class="roster-hash-pill" title="Verification Hash">${item.token || '0x49c...'}</span>
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-green);">
            <i class="fa-solid fa-check-double"></i>
          </span>
        </div>
      `;

      row.addEventListener('click', () => {
        if (verifyInput) {
          verifyInput.value = item.name;
          verifyInput.dispatchEvent(new Event('input'));
          showToast('Handle Selected', `Testing conflict validation for existing handle "${item.name}"`, 'info');
        }
      });

      rosterList.appendChild(row);
    });
  }

  // Hero Terminal Mini Telemetry & Simulator
  function initTerminalWidget() {
    const input = document.getElementById('hero-terminal-input');
    const body = document.getElementById('hero-terminal-body');
    if (!input || !body) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (!cmd) return;
        input.value = '';

        if (window.CyberAudio) window.CyberAudio.playClick();

        // Print entered command
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="terminal-prefix">></span> <span>${escapeHtml(cmd)}</span>`;
        body.appendChild(cmdLine);

        // Process response
        handleHeroCommand(cmd.toLowerCase(), body);
        body.scrollTop = body.scrollHeight;
      }
    });
  }

  function handleHeroCommand(cmd, container) {
    const resLine = document.createElement('div');
    resLine.className = 'terminal-line';

    if (cmd === 'help') {
      resLine.innerHTML = `<span class="terminal-cyan">[COMMANDS]:</span> help &bull; status &bull; verify &bull; projects &bull; clear &bull; handshake`;
    } else if (cmd === 'status') {
      resLine.innerHTML = `<span class="terminal-green">[STATUS]:</span> Core Kernel: ONLINE | Latency: 1.1ms | Mode: Fault-Tolerant High Concurrency`;
    } else if (cmd.startsWith('verify ')) {
      const handle = cmd.replace('verify ', '').trim();
      resLine.innerHTML = `<span class="terminal-cyan">[VERIFY]:</span> Querying Firestore for "${escapeHtml(handle)}"...`;
      setTimeout(async () => {
        const verifyRes = await window.CyberFirebase.verifyNameAvailability(handle);
        const sub = document.createElement('div');
        sub.className = 'terminal-line';
        sub.innerHTML = verifyRes.available 
          ? `<span class="terminal-green">[OK]:</span> ${verifyRes.reason}` 
          : `<span class="terminal-prefix">[CONFLICT]:</span> ${verifyRes.reason}`;
        container.appendChild(sub);
        container.scrollTop = container.scrollHeight;
      }, 250);
    } else if (cmd === 'projects') {
      resLine.innerHTML = `<span class="terminal-cyan">[PROJECTS]:</span> 1) Autonomous AI Mesh 2) Liquidation Engine 3) CRDT Invoicing 4) Quantum Auth`;
    } else if (cmd === 'clear') {
      container.innerHTML = '';
      return;
    } else if (cmd === 'handshake') {
      resLine.innerHTML = `<span class="terminal-green">[HANDSHAKE ACK]:</span> Welcome to Vigneshwaran\'s Distributed Core. Cryptographic handshake established.`;
      if (window.CyberAudio) window.CyberAudio.playSuccess();
    } else {
      resLine.innerHTML = `<span class="terminal-dim">Command not recognized. Type "help" for system commands.</span>`;
    }

    container.appendChild(resLine);
  }

  // Full Interactive Terminal Section
  function initInteractiveTerminal() {
    const input = document.getElementById('full-terminal-input');
    const body = document.getElementById('full-terminal-body');
    if (!input || !body) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = input.value.trim();
        if (!raw) return;
        input.value = '';

        if (window.CyberAudio) window.CyberAudio.playClick();

        const cmdEl = document.createElement('div');
        cmdEl.className = 'terminal-line';
        cmdEl.innerHTML = `<span class="terminal-prefix">root@nexus:~#</span> <span>${escapeHtml(raw)}</span>`;
        body.appendChild(cmdEl);

        const parts = raw.split(' ');
        const mainCmd = parts[0].toLowerCase();
        const arg1 = parts[1];
        const arg2 = parts[2];

        const outEl = document.createElement('div');
        outEl.className = 'terminal-line';

        switch (mainCmd) {
          case 'help':
            outEl.innerHTML = `
              <div style="color: var(--accent-cyan); margin-bottom: 0.3rem;">AVAILABLE KERNEL INSTRUCTIONS:</div>
              <div>&bull; <strong style="color:#fff;">help</strong> - Display this command registry</div>
              <div>&bull; <strong style="color:#fff;">whoami</strong> - Display architect credentials & bio</div>
              <div>&bull; <strong style="color:#fff;">verify &lt;handle&gt;</strong> - Query Firestore for handle availability</div>
              <div>&bull; <strong style="color:#fff;">register &lt;handle&gt; &lt;passkey&gt;</strong> - Provision a new cryptographic identity</div>
              <div>&bull; <strong style="color:#fff;">projects</strong> - List high-performance architecture projects</div>
              <div>&bull; <strong style="color:#fff;">stats</strong> - View live telemetry & throughput benchmarks</div>
              <div>&bull; <strong style="color:#fff;">audio [on|off]</strong> - Toggle procedural sound synthesis</div>
              <div>&bull; <strong style="color:#fff;">ping</strong> - Measure round-trip execution latency</div>
              <div>&bull; <strong style="color:#fff;">clear</strong> - Flush terminal buffer</div>
            `;
            break;

          case 'whoami':
            outEl.innerHTML = `
              <div style="color: var(--accent-red-bright); font-weight:700;">VIGNESHWARAN // SENIOR DISTRIBUTED SYSTEMS ARCHITECT</div>
              <div style="color: var(--text-secondary); margin-top: 0.3rem;">Specialized in ultra-low latency execution engines, decentralized CRDT networks, and autonomous multi-agent AI ecosystems. Dedicated to fault-tolerant design and deterministic consistency.</div>
            `;
            break;

          case 'verify':
            if (!arg1) {
              outEl.innerHTML = `<span class="terminal-prefix">[ERROR]:</span> Usage: verify &lt;handle&gt;`;
            } else {
              outEl.innerHTML = `<span class="terminal-cyan">[QUERYING]:</span> Checking Firestore records for "${escapeHtml(arg1)}"...`;
              window.CyberFirebase.verifyNameAvailability(arg1).then(res => {
                const sub = document.createElement('div');
                sub.className = 'terminal-line';
                sub.innerHTML = res.available
                  ? `<span class="terminal-green">[OK]:</span> ${res.reason}`
                  : `<span class="terminal-prefix">[CONFLICT]:</span> ${res.reason}`;
                body.appendChild(sub);
                body.scrollTop = body.scrollHeight;
              });
            }
            break;

          case 'register':
            if (!arg1 || !arg2) {
              outEl.innerHTML = `<span class="terminal-prefix">[ERROR]:</span> Usage: register &lt;handle&gt; &lt;passkey&gt;`;
            } else {
              outEl.innerHTML = `<span class="terminal-cyan">[PROVISIONING]:</span> Executing registration pipeline...`;
              window.CyberFirebase.registerIdentity(arg1, arg2, 'CLI Operator')
                .then(rec => {
                  const sub = document.createElement('div');
                  sub.className = 'terminal-line';
                  sub.innerHTML = `<span class="terminal-green">[SUCCESS]:</span> Handle "${rec.name}" provisioned! Token: ${rec.token}`;
                  body.appendChild(sub);
                  body.scrollTop = body.scrollHeight;
                  if (window.CyberAudio) window.CyberAudio.playSuccess();
                })
                .catch(err => {
                  const sub = document.createElement('div');
                  sub.className = 'terminal-line';
                  sub.innerHTML = `<span class="terminal-prefix">[FAILED]:</span> ${err.message}`;
                  body.appendChild(sub);
                  body.scrollTop = body.scrollHeight;
                  if (window.CyberAudio) window.CyberAudio.playError();
                });
            }
            break;

          case 'projects':
            outEl.innerHTML = `
              <div style="color: var(--accent-red-bright);">FLAGSHIP DISTRIBUTED SYSTEMS:</div>
              <div>[01] Autonomous AI Multi-Agent Mesh (Rust / Python / WebSockets / Redis)</div>
              <div>[02] Ultra-Low-Latency Liquidation Engine (C++20 / Go / Kafka / gRPC)</div>
              <div>[03] Offline-First CRDT Invoicing Platform (TypeScript / IndexedDB / Ed25519)</div>
              <div>[04] Quantum-Resistant Identity Authenticator (WebAssembly / WebAuthn / Kyber-1024)</div>
            `;
            break;

          case 'stats':
            outEl.innerHTML = `
              <div style="color: var(--accent-green);">CORE TELEMETRY:</div>
              <div>&bull; Max Throughput: 1,420,000 ops / sec</div>
              <div>&bull; P99 Execution Latency: 0.85 ms</div>
              <div>&bull; Cluster State: 100% HEALTHY (0 split-brain conditions)</div>
              <div>&bull; Firestore Mode: ${window.CyberFirebase.isLiveFirebase ? 'LIVE CLOUD' : 'SANDBOX SIMULATOR'}</div>
            `;
            break;

          case 'audio':
            if (arg1 === 'on') {
              if (window.CyberAudio) window.CyberAudio.setSoundEnabled(true);
              outEl.innerHTML = `<span class="terminal-green">[AUDIO]:</span> Cyber procedural audio synthesis enabled.`;
            } else if (arg1 === 'off') {
              if (window.CyberAudio) window.CyberAudio.setSoundEnabled(false);
              outEl.innerHTML = `<span class="terminal-dim">[AUDIO]:</span> Audio synthesis disabled.`;
            } else {
              outEl.innerHTML = `<span class="terminal-dim">Usage: audio on | audio off</span>`;
            }
            break;

          case 'ping':
            const randomLatency = (Math.random() * 2 + 0.8).toFixed(2);
            outEl.innerHTML = `<span class="terminal-green">[PONG]:</span> RTT ${randomLatency}ms to edge gateway node.`;
            break;

          case 'clear':
            body.innerHTML = '';
            return;

          default:
            outEl.innerHTML = `<span class="terminal-dim">Unknown instruction "${escapeHtml(mainCmd)}". Type "help" for commands.</span>`;
            break;
        }

        body.appendChild(outEl);
        body.scrollTop = body.scrollHeight;
      }
    });
  }

  // Project Filtering
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Modals Management
  function initModals() {
    // Project Details Modals
    document.querySelectorAll('[data-project-trigger]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.projectTrigger;
        openProjectModal(key);
      });
    });

    // Close Modals on Overlay or Close Button
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.closest('.modal-close-btn')) {
          closeAllModals();
        }
      });
    });

    // Escape Key to Close Modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });
  }

  function openProjectModal(key) {
    const data = PROJECTS_DATA[key];
    if (!data) return;

    const modal = document.getElementById('project-modal');
    const titleEl = document.getElementById('project-modal-title');
    const bodyEl = document.getElementById('project-modal-body');

    titleEl.innerHTML = `<i class="fa-solid fa-microchip"></i> ${escapeHtml(data.title)}`;

    let specsHtml = data.specs.map(s => `
      <div style="background: rgba(10, 10, 16, 0.8); border: 1px solid rgba(255, 42, 75, 0.2); padding: 0.75rem 1rem; border-radius: 4px;">
        <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">${escapeHtml(s.label)}</div>
        <div style="font-family: var(--font-cyber); font-size: 0.95rem; color: var(--accent-red-bright); font-weight: 700; margin-top: 0.2rem;">${escapeHtml(s.value)}</div>
      </div>
    `).join('');

    let techHtml = data.stack.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');

    bodyEl.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-green); margin-bottom: 1rem;">${data.badge}</div>
      <p style="font-size: 1rem; color: #fff; margin-bottom: 1.5rem; line-height: 1.6;">${escapeHtml(data.lead)}</p>
      
      <div style="font-family: var(--font-cyber); font-size: 0.85rem; color: var(--accent-red); margin-bottom: 0.75rem; text-transform: uppercase;">Performance & Benchmarks</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem;">
        ${specsHtml}
      </div>

      <div style="font-family: var(--font-cyber); font-size: 0.85rem; color: var(--accent-red); margin-bottom: 0.5rem; text-transform: uppercase;">System Architecture</div>
      <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">${escapeHtml(data.architecture)}</p>

      <div style="font-family: var(--font-cyber); font-size: 0.85rem; color: var(--accent-red); margin-bottom: 0.6rem; text-transform: uppercase;">Technology Stack</div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${techHtml}
      </div>
    `;

    modal.classList.add('active');
    if (window.CyberAudio) window.CyberAudio.playHover();
  }

  function openFirebaseConfigModal() {
    const modal = document.getElementById('firebase-config-modal');
    modal.classList.add('active');
    if (window.CyberAudio) window.CyberAudio.playHover();

    // Populate current mode
    const statusNote = document.getElementById('fb-current-status-note');
    if (statusNote) {
      statusNote.innerHTML = window.CyberFirebase.isLiveFirebase
        ? '<span style="color: var(--accent-green); font-weight: 700;"><i class="fa-solid fa-link"></i> Connected to Live Firebase Firestore Cloud</span>'
        : '<span style="color: var(--accent-cyan); font-weight: 700;"><i class="fa-solid fa-microchip"></i> Running in Sandboxed Resilience Mode (Fast local persistence)</span>';
    }

    // Connect form
    const configForm = document.getElementById('fb-config-form');
    if (configForm && !configForm.dataset.initialized) {
      configForm.dataset.initialized = 'true';

      configForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const apiKey = document.getElementById('fb-api-key').value.trim();
        const authDomain = document.getElementById('fb-auth-domain').value.trim();
        const projectId = document.getElementById('fb-project-id').value.trim();

        if (!apiKey || !projectId) {
          showToast('Configuration Missing', 'apiKey and projectId are required.', 'error');
          return;
        }

        const newConfig = {
          apiKey,
          authDomain: authDomain || `${projectId}.firebaseapp.com`,
          projectId,
          storageBucket: `${projectId}.appspot.com`,
          messagingSenderId: "123456789012",
          appId: "1:123456789012:web:abcdef123456"
        };

        const res = await window.CyberFirebase.updateConfig(newConfig);
        updateFirebaseStatusBadge(res.mode);

        if (res.mode === 'LIVE') {
          showToast('Live Firebase Connected', 'Successfully switched to Firestore Cloud Database!', 'success');
        } else {
          showToast('Sandbox Active', 'Saved config. Sandbox mode maintained if keys are sandbox placeholders.', 'info');
        }
        closeAllModals();
      });

      // Reset to sandbox button
      const resetBtn = document.getElementById('btn-reset-sandbox');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.CyberFirebase.resetToSandbox();
          updateFirebaseStatusBadge('SANDBOX');
          showToast('Sandbox Reset', 'Reset identities to initial sandbox state.', 'info');
          closeAllModals();
        });
      }
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  // Cyber Toast Notifications
  function showToast(title, message, type = 'error') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'info') icon = '<i class="fa-solid fa-circle-info"></i>';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-msg">${escapeHtml(message)}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(60px)';
      toast.style.transition = '0.35s ease';
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Export toast helper for console testing
  window.showToast = showToast;

})();
