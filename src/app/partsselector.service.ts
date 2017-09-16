import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Parts } from './definitions';

@Injectable()
export class PartsSelectorService {
  private activeParts: Subject<Parts> = new Subject<Parts>();

  setParts(inputParts): void {
    console.log('Setting new parts name: ' + inputParts.name)
    this.activeParts.next(inputParts);
  }
  
  getParts(): Observable<Parts> {
    return this.activeParts.asObservable();
  }
}