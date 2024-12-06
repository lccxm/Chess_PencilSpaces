import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component'; 
import { ChessComponent } from './chess/chess.component';

const routes: Routes = [
  { path: '', redirectTo: 'mainPage', pathMatch: 'full' },
  {path: 'mainPage', component: MainPageComponent},
  {path: 'iframePage', component: ChessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
