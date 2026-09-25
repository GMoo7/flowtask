import {store,reset,user,project,STATUSES,PRIORITY,initials,fmtDate,dueLabel,progress,today,newId} from './store.js';
import {route,nav} from './router.js';
import {Logo,Icon} from './marketing.js';
import {BarChart,LineChart,Donut} from './charts.js';
const {ref,computed,reactive,watch,nextTick}=Vue;
const helpers={user,project,initials,fmtDate,dueLabel,progress,PRIORITY,STATUSES,store};
const overdue=t=>t.status!=='done'&&t.due<today();

export const Av={props:['id','size'],setup:p=>({u:computed(()=>user(p.id)),initials}),template:`<span class="av" :class="size" :style="{background:u.color}" :title="u.name">{{initials(u.name)}}</span>`};
export const toast=reactive({msg:'',t:0});
export const say=m=>{toast.msg=m;clearTimeout(toast.t);toast.t=setTimeout(()=>toast.msg='',2600)};

// Create / edit task dialog
export const modal=reactive({open:false,task:null,projectId:null,status:'todo'});
export const openTask=(task,opts={})=>{Object.assign(modal,{open:true,task,projectId:opts.projectId||task?.projectId||store.projects[0].id,status:opts.status||'todo'})};
const TaskModal={components:{Av},setup(){
 const f=reactive({});const err=ref('');const dlg=ref(null);
 watch(()=>modal.open,o=>{if(!o)return;const t=modal.task;Object.assign(f,t?{...t,tags:t.tags.join(', ')}:{title:'',projectId:modal.projectId,status:modal.status,priority:'med',assignee:'u1',due:today(),tags:''});err.value='';nextTick(()=>dlg.value?.querySelector('input')?.focus())});
 const save=()=>{if(!f.title.trim()){err.value='Give the task a title.';return}
  const data={...f,title:f.title.trim(),tags:f.tags.split(',').map(s=>s.trim()).filter(Boolean)};
  if(modal.task){Object.assign(modal.task,data);say('Task updated')}else{store.tasks.unshift({...data,id:newId('t'),created:today()});say('Task created')}modal.open=false};
 const del=()=>{store.tasks.splice(store.tasks.indexOf(modal.task),1);modal.open=false;say('Task deleted')};
 return {modal,f,err,save,del,dlg,...helpers}},template:`
<div v-if="modal.open" class="scrim" @click.self="modal.open=false" @keydown.esc="modal.open=false">
 <form class="dialog" ref="dlg" role="dialog" aria-modal="true" aria-labelledby="dlg-t" @submit.prevent="save">
  <div class="dlg-head"><h2 id="dlg-t">{{modal.task?'Edit task':'New task'}}</h2><button type="button" class="icon-btn" @click="modal.open=false" aria-label="Close">×</button></div>
  <div class="fld" :class="{bad:err}"><label for="tt">Title</label><input id="tt" v-model="f.title" placeholder="What needs doing?"><small v-if="err">{{err}}</small></div>
  <div class="grid2">
   <div class="fld"><label for="tp">Project</label><select id="tp" v-model="f.projectId"><option v-for="p in store.projects" :key="p.id" :value="p.id">{{p.name}}</option></select></div>
   <div class="fld"><label for="ts">Status</label><select id="ts" v-model="f.status"><option v-for="s in STATUSES" :key="s.id" :value="s.id">{{s.name}}</option></select></div>
   <div class="fld"><label for="ta">Assignee</label><select id="ta" v-model="f.assignee"><option v-for="u in store.team" :key="u.id" :value="u.id">{{u.name}}</option></select></div>
   <div class="fld"><label for="tpr">Priority</label><select id="tpr" v-model="f.priority"><option v-for="(v,k) in PRIORITY" :key="k" :value="k">{{v}}</option></select></div>
   <div class="fld"><label for="td">Due date</label><input id="td" type="date" v-model="f.due"></div>
   <div class="fld"><label for="tg">Tags</label><input id="tg" v-model="f.tags" placeholder="design, dev"></div>
  </div>
  <div class="dlg-foot"><button v-if="modal.task" type="button" class="btn danger-ghost" @click="del">Delete task</button><span class="grow"></span><button type="button" class="btn ghost" @click="modal.open=false">Cancel</button><button class="btn">{{modal.task?'Save changes':'Create task'}}</button></div>
 </form></div>`};

