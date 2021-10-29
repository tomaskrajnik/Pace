import React, { InputHTMLAttributes } from 'react';

type InputPosition = 'top' | 'middle' | 'bottom' | 'standalone';

interface InputProps {
    label?: string;
    position: InputPosition;
    onChange: (value: string) => void;
    value: string;
}

const Input: React.FC<InputProps & InputHTMLAttributes<HTMLDivElement>> = ({
    name,
    label,
    type,
    placeholder,
    id,
    required,
    className,
    position,
    value,
    onChange,
}) => {
    return (
        <React.Fragment>
            {label && (
                <label htmlFor="email-address" className="sr-only">
                    {label}
                </label>
            )}
            <input
                onChange={onChange}
                value={value}
                id={id}
                name={name}
                type={type}
                autoComplete="email"
                required={required}
                className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                    position === 'standalone' && 'rounded-md'
                } ${position === 'bottom' && 'rounded-b-md'}  ${
                    position === 'top' && 'rounded-t-md'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${className}`}
                placeholder={placeholder}
            />
        </React.Fragment>
    );
};

export default Input;
