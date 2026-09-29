const CHAT_API_ENDPOINT='/api/chat';
let chatHistory=[];
// Hours: Mon-Fri 11am-9pm, Sat-Sun 7am-9pm (Asia/Manila)
function isOpen(){
  const p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Manila',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  const g=t=>p.find(x=>x.type===t).value;
  const wd=g('weekday'),mins=(+g('hour')%24)*60+ +g('minute');
  const weekend=wd==='Sat'||wd==='Sun';
  return mins>=(weekend?420:660)&&mins<1260;
}
function updateStatus(){
  const d=document.getElementById('status-dot'),t=document.getElementById('status-text');
  const o=isOpen();d.className=o?'on':'off';t.textContent=o?'Open now':'Closed now';
}
async function getBotResponse(msg){
  chatHistory.push({role:'user',parts:[{text:msg}]});
  if(chatHistory.length>20)chatHistory=chatHistory.slice(-20);
  try{
    const r=await fetch(CHAT_API_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:chatHistory})});
    const data=await r.json().catch(()=>({}));
    if(!r.ok){chatHistory.pop();return r.status===429?'Many questions at once. Please wait a few seconds and try again.':'Something went wrong on our end. Please try again in a moment.';}
    const reply=data?.reply?.trim();
    if(!reply){chatHistory.pop();return 'I did not catch that. Could you ask it another way?';}
    chatHistory.push({role:'model',parts:[{text:reply}]});return reply;
  }catch(e){chatHistory.pop();return 'The connection dropped. Please try again.';}
}
const $=id=>document.getElementById(id);
function addMsg(text,who){const d=document.createElement('div');d.className='msg '+who;d.textContent=text;$('chat-messages').appendChild(d);$('chat-messages').scrollTop=1e6;return d;}
let first=true,sending=false;
function toggleChat(){
  const w=$('chat-window');const hidden=w.classList.toggle('chat-hidden');
  if(!hidden){if(first){addMsg('Hello! I can help with our hours, the menu and getting here. What would you like to know?','bot');first=false;}setTimeout(()=>$('chat-input').focus(),100);}
}
async function send(){
  const i=$('chat-input'),m=i.value.trim();if(!m||sending)return;
  sending=true;addMsg(m,'me');i.value='';const t=addMsg('…','bot');
  const reply=await getBotResponse(m);t.textContent=reply;sending=false;
}
function setMenu(open){
  $('mobile-menu').classList.toggle('open',open);
  $('hamburger').setAttribute('aria-expanded',open);$('hamburger').textContent=open?'Close':'Menu';
}
document.addEventListener('DOMContentLoaded',()=>{
  updateStatus();setInterval(updateStatus,60000);
  $('hamburger').addEventListener('click',()=>setMenu(!$('mobile-menu').classList.contains('open')));
  document.querySelectorAll('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  const sc=$('menu-scroll');
  $('m-left').addEventListener('click',()=>sc.scrollBy({left:-400,behavior:'smooth'}));
  $('m-right').addEventListener('click',()=>sc.scrollBy({left:400,behavior:'smooth'}));
  const lb=$('lightbox');
  sc.addEventListener('click',e=>{const p=e.target.closest('.page');if(!p)return;const im=p.querySelector('img');$('lb-img').src=im.src;$('lb-img').alt=im.alt;lb.hidden=false;document.body.style.overflow='hidden';});
  const close=()=>{lb.hidden=true;document.body.style.overflow='';};
  $('lb-close').addEventListener('click',close);
  lb.addEventListener('click',e=>{if(e.target===lb)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!lb.hidden)close();});
  ['chat-fab','chat-close','chat-toggle-hero'].forEach(id=>$(id).addEventListener('click',toggleChat));
  $('chat-send').addEventListener('click',send);
  $('chat-input').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send();}});
});
