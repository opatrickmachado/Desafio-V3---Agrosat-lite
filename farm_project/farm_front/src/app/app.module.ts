import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BasemapComponent } from './basemap/basemap.component';
import { FarmComponent } from './farm/farm.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    BasemapComponent,
    FarmComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
		NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
		HttpClientModule,
    ToastrModule.forRoot({
			timeOut: 2000,
			preventDuplicates: true
		}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
