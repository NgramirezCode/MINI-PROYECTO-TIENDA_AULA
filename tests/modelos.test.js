import { describe, test, expect } from "@jest/globals";
import { Producto } from "../src/models/Producto.js";
import { Pedido } from "../src/models/Pedido.js";

describe("Modelos: completar sin agregar responsabilidades innecesarias", () => {
  test("Producto conserva su id, nombre y precio", () => {
    const producto = new Producto(1, "Goma", 500);
    expect(producto.id).toBe(1);
    expect(producto.nombre).toBe("Goma");
    expect(producto.precio).toBe(500);
  });

  test("Pedido conserva su cliente y sus productos", () => {
    const cliente = { nombre: "Juan", email: "juan@example.com" };
    const productos = [new Producto(1, "Goma", 500)];
    const pedido = new Pedido(cliente, productos);

    expect(pedido.cliente.nombre).toBe("Juan");
    expect(pedido.productos.length).toBe(1);
  });

  test("Pedido comienza con productos vacios cuando se omiten", () => {
    const pedido = new Pedido({ nombre: "Juan" });
    expect(pedido.productos).toEqual([]);
  });

  test("dos pedidos creados sin productos no comparten el mismo arreglo", () => {
    const pedido1 = new Pedido({ nombre: "Ana" });
    const pedido2 = new Pedido({ nombre: "Luis" });

    pedido1.productos.push(new Producto(1, "Goma", 500));

    expect(pedido1.productos.length).toBe(1);
    expect(pedido2.productos.length).toBe(0);
  });
});
