export class PedidoRepository {
  constructor() {
    this.historial = [];
  }

  guardar(pedido, total) {
    this.historial.push({ pedido, total }); // Se guarda en memoria.

    // Se intenta guardar en localStorage.
    try {
      localStorage.setItem("pedidos", JSON.stringify(this.historial));
    } catch (error) {
      console.error("Error al guardar en almacenamiento local", error);
    }
  }

  obtenerTodos() {
    return this.historial;
  }
}
