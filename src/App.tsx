import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BaziPage } from "./pages/BaziPage";
import { Home } from "./pages/Home";
import { LiuyaoPage } from "./pages/LiuyaoPage";
import { TarotPage } from "./pages/TarotPage";
import { XingzuoPage } from "./pages/XingzuoPage";
import { ZiWeiPage } from "./pages/ZiWeiPage";
import "./App.css";

function routerBasename(): string | undefined {
  // Vite 只保证注入 BASE_URL（带末尾 /），无 import.meta.env.BASE
  const raw = import.meta.env.BASE_URL ?? "/";
  if (raw === "/" || raw === "./") return undefined;
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed === "" ? undefined : trimmed;
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bazi" element={<BaziPage />} />
        <Route path="/ziwei" element={<ZiWeiPage />} />
        <Route path="/liuyao" element={<LiuyaoPage />} />
        <Route path="/xingzuo" element={<XingzuoPage />} />
        <Route path="/tarot" element={<TarotPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
