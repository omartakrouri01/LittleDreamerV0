import { LogoMark } from "./brand/LogoMark";
import { InstagramIcon } from "./icons/InstagramIcon";
import { CloudDivider } from "./deco/CloudDivider";
import { ENABLE_WHATSAPP, INSTAGRAM_URL, SHOP_NAME_EN, SHOP_TAGLINE, WHATSAPP_PHONE } from "@/lib/config";

export function Footer() {
  return (
    <footer className="relative mt-8 bg-cloud pt-10">
      <CloudDivider className="absolute -top-px h-8 w-full text-blush" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 pb-10 text-center sm:px-6">
        <LogoMark size={40} />
        <p className="font-display text-sm font-bold text-plum">
          {SHOP_NAME_EN} • {SHOP_TAGLINE}
        </p>
        <div className="flex items-center gap-4">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-berry">
            <InstagramIcon className="h-5 w-5" />
            إنستغرام
          </a>
          {ENABLE_WHATSAPP && (
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#25D366]"
            >
              واتساب
            </a>
          )}
        </div>
        <p className="text-xs text-plum/40">جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
