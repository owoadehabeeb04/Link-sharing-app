import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from "@/utils/firebaseconfig";
import { useStateContext } from '../context/stateContext';
import Loader from '../loader';
import path from 'path';

export const ProtectedRoute = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { isAuthenticated, usersLoading } = useStateContext();

  // Store path before redirect to auth pages
  useEffect(() => {
    if (pathname !== '/login' && pathname !== '/signup') {
      sessionStorage.setItem('previousPath', pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthChecked(true);
      if (!ready && authChecked) {
        if (user && (pathname === '/login' || pathname === '/signup')) {
          // Get stored path and verify it exists
          const previousPath = sessionStorage.getItem('previousPath');
          if (previousPath ) {
            router.replace(previousPath);
          } else {
            router.replace(`/addLink/${user.uid}`);
          }
          return;
        }

        if (!user && pathname !== '/login' && pathname !== '/signup' && pathname !== '/' && pathname !== '/preview') {
          router.replace('/login');
          return;
        }

        setReady(true);
      }
    });

    return () => unsubscribe();
  }, [pathname, ready, authChecked]);

  if (usersLoading || !ready || !authChecked) return <Loader />;

  return <>{children}</>;
};