const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#nav-principal');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');menu.classList.remove('open')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');menu.classList.toggle('open',open)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu()});
const settings=window.EVERYLIFE_CONFIG||{};
const whatsapp=String(settings.whatsappNumber||'5585997237204').replace(/\D/g,'');
const whatsappMsg=settings.whatsappMessage||'Olá! Vim pelo site e gostaria de agendar uma aula experimental.';
if(/^55\d{10,11}$/.test(whatsapp)){
  document.querySelectorAll('.visit-link').forEach(a=>{
    a.href='https://wa.me/'+whatsapp+'?text='+encodeURIComponent(whatsappMsg);
    a.target='_blank';
    a.rel='noopener noreferrer';
  });
}

// Dynamic Staggered Children Setup & Scroll Reveal
const staggerGroups=[
'.pillar-grid .pillar',
'.method-timeline li',
'.care-benefits > span',
'.focus-benefits > div',
'.evaluations ul li',
'.benefits-inner > span',
'.testimonials-track .testimonial-card',
'.faq-list details'
];
staggerGroups.forEach(selector=>{
document.querySelectorAll(selector).forEach((el,idx)=>{
el.classList.add('stagger-item');
el.style.setProperty('--stagger',idx);
});
});

// Header Scroll Elevation Effect
const siteHeader=document.querySelector('.site-header');
if(siteHeader){
window.addEventListener('scroll',()=>{
siteHeader.classList.toggle('scrolled',window.scrollY>20);
},{passive:true});
}

// Intersection Observer for Smooth Reveal Animations on Scroll
if('IntersectionObserver' in window){
const revealObserver=new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add('revealed');
}else if(entry.boundingClientRect.top>0){
entry.target.classList.remove('revealed');
}
});
},{threshold:0.15,rootMargin:'0px 0px -50px 0px'});

document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>revealObserver.observe(el));
}else{
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>el.classList.add('revealed'));
}

// Automatic & Arrow-Driven Photo Carousel for Team Section
(function initTeamCarousel(){
const carousel=document.querySelector('.team-carousel');
if(!carousel)return;
const track=carousel.querySelector('.team-carousel-track');
if(!track)return;
const slides=Array.from(track.children);
if(slides.length<=1)return;

const prevBtn=carousel.querySelector('.team-prev');
const nextBtn=carousel.querySelector('.team-next');

let currentIndex=0;

function getSlideStep(){
const firstSlide=slides[0];
if(!firstSlide)return 0;
const style=window.getComputedStyle(track);
const gap=parseFloat(style.gap)||16;
return firstSlide.getBoundingClientRect().width+gap;
}

function getMaxIndex(){
const isMobile=window.innerWidth<=760;
return isMobile ? (slides.length - 1) : (slides.length - 2);
}

function updateCarousel(){
const step=getSlideStep();
track.style.transform=`translateX(-${currentIndex*step}px)`;
}

function nextSlide(){
const max=getMaxIndex();
currentIndex=(currentIndex>=max)?0:currentIndex+1;
updateCarousel();
}

function prevSlide(){
const max=getMaxIndex();
currentIndex=(currentIndex<=0)?max:currentIndex-1;
updateCarousel();
}

let timer=setInterval(nextSlide,3800);

function resetTimer(){
clearInterval(timer);
timer=setInterval(nextSlide,3800);
}

if(nextBtn){
nextBtn.addEventListener('click',()=>{
nextSlide();
resetTimer();
});
}

if(prevBtn){
prevBtn.addEventListener('click',()=>{
prevSlide();
resetTimer();
});
}

window.addEventListener('resize',updateCarousel,{passive:true});

// Pause on hover
carousel.addEventListener('mouseenter',()=>{clearInterval(timer)});
carousel.addEventListener('mouseleave',()=>{resetTimer()});
})();

