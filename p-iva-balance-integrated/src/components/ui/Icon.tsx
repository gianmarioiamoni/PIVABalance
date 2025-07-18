'use client';

import React, { useState, useEffect } from 'react';

// Type for icon props
interface IconProps {
    name: string;
    className?: string;
    'aria-hidden'?: boolean;
    [key: string]: unknown;
}

// Type for heroicons module
type HeroiconsModule = Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>;

/**
 * SSR-Safe Icon Component
 * 
 * Dynamically loads Heroicons to avoid SSR issues
 * Falls back to a simple SVG during SSR
 */
export const Icon: React.FC<IconProps> = ({
    name,
    className = "h-5 w-5",
    ...props
}) => {
    const [IconComponent, setIconComponent] = useState<React.ComponentType<React.SVGProps<SVGSVGElement>> | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Only load icons on client side
        if (typeof window !== 'undefined') {
            import('@heroicons/react/24/outline')
                .then((icons) => {
                    const iconsModule = icons as unknown as HeroiconsModule;
                    const icon = iconsModule[name];
                    if (icon) {
                        setIconComponent(() => icon);
                    }
                })
                .catch((error) => {
                    console.warn(`Failed to load icon: ${name}`, error);
                })
                .finally(() => {
                    setIsLoaded(true);
                });
        }
    }, [name]);

    // SSR fallback - simple SVG placeholder
    if (!isLoaded || !IconComponent) {
        return (
            <svg
                className={className}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                {...props}
            >
                <circle cx="12" cy="12" r="3" />
            </svg>
        );
    }

    return <IconComponent className={className} {...props} />;
};

// Pre-defined icon components for common icons
export const CheckCircleIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
    <Icon name="CheckCircleIcon" {...props} />
);

export const ExclamationTriangleIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
    <Icon name="ExclamationTriangleIcon" {...props} />
);

export const InformationCircleIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
    <Icon name="InformationCircleIcon" {...props} />
);

export const XCircleIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
    <Icon name="XCircleIcon" {...props} />
);

export const XMarkIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
    <Icon name="XMarkIcon" {...props} />
);

export const ArrowPathIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
    <Icon name="ArrowPathIcon" {...props} />
);

export const HomeIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
    <Icon name="HomeIcon" {...props} />
);

export const ShieldExclamationIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
    <Icon name="ShieldExclamationIcon" {...props} />
); 