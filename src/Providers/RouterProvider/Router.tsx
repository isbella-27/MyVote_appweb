import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../Pages/Home/Home";
import Register from "../../Pages/Admin/Register/Register";

const router = createBrowserRouter([
    {
        path: '/Home',
        element: <Home/>,
    },
    {
        path: '/',
        element: <Register/>,
    },
])

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router