import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DietarioService } from 'src/app/services/dietario.service';
import { MenusService } from 'src/app/services/menus.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menus-formulario',
  templateUrl: './menus-formulario.component.html',
  styleUrls: ['./menus-formulario.component.scss']
})
export class MenusFormularioComponent implements OnInit {
  dias: any = [
    '',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
  ];
  comidas: any = [
    { field: 'breakfast', title: 'Desayuno' },
    { field: 'lunch', title: 'Comida' },
    { field: 'desert', title: 'Postre' },
  ];
  toast: any;
  form: FormGroup;
  alergenos: any = [];
  semana: any = { name: '' };
  menuView: any;
  modalData: any = {};
  initData: any = {};

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dietarioService: DietarioService,
    private menuService: MenusService,
    private route: Router,
  ) {
    this.getAlergenos();
    this.form = this.formBuilder.group({
      plato: ['', [Validators.required, Validators.maxLength(500)]],
      alergenos: ['', [Validators.maxLength(1000)]],
    });

  }

  ngOnInit(): void {
    // Recupera el id del aula de la cabecera
    const hash = parseInt(location.hash.substr(1));
    if (hash) {
      this.menuService.get(hash).subscribe(
        (response: any) => {
          this.semana = response;
          this.initData = JSON.parse(JSON.stringify(response));

        }, (error: any) => {
          if(error.status==403)this.userService.exit();
        }
      )
    } else {
      this.initData = {
        id: 0,
        name: '',
        dias: [],
      }
      for (let index = 1; index < 6; index++) {
        var dia = {
          id: new Date().getTime() + index,
          idMenu: 0,
          dia: index,
        }
        this.comidas.forEach(comida => {
          dia[comida.field] = "";
          dia[comida.field + "_allergens"] = [];
        });
        this.initData.dias.push(dia);
      }
      this.semana = JSON.parse(JSON.stringify(this.initData));
      console.log(this.initData);

    }
  }

  getAlergenos() {
    this.dietarioService.getAlergenos().subscribe(
      (response: any) => this.alergenos = response,
      (error: any) => {
        if (error.status == 403) this.userService.exit();
        else this.toast = { text: 'Error al recuperar los alergenos', type: 'error' }
      }
    )
  }

  nombreAlergeno(id) {
    const item = this.alergenos.find(x => x.id == id);
    if (item) return item.value
    else return ''
  }

  cambiarNombre(nombre) {
    console.log('cambiarNombre', nombre.trim());
    this.semana.name = nombre.trim();
  }

  guardar() {
    if (this.semana.name.trim().length > 0) {
      if (this.semana.id == 0) {
        this.menuService.add(this.semana).subscribe(
          (response: any) => {
            this.initData = response;
            this.semana = JSON.parse(JSON.stringify(this.initData));
            this.toast = { text: 'Menu creado', type: 'success' };
            this.location.go(`/menus/formulario#${response.id}`);
          }, (error: any) => {
            if (error.status == 403) this.userService.exit();
            else this.toast = { text: 'Error al guardar los datos', type: 'error' }
          }
        )
      } else {
        this.menuService.set(this.semana).subscribe(
          (response: any) => {
            this.initData = response;
            this.semana = JSON.parse(JSON.stringify(this.initData));
            this.toast = { text: 'Menu actualizado', type: 'success' };
          }, (error: any) => {
            if (error.status == 403) this.userService.exit();
            else this.toast = { text: 'Error al guardar los datos', type: 'error' }
          });
      }
    }
  }
  cancelar() {
    this.route.navigate(['/menus']);
  }
  deshacer() {
    console.log(this.semana, this.initData);
    this.semana = JSON.parse(JSON.stringify(this.initData))
  }

  /** MODAL FORMULARIO COMIDA */
  editarComida(idDia, comida) {
    const menu = this.semana.dias.find(x => x.id == idDia);
    if (menu) {
      this.modalData.id = idDia;
      this.modalData.comida = comida;
      this.modalData.plato = menu[comida];
      this.modalData.alergenos = menu[comida + "_allergens"];
      this.modalData.alergenos.forEach((element) => {
        var item = <HTMLInputElement>document.getElementById('alergenos-modal-' + element);
        item.checked = true;
      });
    }

  }
  oneditarComidaModalShow() {
    this.form.controls['plato'].setValue(this.modalData.plato);
    this.form.controls['alergenos'].setValue(this.modalData.alergenos);
    document.getElementById('modal-plato').focus();
  }
  oneditarComidaModalHide() {
    this.form.reset();
    this.modalData = {};
    document.querySelectorAll("[name='alergenos-modal']").forEach((item: HTMLInputElement) => item.checked = false)
  }
  oneditarComidaModalAccept() {

    if (this.form.valid) {
      this.modalData.plato = this.form.get('plato').value;
      var alergenos = [];
      document.querySelectorAll('input[name="alergenos-modal"]:checked').forEach((item: HTMLInputElement) => {
        alergenos.push(item.value);
      })
      const index = this.semana.dias.findIndex(x => x.id == this.modalData.id);
      this.semana.dias[index][this.modalData.comida] = this.form.get('plato').value;
      this.semana.dias[index][this.modalData.comida + "_allergens"] = alergenos;
      console.log();

      document.getElementById('editarComidaModal-close').click();
    }

  }
}
