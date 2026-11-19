import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, ArrowUpRight, BadgeCheck, Building2, Download, Fan, Gauge, Github, Linkedin, Mail, Menu, Network, Power, ShieldCheck, Snowflake, Waves, X } from 'lucide-react';

const skills = [
  ['Honeywell BMS','Operations, monitoring and alarm awareness','CORE'],
  ['HVAC systems','Chillers, pumps and cooling towers','CORE'],
  ['Alarm response','Alarm review, escalation and follow-up','CORE'],
  ['Facilities operations','Shift coordination and reporting','CORE'],
  ['CAFM / CMMS','Work orders and maintenance workflows','DEVELOPING'],
  ['MEP coordination','Building services and maintenance support','CORE']
];
const tech = [
  ['HTML5','Web structure'],['CSS3','Visual design'],['JavaScript','Interactions'],
  ['TypeScript','Typed UI'],['React','Component UI'],['Three.js','3D visualisation'],
  ['Python','Automation learning'],['SQL','Data layer learning'],['JSON','Configuration'],
  ['SVG','Vector graphics'],['Node.js','Backend learning'],['Git / GitHub','Version control']
];

function BuildingScene() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mount.current; if (!el) return;
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#081523');
    const camera = new THREE.PerspectiveCamera(38, el.clientWidth / el.clientHeight, .1, 100);
    camera.position.set(8, 7, 11); camera.lookAt(0, 2, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight); el.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0x8cb8d7, 2));
    const light = new THREE.DirectionalLight(0x9cecff, 3); light.position.set(5, 10, 7); scene.add(light);
    const tower = new THREE.Group(); scene.add(tower);
    const base = new THREE.Mesh(new THREE.BoxGeometry(5.2,.25,4), new THREE.MeshStandardMaterial({color:0x152c40,metalness:.5,roughness:.35}));
    base.position.y=.12; tower.add(base);
    for(let floor=0; floor<5; floor++){
      const slab=new THREE.Mesh(new THREE.BoxGeometry(4.1,.12,3.1),new THREE.MeshStandardMaterial({color:0x23445c,metalness:.35,roughness:.3}));
      slab.position.y=.55+floor*.78; tower.add(slab);
      for(let x=0;x<5;x++) for(let z=0;z<3;z++){
        const lit=(x+z+floor)%4===0;
        const pane=new THREE.Mesh(new THREE.BoxGeometry(.58,.48,.045),new THREE.MeshStandardMaterial({
          color:lit?0x16d9e9:0x397b9a,emissive:lit?0x087b91:0x071b2b,emissiveIntensity:.6,metalness:.5,roughness:.2
        }));
        pane.position.set(-1.65+x*.82,.55+floor*.78,-1.1+z*1.1); tower.add(pane);
      }
    }
    const roof=new THREE.Mesh(new THREE.BoxGeometry(4.3,.18,3.3),new THREE.MeshStandardMaterial({color:0x1b3549,metalness:.5}));
    roof.position.y=4.55;tower.add(roof);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(3.7,.012,8,100),new THREE.MeshBasicMaterial({color:0x14d9e8,transparent:true,opacity:.65}));
    ring.rotation.x=Math.PI/2;ring.position.y=.15;scene.add(ring);
    let frame=0,active=true;
    const animate=()=>{if(!active)return;frame=requestAnimationFrame(animate);tower.rotation.y+=.0025;ring.rotation.z-=.001;renderer.render(scene,camera)};animate();
    const resize=()=>{if(!el.clientWidth)return;camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)};
    const observer=new ResizeObserver(resize);observer.observe(el);
    return ()=>{active=false;cancelAnimationFrame(frame);observer.disconnect();renderer.dispose();el.removeChild(renderer.domElement);
      scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const m=o.material;if(Array.isArray(m))m.forEach(v=>v.dispose());else m.dispose();}});
    };
  },[]);
  return <div className="scene" ref={mount}><span className="scene-label"><i className="live-dot"/> 3D SMART BUILDING / DIGITAL TWIN</span><span className="scene-coords">DXB · CONCEPT VISUALISATION</span></div>;
}

