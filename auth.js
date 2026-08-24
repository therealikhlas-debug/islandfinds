const authMessage = document.querySelector('#authMessage');
const loginForm = document.querySelector('#loginForm');
const signinForm = document.querySelector('#signinForm');
const adminEmail = 'therealikhlas@gmail.com';
const adminPassword = 'Dontbuzzme#';

function showAuthMessage(message) {
  authMessage.textContent = message;
  authMessage.classList.add('visible');
}

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = loginForm.querySelectorAll('input');
  const email = fields[0].value.trim().toLowerCase();
  const password = fields[1].value;
  if (email !== adminEmail || password !== adminPassword) {
    showAuthMessage('Incorrect admin email or password.');
    return;
  }
  localStorage.setItem('islandfinds-auth', 'true');
  localStorage.setItem('islandfinds-role', 'admin');
  showAuthMessage('Welcome back. Taking you to the marketplace...');
  setTimeout(() => { window.location.href = 'index.html'; }, 900);
});

signinForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  localStorage.setItem('islandfinds-auth', 'true');
  localStorage.setItem('islandfinds-role', 'member');
  showAuthMessage('Account created. Welcome to the islands!');
  setTimeout(() => { window.location.href = 'index.html'; }, 900);
});

document.querySelector('#forgotLink')?.addEventListener('click', (event) => {
  event.preventDefault();
  showAuthMessage('Enter your email or mobile number and we will send a reset link.');
});
