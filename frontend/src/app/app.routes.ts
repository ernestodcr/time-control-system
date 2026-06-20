import { Routes } from '@angular/router';
import { LoginPage } from './features/login/login.page';
import { DashboardPage } from './features/dashboard/dashboard.page';

export const routes: Routes = [
    {path:"", redirectTo:"login", pathMatch:"full"},
    {
        path:"login",
        component:LoginPage
    },
    {
        path:"dashboard",
        component:DashboardPage
    }
];
