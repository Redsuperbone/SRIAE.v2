function toggleMenus() {
  const userBtn = document.getElementById('userBtn');
  const userDropdown = document.getElementById('userDropdown');
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  userBtn?.addEventListener('click', (e) => {
    userDropdown?.classList.toggle('show');
    notifDropdown?.classList.remove('show');
    e.stopPropagation();
  });
  notifBtn?.addEventListener('click', (e) => {
    notifDropdown?.classList.toggle('show');
    userDropdown?.classList.remove('show');
    e.stopPropagation();
  });
  window.addEventListener('click', (e) => {
    if (userBtn && !userBtn.contains(e.target)) userDropdown?.classList.remove('show');
    if (notifBtn && !notifBtn.contains(e.target)) notifDropdown?.classList.remove('show');
  });
}
toggleMenus();
