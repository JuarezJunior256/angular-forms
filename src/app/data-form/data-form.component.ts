import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
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
      nome: [null],
      email: [null]
    });
  }

  onSubmit() {
    console.log(this.form.value);

    this.http.post('enderecoServer/formUser', JSON.stringify(this.form.value))
       .subscribe(dados => console.log(dados));
  }

}
