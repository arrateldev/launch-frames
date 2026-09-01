# Marketing Asset Studio

## Kurzidee

Ein schlankes SaaS-Tool für App-Entwickler, das aus einer echten App, einer Demo-URL oder hochgeladenen Screenshots in wenigen Minuten professionelle Store- und Social-Marketingbilder erzeugt.

Das Produkt soll kein Canva-Ersatz werden. Der Fokus liegt auf einem schnellen, geführten Workflow:

> App oder Screenshot rein, Plattform wählen, gute Texte ergänzen, fertige Assets im richtigen Format exportieren.

## Arbeitstitel

- StoreShots for Developers
- AppShot Studio
- LaunchFrames
- ShipShots
- ReleaseCanvas
- CaptureKit

## Zielgruppe

- Indie-Developer
- kleine SaaS-Teams
- Mobile-App-Entwickler
- Entwickler mit Expo, React Native, Tauri, Electron, Web-Apps oder Browser-Extensions
- Teams, die regelmäßig App Store, Google Play, Microsoft Store, Chrome Web Store, Firefox Add-ons, Product Hunt oder Social Assets aktualisieren müssen

## Problem

Viele Entwickler bauen gute Produkte, aber ihre Store-Screenshots und Launch-Bilder sehen improvisiert aus.

Typische Schmerzen:

- Store-Formate sind nervig und ändern sich.
- Screenshots müssen immer wieder neu erstellt werden, sobald sich die UI ändert.
- Design-Tools sind zu manuell.
- Viele Mockup-Generatoren sehen gut aus, sind aber nicht auf schnelle Wiederholbarkeit ausgelegt.
- Mehrsprachige Varianten kosten unnötig Zeit.
- Mobile, Desktop, Tablet, Social und Store brauchen jeweils andere Maße.
- Kurze Promo-Videos sind noch aufwendiger als statische Bilder.

## Positionierung

Nicht:

> Ein universeller Design-Editor.

Sondern:

> Ein fokussiertes Screenshot- und Launch-Asset-Studio für Entwickler.

Möglicher Claim:

> Store-ready screenshots in 5 minutes.

Oder:

> Generate polished app store assets from your real app.

## Kernversprechen

In unter fünf Minuten:

1. App-URL oder Screenshot hinzufügen
2. Plattform auswählen
3. 3 bis 5 kurze Headlines eintragen
4. Template wählen
5. PNG-ZIP exportieren

Optional später:

- ein kurzes animiertes Promo-Video
- mehrsprachige Varianten
- automatischer Re-Export nach UI-Änderungen

## Wichtigster Unterschied zu bestehenden Tools

Viele bestehende Tools starten beim Screenshot-Upload.

Dieses Produkt sollte langfristig beim **Live Capture** starten:

- URL zur App/Demo eingeben
- Gerät oder Viewport wählen
- optional Klickpfad/Szene definieren
- Screenshot direkt aus der echten App aufnehmen
- daraus Store- und Social-Assets generieren

Upload bleibt als einfacher Fallback erhalten.

## MVP

Der MVP soll extrem schlank bleiben.

### Muss enthalten

- Ein Projekt anlegen
- Produktname, Logo und Brandfarben setzen
- App-URL oder Screenshot-Upload
- Plattform-Presets:
  - App Store
  - Google Play
  - Microsoft Store
  - Social 1200x630
- Device-Modi:
  - Desktop
  - iPhone
  - Android Phone
- 3 bis 5 Screenshot-Slides
- Headline und Subline pro Slide
- Light/Dark-Template
- PNG-Export
- ZIP-Export für alle generierten Assets

### Kann im MVP fehlen

- Teamfunktionen
- komplexer Layer-Editor
- freie Drag-and-drop-Layouts
- eigene Animationstimeline
- Billing-Komplexität
- Marketplace für Templates
- tiefe Integrationen

## Idealer Workflow

### 1. Projekt erstellen

Der Nutzer gibt ein:

- Produktname
- App-URL oder Demo-URL
- Logo
- Hauptfarbe
- optionale zweite Akzentfarbe
- Sprache

Optional erkennt das Tool Farben und Logo automatisch aus URL oder Upload.

### 2. Plattform wählen

Der Nutzer wählt:

- App Store
- Google Play
- Microsoft Store
- Browser Extension Stores
- Social Pack

