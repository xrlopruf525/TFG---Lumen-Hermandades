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

  private readonly API_HERMANOS = '/api/hermanos';
  private readonly API_CUOTAS = '/api/cuotas';
  private readonly API_GASTOS = '/api/gastos';

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
      error: () => {
        this.descargando = false;
        alert('No se pudo descargar el listado de hermanos.');
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
      error: () => {
        this.descargando = false;
        alert('No se pudo descargar el estado de cuotas.');
      }
    });
  }

  descargarBalanceEconomico(): void {
    this.descargando = true;

    forkJoin({
      cuotas: this.http.get<any>(this.API_CUOTAS, {
        params: this.paramsExportacion()
      }),
      gastos: this.http.get<any>(this.API_GASTOS, {
        params: this.paramsExportacion()
      })
    }).subscribe({
      next: ({ cuotas, gastos }) => {
        const listaCuotas = this.normalizarRespuesta(cuotas);
        const listaGastos = this.normalizarRespuesta(gastos);

        const cuotasPagadas = listaCuotas.filter((c: any) => {
            const estado = String(c.estado ?? '').toLowerCase();
            return estado.includes('pagada') || estado.includes('pagado') || estado.includes('cobrada') || estado.includes('cobrado');
            });

        const totalIngresos = cuotasPagadas.reduce((total: number, cuota: any) => {
          return total + this.obtenerImporte(cuota);
        }, 0);

        const totalGastos = listaGastos.reduce((total: number, gasto: any) => {
          return total + this.obtenerImporte(gasto);
        }, 0);

        const diferencia = totalIngresos - totalGastos;

        const resumen = [
          {
            Concepto: 'Total ingresos por cuotas pagadas',
            Importe: totalIngresos
          },
          {
            Concepto: 'Total gastos',
            Importe: totalGastos
          },
          {
            Concepto: 'Diferencia final',
            Importe: diferencia
          }
        ];

        const ingresosDetalle = cuotasPagadas.map((c: any) => ({
          Tipo: 'Ingreso',
          Hermano: this.obtenerNombreHermano(c),
          Concepto: c.concepto ?? c.descripcion ?? '',
          Estado: c.estado ?? '',
          Importe: this.obtenerImporte(c),
          Fecha: c.fechaPago ?? c.fecha_pago ?? c.fechaVencimiento ?? c.fecha_vencimiento ?? ''
        }));

        const gastosDetalle = listaGastos.map((g: any) => ({
          Tipo: 'Gasto',
          Concepto: g.concepto ?? g.descripcion ?? g.nombre ?? '',
          Categoría: g.categoria ?? '',
          Importe: this.obtenerImporte(g),
          Fecha: g.fecha ?? g.fechaGasto ?? g.fecha_gasto ?? '',
          Observaciones: g.observaciones ?? ''
        }));

        this.generarExcelConVariasHojas(
          [
            { nombre: 'Resumen', datos: resumen },
            { nombre: 'Ingresos', datos: ingresosDetalle },
            { nombre: 'Gastos', datos: gastosDetalle }
          ],
          'balance_economico'
        );

        this.descargando = false;
      },
      error: () => {
        this.descargando = false;
        alert('No se pudo descargar el balance económico.');
      }
    });
  }

  private paramsExportacion(): HttpParams {
    return new HttpParams()
      .set('page', '0')
      .set('pageSize', '10000')
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
    const valor = item.importe ?? item.cantidad ?? item.monto ?? item.total ?? item.baseImponible ?? 0;

    if (typeof valor === 'number') {
      return valor;
    }

    return Number(
      String(valor)
        .replace('€', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    ) || 0;
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