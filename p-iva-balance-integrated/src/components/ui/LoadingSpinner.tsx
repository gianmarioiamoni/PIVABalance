interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'green' | 'red' | 'gray';
    className?: string;
}

/**
 * LoadingSpinner Component
 * 
 * A reusable loading spinner with customizable size and color
 * 
 * @param size - Size of the spinner (sm, md, lg)
 * @param color - Color of the spinner border
 * @param className - Additional CSS classes
 */
export const LoadingSpinner = ({
    size = 'md',
    color = 'blue',
    className = ''
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const colorClasses = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        red: 'border-red-500',
        gray: 'border-gray-500'
    };

    return (
        <div className={`flex justify-center items-center p-4 ${className}`}>
            <div
                className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
                role="status"
                aria-label="Loading..."
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}; 