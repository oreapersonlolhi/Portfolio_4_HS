(() => {
  const key = "portfolio-life-photos";
  const defaults = [
    { id: "creative-01", src: "/portfolio/bloom-nest.jpg", alt: "A creative study from Heidi's everyday making practice" },
    { id: "creative-02", src: "/portfolio/bridge.jpg", alt: "A structural study representing curiosity and exploration" },
    { id: "creative-03", src: "/portfolio/freehand-sketch.jpg", alt: "A sketch from Heidi's personal creative process" },
    { id: "creative-04", src: "/portfolio/circuits.jpg", alt: "An electronic experiment from Heidi's hands-on practice" },
    { id: "creative-05", src: "/portfolio/bloom-nest-2.jpg", alt: "A second creative study from Heidi's making practice" },
    { id: "creative-06", src: "/portfolio/bridge-2.jpg", alt: "A second structural study from Heidi's explorations" },
    { id: "creative-07", src: "/portfolio/freehand-sketch-2.jpg", alt: "Another moment from Heidi's drawing process" },
    { id: "creative-08", src: "/portfolio/circuits-2.jpg", alt: "Another hands-on electronics experiment" },
    { id: "creative-09", src: "/portfolio/bloom-nest-3.png", alt: "A third creative study from Heidi's portfolio" },
    { id: "creative-10", src: "/portfolio/bridge-3.jpg", alt: "A third structural study from Heidi's portfolio" }
  ];
  const film = document.getElementById("life-film");
  const status = document.getElementById("life-photo-status");
  const interestTimers = new WeakMap();
  function imagePath(image){return image.startsWith("/portfolio/")?`public${image}`:image}
  function prepareInterestSlideshows(){document.querySelectorAll(".interest-orbit[data-category]").forEach(card=>{const frame=card.querySelector(".interest-image");const original=frame.querySelector("img");let images=[original.getAttribute("src")];try{const saved=JSON.parse(localStorage.getItem(`category-cover:${card.dataset.category}`)||"null");if(Array.isArray(saved)&&saved.length)images=saved.map(String)}catch{}frame.querySelectorAll("img").forEach(image=>image.remove());const badge=frame.querySelector(".interest-index");images.forEach(source=>{const image=document.createElement("img");image.src=imagePath(source);image.alt="";frame.insertBefore(image,badge)});card.addEventListener("mouseenter",()=>{const pictures=[...frame.querySelectorAll("img")];if(pictures.length<2||interestTimers.has(card))return;let active=0;frame.classList.add("is-cycling");pictures[0].classList.add("is-active");interestTimers.set(card,setInterval(()=>{pictures[active].classList.remove("is-active");active=(active+1)%pictures.length;pictures[active].classList.add("is-active")},1000))});card.addEventListener("mouseleave",()=>{clearInterval(interestTimers.get(card));interestTimers.delete(card);frame.classList.remove("is-cycling");frame.querySelectorAll("img").forEach(image=>image.classList.remove("is-active"))})})}
  function editorMode(){return localStorage.getItem("portfolio-editor-mode") === "true"}
  function syncEditor(){const enabled=editorMode();document.body.classList.toggle("editor-mode",enabled);document.querySelectorAll(".editor-toggle").forEach(button=>{button.setAttribute("aria-pressed",String(enabled));button.setAttribute("aria-label",enabled?"Turn off portfolio editor":"Turn on portfolio editor");button.title=enabled?"Turn editor off":"Turn editor on"});render()}
  function photos(){try{const saved=JSON.parse(localStorage.getItem(key)||"null");return Array.isArray(saved)&&saved.length?saved:defaults}catch{return defaults}}
  function save(next){localStorage.setItem(key,JSON.stringify(next));render()}
  function escapeHTML(value){return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
  function render(){film.innerHTML=photos().map(photo=>`<article class="life-frame"><img src="${photo.src}" alt="${escapeHTML(photo.alt)}">${editorMode()?`<button type="button" data-remove="${photo.id}">Remove</button>`:""}</article>`).join("")}
  function resize(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(reader.error);reader.onload=()=>{const image=new Image();image.onerror=()=>reject(new Error("Could not read image"));image.onload=()=>{const scale=Math.min(1,1500/Math.max(image.width,image.height));const canvas=document.createElement("canvas");canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext("2d").drawImage(image,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL("image/jpeg",.82))};image.src=reader.result};reader.readAsDataURL(file)})}
  document.querySelectorAll(".editor-toggle").forEach(button=>button.addEventListener("click",()=>{localStorage.setItem("portfolio-editor-mode",String(!editorMode()));syncEditor()}));
  film.addEventListener("click",event=>{const button=event.target.closest("[data-remove]");if(!button)return;const next=photos().filter(photo=>photo.id!==button.dataset.remove);save(next.length?next:defaults);status.textContent="Photo removed."});
  document.getElementById("life-photo-input").addEventListener("change",async event=>{const files=[...event.target.files].slice(0,Math.max(0,10-photos().length));if(!files.length)return;try{const added=await Promise.all(files.map(async(file,index)=>({id:`life-${Date.now()}-${index}`,src:await resize(file),alt:file.name.replace(/\.[^.]+$/,"")})));save([...photos(),...added]);status.textContent=`${added.length} photo${added.length===1?"":"s"} added.`}catch{status.textContent="One of those photos could not be added."}event.target.value=""});
  document.getElementById("reset-life-photos").addEventListener("click",()=>{localStorage.removeItem(key);render();status.textContent="Life photos reset."});
  film.addEventListener("wheel",event=>{if(Math.abs(event.deltaY)<=Math.abs(event.deltaX))return;event.preventDefault();film.scrollLeft+=event.deltaY},{passive:false});
  prepareInterestSlideshows();
  syncEditor();
})();