Das Tool kennt die nötigen Formate und erzeugt passende Canvas-Größen.

### 3. Screens erfassen

Varianten:

- Screenshot hochladen
- URL im Browser-Capture öffnen
- Viewport wählen
- Screenshot aufnehmen
- später: einfache Capture-Steps definieren

Beispiel Capture-Steps:

```txt
1. Öffne https://demo.example.com
2. Warte bis App geladen ist
3. Klicke "Vault"
4. Erstelle Screenshot "vault-overview"
5. Klicke "Sync"
6. Erstelle Screenshot "sync-settings"
```

### 4. Template anwenden

Das Tool erzeugt automatisch eine professionelle Komposition:

- Hintergrund
- Device Frame
- Screenshot
- Headline
- Subline
- Logo oder App-Icon
- dezente Schatten
- exportfähige Maße

Der Nutzer soll möglichst wenig manuell verschieben müssen.

### 5. Export

Export als:

- PNG
- optional WebP
- ZIP mit allen Größen
- später MP4/WebM für kurze Promo-Animationen

## Feature-Ideen

### Store Presets

- App Store iPhone Screenshots
- App Store iPad Screenshots
- Google Play Phone Screenshots
- Google Play Tablet Screenshots
- Google Play Feature Graphic
- Microsoft Store Screenshots
- Chrome Web Store Promo Tile
- Firefox Add-ons Promo Assets

### Social Presets

- Open Graph 1200x630
- X/Twitter Post
- LinkedIn Post
- Product Hunt Gallery
- YouTube Thumbnail
- GitHub Release Banner

### Developer-Fokus

- URL Capture
- Localhost Capture
- Vercel Preview Capture
- GitHub Pages Capture
- Expo Web Demo Capture
- Tauri/Electron/Web-App Screenshots
- Batch-Regeneration
- Config-Datei pro Projekt
- CLI oder GitHub Action später

### Design-Fokus

- gute Defaults statt leerer Editor
- begrenzte Template-Auswahl
- automatische typografische Skalierung
- automatische Farbvorschläge
- Logo/App-Icon Platzierung
- Screenshot-Zoom/Callout
- Device Frame an/aus
- Hintergrundvarianten

### Animationen

Keine freie Videobearbeitung, sondern wenige starke Presets:

- Device fährt ein
- Screenshot-Slider
- Feature-Zoom
- Desktop zu Mobile
- 3-Slide Carousel
- kurzer Store Preview Clip

## Technischer Ansatz

### Frontend

- Next.js App Router
- React
- Tailwind CSS
- shadcn-style Komponenten
- Konfigurierbarer Editor mit Presets

### Screenshot Capture

Empfohlen:

- Playwright für reproduzierbare Screenshots
- feste Viewports und Device-Emulation
- Element-Screenshots für präzise Ausschnitte
- optional Videoaufnahme

Playwright kann Screenshots, Device-Emulation und Videos aufnehmen:

- https://playwright.dev/docs/screenshots
- https://playwright.dev/docs/next/emulation
- https://playwright.dev/docs/videos

### Bildverarbeitung

Empfohlen:

- `sharp` für Resize, Crop, Composite und Export

Quelle:

- https://sharp.pixelplumbing.com/

### Clientseitiger Export

Optional:

- `html-to-image`
- `@hugocxl/react-to-image`

Gut für schnelle manuelle Exports im Browser, aber für zuverlässige Batch-Exports ist Playwright plus serverseitige Bildverarbeitung besser.

Quellen:

- https://www.npmjs.com/package/html-to-image
- https://github.com/hugocxl/react-to-image

### Social Cards

Optional:

- Next `ImageResponse`
- `@vercel/og`

Gut für automatisch generierte Open-Graph-Bilder.

Quelle:

- https://vercel.com/docs/og-image-generation

### Videos

Optional später:

- Remotion für React-basierte Promo-Videos

Quelle:

- https://remotion-dev.github.io/remotion/

## Datenmodell

### Project

- id
- name
- slug
- logoUrl
- primaryColor
- secondaryColor
- defaultLocale
- appUrl
- createdAt
- updatedAt

### Capture

- id
- projectId
- name
- sourceType: `url` oder `upload`
- sourceUrl
- viewport
- device
- theme
- locale
- imageUrl
- createdAt

### Template

