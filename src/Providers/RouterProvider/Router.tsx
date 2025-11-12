import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../Pages/Home/Home";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
])

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router