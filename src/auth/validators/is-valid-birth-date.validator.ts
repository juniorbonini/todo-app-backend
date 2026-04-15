import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidBirthDate', async: false })
export class IsValidBirthDateValidator implements ValidatorConstraintInterface {
  private errorMessage = 'Data de nascimento inválida.';

  validate(value: string) {
    if (!value) {
      return true;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      this.errorMessage = 'Use o formato DD/MM/AAAA.';
      return false;
    }

    const [day, month, year] = value.split('/').map(Number);

    if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) {
      this.errorMessage = 'Data de nascimento inválida.';
      return false;
    }

    const birthDate = new Date(year, month - 1, day);

    if (
      Number.isNaN(birthDate.getTime()) ||
      birthDate.getFullYear() !== year ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day
    ) {
      this.errorMessage = 'Data de nascimento inválida.';
      return false;
    }

    const today = new Date();
    const todayAtMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    if (birthDate >= todayAtMidnight) {
      this.errorMessage = 'Data de nascimento inválida.';
      return false;
    }

    return true;
  }

  defaultMessage() {
    return this.errorMessage;
  }
}
