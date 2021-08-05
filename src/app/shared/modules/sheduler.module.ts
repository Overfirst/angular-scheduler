import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { ShedulerComponent } from '../components/sheduler/sheduler.component';
import { ShedulerMonthViewComponent } from '../components/sheduler/views/sheduler-month-view/sheduler-month-view.component';
import { ShedulerDateSwitcherComponent } from '../components/sheduler/sheduler-date-switcher/sheduler-date-switcher.component';
import { ShedulerMonthViewDayDetalizationComponent } from '../components/sheduler/views/sheduler-month-view/sheduler-month-view-day-detalization/sheduler-month-view-day-detalization.component';
import { ShedulerEventModalComponent } from '../components/sheduler/sheduler-event-modal/sheduler-event-modal.component';
import { ShedulerCollectEventBoxDirective } from '../directives/collect-event-box.directive';
import { ShedulerConfirmModalComponent } from '../components/sheduler/sheduler-event-modal/sheduler-confirm-modal/sheduler-confirm-modal.component';
import { DatePipe } from "@angular/common";

@NgModule({
  imports: [SharedModule],
  declarations: [
    ShedulerComponent,
    ShedulerMonthViewComponent,
    ShedulerDateSwitcherComponent,
    ShedulerMonthViewDayDetalizationComponent,
    ShedulerEventModalComponent,
    ShedulerConfirmModalComponent,
    ShedulerCollectEventBoxDirective
  ],
  exports: [
    ShedulerComponent,
    ShedulerMonthViewComponent,
    ShedulerDateSwitcherComponent,
    ShedulerEventModalComponent,
    ShedulerConfirmModalComponent,
    ShedulerMonthViewDayDetalizationComponent
  ],
  providers: [DatePipe]
})
export class ShedulerModule {}
