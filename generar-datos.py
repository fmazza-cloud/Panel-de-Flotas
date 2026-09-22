#!/usr/bin/env python3
"""
Regenera datos/tabla-vehiculos.js y datos/red-talleres.js a partir de los Excel
originales. Usalo cuando ETMAN actualice la Tabla de Vehículos o cuando cambie
la agenda de talleres.

    pip install pandas openpyxl
    python3 build/generar-datos.py fuentes/Tabla_Vehiculos.xlsx fuentes/Agenda_Eurotaller_2026.xlsx

Después correr build/build.py para rearmar index.html.
"""
import json, re, sys
from pathlib import Path
import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
S = lambda v: "" if pd.isna(v) else re.sub(r"\s+", " ", str(v)).strip()
N = lambda v: "" if pd.isna(v) else str(int(v))


def tabla_vehiculos(ruta: Path) -> None:
    xl = pd.ExcelFile(ruta)
    d = pd.read_excel(xl, xl.sheet_names[0])
    d.columns = [c.strip() for c in d.columns]
    marcas = sorted({S(x) for x in d["VEHICU_MARAUT"] if S(x)})
    idx = {m: i for i, m in enumerate(marcas)}
    filas = [[idx.get(S(r["VEHICU_MARAUT"]), -1), S(r["VEHICU_MODAUT"]), S(r["VEHICU_VERAUT"]),
              S(r["VEHICU_CILAUT"]), S(r["VEHICU_CODMOT"]), S(r["VEHICU_CODIGO"]),
              N(r["VEHICU_ANODES"]), N(r["VEHICU_ANOHAS"])]
             for _, r in d.iterrows() if S(r["VEHICU_CODIGO"])]
    js = ("const VEH_MARCAS = " + json.dumps(marcas, ensure_ascii=False, separators=(",", ":")) + ";\n"
          "const VEH = " + json.dumps(filas, ensure_ascii=False, separators=(",", ":")) + ";")
    (RAIZ / "datos" / "tabla-vehiculos.js").write_text(js, encoding="utf-8")
    print(f"tabla-vehiculos.js: {len(marcas)} marcas, {len(filas)} vehículos")


def red_talleres(ruta: Path) -> None:
    d = pd.read_excel(ruta, "AGENDA")
    d.columns = [str(c).strip() for c in d.columns]
    d = d[d["Eurotaller"].notna()]
    ident = lambda v: "" if pd.isna(v) else (str(int(v)) if isinstance(v, float) and v == int(v) else S(v))
    filas = [{"n": S(r["Eurotaller"]), "l": S(r["Localidad"]).title(), "p": S(r["Provincia"]).upper(),
              "d": S(r["CONCA DIR"]), "t": S(r["Teléfono"]), "e": S(r["Mail"]), "ti": S(r["Titular"]),
              "id": ident(r["ID Etman"]), "c": S(r["Cordinador"]).title(),
              "g": S(r["Logistica Etman"]).upper()} for _, r in d.iterrows()]
    js = "const RED_SEED = " + json.dumps(filas, ensure_ascii=False, separators=(",", ":")).replace("},{", "},\n{") + ";"
    (RAIZ / "datos" / "red-talleres.js").write_text(js, encoding="utf-8")
    print(f"red-talleres.js: {len(filas)} talleres")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for arg in sys.argv[1:]:
        p = Path(arg)
        if "vehiculo" in p.name.lower():
            tabla_vehiculos(p)
        elif "agenda" in p.name.lower() or "eurotaller" in p.name.lower():
            red_talleres(p)
        else:
            print(f"No sé qué hacer con {p.name}")
