import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export class ShedulerValidators {
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
}
