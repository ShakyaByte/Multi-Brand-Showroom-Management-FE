import React from "react";

interface FormButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const FormButton: React.FC<FormButtonProps> = ({
  type = "button",
  variant = "default",
  size = "md",
  className = "",
  children,
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    "rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "text-white gradient-box",
    secondary: "border border-stroke text-primary bg-white hover:bg-gray-50 dark:bg-transparent dark:border-border-dark dark:text-white",
    danger: "bg-error text-white hover:bg-error/90",
    success: "bg-green-500 text-white hover:bg-green-600",
    default: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  const sizeClasses = {
    sm: "px-2.5 py-3 text-sm w-full sm:px-2.5 sm:py-4 sm:text-md sm:w-[180px]",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default FormButton;
