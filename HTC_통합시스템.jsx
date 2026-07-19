import { useState, useEffect } from "react";

const G = {
  900:"#1B5E20", 700:"#2E7D32", 500:"#388E3C",
  200:"#A5D6A7", 50:"#E8F5E9", 25:"#F1F8E9",
  white:"#FFFFFF", gray9:"#111827", gray6:"#4B5563",
  gray4:"#9CA3AF", gray1:"#F3F4F6",
  amber:"#F59E0B", ambBg:"#FFFBEB",
  red:"#DC2626", redBg:"#FEF2F2",
  blue:"#1D4ED8", bluBg:"#EFF6FF",
};

const ROLES = {
  staff:    { label:"치료사",  color:G[700] },
  branch:   { label:"지부장",  color:G.blue },
  director: { label:"센터장",  color:G[900] },
};

const DEFAULT_USERS = [
  { id:"u1", name:"김예진", role:"staff",    pw:"1234" },
  { id:"u2", name:"이수민", role:"branch",   pw:"1234" },
  { id:"u3", name:"박진우", role:"director", pw:"1234" },
  { id:"u4", name:"박지현", role:"staff",    pw:"1234" },
];

const DEFAULT_CLIENTS = [
  { id:"C-001", name:"김 ○ ○", age:9,  inst:"삼산초등학교",    program:"느린학습자 원예치료", therapist:"김예진", done:12, total:12, status:"진행중",   goal:"주의집중력 향상", note:"또래 자발적 대화 관찰",
    sessions:[
      {no:1, date:"2026.04.07", attend:true, activity:"자기소개 꽃 이름표 만들기", memo:"라포 형성. 다소 긴장된 모습이나 활동 참여 양호."},
      {no:2, date:"2026.04.14", attend:true, activity:"채소 씨앗 파종 및 관찰일지 작성", memo:"씨앗 심기 활동에 집중. 지속시간 약 8분."},
      {no:11,date:"2026.06.23", attend:true, activity:"미니 테라리움 제작", memo:"또래와 자발적 대화 2회 관찰. 집중 지속시간 18분으로 증가."},
      {no:12,date:"2026.06.30", attend:true, activity:"성장 전시회·수료식",  memo:"소감 발표 완수. 집중 지속시간 22분 달성."},
    ],
    outcomes:[{item:"주의집중 지속시간",pre:"5분",post:"22분"},{item:"충동적 행동",pre:"8회/회기",post:"2회/회기"}]
  },
  { id:"C-002", name:"이 ○ ○", age:8,  inst:"삼산초등학교",    program:"느린학습자 원예치료", therapist:"김예진", done:10, total:12, status:"진행중",   goal:"감각통합 촉진",   note:"허브 4종 구분 성공",
    sessions:[
      {no:1, date:"2026.04.07", attend:true, activity:"자기소개 꽃 이름표 만들기", memo:"흙 만지기 거부. 장갑 착용 후 참여."},
      {no:10,date:"2026.06.16", attend:true, activity:"상추 수확 및 미니 샐러드",   memo:"흙 거부 없음. 허브 4종 정확히 구분."},
    ],
    outcomes:[{item:"감각 거부 반응",pre:"빈번",post:"거의 없음"}]
  },
  { id:"C-003", name:"박 ○ ○", age:10, inst:"남구청 복지관",   program:"ADHD 원예치료",       therapist:"이수민", done:12, total:12, status:"종결완료", goal:"충동 조절",       note:"수료식 소감 발표 완수",
    sessions:[
      {no:12,date:"2026.06.28", attend:true, activity:"마무리 수료식", memo:"소감 발표 자발적으로 완수. 충동 행동 현저히 감소."},
    ],
    outcomes:[{item:"충동적 행동 빈도",pre:"회기당 8회",post:"회기당 2회"},{item:"자기효능감 척도",pre:"2.1점",post:"3.8점"}]
  },
];

const DEFAULT_CENTER_DOCS = [
  { id:"CD-001", type:"사업자등록증",  name:"박진우원예치료센터 사업자등록증", uploadDate:"", file:null, registered:false },
  { id:"CD-002", type:"통장사본",      name:"박진우원예치료센터 통장사본",     uploadDate:"", file:null, registered:false },
];

const DEFAULT_STAFF_PROFILES = {
  "김예진": {
    name:"김예진", birth:"1995", gender:"여",
    phone:"010-0000-0000", email:"",
    address:"울산광역시",
    education:[
      { year:"2018", school:"○○대학교", major:"원예학과", degree:"학사" },
    ],
    certs:[
      { year:"2020", name:"원예치료사 1급", issuer:"한국원예치료복지협회", no:"제2020-001호" },
    ],
    career:[
      { period:"2021.03 ~ 현재", org:"박진우원예치료센터", position:"원예치료사", note:"" },
    ],
    training:[
      { year:"2022", name:"사례개념화 기반 원예치료 전문과정", org:"한국원예치유연구소", hours:20 },
    ],
  },
  "박지현": {
    name:"박지현", birth:"1997", gender:"여",
    phone:"010-0000-0000", email:"",
    address:"울산광역시",
    education:[
      { year:"2020", school:"○○대학교", major:"원예치료학과", degree:"학사" },
    ],
    certs:[
      { year:"2022", name:"원예치료사 2급", issuer:"한국원예치료복지협회", no:"제2022-015호" },
    ],
    career:[
      { period:"2022.09 ~ 현재", org:"박진우원예치료센터", position:"원예치료사", note:"" },
    ],
    training:[],
  },
};

const DEFAULT_STAFF_DOCS = {
  "김예진": [
    { id:"SD-001", type:"자격증사본",     name:"원예치료사 1급 자격증", uploadDate:"", registered:false },
    { id:"SD-003", type:"강사료입금통장", name:"강사료 입금 통장사본",  uploadDate:"", registered:false },
  ],
  "박지현": [
    { id:"SD-004", type:"자격증사본",     name:"원예치료사 2급 자격증", uploadDate:"", registered:false },
    { id:"SD-006", type:"강사료입금통장", name:"강사료 입금 통장사본",  uploadDate:"", registered:false },
  ],
};

const DEFAULT_INSTS = [
  { id:"I-001", name:"삼산초등학교",      type:"학교",  contact:"교장 선생님", phone:"052-000-0001", email:"" },
  { id:"I-002", name:"남구청 복지관",      type:"복지관", contact:"프로그램팀장", phone:"052-000-0002", email:"" },
  { id:"I-003", name:"동구 장애인복지관",  type:"복지관", contact:"재활팀장",    phone:"052-000-0003", email:"" },
  { id:"I-004", name:"북구 드림센터",      type:"센터",  contact:"교육팀장",    phone:"052-000-0004", email:"" },
];

const DEFAULT_DOCS = [
  { id:"HTC-2026-011", type:"plan",    title:"느린학습자 원예치료 계획서",   inst:"삼산초등학교",       writer:"김예진", date:"2026.07.12", status:"지부장대기", comment:"" },
  { id:"HTC-2026-010", type:"gongmun", title:"ADHD 원예치료 MOU 체결 요청", inst:"남구청 복지관",       writer:"이수민", date:"2026.07.10", status:"완료",      comment:"검토 완료. 승인합니다." },
  { id:"HTC-2026-009", type:"est",     title:"감각통합 원예치료 견적서",     inst:"동구 장애인복지관",   writer:"박지현", date:"2026.07.08", status:"센터장대기", comment:"" },
  { id:"INT-2026-008", type:"vac",     title:"연차 휴가 신청",               inst:"내부",               writer:"김예진", date:"2026.07.07", status:"완료",      comment:"승인합니다." },
  { id:"INT-2026-007", type:"exp",     title:"7월 재료비 지출결의서",         inst:"내부",               writer:"박지현", date:"2026.07.05", status:"완료",      comment:"" },
];

const DEFAULT_RECV = [
  { id:"RECV-002", from:"동구 장애인복지관", title:"예산 확인 요청 공문",           date:"2026.07.08", status:"미확인", urgent:true  },
  { id:"RECV-001", from:"삼산초등학교",      title:"원예치료 프로그램 운영 승인",   date:"2026.07.05", status:"검토중", urgent:false },
];

function Badge({ status }) {
  const map = {
    "지부장대기":{ bg:G.ambBg, c:"#92400E" },
    "센터장대기":{ bg:"#FFF7ED", c:"#C2410C" },
    "완료":      { bg:G[50],   c:G[700] },
    "반려":      { bg:G.redBg, c:G.red  },
    "진행중":    { bg:G[50],   c:G[700] },
    "종결완료":  { bg:G.gray1, c:G.gray6 },
    "미확인":    { bg:G.redBg, c:G.red  },
    "검토중":    { bg:G.ambBg, c:"#92400E" },
    "처리완료":  { bg:G[50],   c:G[700] },
    "등록완료":  { bg:G[50],   c:G[700] },
    "미등록":    { bg:G.redBg, c:G.red  },
  };
  const s = map[status] || { bg:G.gray1, c:G.gray6 };
  return <span style={{ display:"inline-block", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, background:s.bg, color:s.c }}>{status}</span>;
}

function Toast({ msg }) {
  if (!msg) return null;
  return <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", background:G[900], color:"#fff", padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:700, zIndex:999, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,.3)" }}>{msg}</div>;
}

