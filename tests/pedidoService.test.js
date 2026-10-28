import { describe, expect, test } from "@jest/globals";
import { Producto } from "../src/models/Producto.js";
import { Pedido } from "../src/models/Pedido.js";
import { PedidoService } from "../src/services/PedidoService.js";
import { PedidoRepository } from "../src/repositories/LocalStoragePedidoRepository.js";
import { Notificador } from "../src/notifications/EmailNotificador.js";
import { DescuentoNormal } from "../src/descuentos/DescuentoNormal.js";
import { DescuentoPremium } from "../src/descuentos/DescuentoPremium.js";
import { DescuentoVIP } from "../src/descuentos/DescuentoVIP.js";
import { EnvioNormal } from "../src/envios/EnvioNormal.js";
import { EnvioExpress } from "../src/envios/EnvioExpress.js";

const descuentosBase = {
  normal: new DescuentoNormal(),
  premium: new DescuentoPremium(),
  vip: new DescuentoVIP(),
};

const enviosBase = {
  normal: new EnvioNormal(),
  express: new EnvioExpress(),
};

describe("PedidoService: caracterizacion antes de refactorizar", () => {
  test("cliente normal con envio normal paga subtotal mas 1000", () => {
    const pedido = new Pedido({ nombre: "Ana", email: "ana@ejemplo.com" }, [
      new Producto(1, "Item", 3000),
    ]);
    const service = new PedidoService(
      new PedidoRepository(),
      new Notificador(),
      descuentosBase,
      enviosBase,
    );
    const total = service.registrar(pedido, "normal", "normal");
    expect(total).toBe(4000); // 3000 + 1000
  });

  test("cliente premium recibe 10% de descuento sobre los productos", () => {
    const pedido = new Pedido({ nombre: "Ana", email: "ana@ejemplo.com" }, [
      new Producto(1, "Item", 4000),
    ]);
    const service = new PedidoService(
      new PedidoRepository(),
      new Notificador(),
      descuentosBase,
      enviosBase,
    );
    const total = service.registrar(pedido, "premium", "normal");
    expect(total).toBe(4600); // (4000 * 0.9) + 1000
  });

  test("cliente VIP recibe 20% de descuento sobre los productos", () => {
    const pedido = new Pedido({ nombre: "Ana", email: "ana@ejemplo.com" }, [
      new Producto(1, "Item", 4000),
    ]);
    const service = new PedidoService(
      new PedidoRepository(),
      new Notificador(),
      descuentosBase,
      enviosBase,
    );
    const total = service.registrar(pedido, "vip", "normal");
    expect(total).toBe(4200); // (4000 * 0.8) + 1000
  });

  test("envio express agrega 2000", () => {
    const pedido = new Pedido({ nombre: "Ana", email: "ana@ejemplo.com" }, [
      new Producto(1, "Item", 3000),
    ]);
    const service = new PedidoService(
      new PedidoRepository(),
      new Notificador(),
      descuentosBase,
      enviosBase,
    );
    const total = service.registrar(pedido, "normal", "express");
    expect(total).toBe(5000); // 3000 + 2000
  });

  test("el descuento no se aplica al costo de envio", () => {
    const pedido = new Pedido({ nombre: "Ana", email: "ana@ejemplo.com" }, [
      new Producto(1, "Item", 4000),
    ]);
    const service = new PedidoService(
      new PedidoRepository(),
      new Notificador(),
      descuentosBase,
      enviosBase,
    );
    const total = service.registrar(pedido, "vip", "express");
    expect(total).toBe(5200); // (4000 * 0.8) + 2000
  });

  test("combina distintos tipos de cliente y envio", () => {
    const pedido = new Pedido({ nombre: "Ana", email: "ana@ejemplo.com" }, [
      new Producto(1, "Item", 1000),
    ]);
    const service = new PedidoService(
      new PedidoRepository(),
      new Notificador(),
      descuentosBase,
      enviosBase,
    );
    const total = service.registrar(pedido, "premium", "express");
    expect(total).toBe(2900); // (1000 * 0.9) + 2000
  });

  test("conserva correctamente un total con decimales", () => {
    const pedido = new Pedido({ nombre: "Ana", email: "ana@ejemplo.com" }, [
      new Producto(1, "Item", 10.55),
    ]);
    const service = new PedidoService(
      new PedidoRepository(),
      new Notificador(),
      descuentosBase,
      enviosBase,
    );
    const total = service.registrar(pedido, "normal", "normal");
    expect(total).toBeCloseTo(1010.55);
  });

  test("registra el pedido y el total en memoria", () => {
    const pedido = new Pedido({ nombre: "Ana", email: "ana@ejemplo.com" }, [
      new Producto(1, "Item", 3000),
    ]);
    const service = new PedidoService(
      new PedidoRepository(),
      new Notificador(),
      descuentosBase,
      enviosBase,
    );
    service.registrar(pedido, "normal", "normal");
    expect(service.pedidos.length).toBe(1);
    expect(service.pedidos[0].total).toBe(4000);
  });

  test("conserva dos pedidos registrados con la misma instancia", () => {
    const pedido1 = new Pedido({ nombre: "Ana", email: "ana@ejemplo.com" }, [
      new Producto(1, "Item", 1000),
    ]);
    const pedido2 = new Pedido({ nombre: "Luis", email: "luis@ejemplo.com" }, [
      new Producto(2, "Item", 2000),
    ]);
    const service = new PedidoService(
      new PedidoRepository(),
      new Notificador(),
      descuentosBase,
      enviosBase,
    );

    service.registrar(pedido1, "normal", "normal");
    service.registrar(pedido2, "normal", "normal");

    expect(service.pedidos.length).toBe(2);
  });
});
