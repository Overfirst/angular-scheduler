import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isSameMinute } from "date-fns";

export class SchedulerValidators {
  static endDateBeforeStartDate(connectControl: AbstractControl): ValidatorFn {
    return function(control: AbstractControl): ValidationErrors | null {
      const startDate = new Date(connectControl.value);
      const endDate = new Date(control.value);

      if (endDate < startDate) {
        return { error: 'The end date cannot be earlier than the start date!' };
      }

      return null;
    }
  }

  static endDateEqualStartDate(connectControl: AbstractControl): ValidatorFn {
    return function(control: AbstractControl): ValidationErrors | null {
      const startDate = new Date(connectControl.value);
      const endDate = new Date(control.value);

      if (isSameMinute(startDate, endDate)) {
        return { error: 'The end date cannot be equal than the start date!' };
      }

      return null;
    }
  }
}
