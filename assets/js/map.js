/* GTA VI HUB — Interactive map client (static GitHub Pages compatible) */
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const STORE = {custom:"gta6-map-custom-v1",favorites:"gta6-map-favorites-v1",visited:"gta6-map-visited-v1",theme:"gta6-map-theme-v1"};
  const categories = [
    ["city","🏙️","شهر و منطقه"],["district","🌆","محله"],["coast","🏝️","ساحل و جزیره"],["nature","🌿","طبیعت"],["landmark","📍","مکان شاخص"],["other","✦","سایر"]
  ];
  const safeRead = (key, fallback) => { try { const value=JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch (_) { return fallback; } };
  const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const escapeHTML = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const normalize = (v) => String(v ?? "").toLocaleLowerCase("fa").replace(/[ي]/g,"ی").replace(/[ك]/g,"ک").trim();
  const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
  const fallback = typeof GTA6 !== "undefined" && Array.isArray(GTA6.locations) ? GTA6.locations : [];
  let baseLocations = [];
  let customLocations = safeRead(STORE.custom, []);
  let favorites = new Set(safeRead(STORE.favorites, []));
  let visited = new Set(safeRead(STORE.visited, []));
  let activeCategory = new Set(categories.map(c=>c[0]));
  let activeRegion = "all", selectedId = null, route = null, scale = 1, offsetX = 0, offsetY = 0;
  let pointerId = null, pointerStart = null, offsetStart = null;
  const viewport=$("[data-map-viewport]"), image=$("[data-map-image]"), layer=$("[data-map-marker-layer]");
  const listPanel=$("[data-map-selected-card]");
  if (!viewport || !image || !layer) return;
  const allLocations = () => [...baseLocations,...customLocations].filter((item,i,a)=>a.findIndex(x=>x.id===item.id)===i);
  const getLocation = id => allLocations().find(x=>x.id===id);
  const isOfficial = item => item.official === true;
  const categoryName = id => (categories.find(c=>c[0]===id)||["","✦","سایر"])[2];
  const count = (selector, value) => { const el=$(selector); if(el) el.textContent=String(value).toLocaleString("fa-IR"); };
  const status = message => { const el=$("[data-map-admin-status]"); if(el) el.textContent=message; };

  async function loadLocations(){
    try{
      const response=await fetch("assets/data/locations.json",{cache:"no-store"});
      if(!response.ok) throw new Error("locations JSON unavailable");
      const payload=await response.json();
      baseLocations=Array.isArray(payload.locations)?payload.locations:fallback;
    }catch(_){baseLocations=fallback.map((p,i)=>({id:p.id||"fallback-"+i,name:p.name,region:p.region,category:p.category||"other",x:p.x,y:p.y,icon:p.icon,desc:p.desc,official:false,source:""}));}
    renderAll();
  }

  function markerDimensions(){
    if(!image.naturalWidth || !image.naturalHeight) return {width:viewport.clientWidth,height:viewport.clientHeight};
    const fit=Math.min(viewport.clientWidth/image.naturalWidth,viewport.clientHeight/image.naturalHeight);
    return {width:image.naturalWidth*fit,height:image.naturalHeight*fit};
  }
  function renderTransform(){
    image.style.transform=`translate(${offsetX}px,${offsetY}px) scale(${scale})`;
    const size=markerDimensions();
    layer.style.width=size.width+"px"; layer.style.height=size.height+"px";
    layer.style.transform=`translate(calc(-50% + ${offsetX}px),calc(-50% + ${offsetY}px)) scale(${scale})`;
    const label=$("[data-map-zoom-label]"); if(label) label.textContent="بزرگ‌نمایی: "+Math.round(scale*100).toLocaleString("fa-IR")+"٪";
  }
  function filteredLocations(){
    const q=normalize($("[data-map-search]")?.value||"");
    const official=$("[data-map-official]")?.checked!==false;
    const community=$("[data-map-community]")?.checked!==false;
    return allLocations().filter(p=>{
      const okCategory=activeCategory.has(p.category||"other");
      const okRegion=activeRegion==="all" || (activeRegion==="Vice City" ? p.region==="Vice City" : p.region!=="Vice City");
      const okStatus=isOfficial(p)?official:community;
      const haystack=normalize([p.name,p.region,p.desc,categoryName(p.category)].join(" "));
      return okCategory&&okRegion&&okStatus&&(!q||haystack.includes(q));
    });
  }
  function makeMarker(p){
    const button=document.createElement("button");
    button.type="button"; button.className="map-location-marker"+(isOfficial(p)?"":" unverified")+(selectedId===p.id?" selected":"");
    button.style.left=clamp(Number(p.x)||50,0,100)+"%"; button.style.top=clamp(Number(p.y)||50,0,100)+"%";
    button.textContent=p.icon||"📍"; button.title=p.name; button.dataset.id=p.id;
    button.setAttribute("aria-label",p.name); button.setAttribute("aria-pressed",String(selectedId===p.id));
    button.addEventListener("click",e=>{e.stopPropagation();selectLocation(p.id,false);});
    return button;
  }
  function renderMarkers(){
    layer.querySelectorAll(".map-location-marker").forEach(el=>el.remove());
    const visible=filteredLocations();
    visible.forEach(p=>layer.appendChild(makeMarker(p)));
    count("[data-map-visible]",visible.length); count("[data-map-total]",allLocations().length);
    renderRoute();
  }
  function selectLocation(id, center=true){
    const p=getLocation(id); if(!p)return;
    selectedId=id;
    if(center){
      const size=markerDimensions(), targetScale=Math.max(scale,2);
      scale=targetScale;
      offsetX=-(Number(p.x)/100-.5)*size.width*scale;
      offsetY=-(Number(p.y)/100-.5)*size.height*scale;
      renderTransform();
    }
    renderMarkers(); renderSelected();
  }
  function renderSelected(){
    const p=getLocation(selectedId); if(!listPanel)return;
    if(!p){listPanel.innerHTML='<div class="map-selected-empty">برای مشاهده جزئیات، یک نشانگر یا مکان از فهرست را انتخاب کن.</div>';return;}
    const imageHtml=p.image?'<img src="'+escapeHTML(p.image)+'" alt="'+escapeHTML(p.name)+'" loading="lazy">':'<div class="map-selected-placeholder">'+escapeHTML(p.icon||"📍")+'</div>';
    listPanel.innerHTML='<div class="map-selected-content">'+imageHtml+'<div><h3>'+escapeHTML(p.name)+'</h3><p>'+escapeHTML(p.desc)+'</p><span class="map-status-pill '+(isOfficial(p)?"":"unverified")+'">'+(isOfficial(p)?"نام در منبع رسمی آمده":"نیازمند تأیید منبع")+'</span><span class="map-status-pill">مختصات تقریبی</span></div><div class="map-card-actions"><button type="button" data-map-favorite="'+escapeHTML(p.id)+'">'+(favorites.has(p.id)?"★ ذخیره‌شده":"☆ علاقه‌مندی")+'</button><button type="button" data-map-visited="'+escapeHTML(p.id)+'">'+(visited.has(p.id)?"✓ بازدید شد":"علامت بازدید")+'</button>'+(p.source?'<a class="map-button map-button-quiet" href="'+escapeHTML(p.source)+'" target="_blank" rel="noopener noreferrer">منبع ↗</a>':"")+'</div></div>';
    listPanel.querySelector("[data-map-favorite]")?.addEventListener("click",()=>toggleSet(favorites,p.id,STORE.favorites));
    listPanel.querySelector("[data-map-visited]")?.addEventListener("click",()=>toggleSet(visited,p.id,STORE.visited));
  }
  function toggleSet(set,id,key){set.has(id)?set.delete(id):set.add(id);safeWrite(key,[...set]);renderSelected();renderProgress();}
  function renderCategories(){
    const root=$("[data-map-categories]"); if(!root)return;
    root.innerHTML=categories.map(([id,icon,label])=>'<label><input type="checkbox" data-map-category="'+id+'" '+(activeCategory.has(id)?"checked":"")+'> '+icon+' '+label+'</label>').join("");
    $$("[data-map-category]",root).forEach(input=>input.addEventListener("change",()=>{input.checked?activeCategory.add(input.dataset.mapCategory):activeCategory.delete(input.dataset.mapCategory);renderMarkers();renderDatabase();}));
  }
  function renderDatabase(){
    const root=$("[data-map-database]"); if(!root)return;
    const q=normalize($("[data-map-db-search]")?.value||"");
    const items=allLocations().filter(p=>!q||normalize([p.name,p.region,p.desc,categoryName(p.category)].join(" ")).includes(q));
    root.innerHTML=items.map(p=>'<article class="map-database-card"><div class="map-database-meta"><span>'+escapeHTML(p.region)+'</span><span>·</span><span>'+escapeHTML(categoryName(p.category))+'</span><span>·</span><span>'+(isOfficial(p)?"رسمی":"نیازمند تأیید")+'</span></div><h3>'+escapeHTML(p.icon||"📍")+' '+escapeHTML(p.name)+'</h3><p>'+escapeHTML(p.desc)+'</p><button type="button" data-map-open="'+escapeHTML(p.id)+'">نمایش روی نقشه</button></article>').join("")||'<p class="map-empty">مکانی با این عبارت پیدا نشد.</p>';
    $$("[data-map-open]",root).forEach(b=>b.addEventListener("click",()=>{switchTab("explore");selectLocation(b.dataset.mapOpen,true);}));
  }
  function renderProgress(){
    const all=allLocations(), visitedItems=all.filter(p=>visited.has(p.id)), favItems=all.filter(p=>favorites.has(p.id));
    count("[data-map-visited-count]",visitedItems.length);count("[data-map-favorite-count]",favItems.length);
    const percent=all.length?Math.round(visitedItems.length/all.length*100):0;
    const percentEl=$("[data-map-progress-percent]");if(percentEl)percentEl.textContent=percent.toLocaleString("fa-IR")+"٪";
    const bar=$("[data-map-progress-bar]");if(bar)bar.style.width=percent+"%";
    const fill=(selector,items)=>{const root=$(selector);if(root)root.innerHTML=items.map(p=>'<div class="map-progress-item"><span>'+escapeHTML(p.name)+'</span><span>'+escapeHTML(p.region)+'</span></div>').join("")||'<p class="map-empty">هنوز موردی ثبت نشده است.</p>';};
    fill("[data-map-visited-list]",visitedItems);fill("[data-map-favorites-list]",favItems);
  }
  function renderRoute(){
    const svg=$("[data-map-route-svg]"); if(!svg)return;
    svg.innerHTML="";
    if(!route)return;
    const a=getLocation(route.from),b=getLocation(route.to);if(!a||!b)return;
    const line=document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1",a.x);line.setAttribute("y1",a.y);line.setAttribute("x2",b.x);line.setAttribute("y2",b.y);
    svg.setAttribute("viewBox","0 0 100 100");svg.setAttribute("preserveAspectRatio","none");svg.appendChild(line);
  }
  function renderRouteSelects(){
    const opts=allLocations().map(p=>'<option value="'+escapeHTML(p.id)+'">'+escapeHTML(p.name)+'</option>').join("");
    ["[data-map-route-from]","[data-map-route-to]"].forEach(s=>{const el=$(s);if(el){const old=el.value;el.innerHTML='<option value="">انتخاب مکان</option>'+opts;el.value=old;}});
  }
  function switchTab(name){
    $$("[data-map-tab]").forEach(b=>{const active=b.dataset.mapTab===name;b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active));});
    $$("[data-map-panel]").forEach(p=>{const active=p.dataset.mapPanel===name;p.classList.toggle("active",active);p.hidden=!active;});
    if(name==="database")renderDatabase();if(name==="progress")renderProgress();
  }
  function renderAll(){renderCategories();renderMarkers();renderSelected();renderDatabase();renderProgress();renderRouteSelects();}

  $$("[data-map-tab]").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.mapTab)));
  ["[data-map-search]","[data-map-official]","[data-map-community]"].forEach(s=>$(s)?.addEventListener(s.includes("search")?"input":"change",renderMarkers));
  $$('input[name="map-region"]').forEach(r=>r.addEventListener("change",()=>{activeRegion=r.value;renderMarkers();}));
  $("[data-map-clear-filters]")?.addEventListener("click",()=>{activeCategory=new Set(categories.map(c=>c[0]));activeRegion="all";$("[data-map-search]").value="";$$("[data-map-category]").forEach(x=>x.checked=true);$('input[name="map-region"][value="all"]').checked=true;renderMarkers();});
  $("[data-map-db-search]")?.addEventListener("input",renderDatabase);
  $("[data-map-route]")?.addEventListener("click",()=>{const from=$("[data-map-route-from]").value,to=$("[data-map-route-to]").value;if(!from||!to||from===to){status("دو مکان متفاوت برای مسیر انتخاب کن.");return;}route={from,to};renderRoute();selectLocation(from,false);status("خط مستقیم تقریبی روی نقشه نمایش داده شد.");});
  $("[data-map-route-clear]")?.addEventListener("click",()=>{route=null;renderRoute();});
  $$("[data-map-zoom]").forEach(b=>b.addEventListener("click",()=>zoom(scale+(b.dataset.mapZoom==="in"?.25:-.25))));
  function zoom(next,cx,cy){const rect=viewport.getBoundingClientRect(),x=cx==null?0:cx-rect.left-rect.width/2,y=cy==null?0:cy-rect.top-rect.height/2,nextScale=clamp(next,1,5),ratio=nextScale/scale;offsetX=x-(x-offsetX)*ratio;offsetY=y-(y-offsetY)*ratio;scale=nextScale;renderTransform();}
  $("[data-map-reset]")?.addEventListener("click",()=>{scale=1;offsetX=0;offsetY=0;renderTransform();});
  viewport.addEventListener("wheel",e=>{e.preventDefault();zoom(scale+(e.deltaY<0?.18:-.18),e.clientX,e.clientY);},{passive:false});
  viewport.addEventListener("pointerdown",e=>{if(e.target.closest(".map-location-marker"))return;if(e.pointerType==="mouse"&&e.button!==0)return;pointerId=e.pointerId;pointerStart={x:e.clientX,y:e.clientY};offsetStart={x:offsetX,y:offsetY};viewport.classList.add("dragging");viewport.setPointerCapture(e.pointerId);});
  viewport.addEventListener("pointermove",e=>{if(pointerId!==e.pointerId)return;offsetX=offsetStart.x+e.clientX-pointerStart.x;offsetY=offsetStart.y+e.clientY-pointerStart.y;renderTransform();});
  const stop=e=>{if(pointerId!==e.pointerId)return;pointerId=null;viewport.classList.remove("dragging");};viewport.addEventListener("pointerup",stop);viewport.addEventListener("pointercancel",stop);
  $("[data-map-fullscreen]")?.addEventListener("click",()=>{if(document.fullscreenElement)document.exitFullscreen?.();else viewport.requestFullscreen?.();});
  image.addEventListener("load",()=>{$("[data-map-image-status]")?.classList.add("hidden");renderTransform();});
  image.addEventListener("error",()=>{const el=$("[data-map-image-status]");if(el){el.textContent="تصویر نقشه بارگذاری نشد؛ اتصال اینترنت یا منبع تصویر را بررسی کن.";el.classList.remove("hidden");}});
  window.addEventListener("resize",renderTransform);
  const theme=safeRead(STORE.theme,"dark");if(theme==="light")document.body.classList.add("map-light");
  $("[data-map-theme]")?.addEventListener("click",()=>{const light=document.body.classList.toggle("map-light");safeWrite(STORE.theme,light?"light":"dark");$("[data-map-theme]").textContent=light?"☀ حالت تیره":"☾ حالت روشن";});
  if(theme==="light")$("[data-map-theme]").textContent="☀ حالت تیره";
  $("[data-map-progress-reset]")?.addEventListener("click",()=>{visited.clear();favorites.clear();safeWrite(STORE.visited,[]);safeWrite(STORE.favorites,[]);renderSelected();renderProgress();});
  $("[data-map-add-form]")?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),name=String(f.get("name")||"").trim();if(!name)return;const item={id:"local-"+Date.now().toString(36),name,region:String(f.get("region")),category:String(f.get("category")),x:clamp(Number(f.get("x")),0,100),y:clamp(Number(f.get("y")),0,100),icon:"📍",desc:String(f.get("desc")||"").trim(),official:false,source:"",image:""};customLocations.push(item);safeWrite(STORE.custom,customLocations);e.currentTarget.reset();renderAll();status("مکان به فهرست محلی اضافه شد.");});
  $("[data-map-export]")?.addEventListener("click",()=>{const blob=new Blob([JSON.stringify({version:1,locations:allLocations()},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="gta6-map-locations.json";a.click();URL.revokeObjectURL(url);status("فایل JSON آماده شد؛ برای انتشار عمومی آن را به مخزن اضافه کن.");});
  $("[data-map-import]")?.addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{const payload=JSON.parse(await file.text());if(!Array.isArray(payload.locations))throw new Error("invalid");customLocations=payload.locations.filter(p=>p&&p.id&&p.name).map(p=>({...p,official:false}));safeWrite(STORE.custom,customLocations);renderAll();status("فهرست JSON وارد شد. موارد واردشده محلی و تأییدنشده هستند.");}catch(_){status("فایل JSON معتبر نیست یا ساختار locations ندارد.");}e.target.value="";});
  $("[data-map-reset-local]")?.addEventListener("click",()=>{customLocations=[];safeWrite(STORE.custom,[]);renderAll();status("مکان‌های محلی پاک شدند؛ داده پایه حفظ شد.");});
  loadLocations();
})();
