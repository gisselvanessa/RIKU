import {AbstractControl, FormControl, FormGroup, ValidationErrors} from "@angular/forms";

export function emailValidator(control: FormControl): { [p: string]: any } | null {
    const emailRegexp =/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
    return null;
}

export class SpaceValidator {
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
    if((control.value as string).indexOf(' ') >= 0){
      return {cannotContainSpace: true}
    }

    return null;
  }
}

export class EmailMatchValidator {
  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
}

export function samePasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup): ValidationErrors | null => {
    let pass = group.get(passwordKey)?.value;
    let confirmPass = group.get(passwordConfirmationKey)?.value;
    return pass === confirmPass ? null : { mismatchedPasswords: true }
  }
}


export class CustomSpecialCharValidators {
  static specialCharValidator(control: FormControl): { [key: string]: boolean } | null {
      const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (control.value && nameRegexp.test(control.value)) {
         return { specialCharValidator: true };
      }else{
        return null;
      }

  }
}

