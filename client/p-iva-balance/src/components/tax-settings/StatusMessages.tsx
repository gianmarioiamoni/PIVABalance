import React from 'react';

interface StatusMessagesProps {
  error?: string;
  success?: boolean;
}

export const StatusMessages: React.FC<StatusMessagesProps> = ({ error, success }) => {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Impostazioni salvate con successo!
        </div>
      )}
    </>
  );
};
