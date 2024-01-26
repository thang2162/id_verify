import initialState from './MainInitState';
import dispatchObj from './dispatchObj';

const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "set":
      const setObj = new dispatchObj('setObj');
      setObj.setObj = action.data;
      //console.log(JSON.stringify(setObj.getAll()));
      return { ...state, ...setObj.getObj };
    default:
      //alert(action.cardTxt)
      return state;
  }
};

export default reducer;