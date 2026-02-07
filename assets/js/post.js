
const params = new URLSearchParams(location.search);
const file = params.get("file");

async function load(){
const res = await fetch(file);
const md = await res.text();
document.getElementById("content").innerHTML = marked.parse(md);
}

load();
