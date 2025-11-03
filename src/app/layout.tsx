import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import Announcement from "@/components/layout/announcement";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoyJW Store",
  description: "RoyJW Store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = cookies().get("cartId")?.value;
  const cart = getCart(cartId);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Announcement />
        
        <CartProvider cartPromise={cart}>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
