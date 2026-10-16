# Evangelische Termine Ausgeben
Gibt Evangelische Termine über einen Block aus.

Im Block lassen sich Veranstalter, Anzahl, Veranstaltungstyp, Zielgruppe, Ort und Suchtext festlegen. **Nur im Titel suchen** beschränkt den Suchtext auf den Veranstaltungstitel, damit Erwähnungen einer Gruppe in fremden Veranstaltungsbeschreibungen keine Treffer erzeugen. Ohne diese Option werden wie bisher Titel und Beschreibung durchsucht. Die Begrenzung greift nach dem Filtern; Vorschau und Website verwenden dieselben Regeln.

Der Block wird dynamisch durch PHP ausgegeben. `save()` speichert deshalb keine statische Demo-Ausgabe. Vorhandene Blöcke mit dem früheren Platzhalter bleiben ladbar.

```sh
npm run build
php tests/search.php /path/to/wordpress/wp-load.php
```

Der Integrationstest verwendet einen lokalen Test-Datenstrom; er schreibt keine Daten und ruft keine externen Termine ab.
