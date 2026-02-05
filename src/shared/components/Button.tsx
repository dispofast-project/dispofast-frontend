import React from "react";

export type ButtonProps = {
    label: string;
    onClick: () => void;
};

const Button: React.FC<ButtonProps> = (props) => {
    return <Button {...props}/>;
};

export default Button;