import {nav,route} from './router.js';
const {ref,computed,reactive}=Vue;
export const Logo={props:['light'],template:`<a href="#/" class="logo" :class="{light}"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--lagoon)"/><path d="M9 11h8M9 16h14M9 21h10" stroke="#CFEDE3" stroke-width="3" stroke-linecap="round"/><circle cx="23" cy="11" r="2.5" fill="var(--tangerine)"/></svg><span>FlowTask</span></a>`};
export const SiteHeader={components:{Logo},setup(){const open=ref(false);return {open,route}},template:`
<div class="demo-bar"><span><b>Concept product.</b> <span class="long">FlowTask is fictional — pricing, customers and data are samples.</span><span class="short">Fictional, sample data.</span></span><a href="https://github.com/mustufashaikh/flowtask">View source</a></div>
<header class="m-head"><div class="wrap">
 <Logo/>
 <button class="m-burger" @click="open=!open" :aria-expanded="open" aria-label="Menu"><span></span><span></span></button>
 <nav :class="{open}" @click="open=false" aria-label="Main">
  <a href="#/features" >Features</a><a href="#/how">How it works</a><a href="#/pricing" :aria-current="route.path==='/pricing'?'page':null">Pricing</a><a href="#/faq">FAQ</a>
  <span class="grow"></span><a href="#/login">Log in</a><a href="#/signup" class="btn sm">Start free</a>
 </nav></div></header>`};
export const SiteFooter={components:{Logo},template:`
<footer class="m-foot"><div class="wrap">
 <div><Logo light/><p>Project management for teams who’d rather be shipping. A fictional product built as a portfolio demo.</p></div>
 <div><h4>Product</h4><a href="#/features">Features</a><a href="#/pricing">Pricing</a><a href="#/app">Live demo</a></div>
 <div><h4>Try it</h4><a href="#/signup">Sign up</a><a href="#/login">Log in</a><a href="#/app/projects/p1">Example board</a></div>
 <div><h4>About this demo</h4><a href="https://github.com/mustufashaikh/flowtask">Source code</a><a href="https://github.com/mustufashaikh">Built by Mustufa Shaikh</a><a href="#/faq">FAQ</a></div>
</div><div class="wrap base">© {{new Date().getFullYear()}} FlowTask — demo product, not a real service. Designed &amp; built by Mustufa Shaikh.</div></footer>`};

