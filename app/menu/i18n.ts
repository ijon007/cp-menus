export type Language = "en" | "sq" | "it";

export interface TranslationMap {
  en: string;
  sq: string;
  it: string;
}

export function getTranslated(
  translations: TranslationMap | undefined,
  language: Language,
  fallback: string
): string {
  if (!translations) return fallback;
  const text = translations[language];
  return text?.trim() ? text : fallback;
}

export interface MenuTranslations {
  menuTitle: string;
  signInPrompt: string;
  waitingForApprovalTitle: string;
  waitingForApprovalBodyPending: string;
  waitingForApprovalBodyRejected: string;
  waitingForApprovalSupportHint: string;
  giveUsAReview: string;
  followUs: string;
  googleLabel: string;
  tripAdvisorLabel: string;
  instagramLabel: string;
  facebookLabel: string;
  languageSelectorLabel: string;
  languageEnglish: string;
  languageAlbanian: string;
  languageItalian: string;
  loadingMenu: string;
  noMenuItems: string;
  callWaiterTooltip: string;
  callWaiterTooltipCalled: string;
  callWaiterTooltipWait: string;
  callWaiterTooltipNoTable: string;
  waiterCallLimitReached: string;
  waiterCalledSuccess: string;
  waiterCallError: string;
}

const textTranslations: Record<
  Language,
  Record<string, string>
> = {
  en: {},
  sq: {
    // Section titles
    Food: "Ushqim",
    FOOD: "USHQIM",
    Drinks: "Pije",
    JUICES: "LËNGJE",
    Juices: "Lëngje",
    Coffee: "Kafe",
    COFFEE: "KAFE",
    Desserts: "Ëmbëlsira",
    DESSERTS: "ËMBËLSIRA",
    // Example item names/descriptions for Cafea
    "Berry Bliss": "Berry Bliss",
    "Greek yogurt, bananas, nuts, dried fruits, honey":
      "Kos grek, banane, kajsi, arra, fruta të thata, mjaltë",
  },
  it: {
    Food: "Cibo",
    FOOD: "CIBO",
    Drinks: "Bevande",
    JUICES: "SUCCHI",
    Juices: "Succhi",
    Coffee: "Caffè",
    COFFEE: "CAFFÈ",
    Desserts: "Dolci",
    DESSERTS: "DOLCI",
    "Berry Bliss": "Berry Bliss",
    "Greek yogurt, bananas, nuts, dried fruits, honey":
      "Yogurt greco, banane, noci, frutta secca, miele",
  },
};

export function translateText(language: Language, text: string): string {
  const table = textTranslations[language];
  if (!table) return text;
  return table[text] || text;
}

