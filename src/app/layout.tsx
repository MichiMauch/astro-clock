import "./globals.css";

export const metadata = {
  title: "Astro Clock",
  description: "Eine Astronomische Uhr mit Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
