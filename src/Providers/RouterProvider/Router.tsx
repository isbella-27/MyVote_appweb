import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../Pages/Home/Home";
import Register from "../../Pages/Admin/Register/Register";
import Create from "../../Pages/Candidats/Create/Create";
import List from "../../Pages/Candidats/List/List";
import Edit from "../../Pages/Candidats/Edit/Edit";
import Show from "../../Pages/Candidats/Show/Show";

const router = createBrowserRouter([
    {
        path: '/Home',
        element: <Home />,
    },
    {
        path: '/',
        element: <Register />,
    },
    {
        path: "/candidates",
        children: [
            {
                index: true,
                element: <Create />,
            },
            {
                path: "List",
                element: <List />,
            },

            {
                path: ":id/edit",
                element: <Edit />,
            },

            {
                path: ":id/show",
                element: <Show />,
            },
        ],
    },
])

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router