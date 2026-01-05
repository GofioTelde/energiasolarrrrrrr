export const darkModeClasses = {
  // Fondos
  bg: {
    primary: "bg-white dark:bg-gray-900",
    secondary: "bg-gray-50 dark:bg-gray-800",
    card: "bg-white dark:bg-gray-800",
    input: "bg-white dark:bg-gray-700",
  },
  // Textos
  text: {
    primary: "text-gray-900 dark:text-white",
    secondary: "text-gray-600 dark:text-gray-300",
    muted: "text-gray-500 dark:text-gray-400",
  },
  // Bordes
  border: {
    default: "border-gray-200 dark:border-gray-700",
    input: "border-gray-300 dark:border-gray-600",
  },
  // Sombras
  shadow: {
    default: "shadow dark:shadow-gray-900/30",
    lg: "shadow-lg dark:shadow-gray-900/50",
  },
};

// Componente wrapper para modo oscuro
export function DarkContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${darkModeClasses.bg.primary} ${darkModeClasses.text.primary} transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
