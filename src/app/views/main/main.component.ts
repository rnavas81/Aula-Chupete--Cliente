import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private route: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getRol().subscribe(
      (response: any) => {
        console.log(response);
        switch (response.rol) {
          case 'parent':
            this.route.navigate(["/main/parent"]);
            break;
          case 'teacher':
          case 'admin':
            this.route.navigate(["/main/teacher"]);
            break;
          default:
            this.userService.exit();
            break;
        }
        if (response == 'parent') {

        }
      },
    )
  }

}