// ── 로그인 ────────────────────────────────────────────────────
function Login({ onLogin, users }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  function doLogin() {
    const u = users.find(x => x.name === id.trim() && x.pw === pw);
    if (!u) { setErr("아이디 또는 비밀번호가 올바르지 않습니다."); return; }
    setErr(""); onLogin(u);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:500, padding:20, background:G[25] }}>
      <div style={{ fontSize:22, fontWeight:800, color:G[900], marginBottom:4 }}>박진우원예치료센터</div>
      <div style={{ fontSize:12, color:G.gray4, marginBottom:28 }}>식물이 건네는 위로, 과학이 설계하는 회복</div>
      <div style={{ background:"#fff", border:`1px solid #E5E7EB`, borderRadius:14, padding:24, width:"100%", maxWidth:320 }}>
        <div style={{ fontSize:16, fontWeight:800, color:G[900], marginBottom:18 }}>로그인</div>
        <div style={{ fontSize:12, color:G.gray6, marginBottom:5 }}>아이디 (이름)</div>
        <input
          value={id} onChange={e=>setId(e.target.value)}
          placeholder="이름을 입력하세요"
          style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1.5px solid #D1D5DB", fontSize:14, marginBottom:12, boxSizing:"border-box" }}
        />
        <div style={{ fontSize:12, color:G.gray6, marginBottom:5 }}>비밀번호</div>
        <input
          type="password" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&doLogin()}
          placeholder="비밀번호를 입력하세요"
          style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1.5px solid #D1D5DB", fontSize:14, marginBottom:err?8:14, boxSizing:"border-box" }}
        />
        {err && <div style={{ fontSize:12, color:G.red, marginBottom:10 }}>{err}</div>}
        <button onClick={doLogin} style={{ width:"100%", padding:11, background:G[700], color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:15, cursor:"pointer" }}>로그인</button>
      </div>
    </div>
  );
}

