import { Directive, ElementRef } from '@angular/core';
import { ShedulerService } from '../services/sheduler.service';

@Directive({
  selector: '[collectEventBox]'
})
export class ShedulerCollectEventBoxDirective {
  constructor(private elementRef: ElementRef, private service: ShedulerService) {
    this.service.eventBoxes.add(elementRef.nativeElement);    
  }
}