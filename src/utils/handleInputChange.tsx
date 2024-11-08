import type { ChangeEvent } from 'react';

export const validClasses = ['border-green-600', 'text-green-900'];
export const errorClasses = ['border-red-600', 'text-red-900'];

export default function handleInputChange(
  event: ChangeEvent<HTMLInputElement>,
  regExp: RegExp
) {
  const value = event.currentTarget.value;
  const isNotAValidStudentNumber = !regExp.test(value);
  if (value.length === 0) {
    event.currentTarget.classList.remove(...errorClasses);
    return event.currentTarget.classList.remove(...validClasses);
  }
  if (isNotAValidStudentNumber) {
    event.currentTarget.classList.add(...errorClasses);
    return event.currentTarget.classList.remove(...validClasses);
  }
  event.currentTarget.classList.add(...validClasses);
  event.currentTarget.classList.remove(...errorClasses);
}
