import type {ReactNode} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '../../lib/api/queryClient';
import {ToastProvider} from '../../components/Toast/ToastProvider';

export function AppProviders({children}: {children: ReactNode}) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
