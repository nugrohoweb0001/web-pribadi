const files = [
"posts/berita1.md",
"posts/berita2.md",
"posts/berita3.md",
"posts/berita4.md",
"posts/berita5.md"
];

const sliderWrapper = document.getElementById("slider-wrapper");
const newsContainer = document.getElementById("news-container");
const dotsContainer = document.getElementById("dots-container");

let currentSlide = 0;
let totalHeadline = 0;

function getPostParam(){
const params = new URLSearchParams(window.location.search);
return params.get('post');
}

async function init(){
const postFile = getPostParam();

if(postFile){
document.getElementById('main-view').classList.add('hidden-content');
document.getElementById('single-post-view').classList.remove('hidden-content');
loadSinglePost(postFile);
}else{
loadHome();
}
}

async function loadSinglePost(file){
try{
const res = await fetch(file);
const md = await res.text();
document.getElementById('post-content').innerHTML = marked.parse(md);
}catch{
document.getElementById('post-content').innerHTML = "<h1>Berita tidak ditemukan</h1>";
}
}

async function loadHome(){

for(let i=0;i<files.length;i++){

const res = await fetch(files[i]);
const md = await res.text();
const title = md.split('\n')[0].replace('# ', '');

if(i < 3){
const slide=document.createElement("div");
slide.className="min-w-full p-10 cursor-pointer";
slide.onclick=()=>window.location.href=`?post=${files[i]}`;
slide.innerHTML=`<h1 class="text-2xl font-bold">${title}</h1>`;
sliderWrapper.appendChild(slide);

const dot=document.createElement("div");
dot.className="dot h-2 w-2 rounded-full bg-gray-300 cursor-pointer";
dot.onclick=()=>goToSlide(i);
dotsContainer.appendChild(dot);

totalHeadline++;
}

const card=document.createElement("article");
card.className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer";
card.onclick=()=>window.location.href=`?post=${files[i]}`;
card.innerHTML=`<h3 class="font-bold">${title}</h3>`;
newsContainer.appendChild(card);
}

startSlider();
}

function updateSlider(){
sliderWrapper.style.transform=`translateX(-${currentSlide*100}%)`;
document.querySelectorAll('.dot').forEach((dot,index)=>{
dot.classList.toggle('active',index===currentSlide);
});
}

function goToSlide(i){
currentSlide=i;
updateSlider();
}

function startSlider(){
setInterval(()=>{
currentSlide=(currentSlide+1)%totalHeadline;
updateSlider();
},6000);
}

init();
