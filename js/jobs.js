document.addEventListener("DOMContentLoaded", () => {
  // Items per page
  const ITEMS_PER_PAGE = 4;
  let currentPage = 1;
  let filteredJobs = [...JobSphereData.jobs];

  // DOM Elements
  const jobsListContainer = document.getElementById("jobs-list-container");
  const paginationContainer = document.getElementById("pagination-container");
  const showingCountEl = document.getElementById("showing-count");
  const totalCountEl = document.getElementById("total-count");

  // Filter Elements
  const searchInput = document.getElementById("filter-search");
  const locationInput = document.getElementById("filter-location");
  const salaryRange = document.getElementById("filter-salary-range");
  const salaryValue = document.getElementById("salary-value");
  const expRange = document.getElementById("filter-exp-range");
  const expValue = document.getElementById("experience-value");
  const sortSelect = document.getElementById("sort-select");

  // Checkbox Containers
  const jobTypeContainer = document.getElementById("job-type-filters");
  const categoryContainer = document.getElementById("category-filters");

  // 1. INITIALIZE FILTERS FROM URL
  parseUrlParameters();

  // 2. REGISTER EVENT LISTENERS
  searchInput.addEventListener("input", filterJobs);
  locationInput.addEventListener("input", filterJobs);
  
  salaryRange.addEventListener("input", (e) => {
    salaryValue.innerText = `$${parseInt(e.target.value).toLocaleString()}`;
    filterJobs();
  });
  
  expRange.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    expValue.innerText = val === 0 ? "Any Experience" : `${val} Years Max`;
    filterJobs();
  });

  sortSelect.addEventListener("change", filterJobs);

  // Monitor Checkboxes
  jobTypeContainer.querySelectorAll("input").forEach(cb => cb.addEventListener("change", filterJobs));
  categoryContainer.querySelectorAll("input").forEach(cb => cb.addEventListener("change", filterJobs));

  // 3. EXECUTE INITIAL RENDER
  filterJobs();

  // Parse URL Search Query Params
  function parseUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    
    // Search text
    if (params.has("search")) {
      searchInput.value = params.get("search");
    }
    
    // Location
    if (params.has("location")) {
      locationInput.value = params.get("location");
    }
    
    // Category
    if (params.has("category")) {
      const cat = params.get("category");
      const checkbox = categoryContainer.querySelector(`input[value="${cat}"]`);
      if (checkbox) checkbox.checked = true;
    }
  }

  // Core Filtering Logic
  function filterJobs() {
    const searchVal = searchInput.value.toLowerCase().trim();
    const locVal = locationInput.value.toLowerCase().trim();
    const minSalary = parseInt(salaryRange.value);
    const maxExp = parseInt(expRange.value);
    const sortVal = sortSelect.value;

    // Get checked job types
    const activeTypes = Array.from(jobTypeContainer.querySelectorAll("input:checked")).map(cb => cb.value.toLowerCase());
    
    // Get checked categories
    const activeCats = Array.from(categoryContainer.querySelectorAll("input:checked")).map(cb => cb.value.toLowerCase());

    filteredJobs = JobSphereData.jobs.filter(job => {
      // Search Title or Skills
      const matchesSearch = !searchVal || 
        job.title.toLowerCase().includes(searchVal) || 
        job.skills.some(skill => skill.toLowerCase().includes(searchVal));

      // Location match
      const matchesLocation = !locVal || job.location.toLowerCase().includes(locVal);

      // Salary match (salary >= slider value)
      const matchesSalary = job.salary >= minSalary;

      // Experience match (job experience required <= maxExp)
      const matchesExp = maxExp === 0 || job.experience <= maxExp;

      // Job Type match
      const matchesType = activeTypes.length === 0 || activeTypes.includes(job.type.toLowerCase());

      // Category match
      const matchesCategory = activeCats.length === 0 || activeCats.includes(job.category.toLowerCase());

      return matchesSearch && matchesLocation && matchesSalary && matchesExp && matchesType && matchesCategory;
    });

    // Apply Sorting
    sortFilteredJobs(sortVal);

    // Reset pagination to first page after filters change
    currentPage = 1;
    renderJobsList();
    renderPagination();
  }

  function sortFilteredJobs(criterion) {
    if (criterion === "salary-desc") {
      filteredJobs.sort((a, b) => b.salary - a.salary);
    } else if (criterion === "salary-asc") {
      filteredJobs.sort((a, b) => a.salary - b.salary);
    } else if (criterion === "exp-asc") {
      filteredJobs.sort((a, b) => a.experience - b.experience);
    } else {
      // Default: Latest/ID
      filteredJobs.sort((a, b) => b.id - a.id);
    }
  }

  // Render Page Lists
  function renderJobsList() {
    jobsListContainer.innerHTML = "";
    
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const paginatedItems = filteredJobs.slice(startIdx, endIdx);

    // Update statistics header
    showingCountEl.innerText = filteredJobs.length === 0 ? "0" : `${startIdx + 1}-${Math.min(endIdx, filteredJobs.length)}`;
    totalCountEl.innerText = filteredJobs.length;

    if (paginatedItems.length === 0) {
      jobsListContainer.innerHTML = `
        <div class="glass-card text-center p-5 mt-3">
          <i class="bi bi-search-heart display-1 text-muted d-block mb-3"></i>
          <h4 class="fw-bold">No careers found</h4>
          <p class="text-muted">Adjust your filter choices or search query constraints to uncover active jobs.</p>
          <button class="btn btn-premium-primary" id="reset-filters-btn">Reset All Filters</button>
        </div>
      `;
      document.getElementById("reset-filters-btn")?.addEventListener("click", resetAllFilters);
      return;
    }

    let savedList = JSON.parse(localStorage.getItem("savedJobs") || "[]");

    paginatedItems.forEach(job => {
      const isSaved = savedList.includes(job.id);
      const saveClass = isSaved ? "saved" : "";
      const saveIcon = isSaved ? "bi-bookmark-dash-fill" : "bi-bookmark-plus";

      const card = document.createElement("div");
      card.className = "glass-card job-card mb-4";
      card.setAttribute("data-aos", "fade-up");
      card.innerHTML = `
        <div class="row align-items-center g-3">
          <!-- Logo & Basic info -->
          <div class="col-md-7">
            <div class="d-flex align-items-start align-items-sm-center gap-3">
              <div class="company-logo-wrapper">
                ${job.logoText}
              </div>
              <div>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <h4 class="h5 fw-bold mb-0 text-main">${job.title}</h4>
                  <span class="badge bg-primary bg-opacity-10 text-primary px-2.5 py-1 text-capitalize fs-8">${job.type}</span>
                </div>
                <div class="text-muted small mt-1">
                  <span class="fw-semibold text-main">${job.companyName}</span> &bull; 
                  <i class="bi bi-geo-alt me-1"></i>${job.location} &bull; 
                  <i class="bi bi-briefcase me-1"></i>${job.experience} Yrs &bull;
                  <i class="bi bi-clock me-1"></i>${job.postedDate}
                </div>
              </div>
            </div>
            
            <div class="mt-3">
              ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
          
          <!-- Actions & Compensation -->
          <div class="col-md-5 text-start text-md-end d-flex flex-column justify-content-between h-100">
            <div class="d-flex justify-content-start justify-content-md-end mb-3">
              <span class="fs-4 fw-extrabold text-primary">$${job.salary.toLocaleString()}</span>
              <span class="text-muted align-self-end ms-1 small">/yr</span>
            </div>
            
            <div class="d-flex justify-content-start justify-content-md-end gap-2 align-items-center">
              <button class="btn-save-job ${saveClass}" data-id="${job.id}" aria-label="Save Job">
                <i class="bi ${saveIcon}"></i>
              </button>
              <a href="job-details.html?id=${job.id}" class="btn btn-premium-secondary fs-7 py-2.5">Details</a>
              <button class="btn btn-premium-primary fs-7 py-2.5 apply-list-btn" data-id="${job.id}">Apply</button>
            </div>
          </div>
        </div>
      `;

      jobsListContainer.appendChild(card);
    });

    // Wire Save button handlers
    jobsListContainer.querySelectorAll(".btn-save-job").forEach(btn => {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        const jobId = parseInt(this.getAttribute("data-id"));
        let saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
        const icon = this.querySelector("i");
        
        if (saved.includes(jobId)) {
          saved = saved.filter(id => id !== jobId);
          this.classList.remove("saved");
          icon.className = "bi bi-bookmark-plus";
        } else {
          saved.push(jobId);
          this.classList.add("saved");
          icon.className = "bi bi-bookmark-dash-fill";
        }
        localStorage.setItem("savedJobs", JSON.stringify(saved));
      });
    });

    // Wire list Apply button
    jobsListContainer.querySelectorAll(".apply-list-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        const jobId = this.getAttribute("data-id");
        window.location.href = `job-details.html?id=${jobId}&apply=true`;
      });
    });

    // Refresh AOS animations
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // Render Pagination
  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return;

    // Prev Button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link glass-card py-2 border-0" href="#" aria-label="Previous"><i class="bi bi-chevron-left"></i></a>`;
    prevLi.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderJobsList();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    paginationContainer.appendChild(prevLi);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageLi = document.createElement("li");
      pageLi.className = `page-item mx-1 ${currentPage === i ? "active" : ""}`;
      pageLi.innerHTML = `<a class="page-link glass-card py-2 border-0 fw-bold text-main" href="#">${i}</a>`;
      
      pageLi.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        renderJobsList();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(pageLi);
    }

    // Next Button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    nextLi.innerHTML = `<a class="page-link glass-card py-2 border-0" href="#" aria-label="Next"><i class="bi bi-chevron-right"></i></a>`;
    nextLi.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderJobsList();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    paginationContainer.appendChild(nextLi);
  }

  function resetAllFilters() {
    searchInput.value = "";
    locationInput.value = "";
    salaryRange.value = 50000;
    salaryValue.innerText = "$50,000";
    expRange.value = 0;
    expValue.innerText = "Any Experience";
    sortSelect.value = "latest";

    // Uncheck categories
    categoryContainer.querySelectorAll("input").forEach(cb => cb.checked = false);
    // Uncheck types
    jobTypeContainer.querySelectorAll("input").forEach(cb => cb.checked = false);

    filterJobs();
  }
});
