/*@@ICONOS@@*/
/* ─────────────────────────── tokens ─────────────────────────── */
const T = {
  ink: "#16232F",
  inkSoft: "#3D4C59",
  steel: "#6E7D89",
  line: "#D3D9DC",
  lineSoft: "#E7EBED",
  surface: "#F4F6F5",
  paper: "#FFFFFF",
  accent: "#E2611A",
  accentSoft: "#FBEDE4",
  ok: "#1F7A52",
  warn: "#9A6400",
  warnSoft: "#FBF3E0",
};
const FONT = '"Inter","Helvetica Neue",Helvetica,Arial,sans-serif';
const num = { fontVariantNumeric: "tabular-nums" };

/* ─────────────────────────── tabla de vehículos ─────────────────────────── */
/*@@TABLA_VEHICULOS@@*/

/*@@CODIGOS@@*/

const etiquetaModelo = (m) =>
  [m.marca, m.modelo, m.version, m.motorOriginal || m.motor, m.anio].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

const buscarVeh = (q, limite = 40) => {
  const ts = String(q || "").toUpperCase().split(/\s+/).filter((t) => t.length >= 2);
  if (!ts.length) return [];
  const out = [];
  for (let i = 0; i < VEH.length && out.length < limite; i++) {
    const v = VEH[i];
    const txt = (VEH_MARCAS[v[0]] + " " + v[1] + " " + v[2] + " " + v[3] + " " + v[5]).toUpperCase();
    if (ts.every((t) => txt.includes(t))) out.push(v);
  }
  return out;
};
const vehPorCodigo = (cod) => VEH.find((v) => v[5] === cod) || null;
const vehTexto = (v) => `${VEH_MARCAS[v[0]]} ${v[1]} ${v[2]}`.replace(/\s+/g, " ").trim();

/* ─────────────────────────── seed ─────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 9);

const svcBase = (comb, opts = {}) => {
  const base = opts.base || 10000;
  const correa = opts.correa || 0;
  const d = comb === "Diésel";
  const kk = (n) => `${Math.round(n / 1000)}k`;
  const lista = [
    ["SRV-A", `Service A · aceite motor y filtro de aceite (hitos ${kk(base)}/${kk(base * 3)}/${kk(base * 5)}…)`, base * 2, "Preventivo", "ETMAN"],
    ["SRV-B", `Service B · A + filtro de aire y filtro de habitáculo (hitos ${kk(base * 2)}/${kk(base * 6)}…)`, base * 4, "Preventivo", "ETMAN"],
    ["SRV-C", (d
      ? `Service C · B + filtro de combustible y líquido de frenos (hitos ${kk(base * 4)}/${kk(base * 8)}…)`
      : `Service C · B + bujías y líquido de frenos (hitos ${kk(base * 4)}/${kk(base * 8)}…)`), base * 4, "Preventivo", "ETMAN"],
    ["FRE-D", "Pastillas de freno delanteras", 40000, "Desgaste", "ETMAN"],
    ["FRE-T", d ? "Pastillas / cintas de freno traseras" : "Cintas de freno traseras", 60000, "Desgaste", "ETMAN"],
    ["NEU-R", "Rotación de neumáticos y alineación", 20000, "Preventivo", "Stock taller"],
    ["AMO", "Amortiguadores · juego completo", 80000, "Desgaste", "E-PARTS"],
    ["EMB", "Kit de embrague", d ? 120000 : 100000, "Desgaste", "ETMAN"],
    ["BAT", "Batería", 100000, "Desgaste", "ETMAN"],
  ];
  if (correa) lista.push(["DIST", "Kit de distribución · correa, tensor y bomba de agua", correa, "Preventivo", "ETMAN"]);
  return lista.map(([cod, desc, frec, tipo, canal]) => ({
    id: uid(), cod, desc, frec, tipo, canal, mo: 0, rep: 0,
  }));
};

const seedModelos = [
  { marca: "FORD", modelo: "RANGER", version: "XL", motor: "2.0 TD", comb: "Diésel", anio: "2025→", cant: 0, kmAnual: 45000 },
  { marca: "FORD", modelo: "RANGER", version: "XLS V6", motor: "3.0 TD", comb: "Diésel", anio: "2024→", cant: 0, kmAnual: 45000 },
  { marca: "TOYOTA", modelo: "HILUX", version: "DX", motor: "2.4 TD", comb: "Diésel", anio: "2024→", cant: 0, kmAnual: 45000 },
  { marca: "TOYOTA", modelo: "HILUX", version: "SR", motor: "2.8 TD", comb: "Diésel", anio: "2024→", cant: 0, kmAnual: 45000 },
  { marca: "TOYOTA", modelo: "ETIOS", version: "", motor: "1.5", comb: "Nafta", anio: "2023→", cant: 0, kmAnual: 30000 },
].map((m) => ({
  ...m, id: uid(), servicios: svcBase(m.comb),
  codigos: CODIGOS_ASIGNADOS[[m.marca, m.modelo, m.version, m.motor, m.anio].filter(Boolean).join(" ")] || [],
}));

/*@@RED_TALLERES@@*/

/* Flota Asociación de los Testigos de Jehová — 136 unidades (detalle recibido por PDF) */
const TJ = [
  ["CHEVROLET", "CLASSIC", "", "1.4", "Nafta", "2015", 5, 20000, 10000, 60000, ""],
  ["CHEVROLET", "CRUZE", "", "1.4 L TURBO", "Nafta", "2023", 1, 20000, 10000, 0, "PENDIENTE: falta la versión (LT / LTZ / Premier). Motor confirmado por la cuenta."],
  ["CHEVROLET", "ONIX PLUS", "", "1.2 MT", "Nafta", "2023", 9, 20000, 10000, 90000, ""],
  ["CHEVROLET", "PRISMA JOY", "LS", "1.4", "Nafta", "2017-2018", 68, 20000, 10000, 60000, "Agrupa 28 unidades 2017 y 40 unidades 2018."],
  ["CHEVROLET", "S10", "4X4", "2.8 TD", "Diésel", "2018", 1, 30000, 10000, 0, ""],
  ["CHEVROLET", "TRACKER", "AT", "1.2 T", "Nafta", "2023-2024", 4, 20000, 10000, 0, "Agrupa 3 unidades 2023 y 1 unidad 2024."],
  ["CHEVROLET", "TRACKER", "MT", "1.2 T", "Nafta", "2022", 2, 20000, 10000, 0, ""],
  ["RENAULT", "CAPTUR", "INTENSE", "2.0", "Nafta", "2020", 1, 20000, 10000, 60000, "Cilindrada corregida a 2.0. El detalle recibido indicaba 2.8, que no corresponde a este modelo."],
  ["RENAULT", "LOGAN", "LIFE", "1.6", "Nafta", "2024-2025", 30, 20000, 10000, 60000, "Agrupa 5 unidades 2024 y 25 unidades 2025."],
  ["RENAULT", "KARDIAN", "TECHNO", "1.0 T", "Nafta", "2025", 2, 20000, 10000, 0, ""],
  ["TOYOTA", "COROLLA", "XEI", "1.8", "Nafta", "2013", 1, 20000, 10000, 0, ""],
  ["TOYOTA", "HIACE WAGON", "", "2.8 TD", "Diésel", "", 1, 30000, 10000, 0, "PENDIENTE: falta el año exacto. Según la cuenta, está entre 2021 y 2026."],
  ["TOYOTA", "HIACE", "L2H2", "2.8 TD", "Diésel", "2024", 1, 30000, 10000, 0, ""],
  ["PEUGEOT", "PARTNER", "PATAGONICA", "", "Nafta", "2018-2022", 2, 30000, 10000, 100000, "PENDIENTE: falta cilindrada y tipo de combustible (1.6 nafta o 1.6 HDI). Combustible cargado como nafta de forma provisoria. Agrupa 1 unidad 2018 y 1 unidad 2022."],
  ["PEUGEOT", "EXPERT", "", "1.6 HDI", "Diésel", "2022", 2, 30000, 10000, 120000, ""],
  ["MERCEDES-BENZ", "SPRINTER", "313 CDI", "2.2 CDI", "Diésel", "2009", 1, 30000, 15000, 0, "Cilindrada tomada de la Tabla de Vehículos. El detalle original no la informaba."],
  ["MERCEDES-BENZ", "SPRINTER", "415 CDI", "2.2 CDI", "Diésel", "2017-2018", 2, 30000, 15000, 0, "Agrupa 1 unidad 2017 y 1 unidad 2018. Cilindrada tomada de la Tabla de Vehículos. El detalle original no la informaba."],
  ["MERCEDES-BENZ", "SPRINTER", "416 CDI FURGON", "2.1 CDI", "Diésel", "2022", 1, 30000, 15000, 0, "Cilindrada tomada de la Tabla de Vehículos. El detalle original no la informaba."],
  ["MERCEDES-BENZ", "SPRINTER", "314 CDI FURGON", "2.0 CDI", "Diésel", "2024", 2, 30000, 15000, 0, "Cilindrada tomada de la Tabla de Vehículos. El detalle original no la informaba."],
];

const modelosTJ = () =>
  TJ.map(([marca, modelo, version, motor, comb, anio, cant, kmAnual, base, correa, nota]) => ({
    id: uid(), marca, modelo, version, motor, comb, anio, cant, kmAnual, nota,
    codigos: CODIGOS_ASIGNADOS[[marca, modelo, version, motor, anio].filter(Boolean).join(" ")] || [],
    servicios: svcBase(comb, { base, correa }),
  }));

const seed = {
  red: redInicial(),
  clientes: [
    {
      id: uid(),
      nombre: "AVIS",
      contactos: [],
      estado: "En negociación",
      alta: new Date().toISOString().slice(0, 10),
      notas: "Primer cliente del canal. Detalle de flota recibido: 5 modelos.",
      modelos: seedModelos,
    },
    ...CUENTAS_INICIALES.map((n) => {
      const c = nuevaCuenta(n, "Primeras conversaciones. Falta el detalle de la flota.");
      if (n.startsWith("ASOCIACION")) {
        c.modelos = modelosTJ();
        c.notas = "Detalle de flota recibido: 136 unidades en 19 agrupaciones. Kilometraje anual a confirmar.";
      }
      return c;
    }),
  ],
  config: { v: 7, ipcAcum: 0, ultimoAjuste: null, historial: [] },
};

/* ─────────────────────────── helpers ─────────────────────────── */
const ars = (n) =>
  "$ " + new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(Math.round(n || 0));
const int = (n) => new Intl.NumberFormat("es-AR").format(Math.round(n || 0));
const ROLES = ["Gestor de flota", "Compras / Abastecimiento", "Administración y pagos",
  "Operaciones", "Dirección", "Otro"];

const principal = (c) => {
  const l = c.contactos || [];
  return l.find((x) => x.principal) || l[0] || null;
};

const nombreModelo = (m) =>
  [m.marca, m.modelo, m.version, m.motor, m.anio].filter(Boolean).join(" ");

function calcModelo(m) {
  let mo = 0, rep = 0;
  const porCanal = { ETMAN: 0, "E-PARTS": 0, "Stock taller": 0 };
  const eventos = m.servicios.reduce((a, s) => a + (m.kmAnual || 0) / (s.frec || 1), 0);
  m.servicios.forEach((s) => {
    const veces = (m.kmAnual || 0) / (s.frec || 1);
    mo += veces * (s.mo || 0);
    rep += veces * (s.rep || 0);
    if (porCanal[s.canal] !== undefined) porCanal[s.canal] += veces * (s.rep || 0);
  });
  const unidad = mo + rep;
  const c = m.cant || 0;
  return {
    eventosUnidad: eventos,
    eventosTotal: eventos * c,
    moUnidad: mo, repUnidad: rep, unidad,
    moTotal: mo * c, repTotal: rep * c, total: unidad * c,
    porCanal: Object.fromEntries(Object.entries(porCanal).map(([k, v]) => [k, v * c])),
  };
}

function calcCliente(cl) {
  const filas = cl.modelos.map((m) => ({ m, k: calcModelo(m) }));
  const acc = filas.reduce(
    (a, { m, k }) => ({
      unidades: a.unidades + (m.cant || 0),
      eventos: a.eventos + k.eventosTotal,
      mo: a.mo + k.moTotal,
      rep: a.rep + k.repTotal,
      total: a.total + k.total,
      ETMAN: a.ETMAN + k.porCanal.ETMAN,
      "E-PARTS": a["E-PARTS"] + k.porCanal["E-PARTS"],
      "Stock taller": a["Stock taller"] + k.porCanal["Stock taller"],
    }),
    { unidades: 0, eventos: 0, mo: 0, rep: 0, total: 0, ETMAN: 0, "E-PARTS": 0, "Stock taller": 0 }
  );
  return { filas, ...acc };
}

/* ─────────────────────────── átomos UI ─────────────────────────── */
const Field = ({ value, onChange, align = "left", width, mono, placeholder }) => (
  <input
    value={value ?? ""}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className="bg-transparent outline-none py-1 px-1 rounded-sm"
    style={{
      textAlign: align, width: width || "100%", color: T.ink, fontSize: 13,
      border: "1px solid transparent", ...(mono ? num : {}),
    }}
    onFocus={(e) => (e.target.style.border = `1px solid ${T.accent}`)}
    onBlur={(e) => (e.target.style.border = "1px solid transparent")}
  />
);

