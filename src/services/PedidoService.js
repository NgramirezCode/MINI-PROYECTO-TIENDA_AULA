export class PedidoService {
  // DIP
  constructor(repositorio, notificador, descuentos) {
    this.pedidos = [];
    this.repositorio = repositorio;
    this.notificador = notificador;
    this.descuentos = descuentos;
  }

  registrar(pedido, tipoCliente, tipoEnvio) {
    let total = 0;

    for (const producto of pedido.productos) {
      total += producto.precio;
    }

    const descuento = this.descuentos[tipoCliente];

    if (descuento) {
      total = descuento.aplicar(total);
    }

    let costoEnvio = 0;

    if (tipoEnvio === "normal") {
      costoEnvio = 1000;
    }

    if (tipoEnvio === "express") {
      costoEnvio = 2000;
    }

    total += costoEnvio;
    this.pedidos.push({ pedido, total });

    // SRP: responsabilidad a la clase correspondiente.
    this.repositorio.guardar(pedido, total);
    this.notificador.enviar(pedido.cliente.email);

    return total;
  }
}
