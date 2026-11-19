/**
 * VIT STUDENT PORTAL - Student Dashboard Logic
 * Manages user profile, dynamic 3D ID Card, QR Code generation, and verification certificates.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Session Guard
    const user = window.VitAuth.requireStudentAuth();
    if (!user) return;

    // Populate Student Profile Details
    const studentNameEls = document.querySelectorAll('.bind-student-name');
    const studentRollEls = document.querySelectorAll('.bind-student-roll');
    const studentEmailEls = document.querySelectorAll('.bind-student-email');
    const studentDeptEls = document.querySelectorAll('.bind-student-dept');
    const studentCampusEls = document.querySelectorAll('.bind-student-campus');
    const studentBatchEls = document.querySelectorAll('.bind-student-batch');
    const studentHashEls = document.querySelectorAll('.bind-student-hash');
    const studentRegDateEls = document.querySelectorAll('.bind-student-regdate');

    studentNameEls.forEach((el) => (el.innerText = user.fullName));
    studentRollEls.forEach((el) => (el.innerText = user.rollNumber));
    studentEmailEls.forEach((el) => (el.innerText = user.email));
    studentDeptEls.forEach((el) => (el.innerText = user.department || 'Computer Science & Engineering'));
    studentCampusEls.forEach((el) => (el.innerText = `VIT ${user.campus || 'Vellore'}`));
    studentBatchEls.forEach((el) => (el.innerText = user.batch || '2022 - 2026'));
    studentHashEls.forEach((el) => (el.innerText = user.verificationHash || 'VIT-SEC-AUTH-VALID'));

    if (user.registeredAt) {
      const regDate = new Date(user.registeredAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      studentRegDateEls.forEach((el) => (el.innerText = regDate));
    }

    // Generate Dynamic QR Code for Student ID
    const qrContainer = document.getElementById('student-id-qrcode');
    if (qrContainer && typeof QRCode !== 'undefined') {
      qrContainer.innerHTML = '';
      const verifyUrl = `${window.location.origin}/verify.html?roll=${user.rollNumber}`;
      new QRCode(qrContainer, {
        text: verifyUrl,
        width: 46,
        height: 46,
        colorDark: '#030712',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }

    // Download / Print Digital ID Card
    const printIdBtn = document.getElementById('btn-print-id');
    if (printIdBtn) {
      printIdBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Open Verification Slip Modal
    const slipBtn = document.getElementById('btn-view-slip');
    const slipModal = document.getElementById('verification-slip-modal');
    if (slipBtn && slipModal) {
      slipBtn.addEventListener('click', () => {
        slipModal.classList.add('open');
      });
    }

    // Close Modals
    document.querySelectorAll('.modal-close-btn, .modal-backdrop-close').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('open'));
      });
    });
  });
})();
