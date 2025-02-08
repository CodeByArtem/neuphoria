import React, { ButtonHTMLAttributes } from "react";
import styles from "@/components/ui/Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
    return (
        <button className={`${styles.button} ${className || ""}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
