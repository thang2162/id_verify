import React, {useReducer, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import PageLoader from './components/PageLoader';
import StackNavigator from './navigation';
import {MainContext, MainReducer, MainInitState} from './store';
import {MainMemo, MemoContext} from './utils/memo';

const App = () => {
  const [store, dispatch] = useReducer(MainReducer, MainInitState);
  const memoContext = useMemo(MainMemo(store, dispatch), [store]);

  return (
    <MainContext.Provider value={{store, dispatch}}>
      <MemoContext.Provider value={memoContext}>
          <NavigationContainer>
            <PageLoader message="Please Wait..." isActive={store.isLoading} />
            <StackNavigator />
          </NavigationContainer>
      </MemoContext.Provider>
    </MainContext.Provider>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9999,
  },
});

export default App;