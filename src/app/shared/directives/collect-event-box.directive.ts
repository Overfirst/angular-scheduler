import { Input } from '@angular/core';
import { Directive, ElementRef } from '@angular/core';
import { ShedulerService } from '../services/sheduler.service';
import {ViewComponent} from "../interfaces";

@Directive({
  selector: '[collectEventBox]'
})
export class ShedulerCollectEventBoxDirective {
  constructor(private elementRef: ElementRef, private service: ShedulerService) {
    // this.service.eventBoxes.push(elementRef.nativeElement);
  }

  @Input() public set viewComponent(component: ViewComponent) {
    if (!this.service.eventBoxes.has(component)) {
      this.service.eventBoxes.set(component, []);
    }

    this.service.eventBoxes.get(component)!.push(this.elementRef.nativeElement);
  }
}
