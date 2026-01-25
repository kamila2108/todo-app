'use client';

/**
 * AuthProviderのラッパーコンポーネント
 * 
 * 【初心者向け説明】
 * Next.jsのApp Routerでは、layout.tsxでmetadataをエクスポートする場合、
 * クライアントコンポーネントにできません。
 * そのため、AuthProviderを別のクライアントコンポーネントにラップします。
 */

import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ReactNode } from 'react';

interface AuthProviderWrapperProps {
  children: ReactNode;
}

export function AuthProviderWrapper({ children }: AuthProviderWrapperProps): JSX.Element {
  return <AuthProvider>{children}</AuthProvider>;
}
