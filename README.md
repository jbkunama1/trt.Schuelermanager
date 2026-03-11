# trtSchuelermanager

> Minimalistisches Tool zur Schülerverwaltung

Ein leichtgewichtiger, webbasierter Schülermanager zur Verwaltung von Listen, Noten und Klassen.
Fokus liegt auf schneller Bedienbarkeit direkt im Unterricht (Fach: Technik · Sport · WBS) –
ohne Server, ohne Datenbank, direkt im Browser.

---

## Features

- ✅ Schüler hinzufügen (Name, Klasse, Note)
- ✅ Übersichtliche Tabelle mit Zeilennummerierung
- ✅ Schüler löschen
- ✅ CSV-Export (Excel-kompatibel, UTF-8 BOM)
- ✅ Responsives Design – auch auf Tablets nutzbar
- ✅ Kein Framework, kein Build-Tool – reines Vanilla JS

---

## Tech-Stack

| Technologie | Version |
|-------------|---------|
| HTML5       | –       |
| CSS3        | –       |
| JavaScript  | ES6+    |

---

## Installation & Nutzung

Da es sich um ein reines Frontend-Projekt handelt, ist **keine Installation** nötig.

### Schnellstart (lokal)

1. Repository klonen oder als ZIP herunterladen:
   ```bash
   git clone https://github.com/jbkunama1/trtSchuelermanager.git
   ```
2. In das Projektverzeichnis wechseln:
   ```bash
   cd trtSchuelermanager
   ```
3. Die Datei `index.html` direkt im Browser öffnen –
   oder einen einfachen Entwicklungs-Server starten:
   ```bash
   # Mit Python (kein Node.js nötig)
   python -m http.server 8080
   ```
   Anschließend [http://localhost:8080](http://localhost:8080) im Browser aufrufen.

### Alternativ: VS Code Live Server

1. Extension **Live Server** (Ritwick Dey) in VS Code installieren.
2. `index.html` öffnen und auf **Go Live** klicken.

---

## Projektstruktur

```
trtSchuelermanager/
├── index.html            # Haupt-HTML-Seite
├── assets/
│   ├── css/
│   │   └── style.css     # Stylesheet (responsiv, kontrastreich)
│   └── js/
│       └── main.js       # Anwendungslogik (Vanilla JS)
├── .gitignore
└── README.md
```

---

## Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**.

```
MIT License

Copyright (c) 2024 trtSchuelermanager Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
