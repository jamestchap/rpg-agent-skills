import "./globals.css";

export const metadata = {
  title: "RPG AI Skill Forge",
  description: "Level up an agent profile and generate a SKILL.md file."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
