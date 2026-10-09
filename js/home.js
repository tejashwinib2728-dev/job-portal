document.addEventListener("DOMContentLoaded", () => {
  // 1. THREE.JS ANIMATED BACKGROUND
  initThreeBackground();

  // 2. COUNTER ANIMATION
  initCounters();

  // 3. LOAD FEATURED & FRESHER JOBS
  renderHomeJobs();
  renderFreshersJobs();

  // 4. HERO GSAP ENTER ANIMATIONS
  if (typeof gsap !== "undefined") {
    gsap.from(".hero-title span", {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out"
    });
    
    gsap.from(".hero-subtitle", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.4,
      ease: "power3.out"
    });

    gsap.from(".hero-search-box", {
      opacity: 0,
      y: 40,
      duration: 1,
      delay: 0.6,
      ease: "power3.out"
    });

    gsap.from(".hero-cta-buttons", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.8,
      ease: "power3.out"
    });
  }

  // 5. SEARCH BOX FORM SUBMISSION REDIRECT
  const heroSearchBtn = document.getElementById("hero-search-btn");
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener("click", () => {
      const searchTitle = document.getElementById("search-title").value.trim();
      const searchLoc = document.getElementById("search-location").value.trim();
      
      let targetUrl = "html/jobs.html";
      const params = [];
      if (searchTitle) params.push(`search=${encodeURIComponent(searchTitle)}`);
      if (searchLoc) params.push(`location=${encodeURIComponent(searchLoc)}`);
      
      if (params.length > 0) {
        targetUrl += "?" + params.join("&");
      }
      window.location.href = targetUrl;
    });
  }
});

/* --- THREE.JS PORTAL ANIMATION --- */
function initThreeBackground() {
  const container = document.getElementById("canvas-container");
  if (!container || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 8;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Particles
  const particlesCount = 250;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Spread in space
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 15;

    // Soft blues and cyans
    colors[i] = 0.1 + Math.random() * 0.2; // R
    colors[i + 1] = 0.4 + Math.random() * 0.4; // G
    colors[i + 2] = 0.8 + Math.random() * 0.2; // B
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Soft glowing point material
  const material = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.NormalBlending
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Floating geometric meshes (representing job spheres)
  const sphereGeom = new THREE.IcosahedronGeometry(0.8, 1);
  const torusGeom = new THREE.TorusGeometry(0.5, 0.15, 8, 24);
  const octaGeom = new THREE.OctahedronGeometry(0.6, 0);

  const meshMaterial = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.2,
    metalness: 0.8,
    flatShading: true,
    transparent: true,
    opacity: 0.65
  });

  const shapes = [];
  const totalShapes = 6;

  for (let i = 0; i < totalShapes; i++) {
    let geom;
    if (i % 3 === 0) geom = sphereGeom;
    else if (i % 3 === 1) geom = torusGeom;
    else geom = octaGeom;

    const mesh = new THREE.Mesh(geom, meshMaterial.clone());
    
    // Pick unique colors
    mesh.material.color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5);

    // Randomize initial states
    mesh.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5
    );
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, 0);
    mesh.scale.setScalar(0.7 + Math.random() * 0.6);

    // Velocity attributes
    mesh.userData = {
      spinX: (Math.random() - 0.5) * 0.01,
      spinY: (Math.random() - 0.5) * 0.01,
      floatSpeed: 0.002 + Math.random() * 0.003,
      floatDirection: Math.random() * Math.PI * 2,
      startY: mesh.position.y
    };

    scene.add(mesh);
    shapes.push(mesh);
  }

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.6);
  dirLight2.position.set(-5, -5, 2);
  scene.add(dirLight2);

  // Mouse Parallax movement variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
  });

  // Handle Resize
  window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate particles slowly
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = elapsedTime * 0.01;

    // Animate shapes
    shapes.forEach(shape => {
      shape.rotation.x += shape.userData.spinX;
      shape.rotation.y += shape.userData.spinY;
      
      // Floating sinusoidal motion
      shape.position.y = shape.userData.startY + Math.sin(elapsedTime * 2 + shape.userData.floatDirection) * 0.4;
    });

    // Camera mouse parallax easing
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 0.5;
    camera.position.y = -targetY * 0.5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
}

/* --- STATS COUNTERS ANIMATION --- */
function initCounters() {
  const statsSection = document.getElementById("stats-section");
  if (!statsSection) return;

  const stats = [
    { id: "counter-jobs", target: 12000, suffix: "+" },
    { id: "counter-companies", target: 450, suffix: "+" },
    { id: "counter-candidates", target: 80000, suffix: "+" },
    { id: "counter-applications", target: 150000, suffix: "+" }
  ];

  let animated = false;

  const startCounters = () => {
    stats.forEach(stat => {
      const element = document.getElementById(stat.id);
      if (!element) return;

      const obj = { value: 0 };
      if (typeof gsap !== "undefined") {
        gsap.to(obj, {
          value: stat.target,
          duration: 2.5,
          ease: "power2.out",
          onUpdate: () => {
            element.innerText = Math.floor(obj.value).toLocaleString() + stat.suffix;
          }
        });
      } else {
        // Fallback simple loop
        let current = 0;
        const step = Math.ceil(stat.target / 100);
        const timer = setInterval(() => {
          current += step;
          if (current >= stat.target) {
            current = stat.target;
            clearInterval(timer);
          }
          element.innerText = current.toLocaleString() + stat.suffix;
        }, 20);
      }
    });
  };

  // Intersection Observer to run when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        startCounters();
        animated = true;
      }
    });
  }, { threshold: 0.2 });

  observer.observe(statsSection);
}

