import { useState } from "react";
import Home from "@/pages/Home";
import PenaltyGame from "@/components/PenaltyGame";

export default function App() {
  const [playing, setPlaying] = useState(false);

  return playing
    ? <PenaltyGame onBack={() => setPlaying(false)} />
    : <Home onPlay={() => setPlaying(true)} />;
}
