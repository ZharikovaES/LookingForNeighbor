import About from "../pages/About";
import Error from "../pages/Error";
import Home from "../pages/home/Home";
import ItemIdPage from "../pages/ItemIdPage";
import Login from "../pages/Login";
import Registration from "../pages/Registration";

export const routes = [
    {path: '/', element: <Home/>, exact: true, auth: false},
    {path: '/about', element: <About/>, exact: true, auth: false},
    {path: '/registration', element: <Registration/>, exact: true, auth: false},
    {path: '/login', element: <Login/>, exact: true, auth: false},
    {path: '/users/:cityId/:userId', element: <ItemIdPage/>, auth: true},
    {path: '/about', element: <About/>, exact: true, auth: false},
    {path: '/error', element: <Error/>, exact: true, auth: false}
];