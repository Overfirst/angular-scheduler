import { NgModule } from '@angular/core';
import { SharedModule } from './modules/shared/shared.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SharedModule, SchedulerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
