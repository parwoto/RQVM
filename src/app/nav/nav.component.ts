import { Component, OnInit } from '@angular/core';
import { SRSChooserService } from '../srschooser.service';
import { QualitiesLoaderService } from '../qualitiesloader.service';
import { SRS } from '../definitions';
import { SpinnerService } from '../spinner.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
  //  　providers: [SRSChooserService]
})
export class NavComponent implements OnInit {

  srsselected: SRS;
  constructor(
    private srschooser: SRSChooserService,
    private qualitiesLoaderService: QualitiesLoaderService,
    private _spinner : SpinnerService) {
  }

  ngOnInit() {
  }

  aisSelected(){
    console.log('Menu: AIS selected on:', new Date().getTime());
    this.srsselected = {
      id: 0, 
      name:'SRS of Academic Information System', 
      pdfSRC: '../assets/srs/ais.pdf', 
      quality: this.qualitiesLoaderService.AISSection3
    };

    this.srschooser.setSRS(this.srsselected);
  }

  lisSelected(){
    console.log('Menu: LIS selected on:', new Date().getTime());
    this.srsselected = {
      id: 1, 
      name:'SRS of Library Information System', 
      pdfSRC: '../assets/srs/lis.pdf', 
      quality: this.qualitiesLoaderService.LISSection3
    };

    this.srschooser.setSRS(this.srsselected);
  }

  testSpinner(){
    this._spinner.start();
    setTimeout(() => this._spinner.stop(), 5000);
  }
}
