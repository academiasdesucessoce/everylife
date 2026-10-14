const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#nav-principal');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');menu.classList.remove('open')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');menu.classList.toggle('open',open)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu()});
const settings=window.EVERYLIFE_CONFIG||{};
const whatsapp=String(settings.whatsappNumber||'').replace(/\D/g,'');
if(/^55\d{10,11}$/.test(whatsapp)){document.querySelectorAll('.visit-link').forEach(a=>{a.href='https://wa.me/'+whatsapp+'?text='+encodeURIComponent('Olá! Quero conhecer a Everylife e agendar uma visita.');a.target='_blank';a.rel='noopener noreferrer'})}
