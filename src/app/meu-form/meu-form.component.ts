import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';



@Component({
  selector: 'app-meu-form',
  templateUrl: './meu-form.component.html',
  styleUrls: ['./meu-form.component.css']
})
export class MeuFormComponent implements OnInit {

  form: FormGroup;
  generos = [{valor: 'm', nome: 'Masculino'}, {valor: 'f', nome: 'Feminino'}];
  pessoaFJ = [{valor: 'pf', nome: 'Pessoa física'}, {valor: 'pj', nome: 'Pessoa jurídica'}];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.formulario();
  }

  onSubmit() {
    console.log(this.form.value);

    if (this.form.valid) {
      this.resetar();
      this.formulario();
      console.log('Form ok!');
    } else {
      this.verificarCampos(this.form);
    }
  }

  formulario() {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
      pessoaFJ: ['pf', Validators.required],
      sexo: ['m', Validators.required],
      cpf: [null, Validators.required],
      telefone: [null, Validators.required],
      nasc: [null, Validators.required],
      // email: [null, [CustomValidators.email, Validators.required]]
    });
  }

  // verificar todos campos
  verificarCampos(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const control = formGroup.get(campo);
      control.markAsTouched();
    });
  }

  // resetar form
  resetar() {
    this.form.reset();
  }

  verificarErro(campo) {
    return !this.form.get(campo).valid &&
    (this.form.get(campo).touched || this.form.get(campo).dirty);
  }

}