function Simulator(){
  const [pump,setPump]=useState(true),[chiller,setChiller]=useState(true),[tower,setTower]=useState(true);
  const ok=pump&&chiller&&tower;
  const temp=ok?6.8:chiller&&pump?9.4:13.2;
  const items=[{name:'Primary / secondary pumps',desc:'CHW circulation',on:pump,set:setPump,Icon:Waves},{name:'Chiller unit',desc:'Cooling generation',on:chiller,set:setChiller,Icon:Snowflake},{name:'Cooling tower',desc:'Heat rejection',on:tower,set:setTower,Icon:Fan}];
  return <div className="simulator">
    <div className="sim-head"><div><span className="eyebrow">INTERACTIVE TRAINING DEMO</span><h3>Chiller plant overview</h3></div><span className={ok?'state':'state warn'}><i/>{ok?'ALL SYSTEMS NORMAL':'ATTENTION REQUIRED'}</span></div>
    <div className="metric-row"><div className="metric"><span>SUPPLY WATER</span><b>{temp.toFixed(1)}°C</b><small>Simulated value</small></div><div className="metric"><span>PLANT MODE</span><b>{pump&&chiller?'AUTO':'CHECK'}</b><small>Demo state</small></div><div className="metric"><span>ACTIVE ALARMS</span><b>{ok?'00':'01'}</b><small>Simulated alarms</small></div></div>
    <div className="equipment">{items.map(({name,desc,on,set,Icon})=><button className="equipment-item" key={name} onClick={()=>set(!on)}><Icon/><span><b>{name}</b><small>{desc}</small></span><strong className={on?'on':'off'}>{on?'RUNNING':'STOPPED'}</strong><Power/></button>)}</div>
    <p className="sim-note"><ShieldCheck/> Demonstration only — not connected to a real BMS or plant controller.</p>
  </div>;
}

