/* =========================================================================
   Dashboard Productivité & CA Horaire — Site Mada
   Tout le traitement se fait localement dans le navigateur.
   ========================================================================= */

/* ---------- Référentiels par défaut (extraits des fichiers Mada fournis) --------- */
const DEFAULT_FLUX = [{"queue":"V AFR Partner 3","acte":"AFR"},{"queue":"V RED Partner 3","acte":"AFR"},{"queue":"V C2E Partner 3","acte":"C2E"},{"queue":"V DRIVE Partner 3","acte":"Drive"},{"queue":"V HYPER Partner 3","acte":"HYPER"},{"queue":"V FNR Partner 3","acte":"HYPER"},{"queue":"V SUPER Partner 3","acte":"HYPER"},{"queue":"V QUALITE Partner 3","acte":"HYPER"},{"queue":"V UPROXY Partner 3","acte":"HYPER"},{"queue":"V THYPER Partner 3","acte":"HYPER"},{"queue":"V SAV Partner 3","acte":"SAV"},{"queue":"V SAVED Partner 3","acte":"SAV"},{"queue":"V RED SAV Partner 3","acte":"SAV"},{"queue":"SAV Partner 3","acte":"SAV"},{"queue":"V TSAV Partner 3","acte":"SAV"},{"queue":"V SAV BO Internal","acte":"SAV"},{"queue":"V TSAV Partner 2","acte":"SAV"}];

const DEFAULT_EQUIPES = [{"id":"TER_PST32_716","name":"Felicia"},{"id":"TER_PST32_669","name":"Rosa"},{"id":"TER_PST32_660","name":"Carine"},{"id":"TER_PST32_641","name":"Rojo"},{"id":"TER_PST32_663","name":"Finaritra"},{"id":"TER_PST32_658","name":"Aina"},{"id":"TER_PST32_654","name":"Huguette"},{"id":"TER_PST32_652","name":"Samoina"},{"id":"TER_PST32_644","name":"Tsiory"},{"id":"TER_PST32_704","name":"Aminata"},{"id":"TER_PST32_705","name":"Herilala"},{"id":"TER_PST32_706","name":"Anna"},{"id":"TER_PST32_707","name":"Fehizoro"},{"id":"TER_PST32_708","name":"Kenny"},{"id":"TER_PST32_709","name":"Anjaniaina"},{"id":"TER_PST32_710","name":"Mialitiana"},{"id":"TER_PST32_711","name":"Harivola"},{"id":"TER_PST32_712","name":"Romeo"},{"id":"TER_PST32_713","name":"Tsitoniaina"},{"id":"TER_PST32_714","name":"Angela"},{"id":"TER_PST32_715","name":"Joella"},{"id":"TER_PST32_717","name":"Fitiavana"},{"id":"TER_PST32_718","name":"Estel"},{"id":"TER_PST32_719","name":"Fanomezana"},{"id":"TER_PST32_720","name":"Nomena"},{"id":"TER_PST32_721","name":"Tsiaro"},{"id":"TER_PST32_722","name":"Suzanne"},{"id":"TER_PST32_723","name":"Annick"},{"id":"TER_PST32_724","name":"Aina"},{"id":"TER_PST32_725","name":"Lola"},{"id":"TER_PST32_726","name":"Sabrinette"},{"id":"TER_PST32_727","name":"Vanessa"},{"id":"TER_PST32_728","name":"Samirah"},{"id":"TER_PST32_729","name":"Eric"},{"id":"TER_PST32_730","name":"Sarobidy"},{"id":"TER_PST32_731","name":"Nasandratra"},{"id":"TER_PST32_732","name":"Alex"},{"id":"TER_PST32_733","name":"Nathanaël"},{"id":"TER_PST32_734","name":"Tolotra"},{"id":"TER_PST32_735","name":"Lucka"},{"id":"TER_PST32_736","name":"Ashmyhr"},{"id":"TER_PST32_737","name":"Diamondra"},{"id":"TER_PST32_738","name":"Hanitra"},{"id":"TER_PST32_739","name":"Volaniaina"},{"id":"TER_PST32_740","name":"Brian"},{"id":"TER_PST32_741","name":"Ritah"},{"id":"TER_PST32_742","name":"Sombiniaina"},{"id":"TER_PST32_743","name":"Angelo"},{"id":"TER_PST32_744","name":"Faniriantsoa"},{"id":"TER_PST32_745","name":"Virginia"},{"id":"TER_PST32_746","name":"Avotra"},{"id":"TER_PST32_747","name":"Fanantenana"},{"id":"TER_PST32_748","name":"Judiannah"},{"id":"TER_PST32_749","name":"Christian"},{"id":"TER_PST32_750","name":"Hery"},{"id":"TER_PST32_751","name":"Ibramdjee"},{"id":"TER_PST32_752","name":"Mampionona"},{"id":"TER_PST32_667","name":"Thomas"},{"id":"TER_PST32_656","name":"Mira"},{"id":"TER_PST32_642","name":"Elodie"},{"id":"TER_PST32_647","name":"Jacky"},{"id":"TER_PST32_666","name":"Joeca"},{"id":"TER_PST32_657","name":"Nomena"},{"id":"TER_PST32_678","name":"Sarobidy"},{"id":"TER_PST32_789","name":"Dera"},{"id":"TER_PST32_791","name":"Sylvia"},{"id":"TER_PST32_792","name":"Mickael"},{"id":"TER_PST32_793","name":"Volana"},{"id":"TER_PST32_795","name":"Michael"},{"id":"TER_PST32_796","name":"Murielle"},{"id":"TER_PST32_797","name":"Manitra"},{"id":"TER_PST32_798","name":"Mihanta"},{"id":"TER_PST32_799","name":"Tiavina"},{"id":"TER_PST32_800","name":"Harizo"},{"id":"TER_PST32_802","name":"Andry"},{"id":"TER_PST32_803","name":"Sonia"}];

const DEFAULT_TARIFS = [{"site":"Mada","activite":"LOT UNIQUE","flux":"Entrant","type":"HYPER","normal":0.79,"ferie":1.185},{"site":"Mada","activite":"LOT UNIQUE","flux":"Entrant","type":"C2E","normal":1.43,"ferie":2.145},{"site":"Mada","activite":"LOT UNIQUE","flux":"Entrant","type":"AFR","normal":1.20,"ferie":1.80},{"site":"Mada","activite":"LOT UNIQUE","flux":"Entrant","type":"Drive","normal":0.93,"ferie":1.395},{"site":"Mada","activite":"LOT UNIQUE","flux":"Appels sortants","type":"Appels sortants","normal":1.08,"ferie":1.62},{"site":"Mada","activite":"LOT UNIQUE","flux":"Mails","type":"Mails","normal":1.54,"ferie":2.31}];

/* ---------- Etat global ---------- */
const STATE = {
  raw: { entrant: [], sortant: [], mails: [], rtt: [] },
  importLog: [],
  ref: { flux: DEFAULT_FLUX.slice(), equipes: DEFAULT_EQUIPES.map(e=>({...e, manager:''})), tarifs: DEFAULT_TARIFS.slice() },
  history: [],
  charts: {},
  sort: { key: 'ca', dir: -1 },
  agentSearch: '',
  lastAgentRows: [],
};

function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ============================= UTILITAIRES ============================= */

