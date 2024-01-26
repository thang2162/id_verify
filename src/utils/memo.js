import React from 'react';

const MainMemo = (store, dispatch) => {
  const Memo = () => ({
    toggleLoader: showLoader => {
      console.log(showLoader);
      return new Promise(async resolve => {
        await dispatch({ type: 'set', data: { isLoading: showLoader } });
        resolve();
      });
    },
    setIdFileName: filename => {
      dispatch({
        type: 'set',
        data: { IdFileName: filename },
      });
    },
    getIdFileName: () => {
     return store.IdFileName;
    },
    setVerifyIdRes: res => {
      dispatch({
        type: 'set',
        data: { VerifyIdRes: res },
      });
    },
    setVerifySelfieRes: res => {
      dispatch({
        type: 'set',
        data: { VerifySelfieRes: res },
      });
    },
    showGlobalStatus: (message, duration) => {
      dispatch({
        type: 'set',
        data: { status: { show: true, message: message, duration: duration } },
      });
    },
  });

  return Memo;
};

const MemoContext = React.createContext();

export { MainMemo, MemoContext };