export default function App(){
  const [menu,setMenu]=useState(false),[now,setNow]=useState(new Date());
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(timer)},[]);
  const clock=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'Asia/Dubai'});
  const links=[['Profile','#profile'],['Expertise','#expertise'],['Experience','#experience'],['Digital twin','#digital-twin'],['Contact','#contact']];
  return <>
    <header className="topbar"><a className="brand" href="#home">AH<span>.</span><small>SMART BUILDING OPERATIONS</small></a>
      <nav className={menu?'nav open':'nav'}>{links.map(([label,href])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}</nav>
      <div className="top-actions"><span className="clock"><i className="live-dot"/> DXB {clock}</span><a href="https://www.linkedin.com/in/muhammad-ashir-hadi-6434a8359/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a><button className="menu-btn" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">{menu?<X/>:<Menu/>}</button></div>
    </header>
    <main id="home">
      <section className="hero wrap" id="profile"><div className="hero-copy">
        <div className="eyebrow"><i className="live-dot"/> DUBAI, UNITED ARAB EMIRATES</div>
        <p className="kicker">BUILDING SYSTEMS / FACILITIES OPERATIONS</p>
        <h1>Muhammad<br/><em>Ashir Hadi</em><span className="cyan">.</span></h1>
        <p className="hero-intro">Keeping buildings intelligent, systems reliable and operations moving.</p>
        <div className="roles"><span>BMS OPERATOR</span><i/> <span>ASSISTANT FACILITIES SUPERVISOR</span></div>
        <div className="hero-buttons"><a className="btn primary" href="/portfolio/resume.pdf" target="_blank"><Download/> Download CV</a><a className="btn secondary" href="#contact">Let's connect <ArrowUpRight/></a></div>
        <div className="hero-foot"><span>⌖ DUBAI, UAE</span><span>IMDAAD LLC · FEB 2023 — PRESENT</span></div>
      </div><BuildingScene/></section>
      <section className="ticker"><div>HONEYWELL BMS <b>✳</b> HVAC MONITORING <b>✳</b> ALARM RESPONSE <b>✳</b> FACILITIES OPERATIONS <b>✳</b> MEP COORDINATION</div></section>
      <section className="section wrap" id="expertise"><div className="section-head"><div><span className="eyebrow">01 / WHAT I BRING</span><h2>Operational focus.<br/><em>Technical mindset.</em></h2></div><p>Practical building operations experience supporting monitoring, first-line troubleshooting, alarm awareness and coordinated facilities maintenance.</p></div>
        <div className="skill-grid">{skills.map(([name,desc,tag],i)=><article className="skill-card" key={name}><span className="skill-index">0{i+1}</span><span className="skill-tag">{tag}</span><h3>{name}</h3><p>{desc}</p><div className="skill-line"><i style={{width:tag==='CORE'?'82%':'48%'}}/></div></article>)}</div>
      </section>
      <section className="section alt" id="experience"><div className="wrap"><div className="section-head"><div><span className="eyebrow">02 / CAREER</span><h2>Experience in<br/><em>the field.</em></h2></div><p>Focused on dependable site operations, clear communication and consistent monitoring of building services.</p></div>
        <article className="experience-card"><div className="exp-date">FEB 2023 — PRESENT<br/>DUBAI, UAE</div><div><span className="eyebrow">CURRENT ORGANISATION</span><h3>Imdaad LLC</h3><h4>BMS Operator</h4><p>Building Management System operations with exposure to Honeywell BMS monitoring, HVAC plant status, alarms and facilities coordination.</p><ul><li>Monitor BMS graphics, equipment status, trends and alarms.</li><li>Support HVAC operations across chiller plant equipment, pumps and cooling towers.</li><li>Coordinate with site technicians and escalate faults through operational channels.</li><li>Maintain clear shift communication and service continuity.</li></ul></div><div className="exp-mark"><Building2/><span>UAE</span></div></article>
      </div></section>
      <section className="section wrap" id="digital-twin"><div className="section-head"><div><span className="eyebrow">03 / SYSTEMS LAB</span><h2>Explore a<br/><em>smart building.</em></h2></div><p>A browser-based 3D concept and interactive plant-state simulator, created as a portfolio demonstration.</p></div>
        <div className="lab-grid"><BuildingScene/><div className="lab-copy"><span className="eyebrow">DIGITAL BUILDING CONCEPT</span><h3>Connected systems.<br/>Clear visibility.</h3><p>Visualise how building layers, HVAC services and operational data come together in a modern facility.</p><div className="lab-points"><span><Network/> Integrated building systems</span><span><Activity/> Equipment status awareness</span><span><Gauge/> Operational visibility</span></div></div></div><Simulator/>
      </section>
      <section className="section alt" id="technology"><div className="wrap"><div className="section-head"><div><span className="eyebrow">04 / DIGITAL TOOLKIT</span><h2>Built with<br/><em>modern tools.</em></h2></div><p>Technologies used in this portfolio, alongside tools being explored for future automation and digital building workflows.</p></div>
        <div className="tech-grid">{tech.map(([name,desc],i)=><div className="tech" key={name}><span>0{i+1}</span><b>{name}</b><small>{desc}</small></div>)}</div><p className="tech-disclaimer">Learning-stage tools are identified transparently and are not presented as professional work experience.</p>
      </div></section>
      <section className="section wrap" id="credentials"><div className="section-head"><div><span className="eyebrow">05 / CREDENTIALS</span><h2>Learning &<br/><em>development.</em></h2></div><p>Professional development in building systems, digital operations and workplace capabilities.</p></div>
        {['Honeywell BMS Certificate','Facilities Management Certificate','Computer Operator & Office Management Diplomas','Soft Skills Certificate'].map(item=><div className="credential" key={item}><BadgeCheck/><div><b>{item}</b><small>Professional training / education credential</small></div><span>PROFILE</span></div>)}
      </section>
      <section className="contact-section" id="contact"><div className="wrap contact-inner"><div><span className="eyebrow">06 / GET IN TOUCH</span><h2>Let's make<br/><em>buildings work better.</em></h2><p>Open to BMS Operator, Senior BMS Operator and Assistant Facilities Supervisor opportunities.</p></div>
        <div className="contact-links"><a href="mailto:mashirhadi@gmail.com"><Mail/> Email <ArrowUpRight/></a><a href="https://www.linkedin.com/in/muhammad-ashir-hadi-6434a8359/" target="_blank" rel="noreferrer"><Linkedin/> LinkedIn <ArrowUpRight/></a><a href="https://github.com/ashirhadi/portfolio" target="_blank" rel="noreferrer"><Github/> GitHub <ArrowUpRight/></a><a href="/portfolio/resume.pdf" target="_blank"><Download/> View CV <ArrowUpRight/></a></div></div></section>
    </main>
    <footer className="footer wrap"><a className="brand" href="#home">ASHIR HADI<span>.</span></a><span>SMART BUILDING OPERATIONS</span><span>© {now.getFullYear()} · DUBAI, UAE</span></footer>
  </>;
}
