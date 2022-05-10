import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Context } from "..";

const RequireAuth = ({ children }) => {
    const { store } = useContext(Context);
    const location = useLocation();
    return store.isAuth ? children : <Navigate to="/login" replace state={{from: location}}/>;
}
export default observer(RequireAuth);