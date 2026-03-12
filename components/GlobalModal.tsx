import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '../context/ModalContext';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const GlobalModal: React.FC = () => {
    const { modalState, closeModal } = useModal();
    const [visible, setVisible] = useState(false);

    // Handle animation state
    useEffect(() => {
        if (modalState.active) {
            setVisible(true);
        } else {
            const timer = setTimeout(() => setVisible(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [modalState.active]);

    if (!visible && !modalState.active) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && modalState.type !== 'confirm') {
            closeModal();
        }
    };

    const icons = {
        success: <CheckCircle className="text-green-500 w-12 h-12" />,
        error: <XCircle className="text-red-500 w-12 h-12" />,
        warning: <AlertTriangle className="text-yellow-500 w-12 h-12" />,
        info: <Info className="text-blue-500 w-12 h-12" />,
        confirm: <Info className="text-brand-gold w-12 h-12" />,
    };

    const gradients = {
        success: 'from-green-500/20 to-green-900/5',
        error: 'from-red-500/20 to-red-900/5',
        warning: 'from-yellow-500/20 to-yellow-900/5',
        info: 'from-blue-500/20 to-blue-900/5',
        confirm: 'from-brand-gold/20 to-amber-900/5',
    };

    const type = modalState.type || 'info';

    return createPortal(
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${modalState.active ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 transition-opacity"
                onClick={handleOverlayClick}
            />

            {/* Modal Content */}
            <div
                className={`
          relative w-full max-w-md bg-brand-charcoal border border-brand-border rounded-2xl shadow-2xl overflow-hidden
          transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
          ${modalState.active ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
            >
                {/* Glow Effect Background */}
                <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${gradients[type]} opacity-50 pointer-events-none`} />

                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-brand-muted hover:text-white transition-colors p-1 rounded-full hover:bg-white/5 z-20"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10 p-8 flex flex-col items-center text-center">
                    {/* Icon with glow halo */}
                    <div className="mb-6 relative">
                        <div className={`absolute inset-0 rounded-full blur-xl opacity-20 bg-current ${type === 'success' ? 'text-green-500' :
                                type === 'error' ? 'text-red-500' :
                                    type === 'warning' ? 'text-yellow-500' :
                                        type === 'confirm' ? 'text-brand-gold' : 'text-blue-500'
                            }`}></div>
                        <div className="relative bg-brand-black rounded-full p-4 border border-brand-border shadow-lg">
                            {icons[type]}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                        {modalState.title}
                    </h3>

                    <p className="text-brand-muted mb-8 leading-relaxed">
                        {modalState.message}
                    </p>

                    <div className="flex gap-3 w-full">
                        {type === 'confirm' ? (
                            <>
                                <button
                                    onClick={() => {
                                        modalState.onCancel?.();
                                        closeModal();
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl border border-brand-border text-brand-muted font-bold hover:bg-white/5 hover:text-white transition-all"
                                >
                                    {modalState.cancelText || 'Cancel'}
                                </button>
                                <button
                                    onClick={() => {
                                        modalState.onConfirm?.();
                                        closeModal();
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-brand-gold text-brand-black font-bold hover:bg-brand-goldHover shadow-lg shadow-brand-gold/20 transition-all"
                                >
                                    {modalState.confirmText || 'Confirm'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={closeModal}
                                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand-charcoal to-brand-black border border-brand-border hover:border-brand-gold/50 text-white font-bold transition-all shadow-lg"
                            >
                                Okay
                            </button>
                        )}
                    </div>
                </div>

                {/* Bottom decorative bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${gradients[type].replace('/20', '')}`} />
            </div>
        </div>,
        document.body
    );
};

export default GlobalModal;
