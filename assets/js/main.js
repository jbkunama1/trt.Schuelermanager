/**
 * trtSchuelermanager – main.js
 * Grundlegende Logik: Schüler hinzufügen, Tabelle rendern, CSV-Export.
 * Kein Framework, kein Build-Tool – reines Vanilla JavaScript (ES6+).
 *
 * Lizenz: MIT
 */

'use strict';

/* ==========================================================================
   Datenmodell
   ========================================================================== */

/**
 * @typedef {Object} Schueler
 * @property {number} id     - Eindeutige ID (fortlaufend)
 * @property {string} name   - Vor- und Nachname
 * @property {string} klasse - Klasse (z. B. "10a")
 * @property {string} note   - Note (1–6, optional leer)
 */

/** @type {Schueler[]} Zentrales Array aller Schüler */
let schuelerListe = [];

/** Zähler für die nächste zu vergebende ID */
let nextId = 1;

/* ==========================================================================
   DOM-Referenzen – werden nach DOMContentLoaded gesetzt
   ========================================================================== */
let btnAdd, btnExport, btnCancel;
let modalAdd, modalBackdrop;
let formAddStudent, inputName, inputKlasse, inputNote;
let tableBody, studentTable, emptyHint, studentCount;

/* ==========================================================================
   Initialisierung
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* DOM-Referenzen auflösen */
  btnAdd        = document.getElementById('btn-add');
  btnExport     = document.getElementById('btn-export');
  btnCancel     = document.getElementById('btn-cancel');
  modalAdd      = document.getElementById('modal-add');
  modalBackdrop = document.getElementById('modal-backdrop');
  formAddStudent = document.getElementById('form-add-student');
  inputName     = document.getElementById('input-name');
  inputKlasse   = document.getElementById('input-klasse');
  inputNote     = document.getElementById('input-note');
  tableBody     = document.getElementById('table-body');
  studentTable  = document.getElementById('student-table');
  emptyHint     = document.getElementById('empty-hint');
  studentCount  = document.getElementById('student-count');

  /* Aktuelles Jahr im Footer setzen */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* Event-Listener registrieren */
  btnAdd.addEventListener('click', openModal);
  btnCancel.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  btnExport.addEventListener('click', exportCSV);
  formAddStudent.addEventListener('submit', handleFormSubmit);

  /* Escape-Taste schließt Modal */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalAdd.classList.contains('hidden')) {
      closeModal();
    }
  });

  /* Initiales Rendern (leere Tabelle) */
  renderTabelle();
});

/* ==========================================================================
   Modal-Steuerung
   ========================================================================== */

/** Öffnet das "Schüler hinzufügen"-Modal und fokussiert das Namensfeld. */
function openModal() {
  formAddStudent.reset();
  clearInputErrors();
  modalAdd.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');
  inputName.focus();
}

/** Schließt das Modal und setzt das Formular zurück. */
function closeModal() {
  modalAdd.classList.add('hidden');
  modalBackdrop.classList.add('hidden');
  formAddStudent.reset();
  clearInputErrors();
}

/* ==========================================================================
   Formular-Verarbeitung
   ========================================================================== */

/**
 * Wird beim Absenden des Formulars aufgerufen.
 * Validiert die Eingaben, erstellt ein Schüler-Objekt und fügt es ein.
 * @param {Event} e - Submit-Event
 */
function handleFormSubmit(e) {
  e.preventDefault();
  clearInputErrors();

  const name   = inputName.value.trim();
  const klasse = inputKlasse.value.trim();
  const noteRaw = inputNote.value.trim();

  /* Pflichtfeld-Validierung */
  if (!name) {
    markInputError(inputName, 'Bitte einen Namen eingeben.');
    return;
  }

  /* Note validieren (optional, aber wenn angegeben dann 1–6) */
  let note = '';
  if (noteRaw !== '') {
    const noteNum = parseFloat(noteRaw);
    if (isNaN(noteNum) || noteNum < 1 || noteNum > 6) {
      markInputError(inputNote, 'Note muss zwischen 1 und 6 liegen.');
      return;
    }
    note = String(noteNum);
  }

  schuelerHinzufuegen(name, klasse, note);
  closeModal();
}

/**
 * Erstellt einen neuen Schüler-Eintrag und fügt ihn zur Liste hinzu.
 * @param {string} name
 * @param {string} klasse
 * @param {string} note
 */
