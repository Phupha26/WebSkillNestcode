// ========== AUTH DEMO VERSION ========== //
// ข้อมูลแอดมิน (จำลอง)
const ADMIN_ACCOUNT = {
  email: "admin@gmail.com",
  password: "123456",
  name: "Admin SkillNest"
};

// ผูก event กับฟอร์ม
document.getElementById("loginForm")?.addEventListener("submit", function(e){
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  // ตัวแปร errorBox ตอนนี้สามารถหา element ได้แล้ว
  const errorBox = document.getElementById("error-msg"); 

  // ตรวจสอบข้อมูล
  if(email === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password){
    // จำลองการ "ล็อกอินสำเร็จ"
    localStorage.setItem("skillnestUser", JSON.stringify({
      email: ADMIN_ACCOUNT.email,
      name: ADMIN_ACCOUNT.name
    }));
    // **แก้ไข**: เปลี่ยนการ redirect ไปที่ dashboard.html เพื่อให้สอดคล้องกับการจัดการสิทธิ์
    window.location.href = "index.html"; 
  }else{
    // แสดงข้อความผิดพลาด
    errorBox.textContent = "❌ Invalid email or password.";
  }
});