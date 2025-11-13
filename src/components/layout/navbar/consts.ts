export type MegaMenuLink = {
  label: string;
  href: string;
};

export type MobileNavItem = {
  label: string;
  href?: string;
  children?: MegaMenuLink[];
};

export const jewelryLinks: MegaMenuLink[] = [
  { label: "Shop all", href: "/search" },
  { label: "Necklaces", href: "/search/necklaces" },
  { label: "Chains", href: "/search/chains" },
  { label: "Bracelets", href: "/search/bracelets" },
  { label: "Earrings", href: "/search/earrings" },
  { label: "Rings", href: "/search/rings" },
  { label: "Sale", href: "/search/sale" }
];



export const collectionLinks: MegaMenuLink[] = [
  { label: "Libra", href: "/search/libra" },
  { label: "Scorpio", href: "/search/scorpio" },
  { label: "Capricorn", href: "/search/capricorn" },
  { label: "Aquarius", href: "/search/aquarius" },
  { label: "Pisces", href: "/search/pisces" },
  { label: "Aries", href: "/search/aries" },
  { label: "Taurus", href: "/search/taurus" },
  { label: "Gemini", href: "/search/gemini" },
  { label: "Cancer", href: "/search/cancer" },
  { label: "Leo", href: "/search/leo" },
  { label: "Virgo", href: "/search/virgo" }
];



export const cultureLinks: MegaMenuLink[] = [
  { label: "Lookbook", href: "/collections/lookbook" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/pages/about" },
  
];

export const mobileNavItems: MobileNavItem[] = [
  { label: "Best Sellers", href: "/collections/best-sellers" },
  
  { label: "Jewelry", children: jewelryLinks },
  { label: "Collections", children: collectionLinks },
  
  { label: "Culture", children: cultureLinks }
];