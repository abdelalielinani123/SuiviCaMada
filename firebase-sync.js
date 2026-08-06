/* =========================================================================
   Synchronisation Firestore — Dashboard Productivité & CA Horaire (Mada)
   -------------------------------------------------------------------------
   Ce fichier est chargé APRES app.js. Il vient se greffer sur les fonctions
   globales déjà définies dans app.js (STATE, buildFluxMap, enrichEntrantRows,
   computeKPIs, refreshDashboard, renderRefTables, dateKey, bucketKey, ...) —
   il n'y a rien à exporter côté app.js, tout est déjà accessible ici.

   ⚠️ CONFIGURATION REQUISE avant que quoi que ce soit ne fonctionne :
   1) Remplace FIREBASE_CONFIG ci-dessous par la config de ton projet Firebase
      (Console Firebase → ⚙️ Paramètres du projet → Général → tout en bas dans
      "Vos applications" → sélectionne/crée une appli Web → "Config").
   2) Dans la Console Firebase :
      - Firestore Database → crée une base (mode production).
      - Authentication → Sign-in method → active "Adresse e-mail/Mot de passe".
      - Authentication → Users → ajoute un compte pour chaque personne qui doit
        accéder au dashboard (toi + tes managers).
   3) Colle les règles de sécurité ci-dessous dans Firestore → Règles, puis
      "Publier" :

        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if request.auth != null;
            }
          }
        }

      (Règle volontairement simple : tout utilisateur authentifié peut lire/
      écrire. Si tu veux restreindre certaines actions — ex. seuls certains
      emails peuvent supprimer une action du plan — dis-le moi et j'affinerai.)

   Tant que FIREBASE_CONFIG n'est pas rempli avec de vraies valeurs, ou si la
   connexion échoue, le dashboard continue de fonctionner en mode 100% local
   (comme avant) via le lien "Continuer sans Firestore" sur l'écran de connexion.
   ========================================================================= */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCxn2RO-HyVpxLbCW0tRHQDdLw-vKrV3Tw",
  authDomain: "suivicamada.firebaseapp.com",
  projectId: "suivicamada",
  storageBucket: "suivicamada.firebasestorage.app",
  messagingSenderId: "311623028322",
  appId: "1:311623028322:web:a392ddac2bf62f0a18cb3b",
};

let db = null;
let fsApp = null;
window.FIRESTORE_READY = false;
let planActionUnsub = null;
let refSyncing = false; // évite de ré-écrire vers Firestore ce qu'on vient juste d'en charger

try {
  fsApp = firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.firestore();
} catch (e) {
  console.error('Initialisation Firebase impossible :', e);
}

/* ============================= UTILITAIRES ============================= */

function groupBy(arr, fn){
  const m = new Map();
  arr.forEach(x=>{ const k = fn(x); if (!m.has(k)) m.set(k, []); m.get(k).push(x); });
  return m;
}

async function commitInChunks(entries){ // entries: [ [docRef, dataObj], ... ]
  for (let i=0;i<entries.length;i+=400){
    const batch = db.batch();
    entries.slice(i,i+400).forEach(([ref,data])=> batch.set(ref, data, {merge:true}));
    await batch.commit();
  }
}

function setFsStatus(text){
  const el = document.getElementById('fsStatus');
  if (el) el.textContent = text || '';
}

function sumField(rows, f){ return rows.reduce((s,r)=>s+(r[f]||0),0); }

/* ============================= ECRITURE DES ROLLUPS (à l'import) ============================= */
// Un "rollup" = un document par agent et par jour, avec des champs préfixés par source
// (ca_in/ca_out/ca_mail, nbIn/nbOut/nbMail, ...) pour que réimporter le même fichier soit
// sans risque (écrasement idempotent) SANS jamais effacer la contribution d'une autre source.

