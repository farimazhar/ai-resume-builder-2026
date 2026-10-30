const $ = id => document.getElementById(id);
const fields = ["name","role","email","phone","location","links","summary","skills","extras"];
let experienceCount = 0, educationCount = 0;

function addEntry(type, data = {}) {
  const isExp = type === "experience";
  const id = isExp ? ++experienceCount : ++educationCount;
  const container = $(isExp ? "experienceList" : "educationList");
  const card = document.createElement("div");
  card.className = "entry-card";
  card.dataset.type = type;
  card.innerHTML = `
    <button class="remove-entry" type="button" aria-label="Remove entry">×</button>
    <div class="entry-grid">
      <label>${isExp ? "Job title" : "Degree / qualification"}<input data-field="title" placeholder="${isExp ? "e.g. Product Designer" : "e.g. BS Computer Science"}"></label>
      <label>${isExp ? "Company" : "Institution"}<input data-field="place" placeholder="${isExp ? "Company name" : "University / school"}"></label>
      <label>Dates<input data-field="dates" placeholder="${isExp ? "Jan 2022 – Present" : "2018 – 2022"}"></label>
      <label>${isExp ? "Location (optional)" : "Grade (optional)"}<input data-field="meta" placeholder="${isExp ? "City, Country" : "CGPA / grade"}"></label>
    </div>
    <label>${isExp ? "Achievements & responsibilities" : "Details (optional)"}<textarea data-field="details" rows="2" placeholder="${isExp ? "Use action verbs and measurable results where possible..." : "Relevant coursework, honors, etc."}"></textarea></label>`;
  Object.entries(data).forEach(([key,value]) => { const el=card.querySelector(`[data-field="${key}"]`); if(el) el.value=value; });
  card.querySelector(".remove-entry").addEventListener("click",()=>{card.remove();update();});
  card.querySelectorAll("input,textarea").forEach(el=>el.addEventListener("input",update));
  container.appendChild(card); update();
}
function val(id){return $(id).value.trim();}
function textOr(el, value, fallback){el.textContent=value || fallback;}
function update(){
  textOr($("pName"),val("name"),"Your Name");
  textOr($("pRole"),val("role"),"Your Professional Title");
  const contact=[val("email"),val("phone"),val("location")].filter(Boolean).join("  •  ");
  textOr($("pContact"),contact,"email@example.com  •  +1 555 000 0000  •  City, Country");
  textOr($("pLinks"),val("links"),"");
  textOr($("pSummary"),val("summary"),"Your professional summary will appear here. Share a concise overview of your experience, strengths, and career goals.");
  const exp=[...$("experienceList").children];
  $("pExperience").innerHTML=exp.length?"":'<p class="placeholder">Your work experience will appear here.</p>';
  exp.forEach(card=>{
    const d=readCard(card); if(!d.title&&!d.place&&!d.details)return;
    $("pExperience").insertAdjacentHTML("beforeend",`<div class="resume-entry"><div class="resume-entry-head"><strong>${esc(d.title||"Role")}${d.place?" · "+esc(d.place):""}</strong><em>${esc(d.dates)}</em></div>${d.meta?`<div class="subline">${esc(d.meta)}</div>`:""}${d.details?`<p class="details">${esc(d.details)}</p>`:""}</div>`);
  });
  const edu=[...$("educationList").children];
  $("pEducation").innerHTML=edu.length?"":'<p class="placeholder">Your education will appear here.</p>';
  edu.forEach(card=>{
    const d=readCard(card); if(!d.title&&!d.place&&!d.details)return;
    $("pEducation").insertAdjacentHTML("beforeend",`<div class="resume-entry"><div class="resume-entry-head"><strong>${esc(d.title||"Qualification")}${d.place?" · "+esc(d.place):""}</strong><em>${esc(d.dates)}</em></div>${d.meta?`<div class="subline">${esc(d.meta)}</div>`:""}${d.details?`<p class="details">${esc(d.details)}</p>`:""}</div>`);
  });
  const skills=val("skills").split(",").map(s=>s.trim()).filter(Boolean);
  $("pSkills").innerHTML=skills.length?skills.map(s=>`<span>${esc(s)}</span>`).join(""):'<span class="placeholder">Your skills will appear here.</span>';
  textOr($("pExtras"),val("extras"),"Add projects or certifications to highlight your work.");
  const filled=[val("name"),val("role"),val("email"),val("summary"),exp.some(c=>readCard(c).title),edu.some(c=>readCard(c).title),skills.length>0].filter(Boolean).length;
  const percent=Math.round(filled/7*100); $("progressText").textContent=percent+"%"; $("progressBar").style.width=percent+"%";
  save();
}
function readCard(card){const d={};card.querySelectorAll("[data-field]").forEach(el=>d[el.dataset.field]=el.value.trim());return d;}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function save(){
  const data={};fields.forEach(id=>data[id]=val(id));
  data.experience=[...$("experienceList").children].map(readCard);
  data.education=[...$("educationList").children].map(readCard);
  try{localStorage.setItem("resumecraft-data",JSON.stringify(data));$("savedStatus").textContent="✓ Saved in this browser";}catch(e){$("savedStatus").textContent="Local saving unavailable";}
}
function restore(){
  try{
    const data=JSON.parse(localStorage.getItem("resumecraft-data")||"null");if(!data)return;
    fields.forEach(id=>{if(data[id])$(id).value=data[id];});
    (data.experience||[]).forEach(d=>addEntry("experience",d));
    (data.education||[]).forEach(d=>addEntry("education",d));
  }catch(e){console.warn("Could not restore saved resume",e);}
}
function suggestSummary(){
  const role=val("role")||"professional", skills=val("skills").split(",").map(s=>s.trim()).filter(Boolean);
  const experience=[...$("experienceList").children].map(readCard).filter(d=>d.title);
  const skillText=skills.length?skills.slice(0,4).join(", "):"problem-solving, communication, and collaboration";
  const years=experience.length?` with experience in ${experience.map(e=>e.title).slice(0,2).join(" and ")}`:"";
  $("summary").value=`Motivated ${role}${years}, with strengths in ${skillText}. Focused on delivering high-quality work, solving practical challenges, and collaborating effectively with teams. Eager to contribute skills and continue growing in a results-driven environment.`;
  update();
}
$("addExperience").addEventListener("click",()=>addEntry("experience"));
$("addEducation").addEventListener("click",()=>addEntry("education"));
$("summaryHelp").addEventListener("click",suggestSummary);
$("downloadBtn").addEventListener("click",()=>window.print());
$("bottomDownload").addEventListener("click",()=>window.print());
$("clearBtn").addEventListener("click",()=>{
  if(!confirm("Clear all resume information saved in this browser?"))return;
  fields.forEach(id=>$(id).value="");$("experienceList").innerHTML="";$("educationList").innerHTML="";
  localStorage.removeItem("resumecraft-data");update();
});
fields.forEach(id=>$(id).addEventListener("input",update));
restore(); if(!$("experienceList").children.length)addEntry("experience"); if(!$("educationList").children.length)addEntry("education"); update();
