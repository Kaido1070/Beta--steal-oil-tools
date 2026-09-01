/* STOT Codes page runtime v5.68 — extracted from js/app.js */
const GAME_CODES=[
  {code:"8962",type:"cash",reward:"10,000 Cash"},
  {code:"5219",type:"cash",reward:"75,000 Cash"},
  {code:"24",type:"cash",reward:"50,000 Cash",daily:true},
  {code:"6743",type:"cash",reward:"50,000 Cash"},
  {code:"1586",type:"cash",reward:"25,000 Cash"},
  {code:"7485",type:"cash",reward:"20,000 Cash"},
  {code:"6158",type:"gasoline",reward:"50,000 Gasoline"},
  {code:"6904",type:"gasoline",reward:"50,000 Gasoline"},
  {code:"3472",type:"gasoline",reward:"25,000 Gasoline"},
  {code:"7823",type:"gasoline",reward:"20,000 Gasoline"},
  {code:"8195",type:"gasoline",reward:"10,000 Gasoline"},
  {code:"1234",type:"gasoline",reward:"1,234 Gasoline"},
  {code:"9274",type:"energy",reward:"10,000 Energy"},
  {code:"67",type:"items",reward:"Industrial Refinery"},
  {code:"2828",type:"items",reward:"Wooden Wind"},
  {code:"4627",type:"items",reward:"Nuclear Reactor Refinery"},
  {code:"9351",type:"items",reward:"Super Rocket Drill"},
  {code:"2849",type:"items",reward:"Rocket Drill"},
  {code:"2026",type:"items",reward:"Hell Drill",expires:"Jan 1 2027"},
  {code:"7164",type:"items",reward:"Hell Drill"},
  {code:"5938",type:"items",reward:"Ice Drill"}
];
let codeFilter="all";
function renderCodes(){
  const q=(document.querySelector("#codesSearch")?.value||"").trim().toLowerCase();
  const rows=GAME_CODES.filter(x=>(codeFilter==="all"||x.type===codeFilter)&&(!q||x.code.includes(q)||x.reward.toLowerCase().includes(q)));
  document.querySelector("#codesCount").textContent=`${rows.length} ${rows.length===1?"code":"codes"}`;
  document.querySelector("#codesList").innerHTML=rows.map(x=>`<article class="panel code-card"><div class="code-main"><div class="code-top"><span class="code-value">${x.code}</span></div><div class="code-reward">${x.reward}</div><div class="code-tags"><span class="code-tag">${x.type==="items"?"Item":x.type[0].toUpperCase()+x.type.slice(1)}</span>${x.daily?'<span class="code-tag daily">Daily</span>':''}${x.expires?`<span class="code-tag expiry">Expires ${x.expires}</span>`:''}</div></div><button class="code-copy" data-copy-code="${x.code}">Copy</button></article>`).join("");
  document.querySelectorAll("[data-copy-code]").forEach(btn=>btn.onclick=async()=>{try{await navigator.clipboard.writeText(btn.dataset.copyCode)}catch(e){const t=document.createElement("textarea");t.value=btn.dataset.copyCode;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove()}btn.textContent="Copied";btn.classList.add("copied");setTimeout(()=>{btn.textContent="Copy";btn.classList.remove("copied")},1200)});
}
document.querySelector("#codesSearch")?.addEventListener("input",renderCodes);
document.querySelectorAll("[data-code-filter]").forEach(b=>b.onclick=()=>{codeFilter=b.dataset.codeFilter;document.querySelectorAll("[data-code-filter]").forEach(x=>x.classList.toggle("active",x===b));renderCodes()});

/* Initial Codes render now belongs to this page module. */
renderCodes();
document.documentElement.dataset.stotCodesPage="5.68";
