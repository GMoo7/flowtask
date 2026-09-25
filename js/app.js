import {route,nav} from './router.js';
import {Home,Pricing,Auth} from './marketing.js';
import {AppShell,Overview,Projects,Board,Tasks,Team,Analytics,Settings} from './dashboard.js';
import {store} from './store.js';
const {createApp,computed,watch,nextTick}=Vue;
const TITLES={'/app':'Overview','/app/projects':'Projects','/app/tasks':'My tasks','/app/team':'Team','/app/analytics':'Analytics','/app/settings':'Settings'};
createApp({components:{Home,Pricing,Auth,AppShell,Overview,Projects,Board,Tasks,Team,Analytics,Settings},setup(){
 const view=computed(()=>{const p=route.path;
  if(p.startsWith('/app')){
   if(!sessionStorage.getItem('ft-auth')){sessionStorage.setItem('ft-auth','1')} // live demo opens straight into the app
   const m=p.match(/^\/app\/projects\/(.+)$/);if(m)return {c:'Board',props:{id:m[1]},app:true};
   const map={'/app':'Overview','/app/projects':'Projects','/app/tasks':'Tasks','/app/team':'Team','/app/analytics':'Analytics','/app/settings':'Settings'};
   return {c:map[p]||'Overview',props:{},app:true}}
  if(p==='/pricing')return {c:'Pricing'};if(p==='/login')return {c:'Auth',props:{mode:'login'}};if(p==='/signup')return {c:'Auth',props:{mode:'signup'}};
  return {c:'Home',anchor:['/features','/how','/faq'].includes(p)?p.slice(1):null}});
 watch(()=>route.path,async p=>{await nextTick();const v=view.value;
  const pr=p.match(/^\/app\/projects\/(.+)$/);const name=pr?store.projects.find(x=>x.id===pr[1])?.name:TITLES[p];
  const D={Home:'FlowTask is a concept project-management platform: boards, tasks, team workload and analytics. Portfolio demo with a working dashboard.',Pricing:'FlowTask pricing: Free, Pro at $12 and Business at $29 per user per month (sample pricing for a concept product).',Auth:'Log in or create a FlowTask workspace. Demo credentials are filled in for you.'};
  document.querySelector('meta[name=description]').content=v.app?`${name||'Workspace'} in the FlowTask demo dashboard — projects, tasks, team and analytics with sample data.`:D[v.c];
  document.title=v.app?`${name||'Workspace'} — FlowTask`:v.c==='Pricing'?'Pricing — FlowTask':v.c==='Auth'?(v.props.mode==='login'?'Log in':'Sign up')+' — FlowTask':'FlowTask — Manage your projects. Keep your team moving.';
  if(v.anchor){document.getElementById(v.anchor)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}else window.scrollTo(0,0);
  document.getElementById('app').focus({preventScroll:true})},{immediate:true});
 return {view}},template:`
 <AppShell v-if="view.app"><component :is="view.c" v-bind="view.props" :key="view.props.id||view.c"/></AppShell>
 <component v-else :is="view.c" v-bind="view.props||{}"/>`}).mount('#app');
