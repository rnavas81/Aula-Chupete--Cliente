import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  menus: any = [];
  isLoading: boolean = false;
  selected: number = 0;
  toast: any;

  constructor() {

  }

  ngOnInit(): void {

  }
  seleccionar(id = null) {
    if (id) this.selected = id;
    else this.selected = 0;
  }
  // MODAL ELIMINAR MODAL
  oneliminarModalHide(){
    this.seleccionar();
  }
  oneliminarModalAcept() {
    const index = this.menus.find(x => x.id == this.selected);
    if (this.selected > 0 && index) {
      this.menus.splice(index, 1);
    }
  }

  // MODAL FORMULARIO MENU
  onmenuFormModalShow() { }
  onmenuFormModalHide() { }
  onmenuFormModalAccept() {

  }

}
