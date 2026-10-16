import "./globals.css";

export const metadata = {
  title: "SUPER TRAVEL x TIIS — FollowUp Radar | Luxury Editorial Design",
  description: "A luxury-focused, high-contrast design system called 'Super Travel' powered by League Spartan typography, warm off-white, charcoal, and #e4a4bd dusty rose accents for the TIIS FollowUp Radar 60-learner system.",
  keywords: ["Super Travel", "FollowUp Radar", "TIIS", "League Spartan", "Luxury Design System", "NextJS"]
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800;900&family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