function toNum(v){
  if (v === null || v === undefined) return 0;
  const s = String(v).replace(/\s/g,'').replace(',', '.');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function normHeader(h){
  return String(h).replace(/ /g,' ').replace(/\s+/g,' ').trim();
}

function findCol(headers, candidates){
  const norm = headers.map(h => ({raw:h, low:normHeader(h).toLowerCase()}));
  for (const cand of candidates){
    const c = cand.toLowerCase();
    const exact = norm.find(h => h.low === c);
    if (exact) return exact.raw;
  }
  for (const cand of candidates){
    const c = cand.toLowerCase();
    const inc = norm.find(h => h.low.includes(c) && !h.low.includes('(hh') && !h.low.includes('hh:mm'));
    if (inc) return inc.raw;
  }
  for (const cand of candidates){
    const c = cand.toLowerCase();
    const inc = norm.find(h => h.low.includes(c));
    if (inc) return inc.raw;
  }
  return null;
}

const AGENT_ID_RE = /(TER_PST\d+_\d+)/i;
function extractAgentId(name){
  const m = AGENT_ID_RE.exec(String(name||''));
  return m ? m[1].toUpperCase() : null;
}

// Parse dates FR "DD/MM/YYYY" ou "DD/MM/YYYY HH:MM" -> Date
function parseFRDate(s){
  if (!s) return null;
  const str = String(s).trim();
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (!m) return null;
  const [, d, mo, y, h, mi] = m;
  return new Date(+y, +mo-1, +d, h?+h:0, mi?+mi:0);
}
function dateKey(d){ // yyyy-mm-dd local
  if (!d) return null;
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function mondayOf(d){
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (dt.getDay()+6)%7; // 0=lundi
  dt.setDate(dt.getDate()-day);
  return dt;
}
function weekKey(d){ const m = mondayOf(d); return dateKey(m); }
function monthKey(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'); }

// Convertit une durée texte "H:MM" ou "HH:MM:SS" en secondes (colonnes RTT type "Durée d'appel sortant (hh:mm)")
function parseHHMMToSeconds(s){
  if (s===null || s===undefined || s==='') return 0;
  const str = String(s).trim();
  const m = str.match(/^(\d{1,3}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return toNum(s);
  const h = +m[1], mi = +m[2], se = m[3]?+m[3]:0;
  return h*3600 + mi*60 + se;
}

/* ---------- Jours fériés légaux français (11 jours) ---------- */
function easterSunday(year){
  // Algorithme de Gauss / Meeus
  const a = year % 19, b = Math.floor(year/100), c = year % 100;
  const d = Math.floor(b/4), e = b%4, f = Math.floor((b+8)/25);
  const g = Math.floor((b-f+1)/3), h = (19*a+b-d-g+15)%30;
  const i = Math.floor(c/4), k = c%4, l = (32+2*e+2*i-h-k)%7;
  const m = Math.floor((a+11*h+22*l)/451);
  const month = Math.floor((h+l-7*m+114)/31);
  const day = ((h+l-7*m+114)%31)+1;
  return new Date(year, month-1, day);
}
function frenchHolidays(year){
  const easter = easterSunday(year);
  const addDays = (d,n) => { const nd=new Date(d); nd.setDate(nd.getDate()+n); return nd; };
  return [
    new Date(year,0,1),            // Jour de l'an
    addDays(easter,1),             // Lundi de Pâques
    new Date(year,4,1),            // Fête du travail
    new Date(year,4,8),            // Victoire 1945
    addDays(easter,39),            // Ascension
    addDays(easter,50),            // Lundi de Pentecôte
    new Date(year,6,14),           // Fête nationale
    new Date(year,7,15),           // Assomption
    new Date(year,10,1),           // Toussaint
    new Date(year,10,11),          // Armistice
    new Date(year,11,25),          // Noël
  ].map(dateKey);
}
const HOLIDAY_CACHE = {};
function isHolidayOrWeekend(d){
  if (!d) return false;
  const day = d.getDay();
  if (day===0 || day===6) return true;
  const y = d.getFullYear();
  if (!HOLIDAY_CACHE[y]) HOLIDAY_CACHE[y] = frenchHolidays(y);
  return HOLIDAY_CACHE[y].includes(dateKey(d));
}

function fmtMoney(n){ return (n||0).toLocaleString('fr-FR', {minimumFractionDigits:0, maximumFractionDigits:0}) + ' €'; }
function fmtMoney2(n){ return (n||0).toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €'; }
function fmtNum(n, d=1){ return (n||0).toLocaleString('fr-FR', {minimumFractionDigits:d, maximumFractionDigits:d}); }
function fmtPct(n){ return ((n||0)*100).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1}) + ' %'; }
function fmtDurationSec(sec){
  sec = Math.round(sec||0);
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
  if (h>0) return h+'h '+String(m).padStart(2,'0')+'min';
  return m+'min '+String(s).padStart(2,'0')+'s';
}
function fmtHours(sec){ return fmtNum(sec/3600,1)+' h'; }

/* ============================= PARSING FICHIERS ============================= */

async function readFileAsArrayBuffer(file){
  return new Promise((resolve,reject)=>{
    const r = new FileReader();
    r.onload = ()=>resolve(r.result);
    r.onerror = reject;
    r.readAsArrayBuffer(file);
  });
}

function parseHtmlTableText(text){
  const doc = new DOMParser().parseFromString(text, 'text/html');
  const table = doc.querySelector('table');
  if (!table) return {headers:[], rows:[]};
  const trs = Array.from(table.querySelectorAll('tr'));
  if (!trs.length) return {headers:[], rows:[]};
  const headerCells = Array.from(trs[0].querySelectorAll('th,td'));
  const headers = headerCells.map(c => normHeader(c.textContent));
  const rows = [];
  for (let i=1;i<trs.length;i++){
    const cells = Array.from(trs[i].querySelectorAll('td,th'));
    if (!cells.length) continue;
    const obj = {};
    headers.forEach((h,idx)=>{ obj[h] = cells[idx] ? cells[idx].textContent.trim() : ''; });
    rows.push(obj);
  }
  return {headers, rows};
}

async function parseAnyTabularFile(file){
  const buf = await readFileAsArrayBuffer(file);
  const bytes = new Uint8Array(buf);
  // Détection: xlsx = zip signature "PK"; sinon on tente HTML (encodage windows-1252 fréquent pour les exports Vonage)
  const isZip = bytes.length>1 && bytes[0]===0x50 && bytes[1]===0x4B;
  if (isZip || /\.xlsx?$/i.test(file.name) && !isHtmlSniff(bytes)){
    if (isZip){
      const wb = XLSX.read(buf, {type:'array'});
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, {defval:''});
      const headers = json.length ? Object.keys(json[0]) : [];
      return {headers, rows: json};
    }
  }
  const text = new TextDecoder('windows-1252').decode(buf);
  return parseHtmlTableText(text);
}
function isHtmlSniff(bytes){
  const head = new TextDecoder('ascii').decode(bytes.slice(0,200)).toLowerCase();
  return head.includes('<html') || head.includes('<table') || head.includes('<!doctype') || head.includes('<head');
}

/* ============================= NORMALISATION DES JEUX DE DONNEES ============================= */

function normalizeEntrantRows(headers, rows){
  const cQueue = findCol(headers, ["nom de la file d'attente"]);
  const cRepondu = findCol(headers, ['répondu','repondu']);
  const cAgent = findCol(headers, ["agent: nom complet","agent : nom complet"]);
  const cComm = findCol(headers, ['durée de communication']);
  const cAttente = findCol(headers, ['durée de mise en attente (consultation)','durée de mise en attente']);
  const cACW = findCol(headers, ['after call work time']);
  const cTraitement = findCol(headers, ['temps de traitement']);
  const cDate = findCol(headers, ['date de création','date de creation']);
  return rows.map(r => ({
    type: 'in',
    queue: cQueue ? r[cQueue] : '',
    repondu: cRepondu ? toNum(r[cRepondu]) : 1,
    agentRaw: cAgent ? String(r[cAgent]||'') : '',
    agentId: extractAgentId(cAgent ? r[cAgent] : ''),
    duree_comm: cComm ? toNum(r[cComm]) : 0,
    duree_attente: cAttente ? toNum(r[cAttente]) : 0,
    acw: cACW ? toNum(r[cACW]) : 0,
    temps_traitement: cTraitement ? toNum(r[cTraitement]) : 0,
    date: cDate ? parseFRDate(r[cDate]) : null,
  })).filter(r => r.date);
}

function normalizeSortantRows(headers, rows){
  const cRepondu = findCol(headers, ['répondu','repondu']);
  const cAgent = findCol(headers, ["agent: nom complet","agent : nom complet"]);
  const cACW = findCol(headers, ['after call work time']);
  const cDuree = findCol(headers, ["durée totale de l'appel"]);
  const cDate = findCol(headers, ['date de création','date de creation']);
  return rows.map(r => ({
    type: 'out',
    repondu: cRepondu ? toNum(r[cRepondu]) : 1,
    agentRaw: cAgent ? String(r[cAgent]||'') : '',
    agentId: extractAgentId(cAgent ? r[cAgent] : ''),
    acw: cACW ? toNum(r[cACW]) : 0,
    duree: cDuree ? toNum(r[cDuree]) : 0,
    date: cDate ? parseFRDate(r[cDate]) : null,
  })).filter(r => r.date);
}

function normalizeMailRows(headers, rows){
  // Règle glossaire KPI : agent = "Créé par : Nom complet" (col. K), acte compté seulement si
  // "Email client Sortant" (col. L) = 1 (mail effectivement traité/répondu par l'agent).
  const cAgent = findCol(headers, ['créé par: nom complet','créé par : nom complet']);
  const cDate = findCol(headers, ['date du message']);
  const cStatut = findCol(headers, ['statut']);
  const cTraite = findCol(headers, ['email client sortant']);
  return rows.map(r => ({
    type: 'mail',
    agentRaw: cAgent ? String(r[cAgent]||'') : '',
    agentId: extractAgentId(cAgent ? r[cAgent] : ''),
    statut: cStatut ? r[cStatut] : '',
    traite: cTraite ? toNum(r[cTraite])===1 : false,
    date: cDate ? parseFRDate(r[cDate]) : null,
  })).filter(r => r.date);
}

function normalizeRttRows(headers, rows){
  const cAgent = findCol(headers, ['vonage agent summary : nom du propriétaire','nom du propriétaire']);
  const cLog = findCol(headers, ['durée totale de connexion']);
  const cDispo = findCol(headers, ['temps de dispo']);
  const cPauseCafe = findCol(headers, ['pause cafe','pause café']);
  const cAssistance = findCol(headers, ['assistance']);
  const cBrief = findCol(headers, ['brief']);
  const cChat = findCol(headers, ['chat']);
  const cConnexion = findCol(headers, ['connexion']);
  const cDejeuner = findCol(headers, ['dejeuner','déjeuner']);
  const cFormation = findCol(headers, ['formation']);
  const cPanier = findCol(headers, ['panier']);
  const cSensible = findCol(headers, ['sensible']);
  const cReunion = findCol(headers, ['reunion','réunion']);
  const cPaypal = findCol(headers, ['paypal']);
  const cRbtManuel = findCol(headers, ['rbt manuel']);
  const cFintecture = findCol(headers, ['fintecture']);
  const cGoodays = findCol(headers, ['goodays']);
  const cApSortantHHMM = findCol(headers, ["durée d'appel sortant"]);
  const cCommunication = findCol(headers, ['durée de communication']);
  const cMiseEnAttente = findCol(headers, ['durée de mise en attente']);
  const cDate = findCol(headers, ['date locale']);
  const RETRAIT_COLS = [cPauseCafe,cAssistance,cBrief,cChat,cConnexion,cDejeuner,cFormation,cSensible,cReunion,cPaypal,cRbtManuel,cFintecture,cGoodays];
  return rows.map(r => ({
    agentRaw: cAgent ? String(r[cAgent]||'') : '',
    agentId: extractAgentId(cAgent ? r[cAgent] : ''),
    temps_log: cLog ? toNum(r[cLog]) : 0,
    temps_dispo: cDispo ? toNum(r[cDispo]) : 0,
    pause_cafe: cPauseCafe ? toNum(r[cPauseCafe]) : 0,
    brief: cBrief ? toNum(r[cBrief]) : 0,
    panier: cPanier ? toNum(r[cPanier]) : 0,
    retrait_detail: RETRAIT_COLS.reduce((s,c)=> s + (c ? toNum(r[c]) : 0), 0),
    communication: cCommunication ? toNum(r[cCommunication]) : 0,
    mise_en_attente: cMiseEnAttente ? toNum(r[cMiseEnAttente]) : 0,
    appel_sortant_sec: cApSortantHHMM ? parseHHMMToSeconds(r[cApSortantHHMM]) : 0,
    date: cDate ? parseFRDate(r[cDate]) : null,
  })).filter(r => r.date);
}

/* ============================= REFERENTIELS ============================= */

function buildFluxMap(){
  const m = {};
  STATE.ref.flux.forEach(r => { m[normHeader(r.queue).toUpperCase()] = r.acte; });
  return m;
}
function buildEquipeMap(){
  const m = {};
  STATE.ref.equipes.forEach(r => { m[r.id.toUpperCase()] = r.name; });
  return m;
}
function buildAgentManagerMap(){
  const m = {};
  STATE.ref.equipes.forEach(r => { m[r.id.toUpperCase()] = r.manager || ''; });
  return m;
}
function buildTarifMap(){
  const m = {};
  STATE.ref.tarifs.forEach(r => {
    m[r.type.toUpperCase()] = {normal:r.normal, ferie:r.ferie, flux:r.flux};
  });
  return m;
}

/* ============================= ENRICHISSEMENT / FILTRAGE ============================= */

function getMadaIds(){ return new Set(STATE.ref.equipes.map(e => e.id.toUpperCase())); }

function collectWarnings(){
  const fluxMap = buildFluxMap();
  const madaIds = getMadaIds();
  const unmappedQueues = new Map();
  const foreignAgents = new Set();

  STATE.raw.entrant.forEach(r=>{
    if (r.agentId && madaIds.has(r.agentId)){
      const acte = fluxMap[normHeader(r.queue).toUpperCase()];
      if (!acte) unmappedQueues.set(r.queue, (unmappedQueues.get(r.queue)||0)+1);
    }
  });
  [...STATE.raw.entrant, ...STATE.raw.sortant, ...STATE.raw.mails].forEach(r=>{
    if (r.agentId && !madaIds.has(r.agentId)) foreignAgents.add(r.agentId);
  });
  return {unmappedQueues, foreignAgentsCount: foreignAgents.size};
}

// Repère les identifiants agent présents dans les imports mais absents de la répartition d'équipes Mada.
function detectMissingAgents(){
  const known = getMadaIds();
  const found = new Map(); // id -> nom proposé
  [...STATE.raw.entrant, ...STATE.raw.sortant, ...STATE.raw.mails].forEach(r=>{
    if (r.agentId && !known.has(r.agentId) && !found.has(r.agentId)){
      const name = normHeader(String(r.agentRaw||'').replace(/TER_PST\d+_\d+/i,'')).trim();
      found.set(r.agentId, name || r.agentId);
    }
  });
  return found;
}

function priceFor(acte, isFerie, tarifMap){
  const t = tarifMap[String(acte).toUpperCase()];
  if (!t) return null;
  return isFerie ? t.ferie : t.normal;
}

// Fonctions d'enrichissement par source — réutilisées pour le calcul local ET pour la
// synchronisation Firestore (elles peuvent être appliquées à un sous-ensemble de lignes,
// par ex. seulement celles d'un fichier qui vient d'être importé).
function enrichEntrantRows(rows, fluxMap, tarifMap, madaIds, equipeMap){
  const out = [];
  rows.forEach(r=>{
    if (!r.agentId || !madaIds.has(r.agentId) || !r.repondu) return;
    const acteType = fluxMap[normHeader(r.queue).toUpperCase()];
    const ferie = isHolidayOrWeekend(r.date);
    const prix = acteType ? priceFor(acteType, ferie, tarifMap) : null;
    out.push({
      cat:'in', agentId:r.agentId, agentName:equipeMap[r.agentId]||r.agentId, date:r.date,
      ca: prix||0, tarife: prix!==null,
      // DMT = (durée de communication + After Call Work + mise en attente) en secondes / nb d'appels traités.
      dmt_num: r.duree_comm + r.acw + r.duree_attente, acw: r.acw, mea: r.duree_attente,
    });
  });
  return out;
}
function enrichSortantRows(rows, tarifMap, madaIds, equipeMap){
  // Règle glossaire KPI : "Appels sortants" = nb de lignes avec un agent en colonne D — sans filtre sur "Répondu".
  const out = [];
  rows.forEach(r=>{
    if (!r.agentId || !madaIds.has(r.agentId)) return;
    const ferie = isHolidayOrWeekend(r.date);
    const prix = priceFor('Appels sortants', ferie, tarifMap);
    out.push({
      cat:'out', agentId:r.agentId, agentName:equipeMap[r.agentId]||r.agentId, date:r.date,
      ca: prix||0, tarife: prix!==null,
      dmt_num: r.duree + r.acw, acw: r.acw, mea: 0,
    });
  });
  return out;
}
function enrichMailRows(rows, tarifMap, madaIds, equipeMap){
  // Règle glossaire KPI : agent = "Créé par: Nom complet" (col. K), compté seulement si
  // "Email client Sortant" (col. L) = 1.
  const out = [];
  rows.forEach(r=>{
    if (!r.agentId || !madaIds.has(r.agentId) || !r.traite) return;
    const ferie = isHolidayOrWeekend(r.date);
    const prix = priceFor('Mails', ferie, tarifMap);
    out.push({
      cat:'mail', agentId:r.agentId, agentName:equipeMap[r.agentId]||r.agentId, date:r.date,
      ca: prix||0, tarife: prix!==null,
      dmt_num: 0, acw: 0, mea: 0,
    });
  });
  return out;
}

// Construit la liste d'évènements "actes" enrichis pour Mada (avec CA, dates, agent, type)
function buildActesMada(){
  const fluxMap = buildFluxMap();
  const tarifMap = buildTarifMap();
  const madaIds = getMadaIds();
  const equipeMap = buildEquipeMap();
  return [
    ...enrichEntrantRows(STATE.raw.entrant, fluxMap, tarifMap, madaIds, equipeMap),
    ...enrichSortantRows(STATE.raw.sortant, tarifMap, madaIds, equipeMap),
    ...enrichMailRows(STATE.raw.mails, tarifMap, madaIds, equipeMap),
  ];
}

function buildRttMada(){
  const madaIds = getMadaIds();
  const equipeMap = buildEquipeMap();
  return STATE.raw.rtt.filter(r => r.agentId && madaIds.has(r.agentId)).map(r=>({
    ...r, agentName: equipeMap[r.agentId]||r.agentId,
  }));
}

/* ---------- Filtres actifs ---------- */
function getFilters(){
  const from = document.getElementById('filterFrom').value;
  const to = document.getElementById('filterTo').value;
  const agent = document.getElementById('filterAgent').value;
  const acte = document.getElementById('filterActe').value;
  const manager = document.getElementById('filterManager').value;
  const gran = document.querySelector('#segGranularite button.active').dataset.g;
  return {
    from: from ? new Date(from+'T00:00:00') : null,
    to: to ? new Date(to+'T23:59:59') : null,
    agent, acte, manager, gran,
  };
}
function inRange(date, f){
  if (f.from && date < f.from) return false;
  if (f.to && date > f.to) return false;
  return true;
}
function agentMatchesManager(agentId, managerFilter, managerMap){
  if (managerFilter==='all') return true;
  const mgr = managerMap[String(agentId).toUpperCase()] || '';
  if (managerFilter==='__unassigned__') return !mgr;
  return mgr === managerFilter;
}

function filteredActes(f){
  const managerMap = buildAgentManagerMap();
  return buildActesMada().filter(a=>{
    if (!inRange(a.date, f)) return false;
    if (f.agent!=='all' && a.agentId!==f.agent) return false;
    if (f.acte!=='all' && a.cat!==f.acte) return false;
    if (!agentMatchesManager(a.agentId, f.manager, managerMap)) return false;
    return true;
  });
}
function filteredRtt(f){
  const managerMap = buildAgentManagerMap();
  return buildRttMada().filter(r=>{
    if (!inRange(r.date, f)) return false;
    if (f.agent!=='all' && r.agentId!==f.agent) return false;
    if (!agentMatchesManager(r.agentId, f.manager, managerMap)) return false;
    return true;
  });
}

/* ============================= CALCUL DES KPI ============================= */

function computeKPIs(actes, rtt){
  const ca = actes.reduce((s,a)=>s+a.ca,0);
  const nbActes = actes.length;
  const nbMail = actes.filter(a=>a.cat==='mail').length;
  const nbIn = actes.filter(a=>a.cat==='in').length;
  const nbOut = actes.filter(a=>a.cat==='out').length;

  const calls = actes.filter(a=>a.cat==='in'||a.cat==='out');
  const dmtTotal = calls.reduce((s,a)=>s+a.dmt_num,0);
  const dmt = calls.length ? dmtTotal/calls.length : 0;

  // Règle glossaire KPI : ACW = uniquement sur les appels entrants (source = "Appels entrants").
  const inCalls = actes.filter(a=>a.cat==='in');
  const acwTotal = inCalls.reduce((s,a)=>s+a.acw,0);
  const acw = inCalls.length ? acwTotal/inCalls.length : 0;
  const meaTotal = inCalls.reduce((s,a)=>s+a.mea,0);
  const mea = inCalls.length ? meaTotal/inCalls.length : 0;

  const tempsLog = rtt.reduce((s,r)=>s+r.temps_log,0);
  const tempsDispo = rtt.reduce((s,r)=>s+r.temps_dispo,0);
  const retraitDetailTotal = rtt.reduce((s,r)=>s+r.retrait_detail,0);
  const panierTotal = rtt.reduce((s,r)=>s+r.panier,0);
  const pauseCafeTotal = rtt.reduce((s,r)=>s+r.pause_cafe,0);
  const briefTotal = rtt.reduce((s,r)=>s+r.brief,0);
  // Règle glossaire KPI : Taux d'occupation = (communication + mise en attente + panier + durée appel sortant) / Log
  const occupationNumTotal = rtt.reduce((s,r)=>s+r.communication+r.mise_en_attente+r.panier+r.appel_sortant_sec,0);

  const tempsLogH = tempsLog/3600;
  const caH = tempsLogH>0 ? ca/tempsLogH : 0;
  const prodH = tempsLogH>0 ? nbActes/tempsLogH : 0;

  const tauxDispo = tempsLog>0 ? tempsDispo/tempsLog : 0;
  const tauxRetrait = tempsLog>0 ? retraitDetailTotal/tempsLog : 0;
  const tauxOcc = tempsLog>0 ? occupationNumTotal/tempsLog : 0;
  const tauxPanier = tempsLog>0 ? panierTotal/tempsLog : 0;
  const tauxPause = tempsLog>0 ? pauseCafeTotal/tempsLog : 0;
  const tauxBrief = tempsLog>0 ? briefTotal/tempsLog : 0;

  const nonTarifes = actes.filter(a=>!a.tarife).length;

  return {ca, nbActes, nbMail, nbIn, nbOut, dmt, acw, mea, tempsLog, tempsLogH, caH, prodH,
    tauxOcc, tauxDispo, tauxRetrait, tauxPanier, tauxPause, tauxBrief, nonTarifes};
}

function bucketKey(date, gran){
  if (gran==='week') return weekKey(date);
  if (gran==='month') return monthKey(date);
  return dateKey(date);
}
function bucketLabel(key, gran){
  if (gran==='month'){ const [y,m]=key.split('-'); return m+'/'+y.slice(2); }
  const [y,m,d]=key.split('-');
  if (gran==='week') return 'sem. '+d+'/'+m;
  return d+'/'+m;
}

function timeSeries(actes, rtt, gran){
  const buckets = new Map();
  const ensure = k => { if (!buckets.has(k)) buckets.set(k, {actes:[], rtt:[]}); return buckets.get(k); };
  actes.forEach(a => ensure(bucketKey(a.date, gran)).actes.push(a));
  rtt.forEach(r => ensure(bucketKey(r.date, gran)).rtt.push(r));
  const keys = Array.from(buckets.keys()).sort();
  return keys.map(k=>{
    const kpi = computeKPIs(buckets.get(k).actes, buckets.get(k).rtt);
    return {key:k, label: bucketLabel(k, gran), ...kpi};
  });
}

/* ============================= RENDU KPI CARDS ============================= */

const KPI_DEFS = [
  {key:'ca', label:'Chiffre d\'affaires', fmt: fmtMoney, sub:()=> 'Sur la période sélectionnée'},
  {key:'tempsLog', label:'Temps de log', fmt: fmtHours, raw:true, sub:k=>fmtDurationSec(k.tempsLog)},
  {key:'caH', label:'CA / Heure', fmt: fmtMoney2, sub:()=>'CA rapporté au temps de log'},
  {key:'dmt', label:'DMT', fmt: v=>fmtDurationSec(v), sub:()=>'Durée moyenne de traitement / appel'},
  {key:'acw', label:'ACW', fmt: v=>fmtDurationSec(v), sub:()=>'After Call Work moyen / appel entrant'},
  {key:'mea', label:'MEA', fmt: v=>fmtDurationSec(v), sub:()=>'Mise en attente moyenne / appel entrant'},
  {key:'nbActes', label:'Actes traités', fmt: v=>fmtNum(v,0), sub:k=>`${k.nbMail} mails · ${k.nbIn} entrants · ${k.nbOut} sortants`},
  {key:'nbMail', label:'Mails traités', fmt: v=>fmtNum(v,0), sub:k=>k.nbActes ? fmtPct(k.nbMail/k.nbActes)+' des actes' : '—'},
  {key:'nbIn', label:'Appels entrants', fmt: v=>fmtNum(v,0), sub:k=>k.nbActes ? fmtPct(k.nbIn/k.nbActes)+' des actes' : '—'},
  {key:'nbOut', label:'Appels sortants', fmt: v=>fmtNum(v,0), sub:k=>k.nbActes ? fmtPct(k.nbOut/k.nbActes)+' des actes' : '—'},
  {key:'prodH', label:'Productivité horaire', fmt: v=>fmtNum(v,2)+' actes/h', sub:()=>'Actes traités / heure de log'},
  {key:'tauxOcc', label:"Taux d'occupation", fmt: fmtPct, sub:()=>'(Communication + attente + panier + appel sortant) / Log', status:v=> v>=0.8?'good': v>=0.65?'warn':'crit'},
];

const KPI_DEFS_RTT = [
  {key:'tauxDispo', label:'Temps de disponibilité', fmt: fmtPct, sub:()=>'Temps de dispo / Temps de log'},
  {key:'tauxRetrait', label:'Taux de retrait', fmt: fmtPct, sub:()=>'Pause, brief, assistance, réunion… / Log', status:v=> v<=0.15?'good': v<=0.25?'warn':'crit'},
  {key:'tauxPanier', label:'Taux panier', fmt: fmtPct, sub:()=>'Panier / Temps de log'},
  {key:'tauxPause', label:'Taux pause', fmt: fmtPct, sub:()=>'Pause café / Temps de log'},
  {key:'tauxBrief', label:'Taux brief', fmt: fmtPct, sub:()=>'Brief / Temps de log'},
];

function renderKpiGridInto(gridId, defs, kpi){
  const grid = document.getElementById(gridId);
  grid.innerHTML = '';
  defs.forEach(def=>{
    const val = kpi[def.key];
    const div = document.createElement('div');
    div.className = 'card kpi';
    if (def.status) div.classList.add('status-'+def.status(val));
    div.innerHTML = `<div class="accent"></div>
      <div class="lbl">${def.label}</div>
      <div class="val">${def.fmt(val)}</div>
      <div class="sub">${def.sub(kpi)}</div>`;
    grid.appendChild(div);
  });
}

/* ============================= GRAPHIQUES ============================= */

function cssVar(name){ return getComputedStyle(document.body).getPropertyValue(name).trim(); }

function ensureChart(id, config){
  const ctx = document.getElementById(id);
  if (STATE.charts[id]) { STATE.charts[id].destroy(); }
  STATE.charts[id] = new Chart(ctx, config);
  return STATE.charts[id];
}

function baseLineOptions(yTickFmt){
  return {
    responsive:true, maintainAspectRatio:false,
    interaction:{mode:'index', intersect:false},
    plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>yTickFmt(c.parsed.y)}} },
    scales:{
      x:{ grid:{display:false}, ticks:{color:cssVar('--muted'), font:{size:11}} },
      y:{ grid:{color:cssVar('--border')}, ticks:{color:cssVar('--muted'), font:{size:11}, callback:v=>yTickFmt(v)} },
    }
  };
}

