import { defaultLocale, type Locale } from './config';
import { siteConfig } from '../site-config';

const messages = {
  de: {
    metadata: {
      title: siteConfig.product.metadata.title.de,
      description: siteConfig.product.metadata.description.de
    },
    common: {
      home: 'Start',
      pricing: 'Preise',
      faq: 'FAQ',
      links: 'Links',
      dashboard: 'Dashboard',
      studio: 'Studio',
      features: 'Features',
      legal: 'Rechtliches',
      company: siteConfig.brand.name,
      allRightsReserved: 'Alle Rechte vorbehalten.',
      backToHome: 'Zur Startseite'
    },
    home: {
      heroTitle: 'LaunchFrames',
      heroAccent: 'macht App-Screenshots launch-ready',
      heroDescription:
        'Erzeuge professionelle Store- und Social-Assets aus deiner echten App, einer Demo-URL oder hochgeladenen Screenshots.',
      heroEyebrow: 'Asset Studio für Entwickler',
      deployCta: 'Erstes Pack erstellen',
      productEyebrow: 'Launch Studio',
      productTitle: 'Aus App-URL oder Screenshot wird ein fertiges Asset-Pack.',
      productDescription:
        'Der Einstieg bleibt geführt: Quelle hinzufügen, Plattform wählen, Headlines ergänzen und PNGs in den richtigen Formaten exportieren.',
      productPrimaryCta: 'Asset-Pack starten',
      productSecondaryCta: 'Preise ansehen',
      productPreviewTitle: 'Launch-Pack Vorschau',
      productPreviewBody:
        'Ein schneller Workflow für App Store, Google Play, Microsoft Store und Social Cards mit guten Defaults statt leerer Leinwand.',
      productPreviewList: [
        'URL-Capture oder Screenshot-Upload',
        'Store-Presets mit passenden Maßen',
        'Export als einzelnes PNG oder Pack'
      ],
      featureTitle1: 'Live Capture',
      featureBody1:
        'Nimm öffentliche Demo-URLs in festen Viewports auf und verwandle echte App-Zustände in Marketingbilder.',
      featureTitle2: 'Store-Presets',
      featureBody2:
        'Erzeuge Formate für App Stores, Feature Graphics, Open Graph Cards und Social Launches ohne Maßtabellen.',
      featureTitle3: 'Wiederholbare Packs',
      featureBody3:
        'Speichere Szenen und regeneriere konsistente Assets, wenn sich deine App-Oberfläche ändert.',
      pricingBadge: 'Einfache Preise',
      pricingTitle: 'Kostenlos testen. Upgraden, wenn LaunchFrames Zeit spart.',
      pricingDescription:
        'Ein klarer Free-Plan für erste Packs und ein Pro-Upgrade für wiederkehrende Launches.',
      freeLabel: 'Free',
      freeTitle: 'Erstes Pack bauen',
      freeTag: 'Kein Risiko',
      freePrice: 'EUR 0',
      month: '/ Monat',
      freeDescription:
        'Ideal, um aus einer Demo-URL oder wenigen Screenshots ein erstes Launch-Pack zu erzeugen.',
      freeFeatures: [
        'Ein Projekt',
        'Screenshot-Upload und URL-Draft',
        'Basis-Presets für Store und Social',
        'PNG-Export'
      ],
      freeCta: 'Kostenlos starten',
      proLabel: 'Pro',
      proTitle: 'Für wiederkehrende Launches',
      proTag: 'Beliebteste Wahl',
      proPrice: 'EUR 9',
      proDescription:
        'Für Entwickler und kleine Teams, die Assets regelmäßig aktualisieren und konsistente Packs exportieren.',
      proFeatures: [
        'Alles aus Free',
        'Mehr Projekte und Exports',
        'ZIP-Packs mit klaren Dateinamen',
        'Gespeicherte Szenen und Templates'
      ],
      proCta: 'Zu Pro wechseln',
      fullPricingCta: 'Alle Preise',
      footerDescription:
        'LaunchFrames hilft Entwicklern, aus echten App-Oberflächen schnell professionelle Store- und Social-Assets zu erzeugen.',
      legalLinks: {
        imprint: 'Impressum',
        privacy: 'Datenschutz',
        terms: 'AGB'
      }
    },
    links: {
      title: 'Alle Links',
      description:
        'Die offiziellen Profile, Projekte und Kontaktwege von Arratel an einem Ort.',
      website: 'Website',
      contact: 'Kontakt'
    },
    studio: {
      title: 'Erstes Launch-Pack',
      sourceEyebrow: 'MVP Studio',
      appUrl: 'App-URL',
      captureUrl: 'URL als Screenshot aufnehmen',
      capturing: 'Nehme Screenshot auf...',
      captureError: 'Die URL konnte nicht aufgenommen werden. Nutze den Upload-Fallback oder prüfe, ob die Seite öffentlich erreichbar ist.',
      screenshot: 'Screenshot-Fallback',
      uploadScreenshot: 'Screenshot hochladen',
      replaceScreenshot: 'Screenshot ersetzen',
      showLivePreview: 'Zur Live-Vorschau zurück',
      brandColor: 'Brandfarbe',
      accentColor: 'Akzentfarbe',
      frame: 'Frame',
      frameSize: 'Frame-Größe',
      frameX: 'Frame X',
      frameY: 'Frame Y',
      resetFrame: 'Frame zurücksetzen',
      desktopFrame: 'Desktop',
      phoneFrame: 'Handy',
      canvas: 'App-Ausschnitt',
      zoom: 'Zoom',
      editorZoom: 'Editor-Zoom',
      undo: 'Rückgängig',
      redo: 'Wiederholen',
      fit: 'Fit',
      fitToView: 'In Ansicht einpassen',
      actualSize: '100% anzeigen',
      centerView: 'Ansicht zentrieren',
      lockAspectRatio: 'Seitenverhältnis sperren',
      unlockAspectRatio: 'Seitenverhältnis freigeben',
      showGuides: 'Hilfslinien anzeigen',
      hideGuides: 'Hilfslinien ausblenden',
      enableSnap: 'Einrasten aktivieren',
      disableSnap: 'Einrasten deaktivieren',
      showTextLayer: 'Text anzeigen',
      hideTextLayer: 'Text ausblenden',
      showAppLayer: 'App anzeigen',
      hideAppLayer: 'App ausblenden',
      showBackgroundLayer: 'Hintergrund anzeigen',
      hideBackgroundLayer: 'Hintergrund ausblenden',
      textLayer: 'Textbereich',
      backgroundLayer: 'Hintergrund',
      visible: 'Sichtbar',
      hidden: 'Aus',
      textScale: 'Textgröße',
      textAlign: 'Ausrichtung',
      textAlignAuto: 'Automatisch',
      textAlignLeft: 'Links',
      textAlignCenter: 'Zentriert',
      textAlignRight: 'Rechts',
      headlineWeight: 'Headline-Gewicht',
      textWeightMedium: 'Medium',
      textWeightSemibold: 'Semibold',
      textWeightBold: 'Bold',
      textWeightHeavy: 'Heavy',
      textSpacing: 'Textabstand',
      textOffsetX: 'Text X',
      textOffsetY: 'Text Y',
      backgroundComposition: 'Glow-Position',
      backgroundCompositionDiagonal: 'Diagonal',
      backgroundCompositionTop: 'Oben',
      backgroundCompositionBottom: 'Unten',
      backgroundCompositionSides: 'Seiten',
      backgroundIntensity: 'Glow-Stärke',
      backgroundBlur: 'Blur-Größe',
      viewportZoom: 'Viewport-Zoom',
      featureZoom: 'Feature-Zoom',
      featureX: 'Feature X',
      featureY: 'Feature Y',
      borderRadius: 'Border-Radius',
      resetCanvas: 'App-Ansicht zurücksetzen',
      horizontal: 'Horizontal',
      vertical: 'Vertikal',
      fitInFrame: 'In Frame einpassen',
      topLeft: 'Oben links',
      center: 'Mitte',
      closeUp: 'Nah',
      exportScale: 'Preset-Format',
      scenes: 'Szenen',
      sceneEditor: 'Texte anpassen',
      headline: 'Headline',
      subline: 'Subline',
      output: 'Aktueller Export',
      exportReady: 'Export wurde vorbereitet.',
      exportError: 'Der Export ist fehlgeschlagen. Prüfe, ob die URL öffentlich erreichbar ist.',
      exporting: 'Export wird erstellt...',
      downloadPng: 'Export laden',
      exportDialogTitle: 'Export-Vorschau',
      closeExportDialog: 'Export schließen',
      exportFileType: 'Dateityp',
      exportFileName: 'Dateiname',
      jpegQuality: 'JPEG-Qualität',
      packs: {
        social: 'Social Card',
        appStore: 'App Store',
        googlePlay: 'Google Play',
        microsoft: 'Microsoft Store'
      }
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Fragen zu LaunchFrames.',
      intro:
        'Kurz und konkret: Was LaunchFrames kann, wie der Export funktioniert und worauf du bei Store-Assets achten solltest.',
      badgePrimary: 'Launch-Assets',
      badgeSecondary: 'Export und Datenschutz',
      sections: [
        {
          title: 'Produkt und Workflow',
          items: [
            {
              question: 'Was ist LaunchFrames?',
              answer:
                'LaunchFrames ist ein Studio für App-Screenshots und Launch-Assets. Du gibst eine App-URL ein, platzierst die Oberfläche auf einem Canvas, ergänzt Headline und Subline und exportierst fertige Bilder für Stores, Social Media oder Landingpages.'
            },
            {
              question: 'Für wen ist das gedacht?',
              answer:
                'Vor allem für Entwickler, Indie Hacker und kleine Produktteams, die schnell hochwertige Assets aus echten App-Screens erstellen möchten, ohne jedes Format manuell in einem Design-Tool nachzubauen.'
            },
            {
              question: 'Kann ich eine echte Website oder App als Quelle verwenden?',
              answer:
                'Ja. Öffentliche URLs können als Vorschau geladen und beim Export als Screenshot aufgenommen werden. Lokale oder geschützte Apps funktionieren später sinnvoll über Uploads oder eine eigene Capture-Integration.'
            }
          ]
        },
        {
          title: 'Canvas und Gestaltung',
          items: [
            {
              question: 'Warum gibt es einen Canvas statt nur einen Screenshot-Download?',
              answer:
                'Der Canvas bildet das spätere Exportformat direkt ab. So siehst du schon vor dem Download, wie viel Platz Text, Hintergrund und App-Fenster im fertigen Bild einnehmen.'
            },
            {
              question: 'Was ist der Unterschied zwischen Viewport-Zoom und Feature-Zoom?',
              answer:
                'Viewport-Zoom verändert, wie groß die geladene App im simulierten Browser gerendert wird. Feature-Zoom zoomt danach in die App hinein, ohne das App-Fenster selbst zu verändern. So kannst du Details hervorheben, ohne das Layout des Assets zu zerstören.'
            },
            {
              question: 'Kann Text über der App landen?',
              answer:
                'Der Textbereich weicht automatisch in freie Bereiche neben, über oder unter der App aus. Zusätzlich kannst du Textgröße, Abstand, Ausrichtung und leichte Offsets steuern, ohne dass der Text einfach hinter dem App-Fenster verschwindet.'
            }
          ]
        },
        {
          title: 'Export und Plattformen',
          items: [
            {
              question: 'Welche Exportformate gibt es?',
              answer:
                'Der Export unterstützt PNG und JPEG. PNG ist der Standard, weil UI, Text und Linien verlustfrei bleiben. JPEG ist sinnvoll, wenn Dateigröße wichtiger ist und keine Transparenz gebraucht wird.'
            },
            {
              question: 'Bleiben EXIF-, C2PA- oder Upload-Metadaten im Export?',
              answer:
                'Nein. Das finale Bild wird neu gerendert. Dadurch werden Metadaten aus hochgeladenen oder gecaptureten Bildern nicht in die exportierte Datei übernommen.'
            },
            {
              question: 'Prüft LaunchFrames schon alle Store-Regeln?',
              answer:
                'Noch nicht vollständig. Die wichtigsten Preset-Größen sind bereits angelegt. Validierungen wie maximale Dateigröße, erlaubte Seitenverhältnisse oder plattformspezifische Hinweise sollen später ergänzt werden, wenn die Store-Anforderungen final gesammelt sind.'
            }
          ]
        },
        {
          title: 'Status und Datenschutz',
          items: [
            {
              question: 'Ist LaunchFrames schon ein fertiges Produkt?',
              answer:
                'LaunchFrames ist aktuell ein MVP. Der Fokus liegt zuerst auf einem starken Studio-Erlebnis: echte Vorschau, direkte Anpassung, saubere Exporte und gute Defaults.'
            },
            {
              question: 'Werden meine App-Screens dauerhaft gespeichert?',
              answer:
                'Im aktuellen MVP ist der Workflow auf direkte Vorschau und Export ausgelegt. Wenn später Projekte, Uploads oder Team-Funktionen dauerhaft gespeichert werden, sollte das klar in Produkt, Datenschutz und Account-Einstellungen sichtbar sein.'
            },
            {
              question: 'Welche Rolle spielt Arratel?',
              answer:
                'Arratel ist die Umbrella-Marke hinter LaunchFrames. LaunchFrames ist der aktuelle Produktname für dieses Screenshot- und Launch-Asset-Studio.'
            }
          ]
        }
      ],
      supportTitle: 'Noch etwas unklar?',
      supportBody:
        'Wenn beim Erstellen deines ersten Launch-Assets etwas fehlt, ist das wahrscheinlich ein guter Kandidat für die nächste Produktiteration.',
      supportPrimary: 'Studio öffnen',
      supportSecondary: 'Zur Startseite'
    },
    auth: {
      signInTitle: 'Melde dich in deinem Konto an',
      signUpTitle: 'Erstelle dein Konto',
      email: 'E-Mail',
      emailPlaceholder: 'E-Mail eingeben',
      password: 'Passwort',
      passwordPlaceholder: 'Passwort eingeben',
      loading: 'Lädt...',
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      newHere: 'Neu auf der Plattform?',
      existingAccount: 'Du hast bereits ein Konto?',
      createAccount: 'Konto erstellen',
      signInExisting: 'Mit bestehendem Konto anmelden'
    },
    header: {
      localeLabel: 'Sprache',
      navigation: 'Navigation',
      signIn: 'Anmelden',
      signOut: 'Abmelden',
      signUp: 'Registrieren',
      openMenu: 'Menü öffnen',
      closeMenu: 'Menü schließen'
    },
    pricing: {
      mockBillingActive:
        'Mock Billing ist aktiv. Checkout und Subscription-Status laufen lokal ohne Stripe-Account.',
      withTrial: 'mit {days} Tagen kostenloser Testphase',
      perUser: 'pro Nutzer / {interval}',
      cta: 'Jetzt starten',
      currentPlan: 'Aktueller Plan',
      featuresBase: [
        'Unbegrenzte Nutzung',
        'Unbegrenzte Workspace-Mitglieder',
        'E-Mail-Support'
      ],
      featuresPlus: [
        'Alles aus Base',
        'Früher Zugriff auf neue Features',
        '24/7 Support plus Slack-Zugang'
      ]
    },
    dashboard: {
      settings: 'Einstellungen',
      nav: {
        team: 'Team',
        general: 'Allgemein',
        activity: 'Aktivität',
        security: 'Sicherheit'
      },
      teamSettings: 'Team-Einstellungen',
      teamSubscription: 'Team Subscription',
      currentPlan: 'Aktueller Plan',
      billedMonthly: 'Monatliche Abrechnung',
      trialPeriod: 'Testphase',
      noActiveSubscription: 'Keine aktive Subscription',
      manageSubscription: 'Subscription verwalten',
      teamMembers: 'Team-Mitglieder',
      noTeamMembers: 'Noch keine Team-Mitglieder.',
      removing: 'Entferne...',
      remove: 'Entfernen',
      inviteTeamMember: 'Team-Mitglied einladen',
      role: 'Rolle',
      member: 'Mitglied',
      owner: 'Owner',
      inviting: 'Lade ein...',
      inviteMember: 'Mitglied einladen',
      ownerOnly:
        'Du musst Team-Owner sein, um neue Mitglieder einzuladen.',
      generalSettings: 'Allgemeine Einstellungen',
      accountInformation: 'Kontoinformationen',
      name: 'Name',
      namePlaceholder: 'Deinen Namen eingeben',
      saveChanges: 'Änderungen speichern',
      saving: 'Speichert...',
      activityLog: 'Aktivitätsprotokoll',
      recentActivity: 'Letzte Aktivität',
      noActivityYet: 'Noch keine Aktivität',
      noActivityDescription:
        'Aktionen wie Login oder Kontoänderungen erscheinen später hier.',
      relativeTime: {
        justNow: 'gerade eben',
        minutesAgo: 'vor {count} Minuten',
        hoursAgo: 'vor {count} Stunden',
        daysAgo: 'vor {count} Tagen'
      },
      actions: {
        signUp: 'Du hast dich registriert',
        signIn: 'Du hast dich angemeldet',
        signOut: 'Du hast dich abgemeldet',
        updatePassword: 'Du hast dein Passwort geändert',
        deleteAccount: 'Du hast dein Konto gelöscht',
        updateAccount: 'Du hast dein Konto aktualisiert',
        createTeam: 'Du hast ein neues Team erstellt',
        removeTeamMember: 'Du hast ein Team-Mitglied entfernt',
        inviteTeamMember: 'Du hast ein Team-Mitglied eingeladen',
        acceptInvitation: 'Du hast eine Einladung angenommen',
        unknown: 'Unbekannte Aktion'
      },
      securitySettings: 'Sicherheitseinstellungen',
      currentPassword: 'Aktuelles Passwort',
      newPassword: 'Neues Passwort',
      confirmNewPassword: 'Neues Passwort bestätigen',
      updatePassword: 'Passwort aktualisieren',
      updating: 'Aktualisiert...',
      deleteAccount: 'Konto löschen',
      deleteWarning:
        'Das Löschen des Kontos kann nicht rückgängig gemacht werden. Bitte vorsichtig fortfahren.',
      confirmPassword: 'Passwort bestätigen',
      deleting: 'Löscht...',
      billingMockControl: 'Billing Mock Control',
      billingMockDescription:
        'Diese Seite ersetzt im Dev-Modus das Stripe Customer Portal. Hier steuerst du Plan und Status direkt.',
      currentTeamState: 'Aktueller Team-Status',
      plan: 'Plan',
      status: 'Status',
      productId: 'Produkt-ID',
      subscriptionId: 'Subscription-ID',
      applyState: 'Status setzen'
    },
    notFound: {
      title: 'Seite nicht gefunden',
      description:
        'Die gesuchte Seite wurde entfernt, umbenannt oder ist temporär nicht verfügbar.'
    }
  },
  en: {
    metadata: {
      title: siteConfig.product.metadata.title.en,
      description: siteConfig.product.metadata.description.en
    },
    common: {
      home: 'Home',
      pricing: 'Pricing',
      faq: 'FAQ',
      links: 'Links',
      dashboard: 'Dashboard',
      studio: 'Studio',
      features: 'Features',
      legal: 'Legal',
      company: siteConfig.brand.name,
      allRightsReserved: 'All rights reserved.',
      backToHome: 'Back to home'
    },
    home: {
      heroTitle: 'LaunchFrames',
      heroAccent: 'turns app screenshots into launch assets',
      heroDescription:
        'Generate polished store and social assets from your real app, a demo URL, or uploaded screenshots.',
      heroEyebrow: 'Asset studio for developers',
      deployCta: 'Create first pack',
      productEyebrow: 'Launch Studio',
      productTitle: 'Turn an app URL or screenshot into a finished asset pack.',
      productDescription:
        'The workflow stays guided: add a source, choose a platform, write short headlines, and export PNGs in the right formats.',
      productPrimaryCta: 'Start asset pack',
      productSecondaryCta: 'View pricing',
      productPreviewTitle: 'Launch pack preview',
      productPreviewBody:
        'A fast path for App Store, Google Play, Microsoft Store, and social cards with strong defaults instead of a blank canvas.',
      productPreviewList: [
        'URL capture or screenshot upload',
        'Store presets with correct dimensions',
        'Export as one PNG or a full pack'
      ],
      featureTitle1: 'Live Capture',
      featureBody1:
        'Capture public demo URLs in fixed viewports and turn real app states into marketing images.',
      featureTitle2: 'Store Presets',
      featureBody2:
        'Create App Store screenshots, feature graphics, Open Graph cards, and social launch assets without dimension tables.',
      featureTitle3: 'Repeatable Packs',
      featureBody3:
        'Save scenes and regenerate consistent assets whenever your app UI changes.',
      pricingBadge: 'Simple pricing',
      pricingTitle: 'Start free. Upgrade when LaunchFrames saves real time.',
      pricingDescription:
        'A clear free plan for first packs and a Pro upgrade for recurring launches.',
      freeLabel: 'Free',
      freeTitle: 'Build first pack',
      freeTag: 'No risk',
      freePrice: 'EUR 0',
      month: '/ month',
      freeDescription:
        'Perfect for turning a demo URL or a few screenshots into a first launch pack.',
      freeFeatures: [
        'One project',
        'Screenshot upload and URL draft',
        'Base presets for store and social',
        'PNG export'
      ],
      freeCta: 'Start for free',
      proLabel: 'Pro',
      proTitle: 'Built for recurring launches',
      proTag: 'Most popular',
      proPrice: 'EUR 9',
      proDescription:
        'For developers and small teams that update assets regularly and export consistent packs.',
      proFeatures: [
        'Everything in Free',
        'More projects and exports',
        'ZIP packs with clean filenames',
        'Saved scenes and templates'
      ],
      proCta: 'Go Pro',
      fullPricingCta: 'Full pricing',
      footerDescription:
        'LaunchFrames helps developers turn real app screens into polished store and social assets quickly.',
      legalLinks: {
        imprint: 'Imprint',
        privacy: 'Privacy Policy',
        terms: 'Terms'
      }
    },
    links: {
      title: 'All links',
      description:
        'The official profiles, projects, and contact paths for Arratel in one place.',
      website: 'Website',
      contact: 'Contact'
    },
    studio: {
      title: 'First launch pack',
      sourceEyebrow: 'MVP Studio',
      appUrl: 'App URL',
      captureUrl: 'Capture URL as screenshot',
      capturing: 'Capturing screenshot...',
      captureError: 'The URL could not be captured. Use the upload fallback or check that the page is publicly reachable.',
      screenshot: 'Screenshot fallback',
      uploadScreenshot: 'Upload screenshot',
      replaceScreenshot: 'Replace screenshot',
      showLivePreview: 'Return to live preview',
      brandColor: 'Brand color',
      accentColor: 'Accent color',
      frame: 'Frame',
      frameSize: 'Frame size',
      frameX: 'Frame X',
      frameY: 'Frame Y',
      resetFrame: 'Reset frame',
      desktopFrame: 'Desktop',
      phoneFrame: 'Phone',
      canvas: 'App crop',
      zoom: 'Zoom',
      editorZoom: 'Editor zoom',
      undo: 'Undo',
      redo: 'Redo',
      fit: 'Fit',
      fitToView: 'Fit to view',
      actualSize: 'Show 100%',
      centerView: 'Center view',
      lockAspectRatio: 'Lock aspect ratio',
      unlockAspectRatio: 'Unlock aspect ratio',
      showGuides: 'Show guides',
      hideGuides: 'Hide guides',
      enableSnap: 'Enable snap',
      disableSnap: 'Disable snap',
      showTextLayer: 'Show text',
      hideTextLayer: 'Hide text',
      showAppLayer: 'Show app',
      hideAppLayer: 'Hide app',
      showBackgroundLayer: 'Show background',
      hideBackgroundLayer: 'Hide background',
      textLayer: 'Text area',
      backgroundLayer: 'Background',
      visible: 'Visible',
      hidden: 'Off',
      textScale: 'Text size',
      textAlign: 'Alignment',
      textAlignAuto: 'Automatic',
      textAlignLeft: 'Left',
      textAlignCenter: 'Center',
      textAlignRight: 'Right',
      headlineWeight: 'Headline weight',
      textWeightMedium: 'Medium',
      textWeightSemibold: 'Semibold',
      textWeightBold: 'Bold',
      textWeightHeavy: 'Heavy',
      textSpacing: 'Text spacing',
      textOffsetX: 'Text X',
      textOffsetY: 'Text Y',
      backgroundComposition: 'Glow position',
      backgroundCompositionDiagonal: 'Diagonal',
      backgroundCompositionTop: 'Top',
      backgroundCompositionBottom: 'Bottom',
      backgroundCompositionSides: 'Sides',
      backgroundIntensity: 'Glow intensity',
      backgroundBlur: 'Blur size',
      viewportZoom: 'Viewport zoom',
      featureZoom: 'Feature zoom',
      featureX: 'Feature X',
      featureY: 'Feature Y',
      borderRadius: 'Border radius',
      resetCanvas: 'Reset app view',
      horizontal: 'Horizontal',
      vertical: 'Vertical',
      fitInFrame: 'Fit in frame',
      topLeft: 'Top left',
      center: 'Center',
      closeUp: 'Close',
      exportScale: 'Preset format',
      scenes: 'Scenes',
      sceneEditor: 'Edit copy',
      headline: 'Headline',
      subline: 'Subline',
      output: 'Current export',
      exportReady: 'Export is ready.',
      exportError: 'Export failed. Check that the URL is publicly reachable.',
      exporting: 'Creating export...',
      downloadPng: 'Download export',
      exportDialogTitle: 'Export preview',
      closeExportDialog: 'Close export',
      exportFileType: 'File type',
      exportFileName: 'File name',
      jpegQuality: 'JPEG quality',
      packs: {
        social: 'Social Card',
        appStore: 'App Store',
        googlePlay: 'Google Play',
        microsoft: 'Microsoft Store'
      }
    },
    faq: {
      eyebrow: 'Frequently asked questions',
      title: 'Answers to the questions that matter before getting started.',
      intro:
        'Short, clear, and without filler. This page covers the points people usually want to understand before signing up, testing the product, or upgrading.',
      badgePrimary: 'Fast answers',
      badgeSecondary: 'No support ticket needed',
      sections: [
        {
          title: 'Product and access',
          items: [
            {
              question: 'Can I try the product before paying?',
              answer:
                'Yes. The onboarding path is intentionally lightweight so you can evaluate the product in a real workflow before an upgrade becomes relevant.'
            },
            {
              question: 'Do I need a team or multiple users right away?',
              answer:
                'No. You can start solo and invite more people later once your workflow is stable or collaboration actually matters.'
            },
            {
              question: 'Can I upgrade to a paid plan later?',
              answer:
                'Yes. The upgrade path is designed to stay simple so you only pay once usage becomes regular or you need higher limits.'
            }
          ]
        },
        {
          title: 'Billing and privacy',
          items: [
            {
              question: 'What happens to my data if I cancel?',
              answer:
                'Access and data handling should stay predictable. The legal details are covered in the privacy policy and terms linked in the footer.'
            },
            {
              question: 'Will I be charged if I barely use the product?',
              answer:
                'The product is structured around a clear free-to-upgrade path so costs should only appear once the value and usage justify them.'
            },
            {
              question: 'Is Stripe required for payments?',
              answer:
                'For real billing, yes. During development, billing can still run in mock mode so product work is not blocked by early Stripe setup.'
            }
          ]
        },
        {
          title: 'Technical setup',
          items: [
            {
              question: 'Do I need my own database in production?',
              answer:
                'Yes. The app runs separately from the database. In production you connect an external Postgres database, while locally you can use Docker or a hosted test database.'
            },
            {
              question: 'Is this better suited for MVPs or real customers?',
              answer:
                'Both. The setup is lean enough for fast validation, but structured enough to keep evolving into a real SaaS used by actual customers.'
            },
            {
              question: 'How quickly can I get into the dashboard?',
              answer:
                'As soon as your account exists, you can move straight into the protected area. Navigation and data loading are designed to keep that path smooth.'
            }
          ]
        }
      ],
      supportTitle: 'Still missing an answer?',
      supportBody:
        'If something important is still unclear before sign-up or upgrade, it should probably live on this page. That is usually a content gap, not a user problem.',
      supportPrimary: 'View pricing',
      supportSecondary: 'Back home'
    },
    auth: {
      signInTitle: 'Sign in to your account',
      signUpTitle: 'Create your account',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      loading: 'Loading...',
      signIn: 'Sign in',
      signUp: 'Sign up',
      newHere: 'New to our platform?',
      existingAccount: 'Already have an account?',
      createAccount: 'Create an account',
      signInExisting: 'Sign in to existing account'
    },
    header: {
      localeLabel: 'Language',
      navigation: 'Navigation',
      signIn: 'Sign in',
      signOut: 'Sign out',
      signUp: 'Sign up',
      openMenu: 'Open menu',
      closeMenu: 'Close menu'
    },
    pricing: {
      mockBillingActive:
        'Mock billing is active. Checkout and subscription state run locally without a Stripe account.',
      withTrial: 'with {days} day free trial',
      perUser: 'per user / {interval}',
      cta: 'Get started',
      currentPlan: 'Current plan',
      featuresBase: [
        'Unlimited usage',
        'Unlimited workspace members',
        'Email support'
      ],
      featuresPlus: [
        'Everything in Base',
        'Early access to new features',
        '24/7 support plus Slack access'
      ]
    },
    dashboard: {
      settings: 'Settings',
      nav: {
        team: 'Team',
        general: 'General',
        activity: 'Activity',
        security: 'Security'
      },
      teamSettings: 'Team Settings',
      teamSubscription: 'Team Subscription',
      currentPlan: 'Current plan',
      billedMonthly: 'Billed monthly',
      trialPeriod: 'Trial period',
      noActiveSubscription: 'No active subscription',
      manageSubscription: 'Manage subscription',
      teamMembers: 'Team Members',
      noTeamMembers: 'No team members yet.',
      removing: 'Removing...',
      remove: 'Remove',
      inviteTeamMember: 'Invite Team Member',
      role: 'Role',
      member: 'Member',
      owner: 'Owner',
      inviting: 'Inviting...',
      inviteMember: 'Invite Member',
      ownerOnly: 'You must be a team owner to invite new members.',
      generalSettings: 'General Settings',
      accountInformation: 'Account Information',
      name: 'Name',
      namePlaceholder: 'Enter your name',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      activityLog: 'Activity Log',
      recentActivity: 'Recent Activity',
      noActivityYet: 'No activity yet',
      noActivityDescription:
        "When you perform actions like signing in or updating your account, they'll appear here.",
      relativeTime: {
        justNow: 'just now',
        minutesAgo: '{count} minutes ago',
        hoursAgo: '{count} hours ago',
        daysAgo: '{count} days ago'
      },
      actions: {
        signUp: 'You signed up',
        signIn: 'You signed in',
        signOut: 'You signed out',
        updatePassword: 'You changed your password',
        deleteAccount: 'You deleted your account',
        updateAccount: 'You updated your account',
        createTeam: 'You created a new team',
        removeTeamMember: 'You removed a team member',
        inviteTeamMember: 'You invited a team member',
        acceptInvitation: 'You accepted an invitation',
        unknown: 'Unknown action occurred'
      },
      securitySettings: 'Security Settings',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      updatePassword: 'Update Password',
      updating: 'Updating...',
      deleteAccount: 'Delete Account',
      deleteWarning:
        'Account deletion is not reversible. Please proceed with caution.',
      confirmPassword: 'Confirm Password',
      deleting: 'Deleting...',
      billingMockControl: 'Billing Mock Control',
      billingMockDescription:
        'This page replaces the Stripe Customer Portal in development mode. Control the visible plan and status directly here.',
      currentTeamState: 'Current Team State',
      plan: 'Plan',
      status: 'Status',
      productId: 'Product ID',
      subscriptionId: 'Subscription ID',
      applyState: 'Apply State'
    },
    notFound: {
      title: 'Page Not Found',
      description:
        'The page you are looking for might have been removed, renamed, or is temporarily unavailable.'
    }
  }
} as const;

export function getMessages(locale: Locale = defaultLocale) {
  return messages[locale] ?? messages[defaultLocale];
}
