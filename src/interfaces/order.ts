export type Status = "pendiente" | "en ruta" | "entregado" | "cancelado";
export type ShippingRule = "domicilio" | "recoge en punto";

export interface Order {
  id?: string;
  fecha: string;
  estado: Status;
  pago: boolean;
  cliente: {
    nombre: string;
    celular: number;
    correo: string;
    direccion: string;
    ciudad: string;
  };
  productos:{
    id?: string;
    cantidad: number;
    nombre: string;
    valor: number;
  }[];
  reglaEnvio: ShippingRule;
  observaciones: string;
}