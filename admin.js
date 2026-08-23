const hasAdminAccess = localStorage.getItem('islandfinds-role') === 'admin';
if (!hasAdminAccess) window.location.href = 'login.html';

const adminListings = [
  {title:'Honda Activa 5G', seller:'Rahim K.', location:'Kavaratti', price:54000, status:'approved'},
  {title:'Wooden canoe, handmade', seller:'Sameer M.', location:'Agatti', price:8500, status:'pending'},
  {title:'iPhone 13 • 128 GB', seller:'Fathima P.', location:'Kavaratti', price:32000, status:'approved'},
  {title:'Rattan lounge chair pair', seller:'Naseema A.', location:'Bangaram', price:6800, status:'pending'},
  {title:'GoPro Hero 10 + accessories', seller:'Ibrahim V.', location:'Minicoy', price:25500, status:'approved'},
  {title:'Home-cooked island lunch', seller:'Shameema C.', location:'Andrott', price:180, status:'pending'}
];
const rows = document.querySelector('#adminRows');
const empty = document.querySelector('#adminEmpty');
const search = document.querySelector('#adminSearch');
const filter = document.querySelector('#adminFilter');
document.querySelector('#logoutAdmin').textContent = 'AS Neoo';
document.querySelector('.admin-heading h1').textContent = 'Good morning, Neoo.';
document.querySelector('.stats-grid .stat-card strong').textContent = localStorage.getItem('islandfinds-active-listings') || '0';
const visitsCard = document.querySelectorAll('.stats-grid .stat-card')[1];
visitsCard.querySelector('.stat-label').textContent = 'Page visits';
visitsCard.querySelector('strong').textContent = localStorage.getItem('islandfinds-page-visits') || '0';
visitsCard.querySelector('small').textContent = 'Since launch';

function renderAdminRows() {
  const query = search.value.toLowerCase().trim();
  const visible = adminListings.filter((listing) => {
    const matchesQuery = `${listing.title} ${listing.seller} ${listing.location}`.toLowerCase().includes(query);
    return matchesQuery && (filter.value === 'all' || listing.status === filter.value);
  });
  rows.innerHTML = visible.map((listing) => `<tr><td><strong>${listing.title}</strong><small>Posted recently</small></td><td>${listing.seller}</td><td>${listing.location}</td><td>₹${listing.price.toLocaleString('en-IN')}</td><td><span class="status-pill ${listing.status}">${listing.status}</span></td><td><button class="table-action" data-title="${listing.title}" data-action="${listing.status === 'pending' ? 'approve' : 'remove'}">${listing.status === 'pending' ? 'Approve' : 'Remove'}</button></td></tr>`).join('');
  document.querySelector('#pendingCount').textContent = adminListings.filter((item) => item.status === 'pending').length;
  empty.hidden = visible.length > 0;
}

[search, filter].forEach((control) => control.addEventListener('input', renderAdminRows));
rows.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const listing = adminListings.find((item) => item.title === actionButton.dataset.title);
  if (actionButton.dataset.action === 'approve') {
    listing.status = 'approved';
    showToast(`${listing.title} approved`);
  } else {
    adminListings.splice(adminListings.indexOf(listing), 1);
    showToast(`${listing.title} removed`);
  }
  document.querySelector('#pendingCount').textContent = adminListings.filter((item) => item.status === 'pending').length;
  renderAdminRows();
});
document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));
document.querySelector('#logoutAdmin').addEventListener('click', () => { localStorage.removeItem('islandfinds-auth'); localStorage.removeItem('islandfinds-role'); });
let toastTimer;
function showToast(message) { const toast = document.querySelector('#adminToast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); }
renderAdminRows();
