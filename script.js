// Function เพื่อจัดการสถานะการล็อกอิน/ล็อกเอาท์ที่ส่วนหัว
function updateAuthStatus() {
  const authContainer = document.getElementById('nav-actions');
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

// **เรียกใช้ฟังก์ชันเมื่อหน้าเว็บโหลดเสร็จ**
document.addEventListener('DOMContentLoaded', updateAuthStatus);


// (โค้ดเดิมที่เหลือ)
// แสดงปีอัตโนมัติ
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// scroll smooth เมื่อกดปุ่ม LET’S RUMBLE
const rumble = document.querySelector('.btn-cta');
if (rumble) {
  rumble.addEventListener('click', (e) => {
    e.preventDefault();
    const explore = document.getElementById('explore');
    if (explore) window.scrollTo({ top: explore.offsetTop - 20, behavior: 'smooth' });
  });
}
