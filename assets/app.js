'use strict';
(()=>{
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
  const float=$('.compare-float');if(float)float.hidden=compare.length===0||location.pathname.startsWith('/compare');
 }
 const find=id=>products.find(p=>p.id===id);
 function quoteItems(){
  const el=$('#quote-items');if(!el)return;
  const selected=quote.map(find).filter(Boolean);
  el.innerHTML=selected.length?selected.map(p=>`<div class="quote-item"><img src="/assets/${p.id}.svg" alt=""><span>${esc(p.name)}</span><button data-remove-quote="${p.id}" aria-label="حذف ${esc(p.name)}">${icons.close}</button></div>`).join(''):'<p class="quote-empty">هنوز تجهیزی انتخاب نکرده‌اید. می‌توانید بدون انتخاب دستگاه، درخواست مشاوره بنویسید.</p>';
 }
 function compareTable(){
  const el=$('#comparison-content');if(!el)return;
  const list=compare.map(find).filter(Boolean);
  if(!list.length){el.innerHTML='<div class="empty-state"><h2>هنوز تجهیزی برای مقایسه انتخاب نشده است.</h2><p>در کاتالوگ، دکمه مقایسه روی کارت دستگاه را بزنید.</p><a class="button primary" href="/products/">رفتن به کاتالوگ تجهیزات</a></div>';return}
  const row=(label,key)=>`<tr><th scope="row">${label}</th>${list.map(p=>`<td>${esc(p[key])}</td>`).join('')}</tr>`;
  el.innerHTML=`<div class="comparison-scroll" role="region" aria-label="جدول مقایسه تجهیزات" tabindex="0"><table class="comparison-table"><caption class="fineprint" style="text-align:right;margin-bottom:18px">${fa(list.length)} تجهیز منتخب · در نمایشگر کوچک، جدول را افقی پیمایش کنید.</caption><thead><tr><th scope="col">نوع تجهیز</th>${list.map(p=>`<td class="compare-product"><img src="/assets/${p.id}.svg" alt="نمای شماتیک ${esc(p.name)}"><h2><a href="/products/${p.id}/">${esc(p.name)}</a></h2><button class="button primary" data-add="${p.id}">افزودن به استعلام</button><br><button class="compare-remove" data-remove-compare="${p.id}">حذف از مقایسه</button></td>`).join('')}</tr></thead><tbody>${row('گروه تجهیز','cat')}${row('کاربرد اصلی','use')}${row('نوع خوراک','feed')}${row('مکانیزم عمومی','mode')}${row('مقیاس بررسی','scale')}${row('اطلاعات لازم','req')}</tbody></table></div><div class="button-row"><a class="button outline" href="/products/">انتخاب تجهیزات بیشتر</a><a class="button primary" href="/quote/">مشاهده فهرست استعلام</a></div>`;
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
 const menu=$('.mobile-menu-toggle'),nav=$('.mobile-nav');
 if(menu&&nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'بستن منو':'بازکردن منو');nav.hidden=!open;document.body.classList.toggle('menu-open',open)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nav.hidden){nav.hidden=true;menu.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');menu.focus()}});window.addEventListener('resize',()=>{if(innerWidth>1050){nav.hidden=true;menu.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}})}
 const dialog=$('#search-dialog'),search=$('#global-search'),results=$('#search-results');
 function searchResults(){if(!results)return;const q=norm(search.value);if(!q){results.innerHTML='<p class="search-hint">پیشنهاد: آسیاب، جدایش، آماده‌سازی نمونه یا نگهداری</p>';return}const terms=q.split(/\s+/);const matches=pages.filter(p=>p.slug!='/404/'&&terms.every(t=>norm(p.title).includes(t))).slice(0,9);results.innerHTML=matches.length?matches.map(p=>`<a class="search-result" href="${esc(p.slug)}"><span>${esc(p.title)}</span><small>${p.slug.startsWith('/products/')?'تجهیزات':p.slug.startsWith('/articles/')?'دانش‌نامه':'صفحه'}</small></a>`).join(''):'<p class="search-empty">نتیجه‌ای پیدا نشد. نام کوتاه‌تر یا عبارت دیگری وارد کنید.</p>'}
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
 Promise.all([fetch('/assets/products.json').then(r=>{if(!r.ok)throw Error();return r.json()}),fetch('/assets/pages.json').then(r=>{if(!r.ok)throw Error();return r.json()})]).then(([p,pg])=>{products=p;pages=pg;quote=quote.filter(find);compare=compare.filter(find);save();quoteItems();compareTable();filterProducts();if(dialog?.open)searchResults()}).catch(()=>{toast('اطلاعات تکمیلی بارگذاری نشد. صفحه را تازه‌سازی کنید.');});
})();
