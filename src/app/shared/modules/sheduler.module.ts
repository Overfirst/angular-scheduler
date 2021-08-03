import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { ShedulerComponent } from '../components/sheduler/sheduler.component';
import { ShedulerMonthViewComponent } from '../components/sheduler/views/sheduler-month-view/sheduler-month-view.component';
import { ShedulerDateSwitcherComponent } from '../components/sheduler/sheduler-date-switcher/sheduler-date-switcher.component';
import { ShedulerCollectEventBoxDirective } from '../directives/collect-event-box.directive';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ShedulerComponent,
    ShedulerMonthViewComponent,
    ShedulerDateSwitcherComponent,
    ShedulerCollectEventBoxDirective
  ],
  exports: [
    ShedulerComponent,
    ShedulerMonthViewComponent,
    ShedulerDateSwitcherComponent
  ]
})
export class ShedulerModule {}
