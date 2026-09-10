import { Routes } from '@angular/router';
import { ROUTES_PATHS } from './constants/routes';
import { HomeComponent } from './pages/home/home.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';

export const routes: Routes = [
  {
    path: ROUTES_PATHS.HOME,
    component: HomeComponent,
  },
  {
    path: `${ROUTES_PATHS.TASK_DETAILS}/:id`,
    component: TaskDetailsComponent,
  }
];
