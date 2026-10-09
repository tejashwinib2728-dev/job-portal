document.addEventListener("DOMContentLoaded", () => {
  // 1. EXTRACT PARAMS
  const params = new URLSearchParams(window.location.search);
  const jobId = parseInt(params.get("id")) || 1;
  const autoApply = params.get("apply") === "true";

  // Find Job
  const job = JobSphereData.jobs.find(j => j.id === jobId);

  if (!job) {
    document.getElementById("job-details-wrapper").innerHTML = `
      <div class="glass-card text-center p-5 my-5">
        <i class="bi bi-exclamation-triangle display-2 text-warning d-block mb-3"></i>
        <h3 class="fw-bold">Job Not Found</h3>
        <p class="text-muted">The career posting you are trying to view does not exist or has expired.</p>
        <a href="jobs.html" class="btn btn-premium-primary mt-3">Back to Directory</a>
      </div>
    `;
    return;
  }

  // 2. RENDER JOB DATA
  renderJobDetails(job);
  renderSimilarJobs(job);

  // 3. APPLY BUTTON LOGIC
  function handleApplyClick() {
    const loggedUserRaw = localStorage.getItem("loggedInUser");
    if (!loggedUserRaw) {
      alert("Please login first to apply for jobs.");
      window.location.href = "login.html";
      return;
    }
    const loggedUser = JSON.parse(loggedUserRaw);
    if (loggedUser.role === "admin") {
      alert("Only candidates can apply for jobs.");
      return;
    }
    const applyModal = new bootstrap.Modal(document.getElementById('applyModal'));
    applyModal.show();
  }

  // 4. AUTO-APPLY CHECK
  if (autoApply) {
    handleApplyClick();
  }

  // 4. APPLY FORM HANDLING
  const applyForm = document.getElementById("applyJobForm");
  if (applyForm) {
    // Populate form with logged-in user if available
    const loggedUser = localStorage.getItem("loggedInUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      document.getElementById("apply-name").value = user.name;
      document.getElementById("apply-email").value = user.email;
    }

    applyForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add("was-validated");
        return;
      }

      // Simulation of apply
      const modalEl = document.getElementById('applyModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();

      // Add to applied jobs in localStorage
      let profile = JSON.parse(localStorage.getItem("profileData")) || JobSphereData.candidateProfile;
      
      // Check if already applied
      const alreadyApplied = profile.appliedJobs.some(applied => applied.id === job.id);
      
      if (!alreadyApplied) {
        profile.appliedJobs.unshift({
          id: job.id,
          title: job.title,
          company: job.companyName,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: "Applied"
        });
        profile.stats.applied = profile.appliedJobs.length;
        
        // Add activity log
        profile.activities.unshift({
          text: `Applied for '${job.title}' at ${job.companyName}`,
          time: "Just now"
        });

        localStorage.setItem("profileData", JSON.stringify(profile));
      }

      // Show custom premium alert
      showSuccessAlert(job.title, job.companyName);
    });
  }

  function renderJobDetails(job) {
    // Header section info
    document.getElementById("detail-logo").innerText = job.logoText;
    document.getElementById("detail-title").innerText = job.title;
    document.getElementById("detail-company").innerText = job.companyName;
    document.getElementById("detail-location").innerText = job.location;
    document.getElementById("detail-type").innerText = job.type;
    document.getElementById("detail-salary").innerText = `$${job.salary.toLocaleString()}/yr`;
    document.getElementById("detail-exp").innerText = `${job.experience}+ Years`;
    document.getElementById("detail-posted").innerText = job.postedDate;

    // Body text
    document.getElementById("detail-description").innerText = job.description;

    // Skills
    const skillsContainer = document.getElementById("detail-skills");
    skillsContainer.innerHTML = job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');

    // Requirements
    const reqsContainer = document.getElementById("detail-requirements");
    reqsContainer.innerHTML = job.requirements.map(r => `<li class="mb-2.5 text-muted">${r}</li>`).join('');

    // Benefits
    const benefitsContainer = document.getElementById("detail-benefits");
    benefitsContainer.innerHTML = job.benefits.map(b => `<li class="mb-2.5 text-muted">${b}</li>`).join('');

    // Apply button wire-up
    const applyBtn = document.getElementById("detail-apply-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", handleApplyClick);
    }

    // Save job sync
    const saveBtn = document.getElementById("detail-save-btn");
    let saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    
    const updateSaveBtnState = (isSaved) => {
      const icon = saveBtn.querySelector("i");
      const text = saveBtn.querySelector("span");
      if (isSaved) {
        saveBtn.classList.add("saved");
        icon.className = "bi bi-bookmark-dash-fill text-danger";
        text.innerText = "Saved";
      } else {
        saveBtn.classList.remove("saved");
        icon.className = "bi bi-bookmark text-muted";
        text.innerText = "Save Position";
      }
    };

    updateSaveBtnState(saved.includes(job.id));

    saveBtn.addEventListener("click", () => {
      saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      let profile = JSON.parse(localStorage.getItem("profileData")) || JobSphereData.candidateProfile;
      if (!profile.activities) profile.activities = [];

      if (saved.includes(job.id)) {
        saved = saved.filter(id => id !== job.id);
        updateSaveBtnState(false);
        profile.activities.unshift({ text: `Removed saved job '${job.title}' at ${job.companyName}`, time: "Just now" });
      } else {
        saved.push(job.id);
        updateSaveBtnState(true);
        profile.activities.unshift({ text: `Saved '${job.title}' at ${job.companyName}`, time: "Just now" });
      }

      localStorage.setItem("savedJobs", JSON.stringify(saved));
      profile.stats.saved = saved.length;
      localStorage.setItem("profileData", JSON.stringify(profile));
    });
  }

  function renderSimilarJobs(job) {
    const container = document.getElementById("similar-jobs-container");
    if (!container) return;

    // Filter jobs with same category and not current job
    const similar = JobSphereData.jobs
      .filter(j => j.category === job.category && j.id !== job.id)
      .slice(0, 2);

    if (similar.length === 0) {
      container.innerHTML = `<p class="text-muted small">No related openings found in this category.</p>`;
      return;
    }

    container.innerHTML = similar.map(s => `
      <a href="job-details.html?id=${s.id}" class="glass-card p-3 mb-3 d-block text-decoration-none text-main">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="fw-bold fs-7">${s.title}</span>
          <span class="badge bg-primary bg-opacity-10 text-primary fs-9 px-2.5 py-1 text-capitalize">${s.type}</span>
        </div>
        <div class="text-muted small">
          ${s.companyName} &bull; ${s.location}
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2.5">
          <span class="fw-semibold text-primary fs-8">$${(s.salary/1000).toFixed(0)}k/yr</span>
          <span class="fs-9 text-muted">${s.postedDate}</span>
        </div>
      </a>
    `).join('');
  }

  function showSuccessAlert(title, company) {
    const alertDiv = document.createElement("div");
    alertDiv.className = "glass-card text-center p-4 position-fixed top-50 start-50 translate-middle shadow-lg z-3";
    alertDiv.style.maxWidth = "400px";
    alertDiv.style.border = "2px solid var(--primary-color)";
    alertDiv.style.background = "var(--navbar-bg)";
    
    alertDiv.innerHTML = `
      <div class="mb-3"><i class="bi bi-check-circle-fill text-success" style="font-size: 3.5rem;"></i></div>
      <h4 class="fw-bold mb-2">Application Transmitted!</h4>
      <p class="text-muted small">Your profile credentials for <strong>${title}</strong> at <strong>${company}</strong> were sent successfully.</p>
      <div class="d-flex gap-2 justify-content-center mt-4">
        <a href="candidate-dashboard.html" class="btn btn-premium-primary py-2 px-3 fs-7">View Dashboard</a>
        <button class="btn btn-premium-secondary py-2 px-3 fs-7 close-alert-btn">Close</button>
      </div>
    `;

    document.body.appendChild(alertDiv);

    // Overlay to dim background
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop fade show";
    document.body.appendChild(overlay);

    alertDiv.querySelector(".close-alert-btn").addEventListener("click", () => {
      alertDiv.remove();
      overlay.remove();
    });

    setTimeout(() => {
      window.location.href = "candidate-dashboard.html";
    }, 2500);
  }
});
