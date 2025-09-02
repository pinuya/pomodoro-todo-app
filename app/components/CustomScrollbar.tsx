import React, { useEffect, useRef, ReactNode } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./custom-scrollbar.css";
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
    if (containerRef.current) {
      const defaultOptions: PerfectScrollbar.Options = {
        wheelSpeed: 1,
        wheelPropagation: true,
        minScrollbarLength: 20,
        suppressScrollX: true,
        ...options,
      };

      psRef.current = new PerfectScrollbar(
        containerRef.current,
        defaultOptions
      );
    }

    const updatePS = () => {
      if (psRef.current) {
        psRef.current.update();
      }
    };

    window.addEventListener("resize", updatePS);

    return () => {
      window.removeEventListener("resize", updatePS);

      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, [options]);

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
