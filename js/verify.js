/**
 * VIT STUDENT PORTAL - Roll Number Verification Logic
 * Validates roll numbers against the approved registry, checks registration status,
 * and renders high-security cryptographic status cards.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const verifyForm = document.getElementById('verify-form');
    const rollInput = document.getElementById('verify-roll-input');
    const resultContainer = document.getElementById('verify-result-container');
    const sampleChips = document.querySelectorAll('.sample-roll-chip');

    if (!rollInput) return;

    // Auto-uppercase and clean input
    rollInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
    });

    // Handle Quick Sample Chips
    sampleChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const roll = chip.getAttribute('data-roll');
        if (roll) {
          rollInput.value = roll;
          executeVerification(roll);
        }
      });
    });

    // Check URL parameters for direct verification: ?roll=21BCE1024
    const urlParams = new URLSearchParams(window.location.search);
    const initialRoll = urlParams.get('roll');
    if (initialRoll) {
      rollInput.value = initialRoll.toUpperCase();
      executeVerification(initialRoll);
    }

    // Form submit handler
    if (verifyForm) {
      verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const roll = rollInput.value.trim();
        executeVerification(roll);
      });
    }

    // Verification Executor
    function executeVerification(roll) {
      if (!roll) {
        window.showToast('Please enter a roll number to verify.', 'danger');
        return;
      }

      // Show loading state in result container
      if (resultContainer) {
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
          <div class="glass-panel" style="padding: 36px; text-align: center;">
            <div class="loader-crest-ring" style="width: 48px; height: 48px; margin: 0 auto 16px auto; position: relative;"></div>
            <p style="font-family: var(--font-display); font-size: 1.1rem; color: #fff;">Querying VIT Master Registry...</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 6px;">Verifying cryptographic claim for ${roll.toUpperCase()}</p>
          </div>
        `;
      }

      window.VitAPI.verifyRollNumber(roll)
        .then((response) => {
          renderVerificationResult(response);
        })
        .catch((err) => {
          console.error(err);
          if (resultContainer) {
            resultContainer.innerHTML = `
              <div class="status-card invalid">
                <div class="status-header-flex">
                  <div class="status-indicator-badge" style="color: var(--status-danger);">
                    <i class="fa-solid fa-triangle-exclamation"></i> Verification Error
                  </div>
                </div>
                <p style="color: var(--text-secondary);">${err.message || 'System verification failed.'}</p>
              </div>
            `;
          }
        });
    }

    // Render Status Card
    function renderVerificationResult(res) {
      if (!resultContainer) return;

      if (!res.valid) {
        // Invalid or Unrecognized Roll Number
        resultContainer.innerHTML = `
          <div class="status-card invalid">
            <div class="status-header-flex">
              <div class="status-indicator-badge" style="color: var(--status-danger);">
                <i class="fa-solid fa-circle-xmark"></i> Invalid Roll Number
              </div>
              <span class="glass-badge danger">NOT APPROVED</span>
            </div>
            
            <p style="color: var(--text-primary); font-size: 1.05rem; margin-bottom: 16px; font-weight: 600;">
              ${res.message}
            </p>

            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px; line-height: 1.6;">
              The provided identifier was not found in the Deanery of Academic Admissions roster.
              Only candidates with an authorized VIT seat allocation can register.
            </p>

            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="https://vit.ac.in" target="_blank" class="btn-secondary btn-sm">
                <i class="fa-solid fa-building-columns"></i> Contact Admissions Office
              </a>
              <button onclick="document.getElementById('verify-roll-input').focus();" class="btn-secondary btn-sm">
                <i class="fa-solid fa-magnifying-glass"></i> Try Another Roll Number
              </button>
            </div>
          </div>
        `;
        return;
      }

      if (res.isRegistered) {
        // Valid & Already Registered Student
        const d = res.data;
        resultContainer.innerHTML = `
          <div class="status-card valid-registered">
            <div class="status-header-flex">
              <div class="status-indicator-badge" style="color: var(--accent-cyan);">
                <i class="fa-solid fa-shield-halved"></i> Verified Registered Student
              </div>
              <span class="glass-badge">ACTIVE ENROLLMENT</span>
            </div>

            <p style="color: #ffffff; font-size: 1rem; margin-bottom: 20px; font-weight: 500;">
              This roll number is securely registered and verified in the VIT Student Information System.
            </p>

            <div class="status-details-grid">
              <div class="detail-row">
                <span class="detail-label">Roll Number</span>
                <span class="detail-val" style="font-family: var(--font-mono); color: var(--accent-cyan);">${d.rollNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Student Name (Protected)</span>
                <span class="detail-val">${d.maskedName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Campus</span>
                <span class="detail-val"><i class="fa-solid fa-location-dot" style="color: var(--accent-gold-light);"></i> ${d.campus}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Department & Degree</span>
                <span class="detail-val">${d.degree} — ${d.department}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Academic Batch</span>
                <span class="detail-val">${d.batch || '2022-2026'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Verification Hash</span>
                <span class="detail-val" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan);">${d.verificationHash}</span>
              </div>
            </div>

            <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
              <a href="login.html" class="btn-primary btn-sm">
                <i class="fa-solid fa-right-to-bracket"></i> Login to Portal
              </a>
              <span style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--font-mono);">
                <i class="fa-solid fa-lock"></i> Sensitive student credentials remain encrypted.
              </span>
            </div>
          </div>
        `;
      } else {
        // Valid & Available for Student Registration
        const d = res.data;
        resultContainer.innerHTML = `
          <div class="status-card valid-unregistered">
            <div class="status-header-flex">
              <div class="status-indicator-badge" style="color: var(--status-success);">
                <i class="fa-solid fa-circle-check"></i> Approved & Ready for Registration
              </div>
              <span class="glass-badge success">AVAILABLE TO CLAIM</span>
            </div>

            <p style="color: #ffffff; font-size: 1.05rem; margin-bottom: 20px; font-weight: 500;">
              Congratulations! Your roll number is authorized by the VIT Deanery. You may now complete your registration.
            </p>

            <div class="status-details-grid">
              <div class="detail-row">
                <span class="detail-label">Approved Roll Number</span>
                <span class="detail-val" style="font-family: var(--font-mono); color: var(--status-success);">${d.rollNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Candidate Name</span>
                <span class="detail-val">${d.fullName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Campus Allocation</span>
                <span class="detail-val"><i class="fa-solid fa-location-dot" style="color: var(--accent-gold-light);"></i> VIT ${d.campus}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Allotted Degree / Program</span>
                <span class="detail-val">${d.degree} (${d.department})</span>
              </div>
            </div>

            <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
              <a href="register.html?roll=${encodeURIComponent(d.rollNumber)}&name=${encodeURIComponent(d.fullName)}&campus=${encodeURIComponent(d.campus)}&dept=${encodeURIComponent(d.department)}" class="btn-primary">
                <i class="fa-solid fa-user-plus"></i> Claim Roll & Complete Registration <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        `;
      }
    }
  });
})();
