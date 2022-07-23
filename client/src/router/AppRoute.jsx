import React, { useContext, useEffect } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { Route, Routes, Navigate, useMatch, useLocation } from 'react-router-dom';
import { routes } from '.';
import Header from '../components/header/Header';
import Loader from '../pages/loader/Loader';
import RequireAuth from '../hoc/RequireAuth';

function AppRoute() {
  const { store } = useContext(Context);
  const location = useLocation();
  const match = useMatch('/', {
                                exact: true
                              });
  const match1 = useMatch('/registration', {
    exact: true
  });
  const match2 = useMatch('/login', {
    exact: true
  });
  const match3 = useMatch('/authvk');

  const showLoader = () => {
    if (store.isLoading) {
      document.body.style.overflow = "hidden";
      return (<Loader/>); 
    }
    else document.body.style.overflow = "auto";

  };

  useEffect(() => {
    store.setLoading(false);
  }, []);
  
  useEffect(async () => {
    if (localStorage.getItem('token')) await store.checkAuth();
    if (!match1 && !match2 && store.isRegistrationProcess) store.setRegistrationProcess(false);
    if (match3) {
      await window?.opener.setHash(window.location?.hash);
      window.close();
    }
  }, [ location ]);

  return (
    <div>
      { showLoader() }
      { (!match && !match3 && !store.isLoading) && (<Header/>)}
        <Routes>
          {
            routes.map(route => 
              <Route path={route.path} element={route.auth ? <RequireAuth isAuth={store.isAuth}>{route.element}</RequireAuth> : route.element} key={route.path}/>
            )  
          }      
          <Route path="/authvk/*" element={<Loader/>}/>
          <Route path="/*" element={<Navigate to="/error" />}/>
        </Routes>
    </div>
  );
}

export default observer(AppRoute);
