const listings = [
  {title:'Honda Activa 5G',price:54000,category:'Vehicles',location:'Kavaratti',time:'12 min ago',condition:'Good',description:'Reliable daily ride with smooth handling and plenty of life left in it. Available for a quick local viewing.',image:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80'},
  {title:'Wooden canoe, handmade',price:8500,category:'Vehicles',location:'Agatti',time:'34 min ago',condition:'Like new',description:'Hand-built from sturdy local wood. Light enough for easy launching and ready for calm lagoon trips.',image:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80'},
  {title:'iPhone 13 • 128 GB',price:32000,category:'Electronics',location:'Kavaratti',time:'1 hr ago',condition:'Excellent',description:'Unlocked 128 GB iPhone 13 in excellent condition, with a healthy battery and original charging cable.',image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80'},
  {title:'Rattan lounge chair pair',price:6800,category:'Home',location:'Bangaram',time:'2 hrs ago',condition:'Good',description:'A breezy pair of woven rattan chairs that bring a little lagoon-side calm to any verandah.',image:'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=700&q=80'},
  {title:'GoPro Hero 10 + accessories',price:25500,category:'Electronics',location:'Minicoy',time:'3 hrs ago',condition:'Like new',description:'GoPro Hero 10 with waterproof case, spare battery, and a compact grip. Great for documenting island days.',image:'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=80'},
  {title:'Home-cooked island lunch',price:180,category:'Services',location:'Andrott',time:'5 hrs ago',condition:'Fresh today',description:'A filling home-cooked lunch prepared fresh today. Pickup near the main market, with limited portions.',image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80'}
];
const approvedListings = JSON.parse(localStorage.getItem('islandfinds-approved-listings') || '[]');
approvedListings.forEach((listing) => listings.unshift(listing));

const listingGrid = document.querySelector('#listingGrid');
const emptyState = document.querySelector('#emptyState');
const searchInput = document.querySelector('#searchInput');
const locationFilter = document.querySelector('#locationFilter');
const sortSelect = document.querySelector('#sortSelect');
let activeCategory = 'All';
let savedTitles = new Set();
const pendingListings = JSON.parse(localStorage.getItem('islandfinds-pending-listings') || '[]');
let activeListingCount = Number(localStorage.getItem('islandfinds-active-listings') || 0);
document.querySelector('#activeListingCount').textContent = activeListingCount;
const pageVisits = Number(localStorage.getItem('islandfinds-page-visits') || 0) + 1;
localStorage.setItem('islandfinds-page-visits', pageVisits);
const isAuthenticated = localStorage.getItem('islandfinds-auth') === 'true';
const isAdmin = localStorage.getItem('islandfinds-role') === 'admin';
document.querySelector('#profileWrap').hidden = !isAuthenticated;
document.querySelector('#loginHeaderLink').hidden = isAuthenticated;
document.querySelector('#messagesHeaderLink').hidden = !isAuthenticated;
document.querySelector('.admin-badge').hidden = !isAdmin;
document.querySelector('.profile-name').textContent = 'Neoo';
document.querySelector('#profileMenu strong').textContent = 'Hi, Neoo';
const themeToggle = document.querySelector('#themeToggle');
const savedTheme = localStorage.getItem('islandfinds-theme');
if (savedTheme === 'dark') document.body.classList.add('dark-mode');
function updateThemeToggle() {
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.setAttribute('aria-pressed', isDark);
}
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('islandfinds-theme', theme);
  updateThemeToggle();
});
updateThemeToggle();

function renderListings() {
  const query = searchInput.value.trim().toLowerCase();
  const location = locationFilter.value;
  let visible = listings.filter((listing) => {
    const matchesCategory = activeCategory === 'All' || listing.category === activeCategory;
    const matchesLocation = location === 'All islands' || listing.location === location;
    const searchable = `${listing.title} ${listing.category} ${listing.location}`.toLowerCase();
    return matchesCategory && matchesLocation && searchable.includes(query);
  });
  if (sortSelect.value === 'price-low') visible.sort((a, b) => a.price - b.price);
  if (sortSelect.value === 'price-high') visible.sort((a, b) => b.price - a.price);

  listingGrid.innerHTML = visible.map((listing) => `
    <article class="listing-card" tabindex="0" role="button" data-title="${listing.title}" aria-label="View details for ${listing.title}">
      <div class="listing-image"><img src="${listing.image}" alt="${listing.title}" loading="lazy"><button class="save-button ${savedTitles.has(listing.title) ? 'saved' : ''}" data-save="${listing.title}" aria-label="Save ${listing.title}">${savedTitles.has(listing.title) ? '♥' : '♡'}</button><span class="condition">${listing.condition}</span></div>
      <div class="listing-info"><div class="listing-title" title="${listing.title}">${listing.title}</div><div class="listing-price">₹${listing.price.toLocaleString('en-IN')}</div><div class="listing-location"><span>⌖ ${listing.location}</span><span>${listing.time}</span></div></div>
    </article>`).join('');
  emptyState.hidden = visible.length > 0;
}

document.querySelectorAll('.category-tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelector('.category-tab.active').classList.remove('active');
  tab.classList.add('active');
  activeCategory = tab.dataset.category;
  renderListings();
}));

