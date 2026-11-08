// Modelo procedural: guarda-roupa planejado "Atelier" em três módulos.
// Unidades em metros. Frente do móvel em z = 0, encostado na parede em z = -PROF.
import {
  Group, Mesh, Object3D, BoxGeometry, CylinderGeometry, TorusGeometry, LatheGeometry,
  ExtrudeGeometry, Shape, Vector2, RectAreaLight,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const LARG = 2.8;
export const ALT = 2.6;
export const PROF = 0.6;

const ESP = 0.025; // espessura da estrutura
const RODAPE = 0.1;
const FOLGA = 0.003; // folga entre portas
const ESP_PORTA = 0.019;
const ESCALA_TEX = 1.0; // metros por repetição da textura

// Gerador pseudoaleatório determinístico (o modelo é sempre igual)
function criarAleatorio(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const aleatorio = criarAleatorio(2024);

/**
 * Reprojeta as coordenadas UV de uma caixa para que o veio fique na direção certa
 * e a densidade da textura seja a mesma em peças de tamanhos diferentes.
 */
function projetarUV(geo, veio) {
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const uv = geo.attributes.uv;
  const ox = aleatorio() * 7;
  const oy = aleatorio() * 7;
  const eixoVeio = { x: 0, y: 1, z: 2 }[veio];
  const c = [0, 0, 0];
  for (let i = 0; i < pos.count; i++) {
    c[0] = pos.getX(i); c[1] = pos.getY(i); c[2] = pos.getZ(i);
    const ax = Math.abs(nor.getX(i)), ay = Math.abs(nor.getY(i)), az = Math.abs(nor.getZ(i));
    const normal = az >= ax && az >= ay ? 2 : ax >= ay ? 0 : 1;
    const plano = [0, 1, 2].filter((e) => e !== normal);
    let a, b;
    if (plano.includes(eixoVeio)) {
      b = c[eixoVeio];
      a = c[plano.find((e) => e !== eixoVeio)];
    } else {
      a = c[plano[0]];
      b = c[plano[1]];
    }
    uv.setXY(i, a / ESCALA_TEX + ox, b / ESCALA_TEX + oy);
  }
  uv.needsUpdate = true;
  return geo;
}

function malha(geo, mat, x = 0, y = 0, z = 0, sombra = true) {
  const m = new Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = sombra;
  m.receiveShadow = true;
  return m;
}

/** Painel de madeira com bordas levemente arredondadas. */
function painel(w, h, d, mat, x, y, z, veio = 'y', raio = 0.0025) {
  const geo = raio > 0 ? new RoundedBoxGeometry(w, h, d, 2, raio) : new BoxGeometry(w, h, d);
  return malha(projetarUV(geo, veio), mat, x, y, z);
}

/** Puxador em barra com dois apoios. orientacao: 'v' (vertical) ou 'h' (horizontal). */
function puxador(comprimento, orientacao, mat) {
  const g = new Group();
  const barra = new Mesh(new CylinderGeometry(0.0065, 0.0065, comprimento, 20), mat);
  barra.position.z = 0.032;
  const apoioGeo = new CylinderGeometry(0.0045, 0.0045, 0.032, 14);
  apoioGeo.rotateX(Math.PI / 2);
  const ofs = comprimento / 2 - 0.045;
  const a1 = new Mesh(apoioGeo, mat);
  const a2 = new Mesh(apoioGeo, mat);
  a1.position.set(0, ofs, 0.016);
  a2.position.set(0, -ofs, 0.016);
  [barra, a1, a2].forEach((m) => { m.castShadow = true; m.receiveShadow = true; g.add(m); });
  if (orientacao === 'h') g.rotation.z = Math.PI / 2;
  return g;
}

/** Peça de roupa pendurada (silhueta extrudada), vista de perfil dentro do armário. */
function roupa(comprimento, mat) {
  const s = new Shape();
  s.moveTo(-0.055, 0);
  s.quadraticCurveTo(0, -0.035, 0.055, 0);
  s.lineTo(0.19, -0.05);
  s.lineTo(0.205, -comprimento);
  s.lineTo(-0.205, -comprimento);
  s.lineTo(-0.19, -0.05);
  s.closePath();
  const geo = new ExtrudeGeometry(s, {
    depth: 0.022, bevelEnabled: true, bevelThickness: 0.009, bevelSize: 0.008, bevelSegments: 2, curveSegments: 6,
  });
  geo.translate(0, 0, -0.011);
  geo.rotateY(Math.PI / 2); // largura da peça fica na profundidade do armário
  const m = new Mesh(geo, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function vaso(perfil, mat) {
  const pts = perfil.map(([r, y]) => new Vector2(r, y));
  const m = new Mesh(new LatheGeometry(pts, 40), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function luzLed(largura, x, y, z, matLed) {
  const fita = new Mesh(new BoxGeometry(largura, 0.004, 0.01), matLed);
  fita.position.set(x, y, z);
  const luz = new RectAreaLight(0xffd7a8, 0, largura, 0.05);
  luz.position.set(x, y - 0.004, z);
  luz.lookAt(x, y - 1, z - 0.15);
  return { fita, luz };
}

/**
 * Constrói o móvel completo.
 * @param {object} m materiais { madeira, ripado, interno, escuro, metal, led, tecidos[], ceramica, ceramicaEscura, papel[] }
 */
export function construirMovel(m) {
  const raiz = new Group();
  raiz.name = 'guarda-roupa';
  const portas = [];
  const gavetas = [];
  const luzesInternas = [];
  const luzesNicho = [];
  const ancoras = {};

  const xE = -LARG / 2 + ESP; // face interna da lateral esquerda
  const xD = LARG / 2 - ESP;
  const yB = RODAPE + ESP; // face superior da base
  const yT = ALT - ESP; // face inferior do tampo
  const altInt = yT - yB;
  const zMeio = -PROF / 2;

  // ---------- Estrutura externa ----------
  raiz.add(painel(ESP, ALT, PROF, m.madeira, -LARG / 2 + ESP / 2, ALT / 2, zMeio, 'y'));
  raiz.add(painel(ESP, ALT, PROF, m.madeira, LARG / 2 - ESP / 2, ALT / 2, zMeio, 'y'));
  raiz.add(painel(LARG - 2 * ESP, ESP, PROF, m.madeira, 0, ALT - ESP / 2, zMeio, 'x'));
  raiz.add(painel(LARG - 2 * ESP, ESP, PROF, m.madeira, 0, RODAPE + ESP / 2, zMeio, 'x'));
  raiz.add(malha(new BoxGeometry(LARG - 2 * ESP, RODAPE, 0.02), m.escuro, 0, RODAPE / 2, -0.06));
  raiz.add(malha(new BoxGeometry(LARG - 2 * ESP, altInt, 0.01), m.interno, 0, yB + altInt / 2, -PROF + 0.005, false));

  // Módulos: lateral (A) | central (C) | lateral (A)
  const C = 0.8;
  const A = (xD - xE - C - 2 * ESP) / 2;
  const mod1 = [xE, xE + A];
  const div1 = mod1[1] + ESP / 2;
  const centro = [mod1[1] + ESP, mod1[1] + ESP + C];
  const div2 = centro[1] + ESP / 2;
  const mod3 = [centro[1] + ESP, xD];

  [div1, div2].forEach((x) => raiz.add(painel(ESP, altInt, PROF - 0.012, m.madeira, x, yB + altInt / 2, zMeio + 0.006, 'y')));

  const zIntFrente = -0.03;
  const zIntFundo = -PROF + 0.012;
  const profInt = zIntFrente - zIntFundo;
  const zInt = (zIntFrente + zIntFundo) / 2;

  // ---------- Portas (módulos laterais) ----------
  const yPorta = yB + altInt / 2;
  const hPorta = altInt - 2 * FOLGA;
  function parDePortas([x0, x1], chave) {
    const w = (x1 - x0 - 3 * FOLGA) / 2;
    [
      { px: x0 + FOLGA, lado: 1 },
      { px: x1 - FOLGA, lado: -1 },
    ].forEach(({ px, lado }, i) => {
      const pivo = new Group();
      pivo.position.set(px, yPorta, 0);
      const folha = painel(w, hPorta, ESP_PORTA, m.madeira, (lado * w) / 2, 0, -ESP_PORTA / 2, 'y', 0.003);
      pivo.add(folha);
      const p = puxador(1.1, 'v', m.metal);
      p.position.set(lado * (w - 0.045), 1.12 - yPorta, 0);
      pivo.add(p);
      raiz.add(pivo);
      portas.push({ pivo, sentido: -lado, angulo: (lado === 1 ? 96 : 92) * (Math.PI / 180) });
      if (chave === 'esq' && i === 1) {
        const a = new Object3D();
        a.position.set(lado * (w - 0.045), 1.12 - yPorta + 0.25, 0.04);
        pivo.add(a);
        ancoras.puxador = a;
      }
    });
  }
  parDePortas(mod1, 'esq');
  parDePortas(mod3, 'dir');

  // ---------- Interior esquerdo: cabideiro ----------
  {
    const [x0, x1] = mod1;
    const xc = (x0 + x1) / 2;
    const larg = x1 - x0;
    raiz.add(painel(larg, 0.022, profInt, m.interno, xc, 2.2, zInt, 'x', 0.002));
    raiz.add(painel(larg, 0.022, profInt, m.interno, xc, 0.62, zInt, 'x', 0.002));
    const cabideiro = new Mesh(new CylinderGeometry(0.011, 0.011, larg, 16), m.metal);
    cabideiro.rotation.z = Math.PI / 2;
    cabideiro.position.set(xc, 2.1, zInt);
    cabideiro.castShadow = true;
    raiz.add(cabideiro);
    const comprimentos = [0.98, 0.78, 0.74, 1.08, 0.72, 0.8, 0.95];
    const n = comprimentos.length;
    for (let i = 0; i < n; i++) {
      const x = x0 + 0.09 + (i * (larg - 0.18)) / (n - 1);
      const gancho = new Mesh(new TorusGeometry(0.018, 0.0022, 6, 16, Math.PI * 1.3), m.metal);
      gancho.position.set(x, 2.1, zInt);
      gancho.rotation.y = Math.PI / 2;
      gancho.rotation.z = -0.2;
      raiz.add(gancho);
      const cabide = malha(new BoxGeometry(0.012, 0.016, 0.4), m.madeira, x, 2.078, zInt);
      raiz.add(cabide);
      const peca = roupa(comprimentos[i], m.tecidos[i % m.tecidos.length]);
      peca.position.set(x, 2.072, zInt);
      peca.rotation.y = (aleatorio() - 0.5) * 0.12;
      raiz.add(peca);
    }
    // Caixas organizadoras na prateleira inferior
    [x0 + 0.24, x1 - 0.24].forEach((x, i) => {
      raiz.add(malha(new RoundedBoxGeometry(0.36, 0.24, 0.42, 3, 0.012), m.tecidos[i ? 1 : 0], x, 0.631 + 0.12, zInt));
    });
    const { fita, luz } = luzLed(larg - 0.06, xc, 2.187, -0.07, m.led);
    raiz.add(fita, luz);
    luzesInternas.push(luz);
  }

  // ---------- Interior direito: prateleiras com roupas dobradas ----------
  {
    const [x0, x1] = mod3;
    const xc = (x0 + x1) / 2;
    const larg = x1 - x0;
    const niveis = [0.56, 0.98, 1.4, 1.82, 2.22];
    niveis.forEach((y) => raiz.add(painel(larg, 0.022, profInt, m.interno, xc, y, zInt, 'x', 0.002)));
    const pilhas = [
      { y: 0.98, cores: [0, 2, 1, 0] },
      { y: 1.4, cores: [3, 1, 3] },
      { y: 1.82, cores: [1, 0, 2, 1, 0] },
    ];
    pilhas.forEach(({ y, cores }) => {
      [x0 + 0.24, x1 - 0.24].forEach((x, lado) => {
        let topo = y + 0.011;
        cores.forEach((ci) => {
          const h = 0.045 + aleatorio() * 0.012;
          const dobra = malha(
            new RoundedBoxGeometry(0.34, h, 0.3, 3, 0.014),
            m.tecidos[(ci + lado) % m.tecidos.length],
            x + (aleatorio() - 0.5) * 0.02, topo + h / 2, zInt + 0.04 + (aleatorio() - 0.5) * 0.02,
          );
          dobra.rotation.y = (aleatorio() - 0.5) * 0.06;
          raiz.add(dobra);
          topo += h;
        });
      });
    });
    [x0 + 0.24, x1 - 0.24].forEach((x) => {
      raiz.add(malha(new RoundedBoxGeometry(0.36, 0.26, 0.42, 3, 0.012), m.tecidos[1], x, 0.571 + 0.13, zInt));
      raiz.add(malha(new RoundedBoxGeometry(0.36, 0.26, 0.42, 3, 0.012), m.tecidos[0], x, 2.231 + 0.13, zInt));
    });
    const { fita, luz } = luzLed(larg - 0.06, xc, 2.207, -0.07, m.led);
    raiz.add(fita, luz);
    luzesInternas.push(luz);
  }

  // ---------- Módulo central: gavetas ----------
  const [c0, c1] = centro;
  const xcC = (c0 + c1) / 2;
  const altGavetas = 0.72;
  const yTopoGavetas = yB + altGavetas;
  {
    const hFrente = (altGavetas - 4 * FOLGA) / 3;
    const wFrente = C - 2 * FOLGA;
    const cursos = [0.36, 0.26, 0.17];
    for (let i = 0; i < 3; i++) {
      const g = new Group();
      const yc = yB + FOLGA + hFrente / 2 + i * (hFrente + FOLGA);
      g.position.set(xcC, yc, 0);
      g.add(painel(wFrente, hFrente, ESP_PORTA, m.madeira, 0, 0, -ESP_PORTA / 2, 'x', 0.003));
      // caixa interna da gaveta
      const hCx = hFrente - 0.07;
      const pCx = 0.48;
      const zCx = -ESP_PORTA - pCx / 2;
      g.add(malha(new BoxGeometry(0.012, hCx, pCx), m.interno, -wFrente / 2 + 0.03, -0.02, zCx));
      g.add(malha(new BoxGeometry(0.012, hCx, pCx), m.interno, wFrente / 2 - 0.03, -0.02, zCx));
      g.add(malha(new BoxGeometry(wFrente - 0.06, 0.012, pCx), m.interno, 0, -0.02 - hCx / 2, zCx));
      g.add(malha(new BoxGeometry(wFrente - 0.06, hCx, 0.012), m.interno, 0, -0.02, zCx - pCx / 2));
      const p = puxador(0.34, 'h', m.metal);
      p.position.set(0, 0, 0);
      g.add(p);
      raiz.add(g);
      gavetas.push({ grupo: g, curso: cursos[2 - i] });
      if (i === 2) {
        const a = new Object3D();
        a.position.set(0.12, 0.02, 0.04);
        g.add(a);
        ancoras.gavetas = a;
      }
    }
    // Conteúdo da gaveta superior (visível quando aberta)
    const sup = gavetas[2].grupo;
    [-0.22, -0.02, 0.18].forEach((x, k) => {
      sup.add(malha(new RoundedBoxGeometry(0.17, 0.05, 0.36, 3, 0.012), m.tecidos[(k + 2) % m.tecidos.length], x, -0.07, -0.28));
    });
  }
  // Tampo das gavetas
  raiz.add(painel(C, ESP, PROF - 0.012, m.madeira, xcC, yTopoGavetas + ESP / 2, zMeio + 0.006, 'x'));

  // ---------- Módulo central: nicho ripado iluminado ----------
  const yNicho0 = yTopoGavetas + ESP;
  const altNicho = yT - yNicho0;
  {
    raiz.add(malha(new BoxGeometry(C, altNicho, 0.008), m.escuro, xcC, yNicho0 + altNicho / 2, -PROF + 0.014, false));
    const largRipa = 0.03;
    const vao = 0.012;
    const n = Math.floor((C + vao) / (largRipa + vao));
    const total = n * largRipa + (n - 1) * vao;
    for (let i = 0; i < n; i++) {
      const x = c0 + (C - total) / 2 + largRipa / 2 + i * (largRipa + vao);
      raiz.add(painel(largRipa, altNicho, 0.016, m.ripado, x, yNicho0 + altNicho / 2, -PROF + 0.026, 'y', 0.004));
    }
    const prof = 0.52;
    const zPrat = -PROF + 0.034 + prof / 2;
    const prateleiras = [yNicho0 + 0.56, yNicho0 + 1.13];
    prateleiras.forEach((y) => raiz.add(painel(C, 0.03, prof, m.madeira, xcC, y, zPrat, 'x')));

    // Fitas de LED sob o tampo e sob cada prateleira
    [yT - 0.004, prateleiras[1] - 0.019, prateleiras[0] - 0.019].forEach((y) => {
      const { fita, luz } = luzLed(C - 0.08, xcC, y, -0.09, m.led);
      raiz.add(fita, luz);
      luzesNicho.push(luz);
    });

    // Objetos decorativos
    const base0 = yNicho0;
    const base1 = prateleiras[0] + 0.015;
    const base2 = prateleiras[1] + 0.015;
    const zObj = -0.32;
    // livros deitados (base)
    [[0.27, 0.035, 0], [0.25, 0.03, 1], [0.23, 0.04, 2]].reduce((y, [w, h, ci]) => {
      raiz.add(malha(new RoundedBoxGeometry(w, h, 0.19, 2, 0.003), m.papel[ci], c0 + 0.2, y + h / 2, zObj));
      return y + h;
    }, base0);
    const v1 = vaso([[0, 0], [0.07, 0], [0.085, 0.06], [0.08, 0.16], [0.045, 0.24], [0.04, 0.27], [0.046, 0.28], [0.042, 0.285], [0, 0.27]], m.ceramica);
    v1.position.set(c1 - 0.2, base0, zObj);
    raiz.add(v1);
    // prateleira 1: garrafa escura + tigela
    const v2 = vaso([[0, 0], [0.055, 0], [0.06, 0.03], [0.058, 0.2], [0.03, 0.27], [0.016, 0.33], [0.02, 0.35], [0, 0.345]], m.ceramicaEscura);
    v2.position.set(c0 + 0.24, base1, zObj);
    raiz.add(v2);
    const tigela = vaso([[0, 0.005], [0.05, 0], [0.11, 0.03], [0.13, 0.075], [0.122, 0.078], [0.1, 0.035], [0, 0.012]], m.ceramica);
    tigela.position.set(c1 - 0.24, base1, zObj + 0.02);
    raiz.add(tigela);
    // prateleira 2: livros em pé + esfera
    [[0.032, 0.24, 2], [0.026, 0.22, 0], [0.04, 0.26, 1], [0.03, 0.21, 2]].reduce((x, [e, h, ci]) => {
      raiz.add(malha(new RoundedBoxGeometry(e, h, 0.17, 2, 0.003), m.papel[ci], x + e / 2, base2 + h / 2, zObj));
      return x + e + 0.004;
    }, c0 + 0.16);
    const esfera = vaso(
      Array.from({ length: 17 }, (_, i) => {
        const a = -Math.PI / 2 + (i / 16) * Math.PI;
        return [Math.cos(a) * 0.065, 0.065 + Math.sin(a) * 0.065];
      }),
      m.ceramicaEscura,
    );
    esfera.position.set(c1 - 0.22, base2, zObj);
    raiz.add(esfera);

    const a = new Object3D();
    a.position.set(xcC + 0.16, prateleiras[0] + 0.32, -0.36);
    raiz.add(a);
    ancoras.nicho = a;
  }

  return { raiz, portas, gavetas, luzesInternas, luzesNicho, ancoras };
}
