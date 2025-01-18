import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '../ConfirmDialog';

interface NavigationHandlerProps {
  hasChanges: () => boolean;
  showConfirmDialog: boolean;
  pendingNavigation: string | undefined;
  onConfirmNavigation: () => void;
  onCancelNavigation: () => void;
  setShowConfirmDialog: (show: boolean) => void;
  setPendingNavigation: (nav: string | undefined) => void;
  activeTab: string;
  attemptedTab: string | undefined;
  onTabChange: (newTab: string) => void;
}

export const NavigationHandler: React.FC<NavigationHandlerProps> = ({
  hasChanges,
  showConfirmDialog,
  pendingNavigation,
  onConfirmNavigation,
  onCancelNavigation,
  setShowConfirmDialog,
  setPendingNavigation,
  activeTab,
  attemptedTab,
  onTabChange,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (attemptedTab && attemptedTab !== activeTab) {
      setShowConfirmDialog(true);
      setPendingNavigation(`tab:${attemptedTab}`);
    }
  }, [attemptedTab, activeTab, setShowConfirmDialog, setPendingNavigation]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleRouteInterception = (e: PopStateEvent) => {
      if (hasChanges()) {
        window.history.pushState(null, '', window.location.href);
        setShowConfirmDialog(true);
        return false;
      }
      return true;
    };

    window.addEventListener('popstate', handleRouteInterception);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handleRouteInterception);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges, setShowConfirmDialog]);

  return (
    <ConfirmDialog
      isOpen={showConfirmDialog}
      title="Modifiche non salvate"
      message="Ci sono modifiche non salvate. Vuoi continuare senza salvare?"
      confirmLabel="Continua senza salvare"
      cancelLabel="Rimani sulla pagina"
      onConfirm={onConfirmNavigation}
      onCancel={onCancelNavigation}
    />
  );
};
