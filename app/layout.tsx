import '@/app/ui/global.css';
import { roboto } from "./ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiced`}>{children}</body>
    </html>
  );
}
