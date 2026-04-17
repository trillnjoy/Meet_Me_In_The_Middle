import { useState, useEffect, useRef } from "react";

/* ─── Palette ───────────────────────────────────────────────────────────────── */
const C = {
  bg:"#F7F6F2", bgDeep:"#EDEAE2", surface:"#FFFFFF",
  surfaceHi:"#F2F0EA", border:"#E0DDD5", borderMid:"#C8C4BA",
  accent:"#1A7F5A", accentLight:"#E8F5EF",
  gold:"#A0721A", goldLight:"#FDF3DC",
  coral:"#C94040", coralLight:"#FDEAEA",
  muted:"#9B9688", text:"#1C1B18", textSub:"#6B6860",
  shadow:"rgba(0,0,0,0.07)", shadowMd:"rgba(0,0,0,0.14)",
};

const FRIEND_COLORS = ["#1A7F5A","#2563EB","#E11D48","#9333EA"];

const AVATAR_OPTIONS = [
  "🧑","👩","🧔","👱","👨","👩‍🦱","👩‍🦰","🧑‍🦱",
  "👴","👵","🧑‍🦳","🧑‍🦲","🧒","👧","👦","🧕",
  "🐶","🐱","🦊","🐻","🐼","🦁","🐯","🐨",
  "🌟","🔥","⚡","🌈","🎸","🎯","🚀","💎",
];
const COLOR_OPTIONS = ["#1A7F5A","#2563EB","#9333EA","#E11D48","#EA580C","#CA8A04","#0891B2","#65A30D"];

const CATEGORIES = [
  { id:"restaurant", icon:"🍽️", label:"Restaurants" },
  { id:"bar",        icon:"🍸", label:"Bars & Cocktails" },
  { id:"cafe",       icon:"☕", label:"Coffee & Cafés" },
  { id:"golf",       icon:"⛳", label:"Golf Courses" },
  { id:"spa",        icon:"🧖", label:"Day Spas" },
  { id:"museum",     icon:"🏛️", label:"Museums" },
  { id:"theatre",    icon:"🎭", label:"Theatre & Arts" },
  { id:"park",       icon:"🌳", label:"Parks & Outdoors" },
  { id:"cinema",     icon:"🎬", label:"Cinema" },
  { id:"nightclub",  icon:"🎶", label:"Live Music & Clubs" },
];

/* ─── Rich venue database keyed by city area ────────────────────────────────── */
const VENUE_DB = {
  default: [
    { id:1,  name:"The Botanical Kitchen",    cat:"restaurant", icon:"🍽️", address:"14 Garden Row",         price:"$$",  rating:4.7, desc:"Seasonal farm-to-table menus in a converted Victorian greenhouse. Book ahead.",     mins:[18,22,19,21] },
    { id:2,  name:"Copper & Rye",             cat:"bar",        icon:"🍸", address:"88 Distillery Lane",     price:"$$$", rating:4.6, desc:"Small-batch whiskey bar with award-winning cocktails and live jazz Fri–Sat.",        mins:[20,17,22,19] },
    { id:3,  name:"Bloom Day Spa",            cat:"spa",        icon:"🧖", address:"3 Riverside Walk",       price:"$$$$",rating:4.9, desc:"Full-service spa: couples suites, infrared sauna, panoramic river views.",           mins:[25,28,23,26] },
    { id:4,  name:"Meadowbrook Golf Club",    cat:"golf",       icon:"⛳", address:"Meadowbrook Park",       price:"$$$", rating:4.8, desc:"18-hole public course. Stunning views, well-kept greens, morning slots available.",   mins:[32,29,34,31] },
    { id:5,  name:"Arcade & Social",          cat:"nightclub",  icon:"🎶", address:"22 Electric Street",     price:"$$",  rating:4.5, desc:"Retro arcade, cocktail bar and live DJ nights. Private event space available.",       mins:[12,15,11,14] },
    { id:6,  name:"City Modern Gallery",      cat:"museum",     icon:"🏛️", address:"1 Cultural Square",      price:"$",   rating:4.4, desc:"Rotating contemporary art exhibitions. Rooftop sculpture garden. Free Thursdays.",   mins:[19,22,20,18] },
    { id:7,  name:"Cornerstone Espresso",     cat:"cafe",       icon:"☕", address:"5 Market Passage",       price:"$",   rating:4.8, desc:"Third-wave specialty coffee roaster. Excellent pastries, great working vibe.",       mins:[14,16,13,15] },
    { id:8,  name:"The Grand Playhouse",      cat:"theatre",    icon:"🎭", address:"Theatre Quarter",         price:"$$$", rating:4.7, desc:"Historic theatre with West End touring shows and local productions year-round.",     mins:[22,19,24,21] },
    { id:9,  name:"Riverside Nature Reserve", cat:"park",       icon:"🌳", address:"North Bank Path",         price:"Free",rating:4.6, desc:"3km riverside walk, wildflower meadows and a popular weekend food market.",          mins:[16,20,14,18] },
    { id:10, name:"Velvet Cinema",            cat:"cinema",     icon:"🎬", address:"7 Reel Street",           price:"$$",  rating:4.5, desc:"Boutique cinema: reclining seats, craft beer, premium sound. Arthouse & blockbusters.",mins:[17,14,19,16] },
    { id:11, name:"Sakura Japanese Kitchen",  cat:"restaurant", icon:"🍽️", address:"31 Bridge Street",       price:"$$$", rating:4.8, desc:"Omakase counter and à la carte. Sustainably sourced fish, exquisite presentation.",  mins:[21,18,23,20] },
    { id:12, name:"The Natural History Wing", cat:"museum",     icon:"🏛️", address:"Museum Terrace",          price:"$",   rating:4.5, desc:"Dinosaur skeletons, interactive science labs and a planetarium show on weekends.", mins:[23,26,21,24] },
  ]
};

const FEATURES = [
  { emoji:"⏱️", title:"True Travel-Time Fairness",  desc:"Optimises for equal commute time per person — not just map distance.",             unique:true  },
  { emoji:"🗳️", title:"Built-in Group Voting",       desc:"Everyone votes; the app surfaces genuine consensus, not the loudest voice.",      unique:true  },
  { emoji:"🌡️", title:"Vibe Matching",               desc:"Set the mood and get curated venue picks to match the energy.",                  unique:true  },
  { emoji:"👥", title:"Up to 4 Friends",             desc:"Full group planning with per-person fairness scores for every venue.",            unique:true  },
  { emoji:"📤", title:"Shareable Voting Links",      desc:"Friends vote via a link — no app download required.",                            unique:true  },
  { emoji:"🎨", title:"12 Experience Categories",   desc:"Golf, spas, museums, live music and more — beyond just restaurants.",             unique:false },
  { emoji:"🔓", title:"No Login Required",           desc:"Start planning in seconds. Accounts are optional.",                              unique:false },
  { emoji:"🗺️", title:"Map & List Views",            desc:"See venues on a map or scroll a ranked list — your choice.",                    unique:false },
];

/* ─── Shared components ─────────────────────────────────────────────────────── */
const Pill = ({ active, onClick, children, color }) => (
  <button onClick={onClick} style={{
    background: active ? (color||C.accent)+"18" : C.surface,
    color: active ? (color||C.accent) : C.textSub,
    border:`1.5px solid ${active?(color||C.accent):C.border}`,
    borderRadius:99, padding:"6px 14px", fontSize:12, fontWeight:600,
    cursor:"pointer", transition:"all .18s", whiteSpace:"nowrap",
    boxShadow:`0 1px 3px ${C.shadow}`,
  }}>{children}</button>
);

const FairnessBar = ({ values, colors }) => {
  const total = values.reduce((a,b)=>a+b,0)||1;
  return (
    <div style={{ display:"flex", gap:2, height:6, borderRadius:4, overflow:"hidden", background:C.bgDeep }}>
      {values.map((v,i)=><div key={i} style={{ flex:v/total, background:colors[i], opacity:0.72 }}/>)}
    </div>
  );
};

