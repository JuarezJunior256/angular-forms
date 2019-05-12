import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { log } from 'util';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from '../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br.model';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  form: FormGroup;
  estados: EstadoBr[];

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private dropdownService: DropdownService) { }

  ngOnInit() {

    /* this.form = new FormGroup({
      nome: new FormControl(),
      email: new FormControl()
    }); */
    this.getEstados();
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

    if (this.form.valid) {
      this.http.post('enderecoServer/formUser', JSON.stringify(this.form.value))
      .subscribe(dados => {
        console.log(dados);

        // resetando formulário
        this.resetar();
      }, (error: any) => alert('erro'));
    } else {
      this.verificaValidacoesForm(this.form);
    }

  }

  getEstados() {
    this.dropdownService.getEstadosBr().subscribe(dados => {
      this.estados = dados,
      console.log(dados);
    });
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    // percorrendo chaves e valores do formulario
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      // verificando se os campos foram "sujos"
      controle.markAsDirty();
      if (controle instanceof FormGroup) { // caso tenha outro formulario aninhado, repete o processo de validação
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar() {
    this.form.reset();
  }

  // setença para verificação de campo do formulário
  verificarErro(campo) {
     return !this.form.get(campo).valid && (this.form.get(campo).touched || this.form.get(campo).dirty);
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

  // consulta cep
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
