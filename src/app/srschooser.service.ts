import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SRS } from './definitions';

@Injectable()
export class SRSChooserService {
  private activeSRS: Subject<SRS> = new Subject<SRS>();

  setSRS(srsinput): void {
    console.log('Setting new srs: ' + srsinput.name)
    this.activeSRS.next(srsinput);
  }
  
  getSRS(): Observable<SRS> {
    return this.activeSRS.asObservable();
  }
}
