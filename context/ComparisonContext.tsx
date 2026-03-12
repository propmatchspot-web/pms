import React, { createContext, useContext, useState, useEffect } from 'react';
import { PropFirm } from '../types';

interface ComparisonContextType {
    selectedFirms: PropFirm[];
    toggleFirm: (firm: PropFirm) => void;
    removeFirm: (firmId: string) => void;
    clearSelection: () => void;
    isInComparison: (firmId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedFirms, setSelectedFirms] = useState<PropFirm[]>(() => {
        // Load from local storage if available
        const saved = localStorage.getItem('comparison_firms');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('comparison_firms', JSON.stringify(selectedFirms));
    }, [selectedFirms]);

    const toggleFirm = (firm: PropFirm) => {
        if (selectedFirms.some(f => f.id === firm.id)) {
            setSelectedFirms(prev => prev.filter(f => f.id !== firm.id));
        } else {
            if (selectedFirms.length >= 3) {
                alert("You can compare up to 3 firms at a time.");
                return;
            }
            setSelectedFirms(prev => [...prev, firm]);
        }
    };

    const removeFirm = (firmId: string) => {
        setSelectedFirms(prev => prev.filter(f => f.id !== firmId));
    };

    const clearSelection = () => {
        setSelectedFirms([]);
    };

    const isInComparison = (firmId: string) => {
        return selectedFirms.some(f => f.id === firmId);
    };

    return (
        <ComparisonContext.Provider value={{ selectedFirms, toggleFirm, removeFirm, clearSelection, isInComparison }}>
            {children}
        </ComparisonContext.Provider>
    );
};

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (context === undefined) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};
