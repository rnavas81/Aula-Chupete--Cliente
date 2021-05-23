import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenusService } from 'src/app/services/menus.service';
import { UserService } from 'src/app/services/user.service';

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

  constructor(
    private menusService:MenusService,
    private userService: UserService,
    private route: Router
    ) {

  }

  ngOnInit(): void {
    this.getMenus();
  }
  getMenus(){
    this.menusService.get().subscribe(
      (response:any)=>{
        this.menus=response;
      },(error:any)=>{
        if(error.status==403)this.userService.exit();
        else this.toast={text:'Error al recuperar los menús',type:'error'}
      }
    )
  }
  editar(idMenu){
    this.route.navigate(['/menus/formulario'],{fragment:idMenu});
  }
  seleccionar(id = null) {
    if (id) this.selected = id;
    else this.selected = 0;
  }
  // MODAL ELIMINAR MODAL
  oneliminarModalAcept() {
    const index = this.menus.find(x => x.id == this.selected);
    if (this.selected > 0 && index) {
      this.menus.splice(index, 1);
    }
  }

}
