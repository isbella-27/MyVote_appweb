import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../Pages/Home/Home";
import CandidatesCreate from "../../Pages/Candidates/Create/Create";
import CandidatesList from "../../Pages/Candidates/List/List";
import CandidatesEdit from "../../Pages/Candidates/Edit/Edit";
import CandidatesShow from "../../Pages/Candidates/Show/Show";
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
        path: "/concours/:id/candidates",
        element: <CandidatesList />,
    },
    {
        path: "/candidates",
        children: [
            {
                path: "create",
                element: <CandidatesCreate />,
            },

            {
                path: ":id/edit",
                element: <CandidatesEdit />,
            },

            {
                path: ":id/show",
                element: <CandidatesShow />,
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