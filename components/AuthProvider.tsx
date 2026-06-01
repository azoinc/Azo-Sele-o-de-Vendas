'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Strict protected routes logic
      if (!currentUser && pathname !== '/login') {
        router.push('/login');
      } else if (currentUser && pathname === '/login') {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-white/20 border-t-[#61072E] rounded-full animate-spin"></span>
      </div>
    );
  }

  return <>{children}</>;
}
