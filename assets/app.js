'use strict';
(()=>{
 const BASE='/madar-industrial-website';
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fa=n=>Number(n).toLocaleString('fa-IR');
 const norm=s=>String(s??'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/\u200c/g,' ').trim().toLowerCase();
 const icons={close:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m5 5 14 14M19 5 5 19"/></svg>'};
 const load=(key)=>{try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?[...new Set(x.filter(v=>typeof v==='string'))]:[]}catch{return []}};
 let quote=load('madar-quote'),compare=load('madar-compare').slice(0,3),products=[],pages=[];
 function save(){try{localStorage.setItem('madar-quote',JSON.stringify(quote));localStorage.setItem('madar-compare',JSON.stringify(compare))}catch{}sync()}
 let toastTimer;
 function toast(t){const el=$('.toast');if(!el)return;el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200)}
 function sync(){
  $$('[data-bag-count]').forEach(el=>el.textContent=fa(quote.length));
  $$('[data-add]').forEach(el=>{const on=quote.includes(el.dataset.add);el.classList.toggle('is-added',on);el.setAttribute('aria-pressed',String(on));el.textContent=on?'در فهرست استعلام':'افزودن به استعلام'});
  $$('[data-compare]').forEach(el=>el.setAttribute('aria-pressed',String(compare.includes(el.dataset.compare))));
  $$('[data-compare-count]').forEach(el=>el.textContent=fa(compare.length));
  const float=$('.compare-float');if(float)float.hidden=compare.length===0||location.pathname.startsWith(BASE+'/compare');
 }
 const find=id=>products.find(p=>p.id===id);
 function quoteItems(){
  const el=$('#quote-items');if(!el)return;
  const selected=quote.map(find).filter(Boolean);
  el.innerHTML=selected.length?selected.map(p=>`<div class="quote-item"><img src="${BASE}/assets/${p.id}.svg" alt=""><span>${esc(p.name)}</span><button data-remove-quote="${p.id}" aria-label="حذف ${esc(p.name)}">${icons.close}</button></div>`).join(''):'<p class="quote-empty">هنوز تجهیزی انتخاب نکرده‌اید. می‌توانید بدون انتخاب دستگاه، درخواست مشاوره بنویسید.</p>';
 }
 function compareTable(){
  const el=$('#comparison-content');if(!el)return;
  const list=compare.map(find).filter(Boolean);
  if(!list.length){el.innerHTML='<div class="empty-state"><h2>هنوز تجهیزی برای مقایسه انتخاب نشده است.</h2><p>در کاتالوگ، دکمه مقایسه روی کارت دستگاه را بزنید.</p><a class="button primary" href="${BASE}/products/">رفتن به کاتالوگ تجهیزات</a></div>';return}
  const row=(label,key)=>`<tr><th scope="row">${label}</th>${list.map(p=>`<td>${esc(p[key])}</td>`).join('')}</tr>`;
  el.innerHTML=`<div class="comparison-scroll" role="region" aria-label="جدول مقایسه تجهیزات" tabindex="0"><table class="comparison-table"><caption class="fineprint" style="text-align:right;margin-bottom:18px">${fa(list.length)} تجهیز منتخب · در نمایشگر کوچک، جدول را افقی پیمایش کنید.</caption><thead><tr><th scope="col">نوع تجهیز</th>${list.map(p=>`<td class="compare-product"><img src="${BASE}/assets/${p.id}.svg" alt="نمای شماتیک ${esc(p.name)}"><h2><a href="${BASE}/products/${p.id}/">${esc(p.name)}</a></h2><button class="button primary" data-add="${p.id}">افزودن به استعلام</button><br><button class="compare-remove" data-remove-compare="${p.id}">حذف از مقایسه</button></td>`).join('')}</tr></thead><tbody>${row('گروه تجهیز','cat')}${row('کاربرد اصلی','use')}${row('نوع خوراک','feed')}${row('مکانیزم عمومی','mode')}${row('مقیاس بررسی','scale')}${row('اطلاعات لازم','req')}</tbody></table></div><div class="button-row"><a class="button outline" href="${BASE}/products/">انتخاب تجهیزات بیشتر</a><a class="button primary" href="${BASE}/quote/">مشاهده فهرست استعلام</a></div>`;
  sync();
 }
 document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]');
  if(add){const id=add.dataset.add;if(quote.includes(id)){toast('این تجهیز در فهرست استعلام شما قرار دارد.');return}quote.push(id);save();quoteItems();toast('تجهیز به فهرست استعلام اضافه شد.');return}
  const comp=e.target.closest('[data-compare]');
  if(comp){const id=comp.dataset.compare;if(compare.includes(id)){compare=compare.filter(x=>x!==id);save();toast('تجهیز از مقایسه حذف شد.')}else if(compare.length>=3){toast('حداکثر سه تجهیز را می‌توانید مقایسه کنید.')}else{compare.push(id);save();toast('تجهیز به مقایسه اضافه شد.')}return}
  const rq=e.target.closest('[data-remove-quote]');if(rq){quote=quote.filter(x=>x!==rq.dataset.removeQuote);save();quoteItems();toast('تجهیز از فهرست استعلام حذف شد.');return}
  const rc=e.target.closest('[data-remove-compare]');if(rc){compare=compare.filter(x=>x!==rc.dataset.removeCompare);save();compareTable();return}
 });

 const equipmentGroups=[
  {title:'آماده‌سازی و خردایش',note:'از خوراک اولیه تا نمونه آماده آزمون',items:[
   {name:'سنگ‌شکن فکی آزمایشگاهی',desc:'خردایش اولیه نمونه',slug:'jaw-crusher',icon:'<path d="M4 6h16v12H4z"/><path d="m7 9 4 3-4 3M17 9l-4 3 4 3"/>'},
   {name:'آسیاب رینگی آزمایشگاهی',desc:'آماده‌سازی نمونه برای آنالیز',slug:'ring-mill',icon:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M20 12h-2M12 20v-2M4 12h2"/>'},
   {name:'آسیاب گلوله‌ای',desc:'آسیاب‌کنی و آماده‌سازی نمونه',slug:'ball-mill',icon:'<path d="M5 7h14l-1 11H6L5 7Z"/><path d="M8 5h8M8 12l2 2m2-4 2 2m1-3 1 1"/>'},
   {name:'شیکر الک آزمایشگاهی',desc:'دانه‌بندی و بررسی توزیع اندازه',slug:'sieve-shaker',icon:'<path d="M4 7h16M5 12h14M7 17h10"/><path d="M6 4h12v16H6z"/>'}
  ]},
  {title:'جدایش و فرآوری',note:'تجهیزات آزمون و بررسی رفتار ماده',items:[
   {name:'سلول فلوتاسیون آزمایشگاهی',desc:'مطالعه جدایش به روش فلوتاسیون',slug:'flotation-cell',icon:'<path d="M6 20h12M8 20V9h8v11M10 9V5h4v4"/><circle cx="10" cy="14" r="1"/><circle cx="14" cy="12" r="1"/><path d="M12 4V2"/>'},
   {name:'میز لرزان آزمایشگاهی',desc:'مطالعه جدایش ثقلی',slug:'shaking-table',icon:'<path d="m4 8 16-3M5 12l14-3M6 16l12-3"/><path d="M8 18v3m8-5v5M4 21h16"/>'},
   {name:'جداکننده مغناطیسی',desc:'بررسی جدایش بر پایه خواص مغناطیسی',slug:'magnetic-separator',icon:'<path d="M6 5v7a6 6 0 0 0 12 0V5"/><path d="M6 5h4v5H6zm8 0h4v5h-4z"/>'},
   {name:'تقسیم‌کننده نمونه',desc:'تهیه بخش‌های نماینده از نمونه',slug:'sample-splitter',icon:'<path d="M4 5h16v4H4zM6 9v10m4-10v10m4-10v10m4-10v10"/><path d="M4 19h16"/>'}
  ]}
 ];
 const solutionLinks=[
  {title:'معدن و فرآوری مواد معدنی',desc:'از شناخت خوراک تا مسیر فرآوری',url:BASE+'/solutions/mineral-processing/'},
  {title:'آزمایشگاه و مراکز پژوهشی',desc:'چیدمان بر پایه گردش نمونه',url:BASE+'/solutions/laboratories/'},
  {title:'واحدهای پایلوت',desc:'توسعه فرآیند در مقیاس میانی',url:BASE+'/solutions/pilot-plants/'}
 ];
 const serviceLinks=[
  {title:'مشاوره و انتخاب تجهیزات',desc:'تعریف نیاز و بررسی گزینه‌ها',url:BASE+'/services/engineering/'},
  {title:'نصب، راه‌اندازی و آموزش',desc:'آماده‌سازی و تحویل تجهیز',url:BASE+'/services/installation/'},
  {title:'نگهداری و تأمین قطعات',desc:'پشتیبانی در چرخه کار دستگاه',url:BASE+'/services/maintenance/'}
 ];
 const menuIcon=path=>'<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>';
 const chevron=menuIcon('<path d="m9 18 6-6-6-6"/>');
 const equipmentLink=(item,cls)=>'<a class="'+cls+'" href="'+BASE+'/products/'+item.slug+'/"><span class="mega-link-icon">'+menuIcon(item.icon)+'</span><span class="mega-link-copy"><b>'+esc(item.name)+'</b><small>'+esc(item.desc)+'</small></span></a>';
 const mega=$('.mega');
 if(mega){
  mega.id='equipment-mega';
  mega.innerHTML=
   '<div class="mega-shell">'+
    '<div class="mega-heading"><div><span class="mega-kicker">کاتالوگ تجهیزات مدار</span><h3>تجهیز مناسب، در مسیر درست</h3></div><p>بر اساس مرحله کار، دستگاه‌ها را پیدا و بررسی کنید.</p></div>'+
    '<div class="mega-grid">'+
     '<section class="mega-intro"><span class="mega-intro-icon">'+menuIcon('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>')+'</span><span class="mega-intro-label">مسیر انتخاب</span><h4>از کجا شروع کنیم؟</h4><p>مرحله‌ای را انتخاب کنید که اکنون در آن هستید؛ فهرست دستگاه‌ها را با کاربردشان ببینید.</p><a class="mega-all-link" href="'+BASE+'/products/">مشاهده همه تجهیزات '+chevron+'</a><div class="mega-process"><span>نمونه</span><i></i><span>آزمون</span><i></i><span>نتیجه</span></div></section>'+
     '<div class="mega-groups">'+equipmentGroups.map(group=>'<section class="mega-group"><div class="mega-group-heading"><h4>'+esc(group.title)+'</h4><p>'+esc(group.note)+'</p></div>'+group.items.map(item=>equipmentLink(item,'mega-product')).join('')+'</section>').join('')+'</div>'+
     '<a class="mega-feature" href="'+BASE+'/quote/"><span class="mega-feature-tag">همراه انتخاب شما</span><strong>پیش از انتخاب دستگاه، نیاز فنی را روشن کنید.</strong><span class="mega-feature-bottom">درخواست مشاوره '+menuIcon('<path d="M5 12h14M13 6l6 6-6 6"/>')+'</span></a>'+
    '</div>'+
    '<div class="mega-bottom"><span>بین چند گزینه مردد هستید؟</span><a href="'+BASE+'/compare/">مقایسه تجهیزات</a><span class="mega-bottom-spacer"></span><a href="'+BASE+'/downloads/">کاتالوگ و مستندات</a></div>'+
   '</div>';
  const dropdown=$('.nav-dropdown');
  const trigger=dropdown?.querySelector('.nav-link');
  if(trigger){
   trigger.setAttribute('aria-haspopup','true');
   trigger.setAttribute('aria-controls',mega.id);
   trigger.setAttribute('aria-expanded','false');
   dropdown.addEventListener('mouseenter',()=>trigger.setAttribute('aria-expanded','true'));
   dropdown.addEventListener('mouseleave',()=>trigger.setAttribute('aria-expanded','false'));
   dropdown.addEventListener('focusin',()=>trigger.setAttribute('aria-expanded','true'));
   dropdown.addEventListener('focusout',e=>{if(!dropdown.contains(e.relatedTarget))trigger.setAttribute('aria-expanded','false')});
  }
 }
 const mobileMenu=$('.mobile-nav');
 const mobileGroup=(title,summary,items,icon,open)=>'<details class="mobile-nav-group"'+(open?' open':'')+'><summary><span class="mobile-group-icon">'+menuIcon(icon)+'</span><span class="mobile-group-title"><b>'+esc(title)+'</b><small>'+esc(summary)+'</small></span><span class="mobile-group-chevron">'+chevron+'</span></summary><div class="mobile-group-links">'+items.map(item=>'<a href="'+esc(item.url)+'"><b>'+esc(item.title)+'</b><small>'+esc(item.desc)+'</small></a>').join('')+'</div></details>';
 if(mobileMenu){
  mobileMenu.id='site-mobile-nav';
  const mobileEquipment=equipmentGroups.flatMap(group=>group.items.map(item=>({title:item.name,desc:item.desc,url:BASE+'/products/'+item.slug+'/'})));
  const mobileDirect=[
   {title:'پروژه‌ها',url:BASE+'/projects/'},
   {title:'دانش‌نامه',url:BASE+'/articles/'},
   {title:'درباره مدار',url:BASE+'/about/'}
  ];
  mobileMenu.innerHTML=
   '<div class="mobile-nav-head"><div><span>منوی مدار</span><strong>دسترسی سریع به بخش‌های سایت</strong></div><button type="button" class="mobile-nav-close" data-mobile-menu-close aria-label="بستن منو">'+menuIcon('<path d="m6 6 12 12M18 6 6 18"/>')+'</button></div>'+
   '<div class="mobile-nav-actions"><a class="mobile-nav-catalog" href="'+BASE+'/products/">'+menuIcon('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/>')+'<span><b>کاتالوگ تجهیزات</b><small>مشاهده همه دستگاه‌ها</small></span></a><a class="mobile-nav-consult" href="'+BASE+'/quote/">درخواست مشاوره '+menuIcon('<path d="M5 12h14M13 6l6 6-6 6"/>')+'</a></div>'+
   '<div class="mobile-nav-groups">'+
    mobileGroup('تجهیزات','تجهیزات بر پایه مرحله کار',mobileEquipment,'<path d="M4 6h16v12H4z"/><path d="M8 10h8M8 14h8"/>',true)+
    mobileGroup('راهکارها','از آزمایشگاه تا واحد پایلوت',solutionLinks,'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M12 13v8"/>',false)+
    mobileGroup('خدمات مهندسی','همراهی در چرخه عمر تجهیز',serviceLinks,'<path d="m9 3-1 3-3 1 1 4-2 2 3 3v3l4 1 2-2 4 1 1-4 3-2-2-4-3-1-1-3-4 1Z"/><circle cx="12" cy="12" r="3"/>',false)+
   '</div>'+
   '<div class="mobile-nav-direct">'+mobileDirect.map(item=>'<a href="'+item.url+'">'+esc(item.title)+chevron+'</a>').join('')+'</div>'+
   '<div class="mobile-nav-footer"><a href="'+BASE+'/downloads/">مرکز دانلود</a><a href="'+BASE+'/contact/">ارتباط با ما</a><span>مهندسی و تجهیزات فرآوری</span></div>';
 }
 const menu=$('.mobile-menu-toggle'),nav=mobileMenu;
 if(menu&&nav){
  menu.setAttribute('aria-controls',nav.id);
  const closeMenu=restoreFocus=>{nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','بازکردن منو');document.body.classList.remove('menu-open');const svg=menu.querySelector('svg');if(svg)svg.innerHTML='<path d="M4 6h16M4 12h16M4 18h16"/>';if(restoreFocus)menu.focus()};
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'بستن منو':'بازکردن منو');nav.hidden=!open;document.body.classList.toggle('menu-open',open);const svg=menu.querySelector('svg');if(svg)svg.innerHTML=open?'<path d="m6 6 12 12M18 6 6 18"/>':'<path d="M4 6h16M4 12h16M4 18h16"/>'});
  nav.querySelector('[data-mobile-menu-close]')?.addEventListener('click',()=>closeMenu(true));
  nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nav.hidden)closeMenu(true)});
  window.addEventListener('resize',()=>{if(innerWidth>1050)closeMenu(false)});
 }

 const dialog=$('#search-dialog'),search=$('#global-search'),results=$('#search-results');
 function searchResults(){if(!results)return;const q=norm(search.value);if(!q){results.innerHTML='<p class="search-hint">پیشنهاد: آسیاب، جدایش، آماده‌سازی نمونه یا نگهداری</p>';return}const terms=q.split(/\s+/);const matches=pages.filter(p=>p.slug!='/404/'&&terms.every(t=>norm(p.title).includes(t))).slice(0,9);results.innerHTML=matches.length?matches.map(p=>`<a class="search-result" href="${BASE}${esc(p.slug)}"><span>${esc(p.title)}</span><small>${p.slug.startsWith('/products/')?'تجهیزات':p.slug.startsWith('/articles/')?'دانش‌نامه':'صفحه'}</small></a>`).join(''):'<p class="search-empty">نتیجه‌ای پیدا نشد. نام کوتاه‌تر یا عبارت دیگری وارد کنید.</p>'}
 $$('[data-search-open]').forEach(el=>el.addEventListener('click',()=>{dialog.showModal();searchResults();search.focus()}));
 $('[data-search-close]')?.addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 search?.addEventListener('input',searchResults);
 const productSearch=$('#product-search');let category=new URLSearchParams(location.search).get('category')||'همه تجهیزات';
 function filterProducts(){
  const grid=$('.catalog-grid');if(!grid)return;const q=norm(productSearch.value),terms=q.split(/\s+/).filter(Boolean);let count=0;
  $$('[data-category-filter]').forEach(b=>{const on=b.dataset.categoryFilter===category;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))});
  const sort=$('#product-sort')?.value;
  const cards=$$('.product-card',grid);
  if(sort==='name')cards.sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name,'fa')).forEach(c=>grid.append(c));
  else if(products.length)products.forEach(p=>{const c=cards.find(c=>c.dataset.product===p.id);if(c)grid.append(c)});
  cards.forEach(c=>{const p=find(c.dataset.product);const text=norm(c.dataset.name+' '+(p?.desc||'')+' '+(p?.use||''));const visible=(category==='همه تجهیزات'||c.dataset.category===category)&&terms.every(t=>text.includes(t));c.hidden=!visible;if(visible)count++});
  $('#result-count').textContent=fa(count)+' تجهیز';$('#empty-products').hidden=count!==0;
 }
 $$('[data-category-filter]').forEach(el=>el.addEventListener('click',()=>{category=el.dataset.categoryFilter;const url=new URL(location.href);if(category==='همه تجهیزات')url.searchParams.delete('category');else url.searchParams.set('category',category);history.replaceState(null,'',url);filterProducts()}));
 productSearch?.addEventListener('input',filterProducts);$('#product-sort')?.addEventListener('change',filterProducts);$('#reset-filters')?.addEventListener('click',()=>{category='همه تجهیزات';productSearch.value='';const url=new URL(location.href);url.searchParams.delete('category');history.replaceState(null,'',url);filterProducts()});
 const form=$('#request-form');let requestData=null,requestSelection=[];
 if(form){const service=new URLSearchParams(location.search).get('service');if(service&&$$('option',form.elements.subject).some(x=>x.value===service))form.elements.subject.value=service;
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;requestData=Object.fromEntries(new FormData(form));requestSelection=quote.map(find).filter(Boolean).map(p=>p.name);const summary=$('#request-summary');summary.innerHTML='<dl>'+[['نام',requestData.name],['مجموعه',requestData.company||'ثبت نشده'],['تجهیزات',requestSelection.join('، ')||'درخواست بدون انتخاب تجهیز']].map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')+'</dl>';form.hidden=true;$('#request-success').hidden=false;$('#request-success').focus();});
 $('#edit-request')?.addEventListener('click',()=>{$('#request-success').hidden=true;form.hidden=false;form.elements.name.focus()});
 $('#download-request')?.addEventListener('click',()=>{if(!requestData)return;const subject=form.elements.subject.selectedOptions[0].textContent;const t='درخواست نمایشی تجهیزات و خدمات مدار\nاین درخواست به شرکتی ارسال نشده است.\n\nنام: '+requestData.name+'\nمجموعه: '+requestData.company+'\nتلفن: '+requestData.phone+'\nایمیل: '+requestData.email+'\nموضوع: '+subject+'\n\nتجهیزات منتخب:\n'+(requestSelection.join('\n')||'بدون تجهیز منتخب')+'\n\nشرح نیاز:\n'+requestData.message;const blob=new Blob(['\ufeff'+t],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='madar-request.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('نسخه درخواست برای دانلود آماده شد.');});}
 $('#clear-local')?.addEventListener('click',()=>{quote=[];compare=[];save();toast('فهرست‌های استعلام و مقایسه پاک شدند.');});
 const top=$('.back-top');top?.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));window.addEventListener('scroll',()=>top?.classList.toggle('visible',scrollY>550),{passive:true});
 window.addEventListener('storage',()=>{quote=load('madar-quote');compare=load('madar-compare').slice(0,3);sync();quoteItems();compareTable()});
 sync();
 Promise.all([fetch(BASE+'/assets/products.json').then(r=>{if(!r.ok)throw Error();return r.json()}),fetch(BASE+'/assets/pages.json').then(r=>{if(!r.ok)throw Error();return r.json()})]).then(([p,pg])=>{products=p;pages=pg;quote=quote.filter(find);compare=compare.filter(find);save();quoteItems();compareTable();filterProducts();if(dialog?.open)searchResults()}).catch(()=>{toast('اطلاعات تکمیلی بارگذاری نشد. صفحه را تازه‌سازی کنید.');});
})();
