import React, { useMemo } from 'react';
import { prettyClasses } from '../../utils/formatting';
import DynamicHeroIcon, { IconName } from './DynamicHeroIcon';
import Lottie from 'react-lottie';

interface NormalButtonProps {
    title: string;
    onClick: () => void;
    className?: string;
    type?: 'submit' | 'button';
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'small' | 'normal' | 'large';
    disabled?: boolean;
    pill?: boolean;
    color?: 'blue' | 'red' | 'yellow';
    icon?: {
        name: IconName;
        position: 'left' | 'right';
    };
    loading?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
}

const classes = {
    base: 'group relative w-full flex justify-center border border-transparent text-sm font-medium rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
    pill: 'rounded-full',
    size: {
        small: 'px-2 py-1 text-sm',
        normal: 'px-4 py-2',
        large: 'px-8 py-3 text-lg',
    },
};

const NormalButton: React.FC<NormalButtonProps> = ({
    title,
    onClick,
    className,
    type = 'button',
    variant = 'primary',
    size = 'normal',
    pill = false,
    disabled = false,
    color = 'blue',
    icon,
    loading,
    ref,
    ...props
}) => {
    // Tinting the colors for secondary variant

    const colorClasses = useMemo(
        () =>
            variant === 'primary'
                ? `text-white bg-${color}-500 hover:bg-${color}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`
                : `text-sm text-${color}-500 font-medium rounded-md text-white bg-${
                      variant === 'secondary' ? color : 'white'
                  }-100 hover:bg-${color}-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-300`,
        [variant, color],
    );

    const iconPosition = useMemo(() => icon && `${icon.position === 'left' ? 'left' : 'right'}-5`, [icon]);

    const loader = require(`../../assets/lottie/default-loader-${variant == 'primary' ? 'white' : color}.json`);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loader,
    };
    return (
        <button
            ref={ref}
            onClick={onClick}
            className={prettyClasses(`
        ${classes.base}
        ${classes.size[size]}
        ${pill && classes.pill}
        ${disabled && classes.disabled}
        ${colorClasses}
        ${className}
    `)}
            disabled={disabled}
            type={type}
            {...props}
        >
            {icon && (
                <span className={`absolute ${iconPosition} inset-y-0 flex items-center pl-3`}>
                    <DynamicHeroIcon
                        icon={icon.name}
                        className={`h-4 w-5 text-${variant === 'primary' ? 'white' : `${color}-500`} group-hover:text-${
                            variant === 'primary' ? 'white' : `${color}-500`
                        }`}
                    />
                </span>
            )}
            {loading && <Lottie speed={2} options={defaultOptions} height={20} width={40} />}
            {!loading && title}
        </button>
    );
};

export default NormalButton;
