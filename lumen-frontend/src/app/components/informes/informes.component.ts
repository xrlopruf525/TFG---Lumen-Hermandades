import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss']
})
export class InformesComponent {

  descargando = false;

  private readonly API_BASE = 'http://localhost:8080';

private readonly API_HERMANOS = `${this.API_BASE}/hermanos`;
private readonly API_CUOTAS = `${this.API_BASE}/cuotas`;
private readonly API_GASTOS = `${this.API_BASE}/gastos`;

  constructor(private http: HttpClient) {}

  descargarListadoHermanos(): void {
    this.descargando = true;

    this.http.get<any>(this.API_HERMANOS, {
      params: this.paramsExportacion()
    }).subscribe({
      next: (response) => {
        const hermanos = this.normalizarRespuesta(response);

        const datosExcel = hermanos.map((h: any) => ({
          ID: h.id ?? '',
          'Nº Hermano': h.numeroHermano ?? '',
          NIF: h.nif ?? h.dni ?? '',
          Nombre: h.nombre ?? '',
          'Primer Apellido': h.primerApellido ?? h.primer_apellido ?? '',
          'Segundo Apellido': h.segundoApellido ?? h.segundo_apellido ?? '',
          Email: h.email ?? '',
          'Teléfono móvil': h.telefonoMovil ?? h.telefono_movil ?? '',
          'Teléfono fijo': h.telefonoFijo ?? h.telefono_fijo ?? '',
          Dirección: h.direccion ?? '',
          Población: h.poblacion ?? '',
          Provincia: h.provincia ?? '',
          Estado: h.estado ?? '',
          'Fecha Alta': h.fechaAlta ?? h.fecha_alta ?? '',
          'Fecha Baja': h.fechaBaja ?? h.fecha_baja ?? '',
          'Forma de Pago': h.formaPago ?? h.forma_pago ?? '',
          IBAN: h.iban ?? '',
          Observaciones: h.observaciones ?? ''
        }));

        this.generarExcel(datosExcel, 'Listado de Hermanos', 'listado_hermanos');
        this.descargando = false;
      },
      error: (error) => {
        this.descargando = false;
        console.error('No se pudo descargar el listado de hermanos.', error);
      }
    });
  }

  descargarEstadoCuotas(): void {
    this.descargando = true;

    this.http.get<any>(this.API_CUOTAS, {
      params: this.paramsExportacion()
    }).subscribe({
      next: (response) => {
        const cuotas = this.normalizarRespuesta(response);

        const datosExcel = cuotas.map((c: any) => ({
          ID: c.id ?? '',
          Hermano: this.obtenerNombreHermano(c),
          Concepto: c.concepto ?? c.descripcion ?? '',
          Año: c.anio ?? c.year ?? '',
          Mes: c.mes ?? '',
          Estado: c.estado ?? '',
          Importe: this.obtenerImporte(c),
          'Fecha Vencimiento': c.fechaVencimiento ?? c.fecha_vencimiento ?? '',
          'Fecha Pago': c.fechaPago ?? c.fecha_pago ?? '',
          Observaciones: c.observaciones ?? ''
        }));

        this.generarExcel(datosExcel, 'Estado de Cuotas', 'estado_cuotas');
        this.descargando = false;
      },
      error: (error) => {
        this.descargando = false;
        console.error('No se pudo descargar el estado de cuotas.', error);
      }
    });
  }

