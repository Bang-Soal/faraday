import React from 'react';
import {StatusBar} from 'react-native';

export function AppProviders({children}: {children: React.ReactNode}) {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      {children}
    </>
  );
}