// Testimonials Video Carousel & Modal Controller
(function initTestimonials(){
const section=document.querySelector('.testimonials');
if(!section)return;

const track=section.querySelector('.testimonials-track');
const cards=Array.from(section.querySelectorAll('.testimonial-card'));
const prevBtn=section.querySelector('.testimonials-prev');
const nextBtn=section.querySelector('.testimonials-next');
const dotsContainer=section.querySelector('.testimonials-dots');
const nav=section.querySelector('.testimonials-nav');

if(!track||cards.length===0)return;

function setupDots(){
if(!dotsContainer)return;
dotsContainer.innerHTML='';
cards.forEach((_,idx)=>{
const dot=document.createElement('button');
dot.type='button';
dot.className='testimonials-dot'+(idx===0?' active':'');
dot.setAttribute('role','tab');
dot.setAttribute('aria-label',`Ir para depoimento ${idx+1}`);
dot.setAttribute('aria-selected',idx===0?'true':'false');
dot.addEventListener('click',()=>{scrollToCard(idx);});
dotsContainer.appendChild(dot);
});
}

function getCardWidth(){
const card=cards[0];
if(!card)return 0;
const style=window.getComputedStyle(track);
const gap=parseFloat(style.gap)||20;
return card.getBoundingClientRect().width+gap;
}

function scrollToCard(index){
const step=getCardWidth();
track.scrollTo({left:index*step,behavior:'smooth'});
}

function updateControlsState(){
const maxScroll=track.scrollWidth-track.clientWidth;
const isOverflowing=maxScroll>10;

if(nav)nav.style.display=isOverflowing?'':'none';
if(dotsContainer)dotsContainer.style.display=isOverflowing?'':'none';

if(!isOverflowing)return;

const scrollLeft=track.scrollLeft;
const step=getCardWidth()||1;
const activeIndex=Math.min(cards.length-1,Math.max(0,Math.round(scrollLeft/step)));

if(prevBtn)prevBtn.disabled=scrollLeft<=4;
if(nextBtn)nextBtn.disabled=scrollLeft>=maxScroll-4;

if(dotsContainer){
const dots=dotsContainer.querySelectorAll('.testimonials-dot');
dots.forEach((dot,idx)=>{
const isActive=idx===activeIndex;
dot.classList.toggle('active',isActive);
dot.setAttribute('aria-selected',String(isActive));
});
}
}

setupDots();
updateControlsState();

if(prevBtn){
prevBtn.addEventListener('click',()=>{
const step=getCardWidth();
track.scrollBy({left:-step,behavior:'smooth'});
});
}

if(nextBtn){
nextBtn.addEventListener('click',()=>{
const step=getCardWidth();
track.scrollBy({left:step,behavior:'smooth'});
});
}

let scrollTimeout;
track.addEventListener('scroll',()=>{
if(scrollTimeout)cancelAnimationFrame(scrollTimeout);
scrollTimeout=requestAnimationFrame(updateControlsState);
},{passive:true});

window.addEventListener('resize',()=>{
updateControlsState();
},{passive:true});

// Video Modal Controller
const modal=document.querySelector('#video-modal');
if(!modal)return;

const player=modal.querySelector('.video-modal-player');
const iframe=modal.querySelector('.video-modal-iframe');
const placeholderMsg=modal.querySelector('.video-modal-placeholder-msg');
const nameEl=modal.querySelector('.video-modal-name');
const roleEl=modal.querySelector('.video-modal-role');
const igLink=modal.querySelector('.video-modal-ig-link');
const closeBtn=modal.querySelector('.video-modal-close');
let lastFocusedTrigger=null;

function openModal(trigger){
lastFocusedTrigger=trigger;
const isPlaceholder=trigger.getAttribute('data-placeholder')==='true';
const name=trigger.getAttribute('data-student-name')||'';
const role=trigger.getAttribute('data-student-role')||'';
const igUrl=trigger.getAttribute('data-instagram-url')||'';
const videoSrc=trigger.getAttribute('data-video-src')||'';
const poster=trigger.getAttribute('data-video-poster')||'';
const reelCode=trigger.getAttribute('data-reel-code')||'';

if(nameEl)nameEl.textContent=name;
if(roleEl)roleEl.textContent=role;

if(igLink){
if(igUrl){
igLink.href=igUrl;
igLink.style.display='inline-flex';
}else{
igLink.href='https://www.instagram.com/everylifeoficial/';
igLink.style.display='inline-flex';
}
}

if(isPlaceholder||(!videoSrc&&!reelCode)){
if(player){
player.pause();
player.removeAttribute('src');
player.style.display='none';
}
if(iframe){
iframe.src='';
iframe.style.display='none';
}
if(placeholderMsg)placeholderMsg.style.display='flex';
}else if(videoSrc){
if(placeholderMsg)placeholderMsg.style.display='none';
if(iframe){
iframe.src='';
iframe.style.display='none';
}
if(player){
player.style.display='block';
player.poster=poster;
player.src=videoSrc;
player.load();
player.play().catch(()=>{});
}
}else if(reelCode){
if(placeholderMsg)placeholderMsg.style.display='none';
if(player){
player.pause();
player.removeAttribute('src');
player.style.display='none';
}
if(iframe){
iframe.style.display='block';
iframe.src=`https://www.instagram.com/reel/${reelCode}/embed/`;
}
}

modal.classList.add('active');
modal.setAttribute('aria-hidden','false');
document.body.style.overflow='hidden';
closeBtn.focus();
}

function closeModal(){
modal.classList.remove('active');
modal.setAttribute('aria-hidden','true');
document.body.style.overflow='';
if(player){
player.pause();
player.removeAttribute('src');
player.load();
}
if(iframe){
iframe.src='';
iframe.style.display='none';
}
if(lastFocusedTrigger){
lastFocusedTrigger.focus();
}
}

section.querySelectorAll('.testimonial-trigger').forEach(trigger=>{
trigger.addEventListener('click',()=>{openModal(trigger);});
});

modal.querySelectorAll('[data-close-modal]').forEach(el=>{
el.addEventListener('click',closeModal);
});

document.addEventListener('keydown',e=>{
if(modal.classList.contains('active')){
if(e.key==='Escape'){
e.preventDefault();
closeModal();
}else if(e.key==='Tab'){
const focusables=modal.querySelectorAll('button:not([disabled]),[href],video');
if(!focusables.length)return;
const first=focusables[0];
const last=focusables[focusables.length-1];
if(e.shiftKey&&document.activeElement===first){
e.preventDefault();
last.focus();
}else if(!e.shiftKey&&document.activeElement===last){
e.preventDefault();
first.focus();
}
}
}
});
})();



