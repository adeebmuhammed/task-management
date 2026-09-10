import { Routes } from '@angular/router';
import { ROUTES_PATHS } from './constants/routes';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: ROUTES_PATHS.HOME,
    component: HomeComponent,
  },
];
