import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AulaService } from 'src/app/services/aula.service';
import { DietarioService } from 'src/app/services/dietario.service';
import { MenusService } from 'src/app/services/menus.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dietarios',
  templateUrl: './dietarios.component.html',
  styleUrls: ['./dietarios.component.scss']
})
export class DietariosComponent implements OnInit {
  isLoading: boolean = false;
  dietario: any = [];
  dietarioView: any[];
  aulas: any = [];
  aulaSelected: number = 0;
  menus: any;
  selected: number = 0;
  toast: any;
  fecha: any;
  alergenos: any;
  modalData: any = {};
  formPlato: FormGroup;
  formGuardarMenu: FormGroup;
  formcargarMenu: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private aulaService: AulaService,
    private dietarioService: DietarioService,
    private menusService: MenusService,
  ) {
    this.getAulas();
    this.getAlergenos();
    this.fecha = moment();
    this.formPlato = this.formBuilder.group({
      plato: ['', [Validators.required, Validators.maxLength(500)]],
      alergenos: ['', [Validators.maxLength(1000)]],
    })
    this.formGuardarMenu = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(500)]],
    })
    this.formcargarMenu = this.formBuilder.group({
      menus: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.cambiarDia();
  }
  fechaLocal(fecha) {
    return moment(fecha).format('DD-MM-Y');
  }
  alLunes() {
    this.fecha.subtract(this.fecha.day() - 1, "days");
  }
  cambiarDia(dia = undefined) {
    if (dia) this.fecha = moment(dia);
    this.alLunes();
    var item = <HTMLInputElement>document.getElementById('fecha');
    item.value = this.fecha.format('Y-MM-DD');
  }
  cambiarAula(idAula) {
    this.aulaSelected = idAula;
    this.cargarDietario();
  }
  cambiarSemana(i) {
    if (i == -1) this.fecha.subtract(1, 'week');
    else if (i == 1) this.fecha.add(1, 'week');
    this.cambiarDia();
    this.cargarDietario();
  }
  cargarDietario() {
    this.aulaService.getDietarioSemana(this.aulaSelected, this.fecha.format('Y-MM-DD')).subscribe(
      (response: any) => {
        this.dietario = response;
        this.dietarioView = this.dietarioService.formatear(this.dietario, this.fecha);
      }, (error: any) => {
        if (error.status == 403) this.userService.exit();
        else this.toast = { text: 'Error al recuperar el dietario', type: 'error' }
      }
    )
  }
  getMenus() {
    this.menusService.get().subscribe(
      (response: any) => {
        this.menus = response;
        this.ordernarMenus();
      }, (error: any) => {
        if (error.status == 403) this.userService.exit();
        else this.toast = {
          text: 'Error al recuperar los menús',
          type: 'error'
        }
      }
    )
  }
  ordernarMenus() {
    this.menus.sort((a, b) => {
      if (a < b) return -1
      else if (a > b) return 1;
      else return 0;
    })
  }
  getAulas() {
    this.userService.getAulas().subscribe(
      (response: any) => {
        this.aulas = response;
        if (this.aulas.length == 1) this.aulaSelected = this.aulas[0].id;
        else {
          const aula = this.aulas.find(x => x.default == 1);
          this.aulaSelected = aula.id;
        }
        this.cargarDietario();
      }, (error: any) => {
        if (error.status == 403) this.userService.exit();
        else this.toast = {
          text: 'Error al recuperar las aulas',
          type: 'error'
        }
      }
    )
  }
  getAlergenos() {
    if (!this.alergenos) {
      this.dietarioService.getAlergenos().subscribe(
        (response: any) => this.alergenos = response,
        (error: any) => {
          if (error.status == 403) this.userService.exit();
          else this.toast = { text: 'Error al recuperar los alergenos', type: 'error' }
        }
      )
    }
  }
  nombreAlergeno(id) {
    const item = this.alergenos.find(x => x.id == id);
    if (item) return item.value
    else return ''
  }

  // MODAL EDITAR COMIDA
  editarComida(idMenu, fecha, comida) {

    const menu = !!idMenu ? this.dietario.find(x => x.id == idMenu) : false;
    this.modalData.comida = comida;
    this.modalData.date = fecha;
    if (menu) {
      this.modalData.plato = menu[comida];
      this.modalData.id = idMenu;
      this.modalData.alergenos = menu[comida + "_allergens"];
    } else {
      this.modalData.plato = "";
      this.modalData.id = 0;
      this.modalData.alergenos = [];

    }
    this.modalData.alergenos.forEach((element) => {
      var item = <HTMLInputElement>document.getElementById('alergenos-modal-' + element);
      item.checked = true;
    });
  }
  oneditarComidaModalShow() {
    this.formPlato.controls['plato'].setValue(this.modalData.plato);
    this.formPlato.controls['alergenos'].setValue(this.modalData.alergenos);
  }
  oneditarComidaModalHide() {
    document.querySelectorAll("[name='alergenos-modal']").forEach((item: HTMLInputElement) => item.checked = false)
  }
  oneditarComidaModalAccept() {

    if (this.formPlato.valid) {
      this.modalData.plato = this.formPlato.get('plato').value;
      this.modalData.alergenos = [];
      document.querySelectorAll('input[name="alergenos-modal"]:checked').forEach((item: HTMLInputElement) => {
        this.modalData.alergenos.push(item.value);
      })
      this.dietarioService.putComida(this.aulaSelected, this.modalData).subscribe(
        (response: any) => {
          document.getElementById('editarComidaModal-close').click();
          const index = this.dietario.findIndex(x => !!x && x.id == response.id);
          if (index !== -1) {
            this.dietario[index] = response;
          } else {
            const vacio = this.dietario.findIndex(x => !x);
            this.dietario[vacio] = response;
          }
          this.dietarioView = this.dietarioService.formatear(this.dietario, this.fecha);
        }, (error: any) => {
          if (error.status == 403) this.userService.exit();
          else this.toast = { text: 'Error al guardar los cambios', type: 'error' }
        }
      )
    }
  }

  /** MODAL GUARDAR COMO MENU */
  onguardarMenuShow() {
    this.formGuardarMenu.reset();
  }
  onguardarMenuHide() {

  }
  onguardarMenuAcept() {
    if (this.formGuardarMenu.valid) {
      var data = this.formGuardarMenu.value;
      data.dias = [];

      this.dietarioView.forEach((element, index) => {
        var menu = { ...element.menu };
        menu.dia = index + 1;
        delete (menu.id);
        delete (menu.idAula);
        delete (menu.date);
        data.dias.push(menu);
      });
      this.menusService.add(data).subscribe(
        (response: any) => {
          document.getElementById('guardar-menu-close').click();
          this.menus.push(response);
        }, (error: any) => {
          if (error.status == 403) this.userService.exit();
          else this.toast = { text: 'Error al crear el menú', type: 'error' }
        }
      )
    }
  }

  /** MODAL CARGAR MENU */
  oncargarMenuShow() {
    if (!this.menus) this.getMenus();

  }
  oncargarMenuHide() {

  }
  oncargarMenuAcept() {
    if (this.formcargarMenu.valid) {
      const idMenu = this.formcargarMenu.value.menus;
      this.dietarioService.asignarMenu(this.aulaSelected, idMenu, this.fecha.format('Y-MM-DD')).subscribe(
        (response: any) => {
          document.getElementById('cargar-menu-close').click();
          this.dietario = response;
          this.dietarioView = this.dietarioService.formatear(this.dietario, this.fecha);
        }, (error: any) => {
          if (error.status == 403) this.userService.exit();
          else this.toast = { text: 'Error al asignar el menú', type: 'error' }
        }
      )

    }
  }
}
