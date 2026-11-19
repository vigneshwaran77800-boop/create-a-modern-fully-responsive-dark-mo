/**
 * VIT STUDENT PORTAL - Authentication & Session Guard Module
 * Handles login, session state, route protection, and credential autofill.
 */

(function () {
  'use strict';

  window.VitAuth = {
    // Check if user is authenticated
    isAuthenticated: function () {
      const user = window.VitAPI.getCurrentUser();
      return !!user;
    },

    // Get current session user
    getUser: function () {
      return window.VitAPI.getCurrentUser();
    },

    // Route Guard for Student Dashboard
    requireStudentAuth: function () {
      const user = this.getUser();
      if (!user) {
        window.location.href = 'login.html?redirect=dashboard.html';
        return null;
      }
      if (user.role === 'admin') {
        window.location.href = 'admin.html';
        return null;
      }
      return user;
    },

    // Route Guard for Admin Dashboard
    requireAdminAuth: function () {
      const user = this.getUser();
      if (!user) {
        window.location.href = 'login.html?role=admin&redirect=admin.html';
        return null;
      }
      if (user.role !== 'admin') {
        alert('Access Denied: Administrator clearance is required to view this portal.');
        window.location.href = 'dashboard.html';
        return null;
      }
      return user;
    },

    // Redirect already logged in user away from Login/Register
    redirectIfLoggedIn: function () {
      const user = this.getUser();
      if (user) {
        if (user.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      }
    },

    // Handle Logout
    logout: function () {
      window.VitAPI.logout().then(() => {
        window.location.href = 'login.html';
      });
    },

    // Update Navigation UI based on session
    updateNavState: function () {
      const user = this.getUser();
      const navUserArea = document.getElementById('nav-user-area');
      if (!navUserArea) return;

      if (user) {
        if (user.role === 'admin') {
          navUserArea.innerHTML = `
            <a href="admin.html" class="glass-badge gold" style="text-decoration:none;">
              <i class="fa-solid fa-shield"></i> Admin: ${user.fullName.split(' ')[0]}
            </a>
            <button onclick="window.VitAuth.logout()" class="btn-secondary btn-sm" title="Sign Out">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          `;
        } else {
          navUserArea.innerHTML = `
            <a href="dashboard.html" class="glass-badge success" style="text-decoration:none;">
              <i class="fa-solid fa-circle-user"></i> ${user.fullName.split(' ')[0]} (${user.rollNumber})
            </a>
            <button onclick="window.VitAuth.logout()" class="btn-secondary btn-sm" title="Sign Out">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          `;
        }
      } else {
        navUserArea.innerHTML = `
          <a href="login.html" class="btn-secondary btn-sm">
            <i class="fa-solid fa-lock"></i> Login
          </a>
          <a href="register.html" class="btn-primary btn-sm desktop-only">
            <i class="fa-solid fa-user-plus"></i> Register
          </a>
        `;
      }
    }
  };

  // Run update on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.VitAuth.updateNavState();
  });
})();
