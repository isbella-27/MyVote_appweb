import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../Pages/Home/Home";
import ConcoursCreate from "../../Pages/Crud/Concours/Create/Create";
import ConcoursList from "../../Pages/Crud/Concours/List/List";
import ConcoursShow from "../../Pages/Crud/Concours/Show/Show";
import ConcoursEdit from "../../Pages/Crud/Concours/Edit/Edit";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
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
    }
])

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router