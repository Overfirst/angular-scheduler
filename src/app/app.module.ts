import { NgModule } from '@angular/core';
import { SharedModule } from './shared/modules/shared.module';
import { SchedulerModule } from './shared/modules/scheduler.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SharedModule, SchedulerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