// ── 메인 레이아웃 ────────────────────────────────────────────
export default function App() {
  const [user,    setUser]    = useState(null);
  const [users,   setUsers]   = useState(DEFAULT_USERS);
  const [menu,    setMenu]    = useState("dashboard");
  const [clients,    setClients]    = useState(DEFAULT_CLIENTS);
  const [insts,      setInsts]      = useState(DEFAULT_INSTS);
  const [centerDocs,    setCenterDocs]    = useState(DEFAULT_CENTER_DOCS);
  const [staffDocs,     setStaffDocs]     = useState(DEFAULT_STAFF_DOCS);
  const [staffProfiles, setStaffProfiles] = useState(DEFAULT_STAFF_PROFILES);
  const [docs,    setDocs]    = useState(DEFAULT_DOCS);
  const [recv,    setRecv]    = useState(DEFAULT_RECV);
  const [toast,   setToast]   = useState("");
  const [selDoc,  setSelDoc]  = useState(null);
  const [selClient,setSelClient]=useState(null);
  const [subscreen,setSub]    = useState("list");
  const [form,    setForm]    = useState({});

  // Storage API 로드
  useEffect(() => {
    async function load() {
      try {
        const ru = await window.storage.get("htc-users");
        if (ru) setUsers(JSON.parse(ru.value));
        const r1 = await window.storage.get("htc-clients");
        if (r1) setClients(JSON.parse(r1.value));
        const ri = await window.storage.get("htc-insts");
        if (ri) setInsts(JSON.parse(ri.value));
        const rcd = await window.storage.get("htc-center-docs");
        if (rcd) setCenterDocs(JSON.parse(rcd.value));
        const rsd = await window.storage.get("htc-staff-docs");
        if (rsd) setStaffDocs(JSON.parse(rsd.value));
        const rsp = await window.storage.get("htc-staff-profiles");
        if (rsp) setStaffProfiles(JSON.parse(rsp.value));
        const r2 = await window.storage.get("htc-docs");
        if (r2) setDocs(JSON.parse(r2.value));
        const r3 = await window.storage.get("htc-recv");
        if (r3) setRecv(JSON.parse(r3.value));
      } catch(e) {}
    }
    load();
  }, []);

  async function saveUsers(data)      { setUsers(data);      try { await window.storage.set("htc-users",        JSON.stringify(data)); } catch(e){} }
  async function saveClients(data)    { setClients(data);    try { await window.storage.set("htc-clients",      JSON.stringify(data)); } catch(e){} }
  async function saveInsts(data)      { setInsts(data);      try { await window.storage.set("htc-insts",       JSON.stringify(data)); } catch(e){} }
  async function saveCenterDocs(data)    { setCenterDocs(data);    try { await window.storage.set("htc-center-docs",   JSON.stringify(data)); } catch(e){} }
  async function saveStaffDocs(data)     { setStaffDocs(data);     try { await window.storage.set("htc-staff-docs",    JSON.stringify(data)); } catch(e){} }
  async function saveStaffProfiles(data) { setStaffProfiles(data); try { await window.storage.set("htc-staff-profiles",JSON.stringify(data)); } catch(e){} }
  async function saveDocs(data)    { setDocs(data);    try { await window.storage.set("htc-docs",    JSON.stringify(data)); } catch(e){} }
  async function saveRecv(data)    { setRecv(data);    try { await window.storage.set("htc-recv",    JSON.stringify(data)); } catch(e){} }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }
  function goMenu(m) { setMenu(m); setSub("list"); setSelDoc(null); setSelClient(null); }
  function f(k) { return e => setForm(p => ({ ...p, [k]: e.target.value })); }

  if (!user) return <Login onLogin={u => { setUser(u); setMenu("dashboard"); }} users={users}/>;

  const role = user.role;
  const pending = docs.filter(d => (role==="branch"&&d.status==="지부장대기") || (role==="director"&&d.status==="센터장대기"));

  const MENUS = [
    { id:"dashboard", icon:"🏠", label:"대시보드",   roles:["staff","branch","director"] },
    { id:"clients",   icon:"👤", label:"내담자 관리", roles:["staff","branch","director"] },
    { id:"insts",     icon:"🏢", label:"기관 관리",   roles:["branch","director"] },
    { id:"docs_out",  icon:"📄", label:"발송 공문",   roles:["staff","branch","director"] },
    { id:"docs_in",   icon:"📬", label:"수신 공문",   roles:["branch","director"] },
    { id:"approval",  icon:"✍️", label:"결재함",      roles:["branch","director"] },
    { id:"internal",  icon:"📝", label:"내부결재",    roles:["staff","branch","director"] },
    { id:"est",       icon:"💰", label:"견적·명세서", roles:["staff","branch","director"] },
    { id:"pdf",       icon:"📦", label:"통합 PDF",    roles:["branch","director"] },
    { id:"docs_reg",  icon:"📁", label:"서류 관리",   roles:["staff","branch","director"] },
    { id:"users",     icon:"⚙️", label:"사용자 관리", roles:["director"] },
  ].filter(m => m.roles.includes(role));

  // ── 대시보드 ──────────────────────────────────────────────
  function Dashboard() {
    const pend   = docs.filter(d => d.status==="지부장대기"||d.status==="센터장대기").length;
    const active = clients.filter(c => c.status==="진행중").length;
    const unread = recv.filter(d => d.status==="미확인").length;
    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20 }}>
          {[["결재 대기",pend,G.amber],["진행중 내담자",active,G[700]],["미확인 공문",unread,G.red],["전체 문서",docs.length,G[900]]].map(([l,n,c])=>(
            <div key={l} style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, padding:12, textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:c }}>{n}</div>
              <div style={{ fontSize:10, color:G.gray4, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:14, fontWeight:700, color:G[900], marginBottom:10 }}>빠른 작성</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {[["📋","프로그램 계획서","docs_out"],["🤝","협약 공문","docs_out"],["💰","견적서","est"],["🌴","휴가 신청","internal"],["💸","지출결의서","internal"],["📊","업무보고서","internal"]].map(([ic,lb,m])=>(
            <div key={lb} onClick={()=>{ goMenu(m); setSub("form"); setForm({ docType: lb }); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, cursor:"pointer" }}>
              <span style={{ fontSize:20 }}>{ic}</span>
              <span style={{ fontSize:13, color:G.gray9 }}>{lb}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize:14, fontWeight:700, color:G[900], marginBottom:10 }}>최근 문서</div>
        {docs.slice(0,3).map(d=><DocCard key={d.id} doc={d} onClick={()=>{ goMenu("docs_out"); setSelDoc(d); setSub("detail"); }}/>)}
      </div>
    );
  }

  // ── 내담자 관리 ───────────────────────────────────────────
  function Clients() {
    const [showForm, setShowForm] = useState(false);
    const [nf, setNf] = useState({ name:"", age:"", inst:"삼산초등학교", program:"느린학습자 원예치료", therapist:user.name, total:"12", goal:"" });

    if (selClient) return <ClientDetail client={selClient} onBack={()=>setSelClient(null)}/>;
    if (showForm) return (
      <div>
        <button onClick={()=>setShowForm(false)} style={backBtnStyle}>← 목록</button>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>내담자 등록</div>
          {[["이름","name"],["나이","age"],["소속 기관","inst"],["프로그램","program"],["담당 치료사","therapist"],["총 회기","total"],["치료 목표","goal"]].map(([l,k])=>(
            <div key={k} style={{ marginBottom:10 }}>
              <label style={labelStyle}>{l}</label>
              <input value={nf[k]} onChange={e=>setNf(p=>({...p,[k]:e.target.value}))} style={inputStyle}/>
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:4 }}>
            <button onClick={()=>setShowForm(false)} style={btnO}>취소</button>
            <button onClick={()=>{
              const nc=[...clients,{ id:"C-"+Date.now(), name:nf.name, age:parseInt(nf.age)||0, inst:nf.inst, program:nf.program, therapist:nf.therapist, done:0, total:parseInt(nf.total)||12, status:"진행중", goal:nf.goal, note:"" }];
              saveClients(nc); showToast("✅ 내담자 등록됐습니다!"); setShowForm(false);
            }} style={btnG}>등록</button>
          </div>
        </div>
      </div>
    );
    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:14 }}>
          {[["진행중",clients.filter(c=>c.status==="진행중").length,G[700]],["종결완료",clients.filter(c=>c.status==="종결완료").length,G.gray6]].map(([l,n,c])=>(
            <div key={l} style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, padding:12, textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:800, color:c }}>{n}</div>
              <div style={{ fontSize:11, color:G.gray4 }}>{l}</div>
            </div>
          ))}
        </div>
        {clients.map(c=>(
          <div key={c.id} onClick={()=>setSelClient(c)} style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, padding:14, marginBottom:8, cursor:"pointer" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <div style={{ fontSize:15, fontWeight:700, color:G.gray9 }}>{c.name} ({c.age}세)</div>
              <Badge status={c.status}/>
            </div>
            <div style={{ fontSize:12, color:G.gray6 }}>{c.inst} · {c.program} · {c.therapist}</div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:G.gray4, margin:"8px 0 4px" }}>
              <span>{c.done}/{c.total}회기</span><span>{Math.round(c.done/c.total*100)}%</span>
            </div>
            <div style={{ background:"#E5E7EB", borderRadius:99, height:4, overflow:"hidden" }}>
              <div style={{ background:G[700], height:"100%", width:`${Math.round(c.done/c.total*100)}%` }}/>
            </div>
          </div>
        ))}
        <button onClick={()=>setShowForm(true)} style={{ ...btnG, width:"100%", padding:11, marginTop:4 }}>+ 내담자 등록</button>
      </div>
    );
  }

  function ClientDetail({ client:c, onBack }) {
    const [tab, setTab]       = useState("sessions");
    const [closing, setClosing] = useState(false);
    const [showSessForm, setShowSessForm] = useState(false);
    const [sf, setSf] = useState({ date:new Date().toISOString().slice(0,10), attend:true, activity:"", memo:"" });
    const [cf, setCf] = useState({ pre:"", post:"", summary:"", note:"" });

    const pct = Math.round(c.done/c.total*100);
    const sessions = c.sessions || [];

    function addSession() {
      if (!sf.activity) { showToast("활동내용을 입력하세요!"); return; }
      const no = sessions.length + 1;
      const ns = { no, date:sf.date, attend:sf.attend, activity:sf.activity, memo:sf.memo };
      const nc = clients.map(x => x.id===c.id ? { ...x, sessions:[...sessions, ns], done: x.done+(sf.attend?1:0) } : x);
      saveClients(nc); showToast("✅ 회기 기록됐습니다!"); setShowSessForm(false);
      setSf({ date:new Date().toISOString().slice(0,10), attend:true, activity:"", memo:"" });
    }

    const TabBtn = ({id,label}) => (
      <button onClick={()=>setTab(id)} style={{ flex:1, padding:"8px 0", border:"none", background:"none", borderBottom:`2px solid ${tab===id?G[700]:"transparent"}`, color:tab===id?G[700]:G.gray4, fontWeight:tab===id?700:400, fontSize:13, cursor:"pointer" }}>{label}</button>
    );

    return (
      <div>
        <button onClick={onBack} style={backBtnStyle}>← 내담자 목록</button>

        {/* 기본 정보 */}
        <div style={cardStyle}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:G.gray9 }}>{c.name} ({c.age}세)</div>
              <div style={{ fontSize:12, color:G.gray6, marginTop:2 }}>{c.inst} · {c.therapist}</div>
            </div>
            <Badge status={c.status}/>
          </div>
          <div style={{ fontSize:12, color:G.gray6, marginBottom:8 }}>{c.program} · 목표: {c.goal}</div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:G.gray4, marginBottom:4 }}>
            <span>{c.done}/{c.total}회기</span><span>{pct}%</span>
          </div>
          <div style={{ background:"#E5E7EB", borderRadius:99, height:6, overflow:"hidden" }}>
            <div style={{ background:G[700], height:"100%", width:`${pct}%` }}/>
          </div>
          {c.note && <div style={{ marginTop:10, fontSize:12, background:G[25], borderRadius:6, padding:"8px 10px", color:G[700] }}>📝 {c.note}</div>}
        </div>

        {/* 탭 */}
        <div style={{ display:"flex", background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, overflow:"hidden", marginBottom:12 }}>
          <TabBtn id="sessions" label={`회기 기록 (${sessions.length})`}/>
          <TabBtn id="outcomes" label="성과 측정"/>
        </div>

        {/* 회기 기록 탭 */}
        {tab==="sessions" && (
          <div>
            {showSessForm ? (
              <div style={cardStyle}>
                <div style={cardTitleStyle}>회기 기록 입력</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                  <div><label style={labelStyle}>날짜</label><input type="date" value={sf.date} onChange={e=>setSf(p=>({...p,date:e.target.value}))} style={inputStyle}/></div>
                  <div><label style={labelStyle}>출석 여부</label>
                    <select value={sf.attend} onChange={e=>setSf(p=>({...p,attend:e.target.value==="true"}))} style={inputStyle}>
                      <option value="true">출석</option>
                      <option value="false">결석</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom:10 }}><label style={labelStyle}>활동 내용</label><input value={sf.activity} onChange={e=>setSf(p=>({...p,activity:e.target.value}))} style={inputStyle} placeholder="예: 채소 씨앗 파종 및 관찰일지 작성"/></div>
                <div style={{ marginBottom:12 }}><label style={labelStyle}>치료사 메모</label><textarea value={sf.memo} onChange={e=>setSf(p=>({...p,memo:e.target.value}))} rows={3} style={{...inputStyle,resize:"vertical"}} placeholder="관찰 내용, 반응, 특이사항..."/></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <button onClick={()=>setShowSessForm(false)} style={btnO}>취소</button>
                  <button onClick={addSession} style={btnG}>저장</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>setShowSessForm(true)} style={{ ...btnG, width:"100%", padding:10, marginBottom:12 }}>+ 회기 기록 입력</button>
            )}

            {sessions.length===0
              ? <div style={{ textAlign:"center", padding:32, color:G.gray4 }}>아직 회기 기록이 없습니다</div>
              : [...sessions].reverse().map(s=>(
                <div key={s.no} style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, padding:14, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ background:G[700], color:"#fff", borderRadius:4, padding:"2px 7px", fontSize:11, fontWeight:700 }}>{s.no}회기</span>
                      <span style={{ fontSize:12, color:G.gray6 }}>{s.date}</span>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, background:s.attend?G[50]:G.redBg, color:s.attend?G[700]:G.red }}>{s.attend?"출석":"결석"}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:G.gray9, marginBottom:4 }}>{s.activity}</div>
                  {s.memo && <div style={{ fontSize:12, color:G.gray6, background:G[25], borderRadius:6, padding:"7px 10px" }}>{s.memo}</div>}
                </div>
              ))
            }
          </div>
        )}

        {/* 성과 측정 탭 */}
        {tab==="outcomes" && (
          <div>
            {(c.outcomes||[]).length > 0 && (
              <div style={cardStyle}>
                <div style={cardTitleStyle}>성과 측정 결과</div>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>{["평가 항목","사전","사후"].map(h=><th key={h} style={{ background:G[700], color:"#fff", padding:"7px 8px", textAlign:"center" }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {(c.outcomes||[]).map((o,i)=>(
                      <tr key={i} style={{ background:i%2===0?"#fff":G[25] }}>
                        <td style={{ padding:"7px 8px", borderBottom:"1px solid #E5E7EB" }}>{o.item}</td>
                        <td style={{ padding:"7px 8px", textAlign:"center", borderBottom:"1px solid #E5E7EB", color:G.gray6 }}>{o.pre}</td>
                        <td style={{ padding:"7px 8px", textAlign:"center", borderBottom:"1px solid #E5E7EB", fontWeight:700, color:G[700] }}>{o.post}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {c.status==="진행중" && !closing && (
              <button onClick={()=>setClosing(true)} style={{ ...btnG, width:"100%", padding:10, background:G.red, marginTop:4 }}>종결 처리 →</button>
            )}
            {closing && (
              <div style={{ ...cardStyle, background:"#FFF7ED", border:"1.5px solid #FED7AA" }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#C2410C", marginBottom:12 }}>종결 처리</div>
                {[["사전 상태","pre"],["사후 상태","post"],["종합 소견","summary"],["특이사항","note"]].map(([l,k])=>(
                  <div key={k} style={{ marginBottom:10 }}>
                    <label style={labelStyle}>{l}</label>
                    <textarea value={cf[k]} onChange={e=>setCf(p=>({...p,[k]:e.target.value}))} rows={2} style={{...inputStyle,resize:"vertical"}} placeholder={l+" 입력..."}/>
                  </div>
                ))}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <button onClick={()=>setClosing(false)} style={btnO}>취소</button>
                  <button onClick={()=>{
                    const nd=[{ id:"HTC-2026-R"+Date.now(), type:"report", title:`[종결보고서] ${c.name} · ${c.program}`, inst:c.inst, writer:user.name, date:new Date().toLocaleDateString("ko-KR"), status:"지부장대기", comment:"" },...docs];
                    const nc=clients.map(x=>x.id===c.id?{...x,status:"종결완료",note:cf.summary}:x);
                    saveClients(nc); saveDocs(nd);
                    showToast("📄 종결보고서 결재 시스템으로 전송됐습니다!"); onBack();
                  }} style={{ ...btnG, background:G.red }}>종결 + 보고서 생성</button>
                </div>
              </div>
            )}
            {c.status==="종결완료" && (
              <button onClick={()=>showToast("📥 종결보고서 PDF 생성됨!")} style={{ ...btnG, width:"100%", padding:11, background:G.blue }}>종결보고서 PDF 다운로드</button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── 문서 목록/상세 ────────────────────────────────────────
  function DocCard({ doc:d, onClick }) {
    return (
      <div onClick={onClick} style={{ background:"#fff", border:`1.5px solid ${d.status==="지부장대기"||d.status==="센터장대기"?"#FCD34D":"#E5E7EB"}`, borderRadius:10, padding:14, marginBottom:8, cursor:"pointer" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:10, color:G.gray4 }}>{d.id}</span>
          <Badge status={d.status}/>
        </div>
        <div style={{ fontSize:14, fontWeight:700, color:G.gray9, marginBottom:3 }}>{d.title}</div>
        <div style={{ fontSize:12, color:G.gray6 }}>{d.inst} · {d.writer} · {d.date}</div>
        {d.comment && <div style={{ marginTop:8, fontSize:12, background:G[25], borderRadius:6, padding:"6px 10px", color:G[700] }}>💬 {d.comment}</div>}
      </div>
    );
  }

  function DocDetail({ doc:d, onBack }) {
    const [comment, setComment] = useState("");
    const canAp = (role==="branch"&&d.status==="지부장대기")||(role==="director"&&d.status==="센터장대기");

    function decide(action) {
      const nd = docs.map(x=>x.id===d.id?{...x,status:action==="ok"?(role==="branch"?"센터장대기":"완료"):"반려",comment}:x);
      saveDocs(nd); showToast(action==="ok"?"✅ 승인됐습니다!":"❌ 반려 처리됐습니다."); onBack();
    }

    return (
      <div>
        <button onClick={onBack} style={backBtnStyle}>← 목록</button>
        <div style={cardStyle}>
          <div style={{ fontSize:10, color:G.gray4, marginBottom:4 }}>{d.id}</div>
          <div style={{ fontSize:16, fontWeight:800, color:G[900], marginBottom:6 }}>{d.title}</div>
          <div style={{ fontSize:12, color:G.gray6, marginBottom:10 }}>{d.inst} · {d.writer} · {d.date}</div>
          <Badge status={d.status}/>
        </div>
        {/* 결재선 */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>결재선</div>
          <div style={{ display:"flex" }}>
            {[{role:"기안자",name:d.writer,ok:true},{role:"지부장",name:"이수민",ok:d.status!=="지부장대기"},{role:"센터장",name:"박진우",ok:d.status==="완료"}].map((ap,i)=>(
              <div key={i} style={{ flex:1, border:"1px solid #E5E7EB", textAlign:"center", borderLeft:i===0?"1px solid #E5E7EB":"none" }}>
                <div style={{ fontSize:10, fontWeight:700, background:ap.ok?G[700]:"#9CA3AF", color:"#fff", padding:"4px 0" }}>{ap.role}</div>
                <div style={{ fontSize:12, padding:"6px 4px", color:G.gray9 }}>{ap.name}</div>
                <div style={{ fontSize:12, color:ap.ok?G[700]:G.gray4, padding:"0 0 6px" }}>{ap.ok?"✓":"대기"}</div>
              </div>
            ))}
          </div>
        </div>
        {canAp && (
          <div style={cardStyle}>
            <div style={cardTitleStyle}>결재 의견</div>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={2} placeholder="의견을 입력하세요..." style={{ ...inputStyle, marginBottom:10 }}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <button onClick={()=>decide("ok")} style={btnG}>✅ 승인</button>
              <button onClick={()=>decide("rej")} style={{ ...btnG, background:G.red }}>❌ 반려</button>
            </div>
          </div>
        )}
        <button onClick={()=>showToast("📥 PDF 생성됨!")} style={{ ...btnG, width:"100%", padding:10, background:G.blue }}>📥 PDF 다운로드</button>
      </div>
    );
  }

  function DocsOut() {
    if (selDoc) return <DocDetail doc={selDoc} onBack={()=>{ setSelDoc(null); setSub("list"); }}/>;
    if (subscreen==="form") return <DocWriteForm/>;
    const myDocs = role==="staff" ? docs.filter(d=>d.writer===user.name) : docs;
    return (
      <div>
        {myDocs.map(d=><DocCard key={d.id} doc={d} onClick={()=>{ setSelDoc(d); setSub("detail"); }}/>)}
        <button onClick={()=>setSub("form")} style={{ ...btnG, width:"100%", padding:10, marginTop:4 }}>+ 새 문서 작성</button>
      </div>
    );
  }

  function DocWriteForm() {
    const [df, setDf] = useState({ type:"plan", inst:"삼산초등학교", title:"", leader:"이수민 (울산 지부)" });
    const types = [["plan","📋 프로그램 계획서"],["gongmun","🤝 협약 공문"],["est","💰 견적서"],["report","📊 결과보고서"],["tms","📄 거래명세서"]];
    return (
      <div>
        <button onClick={()=>setSub("list")} style={backBtnStyle}>← 목록</button>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>문서 종류</div>
          {types.map(([t,l])=>(
            <div key={t} onClick={()=>setDf(p=>({...p,type:t}))} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, border:`1.5px solid ${df.type===t?G[700]:"#E5E7EB"}`, background:df.type===t?G[25]:"#fff", marginBottom:6, cursor:"pointer" }}>
              <span style={{ fontSize:14 }}>{l}</span>
            </div>
          ))}
        </div>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>기본 정보</div>
          <div style={{ marginBottom:10 }}>
            <label style={labelStyle}>제목</label>
            <input value={df.title} onChange={e=>setDf(p=>({...p,title:e.target.value}))} style={inputStyle} placeholder="문서 제목 입력..."/>
          </div>
          <div style={{ marginBottom:10 }}>
            <label style={labelStyle}>수신 기관</label>
            <select value={df.inst} onChange={e=>setDf(p=>({...p,inst:e.target.value}))} style={inputStyle}>
              {instNames.map(x=><option key={x}>{x}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:10 }}>
            <label style={labelStyle}>결재 지부장</label>
            <select value={df.leader} onChange={e=>setDf(p=>({...p,leader:e.target.value}))} style={inputStyle}>
              <option>없음 (센터장 직결)</option>
              <option>이수민 (울산 지부)</option>
              <option>박지현 (부산 지부)</option>
            </select>
          </div>
          <div style={{ background:G[25], borderRadius:8, padding:"8px 12px", fontSize:12, color:G[700], marginBottom:12 }}>
            결재선: {user.name} → {df.leader==="없음 (센터장 직결)"?"센터장 박진우 (직결)":df.leader+" → 센터장 박진우"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <button onClick={()=>setSub("list")} style={btnO}>취소</button>
            <button onClick={()=>{
              if (!df.title) { showToast("제목을 입력하세요!"); return; }
              const id = "HTC-2026-"+String(docs.length+1).padStart(3,"0");
              const nd = [{ id, type:df.type, title:df.title, inst:df.inst, writer:user.name, date:new Date().toLocaleDateString("ko-KR"), status:df.leader==="없음 (센터장 직결)"?"센터장대기":"지부장대기", comment:"" }, ...docs];
              saveDocs(nd); showToast("✅ 결재 상신됐습니다!"); setSub("list");
            }} style={btnG}>결재 상신</button>
          </div>
        </div>
      </div>
    );
  }

  // ── 결재함 ────────────────────────────────────────────────
  function Approval() {
    if (selDoc) return <DocDetail doc={selDoc} onBack={()=>{ setSelDoc(null); setSub("list"); }}/>;
    const done = docs.filter(d=>d.status==="완료"||d.status==="반려");
    return (
      <div>
        <div style={{ fontSize:13, fontWeight:700, color:G.gray9, marginBottom:8 }}>결재 대기 <Badge status={`${pending.length}건`}/></div>
        {pending.length===0 ? <div style={{ textAlign:"center", padding:32, color:G.gray4 }}>대기 중인 결재가 없습니다</div>
          : pending.map(d=><DocCard key={d.id} doc={d} onClick={()=>setSelDoc(d)}/>)}
        <div style={{ fontSize:13, fontWeight:700, color:G.gray9, margin:"16px 0 8px" }}>처리 완료</div>
        {done.map(d=><DocCard key={d.id} doc={d} onClick={()=>setSelDoc(d)}/>)}
      </div>
    );
  }

  // ── 수신 공문 ─────────────────────────────────────────────
  function DocsIn() {
    return (
      <div>
        {recv.map(d=>(
          <div key={d.id} onClick={()=>{
            const nr=recv.map(x=>x.id===d.id?{...x,status:"처리완료"}:x);
            saveRecv(nr); showToast("✅ 처리완료로 변경됐습니다!");
          }} style={{ background:"#fff", border:`1.5px solid ${d.urgent?"#FCA5A5":"#E5E7EB"}`, borderRadius:10, padding:14, marginBottom:8, cursor:"pointer", borderLeft:d.urgent?"4px solid #DC2626":undefined }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:10, color:G.gray4 }}>{d.id}</span>
              <Badge status={d.status}/>
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:G.gray9, marginBottom:3 }}>{d.title}</div>
            <div style={{ fontSize:12, color:G.gray6 }}>{d.from} · {d.date}</div>
          </div>
        ))}
        <button onClick={()=>{
          const nr=[{ id:"RECV-"+Date.now(), from:"신규 기관", title:"새로 받은 공문", date:new Date().toLocaleDateString("ko-KR"), status:"미확인", urgent:false },...recv];
          saveRecv(nr); showToast("📬 공문이 등록됐습니다!");
        }} style={{ ...btnO, width:"100%", padding:10, marginTop:4 }}>+ 공문 등록</button>
      </div>
    );
  }

  // ── 내부결재 ──────────────────────────────────────────────
  function Internal() {
    const [iForm, setIForm] = useState(false);
    const [it, setIt] = useState("vac");
    const [inf, setInf] = useState({ startDate:"", endDate:"", days:"1", type:"연차", reason:"", purpose:"", leader:"이수민 (울산 지부)" });
    const intDocs = docs.filter(d=>["vac","exp","rep","mtg"].includes(d.type));

    if (iForm) return (
      <div>
        <button onClick={()=>setIForm(false)} style={backBtnStyle}>← 취소</button>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12 }}>
          {[["vac","🌴 휴가·연차"],["exp","💸 지출결의"],["rep","📊 업무보고"],["mtg","🗒 회의록"]].map(([t,l])=>(
            <div key={t} onClick={()=>setIt(t)} style={{ padding:"10px", borderRadius:8, border:`1.5px solid ${it===t?G[700]:"#E5E7EB"}`, background:it===t?G[25]:"#fff", cursor:"pointer", textAlign:"center", fontSize:13 }}>{l}</div>
          ))}
        </div>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>{{ vac:"휴가·연차 신청서", exp:"지출결의서", rep:"업무보고서", mtg:"회의록" }[it]}</div>
          {it==="vac" && <>
            <div style={{ marginBottom:10 }}><label style={labelStyle}>휴가 종류</label><select value={inf.type} onChange={e=>setInf(p=>({...p,type:e.target.value}))} style={inputStyle}>{["연차","반차(오전)","반차(오후)","병가","경조사"].map(x=><option key={x}>{x}</option>)}</select></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
              <div><label style={labelStyle}>시작일</label><input type="date" value={inf.startDate} onChange={e=>setInf(p=>({...p,startDate:e.target.value}))} style={inputStyle}/></div>
              <div><label style={labelStyle}>종료일</label><input type="date" value={inf.endDate} onChange={e=>setInf(p=>({...p,endDate:e.target.value}))} style={inputStyle}/></div>
            </div>
            <div style={{ marginBottom:10 }}><label style={labelStyle}>사유</label><textarea value={inf.reason} onChange={e=>setInf(p=>({...p,reason:e.target.value}))} rows={2} style={inputStyle} placeholder="사유 입력..."/></div>
          </>}
          {it==="exp" && <div style={{ marginBottom:10 }}><label style={labelStyle}>지출 목적</label><textarea value={inf.purpose} onChange={e=>setInf(p=>({...p,purpose:e.target.value}))} rows={3} style={inputStyle} placeholder="지출 목적 및 내역 입력..."/></div>}
          {(it==="rep"||it==="mtg") && <div style={{ marginBottom:10 }}><label style={labelStyle}>내용</label><textarea rows={4} style={inputStyle} placeholder="내용 입력..."/></div>}
          <div style={{ marginBottom:10 }}>
            <label style={labelStyle}>결재 지부장</label>
            <select value={inf.leader} onChange={e=>setInf(p=>({...p,leader:e.target.value}))} style={inputStyle}>
              <option>없음 (센터장 직결)</option>
              <option>이수민 (울산 지부)</option>
            </select>
          </div>
          <div style={{ background:G[25], borderRadius:8, padding:"8px 12px", fontSize:12, color:G[700], marginBottom:12 }}>
            결재선: {user.name} → {inf.leader==="없음 (센터장 직결)"?"센터장 직결":inf.leader+" → 센터장"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <button onClick={()=>setIForm(false)} style={btnO}>취소</button>
            <button onClick={()=>{
              const titles={vac:`${inf.type} 신청`,exp:"지출결의서",rep:"업무보고서",mtg:"회의록"};
              const nd=[{ id:"INT-"+Date.now(), type:it, title:titles[it], inst:"내부", writer:user.name, date:new Date().toLocaleDateString("ko-KR"), status:inf.leader==="없음 (센터장 직결)"?"센터장대기":"지부장대기", comment:"" },...docs];
              saveDocs(nd); showToast("✅ 결재 상신됐습니다!"); setIForm(false);
            }} style={btnG}>결재 상신</button>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
          {[["🌴","휴가·연차"],["💸","지출결의"],["📊","업무보고"],["🗒","회의록"]].map(([ic,l])=>(
            <div key={l} onClick={()=>{ setIt(l==="휴가·연차"?"vac":l==="지출결의"?"exp":l==="업무보고"?"rep":"mtg"); setIForm(true); }} style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 14px", background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, cursor:"pointer" }}>
              <span style={{ fontSize:20 }}>{ic}</span><span style={{ fontSize:13, color:G.gray9 }}>{l}</span>
            </div>
          ))}
        </div>
        {intDocs.map(d=><DocCard key={d.id} doc={d} onClick={()=>{ setSelDoc(d); setSub("detail"); }}/>)}
      </div>
    );
  }

  // ── 견적서 ────────────────────────────────────────────────
  function Est() {
    const [ef, setEf] = useState({ inst:"삼산초등학교", name:"느린학습자 원예치료 (1:1)", spec:"60분/회기", qty:"12", unit:"60000" });
    const supply = parseInt(ef.qty||0) * parseInt(ef.unit||0);
    const vat    = Math.round(supply*0.1);
    return (
      <div>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>견적서 작성</div>
          <div style={{ marginBottom:10 }}><label style={labelStyle}>수신 기관</label><select value={ef.inst} onChange={e=>setEf(p=>({...p,inst:e.target.value}))} style={inputStyle}>{instNames.map(x=><option key={x}>{x}</option>)}</select></div>
          <div style={{ marginBottom:10 }}><label style={labelStyle}>품목명</label><input value={ef.name} onChange={e=>setEf(p=>({...p,name:e.target.value}))} style={inputStyle}/></div>
          <div style={{ marginBottom:10 }}><label style={labelStyle}>규격</label><input value={ef.spec} onChange={e=>setEf(p=>({...p,spec:e.target.value}))} style={inputStyle}/></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
            <div><label style={labelStyle}>수량</label><input type="number" value={ef.qty} onChange={e=>setEf(p=>({...p,qty:e.target.value}))} style={inputStyle}/></div>
            <div><label style={labelStyle}>단가(원)</label><input type="number" value={ef.unit} onChange={e=>setEf(p=>({...p,unit:e.target.value}))} style={inputStyle}/></div>
          </div>
          <div style={{ background:G[25], borderRadius:8, padding:12, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}><span style={{ color:G.gray6 }}>공급가액</span><span>{supply.toLocaleString()}원</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}><span style={{ color:G.gray6 }}>부가세(10%)</span><span>{vat.toLocaleString()}원</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:800, color:G[700], borderTop:"1px solid #E5E7EB", paddingTop:6 }}><span>합계</span><span>{(supply+vat).toLocaleString()}원</span></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <button onClick={()=>showToast("📥 견적서 PDF 생성됨!")} style={{ ...btnG, background:G.blue }}>📥 PDF</button>
            <button onClick={()=>{
              const nd=[{ id:"EST-"+Date.now(), type:"est", title:`견적서 · ${ef.inst}`, inst:ef.inst, writer:user.name, date:new Date().toLocaleDateString("ko-KR"), status:"센터장대기", comment:"" },...docs];
              saveDocs(nd); showToast("✅ 결재 요청됐습니다!");
            }} style={btnG}>결재 요청</button>
          </div>
        </div>
      </div>
    );
  }

  // ── 통합 PDF ─────────────────────────────────────────────
  function Pdf() {
    const [sel, setSel] = useState(["공문(표지)","프로그램 계획서","견적서","결과보고서","거래명세서","치료사 이력서"]);
    const all = ["공문(표지)","프로그램 계획서","견적서","결과보고서","거래명세서","치료사 이력서"];
    return (
      <div style={cardStyle}>
        <div style={cardTitleStyle}>통합 PDF 생성</div>
        <div style={{ fontSize:12, color:G.gray6, marginBottom:12 }}>선택한 문서를 하나의 PDF로 생성합니다.</div>
        <div style={{ marginBottom:10 }}><label style={labelStyle}>수신 기관</label><select style={inputStyle}>{instNames.map(x=><option key={x}>{x}</option>)}</select></div>
        <div style={{ marginBottom:14 }}>
          {all.map(d=>(
            <label key={d} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7, fontSize:13, color:G.gray9, cursor:"pointer" }}>
              <input type="checkbox" checked={sel.includes(d)} onChange={()=>setSel(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d])} style={{ width:16, height:16 }}/> {d}
            </label>
          ))}
        </div>
        <button onClick={()=>showToast(`📄 통합 PDF 생성 중... (${sel.length}개 문서)`)} style={{ ...btnG, width:"100%", padding:12, fontSize:14 }}>통합 PDF 생성 ({sel.length}개)</button>
      </div>
    );
  }

  // ── 기관 관리 ────────────────────────────────────────────
  function Insts() {
    const [showForm, setShowForm] = useState(false);
    const [nf, setNf] = useState({ name:"", type:"학교", contact:"", phone:"", email:"" });
    const types = ["학교","복지관","센터","병원","기타"];

    if (showForm) return (
      <div>
        <button onClick={()=>setShowForm(false)} style={backBtnStyle}>← 목록</button>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>기관 등록</div>
          <div style={{ marginBottom:10 }}><label style={labelStyle}>기관명</label><input value={nf.name} onChange={e=>setNf(p=>({...p,name:e.target.value}))} style={inputStyle} placeholder="기관명 입력"/></div>
          <div style={{ marginBottom:10 }}><label style={labelStyle}>기관 유형</label>
            <select value={nf.type} onChange={e=>setNf(p=>({...p,type:e.target.value}))} style={inputStyle}>
              {types.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:10 }}><label style={labelStyle}>담당자</label><input value={nf.contact} onChange={e=>setNf(p=>({...p,contact:e.target.value}))} style={inputStyle} placeholder="담당자명"/></div>
          <div style={{ marginBottom:10 }}><label style={labelStyle}>전화번호</label><input value={nf.phone} onChange={e=>setNf(p=>({...p,phone:e.target.value}))} style={inputStyle} placeholder="052-000-0000"/></div>
          <div style={{ marginBottom:14 }}><label style={labelStyle}>이메일</label><input value={nf.email} onChange={e=>setNf(p=>({...p,email:e.target.value}))} style={inputStyle} placeholder="email@institution.com"/></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <button onClick={()=>setShowForm(false)} style={btnO}>취소</button>
            <button onClick={()=>{
              if(!nf.name){showToast("기관명을 입력하세요!");return;}
              const ni=[...insts,{id:"I-"+Date.now(),...nf}];
              saveInsts(ni); showToast("✅ 기관이 등록됐습니다!"); setShowForm(false);
            }} style={btnG}>등록</button>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
          {["학교","복지관","센터"].map(t=>(
            <div key={t} style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, padding:10, textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:800, color:G[700] }}>{insts.filter(i=>i.type===t).length}</div>
              <div style={{ fontSize:11, color:G.gray4 }}>{t}</div>
            </div>
          ))}
        </div>
        {insts.map(inst=>(
          <div key={inst.id} style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, padding:14, marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div style={{ fontSize:15, fontWeight:700, color:G.gray9 }}>{inst.name}</div>
              <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, background:G[25], color:G[700] }}>{inst.type}</span>
            </div>
            <div style={{ fontSize:12, color:G.gray6 }}>담당: {inst.contact}</div>
            {inst.phone && <div style={{ fontSize:12, color:G.gray6 }}>📞 {inst.phone}</div>}
            {inst.email && <div style={{ fontSize:12, color:G.gray6 }}>✉ {inst.email}</div>}
            <div style={{ marginTop:8, fontSize:11, color:G.gray4 }}>
              내담자 {clients.filter(c=>c.inst===inst.name).length}명 · 공문 {docs.filter(d=>d.inst===inst.name).length}건
            </div>
          </div>
        ))}
        <button onClick={()=>setShowForm(true)} style={{ ...btnG, width:"100%", padding:11, marginTop:4 }}>+ 기관 등록</button>
      </div>
    );
  }

  // ── 서류 관리 ────────────────────────────────────────────
  function DocsReg() {
    const [docTab,   setDocTab]   = useState(role==="staff" ? "resume" : "center");
    const [selStaff, setSelStaff] = useState(role==="staff" ? user.name : "김예진");
    const [editSection, setEditSection] = useState(null);
    const [newRow, setNewRow] = useState({});
    const today = new Date().toLocaleDateString("ko-KR");

    const targetName = role==="staff" ? user.name : selStaff;
    const profile = staffProfiles[targetName] || {};

    // 시스템 자동 집계 이력
    const autoClients   = clients.filter(c => c.therapist === targetName);
    const autoInsts     = [...new Set(autoClients.map(c => c.inst))];
    const autoTotalSess = autoClients.reduce((s,c) => s+c.done, 0);
    const autoDocs      = docs.filter(d => d.writer === targetName && d.status === "완료");

    const DocTypeIcon = { "사업자등록증":"🏢", "통장사본":"🏦", "자격증사본":"📜", "강사료입금통장":"💳" };

    function DocRow({ doc, onRegister, isCenter }) {
      const canEdit = isCenter ? role === "director" : true;
      const canDownload = doc.registered;
      return (
        <div style={{ background:"#fff", border:`1.5px solid ${doc.registered?"#E5E7EB":"#FCD34D"}`, borderRadius:10, padding:14, marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20 }}>{DocTypeIcon[doc.type]||"📎"}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:G.gray9 }}>{doc.name}</div>
                <div style={{ fontSize:11, color:G.gray4 }}>{doc.type}{doc.uploadDate?" · 등록일: "+doc.uploadDate:""}</div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
              <Badge status={doc.registered ? "등록완료" : "미등록"}/>
              {isCenter && role!=="director" && <span style={{ fontSize:10, color:G.gray4 }}>🔒 등록은 센터장만</span>}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: canEdit&&canDownload?"1fr 1fr":canDownload?"1fr":"1fr", gap:8 }}>
            {canEdit && (
              <button onClick={onRegister} style={{ ...btnG, padding:"7px 0", fontSize:12, background:doc.registered?G[500]:G[700] }}>
                {doc.registered ? "📎 재등록" : "📎 파일 등록"}
              </button>
            )}
            {canDownload && (
              <button onClick={()=>showToast("📥 다운로드 중...")} style={{ ...btnO, padding:"7px 0", fontSize:12 }}>
                📥 다운로드
              </button>
            )}
            {!canEdit && !canDownload && (
              <div style={{ background:"#F3F4F6", borderRadius:8, padding:"7px", fontSize:12, color:G.gray4, textAlign:"center" }}>
                센터장이 등록 후 다운로드 가능합니다
              </div>
            )}
          </div>
        </div>
      );
    }

    // 이력 섹션 컴포넌트
    function ResumeSection({ title, icon, items, fields, onAdd, onDel }) {
      const isEditing = editSection === title;
      return (
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ fontSize:13, fontWeight:700, color:G[900] }}>{icon} {title}</div>
            <button onClick={()=>{ setEditSection(isEditing?null:title); setNewRow({}); }} style={{ fontSize:11, color:G[700], background:G[25], border:`1px solid ${G[200]}`, borderRadius:6, padding:"3px 10px", cursor:"pointer" }}>
              {isEditing?"닫기":"+ 추가"}
            </button>
          </div>
          {isEditing && (
            <div style={{ background:G[25], borderRadius:8, padding:12, marginBottom:8, border:`1px solid ${G[200]}` }}>
              {fields.map(([l,k])=>(
                <div key={k} style={{ marginBottom:8 }}>
                  <label style={labelStyle}>{l}</label>
                  <input value={newRow[k]||""} onChange={e=>setNewRow(p=>({...p,[k]:e.target.value}))} style={inputStyle} placeholder={l}/>
                </div>
              ))}
              <button onClick={()=>{ onAdd(newRow); setNewRow({}); setEditSection(null); showToast("✅ 추가됐습니다!"); }} style={{ ...btnG, width:"100%", padding:8, fontSize:12 }}>저장</button>
            </div>
          )}
          {items.length===0
            ? <div style={{ fontSize:12, color:G.gray4, padding:"8px 0" }}>등록된 내용이 없습니다</div>
            : items.map((it,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"8px 10px", background:"#fff", border:"1px solid #E5E7EB", borderRadius:8, marginBottom:6 }}>
                <div style={{ fontSize:12, color:G.gray9, flex:1 }}>
                  {fields.map(([,k])=>it[k]).filter(Boolean).join(" · ")}
                </div>
                <button onClick={()=>{ onDel(i); showToast("삭제됐습니다."); }} style={{ background:"none", border:"none", color:G.gray4, fontSize:14, cursor:"pointer", paddingLeft:8 }}>✕</button>
              </div>
            ))
          }
        </div>
      );
    }

    const TabBtn = ({id,label}) => (
      <button onClick={()=>setDocTab(id)} style={{ flex:1, padding:"9px 0", border:"none", background:"none", borderBottom:`2px solid ${docTab===id?G[700]:"transparent"}`, color:docTab===id?G[700]:G.gray4, fontWeight:docTab===id?700:400, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
        {label}
      </button>
    );

    function updateProfile(key, val) {
      const np = { ...staffProfiles, [targetName]: { ...profile, [key]:val } };
      saveStaffProfiles(np);
    }

    return (
      <div>
        {/* 치료사 선택 (지부장·센터장) */}
        {role !== "staff" && (
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            {Object.keys(staffProfiles).map(name=>(
              <button key={name} onClick={()=>setSelStaff(name)} style={{ padding:"7px 16px", borderRadius:8, border:`1.5px solid ${selStaff===name?G[700]:"#E5E7EB"}`, background:selStaff===name?G[25]:"#fff", color:selStaff===name?G[700]:G.gray6, fontWeight:selStaff===name?700:400, fontSize:13, cursor:"pointer" }}>
                {name}
              </button>
            ))}
          </div>
        )}

        {/* 탭 */}
        <div style={{ display:"flex", background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, overflow:"hidden", marginBottom:14 }}>
          {role!=="staff" && <TabBtn id="center" label="🏢 센터 서류"/>}
          <TabBtn id="resume"  label="📄 이력서"/>
          <TabBtn id="files"   label="📎 첨부 서류"/>
        </div>

        {/* 센터 서류 */}
        {docTab==="center" && role!=="staff" && (
          <div>
            <div style={{ background:G[25], border:`1px solid ${G[200]}`, borderRadius:8, padding:"10px 14px", marginBottom:12, fontSize:12, color:G[700] }}>
              📌 지출결의서 결재 시 자동으로 첨부됩니다.
            </div>
            {role==="director" && (
              <div style={{ background:"#FFF7ED", border:"1px solid #FCD34D", borderRadius:8, padding:"8px 14px", marginBottom:12, fontSize:12, color:"#92400E" }}>
                🔒 센터장 전용 메뉴입니다. 등록·수정 권한이 있습니다.
              </div>
            )}
            {centerDocs.map(doc=>(
              <DocRow key={doc.id} doc={doc} isCenter={true} onRegister={()=>{
                if(role!=="director"){showToast("센터장만 등록할 수 있습니다.");return;}
                const nd = centerDocs.map(x=>x.id===doc.id?{...x,registered:true,uploadDate:today}:x);
                saveCenterDocs(nd); showToast(`✅ ${doc.name} 등록 완료!`);
              }}/>
            ))}
            {role==="director" && (
              <button onClick={()=>{
                const nd=[...centerDocs,{id:"CD-"+Date.now(),type:"기타",name:"추가 서류",uploadDate:"",registered:false}];
                saveCenterDocs(nd);
              }} style={{ ...btnO, width:"100%", padding:10, marginTop:4 }}>+ 서류 추가</button>
            )}
          </div>
        )}

        {/* 이력서 */}
        {docTab==="resume" && (
          <div>
            <div style={{ background:G[25], border:`1px solid ${G[200]}`, borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:G[700] }}>
              📌 공문 발송 내역·프로그램 실적이 자동으로 이력에 반영됩니다.
            </div>

            {/* 기본 정보 */}
            <div style={cardStyle}>
              <div style={cardTitleStyle}>기본 정보</div>
              {[["이름","name"],["생년(년도)","birth"],["연락처","phone"],["이메일","email"],["주소","address"]].map(([l,k])=>(
                <div key={k} style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:8, marginBottom:8, alignItems:"center" }}>
                  <label style={{ fontSize:12, color:G.gray6 }}>{l}</label>
                  <input value={profile[k]||""} onChange={e=>updateProfile(k,e.target.value)} style={{ ...inputStyle, padding:"6px 10px" }}/>
                </div>
              ))}
            </div>

            {/* 학력 */}
            <div style={cardStyle}>
              <ResumeSection title="학력" icon="🎓" items={profile.education||[]}
                fields={[["졸업연도","year"],["학교명","school"],["학과","major"],["학위","degree"]]}
                onAdd={row=>updateProfile("education",[...(profile.education||[]),row])}
                onDel={i=>updateProfile("education",(profile.education||[]).filter((_,idx)=>idx!==i))}
              />
            </div>

            {/* 자격증 */}
            <div style={cardStyle}>
              <ResumeSection title="자격증" icon="📜" items={profile.certs||[]}
                fields={[["취득연도","year"],["자격증명","name"],["발급기관","issuer"],["등록번호","no"]]}
                onAdd={row=>updateProfile("certs",[...(profile.certs||[]),row])}
                onDel={i=>updateProfile("certs",(profile.certs||[]).filter((_,idx)=>idx!==i))}
              />
            </div>

            {/* 경력 - 수동 입력 */}
            <div style={cardStyle}>
              <ResumeSection title="경력" icon="💼" items={profile.career||[]}
                fields={[["기간","period"],["기관명","org"],["직위","position"],["비고","note"]]}
                onAdd={row=>updateProfile("career",[...(profile.career||[]),row])}
                onDel={i=>updateProfile("career",(profile.career||[]).filter((_,idx)=>idx!==i))}
              />
            </div>

            {/* 시스템 자동 집계 실적 */}
            <div style={{ ...cardStyle, background:G[25], border:`1.5px solid ${G[200]}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
                <div style={cardTitleStyle}>📊 시스템 자동 집계 실적</div>
                <span style={{ fontSize:11, background:G[700], color:"#fff", borderRadius:99, padding:"2px 8px" }}>자동</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
                {[["담당 기관",autoInsts.length+"개"],["내담자",autoClients.length+"명"],["총 회기",autoTotalSess+"회"]].map(([l,v])=>(
                  <div key={l} style={{ background:"#fff", borderRadius:8, padding:10, textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:800, color:G[700] }}>{v}</div>
                    <div style={{ fontSize:10, color:G.gray4 }}>{l}</div>
                  </div>
                ))}
              </div>
              {autoInsts.length>0 && (
                <div style={{ marginBottom:8 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:G[700], marginBottom:5 }}>담당 기관</div>
                  {autoInsts.map(inst=>{
                    const ic = autoClients.filter(c=>c.inst===inst);
                    return (
                      <div key={inst} style={{ display:"flex", justifyContent:"space-between", fontSize:12, padding:"5px 0", borderBottom:`1px solid ${G[50]}`, color:G.gray9 }}>
                        <span>{inst}</span>
                        <span style={{ color:G.gray4 }}>내담자 {ic.length}명 · {ic.reduce((s,c)=>s+c.done,0)}회기</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {autoDocs.length>0 && (
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:G[700], marginBottom:5 }}>발송 공문 이력</div>
                  {autoDocs.slice(0,3).map(d=>(
                    <div key={d.id} style={{ fontSize:11, padding:"4px 0", color:G.gray6, borderBottom:`1px solid ${G[50]}` }}>
                      {d.date} · {d.title}
                    </div>
                  ))}
                  {autoDocs.length>3 && <div style={{ fontSize:11, color:G.gray4, marginTop:4 }}>외 {autoDocs.length-3}건</div>}
                </div>
              )}
            </div>

            {/* 교육·연수 */}
            <div style={cardStyle}>
              <ResumeSection title="교육·연수" icon="📚" items={profile.training||[]}
                fields={[["연도","year"],["과정명","name"],["기관","org"],["시간(h)","hours"]]}
                onAdd={row=>updateProfile("training",[...(profile.training||[]),row])}
                onDel={i=>updateProfile("training",(profile.training||[]).filter((_,idx)=>idx!==i))}
              />
            </div>

            {/* 이력서 미리보기 */}
            <div style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:12, overflow:"hidden", marginBottom:14 }}>
              {/* 이력서 헤더 */}
              <div style={{ background:G[900], padding:"20px 20px 16px" }}>
                <div style={{ fontSize:10, color:G[200], letterSpacing:2, marginBottom:4 }}>CURRICULUM VITAE</div>
                <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:2 }}>{profile.name||targetName}</div>
                <div style={{ fontSize:12, color:G[200] }}>원예치료사 · 박진우원예치료센터</div>
                <div style={{ display:"flex", gap:16, marginTop:10, fontSize:11, color:G[200] }}>
                  {profile.phone && <span>📞 {profile.phone}</span>}
                  {profile.email && <span>✉ {profile.email}</span>}
                  {profile.address && <span>📍 {profile.address}</span>}
                </div>
              </div>

              <div style={{ padding:16 }}>
                {/* 실적 요약 */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
                  {[["담당 기관",autoInsts.length+"개"],["내담자",autoClients.length+"명"],["총 회기",autoTotalSess+"회"]].map(([l,v])=>(
                    <div key={l} style={{ background:G[25], borderRadius:8, padding:10, textAlign:"center" }}>
                      <div style={{ fontSize:16, fontWeight:800, color:G[700] }}>{v}</div>
                      <div style={{ fontSize:10, color:G.gray4 }}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* 학력 */}
                {(profile.education||[]).length>0 && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:G[900], borderBottom:`2px solid ${G[700]}`, paddingBottom:4, marginBottom:8 }}>학력</div>
                    {(profile.education||[]).map((e,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, fontSize:12, padding:"5px 0", borderBottom:"1px solid #F3F4F6" }}>
                        <span style={{ color:G.gray4, width:40, flexShrink:0 }}>{e.year}</span>
                        <span style={{ color:G.gray9 }}>{e.school} {e.major} {e.degree}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 자격증 */}
                {(profile.certs||[]).length>0 && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:G[900], borderBottom:`2px solid ${G[700]}`, paddingBottom:4, marginBottom:8 }}>자격증</div>
                    {(profile.certs||[]).map((c,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, fontSize:12, padding:"5px 0", borderBottom:"1px solid #F3F4F6" }}>
                        <span style={{ color:G.gray4, width:40, flexShrink:0 }}>{c.year}</span>
                        <div>
                          <div style={{ color:G.gray9, fontWeight:700 }}>{c.name}</div>
                          <div style={{ color:G.gray4, fontSize:11 }}>{c.issuer} · {c.no}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 경력 */}
                {(profile.career||[]).length>0 && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:G[900], borderBottom:`2px solid ${G[700]}`, paddingBottom:4, marginBottom:8 }}>경력</div>
                    {(profile.career||[]).map((c,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, fontSize:12, padding:"5px 0", borderBottom:"1px solid #F3F4F6" }}>
                        <span style={{ color:G.gray4, fontSize:11, width:80, flexShrink:0 }}>{c.period}</span>
                        <div>
                          <div style={{ color:G.gray9, fontWeight:700 }}>{c.org}</div>
                          <div style={{ color:G.gray6 }}>{c.position}{c.note?" · "+c.note:""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 시스템 자동 실적 */}
                {autoInsts.length>0 && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:G[900], borderBottom:`2px solid ${G[700]}`, paddingBottom:4, flex:1 }}>프로그램 운영 실적</div>
                      <span style={{ fontSize:10, background:G[700], color:"#fff", borderRadius:99, padding:"2px 7px" }}>자동</span>
                    </div>
                    {autoInsts.map(inst=>{
                      const ic=autoClients.filter(c=>c.inst===inst);
                      return (
                        <div key={inst} style={{ fontSize:12, padding:"5px 0", borderBottom:"1px solid #F3F4F6" }}>
                          <div style={{ display:"flex", justifyContent:"space-between" }}>
                            <span style={{ color:G.gray9, fontWeight:700 }}>{inst}</span>
                            <span style={{ color:G.gray4 }}>내담자 {ic.length}명 · {ic.reduce((s,c)=>s+c.done,0)}회기</span>
                          </div>
                          <div style={{ color:G.gray6, fontSize:11 }}>{[...new Set(ic.map(c=>c.program))].join(", ")}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 교육·연수 */}
                {(profile.training||[]).length>0 && (
                  <div style={{ marginBottom:8 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:G[900], borderBottom:`2px solid ${G[700]}`, paddingBottom:4, marginBottom:8 }}>교육·연수</div>
                    {(profile.training||[]).map((t,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, fontSize:12, padding:"5px 0", borderBottom:"1px solid #F3F4F6" }}>
                        <span style={{ color:G.gray4, width:40, flexShrink:0 }}>{t.year}</span>
                        <div>
                          <div style={{ color:G.gray9 }}>{t.name}</div>
                          <div style={{ color:G.gray4, fontSize:11 }}>{t.org}{t.hours?" · "+t.hours+"시간":""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button onClick={()=>showToast("📄 이력서 PDF 생성됨!")} style={{ ...btnG, width:"100%", padding:11, background:G.blue }}>📄 이력서 PDF 출력</button>
          </div>
        )}

        {/* 첨부 서류 */}
        {docTab==="files" && (
          <div>
            <div style={{ background:G[25], border:`1px solid ${G[200]}`, borderRadius:8, padding:"10px 14px", marginBottom:12, fontSize:12, color:G[700] }}>
              📌 공문 발송 시 선택하여 첨부할 수 있습니다.
            </div>
            {(staffDocs[targetName]||[]).map(doc=>(
              <DocRow key={doc.id} doc={doc} isCenter={false} onRegister={()=>{
                const nd = {...staffDocs, [targetName]:staffDocs[targetName].map(x=>x.id===doc.id?{...x,registered:true,uploadDate:today}:x)};
                saveStaffDocs(nd); showToast(`✅ ${doc.name} 등록됐습니다!`);
              }}/>
            ))}
            <button onClick={()=>{
              const nd={...staffDocs,[targetName]:[...(staffDocs[targetName]||[]),{id:"SD-"+Date.now(),type:"기타",name:"추가 서류",uploadDate:"",registered:false}]};
              saveStaffDocs(nd);
            }} style={{ ...btnO, width:"100%", padding:10, marginTop:4 }}>+ 서류 추가</button>
          </div>
        )}
      </div>
    );
  }

  // ── 사용자 관리 (센터장 전용) ────────────────────────────
  function Users() {
    const [showForm, setShowForm] = useState(false);
    const [editId,   setEditId]   = useState(null);
    const [nf, setNf] = useState({ name:"", role:"staff", pw:"" });
    const roleLabels = { staff:"치료사", branch:"지부장", director:"센터장" };
    const roleColors = { staff:G[700], branch:G.blue, director:G[900] };

    return (
      <div>
        <div style={{ background:"#FFF7ED", border:"1px solid #FCD34D", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#92400E" }}>
          🔒 센터장 전용 메뉴입니다. 사용자 추가·수정·삭제 권한이 있습니다.
        </div>

        {/* 사용자 목록 */}
        {users.map(u=>(
          <div key={u.id} style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, padding:14, marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:G[25], display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:G[700] }}>
                  {u.name[0]}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:G.gray9 }}>{u.name}</div>
                  <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, background:G[25], color:roleColors[u.role] }}>{roleLabels[u.role]}</span>
                </div>
              </div>
              {u.id !== user.id && (
                <button onClick={()=>{
                  if(!window.confirm(`${u.name}을 삭제할까요?`)) return;
                  const nd = users.filter(x=>x.id!==u.id);
                  saveUsers(nd); showToast(`✅ ${u.name} 삭제됐습니다.`);
                }} style={{ background:"none", border:"none", color:G.gray4, fontSize:18, cursor:"pointer" }}>✕</button>
              )}
            </div>
            <div style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <label style={labelStyle}>역할 변경</label>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {[["staff","치료사"],["branch","지부장"],["director","센터장"]].map(([r,l])=>(
                    <button key={r} onClick={()=>{
                      if(u.id===user.id){showToast("본인 권한은 변경할 수 없습니다.");return;}
                      if(!window.confirm(`${u.name}의 권한을 ${l}(으)로 변경할까요?`))return;
                      const nd=users.map(x=>x.id===u.id?{...x,role:r}:x);
                      saveUsers(nd); showToast(`✅ ${u.name} 권한이 ${l}(으)로 변경됐습니다!`);
                    }} style={{ flex:1, padding:"6px 0", borderRadius:8, border:`1.5px solid ${u.role===r?roleColors[r]:"#E5E7EB"}`, background:u.role===r?G[25]:"#fff", color:u.role===r?roleColors[r]:G.gray4, fontSize:12, fontWeight:u.role===r?700:400, cursor:"pointer" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            {editId===u.id ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:8 }}>
                <input placeholder="새 비밀번호" id={`pw-${u.id}`} type="password" style={{ ...inputStyle, padding:"7px 10px" }}/>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={()=>{
                    const pw = document.getElementById(`pw-${u.id}`).value;
                    if(!pw){ showToast("비밀번호를 입력하세요!"); return; }
                    const nd = users.map(x=>x.id===u.id?{...x,pw}:x);
                    saveUsers(nd); showToast("✅ 비밀번호 변경됐습니다!"); setEditId(null);
                  }} style={{ ...btnG, padding:"7px 14px", fontSize:12 }}>저장</button>
                  <button onClick={()=>setEditId(null)} style={{ ...btnO, padding:"7px 14px", fontSize:12 }}>취소</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>setEditId(u.id)} style={{ ...btnO, width:"100%", padding:"7px 0", fontSize:12 }}>🔑 비밀번호 변경</button>
            )}
          </div>
        ))}

        {/* 새 사용자 추가 */}
        {showForm ? (
          <div style={{ ...cardStyle, background:G[25], border:`1.5px solid ${G[200]}` }}>
            <div style={cardTitleStyle}>새 사용자 추가</div>
            <div style={{ marginBottom:10 }}>
              <label style={labelStyle}>이름</label>
              <input value={nf.name} onChange={e=>setNf(p=>({...p,name:e.target.value}))} style={inputStyle} placeholder="이름 입력"/>
            </div>
            <div style={{ marginBottom:10 }}>
              <label style={labelStyle}>역할</label>
              <select value={nf.role} onChange={e=>setNf(p=>({...p,role:e.target.value}))} style={inputStyle}>
                <option value="staff">치료사</option>
                <option value="branch">지부장</option>
                <option value="director">센터장</option>
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={labelStyle}>초기 비밀번호</label>
              <input type="password" value={nf.pw} onChange={e=>setNf(p=>({...p,pw:e.target.value}))} style={inputStyle} placeholder="비밀번호 입력"/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <button onClick={()=>{ setShowForm(false); setNf({name:"",role:"staff",pw:""}); }} style={btnO}>취소</button>
              <button onClick={()=>{
                if(!nf.name||!nf.pw){ showToast("이름과 비밀번호를 입력하세요!"); return; }
                if(users.find(x=>x.name===nf.name)){ showToast("이미 같은 이름의 사용자가 있습니다!"); return; }
                const nd=[...users,{ id:"u"+Date.now(), name:nf.name, role:nf.role, pw:nf.pw }];
                // staffProfiles에도 자동 추가
                if(nf.role==="staff"){
                  const np={...staffProfiles,[nf.name]:{name:nf.name,birth:"",gender:"",phone:"",email:"",address:"",education:[],certs:[],career:[],training:[]}};
                  saveStaffProfiles(np);
                  const nsd={...staffDocs,[nf.name]:[{id:"SD-"+Date.now(),type:"자격증사본",name:"자격증",uploadDate:"",registered:false},{id:"SD2-"+Date.now(),type:"강사료입금통장",name:"강사료 입금 통장사본",uploadDate:"",registered:false}]};
                  saveStaffDocs(nsd);
                }
                saveUsers(nd); showToast(`✅ ${nf.name} 추가됐습니다!`);
                setShowForm(false); setNf({name:"",role:"staff",pw:""});
              }} style={btnG}>추가</button>
            </div>
          </div>
        ) : (
          <button onClick={()=>setShowForm(true)} style={{ ...btnG, width:"100%", padding:11, marginTop:4 }}>+ 사용자 추가</button>
        )}
      </div>
    );
  }
  const cardStyle    = { background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:12, padding:16, marginBottom:14 };
  const cardTitleStyle = { fontSize:14, fontWeight:700, color:G[900], marginBottom:12 };
  const labelStyle   = { fontSize:12, color:G.gray6, display:"block", marginBottom:4 };
  const inputStyle   = { width:"100%", padding:"9px 12px", borderRadius:8, border:"1.5px solid #D1D5DB", fontSize:13, color:G.gray9, fontFamily:"inherit", boxSizing:"border-box" };
  const btnG = { background:G[700], color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", padding:"9px 0" };
  const btnO = { background:"#fff", color:G.gray9, border:"1.5px solid #D1D5DB", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", padding:"9px 0" };
  const backBtnStyle = { background:"none", border:"none", color:G[700], fontWeight:600, fontSize:14, cursor:"pointer", padding:"4px 0", marginBottom:14, display:"block" };

  const instNames = insts.map(i=>i.name);
  const SCREENS = { dashboard:<Dashboard/>, clients:<Clients/>, insts:<Insts/>, docs_out:<DocsOut/>, docs_in:<DocsIn/>, approval:<Approval/>, internal:<Internal/>, est:<Est/>, pdf:<Pdf/>, docs_reg:<DocsReg/>, users:<Users/> };

  return (
    <div style={{ fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif", background:G[25], minHeight:600 }}>
      {/* 헤더 */}
      <div style={{ background:G[900], padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:10, color:G[200], letterSpacing:2, marginBottom:2 }}>PARK JIN-WOO HORTICULTURAL THERAPY CENTER</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>박진우원예치료센터</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {pending.length>0 && <div style={{ background:G.amber, color:"#fff", borderRadius:99, fontSize:11, fontWeight:700, padding:"3px 8px" }}>결재 {pending.length}건</div>}
          <div style={{ fontSize:12, color:G[200] }}>{user.name} {ROLES[role].label}</div>
          <button onClick={()=>setUser(null)} style={{ background:"none", border:"1px solid "+G[200], borderRadius:6, color:G[200], fontSize:11, padding:"4px 8px", cursor:"pointer" }}>로그아웃</button>
        </div>
      </div>

      {/* 메뉴 탭 */}
      <div style={{ display:"flex", background:"#fff", borderBottom:"2px solid #E5E7EB", overflowX:"auto" }}>
        {MENUS.map(m=>(
          <button key={m.id} onClick={()=>goMenu(m.id)} style={{ flexShrink:0, padding:"10px 14px", fontSize:12, fontWeight:700, border:"none", background:"none", cursor:"pointer", color:menu===m.id?G[700]:G.gray4, borderBottom:`2px solid ${menu===m.id?G[700]:"transparent"}`, marginBottom:-2, whiteSpace:"nowrap" }}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* 본문 */}
      <div style={{ padding:"16px 16px 60px" }}>
        {SCREENS[menu]}
      </div>

      <Toast msg={toast}/>
    </div>
  );
}
