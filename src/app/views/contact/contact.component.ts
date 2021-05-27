import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  isLogged: boolean=false;
  toast:any;
  form:FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public location:Location,
  ) {
    userService.isLogged().subscribe(
      response => this.isLogged=true
    )
    this.form = this.formBuilder.group({
      message: ["", [Validators.required, Validators.maxLength(1000)]],
    });
   }

  ngOnInit(): void {
  }

  enviar(){
    this.form.get('message').markAsTouched();
    if(this.form.valid){
      this.userService.sendMessage(this.form.value).subscribe(
        response=>this.toast={text:'Mensaje enviado',type:'sucess'}
        ,(error:any)=>this.toast={text:'Error al enviar el mensaje',type:'error'}
      )

    }
  }

}
