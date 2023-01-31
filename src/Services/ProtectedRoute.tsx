import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { SharedContext, SharedContextProviderValueModel } from "./SharedContext";

export const ProtectedRoute = ({ component: Component, permissionPath, ...rest }) => {

  // const context = useContext<SharedContextProviderValueModel>(SharedContext);
  // const checkUser = context.currentUser !== null && context.currentUser?.IsSuperAdmin !== true;

  return (
    <Route {...rest} render={(props) => {
      // if (checkUser === true && context.currentUser?.Roles.indexOf(permissionPath) === -1)
      //   return <Redirect to={{ pathname: "/yetki-yok", state: { from: props.location } }} />
      // else
        return <Component {...props} />
    }} />
  );
};
