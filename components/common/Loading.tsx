import { Mountain } from "lucide-react";

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Loading({ 
  text = "Chargement", 
  fullScreen = false,
  size = "md" 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50"
    : "flex items-center justify-center py-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        {/* Logo animé */}
        <div className="relative">
          {/* Cercle tournant */}
          <div className={`${sizeClasses[size]} rounded-full border-4 border-green-100 border-t-green-700 animate-spin`}></div>
          
          {/* Logo Mountain au centre */}
          <Mountain 
            className={`absolute inset-0 m-auto ${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'} text-green-700`}
            strokeWidth={2.5}
          />
        </div>

        {/* Texte de chargement */}
        {text && (
          <p className={`${textSizeClasses[size]} font-medium text-gray-700 animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
