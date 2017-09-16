import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { MetaphorComponent } from './metaphor/metaphor.component';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

import { QualitiesLoaderService } from './qualitiesloader.service';
import { SRSChooserService } from './srschooser.service';
import { PartsSelectorService } from './partsselector.service';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './spinner.service'


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    MetaphorComponent,
    PdfViewerComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2GoogleChartsModule,
    AlertModule.forRoot()
  ],
  entryComponents: [
          SpinnerComponent
  ],
  providers: [SRSChooserService, QualitiesLoaderService, PartsSelectorService, SpinnerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