const Modal = ({ onClose, children, maxH="88vh" }) => (
  <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(28,27,24,0.4)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:2000,backdropFilter:"blur(4px)" }}>
    <div onClick={e=>e.stopPropagation()} style={{ background:C.surface,borderRadius:"22px 22px 0 0",padding:"20px 20px 42px",width:"100%",maxWidth:390,maxHeight:maxH,overflowY:"auto",boxShadow:`0 -6px 40px ${C.shadowMd}`,animation:"slideUp .25s cubic-bezier(.16,1,.3,1)" }}>
      <div style={{ width:38,height:4,borderRadius:2,background:C.border,margin:"0 auto 18px" }}/>
      {children}
    </div>
  </div>
);

/* ─── Avatar Picker ─────────────────────────────────────────────────────────── */
function AvatarPickerModal({ friend, onSave, onClose }) {
  const [emoji, setEmoji] = useState(friend.avatar);
  const [color, setColor] = useState(friend.color);
  const [photo, setPhoto] = useState(friend.photo||null);
  const fileRef = useRef();

  const handleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setPhoto(ev.target.result); };
    reader.readAsDataURL(file);
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <div style={{ color:C.text,fontSize:16,fontWeight:800 }}>Customise Avatar</div>
        <button onClick={onClose} style={{ width:28,height:28,borderRadius:14,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textSub,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
      </div>

      {/* Live preview */}
      <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18,background:C.surfaceHi,borderRadius:14,padding:"14px",border:`1px solid ${C.border}` }}>
        <div style={{ width:58,height:58,borderRadius:29,background:color+"22",border:`3px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:photo?0:26,overflow:"hidden",flexShrink:0 }}>
          {photo ? <img src={photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : emoji}
        </div>
        <div>
          <div style={{ color:C.text,fontWeight:700,fontSize:15 }}>{friend.name}</div>
          <div style={{ color:C.textSub,fontSize:12 }}>{friend.location||"No location yet"}</div>
        </div>
      </div>

      {/* Photo buttons */}
      <div style={{ marginBottom:16 }}>
        <div style={{ color:C.textSub,fontSize:10,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8 }}>Photo</div>
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={()=>{ fileRef.current.setAttribute("capture","user"); fileRef.current.click(); }}
            style={{ flex:1,background:C.surfaceHi,border:`1px solid ${C.border}`,borderRadius:10,padding:"9px",fontSize:12,fontWeight:700,color:C.textSub,cursor:"pointer" }}>📷 Selfie</button>
          <button onClick={()=>{ fileRef.current.removeAttribute("capture"); fileRef.current.click(); }}
            style={{ flex:1,background:C.surfaceHi,border:`1px solid ${C.border}`,borderRadius:10,padding:"9px",fontSize:12,fontWeight:700,color:C.textSub,cursor:"pointer" }}>🖼️ Gallery</button>
          {photo && <button onClick={()=>setPhoto(null)}
            style={{ background:C.coralLight,border:`1px solid ${C.coral}33`,borderRadius:10,padding:"9px 12px",fontSize:12,color:C.coral,cursor:"pointer",fontWeight:700 }}>✕</button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile}/>
      </div>

      {/* Color */}
      <div style={{ marginBottom:16 }}>
        <div style={{ color:C.textSub,fontSize:10,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8 }}>Colour</div>
        <div style={{ display:"flex",gap:9,flexWrap:"wrap" }}>
          {COLOR_OPTIONS.map(c=>(
            <button key={c} onClick={()=>setColor(c)} style={{ width:34,height:34,borderRadius:17,background:c,border:"none",cursor:"pointer",outline:color===c?`3px solid ${c}`:"3px solid transparent",outlineOffset:3,transform:color===c?"scale(1.15)":"none",transition:"all .15s" }}/>
          ))}
        </div>
      </div>

      {/* Emoji grid */}
      <div style={{ marginBottom:20 }}>
        <div style={{ color:C.textSub,fontSize:10,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8 }}>Emoji</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:5 }}>
          {AVATAR_OPTIONS.map(a=>(
            <button key={a} onClick={()=>{ setEmoji(a); setPhoto(null); }}
              style={{ background:!photo&&emoji===a?color+"22":C.surfaceHi,border:`1.5px solid ${!photo&&emoji===a?color:C.border}`,borderRadius:9,padding:"5px 0",fontSize:18,cursor:"pointer",transition:"all .13s" }}>{a}</button>
          ))}
        </div>
      </div>

      <button onClick={()=>onSave(emoji,color,photo)} style={{ width:"100%",background:color,color:"#fff",border:"none",borderRadius:13,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 4px 16px ${color}44` }}>
        Save Avatar
      </button>
    </Modal>
  );
}

/* ─── Location Picker ───────────────────────────────────────────────────────── */
// A curated list of real cities with coordinates — works 100% offline
const CITY_SUGGESTIONS = [
  // US
  { label:"Manhattan, New York",        lat:40.7831,  lng:-73.9712  },
  { label:"Brooklyn, New York",         lat:40.6782,  lng:-73.9442  },
  { label:"Hoboken, New Jersey",        lat:40.7440,  lng:-74.0324  },
  { label:"Astoria, Queens NY",         lat:40.7721,  lng:-73.9301  },
  { label:"Jersey City, New Jersey",    lat:40.7178,  lng:-74.0431  },
  { label:"Williamsburg, Brooklyn",     lat:40.7081,  lng:-73.9571  },
  { label:"Bushwick, Brooklyn",         lat:40.6944,  lng:-73.9213  },
  { label:"Long Island City, NY",       lat:40.7448,  lng:-73.9489  },
  { label:"Downtown Chicago",           lat:41.8827,  lng:-87.6233  },
  { label:"Lincoln Park, Chicago",      lat:41.9214,  lng:-87.6513  },
  { label:"Wicker Park, Chicago",       lat:41.9085,  lng:-87.6775  },
  { label:"Santa Monica, Los Angeles",  lat:34.0195,  lng:-118.4912 },
  { label:"Silver Lake, Los Angeles",   lat:34.0868,  lng:-118.2714 },
  { label:"West Hollywood, LA",         lat:34.0900,  lng:-118.3617 },
  { label:"Mission District, SF",       lat:37.7599,  lng:-122.4148 },
  { label:"Hayes Valley, SF",           lat:37.7762,  lng:-122.4244 },
  { label:"Capitol Hill, Seattle",      lat:47.6253,  lng:-122.3222 },
  { label:"Fremont, Seattle",           lat:47.6505,  lng:-122.3498 },
  { label:"South End, Boston",          lat:42.3410,  lng:-71.0723  },
  { label:"Cambridge, Massachusetts",   lat:42.3736,  lng:-71.1097  },
  { label:"Dupont Circle, Washington DC",lat:38.9096, lng:-77.0434  },
  { label:"Capitol Hill, Washington DC",lat:38.8867,  lng:-76.9969  },
  { label:"East Nashville, Tennessee",  lat:36.1749,  lng:-86.7532  },
  { label:"Midtown Atlanta",            lat:33.7838,  lng:-84.3834  },
  { label:"South Beach, Miami",         lat:25.7825,  lng:-80.1300  },
  { label:"Wynwood, Miami",             lat:25.8021,  lng:-80.1993  },
  // UK
  { label:"Shoreditch, London",         lat:51.5228,  lng:-0.0740   },
  { label:"Brixton, London",            lat:51.4613,  lng:-0.1156   },
  { label:"Peckham, London",            lat:51.4740,  lng:-0.0697   },
  { label:"Hackney, London",            lat:51.5450,  lng:-0.0553   },
  { label:"Dalston, London",            lat:51.5465,  lng:-0.0757   },
  { label:"Clapham, London",            lat:51.4616,  lng:-0.1380   },
  { label:"Camden, London",             lat:51.5390,  lng:-0.1426   },
  { label:"Islington, London",          lat:51.5362,  lng:-0.1033   },
  { label:"Marylebone, London",         lat:51.5203,  lng:-0.1500   },
  { label:"Notting Hill, London",       lat:51.5090,  lng:-0.1960   },
  { label:"Northern Quarter, Manchester",lat:53.4845, lng:-2.2348   },
  { label:"Deansgate, Manchester",      lat:53.4752,  lng:-2.2525   },
  { label:"Digbeth, Birmingham",        lat:52.4751,  lng:-1.8879   },
  { label:"Leith, Edinburgh",           lat:55.9756,  lng:-3.1741   },
  { label:"Merchant City, Glasgow",     lat:55.8583,  lng:-4.2428   },
  // Europe
  { label:"Le Marais, Paris",           lat:48.8566,  lng:2.3522    },
  { label:"Montmartre, Paris",          lat:48.8867,  lng:2.3431    },
  { label:"Prenzlauer Berg, Berlin",    lat:52.5369,  lng:13.4136   },
  { label:"Kreuzberg, Berlin",          lat:52.4987,  lng:13.4029   },
  { label:"Trastevere, Rome",           lat:41.8882,  lng:12.4696   },
  { label:"Eixample, Barcelona",        lat:41.3944,  lng:2.1614    },
  { label:"Amsterdam Centrum",          lat:52.3702,  lng:4.8952    },
  { label:"Grünerløkka, Oslo",          lat:59.9247,  lng:10.7576   },
  { label:"Vesterbro, Copenhagen",      lat:55.6711,  lng:12.5473   },
  // Australia
  { label:"Fitzroy, Melbourne",         lat:-37.7989, lng:144.9789  },
  { label:"Newtown, Sydney",            lat:-33.8974, lng:151.1787  },
  { label:"Fortitude Valley, Brisbane", lat:-27.4560, lng:153.0339  },
  // Canada
  { label:"Kensington Market, Toronto", lat:43.6543,  lng:-79.4006  },
  { label:"Mile End, Montreal",         lat:45.5228,  lng:-73.5981  },
  { label:"Commercial Drive, Vancouver",lat:49.2615,  lng:-123.0697 },
];

