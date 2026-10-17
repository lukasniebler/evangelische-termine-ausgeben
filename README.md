# Evangelische Termine Ausgeben
Gibt Evangelische Termine über einen Block aus.

Im Block lassen sich Veranstalter, Anzahl, Veranstaltungstyp, Zielgruppe, Ort und Suchtext festlegen. **Nur im Titel suchen** beschränkt den Suchtext auf den Veranstaltungstitel, damit Erwähnungen einer Gruppe in fremden Veranstaltungsbeschreibungen keine Treffer erzeugen. Ohne diese Option werden wie bisher Titel und Beschreibung durchsucht. Die Begrenzung greift nach dem Filtern; Vorschau und Website verwenden dieselben Regeln.

Unter **Block → Einstellungen → Veranstalter-ID(s)** kann eine ID oder eine Kommaliste stehen, zum Beispiel `1081,562`. Leerzeichen, doppelte IDs und leere Listeneinträge werden beim Abruf bereinigt. Ungültige Listeneinträge erzeugen einen Hinweis, statt unbemerkt nur einen Teil oder alle Veranstalter abzufragen.

Die [offizielle Schnittstelle](https://handbuch.evangelische-termine.de/anzeige-im-internet/ausgabe-parameter) unterstützt die gemeinsame Auswahl über `vid`. Das Plugin nutzt einen gemeinsamen Abruf: Reihenfolge, Filter und Seitenbegrenzung stammen weiterhin vom Anbieter; die eingestellte Anzahl gilt insgesamt, nicht pro Veranstalter. Die gemeinsame Liste wird wie bisher eine Stunde zwischengespeichert. Suchtext und Ortsfilter werden anschließend wie bisher angewendet; dabei kann die erste vom Anbieter gelieferte Seite weniger passende Treffer als die gewählte Anzahl enthalten.

**Kompatibilität:** Die Einzel-ID-Konfiguration, Blockattribute, gespeicherten Inhalte, Legacy-/Senior-HTML-Struktur und Styles bleiben erhalten. Mehrere Veranstalter funktionieren im modernen und im Legacy-/Senior-Modus. Die zweite ID im jeweiligen Block ist die bewusste Aktivierung; eine globale Umstellung oder zusätzliche Settings-Seite ist dafür nicht nötig. Bestehende Websites erhalten keinen zweiten Veranstalter automatisch. Der eigene Veranstalter im Kirchen-Theme wird von diesem Plugin-Update nicht geändert.

Der Block wird dynamisch durch PHP ausgegeben. `save()` speichert deshalb keine statische Demo-Ausgabe. Vorhandene Blöcke mit dem früheren Platzhalter bleiben ladbar.

```sh
npm run build
npm run lint
php tests/search.php /path/to/wordpress/wp-load.php
php tests/organizers.php /path/to/wordpress/wp-load.php
```

Die Integrationstests verwenden kontrollierte Datenströme; sie schreiben keine Datenbankinhalte und rufen keine externen Termine ab. Der Mehrveranstalter-Test simuliert HTTP und den Plugin-Cache. Vier vor der Änderung erfasste HTML-Ausgaben aus Commit `b2fb7dd` sichern moderne und Legacy-Ausgabe einschließlich langer/kurzer Wochentage, Überschriften, Zeiten, Orten, Personen, Links und Zeilenklassen exakt ab. Weitere Prüfungen decken gemeinsame Limits, Filter, Cache-Schlüssel, ungültige Listen und Ausfälle ab. Für WordPress-Integrationstests muss die CLI-PHP-Version auch die Anforderungen des aktiven Themes erfüllen.
