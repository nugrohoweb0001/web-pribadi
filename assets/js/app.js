
async function loadPosts(){

const res = await fetch("posts.json");
const posts = await res.json();

const headlineBox = document.getElementById("headline");
const newsBox = document.getElementById("news");

posts.forEach(p=>{

const card = document.createElement("div");
card.className="card";
card.innerHTML=`<h3 class="font-bold text-lg">${p.title}</h3>
<p class="text-sm text-gray-500">${p.date}</p>`;
card.onclick=()=>location.href=`post.html?file=${p.file}`;

newsBox.appendChild(card);

if(p.headline){
const h = card.cloneNode(true);
headlineBox.appendChild(h);
}

});

}

loadPosts();
