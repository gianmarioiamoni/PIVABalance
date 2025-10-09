import React from 'react';

interface AccessibleIconProps {
  emoji?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  role?: 'img' | 'presentation';
  'aria-hidden'?: boolean;
}

/**
 * Accessible Icon Component for Emojis and Decorative Elements
 * Ensures proper accessibility for screen readers
 */
export const AccessibleIcon: React.FC<AccessibleIconProps> = ({
  emoji,
  alt,
  size = 'md',
  className = '',
  role = 'img',
  'aria-hidden': ariaHidden = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    xxl: 'text-6xl'
  };

  const sizeClass = sizeClasses[size];

  // For decorative icons, hide from screen readers
  if (ariaHidden || role === 'presentation') {
    return (
      <span
        className={`${sizeClass} ${className}`}
        role="presentation"
        aria-hidden="true"
        {...props}
      >
        {emoji}
      </span>
    );
  }

  // For meaningful icons, provide alt text
  return (
    <span
      className={`${sizeClass} ${className}`}
      role={role}
      aria-label={alt}
      title={alt}
      {...props}
    >
      {emoji}
    </span>
  );
};

/**
 * Predefined accessible icons for common use cases
 */
export const AccessibleIcons = {
  // Financial icons
  Calculator: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="🧮" alt="Calcolatrice per calcoli fiscali" {...props} />
  ),
  
  Invoice: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="📄" alt="Gestione fatture e documenti" {...props} />
  ),
  
  Dashboard: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="📊" alt="Dashboard e analytics" {...props} />
  ),
  
  Money: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="💰" alt="Gestione finanziaria" {...props} />
  ),
  
  Chart: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="📈" alt="Grafici e statistiche" {...props} />
  ),
  
  // Action icons
  Check: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="✅" alt="Completato con successo" {...props} />
  ),
  
  Warning: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="⚠️" alt="Attenzione richiesta" {...props} />
  ),
  
  Success: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="🎉" alt="Operazione completata" {...props} />
  ),
  
  // Business icons
  Growth: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="🚀" alt="Crescita del business" {...props} />
  ),
  
  Target: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="🎯" alt="Obiettivi e KPI" {...props} />
  ),
  
  Security: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="🔒" alt="Sicurezza e privacy" {...props} />
  ),
  
  // Tech icons
  Mobile: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="📱" alt="Compatibilità mobile" {...props} />
  ),
  
  Cloud: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="☁️" alt="Servizio cloud" {...props} />
  ),
  
  AI: (props: Omit<AccessibleIconProps, 'emoji' | 'alt'>) => (
    <AccessibleIcon emoji="🤖" alt="Intelligenza artificiale" {...props} />
  ),
};

/**
 * Image Alt Text Generator
 * Generates descriptive alt text for different types of images
 */
export const generateAltText = {
  // Chart alt text
  chart: (type: string, data?: string) => 
    `Grafico ${type}${data ? ` che mostra ${data}` : ''} per analisi finanziaria`,
  
  // Profile alt text
  profile: (name?: string) => 
    `Foto profilo${name ? ` di ${name}` : ' utente'}`,
  
  // Logo alt text
  logo: (company: string) => 
    `Logo di ${company}`,
  
  // Feature image alt text
  feature: (featureName: string) => 
    `Illustrazione della funzionalità ${featureName}`,
  
  // Screenshot alt text
  screenshot: (page: string, description?: string) => 
    `Screenshot della pagina ${page}${description ? `: ${description}` : ''}`,
  
  // Icon alt text
  icon: (action: string) => 
    `Icona per ${action}`,
  
  // Decorative alt text (empty for decorative images)
  decorative: () => '',
};
