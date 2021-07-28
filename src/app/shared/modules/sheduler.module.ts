import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { ShedulerComponent } from '../components/sheduler/sheduler.component';
import { ShedulerMonthViewComponent } from '../components/sheduler/views/sheduler-month-view/sheduler-month-view.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ShedulerComponent, ShedulerMonthViewComponent],
  exports: [ShedulerComponent, ShedulerMonthViewComponent]
})
export class ShedulerModule {}