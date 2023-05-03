import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysAgo',
})
export class DaysAgoPipe implements PipeTransform {
  transform(value: string): string {
    const now = new Date();
    const takenDate = new Date(value);
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(
      Math.abs((takenDate.getTime() - now.getTime()) / oneDayInMs)
    );

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} Days Ago`;
    }
  }
}

@NgModule({
  declarations: [DaysAgoPipe],
  exports: [DaysAgoPipe],
})
export class DaysAgoPipeModule {}