function LocationPickerModal({ friend, friendIndex, onSave, onClose }) {
  const [query, setQuery]       = useState(friend.location || "");
  const [filtered, setFiltered] = useState([]);
  const [chosen, setChosen]     = useState(friend.coords ? { label: friend.location, lat: friend.coords.lat, lng: friend.coords.lng } : null);
  const [gpsState, setGpsState] = useState("idle"); // idle | loading | error
  const [gpsMsg, setGpsMsg]     = useState("");

  // Filter suggestions as user types
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) { setFiltered([]); return; }
    setFiltered(
      CITY_SUGGESTIONS.filter(c => c.label.toLowerCase().includes(q)).slice(0, 7)
    );
  }, [query]);

  const select = (c) => { setChosen(c); setQuery(c.label); setFiltered([]); };

  const useGPS = () => {
    if (!navigator.geolocation) { setGpsState("error"); setGpsMsg("GPS not available in this browser."); return; }
    setGpsState("loading"); setGpsMsg("");
    navigator.geolocation.getCurrentPosition(
      pos => {
        // Find nearest city in our list
        const { latitude: lat, longitude: lng } = pos.coords;
        let best = null, bestDist = Infinity;
        for (const c of CITY_SUGGESTIONS) {
          const d = Math.hypot(c.lat - lat, c.lng - lng);
          if (d < bestDist) { bestDist = d; best = c; }
        }
        // If within ~20 km, use that name; otherwise show raw coords
        const loc = bestDist < 0.3
          ? best
          : { label: `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`, lat, lng };
        setChosen(loc); setQuery(loc.label); setFiltered([]);
        setGpsState("done");
      },
      err => {
        const msgs = { 1:"Location permission denied — please allow access and retry.", 2:"Position unavailable.", 3:"GPS timed out — try searching instead." };
        setGpsState("error"); setGpsMsg(msgs[err.code] || "GPS error.");
      },
      { timeout:10000, maximumAge:120000 }
    );
  };

  const save = () => {
    if (!chosen) return;
    onSave(friendIndex, { location: chosen.label, coords: { lat: chosen.lat, lng: chosen.lng } });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:36,height:36,borderRadius:18,background:friend.color+"22",border:`2px solid ${friend.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,overflow:"hidden",flexShrink:0 }}>
            {friend.photo ? <img src={friend.photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : friend.avatar}
          </div>
          <div style={{ color:C.text,fontSize:15,fontWeight:800 }}>Set Location for {friend.name}</div>
        </div>
        <button onClick={onClose} style={{ width:28,height:28,borderRadius:14,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textSub,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>✕</button>
      </div>

      {/* GPS button */}
      <button onClick={useGPS} disabled={gpsState==="loading"} style={{ width:"100%",background:gpsState==="done"?C.accentLight:C.surfaceHi,border:`1.5px solid ${gpsState==="done"?C.accent:C.border}`,borderRadius:11,padding:"11px",fontSize:13,fontWeight:700,color:gpsState==="done"?C.accent:C.textSub,cursor:gpsState==="loading"?"wait":"pointer",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"all .15s" }}>
        {gpsState==="loading"
          ? <><SpinIcon/>Detecting your location…</>
          : gpsState==="done"
          ? <>✓ Using GPS location</>
          : <>📡 Use My Current Location</>}
      </button>
      {gpsState==="error" && <div style={{ color:C.coral,fontSize:12,marginBottom:8,background:C.coralLight,borderRadius:8,padding:"8px 10px",lineHeight:1.4 }}>⚠️ {gpsMsg}</div>}

      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
        <div style={{ flex:1,height:1,background:C.border }}/><span style={{ color:C.muted,fontSize:11,fontWeight:600 }}>or search</span><div style={{ flex:1,height:1,background:C.border }}/>
      </div>

      {/* Search input */}
      <div style={{ position:"relative",marginBottom:4 }}>
        <input value={query} onChange={e=>{ setQuery(e.target.value); setChosen(null); }}
          placeholder="Type a city or neighbourhood…"
          style={{ width:"100%",background:C.surfaceHi,border:`1.5px solid ${chosen?C.accent:C.border}`,borderRadius:10,padding:"10px 36px 10px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"system-ui",boxSizing:"border-box" }}/>
        {chosen && <span style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:C.accent,fontWeight:700 }}>✓</span>}
      </div>

      {/* Dropdown */}
      {filtered.length > 0 && (
        <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,overflow:"hidden",boxShadow:`0 4px 16px ${C.shadowMd}`,marginBottom:8 }}>
          {filtered.map((c,i)=>(
            <button key={i} onClick={()=>select(c)} style={{ width:"100%",background:"transparent",border:"none",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",padding:"10px 14px",textAlign:"left",cursor:"pointer",color:C.text,fontSize:13,display:"block" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              📍 {c.label}
            </button>
          ))}
        </div>
      )}

      {chosen && (
        <div style={{ color:C.accent,fontSize:11,fontWeight:600,marginBottom:4,display:"flex",alignItems:"center",gap:5 }}>
          ✓ <span style={{ color:C.textSub }}>{chosen.lat.toFixed(4)}, {chosen.lng.toFixed(4)}</span>
        </div>
      )}

      <button onClick={save} disabled={!chosen} style={{ width:"100%",marginTop:14,background:chosen?C.accent:C.surfaceHi,color:chosen?"#fff":C.muted,border:"none",borderRadius:13,padding:"14px 0",fontSize:15,fontWeight:800,cursor:chosen?"pointer":"not-allowed",boxShadow:chosen?`0 4px 16px ${C.accent}44`:"none",transition:"all .2s" }}>
        {chosen ? `Confirm — ${chosen.label.split(",")[0]}` : "Search or use GPS to set location"}
      </button>
    </Modal>
  );
}

/* ─── Contact Sheet ─────────────────────────────────────────────────────────── */
// Adds a new friend from a "contact" — name + location search. Works everywhere.
function ContactSheet({ slotIndex, existingName, onAdd, onClose }) {
  const [name,    setName]    = useState(existingName || "");
  const [query,   setQuery]   = useState("");
  const [filtered,setFiltered]= useState([]);
  const [chosen,  setChosen]  = useState(null);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) { setFiltered([]); return; }
    setFiltered(CITY_SUGGESTIONS.filter(c=>c.label.toLowerCase().includes(q)).slice(0,7));
  }, [query]);

  const select = c => { setChosen(c); setQuery(c.label); setFiltered([]); };

  const submit = () => {
    if (!name.trim() || !chosen) return;
    onAdd(slotIndex, { name: name.trim(), location: chosen.label, coords: { lat: chosen.lat, lng: chosen.lng } });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <div style={{ color:C.text,fontSize:16,fontWeight:800 }}>👤 Add from Contacts</div>
        <button onClick={onClose} style={{ width:28,height:28,borderRadius:14,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textSub,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
      </div>

      <div style={{ color:C.textSub,fontSize:12,lineHeight:1.6,marginBottom:16,background:C.surfaceHi,borderRadius:10,padding:"10px 12px" }}>
        Enter your contact's name and choose their location from the list.
      </div>

      <div style={{ marginBottom:14 }}>
        <div style={{ color:C.textSub,fontSize:10,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7 }}>Contact Name</div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sarah, Dad, Work Friend…"
          style={{ width:"100%",background:C.surfaceHi,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",color:C.text,fontSize:14,outline:"none",fontFamily:"system-ui",boxSizing:"border-box" }}/>
      </div>

      <div style={{ marginBottom:8 }}>
        <div style={{ color:C.textSub,fontSize:10,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7 }}>Their Location</div>
        <div style={{ position:"relative" }}>
          <input value={query} onChange={e=>{ setQuery(e.target.value); setChosen(null); }} placeholder="Type city or neighbourhood…"
            style={{ width:"100%",background:C.surfaceHi,border:`1.5px solid ${chosen?C.accent:C.border}`,borderRadius:10,padding:"10px 36px 10px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"system-ui",boxSizing:"border-box" }}/>
          {chosen && <span style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:C.accent,fontWeight:700 }}>✓</span>}
        </div>

        {filtered.length > 0 && (
          <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,overflow:"hidden",boxShadow:`0 4px 16px ${C.shadowMd}`,marginTop:4 }}>
            {filtered.map((c,i)=>(
              <button key={i} onClick={()=>select(c)} style={{ width:"100%",background:"transparent",border:"none",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",padding:"10px 14px",textAlign:"left",cursor:"pointer",color:C.text,fontSize:13 }}
                onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                📍 {c.label}
              </button>
            ))}
          </div>
        )}
        {chosen && <div style={{ color:C.accent,fontSize:11,fontWeight:600,marginTop:5 }}>✓ {chosen.lat.toFixed(4)}, {chosen.lng.toFixed(4)}</div>}
      </div>

      <button onClick={submit} disabled={!name.trim()||!chosen} style={{ width:"100%",marginTop:14,background:name.trim()&&chosen?C.accent:C.surfaceHi,color:name.trim()&&chosen?"#fff":C.muted,border:"none",borderRadius:13,padding:"14px 0",fontSize:15,fontWeight:800,cursor:name.trim()&&chosen?"pointer":"not-allowed",boxShadow:name.trim()&&chosen?`0 4px 16px ${C.accent}44`:"none",transition:"all .2s" }}>
        {name.trim()&&chosen ? `Add ${name.trim()} →` : "Enter name & location to continue"}
      </button>
    </Modal>
  );
}

/* ─── Spin icon ─────────────────────────────────────────────────────────────── */
const SpinIcon = () => (
  <>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <span style={{ display:"inline-block",width:13,height:13,borderRadius:"50%",border:`2px solid ${C.accent}33`,borderTopColor:C.accent,animation:"spin .7s linear infinite",flexShrink:0 }}/>
  </>
);

/* ─── Info Modal ────────────────────────────────────────────────────────────── */
function InfoModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
        <div>
          <div style={{ fontFamily:"Georgia,serif",color:C.text,fontSize:17,fontWeight:800 }}>📍 Meet Me In <span style={{ color:C.accent }}>The Middle</span></div>
          <div style={{ color:C.textSub,fontSize:12,marginTop:2 }}>What makes this app different</div>
        </div>
        <button onClick={onClose} style={{ width:28,height:28,borderRadius:14,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textSub,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>✕</button>
      </div>
      <div style={{ background:C.accentLight,border:`1px solid ${C.accent}44`,borderRadius:9,padding:"8px 12px",marginBottom:14,display:"flex",gap:18,flexWrap:"wrap" }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:9,height:9,borderRadius:5,background:C.accent }}/><span style={{ fontSize:11,fontWeight:700,color:C.accent }}>Unique to this app</span></div>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:9,height:9,borderRadius:5,background:C.borderMid }}/><span style={{ fontSize:11,fontWeight:600,color:C.textSub }}>Standard feature</span></div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {FEATURES.map(f=>(
          <div key={f.title} style={{ background:f.unique?C.accentLight:C.surfaceHi,border:`1.5px solid ${f.unique?C.accent+"44":C.border}`,borderLeft:`4px solid ${f.unique?C.accent:C.borderMid}`,borderRadius:11,padding:"11px 13px",display:"flex",gap:11,alignItems:"flex-start" }}>
            <span style={{ fontSize:19,flexShrink:0,marginTop:1 }}>{f.emoji}</span>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:2 }}>
                <span style={{ color:C.text,fontWeight:700,fontSize:13 }}>{f.title}</span>
                {f.unique&&<span style={{ background:C.accent,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,padding:"2px 7px",textTransform:"uppercase" }}>Only here</span>}
              </div>
              <div style={{ color:f.unique?C.accent+"bb":C.textSub,fontSize:12,lineHeight:1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16,padding:"10px 12px",borderRadius:11,background:C.goldLight,border:`1px solid ${C.gold}44`,color:C.gold,fontSize:12,textAlign:"center",fontWeight:700 }}>
        Outperforms MeetWays · WhatsHalfway · midPoint. · Meedol
      </div>
    </Modal>
  );
}

/* ─── Venue Detail Modal ────────────────────────────────────────────────────── */
function VenueModal({ venue, friends, friendColors, travelMode, onClose }) {
  const times   = friends.map((f,i) => venue.mins[i] ?? 20);
  const maxT    = Math.max(...times), minT = Math.min(...times);
  const fairness = maxT > 0 ? Math.round((1-(maxT-minT)/maxT)*100) : 100;
  const speeds  = { driving:40, transit:25, walking:5, cycling:15 };
  return (
    <Modal onClose={onClose} maxH="75vh">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:4 }}>
            <span style={{ fontSize:26 }}>{venue.icon}</span>
            <div>
              <div style={{ color:C.text,fontSize:17,fontWeight:800,lineHeight:1.2 }}>{venue.name}</div>
              <div style={{ color:C.textSub,fontSize:12 }}>{venue.address}</div>
            </div>
          </div>
          <div style={{ color:C.textSub,fontSize:13,lineHeight:1.5,marginTop:6 }}>{venue.desc}</div>
        </div>
        <button onClick={onClose} style={{ width:28,height:28,borderRadius:14,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textSub,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:10 }}>✕</button>
      </div>
      <div style={{ display:"flex",gap:8,marginBottom:14,flexWrap:"wrap" }}>
        <span style={{ background:C.accentLight,color:C.accent,borderRadius:99,fontSize:11,fontWeight:700,padding:"3px 10px" }}>{venue.price}</span>
        <span style={{ background:C.goldLight,color:C.gold,borderRadius:99,fontSize:11,fontWeight:700,padding:"3px 10px" }}>★ {venue.rating}</span>
      </div>
      <div style={{ background:C.surfaceHi,borderRadius:13,padding:"13px",border:`1px solid ${C.border}` }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
          <div style={{ color:C.text,fontWeight:700,fontSize:13 }}>Travel Fairness</div>
          <div style={{ color:fairness>80?C.accent:fairness>60?C.gold:C.coral,fontWeight:800,fontSize:15 }}>{fairness}%</div>
        </div>
        <FairnessBar values={times} colors={friendColors}/>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:8 }}>
          {friends.map((f,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:5,background:C.surface,borderRadius:99,padding:"4px 10px",border:`1px solid ${friendColors[i]}44` }}>
              <span style={{ fontSize:13 }}>{f.photo?<img src={f.photo} alt="" style={{ width:15,height:15,borderRadius:8,objectFit:"cover" }}/>:f.avatar}</span>
              <span style={{ color:friendColors[i],fontWeight:700,fontSize:11 }}>{f.name}</span>
              <span style={{ color:C.textSub,fontSize:11 }}>~{times[i]}min</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

/* ─── Home Screen ───────────────────────────────────────────────────────────── */
function HomeScreen({ onStart, onInfo }) {
  const [up, setUp] = useState(false);
  useEffect(()=>{ setTimeout(()=>setUp(true),60); },[]);
  return (
    <div style={{ minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,position:"relative",background:`radial-gradient(ellipse at 25% 15%,${C.accent}12 0%,transparent 55%),${C.bg}` }}>
      <button onClick={onInfo} style={{ position:"absolute",top:14,right:16,width:36,height:36,borderRadius:18,background:C.surface,border:`1.5px solid ${C.border}`,color:C.textSub,fontSize:17,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${C.shadow}`,transition:"all .15s" }}
        onMouseEnter={e=>{ e.currentTarget.style.background=C.accentLight; e.currentTarget.style.color=C.accent; }}
        onMouseLeave={e=>{ e.currentTarget.style.background=C.surface; e.currentTarget.style.color=C.textSub; }}>ⓘ</button>
      <div style={{ opacity:up?1:0,transform:up?"none":"translateY(22px)",transition:"all .55s cubic-bezier(.16,1,.3,1)",textAlign:"center" }}>
        <div style={{ width:90,height:90,borderRadius:25,margin:"0 auto 22px",background:`linear-gradient(145deg,${C.accentLight},${C.accent}28)`,border:`2px solid ${C.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,boxShadow:`0 6px 28px ${C.accent}20` }}>📍</div>
        <div style={{ fontFamily:"Georgia,'Times New Roman',serif",fontSize:30,fontWeight:700,color:C.text,lineHeight:1.25,marginBottom:8 }}>
          Meet Me In<br/><span style={{ color:C.accent }}>The Middle</span>
        </div>
        <div style={{ color:C.textSub,fontSize:14,marginBottom:36,maxWidth:256,lineHeight:1.65 }}>Find the perfect spot for everyone — fair travel, great venues, group consensus.</div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:40 }}>
          {["2–4 Friends","12 Categories","Fair Travel","Vibe Matching","Group Vote"].map(f=>(
            <span key={f} style={{ background:C.surface,border:`1px solid ${C.border}`,color:C.textSub,borderRadius:99,padding:"5px 13px",fontSize:11,fontWeight:600,boxShadow:`0 1px 4px ${C.shadow}` }}>✓ {f}</span>
          ))}
        </div>
        <button onClick={onStart} style={{ width:"100%",maxWidth:288,background:C.accent,color:"#fff",border:"none",borderRadius:16,padding:"16px 0",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 24px ${C.accent}44`,transition:"transform .13s" }}
          onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
          onMouseUp={e=>e.currentTarget.style.transform="none"}>
          Start Planning →
        </button>
      </div>
    </div>
  );
}

