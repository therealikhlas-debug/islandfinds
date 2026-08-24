const isAdmin = localStorage.getItem('islandfinds-role') === 'admin';
if (!isAdmin) window.location.replace('login.html');
document.querySelector('#activeCount').textContent = localStorage.getItem('islandfinds-active-listings') || '0';
document.querySelector('#visitCount').textContent = localStorage.getItem('islandfinds-page-visits') || '0';
document.querySelector('#logoutAdmin').addEventListener('click', () => {
  localStorage.removeItem('islandfinds-auth');
  localStorage.removeItem('islandfinds-role');
});
