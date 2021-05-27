import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() selected: string = "";
  rol: string = undefined;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getRol().subscribe(
      (response: any) => {
        switch (response.rol) {
          case 'parent':
            this.rol = 'parent';
            break;
          case 'teacher':
          case 'admin':
            this.rol = 'teacher';
            break;
          default:
            this.userService.exit();
            break;
        }
      }, (error: any) => {
        if (error.state == 403) this.userService.exit();
      }
    )
  }

  salir() {
    this.userService.exit();
  }
}
