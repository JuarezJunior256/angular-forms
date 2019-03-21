import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  };
  onSubmit(form) {
    console.log(form);
  }
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  aplicaCssErro(campo) {
    return {
      'has-error': !campo.valid && campo.touched,
      'has-feedback': !campo.valid && campo.touched
    };
  }

  consultaCep(cep) {

    cep = cep.replace(/\D/g, '');

    if (cep !== '') {

      const validaCep = /^[0-9]{8}$/;

      if (validaCep.test(cep)) {
        this.http.get(`//viacep.com.br/ws/${cep}/json`)
          .subscribe(dados => console.log(dados));
      }
    }
  }

}
