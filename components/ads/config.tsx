export const ADSENSE_PUB = "ca-pub-1257499604453174";

export const SLOTS = {
  displayMain: "2926503432",     // Responsive display ad (hero/inline)
  homeMultiplex: "1421850078",   // Multiplex ad for homepage/footer
  sidebarTower: "4953900978",    // 250x600 tower for hamburger menu
belowHero: "9823918426", // your AdSense horizontal unit
} as const;

export type SlotKey = keyof typeof SLOTS;