const NumField = ({ value, onChange, width }) => (
  <Field
    mono align="right" width={width}
    value={value === 0 ? "0" : String(value ?? "")}
    onChange={(v) => onChange(Number(String(v).replace(/[^\d.-]/g, "")) || 0)}
  />
);

const Btn = ({ children, onClick, tone = "ghost", icon: Icon, small }) => {
  const styles = {
    solid: { background: T.ink, color: "#fff", border: `1px solid ${T.ink}` },
    accent: { background: T.accent, color: "#fff", border: `1px solid ${T.accent}` },
    ghost: { background: T.paper, color: T.inkSoft, border: `1px solid ${T.line}` },
  }[tone];
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-sm transition-colors"
      style={{ ...styles, fontSize: small ? 12 : 13, padding: small ? "5px 9px" : "7px 12px", fontWeight: 500 }}
    >
      {Icon && <Icon size={small ? 13 : 14} strokeWidth={2} />}
      {children}
    </button>
  );
};

const Th = ({ children, align = "left", w }) => (
  <th
    className="font-medium pb-2 px-2"
    style={{ textAlign: align, color: T.steel, fontSize: 11, letterSpacing: "0.02em", width: w, borderBottom: `1px solid ${T.line}` }}
  >
    {children}
  </th>
);

const Td = ({ children, align = "left", pad = "py-1.5 px-2" }) => (
  <td className={pad} style={{ textAlign: align, color: T.ink, fontSize: 13, borderBottom: `1px solid ${T.lineSoft}` }}>
    {children}
  </td>
);

const Stat = ({ label, value, sub, accent }) => (
  <div className="flex-1 px-4 py-3" style={{ borderLeft: `2px solid ${accent ? T.accent : T.line}` }}>
    <div style={{ color: T.steel, fontSize: 11 }}>{label}</div>
    <div style={{ color: T.ink, fontSize: 22, fontWeight: 600, lineHeight: 1.25, ...num }}>{value}</div>
    {sub && <div style={{ color: T.steel, fontSize: 11, ...num }}>{sub}</div>}
  </div>
);

