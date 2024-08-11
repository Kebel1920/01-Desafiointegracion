import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Definir el esquema del Ticket
const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    default: () => uuidv4(), // Genera un UUID único
    unique: true, // Asegura que sea único
    required: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now, // Establece la fecha y hora actual como valor por defecto
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
});

// Crear el modelo Ticket a partir del esquema
const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
