/* STOT Sale page runtime — version from js/site-config.js — extracted from js/app.js  */
let saleUnit=1,friendBoost=50;
function calcSale(){
  const oil=finiteNonNegative($("#saleOil").value)*saleUnit;
  const cash=finiteNonNegative($("#cashBoost").value);
  const price=finiteNonNegative($("#sellPrice").value);
  const bonus=(cash+friendBoost)/100;
  const cpo=price*bonus;
  $("#cashPerOil").textContent=money(cpo);
  $("#saleValue").textContent=money(oil*cpo);
  $("#totalBoost").textContent=fmt(cash+friendBoost)+"%";
}
$("#saleUnits").onclick=e=>{let b=e.target.closest("[data-unit]");if(!b)return;saleUnit=Number(b.dataset.unit);activate($("#saleUnits"),"unit",b.dataset.unit);calcSale()};
$("#friendBoosts").onclick=e=>{let b=e.target.closest("[data-friend]");if(!b)return;friendBoost=Number(b.dataset.friend);activate($("#friendBoosts"),"friend",b.dataset.friend);calcSale()};
$("#sellPrices").onclick=e=>{let b=e.target.closest("[data-price]");if(!b)return;$("#sellPrice").value=b.dataset.price;activate($("#sellPrices"),"price",b.dataset.price);calcSale()};
["#saleOil","#cashBoost","#sellPrice"].forEach(s=>$(s).addEventListener("input",calcSale));
$("#saleReset").onclick=()=>{$("#saleOil").value=50;saleUnit=1;$("#cashBoost").value=100;friendBoost=0;$("#sellPrice").value=15;activate($("#saleUnits"),"unit",1);activate($("#friendBoosts"),"friend",0);activate($("#sellPrices"),"price",15);calcSale()};
function saleOilDisplay(){const suffix={1:"",1000:"K",1000000:"M",1000000000:"B",1000000000000:"T"}[saleUnit]??"";return `${finiteNonNegative($("#saleOil").value)}${suffix}`}
function saleSummaryText(){return `Sale Result
Oil: ${saleOilDisplay()}
Sell Price: $${finiteNonNegative($("#sellPrice").value)}
Cash Boost: ${finiteNonNegative($("#cashBoost").value)}%
Friend Boost: ${friendBoost}%
Cash per Oil: ${$("#cashPerOil").textContent}
Sale Value: ${$("#saleValue").textContent}`}

$("#saleCopy").onclick=()=>copyText(saleSummaryText(),$("#saleCopy"),"Copy Summary");
$("#saleShare").onclick=()=>{const oilText=escapeHTML(saleOilDisplay()),priceText=escapeHTML(finiteNonNegative($("#sellPrice").value)),cashText=escapeHTML(finiteNonNegative($("#cashBoost").value));const html=`<div class="share-section"><div class="share-section-title">Sale Setup</div><div class="share-line"><span>Oil Amount</span><strong>${oilText}</strong></div><div class="share-line"><span>Sell Price</span><strong>$${priceText}</strong></div><div class="share-line"><span>Cash Boost</span><strong>${cashText}%</strong></div><div class="share-line"><span>Friend Boost</span><strong>${friendBoost}%</strong></div></div><div class="share-section"><div class="share-section-title">Result</div><div class="share-line"><span>Cash per Oil</span><strong>${escapeHTML($("#cashPerOil").textContent)}</strong></div><div class="share-line"><span>Sale Value</span><strong>${escapeHTML($("#saleValue").textContent)}</strong></div></div>`;openSharePreview("Sale Result",html,saleSummaryText())};

/* Initial Sale render now belongs to this page module. */
calcSale();
document.documentElement.dataset.stotSalePage=STOT_CONFIG.version;
