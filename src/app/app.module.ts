import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';

import {NgxMaskModule} from 'ngx-mask';

import { AppComponent } from './app.component';
import { TemplateFormModule } from './template-form/template-form.module';
import { DataFormModule } from './data-form/data-form.module';
import { MeuFormComponent } from './meu-form/meu-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MeuFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TemplateFormModule,
    FormsModule,
    ReactiveFormsModule,
    DataFormModule,
    NgxMaskModule.forRoot(),
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
