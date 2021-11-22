"use strict";

class Figura {
  constructor(x, y) {
    this._color = "#000000";
    this.x = x;
    this.y = y;
  }

  set color(newColor) {
    if (newColor.match(/^#[a-f0-9A-F]{6}$/i) !== null) {
      this._color = newColor;
    }
  }

  get color() {
    return this._color;
  }

  esBlanca() {
    return this._color.match(/^#[fF]{6}$/i) !== null;
  }

  pintar() {
    console.log(`Nos movemos a la posicion (${this.x}, ${this.y})`);
    console.log(`Cogemos la pintura de color ${this._color}`);
  }
}

class Elipse extends Figura {
  constructor(x, y, rh, rv) {
    super(x, y);
    this.rh = rh;
    this.rv = rv;
  }
  pintar() {
    super.pintar();
    console.log(`Pintamos elipse de radios ${this.rh} y ${this.rv}`);
  }
}

class Circulo extends Elipse {
  constructor(x, y, r) {
    super(x, y, r, r);
  }
}

const f1 = new Figura(20, 10);
f1.pintar();
console.log(`Color: ${f1.color} Es blanco: ${f1.esBlanca()}`);
f1.color = "#FfFfFF";
f1.color = "asdasd"; //No tiene efecto, no es color válido
console.log(`Color: ${f1.color} Es blanco: ${f1.esBlanca()}`);
f1.color = "#FFFFFF";
f1.color = "#12345"; //No tiene efecto, no es color válido
console.log(`Color: ${f1.color} Es blanco: ${f1.esBlanca()}`);
f1.color = "#ffffff";
f1.color = "#asdasda"; //No tiene efecto, no es color válido
console.log(`Color: ${f1.color} Es blanco: ${f1.esBlanca()}`);
f1.color = "#23B5DD";
f1.pintar();
const e1 = new Elipse(30, 40, 10, 15);
e1.pintar();
const c1 = new Circulo(50, 80, 20);
c1.color = "#dD5b32";
console.log(`Color: ${c1.color} Es blanco: ${f1.esBlanca()}`);
c1.pintar();