function renderCharts(series, kpiTotal, agentRows){
  const brand = cssVar('--brand'), brandInk = cssVar('--brand-ink');
  const catMail = cssVar('--cat-mail'), catIn = cssVar('--cat-in'), catOut = cssVar('--cat-out');
  const good = cssVar('--good'), warn = cssVar('--warn'), crit = cssVar('--crit');

  ensureChart('chartCaH', {
    type:'line',
    data:{ labels: series.map(s=>s.label), datasets:[{
      data: series.map(s=>Math.round(s.caH*100)/100), borderColor: brand, backgroundColor: brand+'22',
      borderWidth:2, tension:.3, fill:true, pointRadius:3, pointBackgroundColor:brand,
    }]},
    options: baseLineOptions(v=>fmtMoney2(v)),
  });

  ensureChart('chartProd', {
    type:'line',
    data:{ labels: series.map(s=>s.label), datasets:[{
      data: series.map(s=>Math.round(s.prodH*100)/100), borderColor: brandInk, backgroundColor: brandInk+'22',
      borderWidth:2, tension:.3, fill:true, pointRadius:3, pointBackgroundColor:brandInk,
    }]},
    options: baseLineOptions(v=>fmtNum(v,2)+' actes/h'),
  });

  const totalActes = kpiTotal.nbMail+kpiTotal.nbIn+kpiTotal.nbOut;
  ensureChart('chartRepartition', {
    type:'doughnut',
    data:{ labels:['Mail','Appel entrant','Appel sortant'],
      datasets:[{ data:[kpiTotal.nbMail, kpiTotal.nbIn, kpiTotal.nbOut],
        backgroundColor:[catMail, catIn, catOut], borderColor: cssVar('--surface'), borderWidth:2 }]},
    options:{ responsive:true, maintainAspectRatio:false, cutout:'62%',
      plugins:{ legend:{position:'bottom', labels:{color:cssVar('--text-2'), font:{size:11.5}, boxWidth:9, boxHeight:9, usePointStyle:true, pointStyle:'circle'}},
        tooltip:{ callbacks:{ label:c=> `${c.label}: ${c.parsed} (${totalActes? fmtNum(c.parsed/totalActes*100,1):0}%)` } } } }
  });

  ensureChart('chartOccupation', {
    type:'line',
    data:{ labels: series.map(s=>s.label), datasets:[
      { data: series.map(s=>Math.round(s.tauxOcc*1000)/10), borderColor: brand, backgroundColor: brand+'1a',
        borderWidth:2, tension:.3, fill:true, pointRadius:3,
        pointBackgroundColor: series.map(s=> s.tauxOcc>=0.8?good: s.tauxOcc>=0.65?warn:crit) },
      { data: series.map(()=>80), borderColor: cssVar('--muted'), borderWidth:1, borderDash:[5,4], pointRadius:0, fill:false },
    ]},
    options:{ ...baseLineOptions(v=>fmtNum(v,1)+' %'), plugins:{legend:{display:false}, tooltip:{callbacks:{label:c=>c.datasetIndex===1?'Objectif 80%':fmtNum(c.parsed.y,1)+' %'}}} },
  });

  const top = agentRows.slice().sort((a,b)=>b.caH-a.caH).slice(0,12);
  ensureChart('chartAgents', {
    type:'bar',
    data:{ labels: top.map(a=>a.name),
      datasets:[{ data: top.map(a=>Math.round(a.caH*100)/100), backgroundColor: brand, borderRadius:4, maxBarThickness:22 }]},
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>fmtMoney2(c.parsed.x)+' / h'}} },
      scales:{ x:{ grid:{color:cssVar('--border')}, ticks:{color:cssVar('--muted'), font:{size:11}, callback:v=>fmtMoney2(v)} },
                y:{ grid:{display:false}, ticks:{color:cssVar('--text-2'), font:{size:11.5}} } } }
  });
}

