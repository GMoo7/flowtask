// Lightweight SVG chart components — no chart library needed.
export const BarChart={props:['data','color'],template:`
<svg :viewBox="'0 0 '+W+' '+H" class="chart" role="img" :aria-label="label">
 <g v-for="(g,i) in grid" :key="i"><line :x1="30" :x2="W" :y1="y(g)" :y2="y(g)" class="gridl"/><text :x="24" :y="y(g)+4" class="ax" text-anchor="end">{{g}}</text></g>
 <g v-for="(d,i) in data" :key="d.label">
  <rect :x="x(i)" :y="y(d.value)" :width="bw" :height="Math.max(0,H-24-y(d.value))" rx="5" :fill="color||'var(--lagoon)'"><title>{{d.label}}: {{d.value}}</title></rect>
  <text :x="x(i)+bw/2" :y="H-6" class="ax" text-anchor="middle">{{d.label}}</text></g>
</svg>`,computed:{W:()=>420,H:()=>200,max(){return Math.max(4,...this.data.map(d=>d.value))},grid(){const s=Math.ceil(this.max/4);return [0,s,s*2,s*3,s*4]},
 bw(){return (this.W-40)/this.data.length*.56},label(){return this.data.map(d=>d.label+' '+d.value).join(', ')}},
 methods:{y(v){return 10+(this.H-34)*(1-v/this.grid[4])},x(i){const step=(this.W-40)/this.data.length;return 36+i*step+(step-this.bw)/2}}};
export const LineChart={props:['series','labels'],template:`
<svg viewBox="0 0 420 200" class="chart" role="img" aria-label="Line chart">
 <g v-for="g in [0,.25,.5,.75,1]" :key="g"><line x1="30" x2="420" :y1="10+156*(1-g)" :y2="10+156*(1-g)" class="gridl"/><text x="24" :y="14+156*(1-g)" class="ax" text-anchor="end">{{Math.round(max*g)}}</text></g>
 <g v-for="s in series" :key="s.name"><path :d="area(s.values)" :fill="s.color" opacity=".1"/><path :d="line(s.values)" fill="none" :stroke="s.color" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  <circle v-for="(v,i) in s.values" :key="i" :cx="px(i)" :cy="py(v)" r="3.5" :fill="s.color"><title>{{s.name}}, {{labels[i]}}: {{v}}</title></circle></g>
 <text v-for="(l,i) in labels" :key="l" :x="px(i)" y="194" class="ax" text-anchor="middle">{{l}}</text>
</svg>`,computed:{max(){return Math.ceil(Math.max(...this.series.flatMap(s=>s.values))/10)*10}},
 methods:{px(i){return 40+i*(370/(this.labels.length-1))},py(v){return 10+156*(1-v/this.max)},line(v){return v.map((y,i)=>(i?'L':'M')+this.px(i)+' '+this.py(y)).join('')},area(v){return this.line(v)+`L${this.px(v.length-1)} 166L${this.px(0)} 166Z`}}};
export const Donut={props:['data'],template:`
<div class="donut"><svg viewBox="0 0 120 120" role="img" :aria-label="data.map(d=>d.label+' '+d.value).join(', ')">
 <circle cx="60" cy="60" r="46" fill="none" stroke="var(--line)" stroke-width="16"/>
 <circle v-for="s in segs" :key="s.label" cx="60" cy="60" r="46" fill="none" :stroke="s.color" stroke-width="16" :stroke-dasharray="s.len+' '+(C-s.len)" :stroke-dashoffset="-s.off" transform="rotate(-90 60 60)"><title>{{s.label}}: {{s.value}}</title></circle>
 <text x="60" y="58" text-anchor="middle" class="d-big">{{total}}</text><text x="60" y="74" text-anchor="middle" class="ax">tasks</text></svg>
 <ul><li v-for="s in segs" :key="s.label"><i :style="{background:s.color}"></i>{{s.label}}<b>{{s.value}}</b></li></ul></div>`,
 computed:{C:()=>2*Math.PI*46,total(){return this.data.reduce((a,b)=>a+b.value,0)},segs(){let off=0;return this.data.map(d=>{const len=this.total?d.value/this.total*this.C:0;const s={...d,len,off};off+=len;return s})}}};
