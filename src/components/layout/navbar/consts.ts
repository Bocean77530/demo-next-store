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
  { label: "New Releases", href: "/collections/jewelry-new-releases" },
  { label: "Necklaces", href: "/collections/necklaces" },
  { label: "Chains", href: "/collections/chains" },
  { label: "Bracelets", href: "/collections/bracelets" },
  { label: "Earrings", href: "/collections/earrings" },
  { label: "Rings", href: "/collections/rings" },
  { label: "Watches", href: "/collections/watches" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "Jewelry Care", href: "/collections/jewelry-care" },
  { label: "Men", href: "/collections/men" },
  { label: "Women", href: "/collections/women" },
  { label: "Sale", href: "/collections/sale" }
];



export const collectionLinks: MegaMenuLink[] = [
  { label: "Shop all", href: "/collections/all-collections" },
  { label: "Libra", href: "/collections/libra" },
  { label: "Scorpio", href: "/collections/scorpio" },
  { label: "Capricorn", href: "/collections/capricorn" },
  { label: "Aquarius", href: "/collections/aquarius" },
  { label: "Pisces", href: "/collections/pisces" },
  { label: "Aries", href: "/collections/aries" },
  { label: "Taurus", href: "/collections/taurus" },
  { label: "Gemini", href: "/collections/gemini" },
  { label: "Cancer", href: "/collections/cancer" },
  { label: "Leo", href: "/collections/leo" },
  { label: "Virgo", href: "/collections/virgo" }
];



export const cultureLinks: MegaMenuLink[] = [
  { label: "Lookbook", href: "/collections/lookbook" },
  { label: "Blog", href: "/blog" },
  { label: "Press", href: "/pages/press" },
  { label: "About Us", href: "/pages/about" },
  { label: "Contact", href: "/pages/contact" }
];

export const mobileNavItems: MobileNavItem[] = [
  { label: "Best Sellers", href: "/collections/best-sellers" },
  
  { label: "Jewelry", children: jewelryLinks },
  { label: "Collections", children: collectionLinks },
  
  { label: "Culture", children: cultureLinks }
];