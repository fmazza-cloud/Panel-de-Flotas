#!/usr/bin/env python3
"""
Arma index.html, la aplicación completa y autocontenida, a partir de las piezas
del repositorio. No requiere dependencias: solo Python 3.

    python3 build/build.py

El resultado es un único archivo que funciona abriéndolo en el navegador.
"""
from pathlib import Path
import sys

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "index.html"

PIEZAS_PANEL = [
    ("ICONOS",           RAIZ / "src" / "iconos.jsx"),
    ("TABLA_VEHICULOS",  RAIZ / "datos" / "tabla-vehiculos.js"),
    ("CODIGOS",          RAIZ / "datos" / "codigos-asignados.js"),
    ("RED_TALLERES",     RAIZ / "datos" / "red-talleres.js"),
]


def leer(p: Path) -> str:
    if not p.exists():
        sys.exit(f"Falta el archivo {p.relative_to(RAIZ)}")
    return p.read_text(encoding="utf-8")


def main() -> None:
    panel = leer(RAIZ / "src" / "panel.jsx")
    for etiqueta, ruta in PIEZAS_PANEL:
        marca = f"/*@@{etiqueta}@@*/"
        if marca not in panel:
            sys.exit(f"No encuentro la marca {marca} en src/panel.jsx")
        panel = panel.replace(marca, leer(ruta), 1)

    html = leer(RAIZ / "src" / "shell.html")
    html = html.replace("<!--@@RUNTIME@@-->", leer(RAIZ / "src" / "runtime.js"), 1)
    html = html.replace("<!--@@PANEL@@-->", panel, 1)
    for nombre, credito in (("jspdf.umd.min.js", "jsPDF 2.5.2"), ("xlsx.full.min.js", "SheetJS 0.18.5")):
        html = html.replace(f"<!--@@VENDOR:{nombre}@@-->",
                            f"<script>/* {credito} */\n" + leer(RAIZ / "vendor" / nombre) + "\n</script>", 1)

    if "@@" in html:
        sys.exit("Quedaron marcas sin reemplazar en la salida")

    SALIDA.write_text(html, encoding="utf-8")
    print(f"index.html generado: {len(html) / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