/* ─────────────────────────── app ─────────────────────────── */
function PanelFlotas() {
  const [data, setData] = useState(null);
  const [selId, setSelId] = useState(null);
  const [tab, setTab] = useState("flota");
  const [vista, setVista] = useState("cuenta");
  const [modeloAbierto, setModeloAbierto] = useState(null);
  const [estado, setEstado] = useState("cargando");

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("efleets:panel");
        const d = JSON.parse(r.value);
        if (!d.red || !d.red.length) d.red = redInicial();
        d.config = d.config || { ipcAcum: 0, ultimoAjuste: null, historial: [] };
        if (!(d.config.v >= 2)) {
          const existentes = new Set((d.clientes || []).map((c) => sinTildes(c.nombre)));
          const faltantes = CUENTAS_INICIALES.filter((n) => !existentes.has(sinTildes(n)));
          d.clientes = [...(d.clientes || []),
            ...faltantes.map((n) => nuevaCuenta(n, "Primeras conversaciones. Falta el detalle de la flota."))];
          d.config = { ...d.config, v: 2 };
        }
        if (!(d.config.v >= 3)) {
          d.clientes = d.clientes.map((c) =>
            esTJ(c) && !(c.modelos || []).length
              ? { ...c, modelos: modelosTJ(),
                  notas: "Detalle de flota recibido: 136 unidades en 19 agrupaciones. Kilometraje anual a confirmar." }
              : c);
          d.config = { ...d.config, v: 3 };
        }
        if (!(d.config.v >= 4)) {
          const parches = {
            "CAPTUR": { motor: "2.0", nota: "Cilindrada corregida a 2.0. El detalle recibido indicaba 2.8, que no corresponde a este modelo." },
            "PARTNER": { motor: "", nota: "PENDIENTE: falta cilindrada y tipo de combustible (1.6 nafta o 1.6 HDI). Combustible cargado como nafta de forma provisoria. Agrupa 1 unidad 2018 y 1 unidad 2022." },
            "HIACE WAGON": { anio: "", nota: "PENDIENTE: falta el año exacto. Según la cuenta, está entre 2021 y 2026." },
            "CRUZE": { motor: "1.4 L TURBO", nota: "PENDIENTE: falta la versión (LT / LTZ / Premier). Motor confirmado por la cuenta." },
          };
          d.clientes = d.clientes.map((c) =>
            c.nombre.trim().toUpperCase().startsWith("ASOCIACION")
              ? { ...c, modelos: (c.modelos || []).map((m) => (parches[m.modelo] ? { ...m, ...parches[m.modelo] } : m)) }
              : c);
          d.config = { ...d.config, v: 4 };
        }
        if (!(d.config.v >= 5)) {
          d.clientes = d.clientes.map((c) => ({
            ...c,
            modelos: (c.modelos || []).map((m) => {
              const k = etiquetaModelo(m);
              return { ...m, codigos: m.codigos || CODIGOS_ASIGNADOS[k] || [] };
            }),
          }));
          d.config = { ...d.config, v: 5 };
        }
        if (!(d.config.v >= 6)) {
          const SOLO416 = ["MERSPR4162.1LCDI002", "MERSPR4162.1LCDI003"];
          d.clientes = d.clientes.map((c) => ({
            ...c,
            modelos: (c.modelos || []).map((m) =>
              m.modelo === "SPRINTER" && String(m.version || "").includes("416")
                ? { ...m, codigos: SOLO416 } : m),
          }));
          d.config = { ...d.config, v: 6 };
        }
        if (!(d.config.v >= 7)) {
          const CIL = { "313": "2.2 CDI", "415": "2.2 CDI", "416": "2.1 CDI", "314": "2.0 CDI" };
          d.clientes = d.clientes.map((c) => ({
            ...c,
            modelos: (c.modelos || []).map((m) => {
              if (m.modelo !== "SPRINTER") return m;
              const n = Object.keys(CIL).find((x) => String(m.version || "").includes(x));
              if (!n || m.motor === CIL[n]) return m;
              const nota = "Cilindrada tomada de la Tabla de Vehículos. El detalle original no la informaba.";
              return { ...m, motor: CIL[n], motorOriginal: m.motor,
                       nota: m.nota && !m.nota.includes("Tabla de Vehículos") ? m.nota + " " + nota : (m.nota || nota) };
            }),
          }));
          d.config = { ...d.config, v: 7 };
        }
        d.clientes = d.clientes.map((c) => ({
          ...c,
          modelos: (c.modelos || []).map((m) => ({ ...m, codigos: m.codigos || [] })),
        }));
        d.clientes = d.clientes.map((c) =>
          esTJ(c) && !(c.modelos || []).length ? { ...c, modelos: modelosTJ() } : c);
        d.clientes = (d.clientes || []).map((c) => ({
          ...c,
          contactos: c.contactos || (c.contacto
            ? [{ id: uid(), nombre: c.contacto, rol: "Gestor de flota", tel: "", mail: "", notas: "", principal: true }]
            : []),
        }));
        setData(d);
        setSelId(d.clientes[0]?.id ?? null);
        setEstado("listo");
      } catch {
        setData(seed);
        setSelId(seed.clientes[0].id);
        setEstado("listo");
      }
    })();
  }, []);

  useEffect(() => {
    if (!data) return;
    const t = setTimeout(async () => {
      try {
        setEstado("guardando");
        await window.storage.set("efleets:panel", JSON.stringify(data));
        setEstado("guardado");
      } catch {
        setEstado("error");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [data]);

  const cliente = data?.clientes.find((c) => c.id === selId) ?? null;
  const k = useMemo(() => (cliente ? calcCliente(cliente) : null), [cliente]);
  const sinPrecios = cliente
    ? cliente.modelos.every((m) => m.servicios.every((s) => !s.mo && !s.rep))
    : false;

  const upCliente = (fn) =>
    setData((d) => ({ ...d, clientes: d.clientes.map((c) => (c.id === selId ? fn(c) : c)) }));
  const upModelo = (mid, fn) =>
    upCliente((c) => ({ ...c, modelos: c.modelos.map((m) => (m.id === mid ? fn(m) : m)) }));

  if (!data) {
    return <div className="p-8" style={{ fontFamily: FONT, color: T.steel }}>Cargando panel…</div>;
  }

  return (
    <div style={{ fontFamily: FONT, background: T.surface, minHeight: "100vh", color: T.ink }}>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #doc-imprimible, #doc-imprimible * { visibility: visible !important; }
          #doc-imprimible {
            position: absolute !important; left: 0; top: 0; width: 100%;
            border: none !important; box-shadow: none !important; padding: 0 !important;
          }
          .no-imprimir { display: none !important; }
          @page { margin: 14mm; size: A4; }
        }
      `}</style>
      {/* barra superior */}
      <div style={{ background: T.ink, borderBottom: `3px solid ${T.accent}` }} className="px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-baseline gap-3">
          <span style={{ color: "#fff", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>
            E-Fleets · Panel de cuentas
          </span>
          <span style={{ color: "#9FB0BC", fontSize: 12 }}>Canal de Flotas · Red EuroTaller</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ color: "#9FB0BC", fontSize: 11 }}>
            {estado === "guardando" ? "Guardando…" : estado === "error" ? "No se pudo guardar" : "Cambios guardados"}
          </span>
          <button
            onClick={async () => {
              const txt = JSON.stringify(data, null, 2);
              const ok = await copiarAlPortapapeles(txt);
              intentarDescarga("e-fleets-panel.json", txt);
              setEstado("Respaldo descargado");
              setTimeout(() => setEstado("guardado"), 4000);
            }}
            className="inline-flex items-center gap-2 rounded-sm"
            style={{ color: "#fff", border: "1px solid #3A4B59", fontSize: 12, padding: "5px 10px" }}
          >
            <Download size={13} /> Descargar respaldo
          </button>
        </div>
      </div>

      <div className="flex" style={{ alignItems: "stretch" }}>
        {/* clientes */}
        <aside style={{ width: 232, background: T.paper, borderRight: `1px solid ${T.line}`, minHeight: "calc(100vh - 56px)" }} className="shrink-0">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <span style={{ fontSize: 12, color: T.steel }}>Cuentas de flota</span>
            <button
              title="Agregar cuenta"
              onClick={() => {
                const c = { id: uid(), nombre: "Nueva cuenta", contactos: [], estado: "En negociación", alta: new Date().toISOString().slice(0, 10), notas: "", modelos: [] };
                setData((d) => ({ ...d, clientes: [...d.clientes, c] }));
                setSelId(c.id);
                setTab("flota");
              }}
              style={{ color: T.accent }}
            >
              <Plus size={16} />
            </button>
          </div>
          {data.clientes.map((c) => {
            const act = c.id === selId && vista === "cuenta";
            const u = c.modelos.reduce((a, m) => a + (m.cant || 0), 0);
            return (
              <button
                key={c.id}
                onClick={() => { setSelId(c.id); setModeloAbierto(null); setVista("cuenta"); }}
                className="w-full text-left px-4 py-2.5"
                style={{
                  background: act ? T.accentSoft : "transparent",
                  borderLeft: `3px solid ${act ? T.accent : "transparent"}`,
                  borderBottom: `1px solid ${T.lineSoft}`,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: act ? 600 : 500, color: T.ink }}>{c.nombre}</div>
                <div style={{ fontSize: 11, color: T.steel, ...num }}>
                  {int(u)} unidades · {c.modelos.length} modelos
                </div>
              </button>
            );
          })}
          <div className="px-4 pt-5 pb-2" style={{ borderTop: `1px solid ${T.lineSoft}`, marginTop: 8 }}>
            <span style={{ fontSize: 12, color: T.steel }}>Red</span>
          </div>
          <button
            onClick={() => setVista("red")}
            className="w-full text-left px-4 py-2.5"
            style={{
              background: vista === "red" ? T.accentSoft : "transparent",
              borderLeft: `3px solid ${vista === "red" ? T.accent : "transparent"}`,
              borderBottom: `1px solid ${T.lineSoft}`,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: vista === "red" ? 600 : 500 }}>Talleres EuroTaller</div>
            <div style={{ fontSize: 11, color: T.steel, ...num }}>
              {data.red.length} talleres · {new Set(data.red.map((t) => t.p)).size} provincias
            </div>
          </button>
        </aside>

        {/* panel */}
        <main className="flex-1 min-w-0">
          {vista === "red" ? (
            <TabRed data={data} setData={setData} />
                    ) : !cliente ? (
            <div className="p-10" style={{ color: T.steel, fontSize: 14 }}>
              Agregá una cuenta de flota para empezar.
            </div>
          ) : (
            <>
              <div style={{ background: T.paper, borderBottom: `1px solid ${T.line}` }}>
                <div className="px-5 pt-4 flex items-start justify-between gap-4 flex-wrap">
                  <div style={{ minWidth: 240 }}>
                    <input
                      value={cliente.nombre}
                      onChange={(e) => upCliente((c) => ({ ...c, nombre: e.target.value }))}
                      className="bg-transparent outline-none"
                      style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: T.ink, width: "100%" }}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        value={cliente.estado}
                        onChange={(e) => upCliente((c) => ({ ...c, estado: e.target.value }))}
                        className="outline-none rounded-sm"
                        style={{ fontSize: 12, color: T.inkSoft, border: `1px solid ${T.line}`, padding: "3px 6px", background: T.paper }}
                      >
                        {["En negociación", "Activa", "En implementación", "Suspendida"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                      {cliente.modelos.length === 0 && (
                        <span className="px-2 py-0.5 rounded-sm" style={{ fontSize: 11, background: T.warnSoft, color: T.warn, border: "1px solid #E6D3A8" }}>
                          Sin flota informada
                        </span>
                      )}
                      {principal(cliente) ? (
                        <span style={{ fontSize: 12, color: T.steel }}>
                          {principal(cliente).nombre}
                          {principal(cliente).rol ? ` · ${principal(cliente).rol}` : ""}
                        </span>
                      ) : (
                        <button onClick={() => setTab("cuenta")} style={{ fontSize: 12, color: T.accent }}>
                          Cargar contacto
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!window.confirm(`Eliminar la cuenta ${cliente.nombre} y su flota?`)) return;
                      setData((d) => {
                        const rest = d.clientes.filter((c) => c.id !== selId);
                        setSelId(rest[0]?.id ?? null);
                        return { ...d, clientes: rest };
                      });
                    }}
                    style={{ color: T.steel, fontSize: 12 }}
                    className="inline-flex items-center gap-1.5 mt-2"
                  >
                    <Trash2 size={13} /> Eliminar cuenta
                  </button>
                </div>

                <div className="flex flex-wrap px-3 pt-3 pb-1">
                  <Stat label="Unidades en flota" value={int(k.unidades)} sub={`${cliente.modelos.length} modelos`} accent />
                  <Stat label="Intervenciones / año" value={int(k.eventos)} sub="servicios proyectados" />
                  <Stat label="Facturación anual estimada" value={ars(k.total)} sub={`mano de obra ${ars(k.mo)} · repuestos ${ars(k.rep)}`} />
                  <Stat label="Repuestos por ETMAN" value={ars(k.ETMAN)} sub={`E-PARTS ${ars(k["E-PARTS"])} · taller ${ars(k["Stock taller"])}`} />
                </div>

                <div className="flex gap-1 px-4 pt-2">
                  {[
                    ["flota", "Flota", Truck],
                    ["tarifario", "Tarifario por modelo", Wrench],
                    ["proyeccion", "Proyección", TrendingUp],
                    ["presupuesto", "Presupuesto", FileText],
                    ["cuenta", "Ficha y contactos", Building2],
                    ["ajustes", "Ajuste IPC", Settings],
                  ].map(([id, lbl, Icon]) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className="inline-flex items-center gap-2 px-3 py-2"
                      style={{
                        fontSize: 13,
                        color: tab === id ? T.ink : T.steel,
                        fontWeight: tab === id ? 600 : 400,
                        borderBottom: `2px solid ${tab === id ? T.accent : "transparent"}`,
                        marginBottom: -1,
                      }}
                    >
                      <Icon size={14} /> {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {sinPrecios && (
                <div className="mx-5 mt-4 px-3 py-2 flex items-start gap-2 rounded-sm"
                  style={{ background: T.warnSoft, border: `1px solid #E6D3A8` }}>
                  <AlertCircle size={15} style={{ color: T.warn, marginTop: 1 }} />
                  <div style={{ fontSize: 12.5, color: "#6B4A05" }}>
                    El tarifario está en $0. Cargá los precios estandarizados en <b>Tarifario por modelo</b> para
                    que la proyección devuelva importes reales.
                  </div>
                </div>
              )}

              <div className="p-5">
                {tab === "flota" && <TabFlota cliente={cliente} k={k} upCliente={upCliente} upModelo={upModelo} />}
                {tab === "tarifario" && (
                  <TabTarifario cliente={cliente} upModelo={upModelo}
                    abierto={modeloAbierto ?? cliente.modelos[0]?.id} setAbierto={setModeloAbierto} />
                )}
                {tab === "proyeccion" && <TabProyeccion cliente={cliente} k={k} upModelo={upModelo} />}
                {tab === "presupuesto" && <TabPresupuesto cliente={cliente} upCliente={upCliente} config={data.config} red={data.red} />}
                {tab === "cuenta" && <TabCuenta cliente={cliente} k={k} upCliente={upCliente} />}
                {tab === "ajustes" && <TabAjustes data={data} setData={setData} />}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────── flota ─────────────────────────── */
function TabFlota({ cliente, k, upCliente, upModelo }) {
  const [aviso, setAviso] = useState("");
  const [vinculando, setVinculando] = useState(null);
  const avisar = (m) => { setAviso(m); setTimeout(() => setAviso(""), 4000); };

  const exportar = () =>
    exportarTabla(`flota-${cliente.nombre}.xlsx`, [
      ["COMPOSICIÓN DE LA FLOTA"],
      ["Cliente", cliente.nombre],
      ["Estado", cliente.estado],
      ["Fecha de emisión", fechaAR(hoy())],
      [],
      ["Marca", "Modelo", "Versión", "Motor", "Combustible", "Años", "Unidades", "Códigos ETMAN", "Observaciones"],
      ...cliente.modelos.map((m) => [m.marca, m.modelo, m.version, m.motor, m.comb, m.anio, m.cant || 0,
        (m.codigos || []).join(" / "), m.nota || ""]),
      [],
      ["", "", "", "", "", "TOTAL", k.unidades, "", `${cliente.modelos.length} modelos`],
    ], avisar);

  const agregar = () =>
    upCliente((c) => ({
      ...c,
      modelos: [...c.modelos, {
        id: uid(), marca: "", modelo: "", version: "", motor: "", comb: "Diésel",
        anio: "", cant: 0, kmAnual: 40000, servicios: svcBase("Diésel"),
      }],
    }));

  return (
    <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${T.line}` }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Composición de la flota</div>
          <div style={{ fontSize: 12, color: T.steel }}>
Identificación de los vehículos y cantidad de unidades por modelo.
          </div>
        </div>
        <div className="flex items-center gap-3">
          {aviso && <span style={{ fontSize: 12, color: T.ok }}>{aviso}</span>}
          <Btn icon={Download} onClick={exportar}>Exportar a Excel</Btn>
          <Btn icon={Plus} onClick={agregar}>Agregar modelo</Btn>
        </div>
      </div>

      {cliente.modelos.some((m) => m.nota) && (
        <div className="px-4 py-2" style={{ fontSize: 12, color: T.steel, borderBottom: `1px solid ${T.lineSoft}` }}>
          Las filas con el ícono tienen una observación de carga: pasá el cursor por encima para leerla.
          En naranja, las que requieren que confirmes un dato.
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 660 }}>
          <thead>
            <tr>
              <Th w={110}>Marca</Th>
              <Th w={120}>Modelo</Th>
              <Th w={110}>Versión</Th>
              <Th w={90}>Motor</Th>
              <Th w={95}>Combustible</Th>
              <Th w={80}>Años</Th>
              <Th align="right" w={90}>Unidades</Th>
              <Th align="center" w={110}>Códigos ETMAN</Th>
              <Th w={34}></Th>
            </tr>
          </thead>
          <tbody>
            {k.filas.map(({ m }) => (
              <tr key={m.id}>
                <Td>
                  <div className="flex items-center gap-1">
                    {m.nota && (
                      <span title={m.nota} style={{ color: /^(REVISAR|PENDIENTE)/.test(m.nota) ? T.accent : T.steel, cursor: "help", flexShrink: 0 }}>
                        <AlertCircle size={13} />
                      </span>
                    )}
                    <Field value={m.marca} onChange={(v) => upModelo(m.id, (x) => ({ ...x, marca: v.toUpperCase() }))} />
                  </div>
                </Td>
                <Td><Field value={m.modelo} onChange={(v) => upModelo(m.id, (x) => ({ ...x, modelo: v.toUpperCase() }))} /></Td>
                <Td><Field value={m.version} onChange={(v) => upModelo(m.id, (x) => ({ ...x, version: v.toUpperCase() }))} /></Td>
                <Td><Field value={m.motor} onChange={(v) => upModelo(m.id, (x) => ({ ...x, motor: v }))} /></Td>
                <Td>
                  <select
                    value={m.comb}
                    onChange={(e) => upModelo(m.id, (x) => ({ ...x, comb: e.target.value }))}
                    className="outline-none bg-transparent"
                    style={{ fontSize: 12.5, color: T.ink, border: "none" }}
                  >
                    {["Diésel", "Nafta", "Híbrido", "Eléctrico"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Td>
                <Td><Field value={m.anio} onChange={(v) => upModelo(m.id, (x) => ({ ...x, anio: v }))} /></Td>
                <Td align="right"><NumField value={m.cant} onChange={(v) => upModelo(m.id, (x) => ({ ...x, cant: v }))} /></Td>
                <Td align="center">
                  <button
                    onClick={() => setVinculando(vinculando === m.id ? null : m.id)}
                    className="px-2 py-1 rounded-sm"
                    style={{
                      fontSize: 11.5,
                      color: (m.codigos || []).length ? T.ink : T.accent,
                      background: vinculando === m.id ? T.accentSoft : "transparent",
                      border: `1px solid ${vinculando === m.id ? T.accent : T.line}`,
                    }}>
                    {(m.codigos || []).length
                      ? `${(m.codigos || []).length} código${(m.codigos || []).length > 1 ? "s" : ""}`
                      : "vincular"}
                  </button>
                </Td>
                <Td align="right">
                  <button
                    onClick={() => upCliente((c) => ({ ...c, modelos: c.modelos.filter((x) => x.id !== m.id) }))}
                    style={{ color: T.steel }}
                  ><X size={14} /></button>
                </Td>
              </tr>
            ))}
            <tr>
              <Td pad="py-2.5 px-2"><span style={{ fontWeight: 600 }}>Total</span></Td>
              <Td /><Td /><Td /><Td /><Td />
              <Td align="right"><span style={{ ...num, fontWeight: 600 }}>{int(k.unidades)}</span></Td>
              <Td align="center">
                <span style={{ fontSize: 11.5, color: T.steel, ...num }}>
                  {cliente.modelos.reduce((a, m) => a + (m.codigos || []).length, 0)} en total
                </span>
              </Td>
              <Td />
            </tr>
          </tbody>
        </table>
      </div>
      {vinculando && (
        <Vinculador
          modelo={cliente.modelos.find((m) => m.id === vinculando)}
          upModelo={upModelo}
          cerrar={() => setVinculando(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── vinculación con la Tabla de Vehículos ─────────────────────────── */
function Vinculador({ modelo, upModelo, cerrar }) {
  const [q, setQ] = useState("");
  if (!modelo) return null;
  const codigos = modelo.codigos || [];
  const sugerencia = [modelo.marca, modelo.modelo, modelo.motor].filter(Boolean).join(" ");
  const resultados = buscarVeh(q || sugerencia);

  const agregar = (cod) =>
    upModelo(modelo.id, (x) => ({ ...x, codigos: [...(x.codigos || []), cod].filter((v, i, a) => a.indexOf(v) === i) }));
  const quitar = (cod) =>
    upModelo(modelo.id, (x) => ({ ...x, codigos: (x.codigos || []).filter((c) => c !== cod) }));
  const completar = (v) =>
    upModelo(modelo.id, (x) => ({
      ...x,
      marca: x.marca || VEH_MARCAS[v[0]].split(" - ")[0],
      modelo: x.modelo || v[1],
      motor: x.motor || v[3],
      comb: /TD|TDI|CDI|HDI|DIESEL|CTDI/i.test(v[3]) ? "Diésel" : x.comb,
      anio: x.anio || (v[6] && v[7] ? `${v[6]}-${v[7]}` : v[6] || ""),
      codigos: [...(x.codigos || []), v[5]].filter((c, i, a) => a.indexOf(c) === i),
    }));

  return (
    <div style={{ borderTop: `2px solid ${T.accent}`, background: T.surface }} className="px-4 py-4">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            Códigos de la Tabla de Vehículos · {nombreModelo(modelo)}
          </div>
          <div style={{ fontSize: 12, color: T.steel, maxWidth: 620 }}>
            Un modelo puede llevar varios códigos, por ejemplo 4x2 y 4x4. Buscá por marca, modelo,
            cilindrada o código.
          </div>
        </div>
        <button onClick={cerrar} style={{ color: T.steel }}><X size={16} /></button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {codigos.length === 0 && (
          <span style={{ fontSize: 12.5, color: T.accent }}>Sin códigos vinculados.</span>
        )}
        {codigos.map((c) => {
          const v = vehPorCodigo(c);
          return (
            <span key={c} className="inline-flex items-center gap-2 px-2 py-1 rounded-sm"
              style={{ background: T.paper, border: `1px solid ${T.line}`, fontSize: 11.5 }}>
              <span style={{ ...num, fontWeight: 600 }}>{c}</span>
              <span style={{ color: T.steel }}>{v ? `${v[2]} · ${v[3]}` : "no está en la tabla"}</span>
              <button onClick={() => quitar(c)} style={{ color: T.steel }}><X size={12} /></button>
            </span>
          );
        })}
      </div>

      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder={`Buscar… (por defecto: ${sugerencia || "escribí marca y modelo"})`}
        className="w-full outline-none rounded-sm px-2 py-1.5 mb-2"
        style={{ fontSize: 13, border: `1px solid ${T.line}`, background: T.paper }} />

      <div style={{ maxHeight: 250, overflowY: "auto", background: T.paper, border: `1px solid ${T.line}` }}>
        {resultados.length === 0 && (
          <div className="px-3 py-3" style={{ fontSize: 12.5, color: T.steel }}>
            Sin coincidencias. Probá con menos palabras.
          </div>
        )}
        {resultados.map((v) => {
          const ya = codigos.includes(v[5]);
          return (
            <div key={v[5]} className="flex items-center gap-2 px-3 py-1.5 flex-wrap"
              style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
              <span style={{ ...num, fontSize: 11.5, fontWeight: 600, width: 200 }}>{v[5]}</span>
              <span style={{ fontSize: 12, flex: 1, minWidth: 220 }}>{vehTexto(v)}</span>
              <span style={{ fontSize: 11.5, color: T.steel, width: 110 }}>{v[3]}</span>
              <span style={{ ...num, fontSize: 11.5, color: T.steel, width: 76 }}>{v[6]}–{v[7]}</span>
              {ya ? (
                <span className="inline-flex items-center gap-1" style={{ fontSize: 11.5, color: T.ok, width: 150 }}>
                  <Check size={12} /> vinculado
                </span>
              ) : (
                <span className="flex gap-1" style={{ width: 150 }}>
                  <Btn small onClick={() => agregar(v[5])}>Vincular</Btn>
                  <Btn small onClick={() => completar(v)}>+ completar</Btn>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 11.5, color: T.steel, marginTop: 6 }}>
        «+ completar» además rellena marca, modelo, motor y años del panel con los datos de la tabla,
        solo en los campos que estén vacíos. Es la forma recomendada de dar de alta un modelo nuevo.
      </div>
    </div>
  );
}

/* ─────────────────────────── tarifario ─────────────────────────── */
function TabTarifario({ cliente, upModelo, abierto, setAbierto }) {
  const m = cliente.modelos.find((x) => x.id === abierto) ?? cliente.modelos[0];
  if (!m) return <div style={{ color: T.steel, fontSize: 13 }}>Cargá primero un modelo en la pestaña Flota.</div>;

  const set = (sid, campo, val) =>
    upModelo(m.id, (x) => ({ ...x, servicios: x.servicios.map((s) => (s.id === sid ? { ...s, [campo]: val } : s)) }));

  const total = m.servicios.reduce((a, s) => a + (s.mo || 0) + (s.rep || 0), 0);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {cliente.modelos.map((x) => (
          <button
            key={x.id}
            onClick={() => setAbierto(x.id)}
            className="px-3 py-1.5 rounded-sm"
            style={{
              fontSize: 12.5,
              background: x.id === m.id ? T.ink : T.paper,
              color: x.id === m.id ? "#fff" : T.inkSoft,
              border: `1px solid ${x.id === m.id ? T.ink : T.line}`,
            }}
          >
            {nombreModelo(x) || "Modelo sin nombre"}
          </button>
        ))}
      </div>

      <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${T.line}` }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{nombreModelo(m)}</div>
            <div style={{ fontSize: 12, color: T.steel, maxWidth: 640 }}>
              «Cada (km)» es la frecuencia efectiva de repetición: en los services escalonados ya descuenta los hitos
              donde un service mayor reemplaza al menor, para no contar dos veces la misma intervención.
            </div>
          </div>
          <Btn icon={Plus} small onClick={() =>
            upModelo(m.id, (x) => ({
              ...x,
              servicios: [...x.servicios, { id: uid(), cod: "", desc: "", frec: 20000, tipo: "Preventivo", canal: "ETMAN", mo: 0, rep: 0 }],
            }))
          }>Agregar servicio</Btn>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 880 }}>
            <thead>
              <tr>
                <Th w={72}>Código</Th>
                <Th>Servicio estandarizado</Th>
                <Th w={100}>Tipo</Th>
                <Th w={125}>Canal repuesto</Th>
                <Th align="right" w={95}>Cada (km)</Th>
                <Th align="right" w={110}>Mano de obra</Th>
                <Th align="right" w={110}>Repuestos</Th>
                <Th align="right" w={110}>Precio total</Th>
                <Th w={34}></Th>
              </tr>
            </thead>
            <tbody>
              {m.servicios.map((s) => (
                <tr key={s.id}>
                  <Td><Field value={s.cod} onChange={(v) => set(s.id, "cod", v)} /></Td>
                  <Td><Field value={s.desc} onChange={(v) => set(s.id, "desc", v)} /></Td>
                  <Td>
                    <select value={s.tipo} onChange={(e) => set(s.id, "tipo", e.target.value)}
                      className="outline-none bg-transparent" style={{ fontSize: 12.5, color: T.ink, border: "none" }}>
                      {["Preventivo", "Desgaste", "Correctivo"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Td>
                  <Td>
                    <select value={s.canal} onChange={(e) => set(s.id, "canal", e.target.value)}
                      className="outline-none bg-transparent" style={{ fontSize: 12.5, color: T.ink, border: "none" }}>
                      {["ETMAN", "E-PARTS", "Stock taller"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Td>
                  <Td align="right"><NumField value={s.frec} onChange={(v) => set(s.id, "frec", v)} /></Td>
                  <Td align="right"><NumField value={s.mo} onChange={(v) => set(s.id, "mo", v)} /></Td>
                  <Td align="right"><NumField value={s.rep} onChange={(v) => set(s.id, "rep", v)} /></Td>
                  <Td align="right"><span style={{ ...num, fontWeight: 600 }}>{ars((s.mo || 0) + (s.rep || 0))}</span></Td>
                  <Td align="right">
                    <button onClick={() => upModelo(m.id, (x) => ({ ...x, servicios: x.servicios.filter((y) => y.id !== s.id) }))}
                      style={{ color: T.steel }}><X size={14} /></button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between" style={{ background: T.surface }}>
          <span style={{ fontSize: 12, color: T.steel }}>
            Suma del tarifario completo del modelo (no es el costo anual: cada ítem tiene su propia frecuencia)
          </span>
          <span style={{ ...num, fontSize: 15, fontWeight: 600 }}>{ars(total)}</span>
        </div>
      </div>

      <CopiarTarifario cliente={cliente} origen={m} upModelo={upModelo} />
    </div>
  );
}

function CopiarTarifario({ cliente, origen, upModelo }) {
  const [destino, setDestino] = useState("");
  const [hecho, setHecho] = useState(false);
  const otros = cliente.modelos.filter((x) => x.id !== origen.id);
  if (!otros.length) return null;
  return (
    <div className="mt-3 flex items-center gap-2 flex-wrap" style={{ fontSize: 12.5, color: T.inkSoft }}>
      <span>Copiar este tarifario a</span>
      <select value={destino} onChange={(e) => { setDestino(e.target.value); setHecho(false); }}
        className="outline-none rounded-sm" style={{ border: `1px solid ${T.line}`, padding: "4px 6px", background: T.paper, fontSize: 12.5 }}>
        <option value="">elegir modelo…</option>
        {otros.map((x) => <option key={x.id} value={x.id}>{nombreModelo(x)}</option>)}
      </select>
      <Btn small onClick={() => {
        if (!destino) return;
        upModelo(destino, (x) => ({ ...x, servicios: origen.servicios.map((s) => ({ ...s, id: uid() })) }));
        setHecho(true);
      }}>Copiar</Btn>
      {hecho && <span className="inline-flex items-center gap-1" style={{ color: T.ok }}><Check size={13} /> Copiado</span>}
    </div>
  );
}

/* ─────────────────────────── proyección ─────────────────────────── */
function TabProyeccion({ cliente, k, upModelo }) {
  const max = Math.max(...k.filas.map((f) => f.k.total), 1);
  const canales = [
    ["ETMAN", k.ETMAN, T.accent],
    ["E-PARTS", k["E-PARTS"], "#2E6F9E"],
    ["Stock taller", k["Stock taller"], T.steel],
  ];
  const totRep = k.rep || 1;

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,2fr) minmax(260px,1fr)" }}>
      <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.line}` }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Facturación anual por modelo</div>
          <div style={{ fontSize: 12, color: T.steel }}>
            El kilometraje anual promedio determina cuántos servicios genera cada unidad por año. Es editable acá.
          </div>
        </div>
        <div className="px-4 py-4">
          {k.filas.map(({ m, k: km }) => (
            <div key={m.id} className="mb-4">
              <div className="flex items-baseline justify-between mb-1 gap-3">
                <span style={{ fontSize: 13 }}>{nombreModelo(m)}</span>
                <span style={{ ...num, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {ars(km.total)} <span style={{ color: T.steel, fontWeight: 400 }}>· {int(m.cant)} u.</span>
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap" style={{ fontSize: 11.5, color: T.steel }}>
                <span>Km / año</span>
                <input
                  value={m.kmAnual}
                  onChange={(e) => upModelo(m.id, (x) => ({ ...x, kmAnual: Number(e.target.value.replace(/\D/g, "")) || 0 }))}
                  className="outline-none rounded-sm px-1.5 py-0.5"
                  style={{ ...num, width: 78, textAlign: "right", fontSize: 11.5, border: `1px solid ${T.line}`, color: T.ink }} />
                <span>· {km.eventosUnidad.toFixed(1)} servicios al año por unidad · {ars(km.unidad)} por unidad</span>
              </div>
              <div className="flex" style={{ height: 14, background: T.lineSoft }}>
                <div style={{ width: `${(km.moTotal / max) * 100}%`, background: T.ink }} />
                <div style={{ width: `${(km.repTotal / max) * 100}%`, background: T.accent }} />
              </div>
            </div>
          ))}
          <div className="flex gap-4 pt-1" style={{ fontSize: 11.5, color: T.steel }}>
            <span className="inline-flex items-center gap-1.5">
              <span style={{ width: 10, height: 10, background: T.ink, display: "inline-block" }} /> Mano de obra
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span style={{ width: 10, height: 10, background: T.accent, display: "inline-block" }} /> Repuestos
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.line}` }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Repuestos por canal</div>
            <div style={{ fontSize: 12, color: T.steel }}>Define qué parte se liquida por Nota de Crédito ETMAN.</div>
          </div>
          <div className="px-4 py-4">
            {canales.map(([n, v, col]) => (
              <div key={n} className="mb-3">
                <div className="flex justify-between mb-1" style={{ fontSize: 12.5 }}>
                  <span>{n}</span>
                  <span style={num}>{ars(v)} · {Math.round((v / totRep) * 100)}%</span>
                </div>
                <div style={{ height: 8, background: T.lineSoft }}>
                  <div style={{ width: `${(v / totRep) * 100}%`, height: "100%", background: col }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: T.paper, border: `1px solid ${T.line}` }} className="px-4 py-4">
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Resumen de la cuenta</div>
          {[
            ["Unidades", int(k.unidades)],
            ["Intervenciones por año", int(k.eventos)],
            ["Intervenciones por mes", (k.eventos / 12).toFixed(1)],
            ["Ticket promedio", ars(k.eventos ? k.total / k.eventos : 0)],
            ["Costo anual por unidad", ars(k.unidades ? k.total / k.unidades : 0)],
            ["Facturación anual total", ars(k.total)],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${T.lineSoft}`, fontSize: 13 }}>
              <span style={{ color: T.steel }}>{l}</span>
              <span style={{ ...num, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ficha ─────────────────────────── */
function TabCuenta({ cliente, k, upCliente }) {
  const cs = cliente.contactos || [];
  const upC = (id, campo, val) =>
    upCliente((c) => ({ ...c, contactos: c.contactos.map((x) => (x.id === id ? { ...x, [campo]: val } : x)) }));

  const agregar = () =>
    upCliente((c) => ({
      ...c,
      contactos: [...(c.contactos || []), {
        id: uid(), nombre: "", rol: "Gestor de flota", tel: "", mail: "", notas: "",
        principal: (c.contactos || []).length === 0,
      }],
    }));

  const marcarPrincipal = (id) =>
    upCliente((c) => ({ ...c, contactos: c.contactos.map((x) => ({ ...x, principal: x.id === id })) }));

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(240px,330px)" }}>
      <div className="flex flex-col gap-4">
        <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.line}` }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Contactos de la cuenta</div>
              <div style={{ fontSize: 12, color: T.steel }}>
                El marcado como principal es el que sale impreso en los presupuestos.
              </div>
            </div>
            <Btn small icon={Plus} onClick={agregar}>Agregar contacto</Btn>
          </div>

          {cs.length === 0 && (
            <div className="px-4 py-6" style={{ fontSize: 13, color: T.steel }}>
              Todavía no cargaste a nadie. Como mínimo conviene tener al responsable de flota y a quien maneja
              la administración y los pagos.
            </div>
          )}

          {cs.map((x) => (
            <div key={x.id} className="px-4 py-3" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
              <div className="flex items-center gap-2 flex-wrap">
                <input value={x.nombre} placeholder="Nombre y apellido"
                  onChange={(e) => upC(x.id, "nombre", e.target.value)}
                  className="outline-none rounded-sm px-2 py-1"
                  style={{ fontSize: 14, fontWeight: 600, border: `1px solid ${T.line}`, minWidth: 200, flex: 1 }} />
                <select value={x.rol} onChange={(e) => upC(x.id, "rol", e.target.value)}
                  className="outline-none rounded-sm px-2 py-1"
                  style={{ fontSize: 12.5, border: `1px solid ${T.line}`, background: T.paper }}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
                <button onClick={() => marcarPrincipal(x.id)} className="px-2 py-1 rounded-sm"
                  style={{
                    fontSize: 11.5,
                    background: x.principal ? T.ink : T.paper,
                    color: x.principal ? "#fff" : T.steel,
                    border: `1px solid ${x.principal ? T.ink : T.line}`,
                  }}>{x.principal ? "Principal" : "Marcar principal"}</button>
                <button onClick={() => upCliente((c) => ({ ...c, contactos: c.contactos.filter((y) => y.id !== x.id) }))}
                  style={{ color: T.steel }}><X size={14} /></button>
              </div>

              <div className="flex gap-2 mt-2 flex-wrap">
                <input value={x.tel} placeholder="Teléfono" onChange={(e) => upC(x.id, "tel", e.target.value)}
                  className="outline-none rounded-sm px-2 py-1"
                  style={{ fontSize: 12.5, border: `1px solid ${T.line}`, width: 160 }} />
                <input value={x.mail} placeholder="Mail" onChange={(e) => upC(x.id, "mail", e.target.value)}
                  className="outline-none rounded-sm px-2 py-1 flex-1"
                  style={{ fontSize: 12.5, border: `1px solid ${T.line}`, minWidth: 200 }} />
              </div>
              <input value={x.notas} placeholder="Notas: horarios, preferencias de contacto, quién autoriza trabajos…"
                onChange={(e) => upC(x.id, "notas", e.target.value)}
                className="w-full outline-none rounded-sm px-2 py-1 mt-2"
                style={{ fontSize: 12.5, border: `1px solid ${T.line}`, color: T.inkSoft }} />
            </div>
          ))}
        </div>

        <div style={{ background: T.paper, border: `1px solid ${T.line}` }} className="px-4 py-4">
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Datos de la cuenta</div>
          <div className="flex items-center gap-3 py-2" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
            <span style={{ fontSize: 12.5, color: T.steel, width: 120 }}>Fecha de alta</span>
            <input type="date" value={cliente.alta || ""}
              onChange={(e) => upCliente((c) => ({ ...c, alta: e.target.value }))}
              className="outline-none bg-transparent" style={{ fontSize: 13, color: T.ink }} />
          </div>
          <div className="pt-3">
            <div style={{ fontSize: 12.5, color: T.steel, marginBottom: 6 }}>Notas de seguimiento</div>
            <textarea value={cliente.notas || ""} rows={6}
              onChange={(e) => upCliente((c) => ({ ...c, notas: e.target.value }))}
              className="w-full outline-none rounded-sm p-2"
              style={{ fontSize: 13, color: T.ink, border: `1px solid ${T.line}`, resize: "vertical", fontFamily: FONT }}
              placeholder="Estado de la negociación, condiciones acordadas, próximos pasos…" />
          </div>
        </div>
      </div>

      <div style={{ background: T.paper, border: `1px solid ${T.line}` }} className="px-4 py-4">
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Mix de flota</div>
        {cliente.modelos.length === 0 && (
          <div style={{ fontSize: 12.5, color: T.steel }}>
            Sin vehículos informados. Cuando te pasen el detalle, cargalo en la pestaña Flota.
          </div>
        )}
        {k.filas.map(({ m }) => {
          const pct = k.unidades ? ((m.cant || 0) / k.unidades) * 100 : 0;
          return (
            <div key={m.id} className="mb-2.5">
              <div className="flex justify-between" style={{ fontSize: 12 }}>
                <span>{m.marca} {m.modelo} {m.version}</span>
                <span style={num}>{int(m.cant)}</span>
              </div>
              <div style={{ height: 6, background: T.lineSoft, marginTop: 3 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: T.ink }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── ajuste IPC ─────────────────────────── */
function TabAjustes({ data, setData }) {
  const [pct, setPct] = useState(0);
  const [nota, setNota] = useState("");

  const aplicar = () => {
    if (!pct) return;
    const f = 1 + pct / 100;
    setData((d) => ({
      ...d,
      clientes: d.clientes.map((c) => ({
        ...c,
        modelos: c.modelos.map((m) => ({
          ...m,
          servicios: m.servicios.map((s) => ({
            ...s,
            mo: Math.round((s.mo || 0) * f),
            rep: Math.round((s.rep || 0) * f),
          })),
        })),
      })),
      config: {
        ipcAcum: Number(((1 + (d.config.ipcAcum || 0) / 100) * f * 100 - 100).toFixed(2)),
        ultimoAjuste: new Date().toISOString().slice(0, 10),
        historial: [{ fecha: new Date().toISOString().slice(0, 10), pct, nota }, ...(d.config.historial || [])],
      },
    }));
    setPct(0);
    setNota("");
  };

  return (
    <div style={{ background: T.paper, border: `1px solid ${T.line}`, maxWidth: 720 }}>
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.line}` }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Actualización trimestral por IPC</div>
        <div style={{ fontSize: 12, color: T.steel }}>
          Aplica el porcentaje a la mano de obra y a los repuestos de todos los tarifarios, en todas las cuentas.
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <div style={{ fontSize: 12, color: T.steel, marginBottom: 4 }}>Variación del trimestre (%)</div>
            <input
              value={pct}
              onChange={(e) => setPct(Number(e.target.value.replace(/[^\d.-]/g, "")) || 0)}
              className="outline-none rounded-sm px-2 py-1.5"
              style={{ ...num, width: 110, fontSize: 15, border: `1px solid ${T.line}`, textAlign: "right" }}
            />
          </div>
          <div className="flex-1" style={{ minWidth: 200 }}>
            <div style={{ fontSize: 12, color: T.steel, marginBottom: 4 }}>Referencia</div>
            <input
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="IPC INDEC 2° trimestre 2026"
              className="w-full outline-none rounded-sm px-2 py-1.5"
              style={{ fontSize: 13, border: `1px solid ${T.line}` }}
            />
          </div>
          <Btn tone="accent" icon={Save} onClick={aplicar}>Aplicar ajuste</Btn>
        </div>

        <div className="flex gap-6 mt-5 mb-4">
          <div>
            <div style={{ fontSize: 11, color: T.steel }}>Ajuste acumulado</div>
            <div style={{ ...num, fontSize: 20, fontWeight: 600 }}>{(data.config.ipcAcum || 0).toFixed(2)} %</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.steel }}>Última actualización</div>
            <div style={{ ...num, fontSize: 20, fontWeight: 600 }}>{data.config.ultimoAjuste || "—"}</div>
          </div>
        </div>

        {(data.config.historial || []).length > 0 && (
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr><Th w={110}>Fecha</Th><Th align="right" w={80}>%</Th><Th>Referencia</Th></tr>
            </thead>
            <tbody>
              {data.config.historial.map((h, i) => (
                <tr key={i}>
                  <Td><span style={num}>{h.fecha}</span></Td>
                  <Td align="right"><span style={num}>{h.pct} %</span></Td>
                  <Td><span style={{ color: T.steel }}>{h.nota || "—"}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── presupuesto ─────────────────────────── */
const NARANJA = "#E2611A";
const hoy = () => new Date().toISOString().slice(0, 10);
const fechaAR = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const NOTAS_DEFAULT =
`Los precios arriba detallados son finales en pesos.
El presente presupuesto tiene una validez de 15 días a partir de la fecha de emisión.
El presupuesto está sujeto a disponibilidad de la pieza al momento de realizar la reparación.
Todo trabajo no contemplado requiere autorización previa de E-Fleets antes de su ejecución.`;

const CONDICIONES_TARIFARIO =
`Precios expresados en pesos argentinos, según el tarifario estandarizado de la Red EuroTaller.
Actualización trimestral por variación del IPC publicado por INDEC.
Incluye mano de obra y repuestos homologados. Salvo indicación expresa, los repuestos son provistos por ETMAN.
La asignación del taller y la coordinación del turno están a cargo de E-Fleets.`;

const nuevoPresu = (cliente) => ({
  v: 2,
  tipo: "intervencion",
  numero: "",
  fecha: hoy(),
  validez: 15,
  tallerK: "",
  modeloId: cliente.modelos[0]?.id || "",
  patente: "",
  km: 0,
  items: [],
  manoObra: 0,
  notas: NOTAS_DEFAULT,
  condiciones: CONDICIONES_TARIFARIO,
});

/* ── exportación: portapapeles con respaldo de descarga ── */
const aTexto = (filas, sep) =>
  filas.map((r) => r.map((c) => String(c ?? "").replace(/[\t\r\n]/g, " ")).join(sep)).join("\n");

const copiarAlPortapapeles = async (texto) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch { /* sigue con el método alternativo */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};

const intentarDescarga = (nombre, texto) => {
  try { window.guardarArchivo(nombre, texto); return true; } catch { return false; }
};

/* Copia en formato tabulado (se pega directo en Excel) e intenta además bajar el .csv */
const exportarTabla = async (nombre, filas, avisar) => {
  const base = String(nombre).replace(/\.(csv|xlsx)$/i, "");
  await copiarAlPortapapeles(aTexto(filas, "\t"));
  try {
    if (window.XLSX) {
      const hoja = XLSX.utils.aoa_to_sheet(filas);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, "Datos");
      const buf = XLSX.write(libro, { bookType: "xlsx", type: "array" });
      const ok = await window.guardarArchivo(base + ".xlsx",
        new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      avisar(ok ? "Excel descargado. También quedó copiado al portapapeles." : "No se pudo descargar el Excel.");
      return;
    }
  } catch (e) { /* cae al csv */ }
  await window.guardarArchivo(base + ".csv", aTexto(filas, ";"));
  avisar("Descargado como CSV.");
};

const descargarCSV = (nombre, filas) => exportarTabla(nombre, filas, () => {});

/* ── impresión: iframe propio, no depende de ventanas emergentes ── */
const CSS_IMPRESION = `
  *{box-sizing:border-box}
  body{margin:0;padding:0;font-family:"Inter","Helvetica Neue",Helvetica,Arial,sans-serif;color:#16232F}
  table{border-collapse:collapse}
  .flex{display:flex}.items-start{align-items:flex-start}.items-center{align-items:center}
  .items-baseline{align-items:baseline}.justify-between{justify-content:space-between}
  .justify-end{justify-content:flex-end}.flex-wrap{flex-wrap:wrap}.w-full{width:100%}
  .gap-2{gap:.5rem}.gap-4{gap:1rem}.gap-8{gap:2rem}
  .mt-1{margin-top:.25rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}
  .mb-1{margin-bottom:.25rem}.mb-4{margin-bottom:1rem}
  .pt-3{padding-top:.75rem}.pb-3{padding-bottom:.75rem}
  .py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}
  .py-3{padding-top:.75rem;padding-bottom:.75rem}.px-2{padding-left:.5rem;padding-right:.5rem}
  @page{margin:14mm;size:A4}
`;

const imprimirNodo = () => {
  try { window.print(); return true; } catch { return false; }
};

/* ─────────── generación del PDF ─────────── */
const C_NARANJA = [226, 97, 26], C_INK = [22, 35, 47], C_GRIS = [110, 125, 137], C_LINEA = [211, 217, 220];

const nuevoPDF = () => {
  if (!window.jspdf || !window.jspdf.jsPDF) return null;
  const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");
  return doc;
};

const pdfPresupuesto = (p, { cliente, modelo, taller, cto, items, total, config }) => {
  const doc = nuevoPDF();
  if (!doc) return null;
  const L = 14, R = 196, ANCHO = R - L;
  let y = 18;

  const txt = (t, x, yy, { s = 9, b = false, col = C_INK, al = "left" } = {}) => {
    doc.setFont("helvetica", b ? "bold" : "normal");
    doc.setFontSize(s);
    doc.setTextColor(col[0], col[1], col[2]);
    doc.text(String(t ?? ""), x, yy, { align: al });
  };
  const linea = (yy, col = C_LINEA) => {
    doc.setDrawColor(col[0], col[1], col[2]);
    doc.setLineWidth(0.2);
    doc.line(L, yy, R, yy);
  };
  const salto = (alto) => {
    if (y + alto > 282) { doc.addPage(); y = 18; return true; }
    return false;
  };

  /* encabezado */
  txt("E-FLEETS", L, y, { s: 17, b: true, col: C_NARANJA });
  txt("GESTIÓN DE FLOTAS", L, y + 4.5, { s: 6.5, col: C_GRIS });
  txt("PRESUPUESTO", R, y - 2, { s: 12, b: true, col: C_NARANJA, al: "right" });
  txt(p.numero || "—", R, y + 3.5, { s: 12, b: true, col: C_NARANJA, al: "right" });
  txt("Fecha: " + fechaAR(p.fecha), R, y + 8, { s: 8, col: C_INK, al: "right" });
  y += 12;
  linea(y);
  y += 5;

  /* taller y operador */
  txt(taller ? taller.n : "Taller sin asignar", L, y, { s: 8.5, b: true });
  txt(taller ? taller.d : "", L, y + 4, { s: 8, col: C_GRIS });
  txt(taller ? `${taller.l}, ${taller.p}` : "", L, y + 7.7, { s: 8, col: C_GRIS });
  txt(taller ? taller.t : "", L, y + 11.4, { s: 8, col: C_GRIS });
  txt("OPERADOR: " + (taller ? taller.ti : "—"), R, y, { s: 8, col: C_GRIS, al: "right" });
  txt("EMAIL: " + (taller ? taller.e : "—"), R, y + 4, { s: 8, col: C_GRIS, al: "right" });
  txt("TEL: " + (taller ? taller.t : "—"), R, y + 7.7, { s: 8, col: C_GRIS, al: "right" });
  txt("ID ETMAN: " + (taller ? taller.id : "—"), R, y + 11.4, { s: 8, col: C_GRIS, al: "right" });
  y += 16;
  linea(y);
  y += 6;

  /* vehículo y cliente */
  const M = 108;
  txt("INFORMACIÓN DEL VEHÍCULO", L, y, { s: 7.5, b: true, col: C_NARANJA });
  txt("INFORMACIÓN DEL CLIENTE", M, y, { s: 7.5, b: true, col: C_NARANJA });
  const parA = [["Detalle", modelo ? nombreModelo(modelo) : "—"], ["Kilometraje", p.km ? int(p.km) : "—"], ["Dominio", p.patente || "—"]];
  const parB = [["Cliente", cliente.nombre], ["Contacto", cto ? cto.nombre : "—"], ["Teléfono", cto ? cto.tel : "—"], ["Mail", cto ? cto.mail : "—"]];
  const filas = Math.max(parA.length, parB.length);
  for (let i = 0; i < filas; i++) {
    const yy = y + 5.5 + i * 4.6;
    if (parA[i]) { txt(parA[i][0], L, yy, { s: 7.5, col: C_GRIS }); txt(parA[i][1], L + 24, yy, { s: 8 }); }
    if (parB[i]) { txt(parB[i][0], M, yy, { s: 7.5, col: C_GRIS }); txt(parB[i][1], M + 20, yy, { s: 8 }); }
  }
  y += 5.5 + filas * 4.6 + 3;
  linea(y);
  y += 7;

  /* cotización */
  txt("COTIZACIÓN DE REPUESTOS", L, y, { s: 9, b: true, col: C_NARANJA });
  y += 5;
  const cMarca = L, cCod = L + 22, cDet = L + 48, cCant = 142, cPre = 166, cSub = R;
  const encabezado = () => {
    txt("MARCA", cMarca, y, { s: 6.5, col: C_GRIS });
    txt("CÓDIGO", cCod, y, { s: 6.5, col: C_GRIS });
    txt("DETALLE", cDet, y, { s: 6.5, col: C_GRIS });
    txt("CANTIDAD", cCant, y, { s: 6.5, col: C_GRIS, al: "right" });
    txt("PRECIO", cPre, y, { s: 6.5, col: C_GRIS, al: "right" });
    txt("SUBTOTAL", cSub, y, { s: 6.5, col: C_GRIS, al: "right" });
    y += 1.6; linea(y); y += 4;
  };
  encabezado();

  items.forEach((i) => {
    const partes = doc.splitTextToSize(String(i.desc || ""), cCant - cDet - 6);
    const alto = Math.max(partes.length * 3.6, 4.4);
    if (salto(alto + 4)) encabezado();
    txt(i.marca || "", cMarca, y, { s: 7.5 });
    txt(i.cod || "", cCod, y, { s: 7.5 });
    partes.forEach((t, n) => txt(t, cDet, y + n * 3.6, { s: 7.5 }));
    txt(int(i.cant), cCant, y, { s: 7.5, al: "right" });
    txt(int(i.precio), cPre, y, { s: 7.5, al: "right" });
    txt(int((i.cant || 0) * (i.precio || 0)), cSub, y, { s: 7.5, al: "right" });
    y += alto;
    doc.setDrawColor(231, 235, 237); doc.line(L, y - 1.4, R, y - 1.4);
    y += 1.6;
  });

  salto(14);
  txt("MANO DE OBRA", cDet, y, { s: 7.5 });
  txt(int(p.manoObra), cPre, y, { s: 7.5, al: "right" });
  txt(int(p.manoObra), cSub, y, { s: 7.5, al: "right" });
  y += 4; linea(y); y += 7;

  txt("TOTAL PRESUPUESTO", 150, y, { s: 9.5, b: true, col: C_NARANJA, al: "right" });
  txt(ars(total), R, y, { s: 13, b: true, col: C_NARANJA, al: "right" });
  y += 10;

  /* notas */
  salto(26);
  linea(y); y += 5;
  txt("NOTAS:", L, y, { s: 7.5, b: true });
  y += 4;
  String(p.notas || "").split("\n").forEach((t) => {
    doc.splitTextToSize(t, ANCHO).forEach((r) => { salto(5); txt(r, L, y, { s: 7, col: C_GRIS }); y += 3.6; });
  });
  if (config && config.ultimoAjuste) {
    y += 2; txt("Última actualización de tarifario: " + fechaAR(config.ultimoAjuste) + ".", L, y, { s: 7, col: C_GRIS });
  }
  return doc;
};

const pdfTarifario = (p, cliente) => {
  const doc = nuevoPDF();
  if (!doc) return null;
  const L = 14, R = 196;
  let y = 18;
  const txt = (t, x, yy, { s = 9, b = false, col = C_INK, al = "left" } = {}) => {
    doc.setFont("helvetica", b ? "bold" : "normal");
    doc.setFontSize(s); doc.setTextColor(col[0], col[1], col[2]);
    doc.text(String(t ?? ""), x, yy, { align: al });
  };
  const linea = (yy, c = C_LINEA) => { doc.setDrawColor(c[0], c[1], c[2]); doc.setLineWidth(0.2); doc.line(L, yy, R, yy); };
  const salto = (alto) => { if (y + alto > 282) { doc.addPage(); y = 18; return true; } return false; };

  txt("E-FLEETS", L, y, { s: 17, b: true, col: C_NARANJA });
  txt("GESTIÓN DE FLOTAS", L, y + 4.5, { s: 6.5, col: C_GRIS });
  txt("TARIFARIO", R, y, { s: 12, b: true, col: C_NARANJA, al: "right" });
  txt("Vigencia desde: " + fechaAR(p.fecha), R, y + 5, { s: 8, al: "right" });
  y += 12; linea(y); y += 6;
  txt("CLIENTE", L, y, { s: 7.5, b: true, col: C_NARANJA });
  txt(cliente.nombre, L + 24, y, { s: 9, b: true });
  y += 6; linea(y); y += 7;

  const cCod = L, cSrv = L + 20, cFrec = 132, cMo = 154, cRep = 176, cTot = R;
  cliente.modelos.forEach((m) => {
    salto(22);
    txt(nombreModelo(m), L, y, { s: 9, b: true, col: C_NARANJA });
    y += 4;
    txt("CÓDIGO", cCod, y, { s: 6.5, col: C_GRIS });
    txt("SERVICIO", cSrv, y, { s: 6.5, col: C_GRIS });
    txt("CADA (KM)", cFrec, y, { s: 6.5, col: C_GRIS, al: "right" });
    txt("M. OBRA", cMo, y, { s: 6.5, col: C_GRIS, al: "right" });
    txt("REPUESTOS", cRep, y, { s: 6.5, col: C_GRIS, al: "right" });
    txt("PRECIO", cTot, y, { s: 6.5, col: C_GRIS, al: "right" });
    y += 1.6; linea(y); y += 4;
    m.servicios.forEach((sv) => {
      const partes = doc.splitTextToSize(String(sv.desc || ""), cFrec - cSrv - 6);
      const alto = Math.max(partes.length * 3.6, 4.2);
      salto(alto + 3);
      txt(sv.cod, cCod, y, { s: 7.5 });
      partes.forEach((t, n) => txt(t, cSrv, y + n * 3.6, { s: 7.5 }));
      txt(int(sv.frec), cFrec, y, { s: 7.5, al: "right" });
      txt(int(sv.mo), cMo, y, { s: 7.5, al: "right" });
      txt(int(sv.rep), cRep, y, { s: 7.5, al: "right" });
      txt(int((sv.mo || 0) + (sv.rep || 0)), cTot, y, { s: 7.5, al: "right" });
      y += alto;
      doc.setDrawColor(231, 235, 237); doc.line(L, y - 1.3, R, y - 1.3);
      y += 1.5;
    });
    y += 5;
  });

  salto(26); linea(y); y += 5;
  txt("CONDICIONES:", L, y, { s: 7.5, b: true }); y += 4;
  String(p.condiciones || "").split("\n").forEach((t) => {
    doc.splitTextToSize(t, R - L).forEach((r) => { salto(5); txt(r, L, y, { s: 7, col: C_GRIS }); y += 3.6; });
  });
  return doc;
};

function TabPresupuesto({ cliente, upCliente, config, red = [] }) {
  const guardado = cliente.presu;
  const p = guardado && guardado.v === 2 ? guardado : nuevoPresu(cliente);
  const setP = (fn) => upCliente((c) => {
    const base = c.presu && c.presu.v === 2 ? c.presu : nuevoPresu(c);
    return { ...c, presu: fn(base) };
  });
  const [aviso, setAviso] = useState("");
  const avisar = (t) => { setAviso(t); setTimeout(() => setAviso(""), 4000); };

  const modelo = cliente.modelos.find((m) => m.id === p.modeloId) || cliente.modelos[0];
  const taller = red.find((t) => t.k === p.tallerK) || null;
  const cto = principal(cliente);
  const items = p.items || [];

  const subRep = items.reduce((a, i) => a + (i.cant || 0) * (i.precio || 0), 0);
  const total = subRep + (p.manoObra || 0);

  const elegido = (sid) => items.some((i) => i.srvId === sid);
  const toggle = (s) =>
    setP((x) => elegido(s.id)
      ? { ...x, items: x.items.filter((i) => i.srvId !== s.id), manoObra: Math.max(0, (x.manoObra || 0) - (s.mo || 0)) }
      : { ...x,
          items: [...x.items, { id: uid(), srvId: s.id, marca: "", cod: s.cod, desc: s.desc, cant: 1, precio: s.rep || 0 }],
          manoObra: (x.manoObra || 0) + (s.mo || 0) });

  const vence = (s) => {
    const km = p.km || 0;
    if (!km || !s.frec) return false;
    const resto = km % s.frec;
    return km >= s.frec * 0.75 && (resto <= 3000 || s.frec - resto <= 3000);
  };

  const sugerir = () => {
    if (!modelo) return;
    const nuevos = modelo.servicios.filter(vence).filter((s) => !elegido(s.id));
    if (!nuevos.length) return avisar("No hay servicios pendientes para ese kilometraje.");
    setP((x) => ({
      ...x,
      items: [...x.items, ...nuevos.map((s) => ({ id: uid(), srvId: s.id, marca: "", cod: s.cod, desc: s.desc, cant: 1, precio: s.rep || 0 }))],
      manoObra: (x.manoObra || 0) + nuevos.reduce((a, s) => a + (s.mo || 0), 0),
    }));
  };

  const setItem = (id, campo, val) =>
    setP((x) => ({ ...x, items: x.items.map((i) => (i.id === id ? { ...i, [campo]: val } : i)) }));

  const exportar = () => {
    if (p.tipo === "intervencion") {
      exportarTabla(`presupuesto-${p.numero || "sn"}-${cliente.nombre}.csv`, [
        ["PRESUPUESTO", p.numero], ["Fecha", fechaAR(p.fecha)],
        ["Taller", taller ? taller.n : ""], ["Operador", taller ? taller.ti : ""],
        ["Cliente", cliente.nombre], ["Contacto", cto ? cto.nombre : ""],
        ["Vehículo", modelo ? nombreModelo(modelo) : ""], ["Dominio", p.patente], ["Kilometraje", p.km], [],
        ["MARCA", "CÓDIGO", "DETALLE", "CANTIDAD", "PRECIO", "SUBTOTAL"],
        ...items.map((i) => [i.marca, i.cod, i.desc, i.cant, i.precio, (i.cant || 0) * (i.precio || 0)]),
        ["", "", "MANO DE OBRA", "", "", p.manoObra],
        [], ["TOTAL PRESUPUESTO", total],
      ], avisar);
    } else {
      exportarTabla(`tarifario-${cliente.nombre}.csv`, [
        ["TARIFARIO DE SERVICIOS ESTANDARIZADOS"], ["Cliente", cliente.nombre], ["Vigencia desde", fechaAR(p.fecha)], [],
        ["Modelo", "Código", "Servicio", "Cada (km)", "Canal repuesto", "Mano de obra", "Repuestos", "Precio total"],
        ...cliente.modelos.flatMap((m) =>
          m.servicios.map((s) => [nombreModelo(m), s.cod, s.desc, s.frec, s.canal, s.mo, s.rep, (s.mo || 0) + (s.rep || 0)])),
      ], avisar);
    }
  };

  const descargarPDF = async () => {
    try {
      const doc = p.tipo === "intervencion"
        ? pdfPresupuesto(p, { cliente, modelo, taller, cto, items, total, config })
        : pdfTarifario(p, cliente);
      if (!doc) { avisar("El generador de PDF no está disponible en esta vista."); return; }
      const nombre = p.tipo === "intervencion"
        ? `presupuesto-${p.numero || "sn"}-${cliente.nombre}.pdf`
        : `tarifario-${cliente.nombre}.pdf`;
      const ok = await window.guardarArchivo(nombre, doc.output("blob"));
      avisar(ok ? "PDF descargado." : "No se pudo descargar el PDF.");
    } catch (e) {
      avisar("Hubo un problema al generar el PDF.");
    }
  };

  const Bloque = ({ titulo, children }) => (
    <div style={{ minWidth: 210, flex: 1 }}>
      <div style={{ fontSize: 11, color: NARANJA, fontWeight: 700, letterSpacing: "0.02em", marginBottom: 4 }}>{titulo}</div>
      {children}
    </div>
  );
  const Dato = ({ l, v }) => (
    <div className="flex gap-2 py-1" style={{ fontSize: 11 }}>
      <span style={{ color: T.steel, width: 84, flexShrink: 0 }}>{l}</span>
      <span style={{ fontWeight: 500, wordBreak: "break-word" }}>{v || "—"}</span>
    </div>
  );
  const Celda = ({ children, align = "left", head, w }) => (
    <td style={{
      textAlign: align, width: w, fontSize: head ? 9.5 : 10.5,
      color: head ? T.steel : T.ink, padding: head ? "0 6px 4px 0" : "4px 6px 4px 0",
      letterSpacing: head ? "0.03em" : 0,
      borderBottom: `1px solid ${head ? T.line : T.lineSoft}`,
      ...(align === "right" ? num : {}),
    }}>{children}</td>
  );

  return (
    <div>
      <div className="no-imprimir flex items-center gap-2 flex-wrap mb-4">
        {[["intervencion", "Presupuesto de intervención"], ["tarifario", "Tarifario ofertado"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setP((x) => ({ ...x, tipo: id }))}
            className="px-3 py-1.5 rounded-sm"
            style={{
              fontSize: 12.5,
              background: p.tipo === id ? T.ink : T.paper,
              color: p.tipo === id ? "#fff" : T.inkSoft,
              border: `1px solid ${p.tipo === id ? T.ink : T.line}`,
            }}>{lbl}</button>
        ))}
        <div className="flex-1" />
        {aviso && <span style={{ fontSize: 12, color: T.ok }}>{aviso}</span>}
        <Btn small icon={Download} onClick={exportar}>Exportar a Excel</Btn>
        <Btn small tone="accent" icon={Printer} onClick={descargarPDF}>Descargar PDF</Btn>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)" }}>
        {/* ── editor ── */}
        <div className="no-imprimir">
          <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.line}`, fontSize: 15, fontWeight: 600 }}>
              Datos del documento
            </div>
            <div className="px-4 py-3">
              <div className="flex gap-3 flex-wrap">
                {p.tipo === "intervencion" && (
                  <div>
                    <div style={{ fontSize: 11, color: T.steel }}>N° de presupuesto</div>
                    <input value={p.numero} placeholder="6205" onChange={(e) => setP((x) => ({ ...x, numero: e.target.value }))}
                      className="outline-none rounded-sm px-2 py-1" style={{ ...num, fontSize: 13, border: `1px solid ${T.line}`, width: 110 }} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 11, color: T.steel }}>{p.tipo === "intervencion" ? "Fecha" : "Vigencia desde"}</div>
                  <input type="date" value={p.fecha} onChange={(e) => setP((x) => ({ ...x, fecha: e.target.value }))}
                    className="outline-none rounded-sm px-2 py-1" style={{ fontSize: 13, border: `1px solid ${T.line}` }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: T.steel }}>Validez (días)</div>
                  <input value={p.validez} onChange={(e) => setP((x) => ({ ...x, validez: Number(e.target.value.replace(/\D/g, "")) || 0 }))}
                    className="outline-none rounded-sm px-2 py-1" style={{ ...num, fontSize: 13, border: `1px solid ${T.line}`, width: 70, textAlign: "right" }} />
                </div>
              </div>

              {p.tipo === "intervencion" && (
                <>
                  <div className="mt-3">
                    <div style={{ fontSize: 11, color: T.steel }}>Taller emisor</div>
                    <select value={p.tallerK} onChange={(e) => setP((x) => ({ ...x, tallerK: e.target.value }))}
                      className="w-full outline-none rounded-sm px-2 py-1"
                      style={{ fontSize: 13, border: `1px solid ${T.line}`, background: T.paper }}>
                      <option value="">Sin asignar</option>
                      {[...red].sort((a, b) => (a.p + a.l).localeCompare(b.p + b.l)).map((t) => (
                        <option key={t.k} value={t.k}>{t.p} · {t.l} — {t.n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 flex-wrap mt-3">
                    <div style={{ minWidth: 200, flex: 1 }}>
                      <div style={{ fontSize: 11, color: T.steel }}>Vehículo</div>
                      <select value={p.modeloId} onChange={(e) => setP((x) => ({ ...x, modeloId: e.target.value, items: [], manoObra: 0 }))}
                        className="w-full outline-none rounded-sm px-2 py-1" style={{ fontSize: 13, border: `1px solid ${T.line}`, background: T.paper }}>
                        {cliente.modelos.map((m) => <option key={m.id} value={m.id}>{nombreModelo(m)}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T.steel }}>Dominio</div>
                      <input value={p.patente} onChange={(e) => setP((x) => ({ ...x, patente: e.target.value.toUpperCase() }))}
                        placeholder="AH070OT" className="outline-none rounded-sm px-2 py-1"
                        style={{ fontSize: 13, border: `1px solid ${T.line}`, width: 110 }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T.steel }}>Kilometraje</div>
                      <input value={p.km} onChange={(e) => setP((x) => ({ ...x, km: Number(e.target.value.replace(/\D/g, "")) || 0 }))}
                        className="outline-none rounded-sm px-2 py-1" style={{ ...num, fontSize: 13, border: `1px solid ${T.line}`, width: 100, textAlign: "right" }} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {p.tipo === "intervencion" && modelo && (
            <div style={{ background: T.paper, border: `1px solid ${T.line}` }} className="mt-4">
              <div className="px-4 py-3 flex items-center justify-between gap-2 flex-wrap" style={{ borderBottom: `1px solid ${T.line}` }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Servicios a incluir</div>
                  <div style={{ fontSize: 12, color: T.steel }}>En naranja, los que corresponden según el kilometraje.</div>
                </div>
                <Btn small icon={Wand2} onClick={sugerir}>Sugerir según km</Btn>
              </div>
              <div className="px-4 py-2" style={{ maxHeight: 240, overflowY: "auto" }}>
                {modelo.servicios.map((s) => {
                  const due = vence(s);
                  return (
                    <label key={s.id} className="flex items-start gap-2 py-1.5" style={{ borderBottom: `1px solid ${T.lineSoft}`, cursor: "pointer" }}>
                      <input type="checkbox" checked={elegido(s.id)} onChange={() => toggle(s)} style={{ marginTop: 3 }} />
                      <span style={{ fontSize: 12.5, flex: 1, color: due ? T.accent : T.ink, fontWeight: due ? 600 : 400 }}>
                        {s.cod} · {s.desc}
                      </span>
                      <span style={{ ...num, fontSize: 12.5, color: T.steel }}>{ars((s.mo || 0) + (s.rep || 0))}</span>
                    </label>
                  );
                })}
              </div>
              <div className="px-4 py-2" style={{ borderTop: `1px solid ${T.line}` }}>
                <Btn small icon={Plus} onClick={() => setP((x) => ({ ...x, items: [...x.items, { id: uid(), srvId: null, marca: "", cod: "", desc: "", cant: 1, precio: 0 }] }))}>
                  Agregar renglón manual
                </Btn>
              </div>
            </div>
          )}

          {p.tipo === "intervencion" && (
            <div style={{ background: T.paper, border: `1px solid ${T.line}` }} className="mt-4">
              <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.line}` }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Cotización editable</div>
                <div style={{ fontSize: 12, color: T.steel }}>
                  Marca y código del repuesto se completan a mano, igual que en el presupuesto del taller.
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 520 }}>
                  <thead>
                    <tr><Th w={80}>Marca</Th><Th w={85}>Código</Th><Th>Detalle</Th>
                      <Th align="right" w={55}>Cant.</Th><Th align="right" w={95}>Precio</Th><Th w={30}></Th></tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr><Td><span style={{ color: T.steel }}>Elegí los servicios de arriba.</span></Td></tr>
                    )}
                    {items.map((i) => (
                      <tr key={i.id}>
                        <Td><Field value={i.marca} onChange={(v) => setItem(i.id, "marca", v.toUpperCase())} /></Td>
                        <Td><Field value={i.cod} onChange={(v) => setItem(i.id, "cod", v.toUpperCase())} /></Td>
                        <Td><Field value={i.desc} onChange={(v) => setItem(i.id, "desc", v)} /></Td>
                        <Td align="right"><NumField value={i.cant} onChange={(v) => setItem(i.id, "cant", v)} /></Td>
                        <Td align="right"><NumField value={i.precio} onChange={(v) => setItem(i.id, "precio", v)} /></Td>
                        <Td align="right">
                          <button onClick={() => setP((x) => ({ ...x, items: x.items.filter((y) => y.id !== i.id) }))}
                            style={{ color: T.steel }}><X size={13} /></button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3" style={{ background: T.surface }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12.5, color: T.steel }}>Mano de obra</span>
                  <input value={p.manoObra}
                    onChange={(e) => setP((x) => ({ ...x, manoObra: Number(e.target.value.replace(/\D/g, "")) || 0 }))}
                    className="outline-none rounded-sm px-2 py-1"
                    style={{ ...num, fontSize: 13, border: `1px solid ${T.line}`, width: 110, textAlign: "right" }} />
                </div>
                <div style={{ fontSize: 13 }}>
                  Total <span style={{ ...num, fontSize: 16, fontWeight: 700, marginLeft: 6 }}>{ars(total)}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: T.paper, border: `1px solid ${T.line}` }} className="mt-4 px-4 py-3">
            <div style={{ fontSize: 12.5, color: T.steel, marginBottom: 6 }}>
              {p.tipo === "intervencion" ? "Notas que se imprimen al pie" : "Condiciones que se imprimen al pie"}
            </div>
            <textarea rows={5}
              value={p.tipo === "intervencion" ? p.notas : p.condiciones}
              onChange={(e) => setP((x) => (p.tipo === "intervencion"
                ? { ...x, notas: e.target.value } : { ...x, condiciones: e.target.value }))}
              className="w-full outline-none rounded-sm p-2"
              style={{ fontSize: 12.5, border: `1px solid ${T.line}`, resize: "vertical", fontFamily: FONT, lineHeight: 1.5 }} />
          </div>
        </div>

        {/* ── documento ── */}
        <div id="doc-imprimible" style={{ background: "#fff", border: `1px solid ${T.line}`, padding: "26px 28px" }}>
          <div className="flex items-start justify-between pb-3" style={{ borderBottom: `1px solid ${T.line}` }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: NARANJA }}>E-FLEETS</div>
              <div style={{ fontSize: 10, color: T.steel, letterSpacing: "0.08em" }}>GESTIÓN DE FLOTAS</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: NARANJA, letterSpacing: "0.02em" }}>
                {p.tipo === "intervencion" ? "PRESUPUESTO" : "TARIFARIO"}
              </div>
              {p.tipo === "intervencion" && (
                <div style={{ ...num, fontSize: 15, fontWeight: 700, color: NARANJA }}>{p.numero || "—"}</div>
              )}
              <div style={{ ...num, fontSize: 10.5, color: T.inkSoft }}>
                <b style={{ color: NARANJA }}>{p.tipo === "intervencion" ? "Fecha: " : "Vigencia desde: "}</b>{fechaAR(p.fecha)}
              </div>
            </div>
          </div>

          {p.tipo === "intervencion" && (
            <div className="flex gap-8 flex-wrap py-3" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
              <div style={{ minWidth: 210, flex: 1, fontSize: 11 }}>
                <div style={{ fontWeight: 700 }}>{taller ? taller.n : "Taller sin asignar"}</div>
                <div style={{ color: T.inkSoft }}>{taller ? taller.d : ""}</div>
                <div style={{ color: T.inkSoft }}>{taller ? `${taller.l}, ${taller.p}` : ""}</div>
                <div style={{ ...num, color: T.inkSoft }}>{taller ? taller.t : ""}</div>
                <div style={{ color: T.inkSoft }}>{taller ? taller.e : ""}</div>
              </div>
              <div style={{ minWidth: 190, textAlign: "right", fontSize: 10.5, color: T.inkSoft }}>
                <div><span style={{ color: T.steel }}>OPERADOR: </span>{taller ? taller.ti : "—"}</div>
                <div><span style={{ color: T.steel }}>EMAIL: </span>{taller ? taller.e : "—"}</div>
                <div style={num}><span style={{ color: T.steel }}>TEL: </span>{taller ? taller.t : "—"}</div>
                <div style={num}><span style={{ color: T.steel }}>ID ETMAN: </span>{taller ? taller.id : "—"}</div>
              </div>
            </div>
          )}

          <div className="flex gap-8 flex-wrap py-3" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
            {p.tipo === "intervencion" && (
              <Bloque titulo="INFORMACIÓN DEL VEHÍCULO">
                <Dato l="Detalle" v={modelo ? nombreModelo(modelo) : ""} />
                <Dato l="Kilometraje" v={p.km ? int(p.km) : ""} />
                <Dato l="Dominio" v={p.patente} />
              </Bloque>
            )}
            <Bloque titulo="INFORMACIÓN DEL CLIENTE">
              <Dato l="Cliente" v={cliente.nombre} />
              <Dato l="Contacto" v={cto ? cto.nombre : ""} />
              <Dato l="Teléfono" v={cto ? cto.tel : ""} />
              <Dato l="Mail" v={cto ? cto.mail : ""} />
            </Bloque>
          </div>

          {p.tipo === "intervencion" ? (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: NARANJA, letterSpacing: "0.02em", margin: "14px 0 6px" }}>
                COTIZACIÓN DE REPUESTOS
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <Celda head w={64}>MARCA</Celda>
                    <Celda head w={70}>CÓDIGO</Celda>
                    <Celda head>DETALLE</Celda>
                    <Celda head align="right" w={58}>CANTIDAD</Celda>
                    <Celda head align="right" w={66}>PRECIO</Celda>
                    <Celda head align="right" w={72}>SUBTOTAL</Celda>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr><td colSpan={6} style={{ fontSize: 11, color: T.steel, padding: "12px 0" }}>
                      Sin renglones cargados.
                    </td></tr>
                  )}
                  {items.map((i) => (
                    <tr key={i.id}>
                      <Celda>{i.marca}</Celda>
                      <Celda>{i.cod}</Celda>
                      <Celda>{i.desc}</Celda>
                      <Celda align="right">{i.cant}</Celda>
                      <Celda align="right">{int(i.precio)}</Celda>
                      <Celda align="right">{int((i.cant || 0) * (i.precio || 0))}</Celda>
                    </tr>
                  ))}
                  <tr>
                    <Celda></Celda><Celda></Celda>
                    <Celda>MANO DE OBRA</Celda>
                    <Celda align="right"></Celda>
                    <Celda align="right">{int(p.manoObra)}</Celda>
                    <Celda align="right">{int(p.manoObra)}</Celda>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end items-baseline gap-4 mt-3">
                <span style={{ fontSize: 12.5, fontWeight: 700, color: NARANJA, letterSpacing: "0.02em" }}>TOTAL PRESUPUESTO</span>
                <span style={{ ...num, fontSize: 17, fontWeight: 800, color: NARANJA }}>{ars(total)}</span>
              </div>
            </>
          ) : (
            <div className="mt-3">
              {cliente.modelos.map((m) => (
                <div key={m.id} className="mb-4">
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: NARANJA, paddingBottom: 3 }}>{nombreModelo(m)}</div>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <Celda head w={52}>CÓDIGO</Celda>
                        <Celda head>SERVICIO</Celda>
                        <Celda head align="right" w={62}>CADA (KM)</Celda>
                        <Celda head align="right" w={66}>M. OBRA</Celda>
                        <Celda head align="right" w={66}>REPUESTOS</Celda>
                        <Celda head align="right" w={72}>PRECIO</Celda>
                      </tr>
                    </thead>
                    <tbody>
                      {m.servicios.map((s) => (
                        <tr key={s.id}>
                          <Celda>{s.cod}</Celda>
                          <Celda>{s.desc}</Celda>
                          <Celda align="right">{int(s.frec)}</Celda>
                          <Celda align="right">{int(s.mo)}</Celda>
                          <Celda align="right">{int(s.rep)}</Celda>
                          <Celda align="right">{int((s.mo || 0) + (s.rep || 0))}</Celda>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${T.line}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: T.ink, marginBottom: 3 }}>
              {p.tipo === "intervencion" ? "NOTAS:" : "CONDICIONES:"}
            </div>
            <div style={{ fontSize: 10, color: T.inkSoft, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
              {p.tipo === "intervencion" ? p.notas : p.condiciones}
            </div>
            {config?.ultimoAjuste && (
              <div style={{ fontSize: 10, color: T.steel, marginTop: 6 }}>
                Última actualización de tarifario: {fechaAR(config.ultimoAjuste)}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── red de talleres ─────────────────────────── */
function TabRed({ data, setData }) {
  const [prov, setProv] = useState("");
  const [q, setQ] = useState("");
  const [selK, setSelK] = useState(data.red[0]?.k || null);

  const red = data.red;
  const provincias = [...new Set(red.map((t) => t.p))].sort();
  const filtrada = red.filter((t) => {
    if (prov && t.p !== prov) return false;
    if (!q) return true;
    const s = `${t.n} ${t.l} ${t.p} ${t.ti} ${t.id}`.toLowerCase();
    return s.includes(q.toLowerCase());
  });
  const sel = red.find((t) => t.k === selK) || filtrada[0];

  const upT = (k, fn) => setData((d) => ({ ...d, red: d.red.map((t) => (t.k === k ? fn(t) : t)) }));
  const conDatos = red.filter((t) => t.rubros.length > 0).length;

  const toggleRubro = (r) =>
    upT(sel.k, (t) => ({
      ...t,
      rubros: t.rubros.includes(r) ? t.rubros.filter((x) => x !== r) : [...t.rubros, r],
    }));

  const [aviso, setAviso] = useState("");
  const exportar = () =>
    exportarTabla("red-eurotaller.csv", [
      ["Taller", "Localidad", "Provincia", "Dirección", "Titular", "Teléfono", "Mail",
       "ID ETMAN", "Coordinador", "Logística", "Bahías", "Apto pickup 4x4", "Rubros", "Notas"],
      ...red.map((t) => [t.n, t.l, t.p, t.d, t.ti, t.t, t.e, t.id, t.c, t.g,
        t.bahias, t.pickup ? "Sí" : "No", t.rubros.join(" / "), t.notas]),
    ], (m) => { setAviso(m); setTimeout(() => setAviso(""), 4000); });

  return (
    <div>
      <div style={{ background: T.paper, borderBottom: `1px solid ${T.line}` }} className="px-5 py-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>Talleres EuroTaller</div>
            <div style={{ fontSize: 12.5, color: T.steel }}>
              Directorio de la red y matriz de capacidad técnica por taller.
            </div>
          </div>
          <div className="flex items-center gap-3">
            {aviso && <span style={{ fontSize: 12, color: T.ok }}>{aviso}</span>}
            <Btn icon={Download} onClick={exportar}>Exportar a Excel</Btn>
          </div>
        </div>
        <div className="flex flex-wrap mt-3">
          <Stat label="Talleres en la red" value={int(red.length)} sub={`${provincias.length} provincias`} accent />
          <Stat label="Con capacidad cargada" value={`${conDatos} / ${red.length}`}
            sub={`${Math.round((conDatos / red.length) * 100)}% del directorio`} />
          <Stat label="Aptos para pickup 4x4" value={int(red.filter((t) => t.pickup).length)}
            sub="habilitados para Ranger y Hilux" />
          <Stat label="Bahías declaradas" value={int(red.reduce((a, t) => a + (t.bahias || 0), 0))}
            sub="capacidad instalada total" />
        </div>
      </div>

      <div className="p-5 grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(300px,380px)" }}>
        <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
          <div className="px-4 py-3 flex gap-2 flex-wrap" style={{ borderBottom: `1px solid ${T.line}` }}>
            <select value={prov} onChange={(e) => setProv(e.target.value)}
              className="outline-none rounded-sm px-2 py-1.5"
              style={{ fontSize: 12.5, border: `1px solid ${T.line}`, background: T.paper }}>
              <option value="">Todas las provincias</option>
              {provincias.map((x) => <option key={x}>{x}</option>)}
            </select>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar taller, localidad, titular o ID ETMAN"
              className="flex-1 outline-none rounded-sm px-2 py-1.5"
              style={{ fontSize: 12.5, border: `1px solid ${T.line}`, minWidth: 200 }} />
          </div>
          <div style={{ maxHeight: 560, overflowY: "auto" }}>
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead><tr>
                <Th>Taller</Th><Th w={130}>Localidad</Th><Th w={120}>Provincia</Th>
                <Th align="right" w={72}>ID ETMAN</Th><Th align="right" w={80}>Capacidad</Th>
              </tr></thead>
              <tbody>
                {filtrada.map((t) => (
                  <tr key={t.k} onClick={() => setSelK(t.k)} style={{ cursor: "pointer", background: t.k === sel?.k ? T.accentSoft : "transparent" }}>
                    <Td><span style={{ fontWeight: t.k === sel?.k ? 600 : 400 }}>{t.n}</span></Td>
                    <Td>{t.l}</Td>
                    <Td><span style={{ color: T.steel, fontSize: 12 }}>{t.p}</span></Td>
                    <Td align="right"><span style={num}>{t.id || "—"}</span></Td>
                    <Td align="right">
                      <span style={{ ...num, fontSize: 12, color: t.rubros.length ? T.ok : T.steel }}>
                        {t.rubros.length}/{RUBROS.length}
                      </span>
                    </Td>
                  </tr>
                ))}
                {filtrada.length === 0 && (
                  <tr><Td><span style={{ color: T.steel }}>Ningún taller coincide con el filtro.</span></Td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {sel && (
          <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{sel.n}</div>
              <div style={{ fontSize: 12, color: T.steel }}>{sel.d ? `${sel.d} · ` : ""}{sel.l}, {sel.p}</div>
            </div>
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
              {[["Titular", sel.ti], ["Teléfono", sel.t], ["Mail", sel.e],
                ["ID ETMAN", sel.id], ["Coordinador", sel.c], ["Logística", sel.g]].map(([l, v]) => (
                <div key={l} className="flex gap-2 py-1" style={{ fontSize: 12.5 }}>
                  <span style={{ color: T.steel, width: 92 }}>{l}</span>
                  <span style={{ flex: 1, wordBreak: "break-word" }}>{v || "—"}</span>
                </div>
              ))}
            </div>

            <div className="px-4 py-3">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Capacidad técnica</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {RUBROS.map((r) => {
                  const on = sel.rubros.includes(r);
                  return (
                    <button key={r} onClick={() => toggleRubro(r)} className="px-2 py-1 rounded-sm"
                      style={{
                        fontSize: 11.5,
                        background: on ? T.ink : T.paper,
                        color: on ? "#fff" : T.steel,
                        border: `1px solid ${on ? T.ink : T.line}`,
                      }}>{r}</button>
                  );
                })}
              </div>

              <div className="flex gap-4 items-end flex-wrap">
                <div>
                  <div style={{ fontSize: 11, color: T.steel }}>Bahías / elevadores</div>
                  <input value={sel.bahias}
                    onChange={(e) => upT(sel.k, (t) => ({ ...t, bahias: Number(e.target.value.replace(/\D/g, "")) || 0 }))}
                    className="outline-none rounded-sm px-2 py-1"
                    style={{ ...num, fontSize: 13, border: `1px solid ${T.line}`, width: 70, textAlign: "right" }} />
                </div>
                <label className="flex items-center gap-2 pb-1" style={{ fontSize: 12.5, cursor: "pointer" }}>
                  <input type="checkbox" checked={sel.pickup}
                    onChange={(e) => upT(sel.k, (t) => ({ ...t, pickup: e.target.checked }))} />
                  Apto para pickup 4x4
                </label>
              </div>

              <div className="mt-3">
                <div style={{ fontSize: 11, color: T.steel, marginBottom: 4 }}>Notas</div>
                <textarea value={sel.notas} rows={3}
                  onChange={(e) => upT(sel.k, (t) => ({ ...t, notas: e.target.value }))}
                  placeholder="Restricciones, horarios, observaciones de auditoría…"
                  className="w-full outline-none rounded-sm p-2"
                  style={{ fontSize: 12.5, border: `1px solid ${T.line}`, resize: "vertical", fontFamily: FONT }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


ReactDOM.createRoot(document.getElementById("raiz")).render(<PanelFlotas />);