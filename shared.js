/* ==========================================
   FuturePath AI - Shared Core Utilities & UI Handlers
   ========================================== */

// 1. Unified Toast Notification System
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  } else {
    iconSvg = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Auto remove toast using fade-out keyframes
  setTimeout(() => {
    toast.style.animation = 'fade-out 0.3s ease-out forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// 2. Unified Button Ripple Effect
function createRipple(e, element) {
  const rect = element.getBoundingClientRect();
  const rippleContainer = element.querySelector('.btn-ripple-container') || element;
  
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  rippleContainer.appendChild(ripple);

  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
}

// 3. Document DOMContentLoaded UI Bindings
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Sidebar Drawer Toggle
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== sidebarToggle) {
        sidebar.classList.remove('active');
      }
    });
  }

  // Logout Trigger Flow
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      showToast('Logging out of your account... Redirecting to Sign In.', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    });
  }

  // Mock Menu coming-soon toasts for non-implemented links
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === '#' || href === '') {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const text = item.querySelector('span') ? item.querySelector('span').textContent : 'This feature';
        showToast(`${text} is mocked for demo purposes. Complete launch is coming soon!`, 'success');
      });
    }
  });
});
