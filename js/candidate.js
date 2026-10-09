document.addEventListener("DOMContentLoaded", () => {
  // Load candidate profile state — fall back to hardcoded data
  let profile = JSON.parse(localStorage.getItem("profileData")) || JobSphereData.candidateProfile;

  // Ensure profile has required nested objects
  if (!profile.settings) {
    profile.settings = { notifyEmail: true, profileVisibility: true, alertMatches: true };
  }
  if (!profile.activities) profile.activities = [];
  if (!profile.notifications) profile.notifications = [];
  if (!profile.appliedJobs) profile.appliedJobs = [];
  if (!profile.premiumPlan) profile.premiumPlan = { active: false, plan: "free" };

  // Enforce session access
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedUser || loggedUser.role !== "candidate") {
    window.location.href = "login.html";
    return;
  }

  // Sync profile name with logged-in user
  profile.name = loggedUser.name;
  if (profile.avatar === "AL" || profile.avatar === "AM") {
    profile.avatar = profile.name.substring(0, 2).toUpperCase();
  }

  // Handle Logout
  const logoutBtn = document.getElementById("btn-candidate-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }

  // Sync applied count to actual array length on load
  profile.stats.applied = profile.appliedJobs.length;

  // Initial render
  updateDashboardHeader(profile);
  renderDashboardContent(profile);

  // ─── SIDEBAR TOGGLE (mobile) ────────────────────────────────────────────────
  const sidebar = document.getElementById("dashboard-sidebar");
  const toggleBtn = document.getElementById("sidebar-toggle");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => sidebar.classList.toggle("show"));
  }

  // Close sidebar on link click (mobile)
  document.querySelectorAll(".sidebar-link").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 991.98 && sidebar) sidebar.classList.remove("show");
    });
  });

  // ─── TAB SWITCHING ──────────────────────────────────────────────────────────
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const viewId = this.getAttribute("data-view");
      if (!viewId) return;

      links.forEach(l => l.classList.remove("active"));
      this.classList.add("active");

      document.querySelectorAll(".dashboard-view-panel").forEach(p => p.classList.add("d-none"));
      const targetPanel = document.getElementById(`panel-${viewId}`);
      if (targetPanel) targetPanel.classList.remove("d-none");

      if (viewId === "dashboard") renderDashboardContent(profile);
      else if (viewId === "profile") initProfileForm(profile);
      else if (viewId === "applied") renderAppliedJobs(profile);
      else if (viewId === "saved") renderSavedJobs(profile);
      else if (viewId === "notifications") renderNotifications(profile);
      else if (viewId === "settings") initSettings(profile);
    });
  });

  // ─── CHARTS ─────────────────────────────────────────────────────────────────
  let barChart, doughnutChart;
  initCharts();

  window.addEventListener("themeChanged", (e) => updateChartsTheme(e.detail.isDark));

  // ─── RESUME VISIBILITY TOGGLE ────────────────────────────────────────────────
  const toggleVisibilityBtn = document.getElementById("btn-change-resume-visibility");
  if (toggleVisibilityBtn) {
    toggleVisibilityBtn.addEventListener("click", () => {
      if (!profile.resumeStatus) {
        profile.resumeStatus = {
          uploaded: true,
          filename: "resume.pdf",
          lastUpdated: "June 15, 2026",
          visibility: "Recruiters Only"
        };
      }
      const cycleMap = { "Recruiters Only": "Public", "Public": "Private", "Private": "Recruiters Only" };
      profile.resumeStatus.visibility = cycleMap[profile.resumeStatus.visibility] || "Recruiters Only";
      localStorage.setItem("profileData", JSON.stringify(profile));
      renderDashboardContent(profile);
      updateDashboardHeader(profile);
      showToast(`Resume visibility set to: ${profile.resumeStatus.visibility}`);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  function updateDashboardHeader(prof) {
    // Sync counts from source of truth
    const savedIds = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    prof.stats.saved = savedIds.length;
    prof.stats.applied = prof.appliedJobs.length;

    document.querySelectorAll(".candidate-name").forEach(el => el.innerText = prof.name);
    document.querySelectorAll(".candidate-title").forEach(el => el.innerText = prof.title);
    document.querySelectorAll(".candidate-avatar").forEach(el => el.innerText = prof.avatar || prof.name.substring(0, 2).toUpperCase());

    const safeSet = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    safeSet("stat-applied-count", prof.stats.applied);
    safeSet("stat-saved-count", prof.stats.saved);
    safeSet("stat-interviews-count", prof.stats.interviews);
    safeSet("stat-offers-count", prof.stats.offers);
  }

  // ─────────────────────────────────────────────────────────────────────────
  function renderDashboardContent(prof) {

    // Profile completion bar
    const progressText = document.getElementById("profile-progress-text");
    const progressBar = document.getElementById("profile-progress-bar");
    if (progressText && progressBar) {
      progressText.innerText = `${prof.completionPercentage}%`;
      progressBar.style.width = `${prof.completionPercentage}%`;
      progressBar.setAttribute("aria-valuenow", prof.completionPercentage);
    }

    // Premium Plan Display
    const premiumContainer = document.getElementById("premium-plan-container");
    const upgBtn = document.getElementById("btn-upgrade-premium");

    if (premiumContainer && prof.premiumPlan) {
      if (prof.premiumPlan.active) {
        let planLabel = prof.premiumPlan.plan === "1-year" ? "1 Year" : "6 Months";
        let expiryText = "";

        if (prof.premiumPlan.expiryDate) {
          const expiryDateObj = new Date(prof.premiumPlan.expiryDate);
          expiryText = `<p class="text-muted mb-1 fs-7">Expiry Date: <span class="fw-bold">${expiryDateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>`;
        }

        premiumContainer.innerHTML = `
          <h5 class="fw-bold mb-2 text-main">
            <i class="bi bi-patch-check-fill text-warning me-2"></i>Premium Membership Active
            <span class="badge bg-warning text-dark ms-2 fs-9 align-middle">PRO</span>
          </h5>
          <p class="text-muted mb-1 fs-7">Current Plan: <span class="text-success fw-bold text-capitalize">${planLabel}</span></p>
          <p class="text-muted mb-1 fs-7">Membership Status: <span class="text-success fw-bold">Active</span></p>
          ${expiryText}
          <div class="text-success mt-2 fs-8 fw-semibold"><i class="bi bi-check-circle-fill me-1"></i>Premium Benefits Enabled</div>
        `;
        if (upgBtn) upgBtn.style.display = "none";
      } else {
        premiumContainer.innerHTML = `
          <h5 class="fw-bold mb-2 text-main">Free Membership</h5>
          <p class="text-muted mb-2 fs-7">You are currently on Free Membership. Upgrade to unlock:</p>
          <ul class="list-unstyled mb-0 fs-8 text-muted">
            <li><i class="bi bi-check text-primary me-1"></i>Premium Jobs</li>
            <li><i class="bi bi-check text-primary me-1"></i>Placement Drives</li>
            <li><i class="bi bi-check text-primary me-1"></i>Better Visibility</li>
            <li><i class="bi bi-check text-primary me-1"></i>Premium Support</li>
          </ul>
        `;
        if (upgBtn) upgBtn.style.display = "inline-block";
      }
    }

    // Toggle Premium features row visibility based on plan status
    const premiumFeaturesRow = document.getElementById("premium-features-row");
    if (premiumFeaturesRow) {
      if (prof.premiumPlan && prof.premiumPlan.active) {
        premiumFeaturesRow.classList.remove("d-none");
      } else {
        premiumFeaturesRow.classList.add("d-none");
      }
    }

    // Academic summary
    const academicSummary = document.getElementById("profile-academic-summary");
    if (academicSummary) {
      if (prof.education) {
        academicSummary.innerHTML = `
          <strong>College:</strong> ${prof.education.college || "Not Provided"}<br>
          <strong>Degree:</strong> ${prof.education.degree || "Not Provided"} (${prof.education.branch || "Not Provided"}) &bull; CGPA: ${prof.education.cgpa || "Not Provided"}<br>
          <strong>Pref. Location:</strong> ${prof.location || "Not Provided"}
        `;
      } else {
        academicSummary.innerHTML = `
          <strong>Education:</strong> Not Provided<br>
          <strong>Preferred Role:</strong> ${prof.title || "Not Provided"}<br>
          <strong>Pref. Location:</strong> ${prof.location || "Not Provided"}
        `;
      }
    }

    // Resume Status widget
    const resumeNameEl = document.getElementById("resume-uploaded-name");
    const resumeDateEl = document.getElementById("resume-updated-date");
    const resumeVisEl = document.getElementById("resume-visibility-status");

    if (resumeNameEl && resumeDateEl && resumeVisEl) {
      const rStat = prof.resumeStatus || {
        uploaded: true, filename: "resume.pdf",
        lastUpdated: "June 15, 2026", visibility: "Recruiters Only"
      };
      resumeNameEl.innerText = rStat.filename;
      resumeDateEl.innerText = rStat.lastUpdated;
      resumeVisEl.innerText = rStat.visibility;

      const badgeMap = {
        "Public": "badge bg-success bg-opacity-10 text-success text-nowrap",
        "Private": "badge bg-danger  bg-opacity-10 text-danger  text-nowrap",
        "Recruiters Only": "badge bg-primary bg-opacity-10 text-primary text-nowrap"
      };
      resumeVisEl.className = badgeMap[rStat.visibility] || badgeMap["Recruiters Only"];
    }

    // Recommended jobs
    const recContainer = document.getElementById("recommended-jobs-container");
    if (recContainer) {
      const recommended = JobSphereData.jobs.slice(0, 2);
      recContainer.innerHTML = recommended.map(job => `
        <div class="glass-card p-3 mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <span class="fw-bold fs-7 d-block text-main">${job.title}</span>
            <span class="text-muted small">${job.companyName} &bull; ${job.location}</span>
            <div class="mt-2">
              <span class="badge bg-primary bg-opacity-10 text-primary px-2 py-1 fs-9">${job.type}</span>
              <span class="text-primary fw-semibold fs-8 ms-2">$${(job.salary / 1000).toFixed(0)}k/yr</span>
            </div>
          </div>
          <a href="job-details.html?id=${job.id}" class="btn btn-premium-primary py-2 px-3 fs-8">View</a>
        </div>
      `).join("");
    }

    // Activity timeline
    const actContainer = document.getElementById("activity-timeline-container");
    if (actContainer) {
      if (!prof.activities || prof.activities.length === 0) {
        actContainer.innerHTML = `<p class="text-muted fs-7 text-center py-3">No recent activity yet.</p>`;
      } else {
        actContainer.innerHTML = prof.activities.slice(0, 5).map(act => `
          <div class="timeline-activity">
            <div class="timeline-dot"></div>
            <span class="fs-7 fw-semibold text-main d-block">${act.text}</span>
            <span class="text-muted fs-8">${act.time}</span>
          </div>
        `).join("");
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  function initProfileForm(prof) {
    const safeVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };

    safeVal("prof-name", prof.name);
    safeVal("prof-title", prof.title);
    safeVal("prof-location", prof.location);
    safeVal("prof-skills", prof.skills ? prof.skills.join(", ") : "React, TypeScript, CSS");
    safeVal("prof-email", loggedUser.email);

    const form = document.getElementById("profileForm");
    if (!form) return;

    // Use onsubmit (not addEventListener) to prevent duplicate listeners
    form.onsubmit = function (e) {
      e.preventDefault();

      const getVal = (id) => (document.getElementById(id)?.value || "").trim();

      prof.name = getVal("prof-name");
      prof.title = getVal("prof-title");
      prof.location = getVal("prof-location");

      const rawSkills = getVal("prof-skills");
      prof.skills = rawSkills.split(",").map(s => s.trim()).filter(Boolean);
      prof.avatar = prof.name.substring(0, 2).toUpperCase();
      prof.completionPercentage = 100;

      localStorage.setItem("profileData", JSON.stringify(prof));
      updateDashboardHeader(prof);
      showToast("Profile updated successfully!");

      document.querySelector('[data-view="dashboard"]')?.click();
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  function renderAppliedJobs(prof) {
    const tableBody = document.getElementById("applied-table-body");
    if (!tableBody) return;

    const searchEl = document.getElementById("search-applied-input");

    const renderFiltered = (query = "") => {
      const q = query.toLowerCase().trim();
      const filtered = q
        ? prof.appliedJobs.filter(app =>
          app.title.toLowerCase().includes(q) ||
          app.company.toLowerCase().includes(q) ||
          app.status.toLowerCase().includes(q))
        : prof.appliedJobs;

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" class="py-5 text-center border-0">
              <i class="bi bi-send-x display-3 d-block mb-3 text-muted" style="opacity:0.35;"></i>
              <h6 class="fw-bold text-main mb-1">${q ? "No Results Found" : "No Applications Yet"}</h6>
              <p class="text-muted small mb-3 mx-auto" style="max-width:280px;">
                ${q ? "No applications match that search. Try different keywords." : "Start applying to jobs to track your progress here."}
              </p>
              ${!q ? '<a href="jobs.html" class="btn btn-premium-primary py-2 fs-8 px-4">Browse Jobs</a>' : ""}
            </td>
          </tr>`;
        return;
      }

      const statusConfig = {
        "Interviewing": "bg-warning text-dark",
        "Under Review": "bg-info text-dark",
        "Applied": "bg-primary text-white",
        "Offer Extended": "bg-success text-white"
      };

      tableBody.innerHTML = filtered.map(app => {
        const badgeCls = statusConfig[app.status] || "bg-secondary text-white";
        return `
          <tr>
            <td class="fw-bold text-main">${app.title}</td>
            <td>${app.company}</td>
            <td>${app.date}</td>
            <td><span class="badge ${badgeCls} px-3 py-2 text-capitalize">${app.status}</span></td>
            <td>
              <button class="btn btn-sm btn-outline-danger py-1 px-2 fs-8 withdraw-btn" data-id="${app.id}"
                title="Withdraw this application">
                <i class="bi bi-x-circle me-1"></i>Withdraw
              </button>
            </td>
          </tr>`;
      }).join("");

      // Wire withdraw buttons
      tableBody.querySelectorAll(".withdraw-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          const jobId = parseInt(this.getAttribute("data-id"));
          if (!confirm("Are you sure you want to withdraw this application?")) return;

          const removed = prof.appliedJobs.find(a => a.id === jobId);
          prof.appliedJobs = prof.appliedJobs.filter(a => a.id !== jobId);
          prof.stats.applied = prof.appliedJobs.length;

          if (removed) {
            prof.activities.unshift({
              text: `Withdrew application for '${removed.title}' at ${removed.company}`,
              time: "Just now"
            });
          }

          localStorage.setItem("profileData", JSON.stringify(prof));
          updateDashboardHeader(prof);
          showToast("Application withdrawn.", "info");
          renderFiltered(searchEl ? searchEl.value : "");
        });
      });
    };

    renderFiltered();
    if (searchEl) searchEl.oninput = (e) => renderFiltered(e.target.value);
  }

  // ─────────────────────────────────────────────────────────────────────────
  function renderSavedJobs(prof) {
    const container = document.getElementById("saved-jobs-list");
    if (!container) return;

    const searchEl = document.getElementById("search-saved-input");
    const savedIds = JSON.parse(localStorage.getItem("savedJobs") || "[]");

    // Build mutable array of saved job objects
    const savedJobObjects = JobSphereData.jobs.filter(j => savedIds.includes(j.id));

    const renderFiltered = (query = "") => {
      const q = query.toLowerCase().trim();
      const filtered = q
        ? savedJobObjects.filter(job =>
          job.title.toLowerCase().includes(q) ||
          job.companyName.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.type.toLowerCase().includes(q))
        : savedJobObjects;

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-12">
            <div class="glass-card text-center p-5">
              <i class="bi bi-bookmark-x display-3 d-block mb-3 text-muted" style="opacity:0.35;"></i>
              <h6 class="fw-bold text-main mb-1">${q ? "No Results Found" : "No Saved Jobs Yet"}</h6>
              <p class="text-muted small mb-3 mx-auto" style="max-width:280px;">
                ${q ? "No saved jobs match that search." : "Discover roles and bookmark them to revisit later."}
              </p>
              ${!q ? '<a href="jobs.html" class="btn btn-premium-primary py-2 fs-8 px-4">Browse Vacancies</a>' : ""}
            </div>
          </div>`;
        return;
      }

      container.innerHTML = filtered.map(job => `
        <div class="col-md-6 mb-3" id="saved-job-card-${job.id}">
          <div class="glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="company-logo-wrapper">${job.logoText}</div>
                <button class="btn btn-outline-danger btn-sm border-0 remove-saved-btn" data-id="${job.id}" aria-label="Remove saved job">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <h5 class="fw-bold text-main mb-1">${job.title}</h5>
              <span class="text-muted fs-8 d-block mb-3">${job.companyName} &bull; ${job.location}</span>
            </div>
            <div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fw-bold text-primary">$${job.salary.toLocaleString()}/yr</span>
                <span class="badge bg-secondary bg-opacity-10 text-muted px-2 py-1 text-capitalize fs-8">${job.type}</span>
              </div>
              <div class="row g-2">
                <div class="col-6">
                  <a href="job-details.html?id=${job.id}" class="btn btn-premium-secondary w-100 py-2 fs-8 text-center">Details</a>
                </div>
                <div class="col-6">
                  <a href="job-details.html?id=${job.id}&apply=true" class="btn btn-premium-primary w-100 py-2 fs-8 text-center">Apply</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join("");

      // Wire remove buttons
      container.querySelectorAll(".remove-saved-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          const removeId = parseInt(this.getAttribute("data-id"));
          let savedList = JSON.parse(localStorage.getItem("savedJobs") || "[]");
          savedList = savedList.filter(id => id !== removeId);
          localStorage.setItem("savedJobs", JSON.stringify(savedList));

          // Update in-memory array
          const idx = savedJobObjects.findIndex(j => j.id === removeId);
          if (idx > -1) savedJobObjects.splice(idx, 1);

          // Remove card from DOM
          document.getElementById(`saved-job-card-${removeId}`)?.remove();
          updateDashboardHeader(profile);

          // If grid is now empty, show empty state
          if (savedJobObjects.length === 0) renderFiltered(searchEl ? searchEl.value : "");
        });
      });
    };

    renderFiltered();
    if (searchEl) searchEl.oninput = (e) => renderFiltered(e.target.value);
  }

  // ─────────────────────────────────────────────────────────────────────────
  function renderNotifications(prof) {
    const list = document.getElementById("notifications-list");
    if (!list) return;

    // Mark All Read button
    const markAllBtn = document.getElementById("btn-mark-all-read");
    if (markAllBtn) {
      markAllBtn.onclick = () => {
        prof.notifications.forEach(n => n.read = true);
        localStorage.setItem("profileData", JSON.stringify(prof));
        showToast("All notifications marked as read.");
        renderNotifications(prof);
      };
    }

    if (!prof.notifications || prof.notifications.length === 0) {
      list.innerHTML = `
        <div class="glass-card text-center p-5">
          <i class="bi bi-bell-slash display-3 d-block mb-3 text-muted" style="opacity:0.35;"></i>
          <h6 class="fw-bold text-main mb-1">No Notifications</h6>
          <p class="text-muted small">You're all caught up! New alerts will appear here.</p>
        </div>`;
      return;
    }

    list.innerHTML = prof.notifications.map(notif => {
      const dot = notif.read ? "" : `<span class="badge bg-danger rounded-circle me-2 flex-shrink-0" style="width:8px;height:8px;padding:0;vertical-align:middle;"></span>`;
      const wrapCls = notif.read ? "opacity-75" : "";
      const markBtn = notif.read ? "" : `<button class="btn btn-sm btn-outline-primary py-0 px-3 fs-8 mark-read-btn" data-id="${notif.id}">Mark Read</button>`;

      return `
        <div class="glass-card p-3 mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2 ${wrapCls}">
          <div class="d-flex align-items-center gap-2 flex-grow-1">
            ${dot}
            <div>
              <span class="text-main fs-7 ${notif.read ? "" : "fw-semibold"}">${notif.text}</span>
              <span class="text-muted fs-8 d-block mt-1">${notif.time}</span>
            </div>
          </div>
          <div class="flex-shrink-0">${markBtn}</div>
        </div>`;
    }).join("");

    // Wire mark-read buttons
    list.querySelectorAll(".mark-read-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const notifId = parseInt(this.getAttribute("data-id"));
        const target = prof.notifications.find(n => n.id === notifId);
        if (target) {
          target.read = true;
          localStorage.setItem("profileData", JSON.stringify(prof));
          renderNotifications(prof);
        }
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  function initSettings(prof) {
    if (!prof.settings) {
      prof.settings = { notifyEmail: true, profileVisibility: true, alertMatches: true };
    }

    const bindToggle = (id, key, label) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.checked = prof.settings[key] !== false;
      el.onchange = () => {
        prof.settings[key] = el.checked;
        localStorage.setItem("profileData", JSON.stringify(prof));
        showToast(`${label} ${el.checked ? "enabled" : "disabled"}.`);
      };
    };

    bindToggle("notifyEmail", "notifyEmail", "Email notifications");
    bindToggle("profileVisibility", "profileVisibility", "Profile visibility");
    bindToggle("alertMatches", "alertMatches", "Immediate alerts");
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  TOAST NOTIFICATION (replaces browser alert())
  // ─────────────────────────────────────────────────────────────────────────
  function showToast(message, type = "success") {
    document.querySelector(".js-dashboard-toast")?.remove();

    const iconMap = { success: "bi-check-circle-fill text-success", info: "bi-info-circle-fill text-primary" };
    const icon = iconMap[type] || iconMap.success;

    const toast = document.createElement("div");
    toast.className = "js-dashboard-toast position-fixed bottom-0 end-0 m-4 glass-card px-4 py-3 d-flex align-items-center gap-3 shadow-lg";
    toast.style.cssText = "z-index:9999;border-left:4px solid var(--primary-color);min-width:280px;max-width:380px;animation:slideInToast .25s ease;";
    toast.innerHTML = `
      <i class="bi ${icon} fs-5 flex-shrink-0"></i>
      <span class="text-main fs-7 flex-grow-1">${message}</span>
      <button type="button" class="btn-close btn-sm ms-auto" style="font-size:.65rem;" aria-label="Close"></button>
    `;

    document.body.appendChild(toast);
    toast.querySelector(".btn-close").onclick = () => toast.remove();
    setTimeout(() => {
      toast.style.transition = "opacity .35s";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  CHARTS
  // ─────────────────────────────────────────────────────────────────────────
  function initCharts() {
    if (typeof Chart === "undefined") return;

    const textColor = "#64748b";
    const gridColor = "#e2e8f0";

    // Bar Chart — monthly application volume
    const barCtx = document.getElementById("applicationsBarChart")?.getContext("2d");
    if (barCtx) {
      barChart = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [{
            label: "Applications",
            data: [3, 5, 8, 12, 10, 15, profile.stats.applied],
            backgroundColor: "rgba(37, 99, 235, 0.70)",
            borderColor: "#2563eb",
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { padding: 12 } },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: "Inter" } } },
            y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: "Inter" } }, beginAtZero: true }
          }
        }
      });
    }

    // Doughnut Chart — application status breakdown
    const doughCtx = document.getElementById("statusDoughnutChart")?.getContext("2d");
    if (doughCtx) {
      const counts = {
        applied: profile.appliedJobs.filter(a => a.status === "Applied").length,
        review: profile.appliedJobs.filter(a => a.status === "Under Review").length,
        interview: profile.appliedJobs.filter(a => a.status === "Interviewing").length,
        offers: profile.stats.offers
      };

      doughnutChart = new Chart(doughCtx, {
        type: "doughnut",
        data: {
          labels: ["Applied", "Under Review", "Interviewing", "Offers"],
          datasets: [{
            data: [counts.applied || 1, counts.review, counts.interview, counts.offers],
            backgroundColor: [
              "rgba(37,  99, 235, 0.75)",
              "rgba(6,  182, 212, 0.75)",
              "rgba(245,158,  11, 0.75)",
              "rgba(16, 185, 129, 0.75)"
            ],
            borderColor: "#ffffff",
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: textColor, font: { family: "Inter", size: 11 }, padding: 15 }
            },
            tooltip: { padding: 10 }
          },
          cutout: "70%"
        }
      });
    }
  }

  function updateChartsTheme(isDark) {
    const textColor = "#64748b";
    const gridColor = "#e2e8f0";
    const borderClr = "#ffffff";

    if (barChart) {
      barChart.options.scales.x.ticks.color = textColor;
      barChart.options.scales.x.grid.color = gridColor;
      barChart.options.scales.y.ticks.color = textColor;
      barChart.options.scales.y.grid.color = gridColor;
      barChart.update();
    }
    if (doughnutChart) {
      doughnutChart.options.plugins.legend.labels.color = textColor;
      doughnutChart.data.datasets[0].borderColor = borderClr;
      doughnutChart.update();
    }
  }
});
