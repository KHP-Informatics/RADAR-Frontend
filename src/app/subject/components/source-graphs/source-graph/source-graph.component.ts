import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { Store } from '@ngrx/store'

import { DataType } from '../../../../shared/enums/data-type.enum'
import { ChartData } from '../../../../shared/models/chart-data.model'
import { AppConfig } from '../../../../shared/utils/config'
import * as fromSubjectPage from '../../../store'
import * as sensorsDataActions from '../../../store/sensors-data/sensors-data.actions'

@Component({
  selector: 'app-source-graph',
  template: `
    <div class="label">{{ label }}</div>

    <div class="loading" *ngIf="!isLoaded">
      <mat-spinner></mat-spinner>
    </div>
    <div class="nodata" *ngIf="!(sensorData) && isLoaded">
      <p class="emoji">🤷‍♀️</p>
      <p>No data found.</p>
    </div>

    <app-chart-base-line
      class="chart"
      *ngIf="sensorData && isLoaded && isSingle"
      [chartData]="sensorData"
      [hasGradient]="hasGradient"
      [hasYAxis]="true"
      [hasTooltip]="true"
      [margin]="graphMargins"
      (tooltipMouseMove)="onTooltipMouseMove($event)"
    ></app-chart-base-line>

    <app-chart-base-multi-line
      class="chart"
      *ngIf="sensorData && isLoaded && !(isSingle)"
      [chartData]="sensorData"
      [keys]="keys"
      [hasYAxis]="true"
      [hasTooltip]="true"
      [margin]="graphMargins"
      (tooltipMouseMove)="onTooltipMouseMove($event)"
    ></app-chart-base-multi-line>
  `,
  styleUrls: ['./source-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceGraphComponent {
  @Input() isLoaded
  @Input() sensorData: ChartData
  @Input() sensorId
  @Input() type

  graphMargins = { top: 32, right: 16, bottom: 32, left: 48 }

  get keys() {
    return AppConfig.config && AppConfig.config.sensors[this.type].keys
  }

  get hasGradient() {
    return (
      AppConfig.config && AppConfig.config.sensors[this.type].chart.gradient
    )
  }

  get isSingle() {
    return (
      AppConfig.config &&
      AppConfig.config.sensors[this.type].dataType === DataType.single
    )
  }

  get label() {
    return (
      AppConfig.config &&
      AppConfig.config.sensors[this.type].label[AppConfig.language]
    )
  }

  constructor(private store: Store<fromSubjectPage.State>) {}

  onTooltipMouseMove(date: Date) {
    this.store.dispatch(new sensorsDataActions.SetTooltipDate(date))
  }
}