/* ============================= TABLE DETAIL AGENTS ============================= */

function agentBreakdown(actes, rtt){
  const managerMap = buildAgentManagerMap();
  const map = new Map();
  const ensure = (id,name) => { if (!map.has(id)) map.set(id, {id, name, actes:[], rtt:[]}); return map.get(id); };
  actes.forEach(a=> ensure(a.agentId, a.agentName).actes.push(a));
  rtt.forEach(r=> ensure(r.agentId, r.agentName).rtt.push(r));
  const rows = [];
  map.forEach(v=>{
    const k = computeKPIs(v.actes, v.rtt);
    rows.push({ id:v.id, name:v.name, manager: managerMap[String(v.id).toUpperCase()] || '',
      ca:k.ca, log:k.tempsLog, caH:k.caH, dmt:k.dmt, acw:k.acw, mea:k.mea, actes:k.nbActes,
      nbMail:k.nbMail, nbIn:k.nbIn, nbOut:k.nbOut, prod:k.prodH, occ:k.tauxOcc,
      dispo:k.tauxDispo, retrait:k.tauxRetrait, panier:k.tauxPanier, pause:k.tauxPause, brief:k.tauxBrief });
  });
  return rows;
}

function renderAgentTable(rows){
  const tbody = document.querySelector('#tableAgentDetail tbody');
  const search = STATE.agentSearch;
  const filtered = search ? rows.filter(r => (r.name||'').toLowerCase().includes(search) || (r.manager||'').toLowerCase().includes(search) || (r.id||'').toLowerCase().includes(search)) : rows;
  const {key, dir} = STATE.sort;
  const sorted = filtered.slice().sort((a,b)=> (a[key]>b[key]?1:a[key]<b[key]?-1:0)*dir);
  if (!sorted.length){ tbody.innerHTML = '<tr><td colspan="19" class="emptystate">Aucune donnée pour ces filtres</td></tr>'; return; }
  tbody.innerHTML = sorted.map(r=>`<tr>
    <td>${escapeHtml(r.name)}</td><td>${r.manager?escapeHtml(r.manager):'<span class="smallmuted">—</span>'}</td>
    <td>${fmtMoney2(r.ca)}</td><td>${fmtDurationSec(r.log)}</td>
    <td>${fmtMoney2(r.caH)}</td><td>${fmtDurationSec(r.dmt)}</td><td>${fmtDurationSec(r.acw)}</td>
    <td>${fmtDurationSec(r.mea)}</td><td>${r.actes}</td><td>${r.nbMail||0}</td><td>${r.nbIn||0}</td><td>${r.nbOut||0}</td>
    <td>${fmtNum(r.prod,2)}</td><td>${fmtPct(r.occ)}</td>
    <td>${fmtPct(r.dispo)}</td><td>${fmtPct(r.retrait)}</td><td>${fmtPct(r.panier)}</td><td>${fmtPct(r.pause)}</td><td>${fmtPct(r.brief)}</td>
  </tr>`).join('');
}