- id
- name
- targetPlatform
- width
- height
- deviceFrame
- layout
- createdAt

### Asset

- id
- projectId
- captureId
- templateId
- title
- subtitle
- locale
- outputUrl
- format
- createdAt

## Admin- oder interner Modus

Für ein erstes internes Tool reicht:

- `/studio`
- lokal oder preview-only
- optional Passwortschutz über einfache Env-Variable

Später als SaaS:

- Login
- Projekte
- gespeicherte Assets
- Export-Historie
- Teamfunktionen

## Monetarisierung

Mögliche Modelle:

### Free

- 1 Projekt
- wenige Exports
- Wasserzeichen oder begrenzte Auflösung

### Pro

- unbegrenzte Exports
- höhere Auflösung
- ZIP Export
- mehr Plattform-Presets
- gespeicherte Projekte

### Studio

- mehrere Projekte
- Teamzugriff
- Batch-Regeneration
- Videoexport
- CI/GitHub Action

## Mögliche Preise

- Free
- Pro: 9 bis 19 Euro pro Monat
- Studio: 29 bis 49 Euro pro Monat
- alternativ Pay-per-App: einmalig 19 bis 39 Euro pro App

Für Indie-Developer könnte ein Pay-per-App-Modell besonders attraktiv sein.

## Wettbewerbsumfeld

Es gibt bereits viele Tools in diesem Bereich.

Beispiele:

- Device Shots: https://deviceshots.com/
- mockscreens: https://mockscreens.com/
- AppScreenshotLab: https://appscreenshotlab.com/
- MockStage: https://www.mockstage.in/
- Screenhance: https://screenhance.com/
- Storeshots: https://storeshots.org/

Die Chance liegt nicht darin, einen größeren Editor zu bauen, sondern einen schnelleren und stärker automatisierten Workflow.

## Beobachtung nach Wettbewerbscheck

Einige Tools gehen bereits grob in die richtige Richtung, etwa URL zu Device-Mockup oder Screenshot zu Store-Grafik. Viele wirken aber eher wie kleine Generatoren als wie ein ernsthaftes Launch-Werkzeug.

Die häufigsten Schwächen:

- Sie verlangen fertige Screenshots als Ausgangspunkt.
- URL-Capture ist oft nur ein einzelnes Bild, kein gespeicherter Workflow.
- Die Ausgabe ist eher Mockup als vollständiges Store-Paket.
- Es fehlen Szenen, Varianten und wiederholbare Capture-Konfigurationen.
- Es gibt selten einen guten Flow für Desktop-App, Mobile-App, Browser-Extension und Social Assets zusammen.
- Die Designs wirken oft generisch oder brauchen zu viel manuelle Nacharbeit.
- Mehrsprachigkeit ist meist nicht als Kernworkflow gedacht.
- Nach einer UI-Änderung muss der Nutzer vieles erneut manuell zusammenbauen.

Das ist der eigentliche Ansatzpunkt:

> Nicht das hübscheste Einzelmockup gewinnen, sondern den schnellsten Weg zu einem vollständigen, konsistenten Asset-Pack.

## Differenzierung

### Live App Capture

Nicht nur Screenshot-Upload, sondern echte App-URL aufnehmen.

Das Produkt sollte sich eher wie ein kleiner Capture-Browser anfühlen:

1. URL eingeben
2. Device oder Viewport wählen
3. App laden
4. in der App zur gewünschten Szene navigieren
5. Capture speichern
6. Template anwenden
7. Store-Pack exportieren

Für den Nutzer ist der entscheidende Moment:

> Ich muss keine Screenshots vorbereiten. Ich öffne meine echte App und mache daraus direkt Launch-Material.

### Developer Workflow

Für Entwickler optimiert, nicht für Designer:

- wenig manuelle Arbeit
- klare Presets
- schnelle Wiederholung
- Export in korrekten Größen

### Store-Pack statt Einzelmockup

Die Hauptaktion sollte nicht "Download image" sein, sondern:

- App Store Pack erstellen
- Google Play Pack erstellen
- Microsoft Store Pack erstellen
- Browser Extension Pack erstellen
- Social Launch Pack erstellen

Jedes Pack enthält mehrere passende Assets mit den richtigen Größen, Dateinamen und Varianten.

### Szenen statt Screenshots

Ein Projekt sollte nicht nur Dateien speichern, sondern semantische Szenen:

