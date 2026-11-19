/**
 * VIT STUDENT PORTAL - Registration Form Handler
 * Live roll number verification, password strength calculation,
 * atomic registration lock, and celebration modal logic.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to dashboard
    window.VitAuth.redirectIfLoggedIn();

    const form = document.getElementById('registration-form');
    const rollInput = document.getElementById('reg-roll-number');
    const rollFeedback = document.getElementById('roll-live-feedback');
    const nameInput = document.getElementById('reg-full-name');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    const campusSelect = document.getElementById('reg-campus');
    const deptSelect = document.getElementById('reg-department');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthLabel = document.getElementById('strength-label');
    const successModal = document.getElementById('registration-success-modal');
    const modalStudentName = document.getElementById('modal-student-name');
    const modalRollNumber = document.getElementById('modal-roll-number');

    if (!form) return;

    // Prefill from URL parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('roll')) {
      rollInput.value = urlParams.get('roll').toUpperCase();
      validateRollLive(rollInput.value);
    }
    if (urlParams.get('name')) nameInput.value = urlParams.get('name');
    if (urlParams.get('campus') && campusSelect) campusSelect.value = urlParams.get('campus');
    if (urlParams.get('dept') && deptSelect) deptSelect.value = urlParams.get('dept');

    // Roll input sanitization and live check
    let debounceTimer;
    rollInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        validateRollLive(e.target.value);
      }, 350);
    });

    function validateRollLive(roll) {
      if (!rollFeedback) return;
      if (!roll || roll.length < 5) {
        rollFeedback.style.display = 'none';
        rollInput.classList.remove('is-valid', 'is-invalid');
        return;
      }

      window.VitAPI.verifyRollNumber(roll).then((res) => {
        rollFeedback.style.display = 'block';
        if (!res.valid) {
          rollFeedback.className = 'input-feedback show-invalid';
          rollFeedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${res.message}`;
          rollInput.classList.add('is-invalid');
          rollInput.classList.remove('is-valid');
        } else if (res.isRegistered) {
          rollFeedback.className = 'input-feedback show-invalid';
          rollFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> This roll number is already claimed and registered.`;
          rollInput.classList.add('is-invalid');
          rollInput.classList.remove('is-valid');
        } else {
          rollFeedback.className = 'input-feedback show-valid';
          rollFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Approved roll number! Candidate: ${res.data.fullName}`;
          rollInput.classList.add('is-valid');
          rollInput.classList.remove('is-invalid');
          if (!nameInput.value && res.data.fullName) {
            nameInput.value = res.data.fullName;
          }
        }
      });
    }

    // Password Strength Meter
    passwordInput.addEventListener('input', (e) => {
      const val = e.target.value;
      const score = calculatePasswordStrength(val);
      updateStrengthUI(score);
    });

    function calculatePasswordStrength(pass) {
      let score = 0;
      if (pass.length >= 8) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[^A-Za-z0-9]/.test(pass)) score++;
      return score;
    }

    function updateStrengthUI(score) {
      if (!strengthBars.length || !strengthLabel) return;

      const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
      const labels = ['Weak', 'Moderate', 'Strong', 'Ultra Secure'];

      strengthBars.forEach((bar, idx) => {
        if (idx < score) {
          bar.style.backgroundColor = colors[score - 1];
        } else {
          bar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      });

      strengthLabel.innerText = score > 0 ? `Password Strength: ${labels[score - 1]}` : 'Password Strength: Min 8 chars';
      strengthLabel.style.color = score > 0 ? colors[score - 1] : 'var(--text-muted)';
    }

    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        if (targetInput) {
          if (targetInput.type === 'password') {
            targetInput.type = 'text';
            btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
          } else {
            targetInput.type = 'password';
            btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
          }
        }
      });
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = nameInput.value.trim();
      const rollNumber = rollInput.value.trim().toUpperCase();
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const campus = campusSelect ? campusSelect.value : 'Vellore';
      const department = deptSelect ? deptSelect.value : 'Computer Science & Engineering';

      // Validation Checks
      if (password !== confirmPassword) {
        window.showToast('Passwords do not match.', 'danger');
        confirmPasswordInput.focus();
        return;
      }

      if (calculatePasswordStrength(password) < 2) {
        window.showToast('Please choose a stronger password (minimum 8 characters).', 'danger');
        passwordInput.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Atomic Claim...';

      window.VitAPI.registerStudent({
        fullName,
        rollNumber,
        email,
        password,
        campus,
        department
      })
        .then((result) => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;

          // Populate success modal
          if (modalStudentName) modalStudentName.innerText = fullName;
          if (modalRollNumber) modalRollNumber.innerText = rollNumber;

          if (successModal) {
            successModal.classList.add('open');
          }

          // Trigger Confetti Celebration
          window.triggerSuccessCelebration();
          window.showToast('Registration Successful! Digital ID Generated.', 'success');
        })
        .catch((err) => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          window.showToast(err.message, 'danger');
        });
    });
  });
})();