// Hero: a small live board visitors can drag cards around on
const HeroBoard={setup(){
  const cols=reactive([{id:'a',name:'To do',cards:[{t:'Write launch email',tag:'Content',c:'#C2416B'},{t:'QA checkout flow',tag:'QA',c:'#3C6FD1'}]},
   {id:'b',name:'In progress',cards:[{t:'Pricing page',tag:'Dev',c:'#E0851F',av:'LM'},{t:'Onboarding screens',tag:'Design',c:'#7A5AF8',av:'AO'}]},
   {id:'c',name:'Done',cards:[{t:'Brand refresh',tag:'Design',c:'#7A5AF8',av:'AO'}]}]);
  const drag=ref(null),over=ref(null),moved=ref(0);
  const start=(ci,i,e)=>{drag.value={ci,i};e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain','card')};
  const drop=ci=>{if(!drag.value)return;const [c]=cols[drag.value.ci].cards.splice(drag.value.i,1);cols[ci].cards.push(c);drag.value=null;over.value=null;moved.value++};
  const next=(ci,i)=>{const [c]=cols[ci].cards.splice(i,1);cols[(ci+1)%3].cards.push(c);moved.value++};
  return {cols,start,drop,over,next,moved,drag}},template:`
<div class="hero-board" aria-label="Interactive example board">
 <div class="hb-top"><span class="dots"><i></i><i></i><i></i></span><b>Website redesign</b><span class="hb-hint" aria-live="polite">{{moved?('Nice — '+moved+' '+(moved>1?'moves':'move')+'. That’s the whole idea.'):'Drag a card to another column'}}</span></div>
 <div class="hb-cols">
  <div v-for="(col,ci) in cols" :key="col.id" class="hb-col" :class="{over:over===ci}" @dragover.prevent="over=ci" @dragleave="over=null" @drop="drop(ci)">
   <h4>{{col.name}} <em>{{col.cards.length}}</em></h4>
   <transition-group name="card" tag="div" class="hb-list">
    <div v-for="(c,i) in col.cards" :key="c.t" class="hb-card" draggable="true" @dragstart="start(ci,i,$event)" :class="{dragging:drag&&drag.ci===ci&&drag.i===i}">
     <span class="tag" :style="{'--t':c.c}">{{c.tag}}</span><p>{{c.t}}</p>
     <div class="hb-foot"><span v-if="c.av" class="av xs">{{c.av}}</span><button type="button" class="hb-move" @click="next(ci,i)" :aria-label="'Move '+c.t+' to next column'">Move</button></div>
    </div></transition-group>
  </div></div></div>`};

export const TIERS=[
 {id:'free',name:'Free',m:0,y:0,blurb:'For individuals and small side projects.',cta:'Start free',feat:['Up to 3 projects','5 team members','Kanban and list views','7-day activity history']},
 {id:'pro',name:'Pro',m:12,y:10,blurb:'For growing teams that need more control.',cta:'Start 14-day trial',pop:true,feat:['Unlimited projects','Up to 25 members','Timeline and analytics','Custom fields and tags','Priority email support']},
 {id:'biz',name:'Business',m:29,y:24,blurb:'For companies running many teams at once.',cta:'Talk to sales',feat:['Everything in Pro','Unlimited members','SSO and audit log','Advanced permissions','Dedicated success manager']}];
export const PricingCards={setup(){const yearly=ref(false);return {yearly,TIERS}},template:`
<div><div class="toggle" role="group" aria-label="Billing period"><button :aria-pressed="!yearly" @click="yearly=false">Monthly</button><button :aria-pressed="yearly" @click="yearly=true">Yearly <em>Save 20%</em></button></div>
<div class="tiers">
 <article v-for="t in TIERS" :key="t.id" class="tier" :class="{pop:t.pop}">
  <p v-if="t.pop" class="pop-tag">Most popular</p>
  <h3>{{t.name}}</h3><p class="muted">{{t.blurb}}</p>
  <p class="amt"><b>\${{yearly?t.y:t.m}}</b><span v-if="t.m">per user / month{{yearly?', billed yearly':''}}</span><span v-else>forever</span></p>
  <a :href="t.id==='biz'?'#/pricing':'#/signup?plan='+t.id" class="btn block" :class="{ghost:!t.pop}">{{t.cta}}</a>
  <ul><li v-for="f in t.feat" :key="f">{{f}}</li></ul>
 </article></div><p class="muted center">Demo pricing for a fictional product.</p></div>`};

const FAQ=[['Can I try FlowTask without signing up?','Yes. Open the live demo to explore a workspace with sample projects. Your changes are saved in your browser.'],
 ['What happens when my free trial ends?','You move to the Free plan automatically. Nothing is deleted, and you can upgrade at any time.'],
 ['Can I import from other tools?','You can import projects and tasks from CSV, Trello and Asana in a few clicks.'],
 ['Is my data secure?','Data is encrypted in transit and at rest, backed up daily, and Business plans include SSO and an audit log.'],
 ['Do you offer discounts for nonprofits?','Yes — registered nonprofits and schools get 50% off Pro and Business.']];
const FEATURES=[['board','Boards that match how you work','Drag tasks between columns, set priorities and see who owns what at a glance.'],
 ['chart','Progress without status meetings','Every project shows live progress, overdue work and what’s blocked.'],
 ['bell','Notifications that matter','Get pinged for mentions and due dates, not every edit.'],
 ['team','Workload you can see','Spot who’s overloaded before deadlines slip.'],
 ['lock','Permissions for every team','Keep client work private and share only what each person needs.'],
 ['plug','Works with your tools','Connect Slack, GitHub, Google Drive and 40+ other apps.']];
const ICON={board:'<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',team:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 20c0-2 1-3.5 2.5-4"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',plug:'<path d="M9 7V3M15 7V3M6 7h12v4a6 6 0 0 1-12 0zM12 17v4"/>'};
export const Icon={props:['n'],template:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="ICON[n]"></svg>`,setup(){return {ICON}}};
const Faq={setup:()=>({FAQ}),template:`<div class="faq"><details v-for="[q,a] in FAQ" :key="q"><summary>{{q}}</summary><p>{{a}}</p></details></div>`};
const Cta={template:`<section class="m-cta"><div class="wrap"><h2>Your next project could start in two minutes.</h2><div><a href="#/signup" class="btn light">Start free</a><a href="#/app" class="btn outline-light">Open the live demo</a></div></div></section>`};

export const Home={components:{SiteHeader,SiteFooter,HeroBoard,PricingCards,Icon,Faq,Cta},setup:()=>({FEATURES}),template:`
<div class="marketing"><SiteHeader/>
<section class="m-hero"><div class="wrap">
 <div class="m-hero-copy"><h1>Manage your projects. Keep your team moving.</h1>
  <p class="lede">FlowTask gives every team one place to plan work, track progress and hit deadlines — without the weekly status meeting.</p>
  <div class="actions"><a href="#/signup" class="btn">Start free</a><a href="#/app" class="btn ghost">Open the live demo</a></div>
  <p class="muted small">Free for up to 5 people. No credit card needed.</p></div>
 <HeroBoard/></div>
 <div class="wrap logos"><span>Example customers</span><b>Northwind</b><b>Halcyon</b><b>Parcel&amp;Co</b><b>Tidewater</b><b>Brightline</b></div>
</section>
<section id="features" class="m-sec"><div class="wrap">
 <h2 class="m-h2">Everything your team needs to ship on time</h2>
 <div class="feat-list"><div v-for="[i,t,d] in FEATURES" :key="t" class="feat"><span class="f-ic"><Icon :n="i"/></span><div><h3>{{t}}</h3><p>{{d}}</p></div></div></div>
</div></section>
<section id="how" class="m-sec tint"><div class="wrap">
 <h2 class="m-h2">Up and running in an afternoon</h2>
 <ol class="how"><li><h3>Create a project</h3><p>Start blank or pick a template for launches, sprints or client work.</p></li><li><h3>Invite your team</h3><p>Add people by email and choose what each person can see and edit.</p></li><li><h3>Track progress</h3><p>Move tasks across the board and watch the dashboard update live.</p></li></ol>
</div></section>
<section id="pricing" class="m-sec"><div class="wrap"><h2 class="m-h2">Simple pricing that grows with you</h2><PricingCards/></div></section>
<section class="m-sec tint"><div class="wrap"><h2 class="m-h2">Teams that switched</h2><p class="muted" style="margin:-32px 0 32px">Sample testimonials written for this concept.</p>
 <div class="quotes">
  <figure class="big"><blockquote>“We cut our weekly status meeting entirely. Everyone just checks the dashboard.”</blockquote><figcaption><span class="av" style="background:#7A5AF8">RC</span><b>Rosa Chen</b>Head of Product, Halcyon</figcaption></figure>
  <figure><blockquote>“Onboarding took one afternoon. The board just made sense to everyone.”</blockquote><figcaption><span class="av" style="background:#2F7D5B">DK</span><b>David Kim</b>Engineering Manager, Parcel&amp;Co</figcaption></figure>
  <figure><blockquote>“Client projects stay private, and we still see the whole agency’s workload.”</blockquote><figcaption><span class="av" style="background:#E0851F">NA</span><b>Nadia Aziz</b>Operations Director, Brightline</figcaption></figure>
 </div></div></section>
<section id="faq" class="m-sec"><div class="wrap narrow"><h2 class="m-h2">Frequently asked questions</h2><Faq/></div></section>
<Cta/><SiteFooter/></div>`};

export const Pricing={components:{SiteHeader,SiteFooter,PricingCards,Faq,Cta},setup(){
 const rows=[['Projects','3','Unlimited','Unlimited'],['Team members','5','25','Unlimited'],['Kanban & list views','✓','✓','✓'],['Analytics dashboard','—','✓','✓'],['Custom fields','—','✓','✓'],['Integrations','5','40+','40+'],['SSO & audit log','—','—','✓'],['Support','Community','Priority email','Dedicated manager']];
 return {rows}},template:`
<div class="marketing"><SiteHeader/>
<section class="m-hero slim"><div class="wrap center"><h1>Pricing</h1><p class="lede">Start free. Upgrade when your team needs more.</p></div></section>
<section class="m-sec pt0"><div class="wrap"><PricingCards/></div></section>
<section class="m-sec tint"><div class="wrap"><h2 class="m-h2">Compare plans</h2>
 <div class="table-wrap"><table class="compare"><thead><tr><th scope="col">Feature</th><th scope="col">Free</th><th scope="col">Pro</th><th scope="col">Business</th></tr></thead>
 <tbody><tr v-for="r in rows" :key="r[0]"><th scope="row">{{r[0]}}</th><td v-for="(c,i) in r.slice(1)" :key="i" :class="{no:c==='—'}">{{c}}</td></tr></tbody></table></div></div></section>
<section class="m-sec"><div class="wrap narrow"><h2 class="m-h2">Billing questions</h2><Faq/></div></section><Cta/><SiteFooter/></div>`};

export const Auth={components:{Logo},props:['mode'],setup(props){
 const signup=computed(()=>props.mode==='signup');
 const f=reactive({name:'',email:'jordan@acme-demo.co',password:'demo1234',plan:route.query.plan||'free'});const err=reactive({});const busy=ref(false);
 const submit=()=>{Object.keys(err).forEach(k=>delete err[k]);
  if(signup.value&&f.name.trim().length<2)err.name='Enter your full name.';
  if(!/^\S+@\S+\.\S+$/.test(f.email))err.email='Enter a valid work email.';
  if(f.password.length<8)err.password='Use at least 8 characters.';
  if(Object.keys(err).length){setTimeout(()=>document.querySelector('[aria-invalid=true]')?.focus());return}
  busy.value=true;setTimeout(()=>{sessionStorage.setItem('ft-auth','1');nav(route.query.next||'/app')},700)};
 return {f,err,submit,busy,signup}},template:`
<div class="auth">
 <div class="auth-side"><Logo light/><blockquote>“FlowTask is the first tool our whole company actually opens every day.”<cite>Rosa Chen, Halcyon</cite></blockquote></div>
 <div class="auth-main"><form @submit.prevent="submit" novalidate>
  <h1>{{signup?'Create your workspace':'Welcome back'}}</h1>
  <p class="muted">{{signup?'Free for up to 5 people. No credit card needed.':'Demo credentials are filled in — just press Log in.'}}</p>
  <div v-if="signup" class="fld" :class="{bad:err.name}"><label for="an">Full name</label><input id="an" v-model="f.name" autocomplete="name" :aria-invalid="!!err.name"><small v-if="err.name">{{err.name}}</small></div>
  <div class="fld" :class="{bad:err.email}"><label for="ae">Work email</label><input id="ae" type="email" v-model="f.email" autocomplete="email" :aria-invalid="!!err.email"><small v-if="err.email">{{err.email}}</small></div>
  <div class="fld" :class="{bad:err.password}"><label for="ap">Password</label><input id="ap" type="password" v-model="f.password" :autocomplete="signup?'new-password':'current-password'" :aria-invalid="!!err.password"><small v-if="err.password">{{err.password}}</small></div>
  <div v-if="signup" class="fld"><label for="apl">Plan</label><select id="apl" v-model="f.plan"><option value="free">Free</option><option value="pro">Pro — 14-day trial</option><option value="biz">Business</option></select></div>
  <button class="btn block" :disabled="busy">{{busy?(signup?'Creating workspace…':'Logging in…'):(signup?'Create workspace':'Log in')}}</button>
  <p class="muted small center" v-if="signup">Already have an account? <a href="#/login">Log in</a></p>
  <p class="muted small center" v-else>New to FlowTask? <a href="#/signup">Create a workspace</a></p>
  <p class="center small"><a href="#/">Back to home</a></p>
 </form></div></div>`};