- Welcome
- Dashboard
- Hauptfeature
- Sicherheit
- Sync
- Mobile View
- Desktop View
- Settings

Diese Szenen können später neu aufgenommen werden, ohne das komplette Design neu zu bauen.

### Batch-Regeneration

Wenn sich die App-UI ändert:

- Captures neu ausführen
- Templates anwenden
- alle Assets neu exportieren

Das ist besonders wichtig, weil die wiederholbare Aktualisierung langfristig wertvoller ist als der erste Export.

### CI-Potenzial

Später könnte ein Release-Prozess automatisch Marketing-Assets neu bauen.

Beispiel:

```txt
Neue Version veröffentlicht
→ Demo URL öffnen
→ Screenshots erfassen
→ Store Assets generieren
→ ZIP bereitstellen
```

### Bewusst begrenzter Editor

Die UI darf nicht zu einem freien Designprogramm werden. Der Nutzer sollte gute Entscheidungen treffen können, aber nicht jedes Pixel selbst verantworten müssen.

Sinnvolle Kontrollen:

- Template wählen
- Brandfarbe wählen
- Logo an/aus
- Device Frame an/aus
- Light/Dark
- Headline
- Subline
- Screenshot-Zoom
- Screenshot-Position

Nicht sinnvoll für den Start:

- freie Layer-Hierarchie
- beliebige Formen
- komplexe Typografieeinstellungen
- Timeline-Editor
- kompletter Drag-and-drop Canvas

## Besserer MVP-Scope

Der erste echte MVP sollte nicht versuchen, alle Stores perfekt abzudecken.

Ein guter erster Scope:

- URL Capture für öffentliche Apps und Demos
- Screenshot Upload als Fallback
- Desktop und Mobile Viewport
- 4 hochwertige Templates
- Open Graph 1200x630
- Google Play Feature Graphic
- App Store Screenshot Draft
- Microsoft Store Screenshot Draft
- PNG Export
- ZIP Export

Damit lässt sich sehr schnell testen, ob das Produktgefühl stimmt.

Die Frage für den MVP:

> Kann ein Entwickler aus einer öffentlichen Demo-URL in fünf Minuten sichtbar bessere Assets erzeugen als mit MockupSnap, Device Shots oder manuellem Screenshot-Upload?

Wenn die Antwort ja ist, lohnt sich das SaaS.

## First Product Experience

Die erste Nutzung sollte extrem direkt sein:

```txt
Paste your app URL
→ Choose your launch pack
→ Capture 3 screens
→ Add headlines
→ Export
```

Kein leerer Editor als erster Screen. Kein Template-Marketplace als Einstieg. Kein Dashboard, bevor der Nutzer den Wert gesehen hat.

Idealer erster Screen:

- großes URL-Feld
- Plattform-Auswahl
- ein starkes Beispiel rechts
- Button: "Generate first pack"

Nach dem Klick:

- App wird im Capture-Viewport geöffnet
- Nutzer kann scrollen/klicken
- Capture-Button speichert Szene
- Template-Vorschau erscheint sofort

## Qualitätslatte

Damit das Produkt besser wirkt als vorhandene Generatoren, muss es bei diesen Dingen spürbar stärker sein:

- typografische Defaults
- Abstände
- Schatten
- Bildbeschnitt
- Device-Größen
- Store-spezifische Komposition
- responsive Preview
- klare Exportnamen
- konsistente Serien aus mehreren Bildern

Es reicht nicht, technisch URL-Screenshots zu machen. Das Ergebnis muss aussehen, als hätte jemand mit gutem Geschmack eine kleine Launch-Kampagne vorbereitet.

## Risiken

- Markt ist bereits besetzt.
- Device Frames müssen aktuell und hochwertig bleiben.
- Store-Anforderungen können sich ändern.
- Live Capture mit Login-Flows kann komplex werden.
- Videoexport kann technisch aufwendig werden.
- Zu viele Editorfunktionen würden das Produkt verwässern.
- URL-Capture kann an Cookie-Bannern, Bot-Schutz, Ladezeiten, Login oder `X-Frame-Options` scheitern.
- Wenn die Templates mittelmäßig aussehen, wirkt das Produkt sofort wie ein weiterer Generator.
- Wenn der Export nicht exakt die richtigen Größen und Dateinamen liefert, verliert das Tool den "5-Minuten"-Vorteil.