export const menuTranslations: Record<Language, MenuTranslations> = {
  en: {
    menuTitle: "Menu",
    signInPrompt: "Please sign in to continue.",
    waitingForApprovalTitle: "Waiting for Approval",
    waitingForApprovalBodyPending:
      "Your access request is pending. Please wait for an administrator to review your request.",
    waitingForApprovalBodyRejected:
      "Your access request was rejected. Please wait for an administrator to review your request or contact support if you believe this is an error.",
    waitingForApprovalSupportHint: "If you believe this is an error, please contact support.",
    giveUsAReview: "Give us a review",
    followUs: "Follow us",
    googleLabel: "Google",
    tripAdvisorLabel: "TripAdvisor",
    instagramLabel: "Instagram",
    facebookLabel: "Facebook",
    languageSelectorLabel: "Select language",
    languageEnglish: "English",
    languageAlbanian: "Shqip",
    languageItalian: "Italiano",
    loadingMenu: "Loading menu...",
    noMenuItems: "No menu items available yet.",
    callWaiterTooltip: "Call waiter for Table {table}",
    callWaiterTooltipCalled: "Waiter already called for Table {table}",
    callWaiterTooltipWait: "Please wait a moment before calling again",
    callWaiterTooltipNoTable: "Scan your table's QR code to call the waiter",
    waiterCallLimitReached:
      "You've reached the waiter call limit for this visit. Please rescan your table QR to call again.",
    waiterCalledSuccess: "Waiter called for Table {table}",
    waiterCallError: "Could not call waiter. Please try again.",
  },
  sq: {
    menuTitle: "Menu",
    signInPrompt: "Ju lutemi identifikohuni për të vazhduar.",
    waitingForApprovalTitle: "Në pritje të miratimit",
    waitingForApprovalBodyPending:
      "Kërkesa juaj për akses është në pritje. Ju lutemi prisni që një administrator ta rishikojë kërkesën tuaj.",
    waitingForApprovalBodyRejected:
      "Kërkesa juaj për akses është refuzuar. Ju lutemi prisni që një administrator ta rishikojë kërkesën tuaj ose kontaktoni mbështetjen nëse mendoni se kjo është një gabim.",
    waitingForApprovalSupportHint: "Nëse mendoni se kjo është një gabim, ju lutemi kontaktoni mbështetjen.",
    giveUsAReview: "Na lini një vlerësim",
    followUs: "Na ndiqni",
    googleLabel: "Google",
    tripAdvisorLabel: "TripAdvisor",
    instagramLabel: "Instagram",
    facebookLabel: "Facebook",
    languageSelectorLabel: "Zgjidhni gjuhën",
    languageEnglish: "Anglisht",
    languageAlbanian: "Shqip",
    languageItalian: "Italisht",
    loadingMenu: "Duke ngarkuar menunë...",
    noMenuItems: "Ende nuk ka artikuj në menu.",
    callWaiterTooltip: "Thërrisni kamarierin për Tavolinën {table}",
    callWaiterTooltipCalled: "Kamarieri u thirr tashmë për Tavolinën {table}",
    callWaiterTooltipWait: "Ju lutemi prisni një moment para se të thirrni përsëri",
    callWaiterTooltipNoTable: "Skanoni kodin QR të tavolinës tuaj për të thirrur kamarierin",
    waiterCallLimitReached:
      "Keni arritur kufirin e thirrjeve për këtë vizitë. Ju lutemi skanoni përsëri kodin QR të tavolinës për të thirrur sërish.",
    waiterCalledSuccess: "Kamarieri u thirr për Tavolinën {table}",
    waiterCallError: "Nuk mund të thërritet kamarieri. Ju lutemi provoni përsëri.",
  },
  it: {
    menuTitle: "Menù",
    signInPrompt: "Accedi per continuare.",
    waitingForApprovalTitle: "In attesa di approvazione",
    waitingForApprovalBodyPending:
      "La tua richiesta di accesso è in attesa. Attendi che un amministratore esamini la tua richiesta.",
    waitingForApprovalBodyRejected:
      "La tua richiesta di accesso è stata rifiutata. Attendi che un amministratore esamini la tua richiesta o contatta il supporto se pensi che sia un errore.",
    waitingForApprovalSupportHint: "Se pensi che sia un errore, contatta il supporto.",
    giveUsAReview: "Lasciaci una recensione",
    followUs: "Seguici",
    googleLabel: "Google",
    tripAdvisorLabel: "TripAdvisor",
    instagramLabel: "Instagram",
    facebookLabel: "Facebook",
    languageSelectorLabel: "Seleziona lingua",
    languageEnglish: "Inglese",
    languageAlbanian: "Albanese",
    languageItalian: "Italiano",
    loadingMenu: "Caricamento del menù...",
    noMenuItems: "Nessun elemento di menù disponibile.",
    callWaiterTooltip: "Chiama il cameriere per il Tavolo {table}",
    callWaiterTooltipCalled: "Cameriere già chiamato per il Tavolo {table}",
    callWaiterTooltipWait: "Attendi un momento prima di richiamare",
    callWaiterTooltipNoTable: "Scansiona il QR code del tuo tavolo per chiamare il cameriere",
    waiterCallLimitReached:
      "Hai raggiunto il limite di chiamate al cameriere per questa visita. Scansiona di nuovo il QR del tavolo per chiamare ancora.",
    waiterCalledSuccess: "Cameriere chiamato per il Tavolo {table}",
    waiterCallError: "Impossibile chiamare il cameriere. Riprova.",
  },
};

