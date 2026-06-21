/* ==========================================
   FuturePath AI - Dashboard Interactivity
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  const markReadBtn = document.querySelector('.mark-read');
  const bellBadge = document.querySelector('.bell-badge');
  
  const searchInput = document.getElementById('searchInput');
  const categoriesGrid = document.getElementById('categoriesGrid');
  const categoryCards = document.querySelectorAll('.category-card');
  
  const startPredictionBtn = document.getElementById('startPredictionBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const toastContainer = document.getElementById('toastContainer');



  /* ==========================================
     Alert / Notification Dropdown
     ========================================== */
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('active');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (notificationDropdown.classList.contains('active') && !notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationDropdown.classList.remove('active');
      }
    });
  }

  if (markReadBtn && bellBadge) {
    markReadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Clear badge
      bellBadge.style.display = 'none';
      // Mark all read visually
      const unreadItems = document.querySelectorAll('.notification-item.unread');
      unreadItems.forEach(item => {
        item.classList.remove('unread');
        const bullet = item.querySelector('.notif-bullet');
        if (bullet) bullet.classList.add('font-empty');
      });
      showToast('All notifications marked as read.', 'success');
    });
  }

  /* ==========================================
     Search filter for Career Cards
     ========================================== */
  if (searchInput && categoriesGrid) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let matchesFound = 0;

      categoryCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const desc = card.querySelector('.category-description').textContent.toLowerCase();
        
        if (title.includes(query) || desc.includes(query)) {
          card.style.display = 'flex';
          matchesFound++;
        } else {
          card.style.display = 'none';
        }
      });

      // Handle "No results found" card injection if query is long
      const existingNoResults = document.getElementById('noResultsCard');
      if (matchesFound === 0) {
        if (!existingNoResults) {
          const noResults = document.createElement('div');
          noResults.id = 'noResultsCard';
          noResults.className = 'category-card';
          noResults.style.gridColumn = '1 / -1';
          noResults.style.textAlign = 'center';
          noResults.style.padding = '3rem';
          noResults.style.display = 'flex';
          noResults.style.flexDirection = 'column';
          noResults.style.alignItems = 'center';
          noResults.style.gap = '1rem';
          noResults.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="width: 48px; height: 48px;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <h4 style="font-weight:800; font-size: 1.15rem; color:var(--color-text);">No Career Trajectories Found</h4>
            <p style="font-size: 0.85rem; color:var(--color-text-muted); max-width: 320px;">We couldn't find any career categories matching "${e.target.value}". Try checking the spelling or searching other disciplines.</p>
          `;
          categoriesGrid.appendChild(noResults);
        }
      } else {
        if (existingNoResults) existingNoResults.remove();
      }
    });
  }

  /* ==========================================
     Quick Action Prediction Start Simulation
     ========================================== */
  if (startPredictionBtn) {
    startPredictionBtn.addEventListener('click', (e) => {
      createRipple(e, startPredictionBtn);
      
      startPredictionBtn.disabled = true;
      showToast('Initializing AI career assessment engine...', 'success');

      setTimeout(() => {
        window.location.href = 'prediction.html';
      }, 1200);
    });
  }

  // Explore Trajectory mock alerts
  const exploreLinks = document.querySelectorAll('.explore-path-link');
  exploreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const careerName = link.closest('.category-card').querySelector('.category-title').textContent;
      showToast(`Loading path details, syllabus checklists, and jobs for: ${careerName}`, 'success');
    });
  });

  // Table report mock alerts
  const reportBtns = document.querySelectorAll('.view-report-btn');
  reportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const careerTitle = btn.closest('tr').querySelector('td span').textContent;
      showToast(`Retrieving comprehensive career assessment report for: ${careerTitle}`, 'success');
    });
  });

  /* ==========================================
     Dynamic Model Insights Integration
     ========================================== */
  const API_INSIGHTS_URL = "http://127.0.0.1:5000/model-insights";

  function loadModelInsights() {
    const datasetSizeEl = document.getElementById("insight-dataset-size");
    const trainSizeEl = document.getElementById("insight-train-size");
    const trainPctEl = document.getElementById("insight-train-pct");
    const testSizeEl = document.getElementById("insight-test-size");
    const testPctEl = document.getElementById("insight-test-pct");
    const accuracyEl = document.getElementById("insight-accuracy");

    if (!datasetSizeEl) return;

    fetch(API_INSIGHTS_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "success" && data.insights) {
          const insights = data.insights;
          
          datasetSizeEl.innerHTML = `${insights.dataset_size} <span class="metric-unit">Records</span>`;
          trainSizeEl.innerHTML = `${insights.training_size} <span class="metric-unit">Records</span>`;
          testSizeEl.innerHTML = `${insights.testing_size} <span class="metric-unit">Records</span>`;
          
          const trainPct = Math.round((insights.training_size / insights.dataset_size) * 100);
          const testPct = Math.round((insights.testing_size / insights.dataset_size) * 100);
          
          if (trainPctEl) trainPctEl.textContent = `${trainPct}%`;
          if (testPctEl) testPctEl.textContent = `${testPct}%`;
          
          if (accuracyEl) accuracyEl.textContent = `${insights.accuracy}%`;
        }
      })
      .catch(err => {
        console.warn("Backend insights fetch failed, using default display values:", err);
      });
  }

  loadModelInsights();

});
