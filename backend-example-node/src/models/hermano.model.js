const mongoose = require('mongoose');

const hermanoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    primer_apellido: { type: String, required: true, trim: true },
    segundo_apellido: { type: String, default: '', trim: true },
    dni: { type: String, required: true, unique: true, uppercase: true, trim: true },

    telefono: { type: String, default: '' },
    telefono_movil: { type: String, default: '' },
    telefono_fijo: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },

    estado: { type: String, default: 'ACTIVO', index: true },
    numeroHermano: { type: Number, index: true },
    fechaAlta: { type: Date },
    fecha_nacimiento: { type: Date },

    direccion: { type: String, default: '' },
    piso_puerta: { type: String, default: '' },
    codigo_postal: { type: String, default: '' },
    localidad: { type: String, default: '' },
    provincia: { type: String, default: '' },
    pais: { type: String, default: 'Espana' },

    forma_pago: { type: String, default: 'DOMICILIACION' },
    iban: { type: String, default: '' },
    titular_cuenta: { type: String, default: '' },
    en_cuotas: { type: Boolean, default: false },

    observaciones: { type: String, default: '' },
    tutor_legal: { type: String, default: '' }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

hermanoSchema.index({ nombre: 'text', primer_apellido: 'text', segundo_apellido: 'text', dni: 'text' });

module.exports = mongoose.model('Hermano', hermanoSchema);
