# Evangelische Termine Ausgeben
Gibt Evangelische Termine über einen Block aus.

Im Block lassen sich Veranstalter, Anzahl, Veranstaltungstyp, Zielgruppe, Ort und Suchtext festlegen. **Nur im Titel suchen** beschränkt den Suchtext auf den Veranstaltungstitel, damit Erwähnungen einer Gruppe in fremden Veranstaltungsbeschreibungen keine Treffer erzeugen. Ohne diese Option werden wie bisher Titel und Beschreibung durchsucht. Die Begrenzung greift nach dem Filtern; Vorschau und Website verwenden dieselben Regeln.

Unter **Block → Einstellungen → Veranstalter-ID(s)** kann eine ID oder eine Kommaliste stehen, zum Beispiel `1081,562`. Leerzeichen, doppelte IDs und leere Listeneinträge werden beim Abruf bereinigt. Ungültige Listeneinträge erzeugen einen Hinweis, statt unbemerkt nur einen Teil oder alle Veranstalter abzufragen.

Die [offizielle Schnittstelle](https://handbuch.evangelische-termine.de/anzeige-im-internet/ausgabe-parameter) unterstützt die gemeinsame Auswahl über `vid`. Das Plugin nutzt einen gemeinsamen Abruf: Reihenfolge, Filter und Seitenbegrenzung stammen weiterhin vom Anbieter; die eingestellte Anzahl gilt insgesamt, nicht pro Veranstalter. Die gemeinsame Liste wird wie bisher eine Stunde zwischengespeichert. Suchtext und Ortsfilter werden anschließend wie bisher angewendet; dabei kann die erste vom Anbieter gelieferte Seite weniger passende Treffer als die gewählte Anzahl enthalten.

**Kompatibilität:** Die Einzel-ID-Konfiguration, Blockattribute, gespeicherten Inhalte, Legacy-/Senior-HTML-Struktur und Styles bleiben erhalten. Mehrere Veranstalter funktionieren im modernen und im Legacy-/Senior-Modus. Die zweite ID im jeweiligen Block ist die bewusste Aktivierung; eine globale Umstellung oder zusätzliche Settings-Seite ist dafür nicht nötig. Bestehende Websites erhalten keinen zweiten Veranstalter automatisch. Der eigene Veranstalter im Kirchen-Theme wird von diesem Plugin-Update nicht geändert.

Der Block wird dynamisch durch PHP ausgegeben. `save()` speichert deshalb keine statische Demo-Ausgabe. Vorhandene Blöcke mit dem früheren Platzhalter bleiben ladbar.

## Optionale WP-Rocket-Anbindung

Unter **Einstellungen → Evangelische Termine** lässt sich die Anbindung aktivieren. Sie ist standardmäßig aus, gilt pro Website (auch in Multisite) und pausiert ohne aktives WP Rocket. Plugin- und Legacy-Ausgabe bleiben unverändert.

`BlockRender` meldet beim tatsächlichen **öffentlichen, nicht eingeloggten Seitenaufruf** die Seiten-ID, Abfrage, Blockfilter und einen Hash der angezeigten Liste an. Mehrere Blöcke auf derselben Seite werden zusammengeführt. Es gibt keinen Inhalts-Scan und keine Registrierung durch öffentliche REST-Anfragen, Editorvorschauen, Detail-URLs oder beliebige Query-Parameter. Bei späteren öffentlichen Aufrufen wird die Zuordnung ersetzt; Seiten ohne Terminliste werden wieder abgemeldet. Nach dem Einschalten vorhandene Terminseiten einmal gezielt in WP Rocket leeren und öffentlich aufrufen oder vorladen, damit schon gecachte Seiten registriert werden.

Der Hintergrundjob `ln_eta_rocket_check` läuft alle fünf Minuten. Er erneuert verwendete JSON-Abfragen ungefähr alle 30 Minuten, dedupliziert gleiche Abfragen (einschließlich mehrerer Veranstalter) und vergleicht danach die tatsächliche Ausgabe mit den persistent gespeicherten Hashes. Die frischen Daten landen zuerst im bisherigen einstündigen Feed-Cache. Nur geänderte Ausgaben veranlassen eine gezielte Bereinigung der betreffenden Seiten. Die WP-Rocket-Hooks stoßen bei eingeschaltetem Vorladen deren Wiederaufbau an; sonst geschieht das beim nächsten Besuch. Es gibt keine vollständige Cache-Löschung. Zeitabhängige Theme-Listen werden auch bei identischen Anbieterdaten neu verglichen. Der Standard-/Legacy-Block behält seine bisherige Zeit- und Filterlogik.

HTTP-Fehler, ungültiges JSON und unvollständige Antworten ersetzen keine gültigen Daten und lösen keine Seitenbereinigung aus. Ein erfolgreich geliefertes `[]` gilt dagegen als leere Terminliste. Bestehende Feed-Caches werden bei Fehlern nicht verlängert. Anfragen sind auf fünf Sekunden und 2 MiB begrenzt, Wiederholungen auf fünf bis 30 Minuten verzögert und parallele Jobs gesperrt. Pro Lauf werden höchstens drei neue Abfragen und 50 angemeldete Seiten bearbeitet; große Installationen können deshalb längere Aktualisierungszeiten haben. Pro Seite werden bis zu 20 unterschiedliche Listen und 64 KiB Zuordnungsdaten erfasst. Änderungen beim Anbieter sind erst erkennbar, wenn dessen Schnittstelle sie ausliefert.

Für verlässliche Ausführung sollte das Hosting `wp-cron.php` alle fünf Minuten aufrufen; bei Multisite für jede beteiligte Website. WP-CLI ist nicht nötig. WP-Cron erst deaktivieren, nachdem der Hosting-Job funktioniert. Die normale WP-Rocket-Cache-Lebensdauer bleibt als zusätzliche Absicherung bestehen; eine pauschale stündliche Leerung ist für diese Anbindung nicht erforderlich. Andere Cache-Ebenen (Hosting/CDN), fremde Shortcodes, Archivseiten und Query-String-Caches werden nicht von dieser Funktion verwaltet. Vorausgesetzt werden sprechende Permalinks. Veranstaltungsdetails, Druckansicht und PDF weiterhin vom Seiten-Cache ausnehmen; der zusätzliche XML-Daten-Cache behält seine eigene Laufzeit.

Eigene Themes können dieselbe automatische Registrierung nutzen: `CacheSync::observe($type, $query, $attributes, $stableOutput)` während der öffentlichen Ausgabe aufrufen und über `ln_eta_cache_projection` für denselben Typ aus frischen Daten exakt denselben stabilen Ausgabewert erzeugen. Der Filter erhält `(null, $type, $attributes, $rows)` und muss eine Zeichenkette oder `null` zurückgeben. Keine Netzwerkanfragen oder Seiteneffekte im Vergleichsfilter auslösen. Das Kirchen-Theme verwendet diese Anbindung für Startseite, Terminübersicht und `achillea/events`, einschließlich des Ausblendens bereits begonnener Termine.

Referenzen: [WP Rocket: gezielte Bereinigung](https://docs.wp-rocket.me/article/91-rocketcleanfiles), [WP Rocket: zuverlässige Cron-Ausführung](https://docs.wp-rocket.me/article/1279-cron-and-wp-rocket).

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
php tests/cache-sync.php /path/to/wordpress/wp-load.php
```

Mit lokal vorhandenen WP-Rocket-Quellen kann zusätzlich `php tests/cache-rocket-files.php /path/to/wordpress/wp-load.php /path/to/wp-rocket/inc/functions` ausgeführt werden. Dieser Test benötigt eine Testinstallation ohne aktives WP Rocket und legt ausschließlich temporäre Cache-Dateien an; er prüft die originale Löschfunktion und die an den Vorlade-Hook übergebenen URLs, einschließlich Schutz untergeordneter Seiten.

Die Integrationstests verwenden kontrollierte Datenströme; sie schreiben keine Datenbankinhalte und rufen keine externen Termine ab. Der Mehrveranstalter-Test simuliert HTTP und den Plugin-Cache. Vier vor der Änderung erfasste HTML-Ausgaben aus Commit `b2fb7dd` sichern moderne und Legacy-Ausgabe einschließlich langer/kurzer Wochentage, Überschriften, Zeiten, Orten, Personen, Links und Zeilenklassen exakt ab. Weitere Prüfungen decken gemeinsame Limits, Filter, Cache-Schlüssel, ungültige Listen und Ausfälle ab. Für WordPress-Integrationstests muss die CLI-PHP-Version auch die Anforderungen des aktiven Themes erfüllen.

Bei einer Installation direkt aus dem `main`-Branch wird der Ordner `tests/` mit ausgeliefert. Seine `.htaccess` sperrt unter Apache 2.4 alle Webzugriffe, sofern der Server diese Datei auswertet. Zusätzlich verweigern sämtliche PHP-Testdateien Webaufrufe mit HTTP 403, bevor WordPress geladen wird; sie lassen sich ausschließlich über die Kommandozeile ausführen. Diese PHP-Sperre funktioniert unabhängig von `.htaccess`. Bei Nginx oder deaktivierter `.htaccess` muss der Testordner in der Serverkonfiguration gesperrt werden, wenn auch die statischen Beispieldaten nicht abrufbar sein sollen. Das separat für den Plugin Check erzeugte Paket enthält den Testordner nicht.