/* ============================= ALERTES QUALITE DONNEE ============================= */

function renderWarnings(){
  const w = collectWarnings();
  const el = document.getElementById('warnContent');
  const items = [];
  if (w.unmappedQueues.size){
    const list = Array.from(w.unmappedQueues.entries()).map(([q,c])=>`<li>${q} — ${c} appel(s) sans tarif (non mappée dans le référentiel flux ou absente de la grille Mada)</li>`).join('');
    items.push(`<div class="warnbox card" style="margin-bottom:8px;"><h4>Files d'attente non tarifées</h4><ul>${list}</ul></div>`);
  }
  if (w.foreignAgentsCount){
    items.push(`<div class="warnbox card"><h4>Agents hors référentiel Mada</h4><p>${w.foreignAgentsCount} identifiant(s) agent présents dans les imports mais absents de la répartition d'équipes Mada — leurs actes sont exclus du calcul. Utilise le bouton « Détecter les agents manquants » dans Référentiels → Répartition équipes pour les ajouter et leur assigner un manager.</p></div>`);
  }
  el.innerHTML = items.length ? items.join('') : 'Aucune alerte — toutes les files et tous les agents identifiés sont correctement référencés.';
}

/* ============================= RENDU PRINCIPAL DASHBOARD ============================= */

function refreshDashboard(){
  const f = getFilters();
  const actes = filteredActes(f);
  const rtt = filteredRtt(f);
  const kpi = computeKPIs(actes, rtt);
  // Chaque étape de rendu est isolée : si l'une d'elles échoue (ex. un graphique qui plante),
  // les autres continuent de s'exécuter — en particulier populateManagerFilter/populateAgentFilter
  // en fin de fonction, qui doivent TOUJOURS tourner sous peine de figer les filtres Manager/Agent.
  try{ renderKpiGridInto('kpiGrid', KPI_DEFS, kpi); }catch(e){ console.error('renderKpiGridInto(kpiGrid) a échoué', e); }
  try{ renderKpiGridInto('kpiGridRtt', KPI_DEFS_RTT, kpi); }catch(e){ console.error('renderKpiGridInto(kpiGridRtt) a échoué', e); }
  let agentRows = [];
  try{
    const series = timeSeries(actes, rtt, f.gran);
    agentRows = agentBreakdown(actes, rtt);
    STATE.lastAgentRows = agentRows;
    renderCharts(series, kpi, agentRows);
  }catch(e){ console.error('renderCharts a échoué', e); }
  try{ renderAgentTable(agentRows); }catch(e){ console.error('renderAgentTable a échoué', e); }
  try{ renderWarnings(); }catch(e){ console.error('renderWarnings a échoué', e); }
  populateManagerFilter();
  populateAgentFilter();
}

