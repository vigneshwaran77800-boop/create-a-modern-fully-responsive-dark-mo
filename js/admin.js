/**
 * VIT STUDENT PORTAL - Administrator Console Logic
 * Handles roster metrics, student search, bulk CSV import, record export,
 * and roll number approval/invalidation.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Admin Session Guard
    const adminUser = window.VitAuth.requireAdminAuth();
    if (!adminUser) return;

    // Admin Info Binding
    const adminNameEl = document.getElementById('admin-display-name');
    if (adminNameEl) adminNameEl.innerText = adminUser.fullName;

    // DOM Elements
    const searchInput = document.getElementById('admin-search-input');
    const statusFilter = document.getElementById('admin-status-filter');
    const rosterTableBody = document.getElementById('admin-roster-tbody');
    const addRollForm = document.getElementById('add-roll-form');
    const addRollModal = document.getElementById('add-roll-modal');
    const csvModal = document.getElementById('csv-upload-modal');
    const csvFileInput = document.getElementById('csv-file-input');
    const csvPreviewArea = document.getElementById('csv-preview-area');
    const csvConfirmBtn = document.getElementById('btn-confirm-csv-import');
    const exportCsvBtn = document.getElementById('btn-export-csv');
    const auditLogsContainer = document.getElementById('admin-audit-logs');

    let parsedCsvData = [];

    // Refresh All Data
    function refreshAdminData() {
      renderMetrics();
      renderRoster();
      renderAuditLogs();
    }

    // 1. Render Metrics KPI
    function renderMetrics() {
      const approvedList = window.VitAPI.getApprovedRollNumbers();
      const students = window.VitAPI.getAllStudents();

      const totalApproved = approvedList.length;
      const totalRegistered = approvedList.filter((r) => r.isRegistered).length;
      const pendingClaims = totalApproved - totalRegistered;
      const rate = totalApproved > 0 ? Math.round((totalRegistered / totalApproved) * 100) : 0;

      const totalApprovedEl = document.getElementById('metric-total-approved');
      const totalRegisteredEl = document.getElementById('metric-total-registered');
      const pendingClaimsEl = document.getElementById('metric-pending-claims');
      const verificationRateEl = document.getElementById('metric-verification-rate');

      if (totalApprovedEl) totalApprovedEl.innerText = totalApproved;
      if (totalRegisteredEl) totalRegisteredEl.innerText = totalRegistered;
      if (pendingClaimsEl) pendingClaimsEl.innerText = pendingClaims;
      if (verificationRateEl) verificationRateEl.innerText = `${rate}%`;
    }

    // 2. Render Roster Table
    function renderRoster() {
      if (!rosterTableBody) return;

      const approvedList = window.VitAPI.getApprovedRollNumbers();
      const students = window.VitAPI.getAllStudents();
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const filter = statusFilter ? statusFilter.value : 'all';

      // Merge records
      const combinedRecords = approvedList.map((item) => {
        const student = students.find((s) => s.rollNumber === item.rollNumber);
        return {
          rollNumber: item.rollNumber,
          fullName: student ? student.fullName : item.fullName,
          email: student ? student.email : 'Pending Registration',
          department: item.department,
          campus: item.campus,
          isRegistered: item.isRegistered,
          registeredAt: student ? student.registeredAt : null,
          hash: student ? student.verificationHash : 'UNCLAIMED'
        };
      });

      // Filter
      const filtered = combinedRecords.filter((rec) => {
        const matchesQuery =
          rec.rollNumber.toLowerCase().includes(query) ||
          rec.fullName.toLowerCase().includes(query) ||
          rec.department.toLowerCase().includes(query) ||
          rec.campus.toLowerCase().includes(query);

        if (!matchesQuery) return false;

        if (filter === 'registered') return rec.isRegistered;
        if (filter === 'unclaimed') return !rec.isRegistered;
        return true;
      });

      if (filtered.length === 0) {
        rosterTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i class="fa-solid fa-magnifying-glass" style="font-size: 1.5rem; margin-bottom: 8px; display: block;"></i>
              No student records found matching the filter criteria.
            </td>
          </tr>
        `;
        return;
      }

      rosterTableBody.innerHTML = filtered
        .map((rec) => {
          const statusBadge = rec.isRegistered
            ? '<span class="glass-badge success"><i class="fa-solid fa-circle-check"></i> Registered</span>'
            : '<span class="glass-badge"><i class="fa-solid fa-clock"></i> Unclaimed</span>';

          return `
            <tr>
              <td><span class="roll-code">${rec.rollNumber}</span></td>
              <td style="font-weight: 600; color: #fff;">${rec.fullName}</td>
              <td style="font-family: var(--font-mono); font-size: 0.8rem;">${rec.email}</td>
              <td>${rec.department}</td>
              <td><i class="fa-solid fa-location-dot" style="color: var(--accent-gold-light);"></i> ${rec.campus}</td>
              <td>${statusBadge}</td>
              <td>
                <div style="display: flex; gap: 8px;">
                  <button class="btn-secondary btn-sm btn-icon-only btn-view-detail" data-roll="${rec.rollNumber}" title="View Details">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button class="btn-danger btn-sm btn-icon-only btn-delete-roll" data-roll="${rec.rollNumber}" title="Invalidate / Delete">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        })
        .join('');

      // Attach actions
      document.querySelectorAll('.btn-delete-roll').forEach((btn) => {
        btn.addEventListener('click', () => {
          const roll = btn.getAttribute('data-roll');
          if (confirm(`Are you sure you want to invalidate roll number ${roll}? This will revoke registration and credentials.`)) {
            window.VitAPI.deleteApprovedRollNumber(roll).then(() => {
              window.showToast(`Roll number ${roll} successfully removed.`, 'success');
              refreshAdminData();
            });
          }
        });
      });

      document.querySelectorAll('.btn-view-detail').forEach((btn) => {
        btn.addEventListener('click', () => {
          const roll = btn.getAttribute('data-roll');
          const target = combinedRecords.find((r) => r.rollNumber === roll);
          if (target) {
            alert(`STUDENT DOSSIER\n\nRoll: ${target.rollNumber}\nName: ${target.fullName}\nEmail: ${target.email}\nCampus: VIT ${target.campus}\nDepartment: ${target.department}\nStatus: ${target.isRegistered ? 'Verified Registered' : 'Unclaimed'}\nVerification Hash: ${target.hash}`);
          }
        });
      });
    }

    // 3. Render Audit Activity Logs
    function renderAuditLogs() {
      if (!auditLogsContainer) return;
      const logs = window.VitAPI.getAuditLogs();

      auditLogsContainer.innerHTML = logs
        .slice(0, 10)
        .map((log) => {
          const icon =
            log.type === 'REGISTRATION'
              ? '<i class="fa-solid fa-user-plus" style="color: var(--status-success);"></i>'
              : log.type === 'VERIFICATION'
              ? '<i class="fa-solid fa-shield-halved" style="color: var(--accent-cyan);"></i>'
              : '<i class="fa-solid fa-gear" style="color: var(--accent-gold-light);"></i>';

          const timeFormatted = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 10px;">
                ${icon}
                <span><strong>${log.type}</strong>: ${log.rollNumber || log.email || 'Event'}</span>
              </div>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${timeFormatted}</span>
            </div>
          `;
        })
        .join('');
    }

    // Event Listeners
    if (searchInput) searchInput.addEventListener('input', renderRoster);
    if (statusFilter) statusFilter.addEventListener('change', renderRoster);

    // Add Roll Number Form
    if (addRollForm) {
      addRollForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rollNumber = document.getElementById('new-roll-input').value.trim();
        const fullName = document.getElementById('new-name-input').value.trim();
        const campus = document.getElementById('new-campus-select').value;
        const department = document.getElementById('new-dept-select').value;
        const degree = document.getElementById('new-degree-input').value.trim();

        window.VitAPI.addApprovedRollNumber({ rollNumber, fullName, campus, department, degree })
          .then(() => {
            window.showToast(`Roll number ${rollNumber} added to approved registry!`, 'success');
            if (addRollModal) addRollModal.classList.remove('open');
            addRollForm.reset();
            refreshAdminData();
          })
          .catch((err) => {
            window.showToast(err.message, 'danger');
          });
      });
    }

    // Bulk CSV File Parser
    if (csvFileInput) {
      csvFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
          const text = event.target.result;
          parsedCsvData = parseCSVText(text);

          if (csvPreviewArea) {
            csvPreviewArea.innerHTML = `
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">
                Detected <strong>${parsedCsvData.length}</strong> student candidate records:
              </p>
              <div style="max-height: 140px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 8px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.75rem;">
                ${parsedCsvData.map((d) => `<div>${d.rollNumber} — ${d.fullName} (${d.campus})</div>`).join('')}
              </div>
            `;
          }
          if (csvConfirmBtn) csvConfirmBtn.disabled = false;
        };
        reader.readAsText(file);
      });
    }

    function parseCSVText(text) {
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      const records = [];
      const header = lines[0].toLowerCase();
      const startIndex = header.includes('roll') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim());
        if (parts[0]) {
          records.push({
            rollNumber: parts[0],
            fullName: parts[1] || 'Approved Candidate',
            campus: parts[2] || 'Vellore',
            department: parts[3] || 'Computer Science',
            degree: parts[4] || 'B.Tech'
          });
        }
      }
      return records;
    }

    // Confirm CSV Import
    if (csvConfirmBtn) {
      csvConfirmBtn.addEventListener('click', () => {
        if (!parsedCsvData.length) return;

        window.VitAPI.bulkAddApprovedRollNumbers(parsedCsvData).then((res) => {
          window.showToast(`Imported ${res.addedCount} new approved roll numbers! (${res.skippedCount} skipped as duplicate)`, 'success');
          if (csvModal) csvModal.classList.remove('open');
          csvFileInput.value = '';
          parsedCsvData = [];
          if (csvPreviewArea) csvPreviewArea.innerHTML = '';
          csvConfirmBtn.disabled = true;
          refreshAdminData();
        });
      });
    }

    // Export to CSV
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        const approvedList = window.VitAPI.getApprovedRollNumbers();
        const students = window.VitAPI.getAllStudents();

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'RollNumber,FullName,Email,Department,Campus,Status,VerificationHash\n';

        approvedList.forEach((r) => {
          const s = students.find((std) => std.rollNumber === r.rollNumber);
          const email = s ? s.email : 'N/A';
          const name = s ? s.fullName : r.fullName;
          const status = r.isRegistered ? 'Registered' : 'Unclaimed';
          const hash = s ? s.verificationHash : 'N/A';
          csvContent += `"${r.rollNumber}","${name}","${email}","${r.department}","${r.campus}","${status}","${hash}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `VIT_Student_Roster_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.showToast('Student roster exported to CSV.', 'success');
      });
    }

    // Modal Triggers
    const btnOpenAddRoll = document.getElementById('btn-open-add-roll');
    const btnOpenCsv = document.getElementById('btn-open-csv-upload');

    if (btnOpenAddRoll && addRollModal) {
      btnOpenAddRoll.addEventListener('click', () => addRollModal.classList.add('open'));
    }
    if (btnOpenCsv && csvModal) {
      btnOpenCsv.addEventListener('click', () => csvModal.classList.add('open'));
    }

    // Reset Demo Data
    const btnResetData = document.getElementById('btn-reset-demo-data');
    if (btnResetData) {
      btnResetData.addEventListener('click', () => {
        if (confirm('Reset all demo roll numbers and students to initial pristine state?')) {
          window.VitAPI.resetDemoData();
          window.showToast('Demo data restored to default pristine state.', 'info');
          refreshAdminData();
        }
      });
    }

    // Initial Execution
    refreshAdminData();
  });
})();
