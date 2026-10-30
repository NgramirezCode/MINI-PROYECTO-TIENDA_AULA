export class PedidoService {
  // DIP
  constructor(repositorio, notificador, descuentos, envios) {
    this.repositorio = repositorio;
    this.notificador = notificador;
    this.descuentos = descuentos;
    this.envios = envios;
  }

  get pedidos() {
    return this.repositorio.obtenerTodos();
  }

  registrar(pedido, tipoCliente, tipoEnvio) {
    let total = 0;
    let costoEnvio = 0;

    for (const producto of pedido.productos) {
      total += producto.precio;
    }
    // OCP y Polimorfismo
    const descuento = this.descuentos[tipoCliente];
    if (descuento) {
      total = descuento.aplicar(total);
    }

    const estrategiaEnvio = this.envios[tipoEnvio];
    if (estrategiaEnvio) {
      total += estrategiaEnvio.obtenerCosto();
    }

    total += costoEnvio;

    // SRP: responsabilidad a la clase correspondiente.
    this.repositorio.guardar(pedido, total);
    this.notificador.enviar(pedido.cliente.email);

    return total;
  }
}
