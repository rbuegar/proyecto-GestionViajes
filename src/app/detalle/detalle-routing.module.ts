import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetallePage } from './detalle.page'; // Importa DetallePage

const routes: Routes = [
  {
    path: '',
    component: DetallePage, 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallePageRoutingModule {}
