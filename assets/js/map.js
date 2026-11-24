/* GTA VI HUB — full community places map, based on Open GTA 6 Map (CC BY 4.0) */
(() => {
  "use strict";
  const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
  const DATA_URL="assets/data/places.json", DISTRICTS_URL="assets/data/districts.json";
  const TILE_BASE="https://fbritoferreira.github.io/gta6/tiles";
  const STORE={favorites:"gta6-map-favorites-v2",visited:"gta6-map-visited-v2",custom:"gta6-map-custom-v2",theme:"gta6-map-theme-v2"};
  const safeRead=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(_){return d}};
  const safeWrite=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm=v=>String(v??"").toLocaleLowerCase("fa").replace(/[ي]/g,"ی").replace(/[ك]/g,"ک").trim();
  const format=n=>Number(n||0).toLocaleString("fa-IR");
  const categoryNames={hotel:"هتل و اقامت",safehouse:"خانه امن",shop:"فروشگاه و خدمات",building:"ساختمان و مکان شاخص",civic:"مراکز عمومی",food:"رستوران و غذا",transport:"حمل‌ونقل",leisure:"تفریح و ورزش",nature:"طبیعت"};
  const categoryColors={hotel:"#ff9b59",safehouse:"#ff4f9a",shop:"#ffd166",building:"#b8a1ff",civic:"#56cfe1",food:"#ff7b72",transport:"#8bd17c",leisure:"#f6bd60",nature:"#4ecdc4"};
  const categoryIcons={hotel:"🏨",safehouse:"🏠",shop:"🛍️",building:"🏛️",civic:"🏥",food:"🍽️",transport:"🚉",leisure:"🎡",nature:"🌿"};
  let places=[],districts=[],custom=[],favorites=new Set(safeRead(STORE.favorites,[])),visited=new Set(safeRead(STORE.visited,[]));
  let map,markerLayer,districtLayer,routeLayer,selected=null,filters={query:"",category:"all",area:"all",confidence:new Set(["community","press","unverified"])};
  const viewport=$("[data-map-viewport]"),mapEl=$("#leonida-map"),selectedCard=$("[data-map-selected-card]");
  if(!mapEl||!viewport)return;
  const allPlaces=()=>[...places,...custom];
  const count=(s,n)=>{const e=$(s);if(e)e.textContent=format(n)};
  const message=t=>{const e=$("[data-map-admin-status]");if(e)e.textContent=t};
  function get(id){return allPlaces().find(p=>p.id===id)}
  function areaLabel(p){return p.area||"نامشخص"}
  function filtered(){
    return allPlaces().filter(p=>{
      const q=norm(filters.query),hay=norm([p.name,p.area,p.real_life,p.service,p.kind].join(" "));
      return (!q||hay.includes(q))&&(filters.category==="all"||p.kind===filters.category)&&
       (filters.area==="all"||areaLabel(p)===filters.area)&&filters.confidence.has(p.confidence||"community");
    });
  }
  function markerIcon(p){
    const color=categoryColors[p.kind]||"#ff4f9a";
    return L.divIcon({className:"",html:'<span class="map-pin" style="display:block;background:'+color+'"></span>',iconSize:[16,16],iconAnchor:[8,8]});
  }
  function clusterIcon(cluster){
    const n=cluster.getChildCount(),size=n<20?"small":n<80?"medium":"large";
    return L.divIcon({html:'<span class="map-pin-cluster map-cluster-'+size+'">'+format(n)+'</span>',className:"",iconSize:size==="small"?[32,32]:size==="medium"?[40,40]:[48,48]});
  }
  function popupContent(p){
    return '<div class="map-popup-title">'+esc(p.name)+'</div><div class="map-popup-meta">'+esc(areaLabel(p))+' · '+esc(categoryNames[p.kind]||p.kind)+' · '+esc(p.confidence||"community")+'</div>'+
      (p.real_life?'<div class="map-popup-desc">نمونه واقعی الهام‌بخش: '+esc(p.real_life)+'</div>':"")+
      '<div class="map-popup-desc">مختصات جامعه‌محور: '+format(p.x)+'، '+format(p.y)+'</div>';
  }
  function renderMarkers(){
    if(!markerLayer)return;
    markerLayer.clearLayers();
    const items=filtered();
    items.forEach(p=>{
      if(!Number.isFinite(Number(p.x))||!Number.isFinite(Number(p.y)))return;
      const marker=L.marker([-Number(p.y),Number(p.x)],{icon:markerIcon(p),title:p.name,alt:p.name});
      marker.bindPopup(popupContent(p));
      marker.on("click",()=>select(p.id,false));
      markerLayer.addLayer(marker);
    });
    count("[data-map-total]",allPlaces().length);count("[data-map-visible]",items.length);
    renderDatabase();
  }
  function select(id,fly=true){
    const p=get(id);if(!p)return;selected=id;
    if(fly&&map&&Number.isFinite(Number(p.x))&&Number.isFinite(Number(p.y)))map.flyTo([-Number(p.y),Number(p.x)],Math.max(map.getZoom(),3),{duration:.45});
    renderSelected();
  }
  function renderSelected(){
    const p=get(selected);if(!selectedCard)return;
    if(!p){selectedCard.innerHTML='<div class="map-selected-empty">برای مشاهده جزئیات، یک نشانگر یا مکان از فهرست را انتخاب کن.</div>';return}
    selectedCard.innerHTML='<div class="map-selected-content"><div class="map-selected-placeholder">'+(categoryIcons[p.kind]||"📍")+'</div><div><h3>'+esc(p.name)+'</h3><p>'+esc(areaLabel(p))+' · '+esc(categoryNames[p.kind]||p.kind)+'</p>'+(p.real_life?'<p>نمونه واقعی الهام‌بخش: '+esc(p.real_life)+'</p>':"")+'<span class="map-status-pill '+(p.confidence==="unverified"?"unverified":"")+'">'+esc(p.confidence||"community")+' · موقعیت جامعه‌محور</span></div><div class="map-card-actions"><button type="button" data-map-favorite>'+ (favorites.has(p.id)?"★ ذخیره‌شده":"☆ علاقه‌مندی")+'</button><button type="button" data-map-visited>'+(visited.has(p.id)?"✓ بازدید شد":"علامت بازدید")+'</button></div></div>';
    $("[data-map-favorite]")?.addEventListener("click",()=>toggle(favorites,p.id,STORE.favorites));
    $("[data-map-visited]")?.addEventListener("click",()=>toggle(visited,p.id,STORE.visited));
  }
  function toggle(set,id,key){set.has(id)?set.delete(id):set.add(id);safeWrite(key,[...set]);renderSelected();renderProgress()}
  function renderCategories(){
    const root=$("[data-map-categories]");if(!root)return;
    const kinds=Object.keys(categoryNames).filter(k=>places.some(p=>p.kind===k));
    root.innerHTML='<label><input type="radio" name="map-kind" value="all" checked> همه دسته‌ها ('+format(allPlaces().length)+')</label>'+kinds.map(k=>'<label><input type="radio" name="map-kind" value="'+k+'"> '+(categoryIcons[k]||"•")+' '+categoryNames[k]+' ('+format(places.filter(p=>p.kind===k).length)+')</label>').join("");
    $$('input[name="map-kind"]').forEach(r=>r.addEventListener("change",()=>{filters.category=r.value;renderMarkers()}));
  }
  function renderAreas(){
    const el=$("[data-map-area]");if(!el)return;
    const old=el.value,areas=[...new Set(places.map(areaLabel).filter(x=>x&&x!=="نامشخص"))].sort((a,b)=>a.localeCompare(b));
    el.innerHTML='<option value="all">همه ناحیه‌ها ('+format(places.length)+')</option>'+areas.map(a=>'<option value="'+esc(a)+'">'+esc(a)+'</option>').join("");
    el.value=areas.includes(old)?old:"all";
  }
  function renderDatabase(){
    const root=$("[data-map-database]");if(!root)return;
    const q=norm($("[data-map-db-search]")?.value||"");
    const items=allPlaces().filter(p=>!q||norm([p.name,p.area,p.real_life,p.kind].join(" ")).includes(q));
    const pageSize=90,page=Math.max(0,Number(root.dataset.page||0)),start=page*pageSize,visible=items.slice(start,start+pageSize);
    root.innerHTML=visible.map(p=>'<article class="map-database-card"><div class="map-database-meta"><span>'+esc(areaLabel(p))+'</span><span>·</span><span>'+esc(categoryNames[p.kind]||p.kind)+'</span><span>·</span><span>'+esc(p.confidence||"community")+'</span></div><h3>'+esc(categoryIcons[p.kind]||"📍")+' '+esc(p.name)+'</h3><p>'+esc(p.real_life||"برای این مکان نمونه واقعی ثبت نشده است.")+'</p><button type="button" data-map-open="'+esc(p.id)+'">نمایش روی نقشه</button></article>').join("")||'<p class="map-empty">مکانی پیدا نشد.</p>';
    const pages=Math.ceil(items.length/pageSize);
    root.insertAdjacentHTML("beforeend",'<div class="map-pagination"><button type="button" data-map-prev '+(page===0?"disabled":"")+'>قبلی</button><span>صفحه '+format(page+1)+' از '+format(Math.max(1,pages))+' · '+format(items.length)+' مکان</span><button type="button" data-map-next '+(page+1>=pages?"disabled":"")+'>بعدی</button></div>');
    $$("[data-map-open]",root).forEach(b=>b.addEventListener("click",()=>{switchTab("explore");select(b.dataset.mapOpen,true)}));
    $("[data-map-prev]",root)?.addEventListener("click",()=>{root.dataset.page=String(Math.max(0,page-1));renderDatabase()});
    $("[data-map-next]",root)?.addEventListener("click",()=>{root.dataset.page=String(Math.min(pages-1,page+1));renderDatabase()});
  }
  function renderProgress(){
    const all=allPlaces(),v=all.filter(p=>visited.has(p.id)),f=all.filter(p=>favorites.has(p.id)),pct=all.length?Math.round(v.length/all.length*100):0;
    count("[data-map-visited-count]",v.length);count("[data-map-favorite-count]",f.length);
    const pe=$("[data-map-progress-percent]");if(pe)pe.textContent=format(pct)+"٪";
    const bar=$("[data-map-progress-bar]");if(bar)bar.style.width=pct+"%";
    const fill=(s,a)=>{const e=$(s);if(e)e.innerHTML=a.slice(0,120).map(p=>'<div class="map-progress-item"><span>'+esc(p.name)+'</span><span>'+esc(areaLabel(p))+'</span></div>').join("")||'<p class="map-empty">هنوز موردی ثبت نشده است.</p>'};
    fill("[data-map-visited-list]",v);fill("[data-map-favorites-list]",f);
  }
  function renderRoute(){
    routeLayer.clearLayers();
    const a=get($("[data-map-route-from]")?.value),b=get($("[data-map-route-to]")?.value);
    if(!a||!b||a.id===b.id)return;
    const line=L.polyline([[-Number(a.y),Number(a.x)],[-Number(b.y),Number(b.x)]],{color:"#38d7ff",weight:3,dashArray:"7 7"}).addTo(routeLayer);
    const distance=Math.hypot(Number(a.x)-Number(b.x),Number(a.y)-Number(b.y));
    line.bindTooltip("فاصله مستقیم تقریبی: "+format(Math.round(distance))+" واحد نقشه");
  }
  function renderRouteSelects(){
    const opts=allPlaces().map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+' — '+esc(areaLabel(p))+'</option>').join("");
    ["[data-map-route-from]","[data-map-route-to]"].forEach(s=>{const el=$(s);if(el){const old=el.value;el.innerHTML='<option value="">انتخاب مکان</option>'+opts;el.value=old}});
  }
  function renderDistricts(show){
    if(!districtLayer)return;districtLayer.clearLayers();if(!show)return;
    districts.forEach(d=>(d.rings||[]).forEach(ring=>{
      const coords=ring.map(pt=>[-Number(pt[1]),Number(pt[0])]);
      L.polygon(coords,{color:"#ff77ae",weight:1,opacity:.7,fillOpacity:.035,interactive:true}).bindTooltip(esc(d.name),{sticky:true}).addTo(districtLayer);
    }));
  }
  function switchTab(name){
    $$("[data-map-tab]").forEach(b=>{const on=b.dataset.mapTab===name;b.classList.toggle("active",on);b.setAttribute("aria-selected",String(on))});
    $$("[data-map-panel]").forEach(p=>{const on=p.dataset.mapPanel===name;p.classList.toggle("active",on);p.hidden=!on});
    if(name==="database")renderDatabase();if(name==="progress")renderProgress();if(name==="explore")setTimeout(()=>map?.invalidateSize(),80);
  }
  function initMap(){
    map=L.map(mapEl,{crs:L.CRS.Simple,minZoom:0,maxZoom:7,zoomControl:true,preferCanvas:true,attributionControl:true});
    const bounds=[[-1024,0],[0,1024]];
    const tileOptions={tileSize:256,minZoom:0,maxNativeZoom:5,maxZoom:7,noWrap:true,bounds,attribution:'Map data &copy; <a href="https://github.com/fbritoferreira/gta6" target="_blank" rel="noopener">Open GTA 6 Map</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>'};
    const night=L.tileLayer(TILE_BASE+"/night/{z}/{z},{y},{x}.webp",tileOptions);
    const day=L.tileLayer(TILE_BASE+"/day/{z}/{z},{y},{x}.webp",tileOptions);
    night.addTo(map);
    markerLayer=L.markerClusterGroup({maxClusterRadius:42,showCoverageOnHover:false,spiderfyOnMaxZoom:true,iconCreateFunction:clusterIcon});
    markerLayer.addTo(map);districtLayer=L.layerGroup().addTo(map);routeLayer=L.layerGroup().addTo(map);
    L.control.layers({"نقشه شب":night,"نقشه روز":day},{"نشانگر مکان‌ها":markerLayer,"مرز ناحیه‌ها":districtLayer,"مسیر مستقیم":routeLayer},{collapsed:true}).addTo(map);
    map.fitBounds(bounds);map.setMaxBounds([[-1100,-60],[80,1100]]);
    map.on("zoomend",()=>{const e=$("[data-map-zoom-label]");if(e)e.textContent="بزرگ‌نمایی: "+format(map.getZoom())});
  }
  async function load(){
    if(!window.L||!L.markerClusterGroup){message("کتابخانه نقشه بارگذاری نشد؛ اتصال CDN را بررسی کن.");return}
    try{
      const [pr,dr]=await Promise.all([fetch(DATA_URL),fetch(DISTRICTS_URL)]);
      if(!pr.ok||!dr.ok)throw new Error("HTTP "+(!pr.ok?pr.status:dr.status));
      const pd=await pr.json(),dd=await dr.json();
      places=Array.isArray(pd.places)?pd.places:[];
      districts=Array.isArray(dd.districts)?dd.districts:[];
      custom=safeRead(STORE.custom,[]);
      initMap();renderCategories();renderAreas();renderMarkers();renderSelected();renderProgress();renderRouteSelects();
      count("[data-map-total]",places.length+custom.length);
      const attribution=$("[data-map-zoom-label]");if(attribution)attribution.textContent=format(places.length+custom.length)+" مکان · داده جامعه‌محور";
    }catch(e){message("دریافت دیتابیس نقشه ناموفق بود: "+e.message)}
  }
  $$("[data-map-tab]").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.mapTab)));
  $("[data-map-search]")?.addEventListener("input",e=>{filters.query=e.target.value;renderMarkers()});
  $("[data-map-area]")?.addEventListener("change",e=>{filters.area=e.target.value;renderMarkers()});
  $$("[data-map-confidence]").forEach(c=>c.addEventListener("change",()=>{c.checked?filters.confidence.add(c.dataset.mapConfidence):filters.confidence.delete(c.dataset.mapConfidence);renderMarkers()}));
  $("[data-map-clear-filters]")?.addEventListener("click",()=>{filters={query:"",category:"all",area:"all",confidence:new Set(["community","press","unverified"])};$("[data-map-search]").value="";$("[data-map-area]").value="all";$$("[data-map-confidence]").forEach(c=>c.checked=true);$$('input[name="map-kind"][value="all"]').forEach(c=>c.checked=true);renderMarkers()});
  $("[data-map-db-search]")?.addEventListener("input",()=>{const e=$("[data-map-database]");if(e)e.dataset.page="0";renderDatabase()});
  $("[data-map-route]")?.addEventListener("click",renderRoute);
  $("[data-map-route-clear]")?.addEventListener("click",()=>{routeLayer?.clearLayers();if($("[data-map-route-from]"))$("[data-map-route-from]").value="";if($("[data-map-route-to]"))$("[data-map-route-to]").value=""});
  $("[data-map-reset]")?.addEventListener("click",()=>map?.fitBounds([[-1024,0],[0,1024]]));
  $$("[data-map-zoom]").forEach(b=>b.addEventListener("click",()=>map?.setZoom(map.getZoom()+(b.dataset.mapZoom==="in"?1:-1))));
  $("[data-map-fullscreen]")?.addEventListener("click",()=>{if(document.fullscreenElement)document.exitFullscreen?.();else viewport.requestFullscreen?.().then(()=>setTimeout(()=>map?.invalidateSize(),100))});
  $("[data-map-districts]")?.addEventListener("change",e=>renderDistricts(e.target.checked));
  const theme=safeRead(STORE.theme,"dark");if(theme==="light")document.body.classList.add("map-light");
  $("[data-map-theme]")?.addEventListener("click",()=>{const light=document.body.classList.toggle("map-light");safeWrite(STORE.theme,light?"light":"dark");$("[data-map-theme]").textContent=light?"☀ حالت تیره":"☾ حالت روشن"});
  if(theme==="light")$("[data-map-theme]").textContent="☀ حالت تیره";
  $("[data-map-progress-reset]")?.addEventListener("click",()=>{visited.clear();favorites.clear();safeWrite(STORE.visited,[]);safeWrite(STORE.favorites,[]);renderSelected();renderProgress()});
  $("[data-map-add-form]")?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),name=String(f.get("name")||"").trim();if(!name)return;const item={id:"local-"+Date.now().toString(36),name,kind:String(f.get("category")||"building"),area:String(f.get("region")||"Leonida"),x:Number(f.get("x"))*10.24,y:Number(f.get("y"))*10.24,real_life:"",service:String(f.get("desc")||""),confidence:"unverified",source_urls:[]};custom.push(item);safeWrite(STORE.custom,custom);e.currentTarget.reset();renderCategories();renderAreas();renderMarkers();renderRouteSelects();message("مکان به فهرست محلی اضافه شد.")});
  $("[data-map-export]")?.addEventListener("click",()=>{const blob=new Blob([JSON.stringify({version:1,source:"local user additions",places:custom},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="gta6-map-custom-places.json";a.click();URL.revokeObjectURL(url);message("خروجی مکان‌های محلی آماده شد.")});
  $("[data-map-import]")?.addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data.places))throw new Error("invalid");custom=data.places.filter(p=>p&&p.id&&p.name&&Number.isFinite(Number(p.x))&&Number.isFinite(Number(p.y))).map(p=>({...p,confidence:"unverified"}));safeWrite(STORE.custom,custom);renderCategories();renderAreas();renderMarkers();renderRouteSelects();message("فایل JSON وارد شد.")}catch(_){message("ساختار فایل JSON معتبر نیست.")}e.target.value=""});
  $("[data-map-reset-local]")?.addEventListener("click",()=>{custom=[];safeWrite(STORE.custom,[]);renderCategories();renderAreas();renderMarkers();renderRouteSelects();message("مکان‌های محلی پاک شدند؛ دیتابیس اصلی حفظ شد.")});
  load();
})();
