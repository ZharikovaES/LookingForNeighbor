import './App.scss';
import React, { useEffect } from "react";
import { observer } from 'mobx-react-lite';
import { BrowserRouter } from 'react-router-dom';
import AppRoute from './router/AppRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoute/>
      </BrowserRouter>
    </div>
  );
}

export default observer(App);
