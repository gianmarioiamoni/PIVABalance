'use client';

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Icon } from '@/components/ui';

export type DialogType = 'warning' | 'info' | 'success' | 'danger';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: DialogType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

/**
 * ConfirmDialog Component
 * 
 * A reusable confirmation dialog with different types and loading states
 * 
 * @param isOpen - Whether the dialog is open
 * @param title - Dialog title
 * @param message - Dialog message
 * @param type - Type of dialog (warning, info, success, danger)
 * @param confirmLabel - Label for confirm button
 * @param cancelLabel - Label for cancel button
 * @param onConfirm - Confirm handler (can be async)
 * @param onCancel - Cancel handler
 * @param loading - Whether confirm action is loading
 * @param className - Additional CSS classes
 */
export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  type = 'warning',
  confirmLabel = 'Conferma',
  cancelLabel = 'Annulla',
  onConfirm,
  onCancel,
  loading = false,
  className = '',
}: ConfirmDialogProps) => {

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in confirm action:', error);
    }
  };

  const getIconConfig = (dialogType: DialogType) => {
    switch (dialogType) {
      case 'danger':
        return {
          icon: 'ExclamationTriangleIcon',
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-500'
        };
      case 'warning':
        return {
          icon: 'ExclamationTriangleIcon',
          bgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500'
        };
      case 'info':
        return {
          icon: 'InformationCircleIcon',
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonColor: 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500'
        };
      case 'success':
        return {
          icon: 'CheckCircleIcon',
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonColor: 'bg-green-600 hover:bg-green-500 focus:ring-green-500'
        };
      default:
        return {
          icon: 'ExclamationTriangleIcon',
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-500'
        };
    }
  };

  const { icon: iconName, bgColor, iconColor, buttonColor } = getIconConfig(type);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`relative z-50 ${className}`}
        onClose={onCancel}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${bgColor} sm:mx-0 sm:h-10 sm:w-10`}>
                    <Icon name={iconName} className={`h-6 w-6 ${iconColor}`} aria-hidden={true} />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{message}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto transition-colors ${buttonColor} ${loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {confirmLabel}
                      </div>
                    ) : (
                      confirmLabel
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto transition-colors"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    {cancelLabel}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}; 