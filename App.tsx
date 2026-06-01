import {AppNavigator} from './src/app/navigation/AppNavigator';
import {AppProviders} from './src/app/providers/AppProviders';

function App() {
  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
}

export default App;