[searchInput, locationFilter, sortSelect].forEach((control) => control.addEventListener('input', renderListings));
document.querySelector('#searchButton').addEventListener('click', () => { renderListings(); document.querySelector('#listings').scrollIntoView({behavior:'smooth'}); });
document.querySelector('#notificationButton').addEventListener('click', () => showToast('You are all caught up. No new messages.'));
document.querySelector('#profileButton').addEventListener('click', () => {
  const profileButton = document.querySelector('#profileButton');
  const profileMenu = document.querySelector('#profileMenu');
  const isOpen = profileMenu.classList.toggle('visible');
  profileButton.setAttribute('aria-expanded', isOpen);
});
document.querySelector('#logoutLink').addEventListener('click', () => {
  localStorage.removeItem('islandfinds-auth');
  localStorage.removeItem('islandfinds-role');
});
document.querySelector('#adminLink').addEventListener('click', (event) => {
  document.querySelector('#profileMenu').classList.remove('visible');
});
listingGrid.addEventListener('click', (event) => {
  const saveButton = event.target.closest('[data-save]');
  if (!saveButton) return;
  const title = saveButton.dataset.save;
  savedTitles.has(title) ? savedTitles.delete(title) : savedTitles.add(title);
  renderListings();
  showToast(savedTitles.has(title) ? 'Saved to your favourites' : 'Removed from favourites');
});
listingGrid.addEventListener('click', (event) => {
  if (event.target.closest('[data-save]')) return;
  const card = event.target.closest('[data-title]');
  if (card) openDetails(card.dataset.title);
});
listingGrid.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    const card = event.target.closest('[data-title]');
    if (card) { event.preventDefault(); openDetails(card.dataset.title); }
  }
});

const backdrop = document.querySelector('#modalBackdrop');
const adForm = document.querySelector('#adForm');
const publishButton = adForm.querySelector('.submit-button');
const photoLabel = document.createElement('label');
photoLabel.innerHTML = 'Picture <input id="adImage" type="file" accept="image/*" required><img class="photo-preview" alt="Selected picture preview" hidden>';
adForm.insertBefore(photoLabel, publishButton);
const photoInput = document.querySelector('#adImage');
const photoPreview = document.querySelector('.photo-preview');
photoInput.addEventListener('change', () => {
  const selectedFile = photoInput.files[0];
  if (!selectedFile) return;
  photoPreview.src = URL.createObjectURL(selectedFile);
  photoPreview.hidden = false;
});
const openModal = () => { backdrop.hidden = false; document.querySelector('#adTitle').focus(); };
document.querySelector('#openModal').addEventListener('click', openModal);
document.querySelector('#closeModal').addEventListener('click', () => { backdrop.hidden = true; });
backdrop.addEventListener('click', (event) => { if (event.target === backdrop) backdrop.hidden = true; });
function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
document.querySelector('#adForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.querySelector('#adTitle').value.trim();
  const price = Number(document.querySelector('#adPrice').value);
  const category = document.querySelector('#adCategory').value;
  const location = document.querySelector('#adLocation').value;
  const image = await readImage(photoInput.files[0]);
  pendingListings.unshift({title, price, category, location, time:'just now', condition:'Pending review', description:'A fresh listing from your island community. Message the seller to learn more and arrange a viewing.', image});
  localStorage.setItem('islandfinds-pending-listings', JSON.stringify(pendingListings));
  backdrop.hidden = true;
  event.target.reset();
  activeCategory = 'All';
  document.querySelector('.category-tab.active').classList.remove('active');
  document.querySelector('[data-category="All"]').classList.add('active');
  renderListings();
  showToast('Your listing was sent for admin approval');
});

const detailBackdrop = document.querySelector('#detailBackdrop');
function openDetails(title) {
  const listing = listings.find((item) => item.title === title);
  if (!listing) return;
  document.querySelector('#detailImage').src = listing.image;
  document.querySelector('#detailImage').alt = listing.title;
  document.querySelector('#detailCategory').textContent = `${listing.category} • ${listing.condition}`;
  document.querySelector('#detailTitle').textContent = listing.title;
  document.querySelector('#detailPrice').textContent = `₹${listing.price.toLocaleString('en-IN')}`;
  document.querySelector('#detailDescription').textContent = listing.description;
  document.querySelector('#detailLocation').textContent = `⌖ ${listing.location}`;
  document.querySelector('#detailTime').textContent = listing.time;
  detailBackdrop.hidden = false;
}
document.querySelector('#closeDetail').addEventListener('click', () => { detailBackdrop.hidden = true; });
detailBackdrop.addEventListener('click', (event) => { if (event.target === detailBackdrop) detailBackdrop.hidden = true; });
document.querySelector('#contactSeller').addEventListener('click', () => {
  if (!isAuthenticated) { window.location.href = 'login.html'; return; }
  const title = document.querySelector('#detailTitle').textContent;
  const listing = listings.find((item) => item.title === title);
  const messages = JSON.parse(localStorage.getItem('islandfinds-messages') || '[]');
  if (listing && !messages.some((message) => message.listing === listing.title)) messages.unshift({listing:listing.title, seller:'Island seller', preview:'Hi! I am interested in this listing.', time:'Just now'});
  localStorage.setItem('islandfinds-messages', JSON.stringify(messages));
  window.location.href = `messages.html?listing=${encodeURIComponent(title)}`;
});

let toastTimer;
function showToast(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2500); }
renderListings();
