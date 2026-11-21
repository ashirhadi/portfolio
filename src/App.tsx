import PortfolioEnhancements from './PortfolioEnhancements';
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
  const serviceSlugs: Record<string,string> = {
    'Honeywell BMS':'honeywell-bms',
    'HVAC systems':'hvac-systems',
    'Alarm response':'alarm-response',
    'Facilities operations':'facilities-operations',
    'CAFM / CMMS':'cafm-cmms',
    'MEP coordination':'mep-coordination'
  };

  const servicePages = {
    'honeywell-bms': {
      title:'Honeywell BMS',
      subtitle:'Building Management System Operations',
      intro:'Monitoring building systems through BMS graphics, equipment status, alarms and operational information.',
      sections:[
        {heading:'BMS monitoring',body:'A BMS operator observes connected building services and checks system conditions through the available control interface.',items:['Monitor BMS graphics and equipment status','Review alarms and system notifications','Observe operating trends and reported values','Communicate abnormal conditions to the responsible team']},
        {heading:'Systems and equipment',body:'Building operations can involve multiple connected services and plant equipment.',items:['HVAC system monitoring','Chiller plant status visibility','Primary and secondary pump status','Cooling tower monitoring']},
        {heading:'Operational workflow',body:'Reliable operation depends on accurate observation, communication and escalation.',items:['Check system status during the shift','Identify unusual readings or alarms','Record and communicate relevant observations','Escalate faults according to site procedures']}
      ]
    },
    'hvac-systems': {
      title:'HVAC Systems',
      subtitle:'Heating, Ventilation and Air Conditioning',
      intro:'Understanding HVAC plant operations and monitoring the condition of equipment serving a building.',
      sections:[
        {heading:'Chiller plant awareness',body:'Chiller plants support building cooling requirements through coordinated equipment operation.',items:['Understand basic chiller operating status','Observe supply and return temperature readings','Monitor plant alarms and abnormal conditions','Communicate equipment concerns to technicians']},
        {heading:'Pumps and cooling towers',body:'Pumps and cooling towers are important parts of a central cooling system.',items:['Primary and secondary chilled-water pumps','Pump run and fault status','Cooling tower operating status','General equipment condition monitoring']},
        {heading:'BMS coordination',body:'BMS information helps operators observe HVAC equipment and report issues.',items:['Review equipment graphics','Observe available temperature trends','Identify abnormal status indications','Escalate issues through site procedures']}
      ]
    },
    'alarm-response': {
      title:'Alarm Response',
      subtitle:'Alarm Awareness and Escalation',
      intro:'Recognising BMS alarms, reviewing available information and communicating issues through the correct operational channels.',
      sections:[
        {heading:'Alarm awareness',body:'Alarms can indicate abnormal equipment conditions, communication issues or system warnings.',items:['Review new and active alarms','Identify the equipment or system affected','Check available status and trend information','Recognise recurring or abnormal indications']},
        {heading:'Response workflow',body:'Follow site-approved procedures and do not make unauthorised control changes.',items:['Acknowledge and review alarms where authorised','Inform the responsible technician or supervisor','Record relevant observations and timestamps','Follow up on the reported issue']},
        {heading:'Communication',body:'Clear communication helps the maintenance team understand the issue and respond appropriately.',items:['Provide equipment identification','Share alarm description and observed status','Communicate priority through site procedures','Maintain shift handover information']}
      ]
    },
    'facilities-operations': {
      title:'Facilities Operations',
      subtitle:'Building Operations and Site Coordination',
      intro:'Supporting reliable daily building operations through monitoring, communication and coordination with site teams.',
      sections:[
        {heading:'Daily operations',body:'Facilities operations involve monitoring services and supporting continuity across the site.',items:['Observe building system status','Support operational checks','Communicate service issues','Maintain clear shift handovers']},
        {heading:'Team coordination',body:'Operators work with technicians and supervisors to communicate maintenance needs.',items:['Coordinate with site technicians','Report equipment abnormalities','Escalate unresolved issues','Share relevant operational updates']},
        {heading:'Service continuity',body:'Consistent communication and accurate reporting support dependable facilities services.',items:['Keep records of relevant events','Follow site operating procedures','Support planned maintenance coordination','Maintain professional communication']}
      ]
    },
    'cafm-cmms': {
      title:'CAFM / CMMS',
      subtitle:'Computer-Aided Facilities Management',
      intro:'Understanding how facilities teams use digital systems to manage maintenance requests, work orders and asset information.',
      sections:[
        {heading:'Work order workflow',body:'CAFM and CMMS platforms help organise maintenance tasks from request through completion.',items:['Receive or review maintenance requests','Understand work order priorities','Assign or route requests according to procedure','Track work order progress']},
        {heading:'Asset information',body:'Digital asset records help teams identify equipment and understand its maintenance history.',items:['Equipment identification','Asset location and reference details','Maintenance history awareness','Basic record accuracy']},
        {heading:'Coordination and reporting',body:'Accurate updates help supervisors understand outstanding maintenance work.',items:['Update job status when authorised','Communicate pending tasks','Monitor open and completed requests','Support shift and maintenance reporting']}
      ]
    },
    'mep-coordination': {
      title:'MEP Coordination',
      subtitle:'Mechanical, Electrical and Plumbing Services',
      intro:'Supporting coordination and communication around the building services that keep facilities operating.',
      sections:[
        {heading:'Mechanical services',body:'Mechanical services include HVAC equipment and associated plant systems.',items:['Chiller and HVAC system awareness','Pump and cooling tower status','Equipment condition observations','Coordination with maintenance technicians']},
        {heading:'Electrical services',body:'Electrical systems require safe, authorised inspection and maintenance by qualified personnel.',items:['Awareness of equipment status indications','Reporting abnormal conditions','Following site safety procedures','Escalating electrical faults to qualified teams']},
        {heading:'Plumbing services',body:'Plumbing services support water distribution and drainage throughout a facility.',items:['Recognise and report visible leakage','Communicate water-service concerns','Coordinate requests with the responsible team','Follow site procedures and safety requirements']}
      ]
    }
  } as const;

  const activeService = new URLSearchParams(window.location.search).get('service') as keyof typeof servicePages | null;
  const detail = activeService ? servicePages[activeService] : null;
  if (detail) return <main className="service-page">
    <header className="topbar">
      <a className="brand" href={import.meta.env.BASE_URL}>AH<span>.</span><small>SMART BUILDING OPERATIONS</small></a>
      <a className="service-back" href={import.meta.env.BASE_URL}>← BACK TO PORTFOLIO</a>
    </header>
    <div className="service-hero wrap">
      <span className="eyebrow">ASHIR HADI / PROFESSIONAL EXPERTISE</span>
      <h1>{detail.title}<span className="cyan">.</span></h1>
      <h2>{detail.subtitle}</h2>
      <p>{detail.intro}</p>
      <div className="service-meta">DUBAI, UAE · IMDAAD LLC · FEB 2023 — PRESENT</div>
    </div>
    <div className="service-content wrap">
      {detail.sections.map((section,i)=><article className="service-detail-card" key={section.heading}>
        <span className="eyebrow">0{i+1} / AREA OF FOCUS</span>
        <h2>{section.heading}</h2>
        <p>{section.body}</p>
        <ul>{section.items.map(item=><li key={item}>{item}</li>)}</ul>
      </article>)}
    </div>
    <footer className="footer wrap">
      <a className="brand" href={import.meta.env.BASE_URL}>ASHIR HADI<span>.</span></a>
      <a href="mailto:mashirhadi@gmail.com">CONTACT ME ↗</a>
      <a href={import.meta.env.BASE_URL}>← BACK TO PORTFOLIO</a>
    </footer>
  </main>;

  return <>
      <PortfolioEnhancements />
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
        <div className="skill-grid">{skills.map(([name,desc,tag],i)=><a className="skill-card service-card" href={`${import.meta.env.BASE_URL}?service=${serviceSlugs[name]}`} key={name}><span className="skill-index">0{i+1}</span><span className="skill-tag">{tag}</span><h3>{name}</h3><p>{desc}</p><div className="skill-line"><i style={{width:tag==='CORE'?'82%':'48%'}}/></div><span className="service-open">EXPLORE DETAILS ↗</span></a>)}</div>
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
