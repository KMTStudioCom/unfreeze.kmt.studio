import UnfreezeTimer from "./components/UnfreezeTimer";
import JumboCharacter from "./components/JumboCharacter";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] sm:p-20">
      <UnfreezeTimer />
      <JumboCharacter />
    </div>
  );
}
