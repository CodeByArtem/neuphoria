import React, { InputHTMLAttributes } from "react";
import styles from "@/components/ui/Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
    return <input className={`${styles.input} ${className || ""}`} {...props} />;
};

export default Input;
