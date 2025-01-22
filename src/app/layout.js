import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/footer/Footer";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@designcise/next-theme-toggle";
import { themes } from "@designcise/next-theme-toggle/server";
import { getServerSession } from "next-auth";
import { authOptions} from "@/utils/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blogify App",
  description: "The best socio-blog app!",
};

export default async function RootLayout({ children }) {
  
  const session = await getServerSession(authOptions); 
  const userId = session?.user?.email; 

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider storageKey="user-pref" defaultTheme={themes.light.type}>
            <div className="container">
              <div className="wrapper">
        
                <Navbar userId={userId} />
                <Toaster position="top-center" />
                {children}
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
