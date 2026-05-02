import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { Hermano, UpsertHermanoPayload } from '../../models/hermano.model';

const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

function dniValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim().toUpperCase();
    if (!raw) {
      return null;
    }

    const matches = /^(\d{8})([A-HJ-NP-TV-Z])$/.exec(raw);
    if (!matches) {
      return { dniFormat: true };
    }

    const number = Number(matches[1]);
    const letter = matches[2];
    const expected = DNI_LETTERS[number % 23];

    return expected === letter ? null : { dniLetter: true };
  };
}

function ibanValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').replace(/\s+/g, '').toUpperCase();
    if (!value) {
      return null;
    }

    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(value)) {
      return { ibanFormat: true };
    }

    const rearranged = `${value.slice(4)}${value.slice(0, 4)}`;
    let expanded = '';

    for (const char of rearranged) {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        expanded += String(code - 55);
      } else {
        expanded += char;
      }
    }

    let remainder = 0;
    for (const digit of expanded) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }

    return remainder === 1 ? null : { ibanChecksum: true };
  };
}

@Component({
  selector: 'app-censo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './censo-form.component.html',
  styleUrls: ['./censo-form.component.scss']
})
export class CensoFormComponent implements OnChanges {
  @Input() initialData: Hermano | null = null;
  @Input() submitting = false;

  @Output() save = new EventEmitter<UpsertHermanoPayload>();
  @Output() cancel = new EventEmitter<void>();

  readonly form: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    primerApellido: ['', [Validators.required, Validators.maxLength(80)]],
    segundoApellido: ['', [Validators.maxLength(80)]],
    nif: ['', [Validators.required, dniValidator()]],
    fechaNacimiento: [''],
    estado: ['ACTIVO', [Validators.required]],
    tutorLegal: ['', [Validators.maxLength(160)]],

    telefonoMovil: ['', [Validators.pattern(/^\+?[0-9]{9,15}$/)]],
    telefonoFijo: ['', [Validators.pattern(/^\+?[0-9]{9,15}$/)]],
    email: ['', [Validators.email, Validators.maxLength(120)]],

    direccion: ['', [Validators.maxLength(180)]],
    numero: ['', [Validators.maxLength(20)]],
    pisoPuerta: ['', [Validators.maxLength(60)]],
    codigoPostal: ['', [Validators.pattern(/^\d{5}$/)]],
    poblacion: ['', [Validators.maxLength(80)]],
    provincia: ['', [Validators.maxLength(80)]],
    pais: ['Espana', [Validators.maxLength(80)]],

    formaPago: ['DOMICILIACION'],
    iban: ['', [ibanValidator()]],
    titularCuenta: ['', [Validators.maxLength(120)]],
    enCuotas: [false],

    observaciones: ['', [Validators.maxLength(500)]],
    numeroHermano: [null],
    fechaAlta: ['']
  });

  constructor(private readonly formBuilder: FormBuilder) {}

  get isEditMode(): boolean {
    return !!this.initialData?.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']) {
      this.patchForm(changes['initialData'].currentValue as Hermano | null);
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      ...value,
      nif: this.normalizeValue(value['nif']),
      iban: this.normalizeValue(value['iban']),
      email: this.normalizeValue(value['email']),
      telefonoMovil: this.normalizeValue(value['telefonoMovil']),
      telefonoFijo: this.normalizeValue(value['telefonoFijo'])
    } as UpsertHermanoPayload);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  fieldError(field: string): string {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (control.errors['email']) {
      return 'Introduce un email valido';
    }

    if (control.errors['maxlength']) {
      return `Maximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }

    if (control.errors['pattern']) {
      return 'Formato no valido';
    }

    if (control.errors['dniFormat']) {
      return 'DNI invalido. Formato esperado 12345678Z';
    }

    if (control.errors['dniLetter']) {
      return 'La letra del DNI no es correcta';
    }

    if (control.errors['ibanFormat']) {
      return 'IBAN invalido';
    }

    if (control.errors['ibanChecksum']) {
      return 'El IBAN no supera la validacion de control';
    }

    return 'Valor invalido';
  }

  private patchForm(data: Hermano | null): void {
    if (!data) {
      this.form.reset({
        estado: 'ACTIVO',
        pais: 'Espana',
        formaPago: 'DOMICILIACION',
        enCuotas: false
      });
      return;
    }

    this.form.patchValue({
      nombre: data.nombre ?? '',
      primerApellido: data.primerApellido ?? '',
      segundoApellido: data.segundoApellido ?? '',
      nif: data.nif ?? '',
      fechaNacimiento: this.toDateInputValue(data.fechaNacimiento),
      estado: data.estado ?? 'ACTIVO',
      tutorLegal: data.tutorLegal ?? '',

      telefonoMovil: data.telefonoMovil ?? '',
      telefonoFijo: data.telefonoFijo ?? '',
      email: data.email ?? '',

      direccion: data.direccion ?? '',
      numero: data.numero ?? '',
      pisoPuerta: data.pisoPuerta ?? '',
      codigoPostal: data.codigoPostal ?? '',
      poblacion: data.poblacion ?? '',
      provincia: data.provincia ?? '',
      pais: data.pais ?? 'Espana',

      formaPago: data.formaPago ?? 'DOMICILIACION',
      iban: data.iban ?? '',
      titularCuenta: data.titularCuenta ?? '',
      enCuotas: data.enCuotas ?? false,

      observaciones: data.observaciones ?? '',
      numeroHermano: data.numeroHermano ?? null,
      fechaAlta: this.toDateInputValue(data.fechaAlta)
    });
  }

  private toDateInputValue(value: string | Date | undefined): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().slice(0, 10);
  }

  private normalizeValue(value: unknown): string | undefined {
    const normalized = String(value ?? '').trim();
    return normalized ? normalized : undefined;
  }
}