// Demo data + persistence. Everything lives in localStorage so edits survive a refresh.
const {reactive,watch}=Vue;
const KEY='flowtask-demo-v2';
const d=n=>{const x=new Date();x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
export const TEAM=[
 {id:'u1',name:'Jordan Blake',role:'Product lead',email:'jordan@acme-demo.co',color:'#0E4F52',status:'online'},
 {id:'u2',name:'Amara Osei',role:'Design',email:'amara@acme-demo.co',color:'#7A5AF8',status:'online'},
 {id:'u3',name:'Leo Martins',role:'Frontend',email:'leo@acme-demo.co',color:'#E0851F',status:'away'},
 {id:'u4',name:'Priya Nair',role:'Backend',email:'priya@acme-demo.co',color:'#2F7D5B',status:'online'},
 {id:'u5',name:'Sam Fischer',role:'Marketing',email:'sam@acme-demo.co',color:'#C2416B',status:'offline'},
 {id:'u6',name:'Mei Tanaka',role:'QA',email:'mei@acme-demo.co',color:'#3C6FD1',status:'online'}];
const P=(id,name,color,desc,due,members)=>({id,name,color,desc,due,members});
const PROJECTS=[
 P('p1','Website redesign','#0E4F52','New marketing site with a refreshed brand and faster pages.',d(18),['u1','u2','u3']),
 P('p2','Mobile app v2','#7A5AF8','Offline mode, push notifications and a new onboarding flow.',d(42),['u1','u3','u4','u6']),
 P('p3','Q4 campaign','#C2416B','Holiday launch campaign across email, social and paid.',d(9),['u5','u2']),
 P('p4','Billing migration','#2F7D5B','Move subscriptions to the new billing provider without downtime.',d(27),['u4','u6']),
 P('p5','Help centre','#E0851F','Rewrite the top 40 support articles and add in-app search.',d(55),['u5','u1'])];
let n=0;const T=(projectId,title,status,priority,assignee,due,tags=[])=>({id:'t'+(++n),projectId,title,status,priority,assignee,due:d(due),tags,created:d(-Math.abs(due)%12-2)});
const TASKS=[
 T('p1','Audit current site analytics','done','med','u1',-10,['research']),T('p1','Homepage wireframes','done','high','u2',-6,['design']),
 T('p1','Design system tokens','review','high','u1',2,['design']),T('p1','Build pricing page','progress','high','u3',4,['dev']),
 T('p1','Migrate blog posts','todo','low','u3',12,['content']),T('p1','Set up redirects','todo','med','u3',15,['dev']),
 T('p1','Accessibility pass','todo','med','u6',16,['qa']),
 T('p2','Offline sync spec','done','high','u4',-8,['spec']),T('p2','Push notification service','progress','high','u4',6,['dev']),
 T('p2','Onboarding screens','review','med','u2',3,['design']),T('p2','Crash reporting','progress','med','u3',5,['dev']),
 T('p2','Beta test plan','todo','med','u1',14,['qa']),T('p2','App store screenshots','todo','low','u2',30,['design']),
 T('p3','Campaign brief','done','high','u5',-12,['planning']),T('p3','Email sequence copy','progress','high','u5',1,['content']),
 T('p3','Social creative','review','med','u2',2,['design']),T('p3','Paid budget split','todo','high','u1',-1,['planning']),
 T('p3','Landing page','todo','med','u3',6,['dev']),
 T('p4','Map subscription plans','done','high','u4',-5,['spec']),T('p4','Webhook handlers','progress','high','u4',7,['dev']),
 T('p4','Dual-run reconciliation','todo','high','u6',18,['qa']),T('p4','Customer email notice','todo','med','u1',20,['content']),
 T('p5','Rank articles by traffic','done','med','u5',-4,['research']),T('p5','Rewrite top 10 articles','progress','med','u5',10,['content']),
 T('p5','In-app search prototype','todo','med','u1',25,['dev']),T('p5','Article template','review','low','u2',3,['design'])];
const NOTES=[
 {id:'n1',who:'u2',text:'moved “Design system tokens” to Review',at:'12 min ago',read:false,project:'p1'},
 {id:'n2',who:'u4',text:'commented on “Push notification service”',at:'1 hr ago',read:false,project:'p2'},
 {id:'n3',who:'u5',text:'assigned you “Paid budget split”',at:'3 hr ago',read:false,project:'p3'},
 {id:'n4',who:'u6',text:'completed “Beta test plan” draft',at:'Yesterday',read:true,project:'p2'},
 {id:'n5',who:'u3',text:'joined Website redesign',at:'2 days ago',read:true,project:'p1'}];
const fresh=()=>({projects:structuredClone(PROJECTS),tasks:structuredClone(TASKS),notes:structuredClone(NOTES),team:structuredClone(TEAM),
  settings:{name:'Jordan Blake',email:'jordan@acme-demo.co',theme:'light',emailDigest:true,mentions:true,dueSoon:true,weekly:false},seq:100});
let saved=null;try{saved=JSON.parse(localStorage.getItem(KEY))}catch{}
export const store=reactive(saved||fresh());
watch(store,v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}},{deep:true});
export const reset=()=>Object.assign(store,fresh());
export const user=id=>store.team.find(u=>u.id===id)||{name:'Unassigned',color:'#9AA5A6',id:''};
export const project=id=>store.projects.find(p=>p.id===id);
export const STATUSES=[{id:'todo',name:'To do'},{id:'progress',name:'In progress'},{id:'review',name:'In review'},{id:'done',name:'Done'}];
export const PRIORITY={high:'High',med:'Medium',low:'Low'};
export const initials=n=>n.split(' ').map(x=>x[0]).join('').slice(0,2);
export const today=()=>new Date().toISOString().slice(0,10);
export const fmtDate=s=>new Date(s+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric'});
export const dueLabel=s=>{const diff=Math.round((new Date(s+'T12:00')-new Date(today()+'T12:00'))/864e5);return diff<0?`${-diff}d overdue`:diff===0?'Due today':diff===1?'Due tomorrow':`Due ${fmtDate(s)}`};
export const progress=pid=>{const t=store.tasks.filter(x=>x.projectId===pid);return t.length?Math.round(t.filter(x=>x.status==='done').length/t.length*100):0};
export const newId=p=>p+(++store.seq);
