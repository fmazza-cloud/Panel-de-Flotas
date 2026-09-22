/* ── almacenamiento: base del artefacto, con respaldo local ── */
var dbLista = (window.claude && window.claude.use)
  ? window.claude.use("db").catch(function(){ return null; })
  : Promise.resolve(null);

var CLAVE_DOC = "estado/efleets_panel";

window.storage = {
  get: async function (k) {
    try {
      var db = await dbLista;
      if (db) {
        var s = await db.doc(CLAVE_DOC).get();
        if (s && s.exists && s.data && typeof s.data.json === "string") return { value: s.data.json };
      }
    } catch (e) {}
    var v = null;
    try { v = localStorage.getItem(k); } catch (e) {}
    if (v == null) throw new Error("sin datos guardados");
    return { value: v };
  },
  set: async function (k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
    try {
      var db = await dbLista;
      if (db) await db.doc(CLAVE_DOC).set({ json: v, actualizado: new Date().toISOString() });
    } catch (e) {}
    return { value: v };
  }
};

/* ── guardar archivos ── */
window.guardarArchivo = async function (nombre, texto) {
  try {
    var d = (window.claude && window.claude.use) ? await window.claude.use("downloads") : null;
    if (d) { await d.save({ filename: nombre, data: texto }); return true; }
  } catch (e) {}
  try {
    var blob = (texto instanceof Blob) ? texto : new Blob(["\uFEFF" + texto], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = nombre; document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    return true;
  } catch (e) { return false; }
};