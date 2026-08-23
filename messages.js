const messages = JSON.parse(localStorage.getItem('islandfinds-messages') || '[]');
const conversationRows = document.querySelector('#conversationRows');
const conversationEmpty = document.querySelector('#conversationEmpty');
const chatEmpty = document.querySelector('#chatEmpty');
const chatActive = document.querySelector('#chatActive');
let activeConversation;

function renderConversations() {
  document.querySelector('#messageCount').textContent = messages.length;
  conversationRows.innerHTML = messages.map((message, index) => `<button class="conversation-row ${activeConversation === index ? 'active' : ''}" data-index="${index}"><span class="avatar">IS</span><span><strong>${message.seller}</strong><small>${message.listing}</small><em>${message.preview}</em></span><time>${message.time}</time></button>`).join('');
  conversationEmpty.hidden = messages.length > 0;
}
function openConversation(index) {
  activeConversation = index;
  const conversation = messages[index];
  chatEmpty.hidden = true;
  chatActive.hidden = false;
  document.querySelector('#chatSeller').textContent = conversation.seller;
  document.querySelector('#chatListing').textContent = conversation.listing;
  document.querySelector('#chatMessages').innerHTML = `<div class="chat-bubble theirs">${conversation.preview}</div><div class="chat-bubble mine">Thanks for reaching out. I will get back to you shortly.</div>`;
  renderConversations();
}
conversationRows.addEventListener('click', (event) => { const row = event.target.closest('[data-index]'); if (row) openConversation(Number(row.dataset.index)); });
document.querySelector('#messageForm').addEventListener('submit', (event) => { event.preventDefault(); const input = document.querySelector('#messageInput'); document.querySelector('#chatMessages').insertAdjacentHTML('beforeend', `<div class="chat-bubble mine">${input.value}</div>`); messages[activeConversation].preview = input.value; messages[activeConversation].time = 'Just now'; localStorage.setItem('islandfinds-messages', JSON.stringify(messages)); input.value = ''; renderConversations(); });
document.querySelector('#logoutMessages').addEventListener('click', () => { localStorage.removeItem('islandfinds-auth'); localStorage.removeItem('islandfinds-role'); });
if (localStorage.getItem('islandfinds-auth') !== 'true') window.location.href = 'login.html';
renderConversations();
const requestedListing = new URLSearchParams(window.location.search).get('listing');
const requestedIndex = messages.findIndex((message) => message.listing === requestedListing);
if (requestedIndex >= 0) openConversation(requestedIndex);
