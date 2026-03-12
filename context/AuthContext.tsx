import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isAdmin: boolean;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 1. Get initial session
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await checkAdminStatus(session.user);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // 2. Listen for auth changes
        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            try {
                setSession(session);
                setUser(session?.user ?? null);
                // Verify admin status on auth change (e.g. login)
                if (session?.user) {
                    await checkAdminStatus(session.user);
                }
            } catch (error) {
                console.error("Auth change error:", error);
            } finally {
                setLoading(false);
            }
        });

        // Failsafe: Force loading to false after 5 seconds if generic auth hangs
        const timeoutId = setTimeout(() => setLoading(false), 5000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const checkAdminStatus = async (user: User | null | undefined) => {
        if (!user) {
            setIsAdmin(false);
            return;
        }

        // 1. PRIORITY: Hardcoded admin check (Bypasses DB for critical access)
        const emailLower = user.email?.toLowerCase();
        if (emailLower === 'admin@propmatch.com' || emailLower === 'propmatchspot@gmail.com') {
            console.log("Admin access granted via hardcoded whitelist:", emailLower);
            setIsAdmin(true);
            return;
        }

        try {
            // 2. Check 'profiles' table for role
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (data && data.role === 'admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, session, isAdmin, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