async function writeActeRollups(enrichedActes, sourceKey){
  if (!enrichedActes.length) return;
  const groups = groupBy(enrichedActes, a => a.agentId+'|'+dateKey(a.date));
  const entries = [];
  groups.forEach((items, gkey)=>{
    const [agentId, date] = gkey.split('|');
    const fields = { agentId, agentName: items[0].agentName, date, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    if (sourceKey === 'entrant'){
      fields.ca_in = items.reduce((s,a)=>s+a.ca,0);
      fields.nbIn = items.length;
      fields.dmt_in_sum = items.reduce((s,a)=>s+a.dmt_num,0);
      fields.dmt_in_count = items.length;
      fields.acw_sum = items.reduce((s,a)=>s+a.acw,0);
      fields.acw_count = items.length;
      fields.mea_sum = items.reduce((s,a)=>s+a.mea,0);
      fields.mea_count = items.length;
      fields.nonTarifes_in = items.filter(a=>!a.tarife).length;
    } else if (sourceKey === 'sortant'){
      fields.ca_out = items.reduce((s,a)=>s+a.ca,0);
      fields.nbOut = items.length;
      fields.dmt_out_sum = items.reduce((s,a)=>s+a.dmt_num,0);
      fields.dmt_out_count = items.length;
      fields.nonTarifes_out = items.filter(a=>!a.tarife).length;
    } else if (sourceKey === 'mails'){
      fields.ca_mail = items.reduce((s,a)=>s+a.ca,0);
      fields.nbMail = items.length;
      fields.nonTarifes_mail = items.filter(a=>!a.tarife).length;
    }
    entries.push([db.collection('rollups').doc(agentId+'_'+date), fields]);
  });
  await commitInChunks(entries);
}

async function writeRttRollups(normalizedRows, madaIds, equipeMap){
  const rows = normalizedRows.filter(r=>r.agentId && madaIds.has(r.agentId) && r.date);
  if (!rows.length) return;
  const groups = groupBy(rows, r => r.agentId+'|'+dateKey(r.date));
  const entries = [];
  groups.forEach((items, gkey)=>{
    const [agentId, date] = gkey.split('|');
    const fields = {
      agentId, agentName: equipeMap[agentId] || agentId, date, updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      tempsLog: items.reduce((s,r)=>s+r.temps_log,0),
      tempsDispo: items.reduce((s,r)=>s+r.temps_dispo,0),
      retraitDetail: items.reduce((s,r)=>s+r.retrait_detail,0),
      panier: items.reduce((s,r)=>s+r.panier,0),
      pauseCafe: items.reduce((s,r)=>s+r.pause_cafe,0),
      brief: items.reduce((s,r)=>s+r.brief,0),
      communication: items.reduce((s,r)=>s+r.communication,0),
      miseEnAttente: items.reduce((s,r)=>s+r.mise_en_attente,0),
      appelSortantSec: items.reduce((s,r)=>s+r.appel_sortant_sec,0),
    };
    entries.push([db.collection('rollups').doc(agentId+'_'+date), fields]);
  });
  await commitInChunks(entries);
}

window.syncImportToFirestore = async function(key, normalizedRows, fileName){
  if (!window.FIRESTORE_READY || !normalizedRows.length) return;
  setFsStatus('Synchronisation Firestore…');
  try{
    const madaIds = getMadaIds();
    const equipeMap = buildEquipeMap();
    if (key === 'rtt'){
      await writeRttRollups(normalizedRows, madaIds, equipeMap);
    } else {
      const tarifMap = buildTarifMap();
      let enriched;
      if (key === 'entrant') enriched = enrichEntrantRows(normalizedRows, buildFluxMap(), tarifMap, madaIds, equipeMap);
      else if (key === 'sortant') enriched = enrichSortantRows(normalizedRows, tarifMap, madaIds, equipeMap);
      else enriched = enrichMailRows(normalizedRows, tarifMap, madaIds, equipeMap);
      await writeActeRollups(enriched, key);
    }
    setFsStatus('Synchronisé ✓ (' + fileName + ')');
    setTimeout(()=>setFsStatus(''), 4000);
    // Le fichier vient d'être poussé en base : si la période affichée couvre ces dates, on rafraîchit.
    refreshDashboard();
  } catch(e){
    console.error('Synchronisation Firestore échouée pour '+fileName, e);
    setFsStatus('Erreur de synchronisation Firestore (voir console)');
  }
};

/* ============================= LECTURE DES ROLLUPS (Dashboard) ============================= */

async function fetchRollupsForRange(fromKey, toKey){
  let q = db.collection('rollups');
  if (fromKey) q = q.where('date','>=',fromKey);
  if (toKey) q = q.where('date','<=',toKey);
  const snap = await q.get();
  return snap.docs.map(d=>d.data());
}

function projectRollupToActe(r, acte){
  const base = {
    agentId:r.agentId, agentName:r.agentName, date:r.date,
    tempsLog:r.tempsLog, tempsDispo:r.tempsDispo, retraitDetail:r.retraitDetail, panier:r.panier,
    pauseCafe:r.pauseCafe, brief:r.brief, communication:r.communication, miseEnAttente:r.miseEnAttente,
    appelSortantSec:r.appelSortantSec,
  };
  if (acte==='in') return {...base, ca_in:r.ca_in, nbIn:r.nbIn, dmt_in_sum:r.dmt_in_sum, dmt_in_count:r.dmt_in_count, acw_sum:r.acw_sum, acw_count:r.acw_count, mea_sum:r.mea_sum, mea_count:r.mea_count, nonTarifes_in:r.nonTarifes_in};
  if (acte==='out') return {...base, ca_out:r.ca_out, nbOut:r.nbOut, dmt_out_sum:r.dmt_out_sum, dmt_out_count:r.dmt_out_count, nonTarifes_out:r.nonTarifes_out};
  if (acte==='mail') return {...base, ca_mail:r.ca_mail, nbMail:r.nbMail, nonTarifes_mail:r.nonTarifes_mail};
  return r;
}

function computeKPIsFromRollupList(rows){
  const ca = sumField(rows,'ca_in')+sumField(rows,'ca_out')+sumField(rows,'ca_mail');
  const nbIn = sumField(rows,'nbIn'), nbOut = sumField(rows,'nbOut'), nbMail = sumField(rows,'nbMail');
  const nbActes = nbIn+nbOut+nbMail;
  const dmtSum = sumField(rows,'dmt_in_sum')+sumField(rows,'dmt_out_sum');
  const dmtCount = sumField(rows,'dmt_in_count')+sumField(rows,'dmt_out_count');
  const dmt = dmtCount ? dmtSum/dmtCount : 0;
  const acwCount = sumField(rows,'acw_count');
  const acw = acwCount ? sumField(rows,'acw_sum')/acwCount : 0;
  const meaCount = sumField(rows,'mea_count');
  const mea = meaCount ? sumField(rows,'mea_sum')/meaCount : 0;
  const tempsLog = sumField(rows,'tempsLog');
  const tempsDispo = sumField(rows,'tempsDispo');
  const retraitDetailTotal = sumField(rows,'retraitDetail');
  const panierTotal = sumField(rows,'panier');
  const pauseCafeTotal = sumField(rows,'pauseCafe');
  const briefTotal = sumField(rows,'brief');
  const occupationNumTotal = sumField(rows,'communication')+sumField(rows,'miseEnAttente')+sumField(rows,'panier')+sumField(rows,'appelSortantSec');
  const tempsLogH = tempsLog/3600;
  const caH = tempsLogH>0 ? ca/tempsLogH : 0;
  const prodH = tempsLogH>0 ? nbActes/tempsLogH : 0;
  const tauxDispo = tempsLog>0 ? tempsDispo/tempsLog : 0;
  const tauxRetrait = tempsLog>0 ? retraitDetailTotal/tempsLog : 0;
  const tauxOcc = tempsLog>0 ? occupationNumTotal/tempsLog : 0;
  const tauxPanier = tempsLog>0 ? panierTotal/tempsLog : 0;
  const tauxPause = tempsLog>0 ? pauseCafeTotal/tempsLog : 0;
  const tauxBrief = tempsLog>0 ? briefTotal/tempsLog : 0;
  const nonTarifes = sumField(rows,'nonTarifes_in')+sumField(rows,'nonTarifes_out')+sumField(rows,'nonTarifes_mail');
  return {ca,nbActes,nbMail,nbIn,nbOut,dmt,acw,mea,tempsLog,tempsLogH,caH,prodH,tauxOcc,tauxDispo,tauxRetrait,tauxPanier,tauxPause,tauxBrief,nonTarifes};
}

function timeSeriesFromRollups(rows, gran){
  const buckets = new Map();
  rows.forEach(r=>{
    const [y,m,d] = r.date.split('-').map(Number);
    const dt = new Date(y, m-1, d);
    const k = bucketKey(dt, gran);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(r);
  });
  const keys = Array.from(buckets.keys()).sort();
  return keys.map(k=>({ key:k, label: bucketLabel(k, gran), ...computeKPIsFromRollupList(buckets.get(k)) }));
}

function agentBreakdownFromRollups(rows){
  const managerMap = buildAgentManagerMap();
  const byAgent = groupBy(rows, r=>r.agentId);
  const out = [];
  byAgent.forEach((items, agentId)=>{
    const k = computeKPIsFromRollupList(items);
    out.push({ id:agentId, name: items[0].agentName || agentId, manager: managerMap[String(agentId).toUpperCase()]||'',
      ca:k.ca, log:k.tempsLog, caH:k.caH, dmt:k.dmt, acw:k.acw, mea:k.mea, actes:k.nbActes, prod:k.prodH, occ:k.tauxOcc,
      dispo:k.tauxDispo, retrait:k.tauxRetrait, panier:k.tauxPanier, pause:k.tauxPause, brief:k.tauxBrief });
  });
  return out;
}

const localRefreshDashboard = refreshDashboard;
let refreshGen = 0;

async function refreshDashboardFromFirestore(){
  const myGen = ++refreshGen;
  const f = getFilters();
  const fromKey = f.from ? dateKey(f.from) : null;
  const toKey = f.to ? dateKey(f.to) : null;
  setFsStatus('Chargement de la période…');
  let rows;
  try{
    rows = await fetchRollupsForRange(fromKey, toKey);
  } catch(e){
    console.error('Lecture Firestore échouée, repli sur le calcul local', e);
    setFsStatus('Erreur Firestore — repli local');
    return localRefreshDashboard();
  }
  if (myGen !== refreshGen) return; // une requête plus récente a été lancée, on abandonne celle-ci
  const managerMap = buildAgentManagerMap();
  let filtered = rows.filter(r=>{
    if (f.agent!=='all' && r.agentId!==f.agent) return false;
    if (!agentMatchesManager(r.agentId, f.manager, managerMap)) return false;
    return true;
  });
  if (f.acte !== 'all') filtered = filtered.map(r => projectRollupToActe(r, f.acte));

  const kpi = computeKPIsFromRollupList(filtered);
  renderKpiGridInto('kpiGrid', KPI_DEFS, kpi);
  renderKpiGridInto('kpiGridRtt', KPI_DEFS_RTT, kpi);
  const series = timeSeriesFromRollups(filtered, f.gran);
  const agentRows = agentBreakdownFromRollups(filtered);
  STATE.lastAgentRows = agentRows;
  renderCharts(series, kpi, agentRows);
  renderAgentTable(agentRows);
  renderWarnings();
  populateManagerFilter();
  populateAgentFilter();
  setFsStatus(rows.length + ' jours-agent chargés depuis Firestore');
}

refreshDashboard = function(){
  if (window.FIRESTORE_READY) refreshDashboardFromFirestore();
  else localRefreshDashboard();
};

/* ============================= REFERENTIELS (équipes / flux / tarifs) ============================= */

window.syncReferentielsToFirestore = async function(){
  if (!window.FIRESTORE_READY || refSyncing) return;
  try{
    const entries = STATE.ref.equipes.filter(e=>e.id).map(e=>[
      db.collection('equipes').doc(e.id.toUpperCase()),
      { name: e.name||'', manager: e.manager||'', site:'Mada', updatedAt: firebase.firestore.FieldValue.serverTimestamp() },
    ]);
    await commitInChunks(entries);
    await db.collection('referentiels').doc('flux').set({ list: STATE.ref.flux, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    await db.collection('referentiels').doc('tarifs').set({ list: STATE.ref.tarifs, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
  } catch(e){
    console.error('Synchronisation des référentiels échouée', e);
  }
};

window.deleteAgentFromFirestore = async function(id){
  if (!window.FIRESTORE_READY || !id) return;
  try{ await db.collection('equipes').doc(id.toUpperCase()).delete(); }
  catch(e){ console.error('Suppression agent Firestore échouée', e); }
};

async function loadReferentielsFromFirestore(){
  refSyncing = true;
  try{
    const [equipesSnap, fluxDoc, tarifsDoc] = await Promise.all([
      db.collection('equipes').get(),
      db.collection('referentiels').doc('flux').get(),
      db.collection('referentiels').doc('tarifs').get(),
    ]);
    if (!equipesSnap.empty){
      STATE.ref.equipes = equipesSnap.docs.map(d=>({ id:d.id, name:d.data().name||'', manager:d.data().manager||'' }));
    }
    if (fluxDoc.exists && Array.isArray(fluxDoc.data().list) && fluxDoc.data().list.length) STATE.ref.flux = fluxDoc.data().list;
    if (tarifsDoc.exists && Array.isArray(tarifsDoc.data().list) && tarifsDoc.data().list.length) STATE.ref.tarifs = tarifsDoc.data().list;
    renderRefTables();
    refreshDashboard();
  } catch(e){
    console.error('Chargement des référentiels Firestore échoué, valeurs locales conservées', e);
  } finally {
    refSyncing = false;
  }
}

/* ============================= PLAN D'ACTION ============================= */

const PLAN_STATUTS = ['À faire','En cours','Terminé','Bloqué'];
let planActionFilter = 'all';
let planActionRows = [];

function statutClass(s){
  return { 'À faire':'st-afaire', 'En cours':'st-encours', 'Terminé':'st-termine', 'Bloqué':'st-bloque' }[s] || 'st-afaire';
}

function renderPlanActionTable(){
  const tbody = document.querySelector('#tablePlanAction tbody');
  const rows = planActionFilter==='all' ? planActionRows : planActionRows.filter(r=>r.statut===planActionFilter);
  if (!rows.length){
    tbody.innerHTML = `<tr><td colspan="8" class="emptystate">${window.FIRESTORE_READY ? 'Aucune action pour ce filtre' : "Connecte-toi pour voir et gérer le plan d'action"}</td></tr>`;
    return;
  }
  const today = dateKey(new Date());
  tbody.innerHTML = rows.map(r=>{
    const overdue = r.echeance && r.echeance < today && r.statut !== 'Terminé';
    return `<tr data-id="${r.id}">
      <td><textarea class="inline-edit" data-field="constat" rows="1">${escapeHtml(r.constat||'')}</textarea></td>
      <td><textarea class="inline-edit" data-field="action" rows="1">${escapeHtml(r.action||'')}</textarea></td>
      <td><input class="inline-edit" data-field="responsable" value="${escapeHtml(r.responsable||'')}"></td>
      <td><select class="inline-edit" data-field="priorite">
        ${['Faible','Moyenne','Haute'].map(p=>`<option value="${p}" ${r.priorite===p?'selected':''}>${p}</option>`).join('')}
      </select></td>
      <td class="${overdue?'overdue':''}"><input type="date" class="inline-edit" data-field="echeance" value="${r.echeance||''}"></td>
      <td><select class="inline-edit" data-field="statut">
        ${PLAN_STATUTS.map(s=>`<option value="${s}" ${r.statut===s?'selected':''}>${s}</option>`).join('')}
      </select> <span class="statut-badge ${statutClass(r.statut)}" style="margin-left:4px;">${r.statut==='Terminé'?'✓':overdue?'⚠':''}</span></td>
      <td><textarea class="inline-edit" data-field="commentaire" rows="1">${escapeHtml(r.commentaire||'')}</textarea></td>
      <td><button class="btn secondary plandel" style="padding:4px 9px;" title="Supprimer">✕</button></td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('.inline-edit').forEach(el=>{
    el.addEventListener('change', e=>{
      const id = e.target.closest('tr').dataset.id;
      const field = e.target.dataset.field;
      const val = e.target.value;
      db.collection('plans_action').doc(id).update({ [field]: val, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
        .catch(err=>console.error('Mise à jour action échouée', err));
    });
  });
  tbody.querySelectorAll('.plandel').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.target.closest('tr').dataset.id;
      if (!confirm('Supprimer cette action du plan ?')) return;
      db.collection('plans_action').doc(id).delete().catch(err=>console.error('Suppression action échouée', err));
    });
  });
}

function startPlanActionListener(){
  if (planActionUnsub) planActionUnsub();
  planActionUnsub = db.collection('plans_action').orderBy('createdAt','desc').onSnapshot(snap=>{
    planActionRows = snap.docs.map(d=>({ id:d.id, ...d.data() }));
    document.getElementById('planStatus').textContent = planActionRows.length + ' action(s) au total';
    renderPlanActionTable();
  }, err=>{
    console.error('Ecoute du plan d\'action échouée', err);
    document.getElementById('planStatus').textContent = 'Erreur de synchronisation (voir console)';
  });
}
function stopPlanActionListener(){
  if (planActionUnsub){ planActionUnsub(); planActionUnsub = null; }
  planActionRows = [];
  renderPlanActionTable();
}

function wirePlanAction(){
  document.getElementById('btnAddAction').addEventListener('click', ()=>{
    if (!window.FIRESTORE_READY){ alert('Connecte-toi pour créer une action.'); return; }
    db.collection('plans_action').add({
      constat:'', action:'', responsable:'', priorite:'Moyenne', echeance:'', statut:'À faire', commentaire:'',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: (firebase.auth().currentUser && firebase.auth().currentUser.email) || '',
    }).catch(err=>console.error('Création action échouée', err));
  });
  document.querySelectorAll('#segPlanFilter button').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('#segPlanFilter button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      planActionFilter = b.dataset.s;
      renderPlanActionTable();
    });
  });
}

/* ============================= AUTHENTIFICATION ============================= */

function showAuthGate(show){
  document.getElementById('authGate').style.display = show ? 'flex' : 'none';
}

function onSignedIn(user){
  window.FIRESTORE_READY = true;
  showAuthGate(false);
  document.getElementById('authUserBadge').style.display = 'inline';
  document.getElementById('authUserBadge').textContent = user.email;
  document.getElementById('btnLogout').style.display = 'inline-flex';
  document.getElementById('btnShowLogin').style.display = 'none';
  loadReferentielsFromFirestore();
  startPlanActionListener();
  refreshDashboard();
}
function onSignedOut(){
  window.FIRESTORE_READY = false;
  document.getElementById('authUserBadge').style.display = 'none';
  document.getElementById('btnLogout').style.display = 'none';
  document.getElementById('btnShowLogin').style.display = 'inline-flex';
  setFsStatus('');
  stopPlanActionListener();
  showAuthGate(true);
  refreshDashboard();
}

function wireAuth(){
  document.getElementById('btnAuthSubmit').addEventListener('click', ()=>{
    const email = document.getElementById('authEmail').value.trim();
    const pass = document.getElementById('authPassword').value;
    const errEl = document.getElementById('authError');
    errEl.textContent = '';
    if (!email || !pass){ errEl.textContent = 'Renseigne un email et un mot de passe.'; return; }
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(err=>{
      console.error(err);
      errEl.textContent = err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid'
        ? "Configuration Firebase manquante ou invalide (voir le haut de firebase-sync.js)."
        : 'Connexion refusée : ' + (err.message || err.code);
    });
  });
  document.getElementById('authPassword').addEventListener('keydown', e=>{ if (e.key==='Enter') document.getElementById('btnAuthSubmit').click(); });
  document.getElementById('authSkip').addEventListener('click', ()=>{ showAuthGate(false); });
  document.getElementById('btnLogout').addEventListener('click', ()=>{ firebase.auth().signOut(); });
  document.getElementById('btnShowLogin').addEventListener('click', ()=>{ document.getElementById('authError').textContent=''; showAuthGate(true); });

  if (fsApp){
    firebase.auth().onAuthStateChanged(user=>{ user ? onSignedIn(user) : onSignedOut(); });
  } else {
    document.getElementById('authError').textContent = "Firebase n'a pas pu être initialisé — vérifie FIREBASE_CONFIG.";
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  wireAuth();
  wirePlanAction();
});
