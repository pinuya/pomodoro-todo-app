import React, { useEffect, useRef, ReactNode } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./custom-scrollbar.css"; // Importa os estilos personalizados

// Interface para as propriedades do componente
interface CustomScrollbarProps {
  children: ReactNode;
  className?: string;
  options?: PerfectScrollbar.Options;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  className = "",
  options = {},
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const psRef = useRef<PerfectScrollbar | null>(null);

  useEffect(() => {
    // Inicializa o Perfect Scrollbar quando o componente for montado
    if (containerRef.current) {
      // Configura as opções padrão, mas permite substituições
      const defaultOptions: PerfectScrollbar.Options = {
        wheelSpeed: 1,
        wheelPropagation: true,
        minScrollbarLength: 20,
        suppressScrollX: true, // Desativa scrollbar horizontal
        ...options,
      };

      // Cria a instância do Perfect Scrollbar
      psRef.current = new PerfectScrollbar(
        containerRef.current,
        defaultOptions
      );
    }

    // Atualiza o Perfect Scrollbar quando o conteúdo mudar
    const updatePS = () => {
      if (psRef.current) {
        psRef.current.update();
      }
    };

    window.addEventListener("resize", updatePS);

    // Função de limpeza quando o componente for desmontado
    return () => {
      window.removeEventListener("resize", updatePS);

      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, [options]);

  // Atualiza o Perfect Scrollbar quando o conteúdo filho mudar
  useEffect(() => {
    if (psRef.current) {
      psRef.current.update();
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`custom-scrollbar-container relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export default CustomScrollbar;
