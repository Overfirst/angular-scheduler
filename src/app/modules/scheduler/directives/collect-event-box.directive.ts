import { Input } from '@angular/core';
import { Directive, ElementRef } from '@angular/core';
import { SchedulerService } from '../services/scheduler.service';
import { ViewComponent } from "../interfaces";

@Directive({
  selector: '[collectEventBox]'
})
export class SchedulerCollectEventBoxDirective {
  constructor(private elementRef: ElementRef, private service: SchedulerService) {}

  @Input() public set viewComponent(component: ViewComponent) {
    if (!this.service.eventBoxes.has(component)) {
      this.service.eventBoxes.set(component, []);
    }

    this.service.eventBoxes.get(component)!.push(this.elementRef.nativeElement);
  }
}
