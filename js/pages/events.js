/* STOT Events page runtime v5.67 — extracted from js/app.js */
const mapEvents=[
  {id:"candy",name:"Candy Event",schedule:[{h:3,m:0},{h:9,m:0},{h:15,m:0},{h:21,m:0}],objective:"Collect candies that spawn across the map.",unlock:"Candy Drill • 67/s • Cost: 50 Candy",effect:"Gasoline market price is locked at $15."},
  {id:"lava",name:"Lava Event",schedule:[{h:4,m:0},{h:10,m:0},{h:16,m:0},{h:22,m:0}],objective:"Collect Lava Crystals that spawn across the map.",unlock:"Volcano Drill • 83/s • Cost: 62 Lava Crystals",effect:"Fusion Machine processing timers are reduced by half."},
  {id:"disco",name:"Disco Event",schedule:[{h:5,m:0},{h:11,m:0},{h:17,m:0},{h:23,m:0}],objective:"Earn Music Notes during the event.",unlock:"Disco Drill • 104/s • Cost: 78 Music Notes",effect:"Lootbox incubation is reduced to 1 minute and rare drop chance is doubled."},
  {id:"happy",name:"Happy Hour",schedule:[{h:6,m:0},{h:18,m:0}],objective:"",unlock:"",effect:"The normal $15 market cap is lifted and the market can reach $20 for the hour."}
];
const adminSchedule=[
  {dow:6,h:1,m:30,label:"Saturday"},{dow:6,h:10,m:30,label:"Saturday"},{dow:6,h:18,m:30,label:"Saturday"},
  {dow:0,h:1,m:30,label:"Sunday"},{dow:0,h:10,m:30,label:"Sunday"},{dow:0,h:18,m:30,label:"Sunday"}
];
const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||"Local time";
function localStamp(date){
  return new Intl.DateTimeFormat("en-US",{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(date);
}
function relativeDay(date){
  const now=new Date(),a=new Date(now.getFullYear(),now.getMonth(),now.getDate()),b=new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const diff=Math.round((b-a)/86400000),time=new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(date);
  if(diff===0)return `Today • ${time}`;if(diff===1)return `Tomorrow • ${time}`;
  return localStamp(date);
}
function nextDailySlots(schedule,count=4){
  const now=new Date(),items=[];
  for(let day=0;day<4;day++)for(const s of schedule){
    const d=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+day,s.h,s.m));
    if(d>now)items.push(d);
  }
  return items.sort((a,b)=>a-b).slice(0,count);
}
function nextWeeklySlots(entries,count=6){
  const now=new Date(),items=[];
  for(let add=0;add<15;add++){
    const base=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+add));
    const dow=base.getUTCDay();
    for(const e of entries)if(e.dow===dow){
      const d=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth(),base.getUTCDate(),e.h,e.m));
      if(d>now)items.push({date:d,label:e.label});
    }
  }
  return items.sort((a,b)=>a.date-b.date).slice(0,count);
}
function allUpcomingStarts(){
  const list=[];
  mapEvents.forEach(e=>nextDailySlots(e.schedule,1).forEach(d=>list.push({name:e.name,date:d,id:e.id})));
  nextWeeklySlots(adminSchedule,1).forEach(x=>list.push({name:"Admin Abuse",date:x.date,id:"admin"}));
  return list.sort((a,b)=>a.date-b.date);
}
function countdownText(ms){
  if(ms<=0)return"Starting now";
  const s=Math.floor(ms/1000),d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60),sec=s%60;
  return [d?`${d}d`:"",h?`${h}h`:"",m?`${m}m`:"",`${sec}s`].filter(Boolean).join(" ");
}
function eventCard(e){
  const slots=nextDailySlots(e.schedule,4);
  const timeOnly=d=>new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(d);
  return `<article class="panel event-card">
    <div class="event-head"><div><h3>${e.name}</h3></div><span class="event-next">Next • ${relativeDay(slots[0])}</span></div>
    <div class="event-times">${slots.map(d=>`<span>${timeOnly(d)}</span>`).join("")}</div>
  </article>`;
}
function renderEvents(){
  $("#localTimezone").textContent=timezone;
  const next=allUpcomingStarts()[0];
  if(next){
    $("#nextEventName").textContent=next.name;
    $("#nextEventTime").textContent=relativeDay(next.date);
    $("#nextEventCountdown").dataset.time=String(next.date.getTime());
  }
  $("#eventList").innerHTML=mapEvents.map(eventCard).join("");
  const admin=nextWeeklySlots(adminSchedule,6);
  const grouped={};
  admin.forEach(x=>{const day=new Intl.DateTimeFormat("en-US",{weekday:"long"}).format(x.date);(grouped[day]??=[]).push(x.date)});
  $("#adminTimes").innerHTML=Object.entries(grouped).map(([day,dates])=>`<div class="admin-day"><div class="admin-day-head"><strong>${day}</strong></div><div class="admin-chips">${dates.map(d=>`<span>${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(d)}</span>`).join("")}</div></div>`).join("");
  updateEventCountdown();
}
function updateEventCountdown(){
  const el=$("#nextEventCountdown");if(!el||!el.dataset.time)return;
  el.textContent=countdownText(Number(el.dataset.time)-Date.now());
  if(Number(el.dataset.time)<=Date.now())renderEvents();
}
setInterval(updateEventCountdown,1000);

/* Initial Events render now belongs to this page module. */
renderEvents();
document.documentElement.dataset.stotEventsPage="5.67";
