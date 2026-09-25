// Minimal hash router
const {reactive}=Vue;
export const route=reactive({path:'/',query:{},params:{}});
const parse=()=>{const h=location.hash.slice(1)||'/';const [p,q='']=h.split('?');route.path=p;route.query=Object.fromEntries(new URLSearchParams(q));};
window.addEventListener('hashchange',parse);parse();
export const nav=p=>{location.hash=p};
