import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { ShedulerComponent } from '../components/sheduler/sheduler.component';
import { ShedulerMonthViewComponent } from '../components/sheduler/views/sheduler-month-view/sheduler-month-view.component';
import { ShedulerDateSwitcherComponent } from '../components/sheduler/sheduler-date-switcher/sheduler-date-switcher.component';
import { ShedulerMonthViewDayDetalizationComponent } from '../components/sheduler/views/sheduler-month-view/sheduler-month-view-day-detalization/sheduler-month-view-day-detalization.component';
import { ShedulerEventModalComponent } from '../components/sheduler/sheduler-event-modal/sheduler-event-modal.component';
import { ShedulerCollectEventBoxDirective } from '../directives/collect-event-box.directive';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ShedulerComponent,
    ShedulerMonthViewComponent,
    ShedulerDateSwitcherComponent,
    ShedulerMonthViewDayDetalizationComponent,
    ShedulerEventModalComponent,
    ShedulerCollectEventBoxDirective
  ],
  exports: [
    ShedulerComponent,
    ShedulerMonthViewComponent,
    ShedulerDateSwitcherComponent,
    ShedulerEventModalComponent,
    ShedulerMonthViewDayDetalizationComponent
  ]
})
export class ShedulerModule {}
