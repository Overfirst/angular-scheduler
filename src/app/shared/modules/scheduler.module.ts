import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { SchedulerComponent } from '../components/scheduler/scheduler.component';
import { SchedulerDayViewComponent } from '../components/scheduler/views/scheduler-day-view/scheduler-day-view.component';
import { SchedulerWeekViewComponent } from '../components/scheduler/views/scheduler-week-view/scheduler-week-view.component';
import { SchedulerMonthViewComponent } from '../components/scheduler/views/scheduler-month-view/scheduler-month-view.component';
import { SchedulerDateSwitcherComponent } from '../components/scheduler/scheduler-date-switcher/scheduler-date-switcher.component';
import { SchedulerViewDetalizationComponent } from '../components/scheduler/scheduler-view-detalization/scheduler-view-detalization.component';
import { SchedulerEventModalComponent } from '../components/scheduler/scheduler-event-modal/scheduler-event-modal.component';
import { SchedulerCollectEventBoxDirective } from '../directives/collect-event-box.directive';
import { SchedulerCollectDayComponentDirective } from "../directives/collect-day-component.directive";
import { SchedulerConfirmModalComponent } from '../components/scheduler/scheduler-event-modal/scheduler-confirm-modal/scheduler-confirm-modal.component';
import { SchedulerYearViewComponent } from '../components/scheduler/views/scheduler-year-view/scheduler-year-view.component';
import { DatePipe } from "@angular/common";

@NgModule({
  imports: [SharedModule],
  declarations: [
    SchedulerComponent,
    SchedulerDayViewComponent,
    SchedulerWeekViewComponent,
    SchedulerMonthViewComponent,
    SchedulerYearViewComponent,
    SchedulerDateSwitcherComponent,
    SchedulerViewDetalizationComponent,
    SchedulerEventModalComponent,
    SchedulerConfirmModalComponent,
    SchedulerCollectEventBoxDirective,
    SchedulerCollectDayComponentDirective
  ],
  exports: [
    SchedulerComponent,
    SchedulerDayViewComponent,
    SchedulerWeekViewComponent,
    SchedulerMonthViewComponent,
    SchedulerYearViewComponent,
    SchedulerDateSwitcherComponent,
    SchedulerEventModalComponent,
    SchedulerConfirmModalComponent,
    SchedulerViewDetalizationComponent
  ],
  providers: [DatePipe]
})
export class SchedulerModule {}
