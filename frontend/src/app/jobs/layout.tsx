import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavigationBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
