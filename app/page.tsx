import type { Metadata } from 'next'
import Link from 'next/link'
import JumboCharacter from './components/JumboCharacter'
import JumboChoCharacter from './components/JumboChoCharacter'
import UnfreezeTimer from "./components/UnfreezeTimer";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] sm:p-20">
      <UnfreezeTimer />
      <JumboCharacter />
      <JumboChoCharacter />
    </div>
  );
}
