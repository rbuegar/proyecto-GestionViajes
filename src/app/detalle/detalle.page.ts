import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Viajes } from '../viajes';
import { AlertController } from '@ionic/angular';
import { LoadingController ,ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

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
  imageSelect: string = '';

  constructor(private activatedRoute: ActivatedRoute,
     private firestoreService: FirestoreService,
      private router: Router,
       private alertController: AlertController,
      private toastController: ToastController,
      private loadingController: LoadingController,
    private imagePicker: ImagePicker) {}

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

  async seleccionarImagen() {

    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result === false) {
          this.imagePicker.requestReadPermission();
        }
        else {
          this.imagePicker.getPictures({
            maximumImagesCount: 1,
            outputType: 1
        }).then((results) => {
          if (results.length > 0) {
            this.imageSelect = 'data:image/jpeg;base64,' + results[0];
            console.log("Imagen seleccionada : " + this.imageSelect);
      }
    }, (err) => {
      console.log(err);
    }
        );
      }
    }, (err) => { console.log(err); }
    );
  }

  async subirImagen() {

    const loading = await this.loadingController.create({
      message: 'Subiendo imagen...',
    });

    const toast = await this.toastController.create({
      message: 'Imagen subida correctamente',
      duration: 2000
    });

    let nombreCarpeta = 'imagenes';

    loading.present();

    let nombreImagen = `${new Date().getTime()}`;

    this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imageSelect)
    .then(snapshot => {
      snapshot.ref.getDownloadURL()
      .then(downloadURL => {
        console.log(`Imagen disponible en: ${downloadURL}`);
       toast.present();
       loading.dismiss();
      })
    })
  }

  async eliminarArchivo(fileURL:string) {
  const toast = await this.toastController.create({
    message: 'Imagen eliminada correctamente',
    duration: 2000
  });

  this.firestoreService.eliminarArchivoPorURL(fileURL).then(() => {
    toast.present();
  }, (error) => { 
    console.log(error);
  });
}
  


}
