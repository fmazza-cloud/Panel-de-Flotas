const { useState, useEffect, useMemo } = React;

/* ── íconos ── */
const svg = (...partes) => (props) => {
  const s = props && props.size ? props.size : 16;
  return React.createElement("svg", {
    width: s, height: s, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
    style: { flexShrink: 0, display: "inline-block", verticalAlign: "middle" }
  }, partes.map((d, n) =>
    typeof d === "string"
      ? React.createElement("path", { key: n, d })
      : React.createElement(d.t, { key: n, ...d.a })
  ));
};
const cir = (cx, cy, r) => ({ t: "circle", a: { cx, cy, r } });
const rec = (x, y, w, h) => ({ t: "rect", a: { x, y, width: w, height: h } });

const Plus = svg("M5 12h14", "M12 5v14");
const X = svg("M18 6 6 18", "M6 6l12 12");
const Check = svg("M20 6 9 17l-5-5");
const Download = svg("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3");
const Trash2 = svg("M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2");
const Save = svg("M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8");
const Printer = svg("M6 9V2h12v7", "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2", rec(6, 14, 12, 8));
const FileText = svg("M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z", "M14 2v5h6", "M16 13H8", "M16 17H8");
const Building2 = svg("M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", "M10 6h4", "M10 10h4", "M10 14h4");
const Truck = svg("M4 17H2V6h12v11h-3", "M14 9h4l4 4v4h-2", cir(7.5, 17.5, 2.5), cir(17.5, 17.5, 2.5));
const Wrench = svg("M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z");
const TrendingUp = svg("M22 7 13.5 15.5l-5-5L2 17", "M16 7h6v6");
const Settings = svg("M4 21v-7", "M4 10V3", "M12 21v-9", "M12 8V3", "M20 21v-5", "M20 12V3", "M1 14h6", "M9 8h6", "M17 16h6");
const AlertCircle = svg(cir(12, 12, 10), "M12 8v4", "M12 16h.01");
const Wand2 = svg("m3 21 8-8", "M14 4l1.2 2.4L18 7.5l-2.4 1.2L14 11l-1.2-2.3L10 7.5l2.4-1.1z", "M19 13l.8 1.6L21.5 15l-1.6.8L19 17.5l-.8-1.7L16.5 15l1.7-.8z");
