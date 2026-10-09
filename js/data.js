const JobSphereData = {
  categories: [
    { id: "tech", name: "Technology & Software", icon: "bi-laptop", openPositions: 142 },
    { id: "design", name: "Design & Creative", icon: "bi-palette", openPositions: 85 },
    { id: "marketing", name: "Marketing & Sales", icon: "bi-megaphone", openPositions: 98 },
    { id: "finance", name: "Finance & Accounting", icon: "bi-cash-coin", openPositions: 64 },
    { id: "hr", name: "Human Resources", icon: "bi-people", openPositions: 42 },
    { id: "pm", name: "Product Management", icon: "bi-kanban", openPositions: 55 },
    { id: "support", name: "Customer Success", icon: "bi-headset", openPositions: 73 },
    { id: "healthcare", name: "Healthcare & Biotech", icon: "bi-heart-pulse", openPositions: 39 }
  ],
  companies: [
    { id: "google", name: "Google", logoClass: "bi-google", industry: "Technology", location: "Mountain View, CA", jobsCount: 12 },
    { id: "microsoft", name: "Microsoft", logoClass: "bi-microsoft", industry: "Technology", location: "Redmond, WA", jobsCount: 9 },
    { id: "apple", name: "Apple", logoClass: "bi-apple", industry: "Consumer Electronics", location: "Cupertino, CA", jobsCount: 6 },
    { id: "meta", name: "Meta", logoClass: "bi-meta", industry: "Social Media", location: "Menlo Park, CA", jobsCount: 8 },
    { id: "nvidia", name: "NVIDIA", logoClass: "bi-cpu", industry: "Semiconductors", location: "Santa Clara, CA", jobsCount: 5 },
    { id: "stripe", name: "Stripe", logoClass: "bi-credit-card", industry: "Fintech", location: "San Francisco, CA", jobsCount: 11 },
    { id: "figma", name: "Figma", logoClass: "bi-bezier2", industry: "Design Tools", location: "San Francisco, CA", jobsCount: 4 },
    { id: "spotify", name: "Spotify", logoClass: "bi-music-note-beamed", industry: "Entertainment", location: "Stockholm, SE", jobsCount: 7 }
  ],
  jobs: [
    {
      id: 1,
      title: "Senior Full Stack Engineer",
      companyId: "stripe",
      companyName: "Stripe",
      logoText: "S",
      location: "San Francisco, CA",
      salary: 165000,
      experience: 5, // years
      type: "Full-time",
      category: "tech",
      postedDate: "2 days ago",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      description: "We are looking for a Senior Full Stack Engineer to join our billing core infrastructure team. You will lead the design and development of reliable, scalable API services that process billions of dollars in transactions globally.",
      requirements: [
        "5+ years of experience building scalable backend and frontend applications.",
        "Proficiency in modern JavaScript/TypeScript, React, and Node.js.",
        "Experience designing robust REST and GraphQL APIs.",
        "Solid understanding of database systems (SQL, NoSQL) and caching strategies."
      ],
      benefits: [
        "Competitive salary and equity packages.",
        "Comprehensive health, dental, and vision insurance.",
        "Flexible work-from-home policy with home office stipends.",
        "Generous parental leave and unlimited PTO."
      ]
    },
    {
      id: 2,
      title: "Lead UI/UX Product Designer",
      companyId: "figma",
      companyName: "Figma",
      logoText: "F",
      location: "Remote",
      salary: 150000,
      experience: 6,
      type: "Remote",
      category: "design",
      postedDate: "1 day ago",
      skills: ["Figma", "Design Systems", "Prototyping", "UX Research"],
      description: "Join us in redefining how the world designs. As a Lead Product Designer, you will shape the creative direction of collaborative whiteboarding products and design workflows used by millions of developers and designers.",
      requirements: [
        "6+ years of UX/UI experience focusing on web applications.",
        "A strong portfolio demonstrating interaction design, design systems, and prototyping.",
        "Experience executing user research and translating insights into product requirements.",
        "Excellent communication skills and experience leading cross-functional design sprints."
      ],
      benefits: [
        "Top-tier compensation and equity.",
        "Health & Wellness stipend.",
        "Co-working space allowance.",
        "Annual learning & development budget."
      ]
    },
    {
      id: 3,
      title: "Growth Marketing Manager",
      companyId: "spotify",
      companyName: "Spotify",
      logoText: "SP",
      location: "New York, NY",
      salary: 110000,
      experience: 3,
      type: "Full-time",
      category: "marketing",
      postedDate: "3 days ago",
      skills: ["SEO", "Google Analytics", "Growth Hacking", "AdWords"],
      description: "Spotify is seeking a data-driven Growth Marketing Manager to oversee acquisition campaigns for Spotify Premium. You will run multi-channel experiments to acquire, engage, and retain music lovers worldwide.",
      requirements: [
        "3+ years of experience in growth marketing, paid acquisition, or performance marketing.",
        "Analytical background with deep knowledge of Google Analytics, SQL, and A/B testing frameworks.",
        "Familiarity with ad platforms (Facebook Ads, Google Ads, TikTok Ads).",
        "Creative mindset with the ability to write copy and direct visual design directions."
      ],
      benefits: [
        "Spotify Premium subscription (obviously!).",
        "Premium retirement planning matching.",
        "On-site cafeteria and wellness centers.",
        "Global mobility and career growth paths."
      ]
    },
    {
      id: 4,
      title: "Principal Machine Learning Engineer",
      companyId: "nvidia",
      companyName: "NVIDIA",
      logoText: "N",
      location: "Santa Clara, CA",
      salary: 210000,
      experience: 8,
      type: "Full-time",
      category: "tech",
      postedDate: "4 hours ago",
      skills: ["PyTorch", "CUDA", "C++", "Deep Learning", "LLMs"],
      description: "Be at the forefront of the AI revolution. You will develop next-generation deep learning architectures, optimize training pipelines for massive language models, and leverage CUDA libraries to unlock raw computational power.",
      requirements: [
        "8+ years of experience in ML research or engineering with a Ph.D./M.S. in Computer Science or related fields.",
        "Expertise in deep learning frameworks like PyTorch or TensorFlow.",
        "Deep understanding of GPU architecture, distributed training, and CUDA optimization.",
        "Published work in top ML conferences (NeurIPS, CVPR, ICML) is a plus."
      ],
      benefits: [
        "NVIDIA stock options plan.",
        "Unlimited sick leave and generous health coverage.",
        "On-site gyms, medical clinics, and recreational areas.",
        "Relocation assistance package."
      ]
    },
    {
      id: 5,
      title: "Senior Product Manager - Cloud Billing",
      companyId: "google",
      companyName: "Google",
      logoText: "G",
      location: "Mountain View, CA",
      salary: 190000,
      experience: 6,
      type: "Full-time",
      category: "pm",
      postedDate: "5 days ago",
      skills: ["Product Roadmap", "Cloud Billing", "SaaS Strategy", "Agile"],
      description: "As a Product Manager in Google Cloud, you will own the billing experience for enterprise customers. You will collaborate with engineering, design, and sales to launch intuitive billing portals and pricing engines.",
      requirements: [
        "6+ years of experience managing complex technical products in Cloud, Fintech, or SaaS.",
        "Strong business acumen with experience defining pricing structures and licensing models.",
        "Technical depth to converse comfortably with engineering teams regarding systems architecture.",
        "Experience leading cross-functional teams without direct authority."
      ],
      benefits: [
        "Google-class culinary experiences (free gourmet meals).",
        "Discounts on hardware and services.",
        "Excellent health benefits and family leaves.",
        "Generous 401(k) matching program."
      ]
    },
    {
      id: 6,
      title: "DevOps & Infrastructure Architect",
      companyId: "microsoft",
      companyName: "Microsoft",
      logoText: "M",
      location: "Redmond, WA",
      salary: 175000,
      experience: 7,
      type: "Full-time",
      category: "tech",
      postedDate: "1 week ago",
      skills: ["Azure", "Terraform", "Kubernetes", "Docker", "CI/CD"],
      description: "We are hiring an Infrastructure Architect to design next-gen cloud hosting infrastructure on Microsoft Azure. You will automate cluster scaling, optimize security baselines, and drive developer productivity.",
      requirements: [
        "7+ years of experience in DevOps, Infrastructure, or Site Reliability Engineering.",
        "Proven expertise with Azure, Kubernetes (AKS), and Infrastructure as Code (Terraform).",
        "Deep understanding of networking security, routing protocols, and disaster recovery.",
        "Strong scripting skills (Bash, Python, or PowerShell)."
      ],
      benefits: [
        "Comprehensive healthcare and life insurance.",
        "Employee stock purchase program.",
        "Gym membership reimbursement.",
        "Subsidized childcare program."
      ]
    },
    {
      id: 7,
      title: "Corporate Recruiter",
      companyId: "apple",
      companyName: "Apple",
      logoText: "A",
      location: "Cupertino, CA",
      salary: 95000,
      experience: 2,
      type: "Contract",
      category: "hr",
      postedDate: "6 days ago",
      skills: ["Sourcing", "Technical Recruiting", "LinkedIn Recruiter", "ATS"],
      description: "Apple is looking for a dynamic Corporate Recruiter to manage talent pipelines for our consumer hardware divisions. You will identify top-tier hardware engineers, manage screening pipelines, and coordinate hiring logistics.",
      requirements: [
        "2+ years of experience recruiting in technology sectors.",
        "Proficiency with ATS software and sourcing tools (LinkedIn Recruiter, Gem).",
        "Excellent negotiation, communication, and interpersonal skills.",
        "Strong understanding of legal guidelines regarding recruitment and labor standards."
      ],
      benefits: [
        "Apple employee discounts.",
        "Paid time off and flexible scheduling.",
        "On-site fitness centers.",
        "Dynamic and creative working environment."
      ]
    },
    {
      id: 8,
      title: "Financial Analyst - Strategic Investments",
      companyId: "meta",
      companyName: "Meta",
      logoText: "ME",
      location: "Menlo Park, CA",
      salary: 130000,
      experience: 4,
      type: "Full-time",
      category: "finance",
      postedDate: "4 days ago",
      skills: ["Financial Modeling", "Valuation", "Excel", "Data Analysis"],
      description: "We are seeking a Corporate Financial Analyst to support Meta's strategic investing and partnership divisions. You will build comprehensive valuation models, perform market research, and draft investment reports.",
      requirements: [
        "4+ years of investment banking, private equity, or corporate finance experience.",
        "Expertise in Excel modeling, corporate valuation, and financial accounting.",
        "Ability to analyze big datasets and synthesize findings for executive leadership.",
        "B.S. in Finance, Economics, Math, or equivalent field."
      ],
      benefits: [
        "Competitive base, bonus, and equity plans.",
        "Free shuttle transport across Bay Area.",
        "On-site dry cleaning, dental, and health offices.",
        "Annual wellness and micro-mobility stipends."
      ]
    },
    {
      id: 9,
      title: "Junior Frontend Developer",
      companyId: "spotify",
      companyName: "Spotify",
      logoText: "SP",
      location: "Remote",
      salary: 80000,
      experience: 0,
      type: "Remote",
      category: "tech",
      postedDate: "1 day ago",
      skills: ["React", "CSS3", "JavaScript"],
      description: "Great entry level opportunity for fresh graduates. Collaborate with senior designers and engineers to implement beautiful web interfaces using modern frameworks.",
      requirements: [
        "Bachelor's degree in Computer Science, engineering, or equivalent bootcamp certificate.",
        "Proficiency in HTML5, CSS3, and core JavaScript fundamentals.",
        "Basic familiarity with React and git workflow.",
        "Keen eye for layout fidelity and UX detail."
      ],
      benefits: [
        "Competitive startup-level base salary.",
        "Flexible working locations.",
        "Gourmet coffee stipend.",
        "Mentorship programs with industry experts."
      ]
    },
    {
      id: 10,
      title: "Associate Product Designer",
      companyId: "figma",
      companyName: "Figma",
      logoText: "F",
      location: "San Francisco, CA",
      salary: 85000,
      experience: 0,
      type: "Full-time",
      category: "design",
      postedDate: "2 days ago",
      skills: ["Figma", "UI Design", "Wireframing"],
      description: "Launch your design career under the mentorship of Figma senior leads. Help design tools that power collaboration and creativity worldwide.",
      requirements: [
        "Strong portfolio demonstrating digital product design projects (academic or personal).",
        "Proficiency with Figma tools and design system concepts.",
        "Empathy for user friction and basic layout standards.",
        "Ability to present and receive structured feedback."
      ],
      benefits: [
        "Figma design course access.",
        "Annual health and wellness packages.",
        "Brand new Macbook Pro setup.",
        "Team offsites and design dinners."
      ]
    },
    {
      id: 11,
      title: "Digital Marketing Coordinator",
      companyId: "meta",
      companyName: "Meta",
      logoText: "ME",
      location: "Menlo Park, CA",
      salary: 75000,
      experience: 0,
      type: "Full-time",
      category: "marketing",
      postedDate: "3 days ago",
      skills: ["Social Media", "SEO", "Copywriting"],
      description: "Help manage advertising campaigns and social media operations for major products on Meta. Great entry role for analytical marketing grads.",
      requirements: [
        "Degree in Marketing, Communications, or Business Administration.",
        "Excellent written communication skills and copywriting flair.",
        "Familiarity with SEO keyword research and Google Analytics.",
        "Highly organized with basic spreadsheet analysis skills."
      ],
      benefits: [
        "Comprehensive health benefits.",
        "Subsidized meals on campus.",
        "Transportation shuttle service.",
        "Free streaming devices and trial hardware."
      ]
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Lead Software Engineer",
      company: "Stripe",
      comment: "JobSphere changed the trajectory of my career. The premium UX allowed me to discover roles matching my exact skillset, and within 3 weeks I had accepted a job offer.",
      avatarText: "SJ"
    },
    {
      id: 2,
      name: "Marcus Vance",
      role: "UI/UX Designer",
      company: "Figma",
      comment: "I fell in love with the interface of JobSphere instantly. The glassmorphism dashboard looks stunning, and the onboarding flow made my profile standout immediately.",
      avatarText: "MV"
    },
    {
      id: 3,
      name: "Elena Rostova",
      role: "Director of HR",
      company: "Spotify",
      comment: "As a recruiter, finding candidates who fit both technical and cultural requirements is tough. JobSphere makes talent analytics visual and highly efficient.",
      avatarText: "ER"
    }
  ],
  faqs: [
    {
      question: "Is JobSphere free to use for job seekers?",
      answer: "Yes! JobSphere is 100% free for candidates to search for jobs, apply to companies, and access their custom applicant analytics dashboard."
    },
    {
      question: "How do I create a stand-out profile?",
      answer: "Complete all sections of your profile including skills, work history, and portfolio links. A complete profile increases visibility on the Admin Analytics dashboard by 85%."
    },
    {
      question: "Can I track the status of my applications?",
      answer: "Absolutely. The Candidate Dashboard tracks your submissions in real-time, showing whether an application is Under Review, Interviewing, or Decided."
    },
    {
      question: "How does the recruitment process work for employers?",
      answer: "Employers can register to gain access to the Admin Dashboard. There, they can post job listings, view applicants, manage recruitment statuses, and visualize monthly analytics."
    }
  ],
  candidateProfile: {
    name: "Alex Mercer",
    title: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    avatar: "AM",
    completionPercentage: 80,
    stats: {
      applied: 12,
      saved: 8,
      interviews: 3,
      offers: 1
    },
    appliedJobs: [
      { id: 1, title: "Senior Full Stack Engineer", company: "Stripe", date: "June 10, 2026", status: "Interviewing" },
      { id: 3, title: "Growth Marketing Manager", company: "Spotify", date: "June 08, 2026", status: "Under Review" },
      { id: 5, title: "Senior Product Manager - Cloud Billing", company: "Google", date: "May 28, 2026", status: "Applied" }
    ],
    savedJobs: [2, 4, 6],
    activities: [
      { text: "Applied for 'Senior Full Stack Engineer' at Stripe", time: "2 hours ago" },
      { text: "Saved 'Principal Machine Learning Engineer' at NVIDIA", time: "1 day ago" },
      { text: "Completed Profile Portfolio integration", time: "3 days ago" },
      { text: "Scheduled Phone Screen with Spotify HR Team", time: "5 days ago" }
    ],
    notifications: [
      { id: 1, text: "Stripe marked your application as 'Interviewing'", time: "2 hours ago", read: false },
      { id: 2, text: "Figma is viewing your UX Design portfolio projects", time: "1 day ago", read: false },
      { id: 3, text: "Weekly resume review summary is now available", time: "3 days ago", read: true }
    ]
  },
  adminStats: {
    totalUsers: 1420,
    totalJobs: 124,
    totalApplications: 6842,
    revenue: "$48,250",
    recentJobs: [
      { id: 1, title: "Senior Full Stack Engineer", company: "Stripe", type: "Full-time", status: "Active", applicants: 42 },
      { id: 2, title: "Lead UI/UX Product Designer", company: "Figma", type: "Remote", status: "Active", applicants: 28 },
      { id: 4, title: "Principal Machine Learning Engineer", company: "NVIDIA", type: "Full-time", status: "Draft", applicants: 0 }
    ],
    recentUsers: [
      { id: 101, name: "Sarah Jenkins", email: "sarah.j@stripe.com", role: "Employer", status: "Verified" },
      { id: 102, name: "Alex Mercer", email: "alex.mercer@gmail.com", role: "Candidate", status: "Active" },
      { id: 103, name: "Liam O'Connor", email: "liam@techcorp.io", role: "Candidate", status: "Pending" }
    ],
    monthlyApplications: [120, 250, 480, 610, 890, 1200, 1420],
    categoryShare: [45, 20, 15, 10, 10] // Tech, Design, Marketing, Finance, HR
  }
};
