import ModuleTheoryPage, { ModuleTheoryData } from '@/components/ModuleTheoryPage';

const theory: ModuleTheoryData = {
  blocks: [

    /* ── AULAS 1-2: Scene, Camera, Renderer ──────────────────────────────── */
    {
      kind: 'defs',
      title: 'Scene, Camera e Renderer — o tripé em profundidade',
      paragraphs: [
        'Pense na metáfora de um <strong>set de filmagem</strong>: a <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">Scene</code> é o estúdio com todos os objetos e cenários; a <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">Camera</code> é a câmera de filmagem que enquadra o que será exibido; o <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">Renderer</code> é o projetor que transforma tudo em imagem.',
      ],
      items: [
        {
          term: 'Scene',
          desc: 'Grafo de cena (scene graph) hierárquico. Raiz de todos os objetos. Use scene.add(obj) / scene.remove(obj). Tem scene.background (cor ou textura) e scene.environment (env map para reflexões PBR).',
        },
        {
          term: 'PerspectiveCamera',
          desc: 'Simula perspectiva humana — objetos distantes parecem menores. Parâmetros: fov (75° é natural), aspect (innerWidth/innerHeight), near (0.1 recomendado), far (1000 ou menos). A projection matrix é recalculada a cada mudança de parâmetros.',
        },
        {
          term: 'OrthographicCamera',
          desc: 'Sem perspectiva — objetos têm o mesmo tamanho independente da distância. Parâmetros: left, right, top, bottom, near, far. Ideal para minimapas, jogos 2D, visualizações técnicas (CAD).',
        },
        {
          term: 'WebGLRenderer',
          desc: 'Renderiza a cena via WebGL. Opções importantes: { antialias: true } para suavizar bordas. Métodos essenciais: setSize(), setPixelRatio(Math.min(devicePixelRatio, 2)), setClearColor(). Acesse o canvas via renderer.domElement.',
        },
        {
          term: 'renderer.shadowMap',
          desc: 'Sistema de sombras. Ativar: renderer.shadowMap.enabled = true. Tipos: THREE.PCFSoftShadowMap (recomendado), PCFShadowMap (mais rápido), VSMShadowMap (mais suave).',
        },
      ],
    },

    /* Camera types comparison */
    {
      kind: 'code',
      title: 'PerspectiveCamera vs OrthographicCamera — quando usar cada uma',
      paragraphs: [],
      blocks: [
        {
          label: 'Ambas as câmeras configuradas corretamente',
          code: `// ── PerspectiveCamera ────────────────────────────
// Use para cenas 3D realistas, jogos, visualizações
const perspCamera = new THREE.PerspectiveCamera(
  75,                                   // fov: campo de visão vertical (graus)
  window.innerWidth / window.innerHeight, // aspect: proporção da tela
  0.1,                                  // near: plano de corte próximo
  1000                                  // far:  plano de corte distante
)
perspCamera.position.set(0, 2, 5)

// ── OrthographicCamera ───────────────────────────
// Use para minimapas, jogos 2D, UI 3D, visualizações técnicas
const aspect = window.innerWidth / window.innerHeight
const frustumSize = 10
const orthoCamera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2,  // left
   frustumSize * aspect / 2,  // right
   frustumSize / 2,           // top
  -frustumSize / 2,           // bottom
  0.1,                        // near
  1000                        // far
)
orthoCamera.position.set(0, 5, 5)
orthoCamera.lookAt(0, 0, 0)

// No resize, atualizar os dois:
window.addEventListener('resize', () => {
  // Perspective
  perspCamera.aspect = window.innerWidth / window.innerHeight
  perspCamera.updateProjectionMatrix()

  // Ortho — recalcular o frustum
  const newAspect = window.innerWidth / window.innerHeight
  orthoCamera.left   = -frustumSize * newAspect / 2
  orthoCamera.right  =  frustumSize * newAspect / 2
  orthoCamera.updateProjectionMatrix()
})`,
        },
      ],
    },

    /* ── AULA 3: Geometrias ──────────────────────────────────────────────── */
    {
      kind: 'concepts',
      title: 'Geometrias nativas — todos os primitivos',
      paragraphs: [
        'Uma <strong>Geometry</strong> define a forma de um objeto: seus vértices, normais, UVs e índices. Todas são subclasses de <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">BufferGeometry</code> e armazenam os dados em buffers na GPU.',
      ],
      cards: [
        { title: 'BoxGeometry', text: '(w, h, d, wSeg, hSeg, dSeg) — Cubo. Aumente os segmentos para subdivisão (útil para vertex shaders).' },
        { title: 'SphereGeometry', text: '(radius, wSeg, hSeg) — Esfera. wSeg ≥ 32 e hSeg ≥ 16 para visual suave.' },
        { title: 'PlaneGeometry', text: '(w, h, wSeg, hSeg) — Plano no plano XY. Rotacione -Math.PI/2 para chão horizontal.' },
        { title: 'CylinderGeometry', text: '(rTop, rBot, h, radSeg) — Cilindro ou cone (rTop=0). radiusTop ≠ radiusBottom = tronco de cone.' },
        { title: 'TorusGeometry', text: '(radius, tube, radSeg, tubSeg) — Rosquinha. tube controla a espessura do anel.' },
        { title: 'TorusKnotGeometry', text: '(radius, tube, tubSeg, radSeg, p, q) — Nó topológico. Ótimo para demonstrações visuais.' },
        { title: 'ConeGeometry', text: '(radius, h, radSeg) — Cone. Atalho para CylinderGeometry com rTop=0.' },
        { title: 'RingGeometry', text: '(innerR, outerR, thetaSeg) — Anel 2D. Útil para seleção de objetos e UI.' },
        { title: 'DodecahedronGeometry', text: '(radius, detail) — Poliedro de 12 faces. detail=0 a 5 para subdivisão.' },
        { title: 'BufferGeometry', text: 'Geometria completamente customizada via Float32Array. Máximo controle sobre vértices, normais e UVs.' },
      ],
      callout: {
        type: 'tip',
        text: '<strong>Performance:</strong> Crie a geometria uma vez e reutilize em múltiplos Meshes. Geometrias ficam na GPU — não crie novas dentro do loop de animação. Para muitos objetos idênticos, use <code style="background:rgba(167,139,250,0.15);padding:1px 4px;border-radius:3px;font-size:11px">InstancedMesh</code> (Módulo 08).',
      },
    },

    /* BufferGeometry customizada */
    {
      kind: 'code',
      title: 'BufferGeometry — criando formas customizadas',
      paragraphs: [
        'Quando os primitivos não são suficientes, use <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">BufferGeometry</code> para definir vértices manualmente.',
      ],
      blocks: [
        {
          label: 'Triângulo customizado com vértices manuais',
          code: `const geometry = new THREE.BufferGeometry()

// Cada grupo de 3 valores = um vértice (x, y, z)
// 3 vértices = 1 triângulo
const vertices = new Float32Array([
  -1, -1, 0,   // vértice A (inferior esquerdo)
   1, -1, 0,   // vértice B (inferior direito)
   0,  1, 0,   // vértice C (topo)
])

// 'position' é o attribute padrão que o vertex shader usa
// itemSize: 3 = (x, y, z)
geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(vertices, 3)
)

// Three.js calcula as normais automaticamente
// (necessário para materiais que reagem à luz)
geometry.computeVertexNormals()

const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshStandardMaterial({ color: '#6366f1', side: THREE.DoubleSide })
)
scene.add(mesh)`,
        },
        {
          label: 'Geometria procedural — grade de pontos aleatórios',
          code: `// 500 triângulos aleatórios
const count = 500
const positions = new Float32Array(count * 3 * 3) // 3 vértices * 3 coords

for (let i = 0; i < positions.length; i++) {
  positions[i] = (Math.random() - 0.5) * 4
}

const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geo.computeVertexNormals()

const mesh = new THREE.Mesh(
  geo,
  new THREE.MeshBasicMaterial({ color: '#10b981', wireframe: true })
)
scene.add(mesh)`,
        },
      ],
    },

    /* ── AULA 4: Materiais ───────────────────────────────────────────────── */
    {
      kind: 'defs',
      title: 'Materiais — aparência e custo de renderização',
      paragraphs: [
        'O material define <strong>como a geometria é renderizada</strong>: cor, textura, como reage à luz, opacidade, wireframe. A escolha do material é um trade-off entre realismo e performance.',
      ],
      items: [
        {
          term: 'MeshBasicMaterial',
          desc: 'Não reage à luz. Cor constante, sempre visível. O mais rápido. Use para wireframes, debug, objetos de UI e sprites. Sem custo de iluminação.',
        },
        {
          term: 'MeshNormalMaterial',
          desc: 'Cor baseada nas normais dos vértices (RGB = XYZ). Indispensável para debug de geometria e verificar se as normais estão corretas.',
        },
        {
          term: 'MeshLambertMaterial',
          desc: 'Modelo de iluminação difuso simples (sem especular). Bom compromisso entre performance e visual para superfícies opacas sem brilho.',
        },
        {
          term: 'MeshPhongMaterial',
          desc: 'Iluminação Phong: difuso + especular (shininess). Mais antigo que PBR, mas mais rápido que MeshStandardMaterial para cenas simples.',
        },
        {
          term: 'MeshStandardMaterial',
          desc: 'PBR completo com roughness e metalness. O padrão atual para cenas realistas. Suporta todos os tipos de texture maps. Custo médio-alto.',
        },
        {
          term: 'MeshPhysicalMaterial',
          desc: 'Extensão do Standard com clearcoat, sheen, iridescência e transmission (vidro). O mais realista, mas também o mais custoso.',
        },
        {
          term: 'ShaderMaterial',
          desc: 'Shaders GLSL completamente customizados. Máximo controle criativo — você escreve o vertex e fragment shader. Ver Módulo 07.',
        },
        {
          term: 'PointsMaterial',
          desc: 'Para sistemas de partículas (Points). Controla tamanho, cor, textura de cada ponto. Fundamental para efeitos de galáxias e estrelas.',
        },
      ],
    },

    /* Propriedades comuns */
    {
      kind: 'code',
      title: 'Propriedades essenciais dos materiais',
      paragraphs: [
        'Todos os materiais herdam de <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">Material</code> e compartilham propriedades comuns de renderização.',
      ],
      blocks: [
        {
          label: 'Propriedades universais e específicas',
          code: `// ── Propriedades de todos os materiais ────────────
const mat = new THREE.MeshStandardMaterial()

mat.visible    = true           // liga/desliga renderização
mat.transparent = true          // habilita transparência
mat.opacity    = 0.5            // 0 = invisível, 1 = sólido
mat.side       = THREE.FrontSide  // FrontSide | BackSide | DoubleSide
mat.wireframe  = false          // mostra apenas arestas
mat.depthTest  = true           // testa z-buffer
mat.depthWrite = true           // escreve no z-buffer

// Atualizar após mudanças em runtime:
mat.needsUpdate = true

// ── MeshStandardMaterial (PBR) ─────────────────────
const pbr = new THREE.MeshStandardMaterial({
  color: '#ffffff',    // albedo base
  roughness: 0.5,      // 0 = espelho, 1 = totalmente difuso
  metalness: 0.0,      // 0 = não-metal (plástico), 1 = metal
  emissive: '#000000', // cor auto-iluminada (não depende de luz)
  emissiveIntensity: 1,
})

// ── MeshBasicMaterial ──────────────────────────────
const basic = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0x6366f1),  // hex | string | Color
  wireframe: true,
  map: texture,  // textura de cor
})

// ── Alterar cor em runtime ─────────────────────────
mat.color.set('#ff6b35')        // via string
mat.color.setHex(0xff6b35)     // via hex number
mat.color.setRGB(1, 0.42, 0.21) // via RGB 0-1`,
        },
      ],
    },

    /* ── AULA 5: Transformações ──────────────────────────────────────────── */
    {
      kind: 'code',
      title: 'Position, Rotation e Scale — transformações de Object3D',
      paragraphs: [
        'Todo objeto que herda de <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">Object3D</code> tem as três propriedades de transformação que formam a <strong>TRS Matrix</strong> (Translation · Rotation · Scale). Internamente, essas três se combinam em uma única <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">Matrix4</code>.',
      ],
      blocks: [
        {
          label: 'Todas as formas de transformar objetos',
          code: `// ── POSITION (Vector3) ────────────────────────────
mesh.position.x = 2
mesh.position.set(2, 1, -3)           // define x, y, z de uma vez
mesh.position.copy(outroMesh.position)// copia posição de outro objeto

// distância de outro objeto
const dist = mesh.position.distanceTo(camera.position)

// ── ROTATION (Euler) ────────────────────────────────
// Euler usa RADIANOS — converta graus com Math.PI / 180
mesh.rotation.y = Math.PI / 2    // 90 graus
mesh.rotation.x = Math.PI        // 180 graus

// A ordem importa! XYZ é o padrão. Mude se tiver gimbal lock:
mesh.rotation.reorder('YXZ')

// ── QUATERNION ─────────────────────────────────────
// Alternativa ao Euler, sem gimbal lock
mesh.quaternion.setFromAxisAngle(
  new THREE.Vector3(0, 1, 0),  // eixo Y
  Math.PI / 4                  // 45 graus
)

// ── SCALE (Vector3) ────────────────────────────────
mesh.scale.set(2, 0.5, 2)    // dobro X e Z, metade Y
mesh.scale.setScalar(2)      // mesmo valor nos 3 eixos

// ── lookAt ─────────────────────────────────────────
// Faz o objeto "olhar" para um ponto
mesh.lookAt(0, 0, 0)         // origem
mesh.lookAt(camera.position) // olha para a câmera

// ── Helpers de debug ───────────────────────────────
const axesHelper = new THREE.AxesHelper(2)  // RGB = XYZ
mesh.add(axesHelper)   // adicionar ao objeto para ver seus eixos locais`,
        },
        {
          label: 'Groups — hierarquia e transformações agrupadas',
          code: `// Group permite transformar múltiplos objetos juntos
// sem que sejam filhos um do outro
const solarSystem = new THREE.Group()
scene.add(solarSystem)

const sol = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#ffd700' })
)
solarSystem.add(sol)

// Grupo da Terra — orbita o Sol
const terraGroup = new THREE.Group()
terraGroup.position.x = 4
solarSystem.add(terraGroup)

const terra = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#4a90d9' })
)
terraGroup.add(terra)

// Lua — filha da Terra, orbita junto
const lua = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#aaa' })
)
lua.position.x = 0.9
terraGroup.add(lua)

// No loop de animação:
function animate() {
  requestAnimationFrame(animate)

  // Sol rotaciona em torno de si mesmo
  sol.rotation.y += 0.005

  // terraGroup orbita o Sol (rotacionar o pai)
  terraGroup.rotation.y += 0.01  // movimento ao redor do Sol?
  // Na verdade, para órbita correta use Math.sin/cos:
  // const t = clock.getElapsedTime()
  // terraGroup.position.x = Math.cos(t) * 4
  // terraGroup.position.z = Math.sin(t) * 4

  // Lua orbita a Terra (dentro do grupo)
  lua.rotation.y += 0.03

  renderer.render(scene, camera)
}`,
        },
      ],
    },

    /* ── AULA 6: OrbitControls ───────────────────────────────────────────── */
    {
      kind: 'code',
      title: 'OrbitControls — câmera interativa com mouse',
      paragraphs: [
        '<code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">OrbitControls</code> é um addon do Three.js (importado separadamente) que adiciona controle de câmera via mouse: <strong>orbitar</strong> (botão esquerdo), <strong>pan</strong> (botão direito ou dois dedos) e <strong>zoom</strong> (scroll). É essencial para debug e visualização interativa.',
      ],
      blocks: [
        {
          label: 'OrbitControls — configuração completa',
          code: `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Passar câmera e o canvas (domElement) do renderer
const controls = new OrbitControls(camera, renderer.domElement)

// ── Damping (inércia) ──────────────────────────────
// Suaviza os movimentos. OBRIGATÓRIO: chamar controls.update() no loop
controls.enableDamping = true
controls.dampingFactor = 0.05   // 0 = sem amortecimento, 1 = para imediato

// ── Zoom ───────────────────────────────────────────
controls.enableZoom  = true
controls.zoomSpeed   = 1.0
controls.minDistance = 1     // distância mínima da câmera ao alvo
controls.maxDistance = 50    // distância máxima

// ── Pan ────────────────────────────────────────────
controls.enablePan = true
controls.panSpeed  = 0.8

// ── Rotação ────────────────────────────────────────
controls.enableRotate  = true
controls.rotateSpeed   = 0.5
controls.minPolarAngle = 0              // limite superior (0 = topo)
controls.maxPolarAngle = Math.PI / 2    // limite inferior (90° = horizonte)
// controls.minAzimuthAngle = -Math.PI / 4  // limitar horizontal
// controls.maxAzimuthAngle =  Math.PI / 4

// ── Alvo do orbitar ────────────────────────────────
controls.target.set(0, 1, 0)  // centro de rotação (padrão: origem)
controls.update()              // chamar após mudar target

// ── No loop de animação ────────────────────────────
// OBRIGATÓRIO quando enableDamping = true
function animate() {
  requestAnimationFrame(animate)
  controls.update()         // ← sem isso, o damping não funciona
  renderer.render(scene, camera)
}`,
        },
      ],
      callout: {
        type: 'info',
        text: '<strong>OrbitControls vs outros controls:</strong> O Three.js inclui também <code style="background:rgba(34,211,238,0.15);padding:1px 4px;border-radius:3px;font-size:11px">FlyControls</code> (câmera livre estilo FPS), <code style="background:rgba(34,211,238,0.15);padding:1px 4px;border-radius:3px;font-size:11px">TrackballControls</code> (sem limitação polar), <code style="background:rgba(34,211,238,0.15);padding:1px 4px;border-radius:3px;font-size:11px">PointerLockControls</code> (mouse travado, ideal para FPS) e <code style="background:rgba(34,211,238,0.15);padding:1px 4px;border-radius:3px;font-size:11px">TransformControls</code> (manipular objetos como no Blender). Todos importados de <code style="background:rgba(34,211,238,0.15);padding:1px 4px;border-radius:3px;font-size:11px">three/examples/jsm/controls/</code>.',
      },
    },
  ],

  exercises: [
    {
      title: 'Galeria de Geometrias',
      difficulty: 'easy',
      desc: 'Crie uma cena com pelo menos 6 geometrias diferentes, cada uma com um material e cor distintos, organizadas em linha. Use OrbitControls para explorar.',
      tasks: [
        { label: 'Criar Box, Sphere, Torus, Cylinder, Cone e TorusKnot' },
        { label: 'Espaçar em position.x com intervalo uniforme (ex: i * 2.5)' },
        { label: 'Cada objeto com MeshBasicMaterial em cor diferente' },
        { label: 'Adicionar OrbitControls com enableDamping = true' },
        { label: 'Adicionar GridHelper(20, 20) e AxesHelper(3) para referência' },
      ],
    },
    {
      title: 'Sistema Solar com Groups e hierarquia',
      difficulty: 'medium',
      desc: 'Use Groups e hierarquia de Object3D para criar um sistema Sol-Terra-Lua com órbitas e rotações corretas usando Math.cos e Math.sin.',
      tasks: [
        { label: 'Sol no centro com SphereGeometry e MeshBasicMaterial amarelo' },
        { label: 'Terra orbita o Sol via Math.cos/sin(elapsedTime) no position' },
        { label: 'Lua dentro do grupo Terra, orbita em raio menor que a Terra' },
        { label: 'Terra rotaciona em torno de si mesma (rotation.y no loop)' },
        { label: 'Adicionar PointLight no Sol e MeshStandardMaterial nos planetas' },
        { label: 'OrbitControls para explorar o sistema solar' },
      ],
    },
    {
      title: 'Cena procedural com MeshStandardMaterial',
      difficulty: 'hard',
      desc: 'Crie uma função createObject(type, color, position) e use-a para popular uma cena com 20+ objetos. Adicione iluminação PBR e OrbitControls.',
      tasks: [
        { label: "A função deve aceitar types: 'box' | 'sphere' | 'cylinder' | 'torus' | 'cone'" },
        { label: 'Gerar 20 objetos em posições aleatórias dentro de um volume 20x5x20' },
        { label: 'Cada objeto com roughness e metalness aleatórios (Math.random())' },
        { label: 'Adicionar AmbientLight(0xffffff, 0.3) + DirectionalLight(0xffffff, 1.5) com sombras' },
        { label: 'PlaneGeometry como chão com receiveShadow = true' },
        { label: 'Cada objeto rotaciona com velocidade aleatória no loop usando Clock + delta' },
      ],
    },
  ],
};

export default function Modulo2() {
  return <ModuleTheoryPage moduleNum={2} theory={theory} />;
}
