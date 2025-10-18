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
