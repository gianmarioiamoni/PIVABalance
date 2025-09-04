import { NavbarUser } from '@/types/navigation';
import { useLogout, useUserUtils } from '@/hooks/layout';
import { NAV_CLASSES, ARIA_LABELS } from './constants';

/**
 * Props for UserProfile component
 * Following Interface Segregation Principle
 */
interface UserProfileProps {
    user: NavbarUser;
    logoutFn: () => Promise<void>;
    className?: string;
}

/**
 * UserProfile Component
 * 
 * Follows Single Responsibility Principle - only handles user profile display and logout.
 * Encapsulates user-related UI and interactions.
 * 
 * @param props - Component props
 * @returns User profile component with logout functionality
 */
export const UserProfile: React.FC<UserProfileProps> = ({
    user,
    logoutFn,
    className = ''
}) => {
    const { isLoggingOut, handleLogout } = useLogout(logoutFn);
    const { getUserInitials } = useUserUtils();

    const containerClasses = `flex items-center space-x-4 ${className}`.trim();
    const buttonClasses = `${NAV_CLASSES.button.base} ${NAV_CLASSES.button.danger}`.trim();

    return (
        <div className={containerClasses}>
            <span className="text-gray-700 hidden sm:block">
                Benvenuto, {user.name}
            </span>

            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={buttonClasses}
                aria-label={ARIA_LABELS.logout}
                type="button"
            >
                {isLoggingOut ? (
                    <div className="flex items-center">
                        <div className={`${NAV_CLASSES.spinner.base} mr-2`} />
                        Uscita...
                    </div>
                ) : (
                    'Esci'
                )}
            </button>

            <div
                className={NAV_CLASSES.avatar.base}
                aria-label={`Avatar di ${user.name}`}
                role="img"
            >
                {getUserInitials(user.name)}
            </div>
        </div>
    );
}; 