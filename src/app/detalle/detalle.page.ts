import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Viajes } from '../viajes';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {
  id: string;
  viaje: Viajes;
  isNew: boolean;

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido === 'new') {
      this.isNew = true;
      this.viaje = {} as Viajes;
    } else if (idRecibido != null) {
      this.isNew = false;
      this.id = idRecibido;
      this.firestoreService.consultarPorId('Viajes', this.id).subscribe((document) => {
        this.viaje = document.payload.data() as Viajes;
      });
    } else {
      this.id = "";
    }
  }

  clicBotonGuardar() {
    if (this.isNew) {
      this.firestoreService.insertar('Viajes', this.viaje).then(() => {
        console.log('viaje añadido correctamente');
        this.router.navigate(['/home']);
      });
    } else {
      this.firestoreService.actualizar('Viajes', this.id, this.viaje).then(() => {
        console.log('viaje modificado correctamente');
        this.router.navigate(['/home']);
      });
    }
  }

  async clicBotonBorrar() {
    const alert = await this.alertController.create({
      header: 'Confirmar borrado',
      message: `¿Estás seguro de que deseas borrar a ${this.viaje.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Borrado cancelado');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            this.firestoreService.borrar('Viajes', this.id).then(() => {
              console.log('viaje borrado correctamente');
              this.router.navigate(['/home']);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  clicBotonCancelar() {
    this.router.navigate(['/home']);
  }
}
