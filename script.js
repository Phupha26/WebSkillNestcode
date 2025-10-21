// Function เพื่อจัดการสถานะการล็อกอิน/ล็อกเอาท์ที่ส่วนหัว
function updateAuthStatus() {
  const authContainer = document.getElementById('nav-actions');
  // ตรวจสอบข้อมูลผู้ใช้ใน localStorage
  const user = JSON.parse(localStorage.getItem("skillnestUser"));

  if (!authContainer) return;

  if (user) {
    // สถานะ: ล็อกอินแล้ว (แสดงชื่อผู้ใช้ + ปุ่ม Logout)
    authContainer.innerHTML = `
      <a href="dashboard.html" class="user-display">Welcome, ${user.name}</a>
      <button id="logoutBtn" class="btn btn-lime">Logout</button>
    `;

    // ผูก Event Listener ให้ปุ่ม Logout
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("skillnestUser");
      window.location.href = "index.html"; // กลับไปหน้าแรกหลัง Logout
    });

  } else {
    // สถานะ: ยังไม่ล็อกอิน (แสดงปุ่ม Sign in + Login)
    authContainer.innerHTML = `
      <a href="signup.html" class="btn btn-amber">Sign in</a>
      <a href="login.html" class="btn btn-lime">Login</a>
    `;
  }
}

// **โค้ดใหม่: จัดการคลิกปุ่ม "Learn Hard and Soft Skill" เพื่อไป Career.html**
const careerCtaBtn = document.getElementById('careerCtaBtn');
if (careerCtaBtn) {
    careerCtaBtn.addEventListener('click', () => {
        // เปลี่ยนหน้าไปยัง Career.html
        window.location.href = "Career.html"; 
    });
}

// เรียกใช้ฟังก์ชันเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', updateAuthStatus);


// แสดงปีอัตโนมัติ (โค้ดเดิม)
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// โค้ด scroll smooth เดิมถูกละไว้ หากไม่ต้องการ
// ถ้าคุณต้องการให้ปุ่มอื่น ๆ มี scroll smooth ให้เพิ่มโค้ดที่เกี่ยวข้องกลับเข้ามา
