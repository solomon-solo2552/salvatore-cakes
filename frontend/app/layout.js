import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Salvatore Cakes | Handcrafted Cakes & Pastries",
  description:
    "Salvatore Cakes bakes handcrafted birthday cakes, wedding cakes, cupcakes and cheesecakes, delivered fresh to your door.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#2B1810",
                  color: "#FBF3E7",
                  border: "1px solid rgba(201, 161, 90, 0.3)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "14px",
                },
                className: "font-body",
              }}
              richColors
              closeButton
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}