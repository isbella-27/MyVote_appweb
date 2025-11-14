import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../Pages/Home/Home";
import Create from "../../Pages/Candidats/Create/Create";
import List from "../../Pages/Candidats/List/List";
import Edit from "../../Pages/Candidats/Edit/Edit";
import Show from "../../Pages/Candidats/Show/Show";
import ConcoursCreate from "../../Pages/Crud/Concours/Create/Create";
import ConcoursList from "../../Pages/Crud/Concours/List/List";
import ConcoursShow from "../../Pages/Crud/Concours/Show/Show";
import ConcoursEdit from "../../Pages/Crud/Concours/Edit/Edit";
import Login from "../../Pages/Admin/Login/Login";
import Dashboard from "../../Pages/Admin/Dashboard/Dashboard";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/dashboard',
        element: <Dashboard/>,
    },
    {
        path: "/concours",
        children: [
            {
                index: true,
                element: <ConcoursList/>
            },
            {
                path: "create",
                element: <ConcoursCreate/>
            },
            {
                path: ":id/edit",
                element: <ConcoursEdit/>
            },
            {
                path: ":id/show",
                element: <ConcoursShow/>
            }
        ]
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
    }
])

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router