function populateManagerFilter(){
  const sel = document.getElementById('filterManager');
  const current = sel.value;
  const managers = Array.from(new Set(STATE.ref.equipes.map(e=>e.manager).filter(Boolean))).sort((a,b)=>a.localeCompare(b));
  const hasUnassigned = STATE.ref.equipes.some(e=>!e.manager);
  let html = '<option value="all">Tous les managers</option>' + managers.map(m=>`<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');
  if (hasUnassigned) html += '<option value="__unassigned__">Non affecté</option>';
  sel.innerHTML = html;
  sel.value = current && Array.from(sel.options).some(o=>o.value===current) ? current : 'all';
}

function populateAgentFilter(){
  const sel = document.getElementById('filterAgent');
  const current = sel.value;
  const managerFilter = document.getElementById('filterManager').value;
  let equipes = STATE.ref.equipes.slice();
  if (managerFilter !== 'all'){
    equipes = equipes.filter(e => managerFilter==='__unassigned__' ? !e.manager : e.manager===managerFilter);
  }
  equipes.sort((a,b)=>(a.name||a.id).localeCompare(b.name||b.id));
  sel.innerHTML = '<option value="all">Tous les agents</option>' + equipes.map(e=>`<option value="${e.id}">${escapeHtml(e.name||e.id)}</option>`).join('');
  sel.value = current && Array.from(sel.options).some(o=>o.value===current) ? current : 'all';
}

/* ============================= IMPORT UI ============================= */

const IMPORT_META = {
  entrant: {label:'Appels entrants', normalize: normalizeEntrantRows},
  sortant: {label:'Appels sortants', normalize: normalizeSortantRows},
  mails:   {label:'Mails traités', normalize: normalizeMailRows},
  rtt:     {label:'Temps de log (RTT)', normalize: normalizeRttRows},
};

async function handleFileForKey(key, file){
  const meta = IMPORT_META[key];
  const statusEl = document.getElementById('status-'+key);
  statusEl.textContent = 'Lecture en cours…';
  statusEl.classList.remove('empty');
  try{
    const {headers, rows} = await parseAnyTabularFile(file);
    const normalized = meta.normalize(headers, rows);
    STATE.raw[key] = STATE.raw[key].concat(normalized);
    statusEl.textContent = `${file.name} — ${normalized.length} lignes`;
    const dates = normalized.map(r=>r.date).filter(Boolean).sort((a,b)=>a-b);
    const period = dates.length ? `${dateKey(dates[0])} → ${dateKey(dates[dates.length-1])}` : '—';
    STATE.importLog.unshift({file:file.name, type:meta.label, count:normalized.length, period, status:'OK'});
    updateImportLogTable();
    updateLastUpdateMeta();
    refreshDashboard();
    if (window.syncImportToFirestore) window.syncImportToFirestore(key, normalized, file.name);
    if (window.logImportHistory) window.logImportHistory({ fileName:file.name, type:key, counts:{[key]:normalized.length}, totalRows:normalized.length, period });
  }catch(e){
    console.error(e);
    statusEl.textContent = 'Erreur de lecture';
    STATE.importLog.unshift({file:file.name, type:meta.label, count:0, period:'—', status:'Erreur: '+e.message});
    updateImportLogTable();
  }
}

/* ---------- Export / Import JSON (fichier unique de sauvegarde) ---------- */
// Format d'échange : un seul fichier .json regroupant les 4 sources déjà normalisées
// (entrant/sortant/mails/rtt), pour pouvoir sauvegarder puis réinjecter d'un coup toutes
// les données d'une période, sans redéposer les 4 fichiers Vonage d'origine.
const JSON_EXPORT_FORMAT = 'mada-dash-export';
const JSON_EXPORT_VERSION = 1;

function buildJsonExportPayload(){
  const payload = { format: JSON_EXPORT_FORMAT, version: JSON_EXPORT_VERSION, exportedAt: new Date().toISOString(), raw: {} };
  ['entrant','sortant','mails','rtt'].forEach(k=>{
    payload.raw[k] = STATE.raw[k].map(r => ({ ...r, date: r.date ? r.date.toISOString() : null }));
  });
  return payload;
}

function reviveRawFromJsonPayload(payload){
  if (!payload || typeof payload !== 'object' || !payload.raw) throw new Error('Format JSON non reconnu (clé "raw" manquante).');
  const out = { entrant:[], sortant:[], mails:[], rtt:[] };
  ['entrant','sortant','mails','rtt'].forEach(k=>{
    const arr = Array.isArray(payload.raw[k]) ? payload.raw[k] : [];
    out[k] = arr.map(r => ({ ...r, date: r.date ? new Date(r.date) : null })).filter(r => r.date instanceof Date && !isNaN(r.date));
  });
  return out;
}

function exportDataAsJson(){
  const payload = buildJsonExportPayload();
  const total = Object.values(payload.raw).reduce((s,a)=>s+a.length,0);
  if (!total){ alert("Aucune donnée en mémoire à exporter — importe d'abord au moins un fichier."); return; }
  const blob = new Blob([JSON.stringify(payload)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `mada-dash-export-${dateKey(new Date())}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

async function handleJsonImportFile(file){
  const statusEl = document.getElementById('status-json');
  if (statusEl){ statusEl.textContent = 'Lecture en cours…'; statusEl.classList.remove('empty'); }
  try{
    const text = await file.text();
    const payload = JSON.parse(text);
    const revived = reviveRawFromJsonPayload(payload);
    const counts = {};
    let totalRows = 0;
    ['entrant','sortant','mails','rtt'].forEach(k=>{
      STATE.raw[k] = STATE.raw[k].concat(revived[k]);
      counts[k] = revived[k].length;
      totalRows += revived[k].length;
    });
    const allDates = ['entrant','sortant','mails','rtt'].flatMap(k=>revived[k].map(r=>r.date)).sort((a,b)=>a-b);
    const period = allDates.length ? `${dateKey(allDates[0])} → ${dateKey(allDates[allDates.length-1])}` : '—';
    if (statusEl) statusEl.textContent = `${file.name} — ${totalRows} lignes lues, synchronisation…`;
    STATE.importLog.unshift({file:file.name, type:'Import JSON (sauvegarde)', count:totalRows, period, status:'OK (lecture)'});
    updateImportLogTable();
    updateLastUpdateMeta();
    refreshDashboard();
    // Synchronisation Firestore SOURCE PAR SOURCE, en séquence (pas en parallèle "fire and forget") :
    // sur un gros import (ex. plusieurs milliers de lignes "entrant"), ça prend nettement plus de temps
    // que les petites sources (sortant/mails/rtt) — les faire en séquence avec un statut affiché à
    // chaque étape évite de croire l'import terminé alors qu'une source (souvent la plus grosse) est
    // encore en train de s'écrire en arrière-plan.
    if (window.syncImportToFirestore){
      const labels = {entrant:'appels entrants', sortant:'appels sortants', mails:'mails', rtt:'RTT'};
      for (const k of ['entrant','sortant','mails','rtt']){
        if (!revived[k].length) continue;
        if (statusEl) statusEl.textContent = `${file.name} — synchronisation ${labels[k]} (${revived[k].length} lignes)…`;
        try{
          await window.syncImportToFirestore(k, revived[k], file.name);
        }catch(e){
          console.error(`Synchronisation Firestore échouée pour la source "${k}" (import JSON)`, e);
          if (statusEl) statusEl.textContent = `Erreur de synchronisation sur "${labels[k]}" (voir console) — les autres sources ont pu être synchronisées.`;
        }
      }
    }
    if (statusEl) statusEl.textContent = `${file.name} — ${totalRows} lignes synchronisées ✓`;
    if (window.logImportHistory) window.logImportHistory({ fileName:file.name, type:'json', counts, totalRows, period });
  }catch(e){
    console.error(e);
    if (statusEl) statusEl.textContent = 'Erreur de lecture JSON';
    STATE.importLog.unshift({file:file.name, type:'Import JSON (sauvegarde)', count:0, period:'—', status:'Erreur: '+e.message});
    updateImportLogTable();
  }
}

function wireJsonImportExport(){
  const btnExport = document.getElementById('btnExportJson');
  if (btnExport) btnExport.addEventListener('click', exportDataAsJson);
  const inputJson = document.getElementById('input-json');
  if (inputJson) inputJson.addEventListener('change', e=>{ if (e.target.files[0]) handleJsonImportFile(e.target.files[0]); });
  const zoneJson = document.querySelector('.dropzone[data-key="json"]');
  if (zoneJson){
    ['dragenter','dragover'].forEach(evt=> zoneJson.addEventListener(evt, e=>{ e.preventDefault(); zoneJson.classList.add('drag'); }));
    ['dragleave','drop'].forEach(evt=> zoneJson.addEventListener(evt, e=>{ e.preventDefault(); zoneJson.classList.remove('drag'); }));
    zoneJson.addEventListener('drop', e=>{ const file = e.dataTransfer.files[0]; if (file) handleJsonImportFile(file); });
  }
}

function updateImportLogTable(){
  const tbody = document.querySelector('#importLogTable tbody');
  if (!STATE.importLog.length){ tbody.innerHTML = '<tr><td colspan="5" class="emptystate">Aucun import pour le moment</td></tr>'; return; }
  tbody.innerHTML = STATE.importLog.map(l=>`<tr><td>${l.file}</td><td>${l.type}</td><td>${l.count}</td><td>${l.period}</td><td>${l.status}</td></tr>`).join('');
}

function updateLastUpdateMeta(){
  const total = Object.values(STATE.raw).reduce((s,a)=>s+a.length,0);
  document.getElementById('lastUpdateMeta').textContent = total ? `${total} lignes en mémoire · maj ${new Date().toLocaleTimeString('fr-FR')}` : 'Aucune donnée chargée';
}

function wireDropzones(){
  document.querySelectorAll('.dropzone').forEach(zone=>{
    const key = zone.dataset.key;
    const input = zone.querySelector('input[type=file]');
    // zone is a <label for="input-...">: clicking it natively opens the file picker (no JS needed).
    input.addEventListener('change', e=>{ if (e.target.files[0]) handleFileForKey(key, e.target.files[0]); });
    ['dragenter','dragover'].forEach(evt=> zone.addEventListener(evt, e=>{ e.preventDefault(); zone.classList.add('drag'); }));
    ['dragleave','drop'].forEach(evt=> zone.addEventListener(evt, e=>{ e.preventDefault(); zone.classList.remove('drag'); }));
    zone.addEventListener('drop', e=>{ const file = e.dataTransfer.files[0]; if (file) handleFileForKey(key, file); });
  });

  document.getElementById('btnResetData').addEventListener('click', ()=>{
    if (!confirm('Vider toutes les données importées (appels, mails, RTT) ?')) return;
    STATE.raw = { entrant: [], sortant: [], mails: [], rtt: [] };
    STATE.importLog = [];
    updateImportLogTable(); updateLastUpdateMeta();
    Object.keys(IMPORT_META).forEach(k=>{
      const el = document.getElementById('status-'+k); el.textContent = 'Aucun fichier'; el.classList.add('empty');
    });
    refreshDashboard();
  });
}

/* ============================= REFERENTIELS UI ============================= */

function renderRefTables(){
  document.querySelector('#tableFlux tbody').innerHTML = STATE.ref.flux.map(r=>`<tr><td>${escapeHtml(r.queue)}</td><td>${escapeHtml(r.acte)}</td></tr>`).join('');

  const equipesBody = document.querySelector('#tableEquipes tbody');
  if (!STATE.ref.equipes.length){
    equipesBody.innerHTML = '<tr><td colspan="5" class="emptystate">Aucun agent — importe un fichier ou ajoute un agent</td></tr>';
  } else {
    equipesBody.innerHTML = STATE.ref.equipes.map((r,i)=>`<tr data-i="${i}">
      <td><input class="inline-edit" data-field="id" value="${escapeHtml(r.id)}" placeholder="TER_PST32_xxx"></td>
      <td><input class="inline-edit" data-field="name" value="${escapeHtml(r.name)}" placeholder="Nom"></td>
      <td><input class="inline-edit" data-field="manager" value="${escapeHtml(r.manager||'')}" placeholder="Non affecté"></td>
      <td>Mada</td>
      <td><button class="btn secondary rowdel" style="padding:4px 9px;" title="Retirer">✕</button></td>
    </tr>`).join('');
    equipesBody.querySelectorAll('.inline-edit').forEach(inp=>{
      inp.addEventListener('change', e=>{
        const tr = e.target.closest('tr'); const i = +tr.dataset.i;
        let val = e.target.value.trim();
        if (e.target.dataset.field==='id') val = val.toUpperCase();
        STATE.ref.equipes[i][e.target.dataset.field] = val;
        refreshDashboard();
      });
    });
    equipesBody.querySelectorAll('.rowdel').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const tr = e.target.closest('tr'); const i = +tr.dataset.i;
        const label = STATE.ref.equipes[i].name || STATE.ref.equipes[i].id;
        const removedId = STATE.ref.equipes[i].id;
        if (!confirm(`Retirer ${label} de la répartition d'équipe ?`)) return;
        STATE.ref.equipes.splice(i,1);
        if (window.deleteAgentFromFirestore && removedId) window.deleteAgentFromFirestore(removedId);
        renderRefTables(); refreshDashboard();
      });
    });
  }

  document.querySelector('#tableTarifs tbody').innerHTML = STATE.ref.tarifs.map(r=>`<tr><td>${escapeHtml(r.site)}</td><td>${escapeHtml(r.activite)}</td><td>${escapeHtml(r.flux)}</td><td>${escapeHtml(r.type)}</td><td>${fmtMoney2(r.normal)}</td><td>${fmtMoney2(r.ferie)}</td></tr>`).join('');

  if (window.syncReferentielsToFirestore) window.syncReferentielsToFirestore();
}

