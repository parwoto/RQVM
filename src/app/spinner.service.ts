import { Injectable, ApplicationRef, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SpinnerComponent } from './spinner/spinner.component';
import { AppComponent } from './app.component'

@Injectable()
export class SpinnerService {
  private spinnerComp: ComponentRef<SpinnerComponent>;
  public vRef: ViewContainerRef;

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  public start() {
    this.vRef = (this.appRef.components[0].instance as AppComponent).viewRef;
    let factory = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent);
    console.log(factory);
    console.log(this.vRef);
    this.spinnerComp = this.vRef.createComponent(factory);
  }

  public stop() {
    if (this.spinnerComp) {
      this.spinnerComp.destroy();
    }
  }

}
