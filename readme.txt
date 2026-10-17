=== Evangelische Termine Ausgeben ===
Contributors: Lukas Niebler
Tags: Evangelische Termine, Kalender, Ausgabe, Evangelisch, Kirche, Evangelische Kirche
Requires at least: 6.7
Tested up to: 7.0
Requires PHP: 8.0
Stable tag: 1.1.0
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

A plugin to display church events from Evangelische Termine.

== Description ==

Evangelische Termine erlaubt die Ausgabe von Veranstaltungen aus dem Veranstaltungskalender Evangelische Termine über den BlockEditor.

== Installation ==

1. 

== Frequently Asked Questions ==

= Wie benutze ich die Blöcke? =

Nach der Aktivierung des Plugins stehen die Blöcke im Gutenberg Editor unter der Kategorie Evangelische Termine Ausgabe zur Verfügung.

= Kann ich Termine von zwei Veranstaltern gemeinsam anzeigen? =

Ja. Im Block unter Einstellungen → Veranstalter-ID(s) die IDs mit einem Komma trennen, zum Beispiel 1081,562. Die Anzahl der Veranstaltungen gilt für die gemeinsame Liste. Leerzeichen und doppelte IDs werden bereinigt. Die bisherige Eingabe einer einzelnen ID bleibt möglich.

= Funktioniert das auch im Legacy-/Senior-Modus? =

Ja. Die bestehende HTML-Struktur und Gestaltung bleiben erhalten. Erst die zusätzliche ID im jeweiligen Block erweitert dessen Auswahl; es gibt keine automatische Umstellung bestehender Blöcke.

== Screenshots ==



== Changelog ==

= 1.1.0 =
* Mehrere komma-separierte Veranstalter-IDs im Block: gemeinsame Terminliste mit Gesamtbegrenzung, Bereinigung von Leerzeichen und doppelten IDs.
* Einzel-ID-Konfiguration sowie HTML-Struktur und Styles des Legacy-/Senior-Modus bleiben erhalten.
* Verständliche Fehlerhinweise bei ungültigen ID-Listen; veraltete Anfragen überschreiben die Editor-Vorschau nicht mehr.
* Optionale Suche nur im Veranstaltungstitel und Unterstützung dynamischer Blöcke in Seitenvorlagen.

= 1.0.0 =
* Erste Veröffentlichung.

== Upgrade Notice ==

= 1.1.0 =
Mehrere Veranstalter lassen sich optional durch zusätzliche IDs im jeweiligen Block auswählen. Bestehende Einzel-ID-Blöcke und die Legacy-/Senior-Ausgabe bleiben erhalten; eine Migration ist nicht nötig.

== License ==

Dieses Plugin ist unter der GNU General Public License v3 lizenziert.

== Notes ==

Feedback und Fehler können als Issue im GitHub Repository gemeldet werden.

Weitere Informationen finden Sie unter [Evangelische Termine Ausgabe Repository](https://github.com/lukasniebler/evangelische-termine-ausgeben).

