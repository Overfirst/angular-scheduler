import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sheduler-tools',
  templateUrl: './sheduler-tools.component.html',
  styleUrls: ['./sheduler-tools.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerToolsComponent implements OnInit {
  public opened = false;

  constructor() { }

  ngOnInit(): void {
  }
}
