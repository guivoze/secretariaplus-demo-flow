import { useEffect, useRef, useState } from "react";

/**
 * Mede altura do teclado e expõe flags estáveis.
 * iOS: VisualViewport; Fallback: window.resize diff.
 */
export function useKeyboardGlue() {
  const [keyboard, setKeyboard] = useState({ height: 0, open: false });
  const baseVVH = useRef<number | null>(null);
  const baseWH = useRef<number | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const hasVV = typeof window !== "undefined" && "visualViewport" in window;

    function apply(h: number) {
      const height = h > 50 ? h : 0; // limiar para evitar falsos positivos
      setKeyboard({ height, open: height > 0 });
      // Opcional: expor CSS vars p/ debug/estilos
      document.documentElement.style.setProperty("--kb", `${height}px`);
    }

    const onVVChange = () => {
      if (!window.visualViewport) return;
      // Altura "útil" da viewport visual + offsetTop (iOS move viewport)
      const vv = window.visualViewport;
      const layoutH = window.innerHeight;
      // teclado ≈ layoutViewport - (vv.height + vv.offsetTop)
      const kb = Math.max(0, layoutH - (vv.height + vv.offsetTop));
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => apply(kb));
    };

    const onResizeFallback = () => {
      if (baseWH.current == null) baseWH.current = window.innerHeight;
      const diff = Math.max(0, (baseWH.current as number) - window.innerHeight);
      apply(diff);
    };

    if (hasVV) {
      if (baseVVH.current == null && window.visualViewport) {
        baseVVH.current = window.visualViewport.height;
      }
      window.visualViewport!.addEventListener("resize", onVVChange);
      window.visualViewport!.addEventListener("scroll", onVVChange);
      // dispara uma leitura inicial
      onVVChange();
    }

    window.addEventListener("resize", onResizeFallback);

    return () => {
      if (hasVV) {
        window.visualViewport!.removeEventListener("resize", onVVChange);
        window.visualViewport!.removeEventListener("scroll", onVVChange);
      }
      window.removeEventListener("resize", onResizeFallback);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return keyboard; // { height: px, open: boolean }
}