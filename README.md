# Evangelische Termine Ausgeben
Gibt Evangelische Termine über einen Block aus.

Im Block lassen sich Veranstalter, Anzahl, Veranstaltungstyp, Zielgruppe, Ort und Suchtext festlegen. **Nur im Titel suchen** beschränkt den Suchtext auf den Veranstaltungstitel, damit Erwähnungen einer Gruppe in fremden Veranstaltungsbeschreibungen keine Treffer erzeugen. Ohne diese Option werden wie bisher Titel und Beschreibung durchsucht. Die Begrenzung greift nach dem Filtern; Vorschau und Website verwenden dieselben Regeln.

Unter **Block → Einstellungen → Veranstalter-ID(s)** kann eine ID oder eine Kommaliste stehen, zum Beispiel `1081,562`. Leerzeichen, doppelte IDs und leere Listeneinträge werden beim Abruf bereinigt. Ungültige Listeneinträge erzeugen einen Hinweis, statt unbemerkt nur einen Teil oder alle Veranstalter abzufragen.

Die [offizielle Schnittstelle](https://handbuch.evangelische-termine.de/anzeige-im-internet/ausgabe-parameter) unterstützt die gemeinsame Auswahl über `vid`. Das Plugin nutzt einen gemeinsamen Abruf: Reihenfolge, Filter und Seitenbegrenzung stammen weiterhin vom Anbieter; die eingestellte Anzahl gilt insgesamt, nicht pro Veranstalter. Die gemeinsame Liste wird wie bisher eine Stunde zwischengespeichert. Suchtext und Ortsfilter werden anschließend wie bisher angewendet; dabei kann die erste vom Anbieter gelieferte Seite weniger passende Treffer als die gewählte Anzahl enthalten.

**Kompatibilität:** Die Einzel-ID-Konfiguration, Blockattribute, gespeicherten Inhalte, Legacy-/Senior-HTML-Struktur und Styles bleiben erhalten. Mehrere Veranstalter funktionieren im modernen und im Legacy-/Senior-Modus. Die zweite ID im jeweiligen Block ist die bewusste Aktivierung; eine globale Umstellung oder zusätzliche Settings-Seite ist dafür nicht nötig. Bestehende Websites erhalten keinen zweiten Veranstalter automatisch. Der eigene Veranstalter im Kirchen-Theme wird von diesem Plugin-Update nicht geändert.

Der Block wird dynamisch durch PHP ausgegeben. `save()` speichert deshalb keine statische Demo-Ausgabe. Vorhandene Blöcke mit dem früheren Platzhalter bleiben ladbar.

## Optionale Daten für eigene Detailseiten

Themes können `LN\EvangelischeTermineAusgeben\EventDetails::get($organizerId)` ausdrücklich aufrufen. Die Methode liefert bis zu 100 aktuelle Termine eines Veranstalters aus der ausführlichen öffentlichen XML-Ausgabe als `Veranstaltung`-Arrays, ergänzt um `_field_labels` und `_visible_fields`. Fehler liefern einen `WP_Error`; ein leeres erfolgreiches Ergebnis ist ein leeres Array. Die bestehenden Blöcke und REST-Antworten nutzen diesen Abruf nicht und bleiben unverändert. Es gibt keine automatische Umstellung der Legacy-/Senior-Ausgabe und keine notwendige Migration oder neue globale Einstellung.

Der Abruf ist auf fünf Sekunden und 2 MiB beschränkt, nutzt einen einstündigen Cache und pausiert nach Fehlern für eine Minute. Eine Sperre pro Veranstalter verhindert gleichzeitige Abrufe. XML-Dokumente mit DTD werden abgelehnt; externe Ressourcen werden nicht aufgelöst. Ausgabe-Templates müssen Werte weiterhin escapen und ausschließlich geeignete öffentliche Felder anzeigen – das Rohformat enthält auch Verwaltungsfelder.

Das Kirchen-Theme verwendet diese Erweiterung für richtig beschriftete Zusatzinformationen. Anmeldeformulare werden über `_poll_ID` verlinkt; die Anmeldung selbst und aktuelle Platzverfügbarkeit bleiben beim Anbieter. Details zur Feldbelegung stehen im [Handbuch](https://handbuch.evangelische-termine.de/exporte/platzhalter).

```sh
npm run build
npm run lint
php tests/search.php /path/to/wordpress/wp-load.php
php tests/organizers.php /path/to/wordpress/wp-load.php
php tests/event-details.php /path/to/wordpress/wp-load.php
```

Die Integrationstests verwenden kontrollierte Datenströme; sie schreiben keine Datenbankinhalte und rufen keine externen Termine ab. Der Mehrveranstalter-Test simuliert HTTP und den Plugin-Cache. Vier vor der Änderung erfasste HTML-Ausgaben aus Commit `b2fb7dd` sichern moderne und Legacy-Ausgabe einschließlich langer/kurzer Wochentage, Überschriften, Zeiten, Orten, Personen, Links und Zeilenklassen exakt ab. Weitere Prüfungen decken gemeinsame Limits, Filter, Cache-Schlüssel, ungültige Listen und Ausfälle ab. Für WordPress-Integrationstests muss die CLI-PHP-Version auch die Anforderungen des aktiven Themes erfüllen.

Bei einer Installation direkt aus dem `main`-Branch wird der Ordner `tests/` mit ausgeliefert. Seine `.htaccess` sperrt unter Apache 2.4 alle Webzugriffe, sofern der Server diese Datei auswertet. Zusätzlich verweigern sämtliche PHP-Testdateien Webaufrufe mit HTTP 403, bevor WordPress geladen wird; sie lassen sich ausschließlich über die Kommandozeile ausführen. Diese PHP-Sperre funktioniert unabhängig von `.htaccess`. Bei Nginx oder deaktivierter `.htaccess` muss der Testordner in der Serverkonfiguration gesperrt werden, wenn auch die statischen Beispieldaten nicht abrufbar sein sollen. Das separat für den Plugin Check erzeugte Paket enthält den Testordner nicht.