## Technische Stolperstellen

- Public URLs sind einfach, private oder lokale Apps brauchen später einen anderen Ansatz.
- iframe-Einbettung ist für die UI angenehm, aber wegen Cross-Origin-Regeln nicht zuverlässig genug als einziges Capture-System.
- Headless Capture mit Playwright ist robuster für Exporte.
- Login-Flows sollten im MVP vermieden oder nur über einfache Session-Cookies unterstützt werden.
- Store-Anforderungen müssen als versionierte Presets gepflegt werden.
- Für hochwertige Videos sollte Motion bewusst als Preset-System gebaut werden, nicht als Editor.

## Produktprinzipien

- Kein Canva-Klon.
- Keine endlose freie Gestaltung.
- Gute Defaults vor maximaler Kontrolle.
- In fünf Minuten zum Ergebnis.
- Entwicklerfreundlich.
- Store-Formate automatisch richtig.
- Wiederholbarkeit ist wichtiger als einmalige Bastel-Flexibilität.
- Upload ist Fallback, Live Capture ist das langfristige Kernfeature.
- Der Nutzer soll nie mit einer leeren Leinwand anfangen müssen.
- Jede Einstellung muss direkt auf den Export einzahlen.
- Lieber 8 sehr gute Templates als 80 mittelmäßige.
- Die wichtigste UX-Metrik ist Zeit bis zum ersten brauchbaren Asset.

## MVP-Erfolgskriterium

Das erste Ziel ist nicht ein großes SaaS.

Das erste Ziel:

> Kann ClavisPass in unter fünf Minuten sechs professionelle Store- und Social-Assets erzeugen?

Wenn ja, ist die Idee stark genug für ein eigenes Produkt.

Zusätzlicher Proof:

> Kann dasselbe Setup nach einer deutlichen UI-Änderung in unter zwei Minuten neue Assets erzeugen?

Das zweite Kriterium prüft die Wiederholbarkeit und ist wahrscheinlich der wichtigste Produktvorteil.

## Erster interner Prototyp

Für ClavisPass könnte zuerst ein internes Studio entstehen:

- Route: `/studio`
- Projekt fest auf ClavisPass vorkonfiguriert
- Demo-URL: `https://clavispass.github.io/ClavisPass/`
- Brandfarben: `#787ff6` und `#69c4ff`
- Exportgrößen:
  - App Store
  - Google Play
  - Microsoft Store
  - Open Graph 1200x630
- Modi:
  - Desktop
  - Mobile
  - Tablet
- Export:
  - PNG einzeln
  - ZIP später

## Späterer SaaS-Start mit SaaS-Starter

Wenn daraus ein eigenes Arratel-Produkt wird, kann ein neues SaaS-Starter-Projekt mit diesen Kernbereichen starten:

- Landingpage
- Auth
- Dashboard
- Projektverwaltung
- Capture-Studio
- Export-Historie
- Billing
- Legal Pages

Der Starter sollte zuerst nur die MVP-Funktion bauen:

> Projekt anlegen, Screenshot oder URL hinzufügen, Store-Preset wählen, PNG exportieren.

## Beispiel-Briefing für ein neues Projekt

```md
Wir bauen ein fokussiertes SaaS für Entwickler, das aus App-Screenshots oder einer Live-App-URL professionelle Store- und Social-Marketingbilder generiert.

Das Produkt soll kein Canva-Klon werden. Der Kernworkflow muss in fünf Minuten funktionieren:

1. Projekt anlegen
2. App-URL oder Screenshot hinzufügen
3. Plattform wählen
4. kurze Headlines ergänzen
5. fertige PNGs in den korrekten Store-Formaten exportieren

Zielgruppen sind Indie-Developer, kleine SaaS-Teams, Mobile-App-Entwickler und Entwickler von Desktop-Apps oder Browser-Extensions.

Der wichtigste Unterschied zu bestehenden Mockup-Tools ist Live Capture und Batch-Regeneration: Wenn sich die App-UI ändert, sollen alle Marketing-Assets schnell neu erzeugt werden können.

Der MVP unterstützt App Store, Google Play, Microsoft Store und Social 1200x630. Er bietet Desktop-, iPhone- und Android-Presets, gute Standardtemplates, Logo/Farbkonfiguration und PNG-Export.
```
