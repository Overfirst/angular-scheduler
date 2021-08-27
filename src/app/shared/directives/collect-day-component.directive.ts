import { Directive, Input } from '@angular/core';
import { CollectDayComponentData } from "../interfaces";

@Directive({
  selector: '[collectDayComponent]'
})
export class ShedulerCollectDayComponentDirective {
  @Input() public set data(data: CollectDayComponentData) {
    data.collection.push(data.component);
  }
}