async function loadFluxFile(file){
  const {headers, rows} = await parseAnyTabularFile(file);
  const cQ = findCol(headers, ["nom de la file d'attente"]);
  const cA = findCol(headers, ['actes']);
  STATE.ref.flux = rows.map(r=>({queue:r[cQ], acte:r[cA]})).filter(r=>r.queue);
  document.getElementById('fluxStatus').textContent = `${file.name} — ${STATE.ref.flux.length} lignes`;
  renderRefTables(); refreshDashboard();
}
async function loadEquipesFile(file){
  const buf = await readFileAsArrayBuffer(file);
  const wb = XLSX.read(buf, {type:'array'});
  let out = [];
  wb.SheetNames.forEach(name=>{
    const json = XLSX.utils.sheet_to_json(wb.Sheets[name], {defval:''});
    if (!json.length) return;
    const headers = Object.keys(json[0]);
    const cSite = findCol(headers, ['site']);
    const cAgent = findCol(headers, ['log mail','agent']);
    json.forEach(r=>{
      const site = normHeader(r[cSite]||'').toUpperCase();
      if (site !== 'MADA') return;
      const id = extractAgentId(r[cAgent]);
      if (!id) return;
      const name = normHeader(String(r[cAgent]||'').replace(/TER_PST\d+_\d+/i,'')).trim();
      out.push({id, name: name || id});
    });
  });
  const seen = new Set();
  out = out.filter(r=> seen.has(r.id) ? false : (seen.add(r.id), true));
  const prevManagers = {};
  STATE.ref.equipes.forEach(e=> prevManagers[e.id.toUpperCase()] = e.manager || '');
  STATE.ref.equipes = out.map(r=>({...r, manager: prevManagers[r.id.toUpperCase()] || ''}));
  document.getElementById('equipesStatus').textContent = `${file.name} — ${out.length} agents Mada`;
  renderRefTables(); refreshDashboard();
}
async function loadTarifsFile(file){
  const buf = await readFileAsArrayBuffer(file);
  const wb = XLSX.read(buf, {type:'array'});
  const sheetName = wb.SheetNames.find(n=>/facturation/i.test(n)) || wb.SheetNames[0];
  const json = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {defval:''});
  const headers = json.length ? Object.keys(json[0]) : [];
  const cSite = findCol(headers, ['site']);
  const cAct = findCol(headers, ['activité','activite']);
  const cFlux = findCol(headers, ['flux']);
  const cType = findCol(headers, ["type d'acte"]);
  const cNormal = findCol(headers, ['prix jour normal']);
  const cFerie = findCol(headers, ['prix jour férié','prix jour ferie']);
  STATE.ref.tarifs = json.filter(r=> normHeader(r[cSite]||'').toUpperCase()==='MADA').map(r=>({
    site:'Mada', activite:r[cAct], flux:r[cFlux], type:r[cType], normal:toNum(r[cNormal]), ferie:toNum(r[cFerie]),
  })).filter(r=>r.type);
  document.getElementById('tarifsStatus').textContent = `${file.name} — ${STATE.ref.tarifs.length} lignes Mada`;
  renderRefTables(); refreshDashboard();
}

