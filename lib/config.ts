/**
 * Shop-wide constants. Every value the brand/ordering flow depends on lives
 * here — nothing in the rest of the codebase may hardcode these.
 */
export const SHOP_NAME_EN = "Little Dreamer" as const;
export const SHOP_TAGLINE = "Kids Shop" as const;

export const INSTAGRAM_USER = "little_dreamer.sy" as const;
export const INSTAGRAM_URL = "https://www.instagram.com/little_dreamer.sy" as const;
export const INSTAGRAM_DM = "https://ig.me/m/little_dreamer.sy" as const;

export const WHATSAPP_PHONE = "963933047420" as const;
// Owner flips this to true when ready to accept WhatsApp orders — no other
// code change required, the WhatsApp button is already fully built.
export const ENABLE_WHATSAPP = false as const;

export const CURRENCY = "$" as const;
