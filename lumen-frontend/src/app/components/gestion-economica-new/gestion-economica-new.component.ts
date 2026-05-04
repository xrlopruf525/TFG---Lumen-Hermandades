import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastoService } from '../../core/services/gasto.service';

@Component({
  selector: 'app-gestion-economica-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-economica-new.component.html',
  styleUrls: ['./gestion-economica-new.component.scss']
})
export class GestionEconomicaNewComponent {
  @Output() created = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.fb.group({
    tipo: ['gasto', Validators.required],
    concepto: ['', [Validators.required, Validators.maxLength(255)]],
    importe: [0, [Validators.required]],
    fecha: [''],
    proveedor: ['']
  });

  saving = false;

  constructor(private readonly fb: FormBuilder, private readonly gastoService: GastoService) {}

  submit(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const tipo = raw.tipo;
    let importe = Number(raw.importe) || 0;

    if (tipo === 'ingreso') {
      importe = Math.abs(importe) * -1;
    }

    const payload = {
      concepto: String(raw.concepto || '').trim(),
      importe,
      fecha: raw.fecha || new Date().toISOString(),
      proveedor: raw.proveedor ? String(raw.proveedor).trim() : undefined
    };

    this.saving = true;
    this.gastoService.crearGasto(payload).subscribe({
      next: () => {
        this.saving = false;
        this.created.emit();
        this.form.reset({ tipo: 'gasto', concepto: '', importe: 0, fecha: '' });
      },
      error: () => {
        this.saving = false;
        alert('Error al crear movimiento.');
      }
    });
  }

  onCancel(): void {
    this.form.reset({ tipo: 'gasto', concepto: '', importe: 0, fecha: '' });
    this.cancel.emit();
  }
}
