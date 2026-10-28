/* AmisA public dental news/events; no patient or case data.
   Reads only published rows through the public (RLS-protected) REST API.
   Renders into every element with data-amisa-feed="news|events"
   (optional data-limit), plus the legacy #amisa-news-list / #amisa-events-list ids. */
(()=>{'use strict';
const base='https://dciupcmshcvspqctknrd.supabase.co/rest/v1/';
const key='sb_publishable_0UZAjP-b8z315vu2ONQoqg_lnaGvfjd';
const FEEDS={
  news:{table:'dental_news',legacy:'amisa-news-list',
    query:()=>'select=title,summary,source_url,published_at&is_published=eq.true&order=published_at.desc.nullslast&limit=12',
    empty:'No published news available yet.',link:'Read source'},
  events:{table:'events',legacy:'amisa-events-list',
    query:()=>'select=title,description,registration_url,event_date&is_published=eq.true&event_date=gte.'+encodeURIComponent(new Date().toISOString())+'&order=event_date.asc&limit=12',
    empty:'No upcoming events are scheduled right now. Please check back soon.',link:'Event details'}
};
function elem(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!=null)x.textContent=String(text);return x;}
function safeUrl(url){try{const x=new URL(url);return x.protocol==='https:'||x.protocol==='http:'?x.href:null;}catch{return null;}}
function targets(kind){
  const f=FEEDS[kind];const set=new Set(document.querySelectorAll('[data-amisa-feed="'+kind+'"]'));
  const legacy=document.getElementById(f.legacy);if(legacy)set.add(legacy);
  return Array.from(set);
}
function card(item,kind){
  const a=elem('article','feed-card');
  const rawDate=item.published_at||item.event_date;
  if(rawDate){const d=new Date(rawDate);if(!Number.isNaN(d.getTime())){
    const t=elem('time','feed-date');t.dateTime=d.toISOString();
    t.textContent=kind==='events'
      ?d.toLocaleDateString('en-CA',{weekday:'short',year:'numeric',month:'short',day:'numeric'})
      :d.toLocaleDateString('en-CA',{year:'numeric',month:'short',day:'numeric'});
    a.append(t);}}
  a.append(elem('h4','feed-title',item.title||'Untitled'));
  const body=item.summary||item.description;
  if(body)a.append(elem('p','feed-body',body));
  const href=safeUrl(kind==='news'?item.source_url:item.registration_url);
  if(href){const link=elem('a','feed-link',FEEDS[kind].link+' →');link.href=href;link.target='_blank';link.rel='noopener noreferrer';a.append(link);}
  return a;
}
function render(kind,items){
  for(const root of targets(kind)){
    const limit=parseInt(root.dataset.limit,10);
    const list=Number.isFinite(limit)&&limit>0?items.slice(0,limit):items;
    root.replaceChildren();root.removeAttribute('aria-busy');
    if(!list.length){root.append(elem('p','feed-empty',FEEDS[kind].empty));continue;}
    for(const item of list)root.append(card(item,kind));
  }
}
async function load(kind){
  const f=FEEDS[kind];if(!targets(kind).length)return;
  try{const r=await fetch(base+f.table+'?'+f.query(),{headers:{apikey:key,Accept:'application/json'}});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();render(kind,Array.isArray(data)?data:[]);}
  catch(e){console.warn('Public AmisA content unavailable',f.table,e);for(const root of targets(kind)){root.removeAttribute('aria-busy');root.replaceChildren(elem('p','feed-empty','Content temporarily unavailable.'));}}
}
load('news');
load('events');
})();
