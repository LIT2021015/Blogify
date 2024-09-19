import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/footer/Footer";
// import { ThemeContextProvider } from "@/context/ThemeContext";
// import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from '@designcise/next-theme-toggle';
import { themes } from '@designcise/next-theme-toggle/server';

export const metadata = {
  title: "Blogify App",
  description: "The best blog app!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* <ThemeContextProvider>
            <ThemeProvider> */}
            <ThemeProvider storageKey="user-pref" defaultTheme={themes.light.type}>
              <div className="container">
                <div className="wrapper">
                  <Navbar />
                  <Toaster position="top-center" />
                  {children}
                  <Footer />
                </div>
              </div>
              </ThemeProvider>
            {/* </ThemeProvider>
          </ThemeContextProvider> */}
        </AuthProvider>
      </body>
    </html>
  );
}
