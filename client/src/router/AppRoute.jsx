import { useContext, useEffect } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { Route, Routes, Navigate, useMatch, useLocation } from 'react-router-dom';
import { routes } from '.';
import Header from '../components/header/Header';
import Loader from '../pages/loader/Loader';
import RequireAuth from '../hoc/RequireAuth';
import { disableScroll, enableScroll } from '../utils/disable-scroll';

function AppRoute() {
  const { store } = useContext(Context);
  const showLoader = () => {
    if (store.isLoading) {
      disableScroll();
      return (<Loader/>); 
    }
    else enableScroll();
  }
  const location = useLocation();
  useEffect(async () => {
    if (localStorage.getItem('token')) await store.checkAuth();
  }, [location]);

  const match = useMatch('/', {
                                exact: true
                              });

  return (
    <div>
      { showLoader() }
      { (!match && !store.isLoading) && (<Header/>)}
        <Routes>
          {
            routes.map(route => 
              <Route path={route.path} element={route.auth ? <RequireAuth isAuth={store.isAuth}>{route.element}</RequireAuth> : route.element} key={route.path}/>
            )  
          }      
          <Route path="/*" element={<Navigate to="/error" />}/>
        </Routes>
    </div>
  );
}

export default observer(AppRoute);
