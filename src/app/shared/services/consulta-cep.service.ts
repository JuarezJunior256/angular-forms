import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  // consulta cep
  consultaCep(cep: string) {
    cep = cep.replace(/\D/g, '');

    if (cep !== '') {

      const validaCep = /^[0-9]{8}$/;

      if (validaCep.test(cep)) {
        return this.http.get(`//viacep.com.br/ws/${cep}/json`);
      }
    }

    return of({});
  }
}
