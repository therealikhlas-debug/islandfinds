const isAdmin = localStorage.getItem('islandfinds-role') === 'admin';
if (!isAdmin) window.location.replace('login.html');
const adminListings = [
  {title:'Honda Activa 5G', seller:'Rahim K.', location:'Kavaratti', price:54000, status:'approved', image:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=160&q=80'},
  {title:'Wooden canoe, handmade', seller:'Sameer M.', location:'Agatti', price:8500, status:'pending', image:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=160&q=80'},
  {title:'iPhone 13 • 128 GB', seller:'Fathima P.', location:'Kavaratti', price:32000, status:'approved', image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=160&q=80'},
  {title:'Rattan lounge chair pair', seller:'Naseema A.', location:'Bangaram', price:6800, status:'pending', image:'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=160&q=80'},
  {title:'GoPro Hero 10 + accessories', seller:'Ibrahim V.', location:'Minicoy', price:25500, status:'approved', image:'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=160&q=80'}
];
const rows = document.querySelector('#adminRows');
const empty = document.querySelector('#adminEmpty');
const search = document.querySelector('#adminSearch');
const filter = document.querySelector('#adminFilter');
const toast = document.querySelector('#adminToast');
const pendingListings = JSON.parse(localStorage.getItem('islandfinds-pending-listings') || '[]');
pendingListings.forEach((listing) => adminListings.unshift({...listing, seller:'Community member', status:'pending'}));
document.querySelector('#activeCount').textContent = localStorage.getItem('islandfinds-active-listings') || '0';
document.querySelector('#visitCount').textContent = localStorage.getItem('islandfinds-page-visits') || '0';
function showToast(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400); }
function renderRows() {
  const query = search.value.toLowerCase().trim();
  const visible = adminListings.filter((listing) => `${listing.title} ${listing.seller} ${listing.location}`.toLowerCase().includes(query) && (filter.value === 'all' || listing.status === filter.value));
  rows.innerHTML = visible.map((listing) => `<tr><td><div class="admin-listing"><img src="${listing.image}" alt="${listing.title}"><span><strong>${listing.title}</strong><small>Posted recently</small></span></div></td><td>${listing.seller}</td><td>${listing.location}</td><td>₹${listing.price.toLocaleString('en-IN')}</td><td><span class="status-pill ${listing.status}">${listing.status}</span></td><td><button class="table-action" data-title="${listing.title}" data-action="${listing.status === 'pending' ? 'approve' : 'remove'}">${listing.status === 'pending' ? 'Approve' : 'Remove'}</button></td></tr>`).join('');
  document.querySelector('#pendingCount').textContent = adminListings.filter((listing) => listing.status === 'pending').length;
  empty.hidden = visible.length > 0;
}
[search, filter].forEach((control) => control.addEventListener('input', renderRows));
rows.addEventListener('click', (event) => { const actionButton = event.target.closest('[data-action]'); if (!actionButton) return; const listing = adminListings.find((item) => item.title === actionButton.dataset.title); if (actionButton.dataset.action === 'approve') { listing.status = 'approved'; showToast(`${listing.title} approved`); } else { adminListings.splice(adminListings.indexOf(listing), 1); showToast(`${listing.title} removed`); } renderRows(); });
document.querySelector('#refreshActivity').addEventListener('click', (event) => { event.currentTarget.textContent = '✓ Updated'; showToast('Activity feed refreshed'); setTimeout(() => event.currentTarget.textContent = '↻ Refresh', 1600); });
document.querySelector('#logoutAdmin').addEventListener('click', () => { localStorage.removeItem('islandfinds-auth'); localStorage.removeItem('islandfinds-role'); });
renderRows();
