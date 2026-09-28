const API = "http://localhost:8080/api";
const resources = ["vehicles","customers","bookings","payments"];

function esc(v){ return String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

async function api(path, options={}){
  const res = await fetch(API + path, {headers:{"Content-Type":"application/json"}, ...options});
  if(!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`);
  return res.status === 204 ? null : res.json();
}

function resetForm(id){
  document.getElementById(id).reset();
  const hidden = document.querySelector(`#${id} input[type="hidden"]`);
  if(hidden) hidden.value="";
}

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
  document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active", b.dataset.page===page));
  document.getElementById("pageTitle").textContent = page[0].toUpperCase()+page.slice(1);
  if(page!=="dashboard") loadResource(page);
  else loadDashboard();
}

document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));

async function loadDashboard(){
  try{
    const counts = await Promise.all(resources.map(r=>api("/"+r)));
    resources.forEach((r,i)=>document.getElementById(r.slice(0,-1)+"Count").textContent=counts[i].length);
    document.getElementById("apiStatus").textContent="API Connected";
  }catch(e){
    document.getElementById("apiStatus").textContent="Start Spring Boot";
  }
}

const configs = {
  vehicles:{
    fields:["id","vehicleName","brand","model","vehicleType","fuelType","manufacturer","manufacturingYear","pricePerDay","vehicleNumber"],
    form:"vehicleForm", endpoint:"vehicles", table:"vehiclesTable"
  },
  customers:{
    fields:["id","name","email","phone","address"],
    form:"customerForm", endpoint:"customers", table:"customersTable"
  },
  bookings:{
    fields:["id","customerId","vehicleId","startDate","endDate","totalAmount","status"],
    form:"bookingForm", endpoint:"bookings", table:"bookingsTable"
  },
  payments:{
    fields:["id","bookingId","amount","paymentMethod","status","paymentDate"],
    form:"paymentForm", endpoint:"payments", table:"paymentsTable"
  }
};

function formId(resource, field){
  const map={
    vehicles:{id:"vehicleId",vehicleName:"vehicleName",brand:"brand",model:"model",vehicleType:"vehicleType",fuelType:"fuelType",manufacturer:"manufacturer",manufacturingYear:"manufacturingYear",pricePerDay:"pricePerDay",vehicleNumber:"vehicleNumber"},
    customers:{id:"customerId",name:"customerName",email:"customerEmail",phone:"customerPhone",address:"customerAddress"},
    bookings:{id:"bookingId",customerId:"bookingCustomerId",vehicleId:"bookingVehicleId",startDate:"startDate",endDate:"endDate",totalAmount:"totalAmount",status:"bookingStatus"},
    payments:{id:"paymentId",bookingId:"paymentBookingId",amount:"paymentAmount",paymentMethod:"paymentMethod",status:"paymentStatus",paymentDate:"paymentDate"}
  };
  return map[resource][field];
}

async function loadResource(resource){
  const cfg=configs[resource];
  try{
    const data=await api("/"+cfg.endpoint);
    renderTable(resource,data);
    document.getElementById("apiStatus").textContent="API Connected";
  }catch(e){
    document.getElementById(cfg.table).innerHTML='<div class="empty">Could not connect to Spring Boot. Start the backend first.</div>';
    document.getElementById("apiStatus").textContent="API Offline";
  }
}

function renderTable(resource,data){
  const cfg=configs[resource];
  if(!data.length){document.getElementById(cfg.table).innerHTML='<div class="empty">No records yet. Add one using the form above.</div>';return;}
  let html="<table><thead><tr>"+cfg.fields.map(f=>`<th>${f}</th>`).join("")+"<th>Actions</th></tr></thead><tbody>";
  data.forEach(row=>{
    html+="<tr>"+cfg.fields.map(f=>`<td>${esc(row[f])}</td>`).join("")+
      `<td class="actions"><button onclick='editItem("${resource}",${JSON.stringify(row.id)})'>Edit</button><button onclick='deleteItem("${resource}",${JSON.stringify(row.id)})'>Delete</button></td></tr>`;
  });
  html+="</tbody></table>";
  document.getElementById(cfg.table).innerHTML=html;
}

async function editItem(resource,id){
  const row=await api("/"+configs[resource].endpoint+"/"+id);
  configs[resource].fields.forEach(f=>{
    const el=document.getElementById(formId(resource,f));
    if(el) el.value=row[f] ?? "";
  });
  window.scrollTo({top:0,behavior:"smooth"});
}

async function deleteItem(resource,id){
  if(!confirm("Delete this record?")) return;
  try{await api("/"+configs[resource].endpoint+"/"+id,{method:"DELETE"});await loadResource(resource);await loadDashboard();}
  catch(e){alert("Delete failed: "+e.message);}
}

async function saveResource(resource, event){
  event.preventDefault();
  const cfg=configs[resource];
  const obj={};
  cfg.fields.filter(f=>f!=="id").forEach(f=>{
    const el=document.getElementById(formId(resource,f));
    if(el && el.value!==""){
      obj[f]=["manufacturingYear","pricePerDay","customerId","vehicleId","totalAmount","bookingId","amount"].includes(f)
        ? Number(el.value) : el.value;
    }
  });
  const id=document.getElementById(formId(resource,"id")).value;
  const options={method:id?"PUT":"POST",body:JSON.stringify(obj)};
  try{
    await api("/"+cfg.endpoint+(id?"/"+id:""),options);
    alert(id?"Updated successfully":"Added successfully");
    resetForm(cfg.form); await loadResource(resource); await loadDashboard();
  }catch(e){alert("Save failed: "+e.message);}
}

document.getElementById("vehicleForm").addEventListener("submit",e=>saveResource("vehicles",e));
document.getElementById("customerForm").addEventListener("submit",e=>saveResource("customers",e));
document.getElementById("bookingForm").addEventListener("submit",e=>saveResource("bookings",e));
document.getElementById("paymentForm").addEventListener("submit",e=>saveResource("payments",e));

loadDashboard();
