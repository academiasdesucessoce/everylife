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

// Dynamic Staggered Children Setup & Scroll Reveal
const staggerGroups=[
'.pillar-grid .pillar',
'.method-timeline li',
'.care-benefits > span',
'.focus-benefits > div',
'.evaluations ul li',
'.benefits-inner > span',
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