function schuelerHinzufuegen(name, klasse, note) {
  /** @type {Schueler} */
  const neuerSchueler = {
    id:     nextId++,
    name:   name,
    klasse: klasse || '–',
    note:   note   || '–',
  };

  schuelerListe.push(neuerSchueler);
  renderTabelle();
}

/* ==========================================================================
   Schüler löschen
   ========================================================================== */

/**
 * Entfernt einen Schüler anhand seiner ID aus der Liste.
 * @param {number} id - ID des zu löschenden Schülers
 */
function schuelerLoeschen(id) {
  schuelerListe = schuelerListe.filter((s) => s.id !== id);
  renderTabelle();
}

/* ==========================================================================
   Tabelle rendern
   ========================================================================== */

/**
 * Rendert die komplette Schülertabelle neu basierend auf `schuelerListe`.
 * Zeigt den leeren Hinweis, wenn keine Einträge vorhanden sind.
 */
function renderTabelle() {
  /* Zähler aktualisieren */
  studentCount.textContent = schuelerListe.length;

  if (schuelerListe.length === 0) {
    /* Tabelle verbergen, Hinweis anzeigen */
    studentTable.classList.add('hidden');
    emptyHint.classList.remove('hidden');
    return;
  }

  /* Hinweis verbergen, Tabelle anzeigen */
  emptyHint.classList.add('hidden');
  studentTable.classList.remove('hidden');

  /* Tabelleninhalt neu aufbauen */
  tableBody.innerHTML = '';

  schuelerListe.forEach((schueler, index) => {
    const tr = document.createElement('tr');

    /* Zellen befüllen */
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(schueler.name)}</td>
      <td>${escapeHtml(schueler.klasse)}</td>
      <td>${escapeHtml(schueler.note)}</td>
      <td>
        <button
          class="btn btn-danger"
          type="button"
          aria-label="Schüler ${escapeHtml(schueler.name)} löschen"
          data-id="${schueler.id}"
        >Löschen</button>
      </td>
    `;

    /* Löschen-Button: Event-Listener direkt setzen */
    const deleteBtn = tr.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => schuelerLoeschen(schueler.id));

    tableBody.appendChild(tr);
  });
}

/* ==========================================================================
   CSV-Export
   ========================================================================== */

/**
 * Exportiert die aktuelle Schülerliste als CSV-Datei und löst den
 * Browser-Download aus.
 */
function exportCSV() {
  if (schuelerListe.length === 0) {
    alert('Keine Schüler zum Exportieren vorhanden.');
    return;
  }

  /* CSV-Inhalt aufbauen */
  const header = ['Nr', 'Name', 'Klasse', 'Note'].join(';');
  const rows = schuelerListe.map((s, i) =>
    [i + 1, csvEscape(s.name), csvEscape(s.klasse), csvEscape(s.note)].join(';')
  );
  const csvContent = [header, ...rows].join('\r\n');

  /* BOM für korrekte Darstellung in Excel (Windows/DE) */
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

  /* Download-Link erzeugen und simulieren */
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `schueler_export_${datumStempel()}.csv`;
  document.body.appendChild(link);
  link.click();

  /* Aufräumen */
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   Hilfsfunktionen
   ========================================================================== */

/**
 * Escapet HTML-Sonderzeichen um XSS zu verhindern.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Escaped einen Wert für die CSV-Ausgabe (Anführungszeichen).
 * @param {string} value
 * @returns {string}
 */
function csvEscape(value) {
  const str = String(value);
  /* Wenn der Wert ein Semikolon, Anführungszeichen oder Zeilenumbruch enthält,
     wird er in Anführungszeichen eingeschlossen. */
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Gibt einen Datums-Stempel im Format YYYY-MM-DD zurück.
 * @returns {string}
 */
function datumStempel() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Markiert ein Eingabefeld als fehlerhaft (visuelle Rückmeldung).
 * @param {HTMLInputElement} input
 * @param {string} message - Fehlermeldung (für aria-label / Konsolen-Hinweis)
 */
function markInputError(input, message) {
  input.classList.add('input-error');
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('title', message);
  input.focus();
}

/**
 * Entfernt alle Fehler-Markierungen aus den Formular-Feldern.
 */
function clearInputErrors() {
  [inputName, inputKlasse, inputNote].forEach((input) => {
    if (input) {
      input.classList.remove('input-error');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('title');
    }
  });
}
