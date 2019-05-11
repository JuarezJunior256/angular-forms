import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { log } from 'util';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {

    /* this.form = new FormGroup({
      nome: new FormControl(),
      email: new FormControl()
    }); */

    this.form = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.min(3)]],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required]],
        numero: [null, [Validators.required]],
        complemento: [null],
        rua: [null, [Validators.required]],
        bairro: [null, [Validators.required]],
        cidade: [null, [Validators.required]],
        estado: [null, [Validators.required]]
      })
    });
  }

  onSubmit() {
    console.log(this.form.value);

    this.http.post('enderecoServer/formUser', JSON.stringify(this.form.value))
       .subscribe(dados => {
         console.log(dados);

         // resetando formulário
         this.resetar();
       }, (error: any) => alert('erro'));
  }

  resetar() {
    this.form.reset();
  }

  // setença para verificação de campo do formulário
  verificarErro(campo) {
     return !this.form.get(campo).valid && this.form.get(campo).touched;
  }
  // verifica condição para caso aja erro no email
  verificarEmailInvalido() {
    if (this.form.get('email').errors) { // se tiver erro entra no if
      return  this.form.get('email').errors['email'] && this.form.get('email').touched;
    }
  }
  // aplicar css no campo do fomulário, caso aja erro.
  aplicarCssErro(campo) {
    return {
      'has-error': this.verificarErro(campo),
      'has-feedback': this.verificarErro(campo)
    };
  }

  //consulta cep
  consultaCep() {
    let cep = this.form.get('endereco.cep').value;
    cep = cep.replace(/\D/g, '');

    if (cep !== '') {

      const validaCep = /^[0-9]{8}$/;

      if (validaCep.test(cep)) {
        this.http.get(`//viacep.com.br/ws/${cep}/json`)
          .subscribe(dados => this.populaDadosForm(dados));
      }
    }
  }

  populaDadosForm(dados) {
    this.form.patchValue({
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
