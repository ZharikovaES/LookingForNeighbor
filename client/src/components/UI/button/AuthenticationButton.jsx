import React from "react";
import { useNavigate } from 'react-router-dom';

const AuthenticationButton = ({className, authenticationFunc, url = "/", children}) => {
  const navigate = useNavigate();
  return (
      <button
        type='button'
        className={["btn btn-outline-primary", className].join(' ')}
        onClick={async() => {
          await authenticationFunc();
          navigate(".." + url); 
        }}
      >
        { children }
      </button>
  )
}

export default AuthenticationButton;