import React from "react";

import MainInitState from "./MainInitState";
import MainReducer from "./MainReducer";

const MainContext = React.createContext();

export { MainInitState, MainReducer, MainContext };