/* --- RENDER HOME JOBS --- */
function renderHomeJobs() {
  const container = document.getElementById("featured-jobs-container");
  if (!container || typeof JobSphereData === "undefined") return;

  // Take the first 3 featured jobs
  const featuredJobs = JobSphereData.jobs.slice(0, 3);
  let savedList = JSON.parse(localStorage.getItem("savedJobs") || "[]");

  container.innerHTML = featuredJobs.map(job => {
    const isSaved = savedList.includes(job.id);
    const saveClass = isSaved ? "saved" : "";
    const saveIcon = isSaved ? "bi-bookmark-dash-fill" : "bi-bookmark-plus";
    
    return `
      <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
        <div class="glass-card job-card h-100 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="company-logo-wrapper">
                ${job.logoText}
              </div>
              <button class="btn-save-job ${saveClass}" data-id="${job.id}">
                <i class="bi ${saveIcon}"></i>
              </button>
            </div>
            
            <a href="html/job-details.html?id=${job.id}" class="h5 text-decoration-none text-main d-block fw-bold mb-1">${job.title}</a>
            <span class="text-muted d-block small mb-3">${job.companyName} &bull; ${job.location}</span>
            
            <div class="d-flex flex-wrap mb-3">
              ${job.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
          
          <div>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="fw-semibold text-primary">$${(job.salary/1000).toFixed(0)}k/year</span>
              <span class="badge bg-secondary bg-opacity-10 text-muted px-3 py-2 text-capitalize">${job.type}</span>
            </div>
            
            <div class="row g-2">
              <div class="col-6">
                <a href="html/job-details.html?id=${job.id}" class="btn btn-premium-secondary w-100 py-2 fs-7">Details</a>
              </div>
              <div class="col-6">
                <button class="btn btn-premium-primary w-100 py-2 fs-7 apply-now-btn" data-id="${job.id}">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach Save Job listeners
  container.querySelectorAll(".btn-save-job").forEach(btn => {
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

  // Attach Apply Now click (fake action)
  container.querySelectorAll(".apply-now-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const jobId = this.getAttribute("data-id");
      window.location.href = `html/job-details.html?id=${jobId}&apply=true`;
    });
  });
}

function renderFreshersJobs() {
  const container = document.getElementById("freshers-jobs-container");
  if (!container || typeof JobSphereData === "undefined") return;

  const fresherJobs = JobSphereData.jobs.filter(job => job.experience === 0).slice(0, 3);
  let savedList = JSON.parse(localStorage.getItem("savedJobs") || "[]");

  container.innerHTML = fresherJobs.map(job => {
    const isSaved = savedList.includes(job.id);
    const saveClass = isSaved ? "saved" : "";
    const saveIcon = isSaved ? "bi-bookmark-dash-fill" : "bi-bookmark-plus";
    
    return `
      <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
        <div class="glass-card job-card h-100 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="company-logo-wrapper">
                ${job.logoText}
              </div>
              <button class="btn-save-job ${saveClass}" data-id="${job.id}">
                <i class="bi ${saveIcon}"></i>
              </button>
            </div>
            
            <a href="html/job-details.html?id=${job.id}" class="h5 text-decoration-none text-main d-block fw-bold mb-1">${job.title}</a>
            <span class="text-muted d-block small mb-3">${job.companyName} &bull; ${job.location}</span>
            
            <div class="d-flex flex-wrap mb-3">
              ${job.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
          
          <div>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="fw-semibold text-primary">$${(job.salary/1000).toFixed(0)}k/year</span>
              <span class="badge bg-success bg-opacity-10 text-success px-3 py-2 text-capitalize fs-8">Fresher</span>
            </div>
            
            <div class="row g-2">
              <div class="col-6">
                <a href="html/job-details.html?id=${job.id}" class="btn btn-premium-secondary w-100 py-2 fs-7">Details</a>
              </div>
              <div class="col-6">
                <button class="btn btn-premium-primary w-100 py-2 fs-7 apply-now-btn" data-id="${job.id}">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach Save Job listeners
  container.querySelectorAll(".btn-save-job").forEach(btn => {
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

  // Attach Apply Now click
  container.querySelectorAll(".apply-now-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const jobId = this.getAttribute("data-id");
      window.location.href = `html/job-details.html?id=${jobId}&apply=true`;
    });
  });
}
