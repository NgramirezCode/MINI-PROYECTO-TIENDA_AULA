export class PedidoService {
  // DIP
  constructor(repositorio, notificador) {
    this.pedidos = [];
    this.repositorio = repositorio;
    this.notificador = notificador;
  }

  registrar(pedido, tipoCliente, tipoEnvio) {
    let total = 0;

    for (const producto of pedido.productos) {
      total += producto.precio;
    }

    if (tipoCliente === "premium") {
      total *= 0.9;
    }

    if (tipoCliente === "vip") {
      total *= 0.8;
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
