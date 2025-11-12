import React from "react";
import "./Button.css"; 

type ButtonProps = {
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${disabled ? "btn-disabled" : "btn-active"} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
