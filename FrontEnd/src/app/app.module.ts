import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http'; //NEW

//services
import { AuthService } from './shared/services/auth.service';
import { ErrorService } from './shared/services/error.service';
import { PackageInformationService } from './shared/services/package-information.service';
import { MessageService } from './shared/services/message.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule
  ],
  providers: [
    AuthService,
    ErrorService,
    PackageInformationService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
