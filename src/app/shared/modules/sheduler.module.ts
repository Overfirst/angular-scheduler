import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { ShedulerComponent } from '../components/sheduler/sheduler.component';
import { ShedulerMonthViewComponent } from '../components/sheduler/views/sheduler-month-view/sheduler-month-view.component';
import { ShedulerToolsComponent } from '../components/sheduler/sheduler-tools/sheduler-tools.component';
import { ShedulerDateSwitcherComponent } from '../components/sheduler/sheduler-date-switcher/sheduler-date-switcher.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ShedulerComponent,
    ShedulerMonthViewComponent,
    ShedulerToolsComponent,
    ShedulerDateSwitcherComponent
  ],
  exports: [
    ShedulerComponent,
    ShedulerMonthViewComponent,
    ShedulerToolsComponent,
    ShedulerDateSwitcherComponent
  ]
})
export class ShedulerModule {}