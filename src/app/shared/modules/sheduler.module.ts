import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { ShedulerComponent } from '../components/sheduler/sheduler.component';
import { ShedulerDayViewComponent } from '../components/sheduler/views/sheduler-day-view/sheduler-day-view.component';
import { ShedulerWeekViewComponent } from '../components/sheduler/views/sheduler-week-view/sheduler-week-view.component';
import { ShedulerMonthViewComponent } from '../components/sheduler/views/sheduler-month-view/sheduler-month-view.component';
import { ShedulerDateSwitcherComponent } from '../components/sheduler/sheduler-date-switcher/sheduler-date-switcher.component';
import { ShedulerViewDetalizationComponent } from '../components/sheduler/sheduler-view-detalization/sheduler-view-detalization.component';
import { ShedulerEventModalComponent } from '../components/sheduler/sheduler-event-modal/sheduler-event-modal.component';
import { ShedulerCollectEventBoxDirective } from '../directives/collect-event-box.directive';
import { ShedulerCollectDayComponentDirective } from "../directives/collect-day-component.directive";
import { ShedulerConfirmModalComponent } from '../components/sheduler/sheduler-event-modal/sheduler-confirm-modal/sheduler-confirm-modal.component';
import { ShedulerYearViewComponent } from '../components/sheduler/views/sheduler-year-view/sheduler-year-view.component';
import { DatePipe } from "@angular/common";

@NgModule({
  imports: [SharedModule],
  declarations: [
    ShedulerComponent,
    ShedulerDayViewComponent,
    ShedulerWeekViewComponent,
    ShedulerMonthViewComponent,
    ShedulerYearViewComponent,
    ShedulerDateSwitcherComponent,
    ShedulerViewDetalizationComponent,
    ShedulerEventModalComponent,
    ShedulerConfirmModalComponent,
    ShedulerCollectEventBoxDirective,
    ShedulerCollectDayComponentDirective
  ],
  exports: [
    ShedulerComponent,
    ShedulerDayViewComponent,
    ShedulerWeekViewComponent,
    ShedulerMonthViewComponent,
    ShedulerYearViewComponent,
    ShedulerDateSwitcherComponent,
    ShedulerEventModalComponent,
    ShedulerConfirmModalComponent,
    ShedulerViewDetalizationComponent
  ],
  providers: [DatePipe]
})
export class ShedulerModule {}
