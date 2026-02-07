/* ================= CONFIG ================= */
const files = [
  "posts/berita1.md",
  "posts/berita2.md",
  "posts/berita3.md",
  "posts/berita4.md",
  "posts/berita5.md"
];


/* ================= ELEMENTS ================= */
const sliderWrapper = document.getElementById("slider-wrapper");
const newsContainer = document.getElementById("news-container");
const dotsContainer = document.getElementById("dots-container");
const mainView = document.getElementById("main-view");
const singleView = document.getElementById("single-post-view");
const postContent = document.getElementById("post-content");


let currentSlide = 0;
let totalHeadline = 0;
let sliderInterval = null;


/* ================= UTIL ================= */
function getPostParam(){
  return new URLSearchParams(window.location.search).get("post");
}

async function fetchMarkdown(file){
  try{
    const res = await fetch(file);
    if(!res.ok) throw new Error("File not found");
    return await res.text();
  }catch(err){
    console.warn("Gagal load:", file);
    return null;
  }
}

function getTitle(md){
  return md.split("\n")[0].replace("# ","");
}


/* ================= INIT ================= */
async function init(){
  const postFile = getPostParam();

  if(postFile){
    mainView.classList.add("hidden-content");
    singleView.classList.remove("hidden-content");
    loadSinglePost(postFile);
  }else{
    loadHome();
  }
}


/* ================= SINGLE POST ================= */
async function loadSinglePost(file){
  const md = await fetchMarkdown(file);

  if(!md){
    postContent.innerHTML = "<h1>Berita tidak ditemukan</h1>";
    return;
  }

  postContent.innerHTML = marked.parse(md);
}


/* ================= HOME ================= */
async function loadHome(){

  // fetch paralel (lebih cepat)
  const results = await Promise.all(files.map(fetchMarkdown));

  results.forEach((md, i) => {
    if(!md) return;

    const title = getTitle(md);

    createCard(title, files[i]);

    if(i < 3){
      createSlide(title, files[i], i);
    }
  });

  if(totalHeadline > 0){
    startSlider();
  }
}


/* ================= CARD ================= */
function createCard(title, file){
  const card = document.createElement("article");

  card.className =
    "bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer";

  card.innerHTML = `<h3 class="font-bold">${title}</h3>`;

  card.onclick = () => location.href = `?post=${file}`;

  newsContainer.appendChild(card);
}


/* ================= SLIDER ================= */
function createSlide(title, file, index){

  const slide = document.createElement("div");
  slide.className = "min-w-full p-10 cursor-pointer";
  slide.innerHTML = `<h1 class="text-2xl font-bold">${title}</h1>`;
  slide.onclick = () => location.href = `?post=${file}`;

  sliderWrapper.appendChild(slide);


  const dot = document.createElement("div");
  dot.className = "dot";
  dot.onclick = () => goToSlide(index);

  dotsContainer.appendChild(dot);

  totalHeadline++;
}


function updateSlider(){
  sliderWrapper.style.transform =
    `translateX(-${currentSlide * 100}%)`;

  document.querySelectorAll(".dot")
    .forEach((dot,i)=>dot.classList.toggle("active",i===currentSlide));
}

function goToSlide(i){
  currentSlide = i;
  updateSlider();
}

function startSlider(){
  sliderInterval = setInterval(()=>{
    currentSlide = (currentSlide + 1) % totalHeadline;
    updateSlider();
  },6000);
}


/* ================= START ================= */
init();