const NAV=[['/app','Overview','chart'],['/app/projects','Projects','board'],['/app/tasks','My tasks','check'],['/app/team','Team','team'],['/app/analytics','Analytics','pie'],['/app/settings','Settings','cog']];
const SIcon={props:['n'],template:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="P[n]"></svg>`,setup:()=>({P:{chart:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',board:'<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>',check:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12l3 3 5-6"/>',team:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 20c0-2 1-3.5 2.5-4"/>',pie:'<path d="M12 3v9h9A9 9 0 1 1 12 3z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',cog:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',plus:'<path d="M12 5v14M5 12h14"/>'}})};

export const AppShell={components:{Logo,SIcon,Av,TaskModal},setup(){
 const side=ref(false),bell=ref(false),menu=ref(false),q=ref('');
 const unread=computed(()=>store.notes.filter(n=>!n.read).length);
 const results=computed(()=>{const s=q.value.trim().toLowerCase();if(s.length<2)return[];return [...store.projects.filter(p=>p.name.toLowerCase().includes(s)).map(p=>({k:'p'+p.id,label:p.name,sub:'Project',go:()=>nav('/app/projects/'+p.id)})),
  ...store.tasks.filter(t=>t.title.toLowerCase().includes(s)).slice(0,6).map(t=>({k:t.id,label:t.title,sub:project(t.projectId).name,go:()=>openTask(t)}))].slice(0,8)});
 const pick=r=>{r.go();q.value=''};
 const active=p=>p==='/app'?route.path==='/app':route.path.startsWith(p);
 const readAll=()=>{store.notes.forEach(n=>n.read=true)};
 const signOut=()=>{sessionStorage.removeItem('ft-auth');nav('/')};
 watch(()=>route.path,()=>{side.value=bell.value=menu.value=false;q.value=''});
 const close=e=>{if(!e.target.closest('.pop,.pop-btn')){bell.value=false;menu.value=false}};
 document.addEventListener('click',close);
 return {NAV,side,bell,menu,q,results,pick,unread,active,readAll,signOut,store,user,toast,openTask,route}},template:`
<div class="app" :data-theme="store.settings.theme">
 <aside class="side" :class="{open:side}">
  <div class="side-top"><Logo/></div>
  <nav aria-label="App"><a v-for="[p,l,i] in NAV" :key="p" :href="'#'+p" :class="{on:active(p)}" :aria-current="active(p)?'page':null"><SIcon :n="i"/>{{l}}</a></nav>
  <div class="side-proj"><h4>Projects</h4><a v-for="p in store.projects" :key="p.id" :href="'#/app/projects/'+p.id" :class="{on:route.path==='/app/projects/'+p.id}"><i :style="{background:p.color}"></i>{{p.name}}</a></div>
  <div class="side-demo"><b>Demo workspace</b><span>Sample data, saved only in this browser.</span></div>
  <div class="side-plan"><b>Pro trial</b><span>9 days left</span><div class="bar"><span style="width:36%"></span></div><a href="#/pricing">Upgrade plan</a></div>
 </aside>
 <div v-if="side" class="side-scrim" @click="side=false"></div>
 <div class="main">
  <header class="top">
   <button class="icon-btn mob" @click="side=true" aria-label="Open navigation"><SIcon n="menu"/></button>
   <div class="search"><SIcon n="search"/><label for="gs" class="sr">Search projects and tasks</label><input id="gs" v-model="q" placeholder="Search projects and tasks" autocomplete="off" @keydown.esc="q=''" @keydown.enter="results[0]&&pick(results[0])">
    <ul v-if="results.length" class="results"><li v-for="r in results" :key="r.k"><button @click="pick(r)"><b>{{r.label}}</b><span>{{r.sub}}</span></button></li></ul>
    <div v-else-if="q.trim().length>1" class="results empty-r">No projects or tasks match “{{q}}”.</div></div>
   <button class="btn sm new" @click="openTask(null)"><SIcon n="plus"/><span>New task</span></button>
   <div class="rel"><button class="icon-btn pop-btn" @click="bell=!bell;menu=false" :aria-expanded="bell" :aria-label="'Notifications, '+unread+' unread'"><SIcon n="bell"/><em v-if="unread" class="dot">{{unread}}</em></button>
    <div v-if="bell" class="pop notes"><div class="pop-head"><b>Notifications</b><button class="link" @click="readAll" :disabled="!unread">Mark all as read</button></div>
     <ul><li v-for="n in store.notes" :key="n.id" :class="{unread:!n.read}" @click="n.read=true"><Av :id="n.who" size="sm"/><p><b>{{user(n.who).name}}</b> {{n.text}}<small>{{n.at}}</small></p></li></ul></div></div>
   <div class="rel"><button class="pop-btn me" @click="menu=!menu;bell=false" :aria-expanded="menu" aria-label="Account menu"><Av id="u1"/></button>
    <div v-if="menu" class="pop menu"><p><b>{{store.settings.name}}</b><small>{{store.settings.email}}</small></p><a href="#/app/settings">Settings</a><a href="#/">Marketing site</a><button @click="signOut">Sign out</button></div></div>
  </header>
  <div class="page"><slot/></div>
 </div>
 <TaskModal/>
 <div class="toast" :class="{show:toast.msg}" role="status" aria-live="polite">{{toast.msg}}</div>
</div>`};

const TaskRow={components:{Av},props:['t','showProject'],setup:()=>({...helpers,openTask,overdue}),template:`
<li class="trow" :class="{done:t.status==='done'}">
 <input type="checkbox" :checked="t.status==='done'" @change="t.status=$event.target.checked?'done':'todo'" :aria-label="'Mark '+t.title+' as done'">
 <button class="trow-t" @click="openTask(t)">{{t.title}}</button>
 <span v-if="showProject" class="proj-chip"><i :style="{background:project(t.projectId).color}"></i>{{project(t.projectId).name}}</span>
 <span class="prio" :class="t.priority">{{PRIORITY[t.priority]}}</span>
 <span class="due" :class="{late:overdue(t)}">{{t.status==='done'?'Done':dueLabel(t.due)}}</span>
 <Av :id="t.assignee" size="sm"/>
</li>`};

export const Overview={components:{Av,TaskRow,BarChart},setup(){
 const mine=computed(()=>store.tasks.filter(t=>t.assignee==='u1'&&t.status!=='done').sort((a,b)=>a.due.localeCompare(b.due)));
 const stats=computed(()=>{const t=store.tasks;return [{l:'Open tasks',v:t.filter(x=>x.status!=='done').length,s:'across '+store.projects.length+' projects'},{l:'Completed',v:t.filter(x=>x.status==='done').length,s:'this month'},{l:'Overdue',v:t.filter(overdue).length,s:'need attention',warn:true},{l:'In review',v:t.filter(x=>x.status==='review').length,s:'waiting for feedback'}]});
 const week=[{label:'Mon',value:4},{label:'Tue',value:7},{label:'Wed',value:5},{label:'Thu',value:9},{label:'Fri',value:6},{label:'Sat',value:1},{label:'Sun',value:2}];
 const hour=new Date().getHours();const greet=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';
 return {mine,stats,week,greet,...helpers}},template:`
<div><div class="ph"><div><h1>{{greet}}, {{store.settings.name.split(' ')[0]}}</h1><p class="muted">Here’s what’s happening across your workspace today.</p></div></div>
<div class="stats"><div v-for="s in stats" :key="s.l" class="stat" :class="{warn:s.warn&&s.v}"><span>{{s.l}}</span><b>{{s.v}}</b><small>{{s.s}}</small></div></div>
<div class="cols-2">
 <section class="panel"><div class="panel-h"><h2>Your tasks</h2><a href="#/app/tasks" class="link">View all</a></div>
  <ul class="tlist" v-if="mine.length"><TaskRow v-for="t in mine.slice(0,6)" :key="t.id" :t="t" show-project/></ul><p v-else class="empty-p">You’re all caught up. Nothing assigned to you is open.</p></section>
 <section class="panel"><div class="panel-h"><h2>Tasks completed this week</h2></div><BarChart :data="week"/></section>
</div>
<section class="panel"><div class="panel-h"><h2>Project progress</h2><a href="#/app/projects" class="link">All projects</a></div>
 <div class="plist"><a v-for="p in store.projects" :key="p.id" :href="'#/app/projects/'+p.id" class="prow"><i :style="{background:p.color}"></i><b>{{p.name}}</b>
  <div class="bar"><span :style="{width:progress(p.id)+'%',background:p.color}"></span></div><em>{{progress(p.id)}}%</em>
  <span class="stack"><Av v-for="m in p.members.slice(0,3)" :key="m" :id="m" size="sm"/></span><small class="muted">Due {{fmtDate(p.due)}}</small></a></div></section>
</div>`};

export const Projects={components:{Av},setup(){
 const view=ref('grid'),adding=ref(false),name=ref(''),err=ref('');
 const counts=pid=>{const t=store.tasks.filter(x=>x.projectId===pid);return {open:t.filter(x=>x.status!=='done').length,all:t.length}};
 const palette=['#0E4F52','#7A5AF8','#C2416B','#2F7D5B','#E0851F','#3C6FD1'];
 const add=()=>{if(!name.value.trim()){err.value='Name the project first.';return}const d=new Date();d.setDate(d.getDate()+30);
  const p={id:newId('p'),name:name.value.trim(),color:palette[store.projects.length%6],desc:'New project — add a description in settings.',due:d.toISOString().slice(0,10),members:['u1']};
  store.projects.push(p);name.value='';adding.value=false;err.value='';say('Project created');nav('/app/projects/'+p.id)};
 return {view,counts,adding,name,add,err,...helpers}},template:`
<div><div class="ph"><div><h1>Projects</h1><p class="muted">{{store.projects.length}} active projects</p></div>
 <div class="ph-act"><div class="seg" role="group" aria-label="View"><button :aria-pressed="view==='grid'" @click="view='grid'">Grid</button><button :aria-pressed="view==='list'" @click="view='list'">List</button></div><button class="btn sm" @click="adding=true">New project</button></div></div>
<form v-if="adding" class="panel inline-add" @submit.prevent="add"><label for="np" class="sr">Project name</label><input id="np" v-model="name" placeholder="Project name" autofocus><button class="btn sm">Create project</button><button type="button" class="btn sm ghost" @click="adding=false">Cancel</button><small v-if="err" class="err">{{err}}</small></form>
<div :class="view==='grid'?'pgrid':'plist panel'">
 <a v-for="p in store.projects" :key="p.id" :href="'#/app/projects/'+p.id" :class="view==='grid'?'pcard':'prow'">
  <template v-if="view==='grid'"><div class="pc-top"><i :style="{background:p.color}"></i><small class="muted">Due {{fmtDate(p.due)}}</small></div><h3>{{p.name}}</h3><p class="muted">{{p.desc}}</p>
   <div class="bar"><span :style="{width:progress(p.id)+'%',background:p.color}"></span></div>
   <div class="pc-foot"><span>{{progress(p.id)}}% · {{counts(p.id).open}} open</span><span class="stack"><Av v-for="m in p.members" :key="m" :id="m" size="sm"/></span></div></template>
  <template v-else><i :style="{background:p.color}"></i><b>{{p.name}}</b><div class="bar"><span :style="{width:progress(p.id)+'%',background:p.color}"></span></div><em>{{progress(p.id)}}%</em><span class="stack"><Av v-for="m in p.members.slice(0,3)" :key="m" :id="m" size="sm"/></span><small class="muted">{{counts(p.id).open}} open</small></template>
 </a></div></div>`};

export const Board={components:{Av},props:['id'],setup(props){
 const p=computed(()=>project(props.id));const who=ref('all');const drag=ref(null),over=ref(null);
 const cols=computed(()=>STATUSES.map(s=>({...s,tasks:store.tasks.filter(t=>t.projectId===props.id&&t.status===s.id&&(who.value==='all'||t.assignee===who.value))})));
 const start=(t,e)=>{drag.value=t;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',t.id)};
 const drop=s=>{if(drag.value&&drag.value.status!==s){drag.value.status=s;say(`Moved to ${STATUSES.find(x=>x.id===s).name}`)}drag.value=null;over.value=null};
 return {p,cols,who,start,drop,over,drag,openTask,overdue,...helpers}},template:`
<div v-if="p"><div class="ph"><div><p class="crumb"><a href="#/app/projects">Projects</a> / {{p.name}}</p><h1><i class="pdot" :style="{background:p.color}"></i>{{p.name}}</h1><p class="muted">{{p.desc}}</p></div>
 <div class="ph-act"><span class="stack"><Av v-for="m in p.members" :key="m" :id="m"/></span><label class="sr" for="who">Filter by assignee</label><select id="who" v-model="who"><option value="all">Everyone</option><option v-for="m in p.members" :key="m" :value="m">{{user(m).name}}</option></select></div></div>
<div class="prog-line"><div class="bar"><span :style="{width:progress(p.id)+'%',background:p.color}"></span></div><b>{{progress(p.id)}}% complete</b><small class="muted">Due {{fmtDate(p.due)}}</small></div>
<div class="board">
 <section v-for="c in cols" :key="c.id" class="col" :class="{over:over===c.id}" @dragover.prevent="over=c.id" @dragleave.self="over=null" @drop="drop(c.id)" :aria-label="c.name">
  <h2>{{c.name}} <em>{{c.tasks.length}}</em></h2>
  <transition-group name="card" tag="div" class="col-list">
  <article v-for="t in c.tasks" :key="t.id" class="tcard" draggable="true" @dragstart="start(t,$event)" @dragend="drag=null;over=null" :class="{dragging:drag===t}">
   <button class="tcard-t" @click="openTask(t)">{{t.title}}</button>
   <div class="tags"><span v-for="g in t.tags" :key="g" class="tag">{{g}}</span><span class="prio" :class="t.priority">{{PRIORITY[t.priority]}}</span></div>
   <div class="tc-foot"><span class="due" :class="{late:overdue(t)}">{{t.status==='done'?'Done':dueLabel(t.due)}}</span>
    <label class="sr" :for="'mv'+t.id">Move {{t.title}}</label><select :id="'mv'+t.id" class="mv" v-model="t.status" title="Move to column"><option v-for="s in STATUSES" :key="s.id" :value="s.id">{{s.name}}</option></select><Av :id="t.assignee" size="sm"/></div>
  </article></transition-group>
  <button class="add-card" @click="openTask(null,{projectId:p.id,status:c.id})">+ Add task</button>
 </section></div></div>
<div v-else class="panel empty-p"><h2>Project not found</h2><p>It may have been removed. <a href="#/app/projects">Back to projects</a></p></div>`};

export const Tasks={components:{TaskRow},setup(){
 const f=reactive({who:'u1',status:'open',prio:'all',q:'',sort:'due'});
 const list=computed(()=>{let t=store.tasks.filter(x=>(f.who==='all'||x.assignee===f.who)&&(f.status==='all'||(f.status==='open'?x.status!=='done':f.status==='overdue'?overdue(x):x.status===f.status))&&(f.prio==='all'||x.priority===f.prio)&&(!f.q||x.title.toLowerCase().includes(f.q.toLowerCase())));
  const pr={high:0,med:1,low:2};return t.sort(f.sort==='due'?(a,b)=>a.due.localeCompare(b.due):(a,b)=>pr[a.priority]-pr[b.priority])});
 return {f,list,openTask,...helpers}},template:`
<div><div class="ph"><div><h1>{{f.who==='u1'?'My tasks':'All tasks'}}</h1><p class="muted">{{list.length}} tasks</p></div><button class="btn sm" @click="openTask(null)">New task</button></div>
<div class="filters-bar panel">
 <label class="sr" for="fq">Search tasks</label><input id="fq" v-model="f.q" placeholder="Search tasks">
 <label class="sr" for="fw">Assignee</label><select id="fw" v-model="f.who"><option value="u1">Assigned to me</option><option value="all">Everyone</option><option v-for="u in store.team.slice(1)" :key="u.id" :value="u.id">{{u.name}}</option></select>
 <label class="sr" for="fs">Status</label><select id="fs" v-model="f.status"><option value="open">Open</option><option value="overdue">Overdue</option><option v-for="s in STATUSES" :key="s.id" :value="s.id">{{s.name}}</option><option value="all">All statuses</option></select>
 <label class="sr" for="fp">Priority</label><select id="fp" v-model="f.prio"><option value="all">Any priority</option><option v-for="(v,k) in PRIORITY" :key="k" :value="k">{{v}}</option></select>
 <label class="sr" for="fo">Sort</label><select id="fo" v-model="f.sort"><option value="due">Sort by due date</option><option value="prio">Sort by priority</option></select></div>
<section class="panel"><ul class="tlist" v-if="list.length"><TaskRow v-for="t in list" :key="t.id" :t="t" show-project/></ul>
 <div v-else class="empty-p"><h3>No tasks match these filters</h3><p>Try “Everyone” or “All statuses”, or create a new task.</p></div></section></div>`};

export const Team={components:{Av},setup(){
 const inv=ref(false),email=ref(''),role=ref('Member'),err=ref('');
 const load=id=>store.tasks.filter(t=>t.assignee===id&&t.status!=='done').length;
 const invite=()=>{if(!/^\S+@\S+\.\S+$/.test(email.value)){err.value='Enter a valid email address.';return}
  const name=email.value.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  store.team.push({id:newId('u'),name,role:role.value,email:email.value,color:'#5F6B6D',status:'invited'});say('Invite sent to '+email.value);email.value='';inv.value=false;err.value=''};
 return {inv,email,role,err,invite,load,...helpers}},template:`
<div><div class="ph"><div><h1>Team</h1><p class="muted">{{store.team.length}} members</p></div><button class="btn sm" @click="inv=!inv">Invite member</button></div>
<form v-if="inv" class="panel inline-add" @submit.prevent="invite"><label for="ie" class="sr">Email</label><input id="ie" v-model="email" type="email" placeholder="name@company.com" autofocus><label for="ir" class="sr">Role</label><select id="ir" v-model="role"><option>Member</option><option>Admin</option><option>Guest</option></select><button class="btn sm">Send invite</button><small v-if="err" class="err">{{err}}</small></form>
<div class="team-grid"><article v-for="u in store.team" :key="u.id" class="member panel">
 <div class="m-top"><Av :id="u.id" size="lg"/><span class="st" :class="u.status">{{u.status}}</span></div>
 <h3>{{u.name}}</h3><p class="muted">{{u.role}}</p><a :href="'mailto:'+u.email" class="small">{{u.email}}</a>
 <div class="load"><span>Open tasks</span><b>{{load(u.id)}}</b></div><div class="bar"><span :style="{width:Math.min(100,load(u.id)*20)+'%',background:load(u.id)>4?'var(--tangerine)':'var(--lagoon)'}"></span></div>
</article></div></div>`};

export const Analytics={components:{BarChart,LineChart,Donut},setup(){
 const range=ref('8w');
 const labels=computed(()=>range.value==='8w'?['W1','W2','W3','W4','W5','W6','W7','W8']:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug']);
 const series=computed(()=>range.value==='8w'?[{name:'Created',color:'#9AA5A6',values:[14,18,15,22,19,24,21,26]},{name:'Completed',color:'var(--lagoon)',values:[10,15,14,19,20,22,23,25]}]:[{name:'Created',color:'#9AA5A6',values:[60,72,68,80,95,88,102,110]},{name:'Completed',color:'var(--lagoon)',values:[52,66,70,74,90,92,98,108]}]);
 const status=computed(()=>STATUSES.map((s,i)=>({label:s.name,value:store.tasks.filter(t=>t.status===s.id).length,color:['#C7D0D1','#E0851F','#7A5AF8','#0E4F52'][i]})));
 const perPerson=computed(()=>store.team.slice(0,6).map(u=>({label:u.name.split(' ')[0],value:store.tasks.filter(t=>t.assignee===u.id&&t.status==='done').length})));
 const kpi=computed(()=>{const done=store.tasks.filter(t=>t.status==='done').length;return [['Completion rate',Math.round(done/store.tasks.length*100)+'%'],['Avg. cycle time','3.2 days'],['On-time delivery','87%'],['Active members',store.team.filter(u=>u.status!=='invited').length]]});
 return {range,labels,series,status,perPerson,kpi}},template:`
<div><div class="ph"><div><h1>Analytics</h1><p class="muted">How work is moving across the workspace.</p></div><div class="seg" role="group" aria-label="Date range"><button :aria-pressed="range==='8w'" @click="range='8w'">8 weeks</button><button :aria-pressed="range==='8m'" @click="range='8m'">8 months</button></div></div>
<div class="stats"><div v-for="[l,v] in kpi" :key="l" class="stat"><span>{{l}}</span><b>{{v}}</b></div></div>
<section class="panel"><div class="panel-h"><h2>Created vs completed</h2><div class="legend"><span v-for="s in series" :key="s.name"><i :style="{background:s.color}"></i>{{s.name}}</span></div></div><LineChart :series="series" :labels="labels"/></section>
<div class="cols-2"><section class="panel"><div class="panel-h"><h2>Tasks by status</h2></div><Donut :data="status"/></section>
<section class="panel"><div class="panel-h"><h2>Completed by person</h2></div><BarChart :data="perPerson" color="#7A5AF8"/></section></div></div>`};

export const Settings={setup(){
 const s=store.settings;const form=reactive({name:s.name,email:s.email});const err=ref('');
 const save=()=>{if(form.name.trim().length<2){err.value='Enter your name.';return}if(!/^\S+@\S+\.\S+$/.test(form.email)){err.value='Enter a valid email.';return}err.value='';s.name=form.name.trim();s.email=form.email;store.team[0].name=s.name;say('Profile saved')};
 const doReset=()=>{if(confirm('Reset the demo? All projects, tasks and settings go back to the sample data.')){reset();form.name=store.settings.name;form.email=store.settings.email;say('Demo data reset')}};
 const T=[['emailDigest','Daily email digest','A summary of what changed in your projects.'],['mentions','Mentions','When someone @mentions you in a comment.'],['dueSoon','Due-date reminders','A day before tasks assigned to you are due.'],['weekly','Weekly report','Team progress every Monday morning.']];
 return {s,form,err,save,doReset,T,store}},template:`
<div><div class="ph"><div><h1>Settings</h1><p class="muted">Manage your profile, notifications and appearance.</p></div></div>
<div class="settings">
 <form class="panel" @submit.prevent="save"><h2>Profile</h2>
  <div class="fld"><label for="sn">Full name</label><input id="sn" v-model="form.name"></div>
  <div class="fld"><label for="se">Email</label><input id="se" type="email" v-model="form.email"></div>
  <small v-if="err" class="err">{{err}}</small><button class="btn sm">Save profile</button></form>
 <section class="panel"><h2>Appearance</h2><div class="seg" role="group" aria-label="Theme"><button :aria-pressed="s.theme==='light'" @click="s.theme='light'">Light</button><button :aria-pressed="s.theme==='dark'" @click="s.theme='dark'">Dark</button></div></section>
 <section class="panel"><h2>Notifications</h2><div v-for="[k,l,d] in T" :key="k" class="switch-row"><div><b>{{l}}</b><small class="muted">{{d}}</small></div>
  <button class="switch" role="switch" :aria-checked="s[k]" @click="s[k]=!s[k]" :aria-label="l"><span></span></button></div></section>
 <section class="panel danger"><h2>Demo data</h2><p class="muted">Your changes are saved in this browser. Reset to start over with the sample workspace.</p><button class="btn sm danger-ghost" @click="doReset">Reset demo data</button></section>
</div></div>`};
