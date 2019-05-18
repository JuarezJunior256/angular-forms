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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, CustomValidators.email]
    });

  }

  onSubmit() {
    console.log(this.form.value);

    if (this.form.valid) {
      this.form.reset();
      console.log('Form ok!');
    } else {
      this.verificarCampos(this.form);
    }
  }

  // verificar todos campos
  verificarCampos(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const control = formGroup.get(campo);
      control.markAsTouched();
    });
  }

}
