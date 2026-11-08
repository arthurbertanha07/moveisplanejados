// Motor do showroom 3D (Three.js puro, carregado sob demanda).
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, Vector3, PMREMGenerator,
  SpotLight, HemisphereLight, DirectionalLight, Mesh, PlaneGeometry,
  MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial,
  PCFShadowMap, NeutralToneMapping, SRGBColorSpace,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { construirMovel, LARG, ALT, PROF } from './movel.js';
import {
  gerarCamposMadeira, texturaCorMadeira, texturaDadosMadeira, texturaSuperficie, texturaSombraSuave,
} from './texturas.js';
import { MADEIRAS, PUXADORES } from '../acabamentos.js';

const COR_FUNDO = '#1b1714';

const LIMITES = { azMin: -1.0, azMax: 1.0, elMin: -0.04, elMax: 0.48, zoomMin: 0.62, zoomMax: 1.18 };
const VISTA_INICIAL = { az: 0.46, el: 0.1, zoom: 1 };

const limitar = (v, a, b) => Math.min(b, Math.max(a, v));
const suavizar = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Cria o showroom dentro do elemento `palco`.
 * @returns {Promise<object>} API de controle.
 */
export async function criarShowroom(palco, opcoes = {}) {
  const {
    movimentoReduzido = false,
    movel: ehMovel = false,
    madeira: madeiraInicial = MADEIRAS[0].id,
    puxador: puxadorInicial = PUXADORES[0].id,
    onProgresso,
    onInteracao,
    onContextoPerdido,
  } = opcoes;

  // ---------- Renderizador ----------
  const renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ehMovel ? 1.75 : 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'showroom__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  // Permite rolar a página na vertical pelo celular; arraste horizontal gira o móvel.
  canvas.style.touchAction = 'pan-y';
  palco.prepend(canvas);

  RectAreaLightUniformsLib.init();

  const cena = new Scene();
  cena.background = new Color(COR_FUNDO);
  cena.fog = new Fog(COR_FUNDO, 9, 19);

  const pmrem = new PMREMGenerator(renderer);
  const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  cena.environment = ambiente;
  cena.environmentIntensity = 0.3;
  pmrem.dispose();

  const camera = new PerspectiveCamera(30, 1, 0.1, 40);
  const alvo = new Vector3(0, 1.3, -0.32);

  // ---------- Luzes ----------
  const spot = new SpotLight(0xfff6ec, 130, 0, 0.5, 0.95, 2);
  spot.position.set(1.25, 3.9, 2.9);
  spot.target.position.set(-0.1, 0.8, -0.5);
  spot.castShadow = true;
  spot.shadow.mapSize.set(ehMovel ? 1024 : 2048, ehMovel ? 1024 : 2048);
  spot.shadow.camera.near = 2;
  spot.shadow.camera.far = 12;
  spot.shadow.bias = -0.00025;
  spot.shadow.normalBias = 0.012;
  spot.shadow.radius = 5;
  cena.add(spot, spot.target);

  const hemi = new HemisphereLight(0xfff3e4, 0x2a211b, 0.1);
  cena.add(hemi);
  const preenchimento = new DirectionalLight(0xffe6cc, 0.32);
  preenchimento.position.set(-4, 2.6, 3.2);
  cena.add(preenchimento);

  // ---------- Texturas ----------
  const anis = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const N = ehMovel ? 512 : 1024;
  const campos = await gerarCamposMadeira(N, (p) => onProgresso?.(p * 0.85));
  const texDados = texturaDadosMadeira(campos, anis);
  const cacheCor = new Map();
  const corDe = (id) => {
    if (!cacheCor.has(id)) {
      const def = MADEIRAS.find((m) => m.id === id) || MADEIRAS[0];
      cacheCor.set(id, texturaCorMadeira(campos, def, anis));
    }
    return cacheCor.get(id);
  };

  // ---------- Materiais ----------
  const madeira = new MeshStandardMaterial({
    map: corDe(madeiraInicial),
    bumpMap: texDados,
    bumpScale: 1.2,
    roughnessMap: texDados,
    roughness: 1,
    metalness: 0,
    envMapIntensity: 0.9,
  });
  const ripado = madeira.clone();
  const interno = new MeshStandardMaterial({ color: 0xe2d9cb, roughness: 0.72, envMapIntensity: 0.6 });
  const escuro = new MeshStandardMaterial({ color: 0x1e1915, roughness: 0.85 });
  const metal = new MeshPhysicalMaterial({ color: 0x8d6b47, metalness: 1, roughness: 0.32, clearcoat: 0.1 });
  const led = new MeshBasicMaterial({ color: 0xfff0d6 });
  const tecido = (cor) => new MeshPhysicalMaterial({
    color: cor, roughness: 0.92, sheen: 0.6, sheenRoughness: 0.75, sheenColor: 0xffffff, envMapIntensity: 0.4,
  });
  const tecidos = [0xe7e0d3, 0xbfae92, 0x5f6553, 0x2e3035].map(tecido);
  const ceramica = new MeshStandardMaterial({ color: 0xe0d7c8, roughness: 0.85 });
  const ceramicaEscura = new MeshStandardMaterial({ color: 0x2a2421, roughness: 0.6 });
  const papel = [0x9a5b3f, 0xd9cfbd, 0x3f4a44].map((c) => new MeshStandardMaterial({ color: c, roughness: 0.8 }));

  const materiais = { madeira, ripado, interno, escuro, metal, led, tecidos, ceramica, ceramicaEscura, papel };
  const movel = construirMovel(materiais);
  cena.add(movel.raiz);

  // ---------- Ambiente: piso, parede e sombras de contato ----------
  const texPiso = texturaSuperficie(256, 5, 6, 0.16);
  texPiso.repeat.set(8, 8);
  const piso = new Mesh(
    new PlaneGeometry(30, 30),
    new MeshStandardMaterial({ color: 0x9f9384, roughness: 0.82, roughnessMap: texPiso, map: texPiso, envMapIntensity: 0.15 }),
  );
  piso.rotation.x = -Math.PI / 2;
  piso.receiveShadow = true;
  cena.add(piso);

  const texParede = texturaSuperficie(256, 9, 10, 0.1);
  texParede.repeat.set(5, 3);
  const parede = new Mesh(
    new PlaneGeometry(14, 7),
    new MeshStandardMaterial({ color: 0xcdbfab, roughness: 0.95, map: texParede, envMapIntensity: 0.08 }),
  );
  parede.position.set(0, 3.5, -PROF - 0.004);
  parede.receiveShadow = true;
  cena.add(parede);

  const sombraPiso = new Mesh(
    new PlaneGeometry(LARG + 0.9, PROF + 0.9),
    new MeshBasicMaterial({
      map: texturaSombraSuave(128, (LARG / (LARG + 0.9)) / 2, (PROF / (PROF + 0.9)) / 2, 0.09),
      transparent: true, depthWrite: false, opacity: 0.7, color: 0x000000,
    }),
  );
  sombraPiso.rotation.x = -Math.PI / 2;
  sombraPiso.position.set(0, 0.002, -PROF / 2);
  cena.add(sombraPiso);

  const sombraParede = new Mesh(
    new PlaneGeometry(LARG + 0.8, ALT + 0.6),
    new MeshBasicMaterial({
      map: texturaSombraSuave(128, (LARG / (LARG + 0.8)) / 2, (ALT / (ALT + 0.6)) / 2, 0.07),
      transparent: true, depthWrite: false, opacity: 0.55, color: 0x000000,
    }),
  );
  sombraParede.position.set(0, ALT / 2 + 0.05, -PROF - 0.002);
  cena.add(sombraParede);

  // ---------- Estado ----------
  const est = {
    ...VISTA_INICIAL,
    alvoAz: VISTA_INICIAL.az, alvoEl: VISTA_INICIAL.el, alvoZoom: VISTA_INICIAL.zoom,
    abertura: 0, progresso: 0, alvoProgresso: 0,
    giro: !movimentoReduzido,
    tempoGiro: 0,
    arrastando: false,
    visivel: true,
    largura: 1, altura: 1, distBase: 6,
  };
  const hotspots = [];
  let raf = 0;
  let ultimo = 0;
  let destruido = false;

  function ajustarTamanho() {
    const w = Math.max(1, palco.clientWidth);
    const h = Math.max(1, palco.clientHeight);
    est.largura = w;
    est.altura = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const tanMeio = Math.tan((camera.fov * Math.PI) / 360);
    const precisaA = 3.6;
    const precisaL = camera.aspect < 1 ? 3.25 : 3.9;
    est.distBase = Math.max(precisaA / (2 * tanMeio), precisaL / (2 * tanMeio * camera.aspect));
    invalidar();
  }

  function posicionarCamera() {
    const d = est.distBase * est.zoom;
    camera.position.set(
      alvo.x + d * Math.cos(est.el) * Math.sin(est.az),
      alvo.y + d * Math.sin(est.el),
      alvo.z + d * Math.cos(est.el) * Math.cos(est.az),
    );
    camera.lookAt(alvo);
  }

  function aplicarAbertura(p) {
    const portas = suavizar(limitar(p * 1.3, 0, 1));
    const gav = suavizar(limitar(p * 1.3 - 0.3, 0, 1));
    movel.portas.forEach(({ pivo, sentido, angulo }) => { pivo.rotation.y = sentido * angulo * portas; });
    movel.gavetas.forEach(({ grupo, curso }) => { grupo.position.z = curso * gav; });
    movel.luzesInternas.forEach((l) => { l.intensity = 14 * portas; });
    est.abertura = p;
  }

  const v = new Vector3();
  function atualizarHotspots() {
    for (const { el, obj } of hotspots) {
      obj.getWorldPosition(v);
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * est.largura;
      const y = (-v.y * 0.5 + 0.5) * est.altura;
      const visivel = v.z < 1 && x > 12 && x < est.largura - 12 && y > 12 && y < est.altura - 12;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.dataset.oculto = visivel ? 'false' : 'true';
      el.dataset.lado = x > est.largura * 0.62 ? 'esq' : 'dir';
    }
  }

  function quadro(t) {
    raf = 0;
    if (destruido) return;
    const dt = ultimo ? Math.min(0.05, (t - ultimo) / 1000) : 0.016;
    ultimo = t;

    if (est.giro && !est.arrastando) {
      est.tempoGiro += dt;
      est.alvoAz = 0.62 * Math.sin(est.tempoGiro * 0.22 + 0.85);
    }
    const k = 1 - Math.exp(-dt * (movimentoReduzido ? 30 : 7));
    est.az += (est.alvoAz - est.az) * k;
    est.el += (est.alvoEl - est.el) * k;
    est.zoom += (est.alvoZoom - est.zoom) * k;

    let animando = false;
    if (est.progresso !== est.alvoProgresso) {
      const passo = dt / (movimentoReduzido ? 0.25 : 1.6);
      est.progresso = est.alvoProgresso > est.progresso
        ? Math.min(est.alvoProgresso, est.progresso + passo)
        : Math.max(est.alvoProgresso, est.progresso - passo);
      aplicarAbertura(est.progresso);
      animando = true;
    }

    posicionarCamera();
    renderer.render(cena, camera);
    atualizarHotspots();

    const emMovimento =
      Math.abs(est.alvoAz - est.az) > 1e-4 ||
      Math.abs(est.alvoEl - est.el) > 1e-4 ||
      Math.abs(est.alvoZoom - est.zoom) > 1e-4;
    if (est.visivel && (est.giro || animando || emMovimento || est.arrastando)) {
      raf = requestAnimationFrame(quadro);
    } else {
      ultimo = 0;
    }
  }

  function invalidar() {
    if (!raf && est.visivel && !destruido) raf = requestAnimationFrame(quadro);
  }

  function interagiu() {
    if (est.giro) {
      est.giro = false;
      onInteracao?.({ giro: false });
    } else {
      onInteracao?.({});
    }
  }

  // ---------- Entrada: ponteiro (mouse e toque) ----------
  let ultimoX = 0, ultimoY = 0, ponteiro = null;
  function aoPressionar(e) {
    if (e.button !== undefined && e.button !== 0) return;
    ponteiro = e.pointerId;
    est.arrastando = true;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
    palco.classList.add('is-arrastando');
    interagiu();
    invalidar();
  }
  function aoMover(e) {
    if (!est.arrastando || e.pointerId !== ponteiro) return;
    const dx = e.clientX - ultimoX;
    const dy = e.clientY - ultimoY;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    est.alvoAz = limitar(est.alvoAz - dx * 0.0055, LIMITES.azMin, LIMITES.azMax);
    if (e.pointerType !== 'touch') {
      est.alvoEl = limitar(est.alvoEl + dy * 0.0035, LIMITES.elMin, LIMITES.elMax);
    }
    invalidar();
  }
  function aoSoltar(e) {
    if (e.pointerId !== ponteiro) return;
    est.arrastando = false;
    ponteiro = null;
    palco.classList.remove('is-arrastando');
    invalidar();
  }
  canvas.addEventListener('pointerdown', aoPressionar);
  canvas.addEventListener('pointermove', aoMover);
  canvas.addEventListener('pointerup', aoSoltar);
  canvas.addEventListener('pointercancel', aoSoltar);

  // ---------- Visibilidade e tamanho ----------
  const obsVisivel = new IntersectionObserver(([entrada]) => {
    est.visivel = entrada.isIntersecting;
    if (est.visivel) invalidar();
  });
  obsVisivel.observe(palco);
  const obsTamanho = new ResizeObserver(ajustarTamanho);
  obsTamanho.observe(palco);

  function aoPerderContexto(e) {
    e.preventDefault();
    onContextoPerdido?.();
  }
  canvas.addEventListener('webglcontextlost', aoPerderContexto);

  // ---------- Inicialização ----------
  aplicarPuxador(puxadorInicial);
  aplicarMadeira(madeiraInicial);
  aplicarAbertura(0);
  movel.luzesNicho.forEach((l) => { l.intensity = 10; });
  ajustarTamanho();
  posicionarCamera();
  // Compila os shaders antes de exibir, evitando travadas na primeira interação
  await renderer.compileAsync?.(cena, camera);
  onProgresso?.(1);
  renderer.render(cena, camera);

  function aplicarMadeira(id) {
    const def = MADEIRAS.find((m) => m.id === id) || MADEIRAS[0];
    madeira.map = corDe(def.id);
    ripado.map = madeira.map;
    ripado.color.setScalar(def.ripado);
    madeira.needsUpdate = true;
    ripado.needsUpdate = true;
    invalidar();
  }

  function aplicarPuxador(id) {
    const def = PUXADORES.find((p) => p.id === id) || PUXADORES[0];
    metal.color.set(def.cor);
    metal.metalness = def.metal;
    metal.roughness = def.rugosidade;
    invalidar();
  }

  // ---------- API pública ----------
  return {
    definirMadeira: aplicarMadeira,
    definirPuxador: aplicarPuxador,
    definirAberto(aberto) {
      est.alvoProgresso = aberto ? 1 : 0;
      invalidar();
    },
    girar(delta) {
      interagiu();
      est.alvoAz = limitar(est.alvoAz + delta, LIMITES.azMin, LIMITES.azMax);
      invalidar();
    },
    inclinar(delta) {
      interagiu();
      est.alvoEl = limitar(est.alvoEl + delta, LIMITES.elMin, LIMITES.elMax);
      invalidar();
    },
    aproximar(fator) {
      est.alvoZoom = limitar(est.alvoZoom * fator, LIMITES.zoomMin, LIMITES.zoomMax);
      invalidar();
    },
    redefinirVista() {
      est.alvoAz = VISTA_INICIAL.az;
      est.alvoEl = VISTA_INICIAL.el;
      est.alvoZoom = VISTA_INICIAL.zoom;
      est.tempoGiro = 0;
      invalidar();
    },
    definirGiro(ativo) {
      est.giro = !!ativo;
      if (ativo) est.tempoGiro = Math.asin(limitar(est.az / 0.62, -1, 1)) / 0.22 - 0.85 / 0.22;
      invalidar();
    },
    registrarHotspots(lista) {
      hotspots.length = 0;
      const mapa = movel.ancoras;
      lista.forEach(({ id, el }) => { if (el && mapa[id]) hotspots.push({ el, obj: mapa[id] }); });
      invalidar();
    },
    destruir() {
      destruido = true;
      cancelAnimationFrame(raf);
      obsVisivel.disconnect();
      obsTamanho.disconnect();
      canvas.removeEventListener('pointerdown', aoPressionar);
      canvas.removeEventListener('pointermove', aoMover);
      canvas.removeEventListener('pointerup', aoSoltar);
      canvas.removeEventListener('pointercancel', aoSoltar);
      canvas.removeEventListener('webglcontextlost', aoPerderContexto);
      cena.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((mt) => mt.dispose());
        }
      });
      [texDados, texPiso, texParede, ambiente, ...cacheCor.values()].forEach((t) => t.dispose());
      sombraPiso.material.map?.dispose();
      sombraParede.material.map?.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
