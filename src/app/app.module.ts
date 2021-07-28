import { NgModule } from '@angular/core';
import { SharedModule } from './shared/modules/shared.module';
import { ShedulerModule } from './shared/modules/sheduler.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SharedModule, ShedulerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
