import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DefaultRedirectGuard } from './guards/default-redirect.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [DefaultRedirectGuard], // Use the new guard for the default path
    children: [], // No component here, just redirection logic
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule), // Ensure './auth/auth.module.ts' exists and is correctly named
  },
  {
    path: 'list',
    loadChildren: () =>
      import('./features/features.module').then((m) => m.FeaturesModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
