import "./globals.css";

export const metadata = {
  title: "Pastebin Lite",
  description: "Share text simply and securely.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
