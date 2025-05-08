import "./globals.css";
import {Providers} from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className='dark'>
        <body>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}