/* ─── Add Friends Screen ────────────────────────────────────────────────────── */
function AddFriendsScreen({ onNext }) {
  const [friends, setFriends] = useState([
    { id:0, name:"Alex",   avatar:"🧑", color:FRIEND_COLORS[0], photo:null, location:"", coords:null },
    { id:1, name:"Jordan", avatar:"👩", color:FRIEND_COLORS[1], photo:null, location:"", coords:null },
  ]);
  const [avatarFor,   setAvatarFor]   = useState(null); // friend index
  const [locationFor, setLocationFor] = useState(null); // friend index
  const [contactSlot, setContactSlot] = useState(null); // friend index
  const [travelMode,  setTravelMode]  = useState("driving");

  const update = (i, patch) => setFriends(f => f.map((fr,j) => j===i ? {...fr,...patch} : fr));

  const addFriend = () => {
    if (friends.length >= 4) return;
    const defs = [{ name:"Sam", avatar:"🧔" },{ name:"Riley", avatar:"👱" }];
    const d = defs[friends.length-2] || { name:"Friend", avatar:"🧑" };
    setFriends(f => [...f, { ...d, id:Date.now(), color:FRIEND_COLORS[f.length], photo:null, location:"", coords:null }]);
  };

  const readyCount = friends.filter(f=>f.coords).length;

  return (
    <div style={{ padding:"22px 18px 32px",fontFamily:"system-ui" }}>
      {/* Modals */}
      {avatarFor   !== null && <AvatarPickerModal   friend={friends[avatarFor]}   onSave={(av,col,ph)=>{ update(avatarFor,{avatar:av,color:col,photo:ph}); setAvatarFor(null); }}   onClose={()=>setAvatarFor(null)}/>}
      {locationFor !== null && <LocationPickerModal friend={friends[locationFor]} friendIndex={locationFor} onSave={update} onClose={()=>setLocationFor(null)}/>}
      {contactSlot !== null && <ContactSheet slotIndex={contactSlot} existingName={friends[contactSlot]?.name} onAdd={update} onClose={()=>setContactSlot(null)}/>}

      <div style={{ color:C.accent,fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>Step 1 of 3</div>
      <div style={{ color:C.text,fontSize:22,fontWeight:800,marginBottom:4 }}>Who's meeting up?</div>
      <div style={{ color:C.textSub,fontSize:13,marginBottom:20,lineHeight:1.5 }}>Add 2–4 people and set each person's starting location.</div>

      <div style={{ display:"flex",flexDirection:"column",gap:11,marginBottom:14 }}>
        {friends.map((f,i) => (
          <div key={f.id} style={{ background:C.surface,border:`1.5px solid ${f.coords?f.color:C.border}`,borderRadius:15,padding:"13px 15px",boxShadow:`0 2px 8px ${C.shadow}`,transition:"border-color .2s" }}>
            <div style={{ display:"flex",alignItems:"center",gap:11 }}>
              {/* Avatar tap */}
              <button onClick={()=>setAvatarFor(i)} style={{ width:50,height:50,borderRadius:25,position:"relative",background:f.color+"22",border:`2.5px solid ${f.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:f.photo?0:21,cursor:"pointer",flexShrink:0,overflow:"hidden",transition:"transform .13s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.07)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                {f.photo ? <img src={f.photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : f.avatar}
                <span style={{ position:"absolute",bottom:-1,right:-1,width:16,height:16,borderRadius:8,background:C.text,border:`2px solid ${C.surface}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7 }}>✏️</span>
              </button>

              <div style={{ flex:1 }}>
                <div style={{ color:C.text,fontWeight:700,fontSize:14 }}>{f.name}</div>
                <div style={{ color:f.coords?C.accent:C.muted,fontSize:12,marginTop:1 }}>
                  {f.coords ? `✓ ${f.location}` : "No location set"}
                </div>
              </div>

              <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
                <button onClick={()=>setLocationFor(i)} style={{ background:f.coords?C.accentLight:C.accent,border:"none",color:f.coords?C.accent:"#fff",borderRadius:8,padding:"5px 11px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap" }}>
                  {f.coords?"📍 Change":"📍 Set Location"}
                </button>
                <button onClick={()=>setContactSlot(i)} style={{ background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textSub,borderRadius:8,padding:"5px 11px",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }}>
                  👤 From Contact
                </button>
              </div>
            </div>
            {friends.length > 2 && (
              <button onClick={()=>setFriends(fr=>fr.filter((_,j)=>j!==i))} style={{ marginTop:9,background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:7,padding:"4px 12px",fontSize:11,cursor:"pointer" }}>Remove</button>
            )}
          </div>
        ))}
      </div>

      {friends.length < 4 && (
        <button onClick={addFriend} style={{ width:"100%",background:"transparent",border:`1.5px dashed ${C.borderMid}`,borderRadius:14,color:C.muted,padding:"12px 0",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .18s",marginBottom:18 }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.color=C.accent; e.currentTarget.style.background=C.accentLight; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.borderMid; e.currentTarget.style.color=C.muted; e.currentTarget.style.background="transparent"; }}>
          + Add another person ({friends.length}/4)
        </button>
      )}

      <div style={{ marginBottom:22 }}>
        <div style={{ color:C.text,fontWeight:700,fontSize:14,marginBottom:9 }}>Travel mode</div>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
          {[["🚗","driving","Driving"],["🚇","transit","Transit"],["🚶","walking","Walking"],["🚲","cycling","Cycling"]].map(([ic,id,lb])=>(
            <Pill key={id} active={travelMode===id} onClick={()=>setTravelMode(id)}>{ic} {lb}</Pill>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display:"flex",gap:5,marginBottom:10 }}>
        {friends.map((f,i)=><div key={i} style={{ flex:1,height:4,borderRadius:2,background:f.coords?f.color:C.border,transition:"background .3s" }}/>)}
      </div>
      <div style={{ color:C.textSub,fontSize:12,textAlign:"center",marginBottom:14 }}>
        {readyCount < 2 ? `Set ${2-readyCount} more location${readyCount===1?"":"s"} to continue` : `${readyCount}/${friends.length} locations confirmed ✓`}
      </div>

      <button onClick={()=>onNext(friends,travelMode)} disabled={readyCount<2} style={{ width:"100%",background:readyCount>=2?C.accent:C.surfaceHi,color:readyCount>=2?"#fff":C.muted,border:"none",borderRadius:13,padding:"15px 0",fontSize:15,fontWeight:800,cursor:readyCount>=2?"pointer":"not-allowed",boxShadow:readyCount>=2?`0 4px 20px ${C.accent}44`:"none",transition:"all .2s" }}>
        {readyCount>=2?"Choose Categories →":"Set at least 2 locations first"}
      </button>
    </div>
  );
}

/* ─── Categories ────────────────────────────────────────────────────────────── */
function CategoriesScreen({ friends, travelMode, onNext }) {
  const [selected, setSelected] = useState(["restaurant","bar","cafe"]);
  const [vibe,     setVibe]     = useState("casual");
  const toggle = id => setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const VIBES = [{id:"casual",e:"😎",l:"Casual"},{id:"fancy",e:"🥂",l:"Treat Yourselves"},{id:"active",e:"🏃",l:"Active"},{id:"culture",e:"🎨",l:"Cultural"},{id:"date",e:"💫",l:"Date Night"}];
  return (
    <div style={{ padding:"22px 18px 32px",fontFamily:"system-ui" }}>
      <div style={{ color:C.accent,fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>Step 2 of 3</div>
      <div style={{ color:C.text,fontSize:22,fontWeight:800,marginBottom:4 }}>What's the vibe?</div>
      <div style={{ color:C.textSub,fontSize:13,marginBottom:20 }}>Choose the mood and the types of places to look for.</div>
      <div style={{ marginBottom:22 }}>
        <div style={{ color:C.text,fontWeight:700,fontSize:13,marginBottom:9 }}>Mood</div>
        <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:4 }}>
          {VIBES.map(v=>(
            <button key={v.id} onClick={()=>setVibe(v.id)} style={{ flexShrink:0,background:vibe===v.id?C.accentLight:C.surface,border:`1.5px solid ${vibe===v.id?C.accent:C.border}`,borderRadius:13,padding:"9px 13px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,boxShadow:`0 1px 4px ${C.shadow}`,transition:"all .16s" }}>
              <span style={{ fontSize:21 }}>{v.e}</span>
              <span style={{ color:vibe===v.id?C.accent:C.textSub,fontSize:10,fontWeight:700,whiteSpace:"nowrap" }}>{v.l}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ color:C.text,fontWeight:700,fontSize:13,marginBottom:9 }}>Categories <span style={{ color:C.textSub,fontWeight:400,fontSize:12 }}>({selected.length})</span></div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:26 }}>
        {CATEGORIES.map(cat=>{
          const on=selected.includes(cat.id);
          return (
            <button key={cat.id} onClick={()=>toggle(cat.id)} style={{ background:on?C.accentLight:C.surface,border:`1.5px solid ${on?C.accent:C.border}`,borderRadius:11,padding:"11px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:`0 1px 4px ${C.shadow}`,transition:"all .16s" }}>
              <span style={{ fontSize:19 }}>{cat.icon}</span>
              <span style={{ color:on?C.accent:C.textSub,fontSize:12,fontWeight:600,textAlign:"left" }}>{cat.label}</span>
              {on&&<span style={{ marginLeft:"auto",color:C.accent }}>✓</span>}
            </button>
          );
        })}
      </div>
      <button onClick={()=>onNext(selected,vibe)} disabled={!selected.length} style={{ width:"100%",background:selected.length?C.accent:C.surfaceHi,color:selected.length?"#fff":C.muted,border:"none",borderRadius:13,padding:"15px 0",fontSize:15,fontWeight:800,cursor:selected.length?"pointer":"not-allowed",boxShadow:selected.length?`0 4px 20px ${C.accent}44`:"none",transition:"all .2s" }}>
        Find Our Midpoint →
      </button>
    </div>
  );
}

/* ─── Results Screen ────────────────────────────────────────────────────────── */
function ResultsScreen({ friends, categories, travelMode }) {
  const [tab,          setTab]          = useState("list");
  const [filter,       setFilter]       = useState("all");
  const [expanded,     setExpanded]     = useState(null);
  const [saved,        setSaved]        = useState([]);
  const [votes,        setVotes]        = useState({});
  const [detailVenue,  setDetailVenue]  = useState(null);

  const activeFriends = friends.filter(f=>f.coords);
  const colors        = activeFriends.map((_,i)=>FRIEND_COLORS[i]);

  // Filter venues to selected categories
  const venues = VENUE_DB.default.filter(v => categories.includes(v.cat));
  const shown  = filter==="all" ? venues : venues.filter(v=>v.cat===filter);

  // Midpoint label (just pick the city from first two friends for display)
  const cityA = activeFriends[0]?.location?.split(",")[0] || "";
  const cityB = activeFriends[1]?.location?.split(",")[0] || "";
  const midLabel = cityA && cityB ? `Between ${cityA} & ${cityB}` : "Your Group Midpoint";

  // Fairness score for a venue
  const fairness = (v) => {
    const t = activeFriends.map((_,i)=>v.mins[i]??20);
    const mx=Math.max(...t), mn=Math.min(...t);
    return { times:t, pct: mx>0?Math.round((1-(mx-mn)/mx)*100):100 };
  };

  return (
    <div style={{ fontFamily:"system-ui" }}>
      {detailVenue && <VenueModal venue={detailVenue} friends={activeFriends} friendColors={colors} travelMode={travelMode} onClose={()=>setDetailVenue(null)}/>}

      {/* Banner */}
      <div style={{ background:`linear-gradient(135deg,${C.accent}12,${C.gold}09)`,borderBottom:`1px solid ${C.border}`,padding:"14px 18px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div>
            <div style={{ color:C.accent,fontSize:10,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase" }}>Midpoint Found</div>
            <div style={{ color:C.text,fontSize:16,fontWeight:800 }}>{midLabel}</div>
            <div style={{ color:C.textSub,fontSize:12 }}>{venues.length} venues matched · max ±{Math.max(...venues.map(v=>{const t=fairness(v);return Math.max(...t.times)-Math.min(...t.times);}))??8} min deviation</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:C.muted,fontSize:10 }}>FRIENDS</div>
            <div style={{ color:C.text,fontSize:22,fontWeight:900 }}>{activeFriends.length}</div>
          </div>
        </div>
        <div style={{ display:"flex",gap:7,marginTop:10,flexWrap:"wrap" }}>
          {activeFriends.map((f,i)=>(
            <div key={i} style={{ background:C.surface,borderRadius:99,padding:"4px 10px",display:"flex",alignItems:"center",gap:5,border:`1px solid ${colors[i]}44`,boxShadow:`0 1px 3px ${C.shadow}` }}>
              {f.photo?<img src={f.photo} alt="" style={{ width:17,height:17,borderRadius:9,objectFit:"cover" }}/>:<span style={{ fontSize:13 }}>{f.avatar}</span>}
              <span style={{ color:colors[i],fontWeight:700,fontSize:12 }}>{f.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",borderBottom:`1px solid ${C.border}`,background:C.surface }}>
        {[["list","📋 List"],["map","🗺️ Map"],["vote","🗳️ Vote"]].map(([id,lb])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ flex:1,background:"transparent",border:"none",borderBottom:`2.5px solid ${tab===id?C.accent:"transparent"}`,color:tab===id?C.accent:C.textSub,padding:"11px 4px",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .18s" }}>{lb}</button>
        ))}
      </div>

      {/* ── LIST ── */}
      {tab==="list" && (
        <div style={{ padding:"14px 14px 80px" }}>
          <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:14 }}>
            <Pill active={filter==="all"} onClick={()=>setFilter("all")}>All ({venues.length})</Pill>
            {categories.map(id=>{
              const cat=CATEGORIES.find(c=>c.id===id);
              const cnt=venues.filter(v=>v.cat===id).length;
              if(!cat||!cnt) return null;
              return <Pill key={id} active={filter===id} onClick={()=>setFilter(id)}>{cat.icon} {cat.label}</Pill>;
            })}
          </div>
          {shown.length===0&&<div style={{ color:C.textSub,textAlign:"center",padding:"40px 0",fontSize:13 }}>No venues for this category.</div>}
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {shown.map(v=>{
              const {times,pct}=fairness(v);
              const isSaved=saved.includes(v.id);
              const isOpen=expanded===v.id;
              return (
                <div key={v.id} onClick={()=>setExpanded(isOpen?null:v.id)} style={{ background:C.surface,border:`1.5px solid ${isOpen?C.accent:C.border}`,borderRadius:14,padding:"14px",cursor:"pointer",transition:"all .18s",boxShadow:isOpen?`0 4px 18px ${C.accent}20`:`0 2px 6px ${C.shadow}` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                    <div style={{ display:"flex",gap:10,flex:1 }}>
                      <div style={{ width:44,height:44,borderRadius:11,background:C.surfaceHi,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0 }}>{v.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ color:C.text,fontWeight:700,fontSize:14 }}>{v.name}</div>
                        <div style={{ color:C.textSub,fontSize:11,marginTop:1 }}>{v.address} · {v.price} · ★{v.rating}</div>
                      </div>
                    </div>
                    <button onClick={e=>{ e.stopPropagation(); setSaved(s=>isSaved?s.filter(x=>x!==v.id):[...s,v.id]); }} style={{ background:"transparent",border:"none",fontSize:18,cursor:"pointer",color:isSaved?C.gold:C.borderMid,flexShrink:0 }}>{isSaved?"★":"☆"}</button>
                  </div>
                  {isOpen&&<div style={{ color:C.textSub,fontSize:12,lineHeight:1.55,marginBottom:10,paddingTop:8,borderTop:`1px solid ${C.border}` }}>{v.desc}</div>}
                  <div>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                      <div style={{ color:C.textSub,fontSize:10,fontWeight:700,letterSpacing:"0.05em" }}>TRAVEL FAIRNESS</div>
                      <div style={{ color:pct>80?C.accent:pct>60?C.gold:C.coral,fontWeight:700,fontSize:11 }}>{pct}%</div>
                    </div>
                    <FairnessBar values={times} colors={colors}/>
                    <div style={{ display:"flex",gap:9,marginTop:5,flexWrap:"wrap" }}>
                      {activeFriends.map((f,j)=><span key={j} style={{ fontSize:10,color:colors[j],fontWeight:600 }}>{f.name}: ~{times[j]}min</span>)}
                    </div>
                  </div>
                  {isOpen&&(
                    <div style={{ display:"flex",gap:7,marginTop:11 }}>
                      <button onClick={e=>{ e.stopPropagation(); setDetailVenue(v); }} style={{ flex:1,background:C.accentLight,border:`1px solid ${C.accent}44`,color:C.accent,borderRadius:9,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer" }}>View Details</button>
                      <button onClick={e=>{ e.stopPropagation(); setVotes(p=>({...p,[v.id]:"suggest"}))} } style={{ flex:1,background:votes[v.id]==="suggest"?C.goldLight:C.surfaceHi,border:`1px solid ${votes[v.id]==="suggest"?C.gold+"44":C.border}`,color:votes[v.id]==="suggest"?C.gold:C.textSub,borderRadius:9,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer" }}>🗳️ Suggest</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MAP ── */}
      {tab==="map" && (
        <div style={{ padding:"14px 14px 80px" }}>
          {/* Schematic map — friends + midpoint + venues as positioned pins */}
          <div style={{ background:"#D6EAD7",borderRadius:14,height:300,position:"relative",overflow:"hidden",border:`1px solid ${C.border}`,marginBottom:12 }}>
            {/* Road grid */}
            {[20,42,65,82].map(t=><div key={t} style={{ position:"absolute",left:0,right:0,top:`${t}%`,height:7,background:"#fff",opacity:0.55 }}/>)}
            {[18,38,58,78].map(l=><div key={l} style={{ position:"absolute",top:0,bottom:0,left:`${l}%`,width:7,background:"#fff",opacity:0.55 }}/>)}

            {/* Midpoint */}
            <div style={{ position:"absolute",top:"47%",left:"50%",transform:"translate(-50%,-50%)",zIndex:10 }}>
              <div style={{ width:22,height:22,borderRadius:11,background:C.accent,border:"3px solid white",boxShadow:`0 0 14px ${C.accent}99` }}/>
              <div style={{ position:"absolute",top:-22,left:"50%",transform:"translateX(-50%)",background:C.surface,border:`1px solid ${C.accent}`,borderRadius:6,padding:"2px 7px",whiteSpace:"nowrap",color:C.accent,fontSize:9,fontWeight:700,boxShadow:`0 2px 6px ${C.shadow}` }}>Midpoint</div>
            </div>

            {/* Friend pins */}
            {[["17%","20%"],["80%","72%"],["20%","74%"],["78%","22%"]].slice(0,activeFriends.length).map((pos,i)=>(
              <div key={i} style={{ position:"absolute",top:pos[1],left:pos[0],width:32,height:32,borderRadius:16,background:colors[i],border:"2.5px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:activeFriends[i].photo?0:15,boxShadow:`0 2px 8px ${colors[i]}66`,overflow:"hidden" }}>
                {activeFriends[i].photo?<img src={activeFriends[i].photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:activeFriends[i].avatar}
              </div>
            ))}

            {/* Dashed lines to midpoint */}
            <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }}>
              {[["17%","20%"],["80%","72%"],["20%","74%"],["78%","22%"]].slice(0,activeFriends.length).map((pos,i)=>(
                <line key={i} x1={pos[0]} y1={pos[1]} x2="50%" y2="47%" stroke={colors[i]} strokeWidth="1.5" strokeDasharray="5,4" opacity="0.5"/>
              ))}
            </svg>

            {/* Venue pins */}
            {shown.slice(0,8).map((v,i)=>(
              <button key={v.id} onClick={()=>setDetailVenue(v)} style={{ position:"absolute",top:`${32+Math.sin(i*1.4)*16}%`,left:`${43+Math.cos(i*1.1)*19}%`,background:"white",border:`1.5px solid ${C.border}`,borderRadius:8,padding:"3px 5px",fontSize:16,cursor:"pointer",boxShadow:`0 2px 6px ${C.shadow}`,transition:"transform .13s",zIndex:5 }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}
                title={v.name}>{v.icon}</button>
            ))}

            <div style={{ position:"absolute",bottom:8,right:8,background:C.surface+"ee",borderRadius:7,padding:"3px 8px",color:C.textSub,fontSize:10 }}>Tap pins for details</div>
          </div>

          {/* Legend */}
          <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
            {activeFriends.map((f,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:5,background:C.surface,borderRadius:99,padding:"5px 11px",border:`1px solid ${C.border}`,boxShadow:`0 1px 3px ${C.shadow}` }}>
                <div style={{ width:9,height:9,borderRadius:5,background:colors[i] }}/><span style={{ color:C.text,fontSize:12,fontWeight:600 }}>{f.name}</span>
              </div>
            ))}
            <div style={{ display:"flex",alignItems:"center",gap:5,background:C.surface,borderRadius:99,padding:"5px 11px",border:`1px solid ${C.border}` }}>
              <div style={{ width:9,height:9,borderRadius:5,background:C.accent }}/><span style={{ color:C.text,fontSize:12,fontWeight:600 }}>Midpoint</span>
            </div>
          </div>
        </div>
      )}

      {/* ── VOTE ── */}
      {tab==="vote" && (
        <div style={{ padding:"14px 14px 80px" }}>
          <div style={{ background:C.accentLight,borderRadius:11,padding:"11px 13px",marginBottom:14,border:`1px solid ${C.accent}33` }}>
            <div style={{ color:C.accent,fontWeight:700,fontSize:13 }}>🗳️ Group Voting</div>
            <div style={{ color:C.textSub,fontSize:12,marginTop:2,lineHeight:1.5 }}>Vote on the venues below. The winner has the most 👍s across your group.</div>
          </div>
          {venues.slice(0,8).map(v=>{
            const mv=votes[v.id];
            return (
              <div key={v.id} style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px",marginBottom:8,display:"flex",gap:10,alignItems:"center",boxShadow:`0 1px 5px ${C.shadow}` }}>
                <div style={{ width:38,height:38,borderRadius:9,background:C.surfaceHi,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0 }}>{v.icon}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ color:C.text,fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{v.name}</div>
                  <div style={{ color:C.textSub,fontSize:11 }}>{v.address} · {v.price}</div>
                </div>
                <div style={{ display:"flex",gap:5,flexShrink:0 }}>
                  <button onClick={()=>setVotes(p=>({...p,[v.id]:mv==="up"?null:"up"}))} style={{ background:mv==="up"?C.accentLight:C.surfaceHi,border:`1.5px solid ${mv==="up"?C.accent:C.border}`,borderRadius:9,padding:"6px 10px",cursor:"pointer",fontSize:14,transition:"all .14s" }}>👍</button>
                  <button onClick={()=>setVotes(p=>({...p,[v.id]:mv==="down"?null:"down"}))} style={{ background:mv==="down"?C.coralLight:C.surfaceHi,border:`1.5px solid ${mv==="down"?C.coral:C.border}`,borderRadius:9,padding:"6px 10px",cursor:"pointer",fontSize:14,transition:"all .14s" }}>👎</button>
                </div>
              </div>
            );
          })}
          <button style={{ width:"100%",background:C.accent,color:"#fff",border:"none",borderRadius:13,padding:"13px 0",fontSize:14,fontWeight:800,cursor:"pointer",marginTop:6,boxShadow:`0 4px 18px ${C.accent}44` }}>📤 Share Voting Link</button>
        </div>
      )}
    </div>
  );
}

/* ─── Root ──────────────────────────────────────────────────────────────────── */
export default function App() {
  const [screen,     setScreen]     = useState("home");
  const [friends,    setFriends]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [travelMode, setTravelMode] = useState("driving");
  const [showInfo,   setShowInfo]   = useState(false);

  const goBack = () => setScreen(s=>({friends:"home",categories:"friends",results:"categories"}[s]||"home"));

  const statusBar = (
    <div style={{ height:44,background:C.surface,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",flexShrink:0,borderBottom:`1px solid ${C.border}` }}>
      <span style={{ color:C.text,fontSize:12,fontWeight:700 }}>9:41</span>
      <div style={{ width:108,height:18,borderRadius:9,background:C.text,opacity:0.07 }}/>
      <span style={{ color:C.text,fontSize:11,opacity:0.45 }}>📶 🔋</span>
    </div>
  );

  const innerNav = (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 15px",borderBottom:`1px solid ${C.border}`,background:C.surface,flexShrink:0,boxShadow:`0 1px 5px ${C.shadow}` }}>
      <button onClick={goBack} style={{ background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textSub,borderRadius:9,padding:"6px 13px",fontSize:12,cursor:"pointer",fontWeight:600 }}>← Back</button>
      <div style={{ fontSize:15,fontWeight:800,color:C.text,fontFamily:"Georgia,'Times New Roman',serif" }}>📍 <span style={{ color:C.accent }}>MMITM</span></div>
      <button onClick={()=>setShowInfo(true)} style={{ width:32,height:32,borderRadius:16,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textSub,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .14s" }}
        onMouseEnter={e=>{ e.currentTarget.style.background=C.accentLight; e.currentTarget.style.color=C.accent; }}
        onMouseLeave={e=>{ e.currentTarget.style.background=C.surfaceHi; e.currentTarget.style.color=C.textSub; }}>ⓘ</button>
    </div>
  );

  return (
    <div style={{ width:390,minHeight:844,margin:"0 auto",background:C.bg,borderRadius:44,border:`2px solid ${C.borderMid}`,boxShadow:`0 36px 80px rgba(0,0,0,0.16),0 6px 20px rgba(0,0,0,0.08)`,overflow:"hidden",display:"flex",flexDirection:"column",fontFamily:"system-ui,-apple-system,sans-serif",position:"relative" }}>
      <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {statusBar}
      {showInfo && <InfoModal onClose={()=>setShowInfo(false)}/>}
      <div style={{ flex:1,overflowY:"auto" }}>
        {screen==="home"       && <HomeScreen onStart={()=>setScreen("friends")} onInfo={()=>setShowInfo(true)}/>}
        {screen==="friends"    && <>{innerNav}<AddFriendsScreen onNext={(f,m)=>{ setFriends(f); setTravelMode(m); setScreen("categories"); }}/></>}
        {screen==="categories" && <>{innerNav}<CategoriesScreen friends={friends} travelMode={travelMode} onNext={(cats)=>{ setCategories(cats); setScreen("results"); }}/></>}
        {screen==="results"    && <>{innerNav}<ResultsScreen friends={friends} categories={categories} travelMode={travelMode}/></>}
      </div>
      <div style={{ height:34,display:"flex",alignItems:"center",justifyContent:"center",background:C.surface,borderTop:`1px solid ${C.border}`,flexShrink:0 }}>
        <div style={{ width:130,height:5,borderRadius:3,background:C.borderMid,opacity:0.4 }}/>
      </div>
    </div>
  );
}
