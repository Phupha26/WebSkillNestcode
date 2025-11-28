// ==========================================
// AUTHENTICATION STATUS MANAGEMENT WITH FIREBASE
// ==========================================

import { getCurrentUser, logoutUser, onAuthChange } from './firebase-auth-service.js';

// ==========================================
// HELPER FUNCTIONS FOR DROPDOWNS
// ==========================================
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'false');
    });
    closeAllSubmenus();
}

function closeAllSubmenus() {
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.classList.remove('show');
    });
}

// ==========================================
// UPDATE AUTH STATUS IN UI
// ==========================================
async function updateAuthStatus() {
  const authContainer = document.getElementById('nav-actions');
  
  if (!authContainer) {
    console.log('nav-actions element not found');
    return;
  }

  console.log('Updating auth status...');
  const user = await getCurrentUser();

  if (user) {
    console.log('User is logged in:', user);
    const fullName = `${user.firstName} ${user.lastName}`;
    
    authContainer.innerHTML = `
      <div class="user-dropdown-container">
          <button id="dropdownTrigger" class="user-display-btn" aria-expanded="false" aria-controls="userMenu">
              Welcome, ${fullName} <span class="dropdown-icon">▼</span>
          </button>
          
          <div id="userMenu" class="user-dropdown-menu">
              <a href="certificate.html" class="dropdown-item">Certificate</a>
              <a href="account-setting.html" class="dropdown-item">Account Setting</a>
              <button id="logoutBtn" class="dropdown-item logout-btn">Logout</button>
          </div>
      </div>
    `;

    // Setup User Dropdown
    setupUserDropdown();

    // Bind Logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        console.log('Logout button clicked');
        const result = await logoutUser(); 
        if (result.success) {
          alert('ออกจากระบบสำเร็จ!');
          window.location.href = "index.html";
        } else {
          alert('เกิดข้อผิดพลาด: ' + result.error.message);
        }
      });
    }

  } else {
    console.log('User is NOT logged in');
    authContainer.innerHTML = `
      <a href="signup.html" class="btn btn-amber">Sign Up</a>
      <a href="login.html" class="btn btn-lime">Login</a>
    `;
  }
}

// ==========================================
// USER DROPDOWN SETUP
// ==========================================
function setupUserDropdown() {
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const userMenu = document.getElementById('userMenu');

    if (dropdownTrigger && userMenu) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const isExpanded = userMenu.classList.contains('show');
            
            userMenu.classList.toggle('show');
            dropdownTrigger.setAttribute('aria-expanded', !isExpanded);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (userMenu.classList.contains('show') && 
                !userMenu.contains(e.target) && 
                e.target !== dropdownTrigger &&
                !dropdownTrigger.contains(e.target)) {
                
                userMenu.classList.remove('show');
                dropdownTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// ==========================================
// COURSE DROPDOWN SETUP (With Hover Support)
// ==========================================
function setupCourseDropdown() {
    const courseDropdownTrigger = document.getElementById('courseDropdownTrigger');
    const courseMenu = document.getElementById('courseMenu');
    const courseDropdown = document.querySelector('.nav-item.dropdown');

    if (!courseDropdownTrigger || !courseMenu) return;

    // Desktop: Hover to show/hide main dropdown
    if (courseDropdown) {
        let hoverTimeout;
        
        courseDropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                clearTimeout(hoverTimeout);
                courseMenu.classList.add('show');
                courseDropdownTrigger.setAttribute('aria-expanded', 'true');
            }
        });

        courseDropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                hoverTimeout = setTimeout(() => {
                    courseMenu.classList.remove('show');
                    courseDropdownTrigger.setAttribute('aria-expanded', 'false');
                    closeAllSubmenus();
                }, 100);
            }
        });
        
        // เพิ่ม event listener สำหรับ courseMenu เพื่อไม่ให้หายเมื่อเมาส์อยู่ในเมนู
        courseMenu.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                clearTimeout(hoverTimeout);
            }
        });
        
        courseMenu.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                courseMenu.classList.remove('show');
                courseDropdownTrigger.setAttribute('aria-expanded', 'false');
                closeAllSubmenus();
            }
        });
    }

    // Mobile/Tablet: Click to toggle main dropdown
    courseDropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (window.innerWidth <= 768) {
            const isExpanded = courseMenu.classList.contains('show');
            closeAllDropdowns();
            
            if (!isExpanded) {
                courseMenu.classList.add('show');
                courseDropdownTrigger.setAttribute('aria-expanded', 'true');
            }
        }
    });

     // Handle submenu triggers
    const submenuTriggers = document.querySelectorAll('.submenu-trigger');
    submenuTriggers.forEach(trigger => {
        const submenuId = 'submenu-' + trigger.dataset.submenu;
        const submenu = document.getElementById(submenuId);
        const submenuContainer = trigger.closest('.dropdown-submenu');
        
        if (!submenu || !submenuContainer) return;

        let submenuTimeout;

        // Desktop: hover to show submenu
        submenuContainer.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                clearTimeout(submenuTimeout);
                closeAllSubmenus();
                submenu.classList.add('show');
            }
        });

        submenuContainer.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                submenuTimeout = setTimeout(() => {
                    submenu.classList.remove('show');
                }, 100);
            }
        });
        
        // เพิ่ม event listener สำหรับ submenu
        submenu.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                clearTimeout(submenuTimeout);
            }
        });
        
        submenu.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                submenu.classList.remove('show');
            }
        });

        // Mobile/Tablet: click to toggle submenu
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = submenu.classList.contains('show');
                closeAllSubmenus();
                
                if (!isOpen) {
                    submenu.classList.add('show');
                }
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    // Close dropdowns on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeAllDropdowns();
        }
    });
}

// ==========================================
// CAREER BUTTON HANDLER
// ==========================================
const careerCtaBtn = document.getElementById('careerCtaBtn');
if (careerCtaBtn) {
  careerCtaBtn.addEventListener('click', async () => {
    console.log('Career button clicked');
    const user = await getCurrentUser();

    if (user) {
      window.location.href = "pages/career.html";
    } else {
      alert('กรุณาเข้าสู่ระบบก่อนเริ่มเรียน');
      window.location.href = "login.html";
    }
  });
}

// ==========================================
// MODAL MANAGEMENT FOR CAREER PATH SELECTION
// ==========================================
const pathModal = document.getElementById('pathModal');
const modalTitle = document.getElementById('modalTitle');
const freedomLink = document.getElementById('freedomLink');
const planningLink = document.getElementById('planningLink');

window.openPathModal = function(careerSlug) {
  if (pathModal) {
    const displayTitle = careerSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    modalTitle.textContent = `Select Path for ${displayTitle}`;

    freedomLink.href = `course/${careerSlug}-freedom.html`;
    planningLink.href = `course/${careerSlug}-planning.html`;
    
    pathModal.style.display = "block";
  }
}

window.closePathModal = function() {
  if (pathModal) {
    pathModal.style.display = "none";
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target == pathModal) {
    pathModal.style.display = "none";
  }
}

// ==========================================
// LISTEN TO AUTH STATE CHANGES
// ==========================================
console.log('Setting up auth state listener...');
onAuthChange((user) => {
  console.log('Auth state changed:', user ? `${user.firstName} logged in` : 'No user');
  updateAuthStatus();
});

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  updateAuthStatus();
  setupCourseDropdown(); 
  
  // Auto-update year display (if element exists)
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// ===== Character Animation on Load =====
window.addEventListener('load', () => {
    const characters = document.querySelectorAll('.char');
    characters.forEach((char, index) => {
        setTimeout(() => {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

console.log('SkillNest navigation initialized ✓');