function wireReferentiels(){
  document.querySelectorAll('#tab-ref .subtabs .subtab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('#tab-ref .subtabs .subtab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('#tab-ref .subpanel').forEach(p=>p.style.display='none');
      document.getElementById('sub-'+btn.dataset.sub).style.display='block';
    });
  });
  document.getElementById('fileFlux').addEventListener('change', e=>{ if (e.target.files[0]) loadFluxFile(e.target.files[0]); });
  document.getElementById('fileEquipes').addEventListener('change', e=>{ if (e.target.files[0]) loadEquipesFile(e.target.files[0]); });
  document.getElementById('fileTarifs').addEventListener('change', e=>{ if (e.target.files[0]) loadTarifsFile(e.target.files[0]); });
  document.getElementById('resetFlux').addEventListener('click', ()=>{ STATE.ref.flux = DEFAULT_FLUX.slice(); document.getElementById('fluxStatus').textContent=''; renderRefTables(); refreshDashboard(); });
  document.getElementById('resetEquipes').addEventListener('click', ()=>{ if(!confirm("Revenir à la répartition d'équipe par défaut ? Les managers assignés manuellement seront perdus.")) return; STATE.ref.equipes = DEFAULT_EQUIPES.map(e=>({...e, manager:''})); document.getElementById('equipesStatus').textContent=''; renderRefTables(); refreshDashboard(); });
  document.getElementById('resetTarifs').addEventListener('click', ()=>{ STATE.ref.tarifs = DEFAULT_TARIFS.slice(); document.getElementById('tarifsStatus').textContent=''; renderRefTables(); refreshDashboard(); });
  document.getElementById('btnAddAgent').addEventListener('click', ()=>{
    STATE.ref.equipes.push({id:'', name:'', manager:''});
    renderRefTables(); refreshDashboard();
    const rows = document.querySelectorAll('#tableEquipes tbody input[data-field="id"]');
    if (rows.length) rows[rows.length-1].focus();
  });
  document.getElementById('btnDetectAgents').addEventListener('click', ()=>{
    const missing = detectMissingAgents();
    if (!missing.size){ alert('Aucun nouvel agent détecté dans les fichiers importés.'); return; }
    missing.forEach((name,id)=>{ STATE.ref.equipes.push({id, name, manager:''}); });
    renderRefTables(); refreshDashboard();
    alert(`${missing.size} agent(s) ajouté(s) à la répartition d'équipe. Pense à leur assigner un manager si besoin.`);
  });
}

/* ============================= HISTORIQUE ============================= */

function renderHistTable(){
  const tbody = document.querySelector('#tableHistorique tbody');
  if (!STATE.history.length){ tbody.innerHTML = '<tr><td colspan="9" class="emptystate">Aucun instantané enregistré</td></tr>'; return; }
  tbody.innerHTML = STATE.history.map((h,i)=>`<tr>
    <td>${h.savedAt}</td><td>${h.periodLabel}</td><td>${h.gran}</td>
    <td>${fmtMoney2(h.ca)}</td><td>${h.nbActes}</td><td>${fmtMoney2(h.caH)}</td><td>${fmtNum(h.prodH,2)}</td><td>${fmtPct(h.tauxOcc)}</td>
    <td><button class="btn secondary" data-del="${i}" style="padding:4px 9px;">✕</button></td>
  </tr>`).join('');
  tbody.querySelectorAll('[data-del]').forEach(b=> b.addEventListener('click', ()=>{ STATE.history.splice(+b.dataset.del,1); renderHistTable(); renderHistChart(); }));
}
function renderHistChart(){
  const brand = cssVar('--brand');
  ensureChart('chartHistTrend', {
    type:'line',
    data:{ labels: STATE.history.map(h=>h.periodLabel), datasets:[{ data: STATE.history.map(h=>h.caH), borderColor:brand, backgroundColor:brand+'22', fill:true, tension:.3, pointRadius:4 }] },
    options: baseLineOptions(v=>fmtMoney2(v)),
  });
}

function wireHistorique(){
  document.getElementById('btnSaveSnapshot').addEventListener('click', ()=>{
    const f = getFilters();
    const actes = filteredActes(f); const rtt = filteredRtt(f);
    const kpi = computeKPIs(actes, rtt);
    const periodLabel = (f.from?dateKey(f.from):'…')+' → '+(f.to?dateKey(f.to):'…');
    STATE.history.push({ savedAt: new Date().toLocaleString('fr-FR'), periodLabel, gran:f.gran,
      ca:kpi.ca, nbActes:kpi.nbActes, caH:kpi.caH, prodH:kpi.prodH, tauxOcc:kpi.tauxOcc });
    renderHistTable(); renderHistChart();
  });
  document.getElementById('btnExportHist').addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(STATE.history, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'historique-mada-'+dateKey(new Date())+'.json'; a.click();
  });
  document.getElementById('fileImportHist').addEventListener('change', async e=>{
    const file = e.target.files[0]; if (!file) return;
    const text = await file.text();
    try{ const data = JSON.parse(text); if (Array.isArray(data)){ STATE.history = STATE.history.concat(data); renderHistTable(); renderHistChart(); } }
    catch(err){ alert('Fichier historique invalide'); }
  });
  document.getElementById('btnClearHist').addEventListener('click', ()=>{ if (confirm('Vider tout l\'historique en mémoire ?')){ STATE.history=[]; renderHistTable(); renderHistChart(); } });
}

/* ============================= TABS / FILTRES / THEME ============================= */

function wireTabs(){
  document.querySelectorAll('nav.tabs button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tabpanel').forEach(p=>p.classList.remove('active'));
      document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
    });
  });
}

function setDateRange(from, to){
  document.getElementById('filterFrom').value = dateKey(from);
  document.getElementById('filterTo').value = dateKey(to);
  refreshDashboard();
}

function wirePeriodPresets(){
  document.querySelectorAll('#segPeriodPreset button').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('#segPeriodPreset button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const now = new Date(); now.setHours(0,0,0,0);
      let from, to;
      switch(b.dataset.p){
        case 'today': from = now; to = now; break;
        case 'yesterday': { const y = new Date(now); y.setDate(y.getDate()-1); from = y; to = y; break; }
        case 'thisweek': { from = mondayOf(now); to = new Date(from); to.setDate(to.getDate()+6); break; }
        case 'lastweek': { const m = mondayOf(now); m.setDate(m.getDate()-7); from = m; to = new Date(m); to.setDate(to.getDate()+6); break; }
        case 'thismonth': from = new Date(now.getFullYear(), now.getMonth(), 1); to = new Date(now.getFullYear(), now.getMonth()+1, 0); break;
        case 'lastmonth': from = new Date(now.getFullYear(), now.getMonth()-1, 1); to = new Date(now.getFullYear(), now.getMonth(), 0); break;
      }
      setDateRange(from, to);
    });
  });
}

function wireFilters(){
  document.querySelectorAll('#segGranularite button').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('#segGranularite button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      refreshDashboard();
    });
  });
  // NB : le filtre Manager a un comportement particulier (il doit d'abord remettre le filtre
  // Agent à "Tous les agents" AVANT de rafraîchir, sinon un agent d'un autre manager resté
  // sélectionné produit un affichage vide qui ne se corrige jamais tout seul). On le gère donc
  // avec UN SEUL listener dédié, distinct de la boucle générique ci-dessous.
  ['filterFrom','filterTo','filterAgent','filterActe'].forEach(id=> document.getElementById(id).addEventListener('change', refreshDashboard));
  ['filterFrom','filterTo'].forEach(id=> document.getElementById(id).addEventListener('input', ()=>{
    document.querySelectorAll('#segPeriodPreset button').forEach(x=>x.classList.remove('active'));
  }));
  document.getElementById('filterManager').addEventListener('change', ()=>{
    document.getElementById('filterAgent').value = 'all';
    refreshDashboard();
  });
  document.getElementById('btnClearFilters').addEventListener('click', ()=>{
    document.getElementById('filterFrom').value=''; document.getElementById('filterTo').value='';
    document.getElementById('filterAgent').value='all'; document.getElementById('filterActe').value='all';
    document.getElementById('filterManager').value='all';
    document.querySelectorAll('#segPeriodPreset button').forEach(x=>x.classList.remove('active'));
    refreshDashboard();
  });
  document.querySelectorAll('#tableAgentDetail th').forEach(th=>{
    th.addEventListener('click', ()=>{
      const k = th.dataset.k;
      STATE.sort.dir = (STATE.sort.key===k) ? -STATE.sort.dir : -1;
      STATE.sort.key = k;
      renderAgentTable(STATE.lastAgentRows);
    });
  });
  const searchEl = document.getElementById('agentSearch');
  if (searchEl) searchEl.addEventListener('input', e=>{
    STATE.agentSearch = e.target.value.trim().toLowerCase();
    renderAgentTable(STATE.lastAgentRows);
  });
}

function wireDashboardSubtabs(){
  document.querySelectorAll('#tab-dash .dtabs .dtab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('#tab-dash .dtabs .dtab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('#tab-dash .dpanel').forEach(p=>p.style.display='none');
      document.getElementById('dsub-'+btn.dataset.dsub).style.display='block';
    });
  });
}

function wireTheme(){
  const btn = document.getElementById('themeToggle');
  btn.addEventListener('click', ()=>{
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? 'light' : 'dark';
    btn.textContent = isDark ? '🌙 Sombre' : '☀️ Clair';
    refreshDashboard(); renderHistChart();
  });
}

/* ============================= INIT ============================= */

function init(){
  wireDropzones(); wireReferentiels(); wireHistorique(); wireTabs(); wireFilters(); wireTheme();
  wireDashboardSubtabs(); wirePeriodPresets(); wireJsonImportExport();
  renderRefTables();
  updateImportLogTable();
  renderHistTable();
  refreshDashboard();
}
document.addEventListener('DOMContentLoaded', init);
