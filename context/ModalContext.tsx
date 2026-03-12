import React, { createContext, useContext, useState, ReactNode } from 'react';

type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface ModalOptions {
    active: boolean;
    type: ModalType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface ModalContextType {
    showModal: (options: Omit<ModalOptions, 'active'>) => void;
    showToast: (message: string, type?: 'success' | 'error') => void; // Optional: Simple toast helper
    closeModal: () => void;
    modalState: ModalOptions;
}

const defaultState: ModalOptions = {
    active: false,
    type: 'info',
    title: '',
    message: '',
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalState, setModalState] = useState<ModalOptions>(defaultState);

    const showModal = (options: Omit<ModalOptions, 'active'>) => {
        setModalState({ ...options, active: true });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, active: false }));
    };

    // Simple toast placeholder if we want to expand later
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        // For now, we can use a small auto-dismiss modal or implement a real toast later
        // Let's stick to modal for now as per request
        showModal({
            type,
            title: type === 'success' ? 'Success' : 'Error',
            message
        });
    };

    return (
        <ModalContext.Provider value={{ showModal, showToast, closeModal, modalState }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
