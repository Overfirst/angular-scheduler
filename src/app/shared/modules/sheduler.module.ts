import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { ShedulerComponent } from '../components/sheduler/sheduler.component';
import { ShedulerMonthViewComponent } from '../components/sheduler/views/sheduler-month-view/sheduler-month-view.component';
import { ShedulerDateSwitcherComponent } from '../components/sheduler/sheduler-date-switcher/sheduler-date-switcher.component';
import { ShedulerViewDetalizationComponent } from '../components/sheduler/sheduler-view-detalization/sheduler-view-detalization.component';
import { ShedulerEventModalComponent } from '../components/sheduler/sheduler-event-modal/sheduler-event-modal.component';
import { ShedulerCollectEventBoxDirective } from '../directives/collect-event-box.directive';
import { ShedulerConfirmModalComponent } from '../components/sheduler/sheduler-event-modal/sheduler-confirm-modal/sheduler-confirm-modal.component';
import { ShedulerYearViewComponent } from '../components/sheduler/views/sheduler-year-view/sheduler-year-view.component';
import { DatePipe } from "@angular/common";

@NgModule({
  imports: [SharedModule],
  declarations: [
    ShedulerComponent,
    ShedulerMonthViewComponent,
    ShedulerYearViewComponent,
    ShedulerDateSwitcherComponent,
    ShedulerViewDetalizationComponent,
    ShedulerEventModalComponent,
    ShedulerConfirmModalComponent,
    ShedulerCollectEventBoxDirective
  ],
  exports: [
    ShedulerComponent,
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
