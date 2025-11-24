import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../Pages/Home/Home";
import CandidatesCreate from "../../Pages/Candidates/Create/CreateCandidate";
import CandidatesList from "../../Pages/Candidates/List/ListCandidates";
import CandidatesEdit from "../../Pages/Candidates/Edit/EditCandidate";
import CandidatesShow from "../../Pages/Candidates/Show/ShowCandidate";
import AdminsCreate from "../../Pages/Crud/Admins/Create/CreateAdmin";
import AdminsList from "../../Pages/Crud/Admins/List/ListAdmins";
import AdminsShow from "../../Pages/Crud/Admins/Show/ShowAdmin";
import AdminsEdit from "../../Pages/Crud/Admins/Edit/EditAdmin";
import ConcoursCreate from "../../Pages/Crud/Concours/Create/Create";
import ConcoursList from "../../Pages/Crud/Concours/List/List";
import ConcoursShow from "../../Pages/Crud/Concours/Show/Show";
import ConcoursEdit from "../../Pages/Crud/Concours/Edit/Edit";
import Login from "../../Pages/Admin/Login/Login";
import Dashboard from "../../Pages/Admin/Dashboard/Dashboard";
import Profile from "../../Pages/Admin/Profile/Profile";
import PublicConcour from "../../Pages/PublicConcour/PublicConcour";
import PaymentSuccess from "../../Pages/PaymentSuccess/PaymentSuccess";
import Transactions from "../../Pages/Admin/Transactions/Transactions";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/concours/:id/public',
        element: <PublicConcour/>,
    },
    {
        path:"/payment-success", 
        element: <PaymentSuccess />
    },
    {
        path:"/transactions", 
        element: <Transactions />
    },
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/profile',
        element: <Profile/>,
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
    },
    {
        path: "/admins",
        children: [
            {
                index: true,
                element: <AdminsList/>
            },
            {
                path: "create",
                element: <AdminsCreate/>
            },
            {
                path: ":id/edit",
                element: <AdminsEdit/>
            },
            {
                path: ":id/show",
                element: <AdminsShow/>
            }
        ]
    },
])

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router