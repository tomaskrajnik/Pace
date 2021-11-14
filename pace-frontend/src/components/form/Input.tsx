import React, { InputHTMLAttributes } from 'react';

type InputPosition = 'top' | 'middle' | 'bottom' | 'standalone';

interface InputProps {
    label?: string;
    position: InputPosition;
    onChange: (value: string) => void;
    value: string;
    error?: boolean;
    leftLabel?: string;
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
    error,
    leftLabel,
    disabled,
}) => {
    return (
        <div>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="flex">
                {leftLabel && (
                    <span
                        className={`inline-flex items-center px-3 ${
                            position === 'standalone' && 'rounded-tl-md rounded-bl-md'
                        } ${position === 'bottom' && 'rounded-bl-md'}  ${
                            position === 'top' && 'rounded-tl-md'
                        } border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm`}
                    >
                        {leftLabel}
                    </span>
                )}
                <input
                    disabled={disabled}
                    onChange={onChange}
                    value={value}
                    id={id}
                    name={name}
                    type={type}
                    autoComplete="email"
                    required={required}
                    className={`appearance-none rounded-none relative block w-full px-3 py-2.5 border ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 ${position === 'standalone' && !leftLabel && 'rounded-md'} ${
                        position === 'bottom' && !leftLabel && 'rounded-b-md'
                    }  ${position === 'top' && !leftLabel && 'rounded-t-md'} ${
                        position === 'standalone' && leftLabel && 'rounded-tr-md rounded-br-md'
                    } ${position === 'bottom' && leftLabel && 'rounded-br-md'}  ${
                        position === 'top' && leftLabel && 'rounded-tr-md'
                    } focus:outline-none focus:ring-blue-500 ${
                        error ? 'focus:border-blue-500' : 'focus:border-blue-500'
                    }  focus:z-10 sm:text-sm ${className}`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default Input;
