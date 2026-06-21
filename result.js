/* ==========================================
   FuturePath AI - Prediction Result Handler
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const logoutBtn = document.getElementById('logoutBtn');
  
  const careerTitle = document.getElementById('careerTitle');
  const careerDomain = document.getElementById('careerDomain');
  const careerDescription = document.getElementById('careerDescription');
  const careerIconWrap = document.getElementById('careerIconWrap');
  const careerAccentCard = document.getElementById('careerAccentCard');
  
  const radialGaugeFill = document.getElementById('radialGaugeFill');
  const confidenceScoreVal = document.getElementById('confidenceScoreVal');
  const alignmentStatus = document.getElementById('alignmentStatus');
  
  const techSkillsDeck = document.getElementById('techSkillsDeck');
  const powerSkillsDeck = document.getElementById('powerSkillsDeck');
  
  const growthDemand = document.getElementById('growthDemand');
  const startingSalary = document.getElementById('startingSalary');
  const growthRate = document.getElementById('growthRate');
  
  const phase1Time = document.getElementById('phase1Time');
  const phase1Title = document.getElementById('phase1Title');
  const phase1Desc = document.getElementById('phase1Desc');
  
  const phase2Time = document.getElementById('phase2Time');
  const phase2Title = document.getElementById('phase2Title');
  const phase2Desc = document.getElementById('phase2Desc');
  
  const phase3Time = document.getElementById('phase3Time');
  const phase3Title = document.getElementById('phase3Title');
  const phase3Desc = document.getElementById('phase3Desc');
  
  const reAssessBtn = document.getElementById('reAssessBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const toastContainer = document.getElementById('toastContainer');



  /* ==========================================
     Career trajectory Dataset
     ========================================== */
  const careerDataset = {
    ai_engineer: {
      title: "AI Engineer",
      domain: "Artificial Intelligence & Model Engineering",
      description: "Design, program, and deploy production pipelines, neural networks, and model fine-tuning architectures to solve complex computational problems.",
      accentColor: "#4F46E5",
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 7.54 16.59c-.24.28-.59.41-.94.41H5.4c-.35 0-.7-.13-.94-.41A10 10 0 0 1 12 2z"></path><path d="M12 14v5"></path><path d="M9 19h6"></path><path d="M9 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"></path></svg>`,
      techSkills: ["Python", "PyTorch", "HuggingFace", "Transformer Tuning", "SQL", "MLOps Pipelines"],
      powerSkills: ["Mathematical Rigor", "Systems Design", "Technical Writing", "Creative Problem Solving"],
      growthDemand: "Extreme Demand",
      startingSalary: "$105,000 - $132,000",
      growthRate: "+32.4% YoY",
      roadmap: {
        p1Time: "Months 1-3",
        p1Title: "Foundations & ML Mathematics",
        p1Desc: "Master advanced Python, Linear Algebra, and Calculus. Complete foundational machine learning algorithms coursework.",
        p2Time: "Months 4-6",
        p2Title: "Deep Learning & Model Training",
        p2Desc: "Train neural networks in PyTorch. Learn transformer structures, model fine-tuning (LoRA), and use weights logger platforms.",
        p3Time: "Months 7-12",
        p3Title: "MLOps & Production Portfolios",
        p3Desc: "Build model deployment APIs using FastAPI & Docker. Containerize microservices and build complete LLM agent portfolio applications."
      }
    },
    data_scientist: {
      title: "Data Scientist",
      domain: "Data Science & Statistical Insights",
      description: "Interpret massive structured datasets, deploy custom regression models, and design dashboard metrics to unlock business insights and product statistics.",
      accentColor: "#8B5CF6",
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
      techSkills: ["Python / R", "Pandas & Numpy", "SQL / NoSQL", "Regression Models", "Tableau & PowerBI", "Scikit-Learn"],
      powerSkills: ["Data Storytelling", "Statistical Logic", "Business Insight", "Report Documenting"],
      growthDemand: "High Growth",
      startingSalary: "$96,000 - $122,000",
      growthRate: "+22.8% YoY",
      roadmap: {
        p1Time: "Months 1-3",
        p1Title: "Data Wrangling & Statistical Basics",
        p1Desc: "Learn core data cleansing packages (Pandas/Numpy) and SQL queries. Build statistics foundations and descriptive metrics.",
        p2Time: "Months 4-6",
        p2Title: "Supervised Modeling & Dashboards",
        p2Desc: "Build regression and classification models in Scikit-Learn. Establish automated visualization reports in Tableau or Streamlit.",
        p3Time: "Months 7-12",
        p3Title: "A/B Testing & Portfolio Projects",
        p3Desc: "Design experimental A/B testing models. Construct end-to-end data pipeline dashboards showcasing real-world dataset analytics."
      }
    },
    web_developer: {
      title: "Web Developer",
      domain: "Web Engineering & Application Platforms",
      description: "Develop modern, fast, and accessible single-page web applications utilizing robust frontend tools and secure asynchronous backend API pathways.",
      accentColor: "#10B981",
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline><line x1="14" y1="4" x2="10" y2="20"></line></svg>`,
      techSkills: ["JavaScript / TypeScript", "HTML5 & CSS3", "React.js / Next.js", "Node.js / Express", "RESTful APIs", "Git Version Control"],
      powerSkills: ["User Empathy", "Agile Collaboration", "Debugging Speed", "Detail Oriented"],
      growthDemand: "Steady Growth",
      startingSalary: "$88,000 - $115,000",
      growthRate: "+18.2% YoY",
      roadmap: {
        p1Time: "Months 1-3",
        p1Title: "Frontend Core UI & JavaScript",
        p1Desc: "Master HTML, CSS layouts, and advanced ES6+ JavaScript. Build interactive, responsive mock interfaces.",
        p2Time: "Months 4-6",
        p2Title: "React frameworks & State Management",
        p2Desc: "Deep dive into React components, Next.js page routers, and tailwind templates. Learn standard application state flows.",
        p3Time: "Months 7-12",
        p3Title: "Full Stack APIs & Live Deployment",
        p3Desc: "Build backend REST endpoints in Express/Node.js. Connect to Mongo/Postgres databases and host live builds on platforms."
      }
    },
    cyber_security: {
      title: "Cyber Security Analyst",
      domain: "Cybersecurity Systems & Threat Defense",
      description: "Monitor digital infrastructure integrity, establish zero-trust policies, and prevent unauthorized credential bypass or network injection attacks.",
      accentColor: "#EF4444",
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
      techSkills: ["Linux CLI", "Wireshark Network Analysis", "Firewall Configuration", "Bash / Python scripting", "Penetration Testing", "Security Auditing"],
      powerSkills: ["Risk Evaluation", "Ethical Mindset", "Detail Inspections", "Incident Readiness"],
      growthDemand: "Extreme Demand",
      startingSalary: "$94,000 - $120,000",
      growthRate: "+28.6% YoY",
      roadmap: {
        p1Time: "Months 1-3",
        p1Title: "Networking & Operating Systems",
        p1Desc: "Master IPv4/IPv6 networking concepts, routing protocols, and Linux shell controls. Earn fundamental networking certifications.",
        p2Time: "Months 4-6",
        p2Title: "Vulnerability Scanning & Scripts",
        p2Desc: "Use Wireshark and Nmap to trace network payloads. Develop automation scripts in Bash or Python to scan server vulnerability profiles.",
        p3Time: "Months 7-12",
        p3Title: "Incident Response & Ethical Hacking",
        p3Desc: "Establish zero-trust environments. Set up mock capture-the-flag (CTF) nodes to practice intrusion detection and threat mitigation."
      }
    },
    uiux_designer: {
      title: "UI/UX Designer",
      domain: "Interface Design & Product Strategy",
      description: "Design aesthetic visual systems, build high-fidelity interface wireframes, and design layout flows centered on premium user interactions.",
      accentColor: "#F97316",
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6a3.5 3.5 0 0 0-3.5 3.5c0 3 3.5 6.5 3.5 6.5s3.5-3.5 3.5-6.5A3.5 3.5 0 0 0 12 6z"></path></svg>`,
      techSkills: ["Figma & FigJam", "Wireframing & Prototyping", "Design Systems", "User Research", "Usability Screenings", "HTML/CSS Basics"],
      powerSkills: ["Empathy Mapping", "Visual Aesthetics", "Communication Skills", "Presentation Design"],
      growthDemand: "High Demand",
      startingSalary: "$85,000 - $110,000",
      growthRate: "+15.6% YoY",
      roadmap: {
        p1Time: "Months 1-3",
        p1Title: "Design Theory & Figma Core",
        p1Desc: "Learn color schemes, grid systems, and typography. Build mastery in Figma vector structures and components.",
        p2Time: "Months 4-6",
        p2Title: "Prototyping & User Journeys",
        p2Desc: "Construct high-fidelity interactive prototypes. Conduct mock user surveys to trace click friction and map user paths.",
        p3Time: "Months 7-12",
        p3Title: "Design Systems & Live Portfolios",
        p3Desc: "Build modular, reusable product design systems. Compile complete UX case studies detailing the design sprint process."
      }
    },
    cloud_engineer: {
      title: "Cloud Engineer",
      domain: "Cloud Architectures & Infrastructure Operations",
      description: "Establish serverless backend architectures, set up cloud computing services, and orchestrate containerized build structures for production scaling.",
      accentColor: "#0EA5E9",
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
      techSkills: ["AWS / Azure / GCP", "Terraform (IaC)", "Docker & Kubernetes", "CI/CD Deployment", "Linux Administration", "Shell Scripting"],
      powerSkills: ["Scalability Mindset", "Structural Analysis", "SLA Monitoring", "Resource Efficiency"],
      growthDemand: "Hot Market Trend",
      startingSalary: "$102,000 - $128,000",
      growthRate: "+26.4% YoY",
      roadmap: {
        p1Time: "Months 1-3",
        p1Title: "Cloud Essentials & Linux Server",
        p1Desc: "Master basic cloud architecture tools (EC2, S3, IAM) and Linux systems administration. Earn baseline cloud practitioner certifications.",
        p2Time: "Months 4-6",
        p2Title: "Containers & CI/CD Pipelines",
        p2Desc: "Deep dive into Docker image creations and Kubernetes clusters. Automate build deployments using GitHub Actions or Jenkins.",
        p3Time: "Months 7-12",
        p3Title: "Infrastructure as Code & scaling",
        p3Desc: "Configure infrastructure metrics programmatically using Terraform. Deploy zero-downtime microservice server paths in mock production systems."
      }
    }
  };

  /* ==========================================
     URL Query Parameters Reader & UI Hydration
     ========================================== */
  const urlParams = new URLSearchParams(window.location.search);
  const careerKey = urlParams.get('career') || 'web_developer';
  const rawScore = parseInt(urlParams.get('score')) || 90;

  // Retrieve matching career details from dataset
  const careerInfo = careerDataset[careerKey] || careerDataset['web_developer'];

  // 1. Update text variables
  careerTitle.textContent = careerInfo.title;
  careerDomain.textContent = careerInfo.domain;
  careerDescription.textContent = careerInfo.description;
  growthDemand.textContent = careerInfo.growthDemand;
  startingSalary.textContent = careerInfo.startingSalary;
  growthRate.textContent = careerInfo.growthRate;

  // 2. Set dynamic colors variables on result card
  careerAccentCard.style.setProperty('--accent-color', careerInfo.accentColor);
  
  // 3. Inject custom career icon
  careerIconWrap.innerHTML = careerInfo.iconSvg;
  // Make sure dynamic svg inherits color
  const injectedSvg = careerIconWrap.querySelector('svg');
  if (injectedSvg) {
    injectedSvg.style.width = '24px';
    injectedSvg.style.height = '24px';
    injectedSvg.style.color = '#FFFFFF';
  }

  // 4. Render Skills Pill Badges
  techSkillsDeck.innerHTML = '';
  careerInfo.techSkills.forEach(skill => {
    const pill = document.createElement('span');
    pill.className = 'skill-pill';
    pill.innerHTML = `
      <span class="pill-check-indicator">✓</span>
      <span>${skill}</span>
    `;
    techSkillsDeck.appendChild(pill);
  });

  powerSkillsDeck.innerHTML = '';
  careerInfo.powerSkills.forEach(skill => {
    const pill = document.createElement('span');
    pill.className = 'skill-pill power-pill';
    pill.innerHTML = `
      <span class="pill-check-indicator font-purple">✓</span>
      <span>${skill}</span>
    `;
    powerSkillsDeck.appendChild(pill);
  });

  // 5. Render Roadmap Steps
  phase1Time.textContent = careerInfo.roadmap.p1Time;
  phase1Title.textContent = careerInfo.roadmap.p1Title;
  phase1Desc.textContent = careerInfo.roadmap.p1Desc;

  phase2Time.textContent = careerInfo.roadmap.p2Time;
  phase2Title.textContent = careerInfo.roadmap.p2Title;
  phase2Desc.textContent = careerInfo.roadmap.p2Desc;

  phase3Time.textContent = careerInfo.roadmap.p3Time;
  phase3Title.textContent = careerInfo.roadmap.p3Title;
  phase3Desc.textContent = careerInfo.roadmap.p3Desc;

  // 6. Gauge score animation trigger
  animateRadialScore(rawScore);

  function animateRadialScore(score) {
    // Configure text counting loop
    let currentScore = 0;
    const intervalTime = Math.max(1000 / score, 15);
    
    const countTimer = setInterval(() => {
      currentScore++;
      confidenceScoreVal.textContent = `${currentScore}%`;
      
      if (currentScore >= score) {
        clearInterval(countTimer);
      }
    }, intervalTime);

    // Configure radial SVG stroke offset
    // Circumference of radius 50 is ~314.15
    const circumference = 314.15;
    const targetOffset = circumference - (circumference * score / 100);
    
    // Set a tiny transition delay to trigger CSS transition
    setTimeout(() => {
      radialGaugeFill.style.strokeDashoffset = targetOffset;
    }, 100);

    // Update Compatibility status badge classes
    alignmentStatus.className = 'gauge-status-pill';
    if (score >= 85) {
      alignmentStatus.textContent = 'High Compatibility';
      alignmentStatus.classList.add('badge-active'); // Green
    } else if (score >= 70) {
      alignmentStatus.textContent = 'Aligned Match';
      alignmentStatus.classList.add('badge-historical'); // Blue
    } else {
      alignmentStatus.textContent = 'Upgrade Skills';
      alignmentStatus.classList.add('badge-archived'); // Slate
    }
  }



  /* ==========================================
     Footer Action button handlers
     ========================================== */
  if (reAssessBtn) {
    reAssessBtn.addEventListener('click', () => {
      window.location.href = 'prediction.html';
    });
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', (e) => {
      createRipple(e, downloadPdfBtn);
      downloadPdfBtn.disabled = true;
      showToast('Compiling dynamic career analysis logs...', 'success');

      setTimeout(() => {
        showToast('Roadmap details built! PDF download initialized.', 'success');
        downloadPdfBtn.disabled = false;
      }, 1800);
    });
  }

  /* ==========================================
     Dynamic Model Insights Integration
     ========================================== */
  const API_INSIGHTS_URL = "http://127.0.0.1:5000/model-insights";

  function loadModelInsights() {
    const algorithmEl = document.getElementById("result-algorithm");
    const datasetSizeEl = document.getElementById("result-dataset-size");
    const splitEl = document.getElementById("result-split");
    const accuracyEl = document.getElementById("result-accuracy");
    const learningTypeEl = document.getElementById("result-learning-type");
    const datasetTypeEl = document.getElementById("result-dataset-type");
    const evaluationMethodEl = document.getElementById("result-evaluation-method");
    const purposeEl = document.getElementById("result-purpose");

    if (!algorithmEl) return;

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
          
          if (algorithmEl) algorithmEl.textContent = insights.algorithm;
          if (datasetSizeEl) datasetSizeEl.textContent = `${insights.dataset_size} Records`;
          
          const trainPct = Math.round((insights.training_size / insights.dataset_size) * 100);
          const testPct = Math.round((insights.testing_size / insights.dataset_size) * 100);
          if (splitEl) splitEl.textContent = `${trainPct}% Training / ${testPct}% Testing`;
          
          if (accuracyEl) accuracyEl.textContent = `${insights.accuracy}%`;
          if (learningTypeEl) learningTypeEl.textContent = insights.learning_type;
          if (datasetTypeEl) datasetTypeEl.textContent = insights.dataset_type;
          if (evaluationMethodEl) evaluationMethodEl.textContent = insights.evaluation_method;
          if (purposeEl) purposeEl.textContent = insights.purpose;
        }
      })
      .catch(err => {
        console.warn("Backend insights fetch failed, using default display values:", err);
      });
  }

  loadModelInsights();

});
