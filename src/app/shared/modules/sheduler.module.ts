import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { ShedulerComponent } from '../components/sheduler/sheduler.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ShedulerComponent],
  exports: [ShedulerComponent]
})
export class ShedulerModule {}