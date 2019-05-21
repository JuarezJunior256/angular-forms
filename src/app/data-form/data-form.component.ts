import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from '../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br.model';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { Observable, empty } from 'rxjs';
import { VerificaEmailService } from './service/verifica-email.service';
import { map, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  form: FormGroup;
  estados: EstadoBr[];
  cidades: Cidade[];
  // estados$: Observable<EstadoBr[]>;
  cargos: any[];
  tecnologias: any[];
  newsLetterOp: any[];

  frameworks = ['Angular', 'React', 'Vue'];

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private dropdownService: DropdownService,
              private cepService: ConsultaCepService,
              private verificaEmailService: VerificaEmailService) {
                super();
               }

  ngOnInit() {

   // requisição de estados para dropdown
   this.dropdownService.getEstadosBr().subscribe(dados => this.estados = dados);
   this.cargos = this.dropdownService.getCargos();
   this.tecnologias = this.dropdownService.getTecnologias();
   // requisição de dados para radio buton
   this.newsLetterOp = this.dropdownService.getNewsLetter();
   // this.verificaEmailService.verificarEmail('').subscribe();

   /* this.form = new FormGroup({
      nome: new FormControl(),
      email: new FormControl()
    }); */
    this.form = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.min(3)]],
      email: [null, [Validators.required, Validators.email], this.validarEmail.bind(this)],
      confirmarEmail: [null, [this.equalsTo('email')]],

      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, this.cepValidator]],
        numero: [null, [Validators.required]],
        complemento: [null],
        rua: [null, [Validators.required]],
        bairro: [null, [Validators.required]],
        cidade: [null, [Validators.required]],
        estado: [null, [Validators.required]]
      }),
      cargo: [null],
      tecnologia: [null],
      newsLetter: [null],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFramewors() // formArray
    });

    this.form.get('endereco.cep').valueChanges
    .pipe(
      distinctUntilChanged(),
      tap(value => console.log(value)),
      switchMap(status => status === 'VALID' ?
      this.cepService.consultaCep(this.form.get('endereco.cep').value)
      : empty())
    ).subscribe(dados => dados ? this.populaDadosForm(dados) : {});

    this.form.get('endereco.estado').valueChanges.pipe(
      tap(estado => console.log('Novo Estado', estado)),
      map(estado => this.estados.filter(e => e.sigla === estado)),
      map(estados => estados && estados.length > 0 ? estados[0].id : empty()),
      switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId))
    ).subscribe(cidades => this.cidades = cidades);
  }

  // checkbox FormArray
  buildFramewors() {
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, this.requiredMinCheckbox(1));
  }

  // validação customizada pra checkboxes
  requiredMinCheckbox(min = 1) {
    const validator = (formArray: FormArray) => {
      const totalChecked = formArray.controls
      .map(v => v.value)
      .reduce((total, atual) => atual ? total + atual : total, 0);
      return totalChecked >= min ? null : {required: true };
    };
    return validator;
  }

  submit() {
    let valueSubmit = Object.assign({}, this.form.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
      .map((v, i) => v ? this.frameworks[i] : null)
      .filter(v => v !== null)
    });

    console.log(valueSubmit);

    this.http
        .post('https://httpbin.org/post', JSON.stringify({}))
        .subscribe(
          dados => {
            console.log(dados);
            // reseta o form
            // this.formulario.reset();
            // this.resetar();
          },
          (error: any) => alert('erro')
        );
  }

  // verificar email assincrono
  validarEmail(formControl: FormControl) {
    return this.verificaEmailService.verificarEmail(formControl.value).pipe(
      map(emailTrue => emailTrue ? { emailInvalido: true} : null));
  }

  // comparar campos iguais
  equalsTo(otherField: string) {
    const validator = (formControl: FormControl) => {
      if (otherField == null) {
        throw new Error('É necessário informar um campo');
      }

      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherField);

      if (!field) {
        throw new Error('É necessário informar um campo válido');
      }

      if (field.value !== formControl.value) {
        return { equalsTo: true };
      }

      return null;
    };
    return validator;
  }

  setarCargo() {
    const cargo = {nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'};
    this.form.get('cargo').setValue(cargo);
  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 && obj2;
  }

  // verifica condição para caso aja erro no email
  verificarEmailInvalido() {
    if (this.form.get('email').errors) { // se tiver erro entra no if
      return  this.form.get('email').errors['email'] && this.form.get('email').touched;
    }
  }

  // consulta cep
  consultaCep() {
    // recebendo valor do campo cep
    const cep = this.form.get('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCep(cep)
        .subscribe(dados => this.populaDadosForm(dados));
    }
   }

   // validando cep
   cepValidator(control: FormControl) {
      const cep = control.value;
      if (cep && cep !== '') {
        const validacep = /^[0-9]{8}$/;
        return validacep.test(cep) ? null : { cepInvalido: true };
      }
      return null;
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
