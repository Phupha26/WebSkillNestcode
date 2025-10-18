const form = document.getElementById('loginForm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const errorBox = document.getElementById('error');
const togglePass = document.getElementById('togglePass');
const loginBtn = document.getElementById('loginBtn');

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
}
function clearError() {
  errorBox.textContent = '';
  errorBox.style.display = 'none';
}

togglePass.addEventListener('click', () => {
  const isPwd = password.type === 'password';
  password.type = isPwd ? 'text' : 'password';
  togglePass.textContent = isPwd ? 'ซ่อน' : 'แสดง';
  password.focus();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const u = username.value.trim();
  const p = password.value;

  if (!u || !p) {
    showError('กรอก Username และ Password ให้ครบ');
    return;
  }

  loginBtn.disabled = true;
  const originalText = loginBtn.textContent;
  loginBtn.textContent = 'กำลังตรวจสอบ...';

  try {
    await new Promise(r => setTimeout(r, 300)); 
    if (u.length >= 3 && p.length >= 8) {
      alert('ล็อกอินสำเร็จ (Demo)');
    } else {
      showError('Username ≥ 3 ตัว และ Password ≥ 8 ตัวอักษร');
    }
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = originalText;
  }
});