  descargarBalanceEconomico(): void {
    this.descargando = true;

    this.http.get<any>(this.API_GASTOS, {
      params: this.paramsExportacion()
    }).subscribe({
      next: (response) => {
        const movimientos = this.normalizarRespuesta(response);

        console.log('RESPUESTA BALANCE ECONÓMICO:', response);
        console.log('MOVIMIENTOS NORMALIZADOS:', movimientos);
        console.table(movimientos);

        let totalIngresos = 0;
        let totalGastos = 0;

        const detalleMovimientos = movimientos.map((m: any) => {
          const importeOriginal = Number(m.importe ?? 0);

          let tipo = '';
          let importeExcel = 0;

          if (importeOriginal < 0) {
            tipo = 'Ingreso';
            importeExcel = Math.abs(importeOriginal);
            totalIngresos += Math.abs(importeOriginal);
          } else if (importeOriginal > 0) {
            tipo = 'Gasto';
            importeExcel = -Math.abs(importeOriginal);
            totalGastos += Math.abs(importeOriginal);
          } else {
            tipo = 'Sin importe';
            importeExcel = 0;
          }

          return {
            Fecha: m.fecha ?? '',
            Concepto: m.concepto ?? '',
            Tipo: tipo,
            Importe: importeExcel,
            Proveedor: m.proveedor ?? ''
          };
        });

        const diferencia = totalIngresos - totalGastos;

        console.log('TOTAL INGRESOS:', totalIngresos);
        console.log('TOTAL GASTOS:', totalGastos);
        console.log('DIFERENCIA:', diferencia);

        const resumen = [
          {
            Concepto: 'Total ingresos',
            Importe: totalIngresos
          },
          {
            Concepto: 'Total gastos',
            Importe: -totalGastos
          },
          {
            Concepto: 'Diferencia final',
            Importe: diferencia
          }
        ];

        const detalleIngresos = detalleMovimientos.filter((m: any) => m.Tipo === 'Ingreso');
        const detalleGastos = detalleMovimientos.filter((m: any) => m.Tipo === 'Gasto');

        this.generarExcelConVariasHojas(
          [
            { nombre: 'Resumen', datos: resumen },
            { nombre: 'Movimientos', datos: detalleMovimientos },
            { nombre: 'Ingresos', datos: detalleIngresos },
            { nombre: 'Gastos', datos: detalleGastos }
          ],
          'balance_economico'
        );

        this.descargando = false;
      },
      error: (error) => {
        console.error('Error descargando balance económico:', error);
        this.descargando = false;
        console.error('No se pudo descargar el balance económico.');
      }
    });
  }

  private paramsExportacion(): HttpParams {
    return new HttpParams()
      .set('page', '0')
      .set('size', '10000');
  }

  private normalizarRespuesta(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    return [];
  }

  private obtenerNombreHermano(item: any): string {
    const hermano = item.hermano ?? item.hermanoDto ?? item.hermanoDTO;

    if (hermano) {
      const nombre = hermano.nombre ?? '';
      const primerApellido = hermano.primerApellido ?? hermano.primer_apellido ?? '';
      const segundoApellido = hermano.segundoApellido ?? hermano.segundo_apellido ?? '';
      return `${nombre} ${primerApellido} ${segundoApellido}`.trim();
    }

    return item.nombreHermano ?? item.hermanoNombre ?? item.titular ?? '';
  }

  private obtenerImporte(item: any): number {
    const valor =
      item.importe ??
      item.cantidad ??
      item.monto ??
      item.total ??
      item.valor ??
      item.baseImponible ??
      item.precio ??
      0;

    if (typeof valor === 'number') {
      return valor;
    }

    return Number(
      String(valor)
        .replace('€', '')
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    ) || 0;
  }

  private obtenerTipoMovimiento(item: any): string {
    return String(
      item.tipo ??
      item.tipoMovimiento ??
      item.tipo_movimiento ??
      item.categoria ??
      item.clase ??
      ''
    ).toLowerCase();
  }

  private esIngreso(item: any): boolean {
    const tipo = this.obtenerTipoMovimiento(item);
    const importe = this.obtenerImporte(item);

    return tipo.includes('ingreso') || importe > 0;
  }

  private esGasto(item: any): boolean {
    const tipo = this.obtenerTipoMovimiento(item);
    const importe = this.obtenerImporte(item);

    return tipo.includes('gasto') || importe < 0;
  }

  private generarExcel(datos: any[], nombreHoja: string, nombreArchivo: string): void {
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);

    const fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `${nombreArchivo}_${fecha}.xlsx`);
  }

  private generarExcelConVariasHojas(
    hojas: { nombre: string; datos: any[] }[],
    nombreArchivo: string
  ): void {
    const workbook = XLSX.utils.book_new();

    hojas.forEach((hoja) => {
      const worksheet = XLSX.utils.json_to_sheet(hoja.datos);
      XLSX.utils.book_append_sheet(workbook, worksheet, hoja.nombre);
    });

    const fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `${nombreArchivo}_${fecha}.xlsx`);
  }
}