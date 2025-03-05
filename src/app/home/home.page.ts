import { Component } from '@angular/core';
import { Viajes } from '../viajes';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  idTareaSelec: string;
  ViajeEditando: Viajes;
  arrayViajes: any = [{
    id: '',
    data: {} as Viajes
  }];

  constructor(private firestoreService: FirestoreService, private router: Router) {
      //crea una tarea vacía al empezar 
      this.ViajeEditando = {} as Viajes;

      this.obtenerListaViajes();
  }
  clicBotonInsertar(){
    this.firestoreService.insertar('Viajes', this.ViajeEditando)
    .then(() => {console.log('Viaje añadido correctamente');
      //Limpia el contenido de tareaEditando
    this.ViajeEditando = {} as Viajes;
      
    }, (error) => {
      console.error(error); 
    });
  }

  obtenerListaViajes(){
    this.firestoreService.consultar('Viajes').subscribe((resultadoConsultaViajes) => {
      this.arrayViajes = [];
      resultadoConsultaViajes.forEach((datosViaje: any) => {
        this.arrayViajes.push({
          id: datosViaje.payload.doc.id,
          data: datosViaje.payload.doc.data()
        })
      })
    }
  )
  }
  selecViaje(Viajeselec) {
    console.log("Viaje seleccionado: ");
    console.log(Viajeselec);
    this.idTareaSelec = Viajeselec.id;
    this.ViajeEditando.nombre = Viajeselec.data.nombre;
    this.ViajeEditando.ubicacion = Viajeselec.data.discografica;
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("Viajes", this.idTareaSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaViajes();
      // Limpiar datos de pantalla
      this.ViajeEditando = {} as Viajes;
    })
  }
selectViaje(idViajeselect: string) {
  this.router.navigate(['/detalle', idViajeselect]); 
}

clicBotonModificar() {
  this.firestoreService.actualizar("Viajes", this.idTareaSelec, this.ViajeEditando).then(() => {
    // Actualizar la lista completa
    this.obtenerListaViajes();
    // Limpiar datos de pantalla
    this.ViajeEditando = {} as Viajes;
  })
}

navigateToAdd() {
  this.router.navigate(['/detalle', 'new']);
}

}
