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


    this.http.post('enderecoServer/formUser', JSON.stringify(form.value))
       .subscribe(dados => console.log(dados));
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

  consultaCep(cep, form) {

    cep = cep.replace(/\D/g, '');

    if (cep !== '') {

      const validaCep = /^[0-9]{8}$/;

      if (validaCep.test(cep)) {
        this.http.get(`//viacep.com.br/ws/${cep}/json`)
          .subscribe(dados => this.populaDadosForm(dados, form));
      }
    }
  }

  populaDadosForm(dados, form) {
     /*form.setValue({
          nome: null,
          email: null,
          endereco: {
             rua: dados.logradouro,
             cep: dados.cep,
             numero: '',
             complemento: dados.complemento,
             bairro: dados.bairro,
             cidade: dados.localidade,
             estado: dados.uf
          }
     });*/

     form.form.patchValue({
        endereco: {
          rua: dados.logradouro,
          cep: dados.cep,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf
        }
     });
  }

}
