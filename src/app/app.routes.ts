import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BoardComponent } from './components/inside/board/board.component';
import { WorkspaceComponent } from './components/inside/workspace/workspace.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'workspace',
    component: WorkspaceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workspace/:id',
    component: BoardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
