import ModuleTheoryPage, { ModuleTheoryData } from '@/components/ModuleTheoryPage';

const theory: ModuleTheoryData = {
  blocks: [
    /* ── AULA 1 ─────────────────────────────────────────────────────────── */
    {
      kind: 'defs',
      title: 'O que é WebGL e por que Three.js existe',
      paragraphs: [
        'WebGL (Web Graphics Library) é uma API JavaScript baseada no OpenGL ES 2.0/3.0 que permite renderizar gráficos 2D e 3D diretamente no browser <strong>sem plugins</strong>. Ela dá acesso direto à GPU, executando operações massivamente paralelas. O problema: escrever WebGL puro é extremamente verboso — criar um simples triângulo exige ~100 linhas de código para gerenciar buffers, shaders e estados da GPU.',
        'É exatamente por isso que o <strong>Three.js</strong> existe. Ele é uma camada de abstração sobre WebGL que oferece primitivos de alto nível (cena, câmera, geometria, material, luz) sem sacrificar a flexibilidade de personalizar tudo via shaders quando necessário.',
      ],
      items: [
        {
          term: 'WebGL puro',
          desc: 'API de baixo nível. Controle total, mas muito código boilerplate. Útil para performance máxima ou funcionalidades sem suporte em frameworks. Requer conhecimento do pipeline de shaders.',
        },
        {
          term: 'Three.js',
          desc: 'Abstração sobre WebGL. Conceitos de alto nível: Scene, Camera, Mesh, Light, Material. Flexível o suficiente para shaders GLSL customizados quando necessário. A biblioteca mais popular para WebGL.',
        },
        {
          term: 'Babylon.js',
          desc: '"Batteries-included": física, sistema de nós, suporte a XR integrados. Mais voltada a jogos 3D. Curva de aprendizado maior, ecossistema próprio.',
        },
        {
          term: 'React Three Fiber',
          desc: 'Three.js declarativo via JSX + React. Ideal para apps React. Adiciona abstração sobre abstração — ótimo para UI-driven 3D, mas o debug pode ser mais complexo.',
        },
        {
          term: 'Playcanvas / A-Frame',
          desc: 'Alternativas mais especializadas. A-Frame foca em WebXR (realidade aumentada/virtual); Playcanvas é um engine completo com editor visual online.',
        },
      ],
    },

    /* ── AULA 2 ─────────────────────────────────────────────────────────── */
    {
      kind: 'concepts',
      title: 'Como a renderização 3D funciona no browser',
      paragraphs: [
        'Antes de escrever qualquer código Three.js, é essencial entender o que acontece por baixo. O <strong>pipeline de renderização</strong> é a sequência de etapas que transforma dados 3D (vértices, matrizes, texturas) em pixels na tela.',
      ],
      cards: [
        {
          title: '1. CPU envia dados à GPU',
          text: 'Vértices, índices, UVs, normais e uniforms são enviados da RAM para a VRAM em buffers. Esse custo (draw call) deve ser minimizado.',
        },
        {
          title: '2. Vertex Shader',
          text: 'Programa GLSL executado na GPU para cada vértice. Transforma posições 3D em coordenadas de clip space (gl_Position). Roda em paralelo para todos os vértices.',
        },
        {
          title: '3. Rasterização',
          text: 'A GPU interpola os vértices e gera fragmentos (pixels potenciais) para cada triângulo. Processo automático, não programável diretamente.',
        },
        {
          title: '4. Fragment Shader',
          text: 'Programa GLSL para cada fragmento. Define a cor final do pixel (gl_FragColor). Pode amostrar texturas, calcular iluminação, aplicar efeitos.',
        },
        {
          title: '5. Testes & Blending',
          text: 'Depth test (z-buffer) decide qual fragmento fica visível. Alpha blending mistura pixels transparentes. Output vai para o framebuffer.',
        },
        {
          title: '6. Canvas → Tela',
          text: 'O framebuffer é exibido no elemento <canvas> do HTML. Three.js gerencia tudo isso via WebGLRenderer.',
        },
      ],
      callout: {
        type: 'warn',
        text: '<strong>Performance:</strong> Fragment shaders rodam para cada pixel em cada frame. Uma cena 1080p a 60fps = 124 milhões de execuções por segundo. Otimizações no fragment shader têm impacto direto e enorme na performance.',
      },
    },

    /* Conceito complementar: coordenadas e sistemas */
    {
      kind: 'defs',
      title: 'Sistemas de coordenadas e matrizes',
      paragraphs: [
        'Three.js usa um sistema de coordenadas <strong>dextrogiro</strong>: X aponta para a direita, Y para cima, Z para a câmera (em direção ao observador). Entender as transformações de espaço é fundamental para posicionar objetos corretamente.',
      ],
      items: [
        {
          term: 'Model Space',
          desc: 'Coordenadas locais do objeto. A origem (0,0,0) é o centro do objeto. A model matrix converte para World Space.',
        },
        {
          term: 'World Space',
          desc: 'Espaço global da cena. Todos os objetos têm posição, rotação e escala nesse espaço após aplicar suas model matrices.',
        },
        {
          term: 'View Space',
          desc: 'O mundo visto a partir da câmera. A view matrix (inversa da câmera) transforma World Space → Camera Space.',
        },
        {
          term: 'Clip Space',
          desc: 'Coordenadas normalizadas (-1 a 1) após a projection matrix. O vertex shader deve produzir gl_Position nesse espaço.',
        },
        {
          term: 'Screen Space',
          desc: 'Pixels finais na tela. A GPU faz a divisão de perspectiva e o viewport transform automaticamente.',
        },
      ],
    },

    /* ── AULA 3 ─────────────────────────────────────────────────────────── */
    {
      kind: 'code',
      title: 'Configurando o ambiente de desenvolvimento',
      paragraphs: [
        'Usaremos <strong>Vite</strong> como bundler: rápido, suporte a ES Modules nativo e HMR (Hot Module Replacement) instantâneo. A alternativa é o boilerplate oficial do Wael Yasmina, que já vem com OrbitControls e configuração básica de resize.',
      ],
      blocks: [
        {
          label: 'Terminal — setup do zero',
          code: `# 1. Criar projeto com Vite (template vanilla JS)
npm create vite@latest meu-projeto-threejs -- --template vanilla
cd meu-projeto-threejs

# 2. Instalar Three.js
npm install three

# 3. (Opcional) Types para TypeScript
npm install -D @types/three

# 4. Iniciar servidor de desenvolvimento
npm run dev`,
        },
        {
          label: 'Estrutura de arquivos recomendada',
          code: `meu-projeto-threejs/
├── index.html          ← ponto de entrada
├── style.css           ← reset CSS + canvas full-screen
├── src/
│   ├── main.js         ← código principal Three.js
│   ├── utils/
│   │   └── resize.js   ← handler de resize reutilizável
│   └── scenes/
│       └── scene1.js   ← cenas separadas
├── public/
│   ├── textures/       ← imagens para TextureLoader
│   └── models/         ← arquivos .glb/.gltf
└── vite.config.js`,
        },
        {
          label: 'style.css — canvas full-screen sem scrollbar',
          code: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow: hidden;
  background: #000;
}

canvas {
  display: block;
}`,
        },
      ],
    },

    /* ── AULA 4 ─────────────────────────────────────────────────────────── */
    {
      kind: 'code',
      title: 'Seu primeiro projeto Three.js: a cena mínima',
      paragraphs: [
        'Todo projeto Three.js é construído sobre o mesmo tripé: <strong>Scene</strong> (o que existe), <strong>Camera</strong> (como enxergamos) e <strong>Renderer</strong> (como desenhamos). A esses três, adicionamos um Mesh (geometria + material) e um loop de animação.',
      ],
      blocks: [
        {
          label: 'main.js — cena completa e responsiva',
          code: `import * as THREE from 'three'

// ── 1. CENA ────────────────────────────────────────
// Grafo de cena: contém todos os objetos, luzes e câmeras
const scene = new THREE.Scene()
scene.background = new THREE.Color('#0a0a0f')

// ── 2. CÂMERA ──────────────────────────────────────
// PerspectiveCamera(fov, aspect, near, far)
// fov  = campo de visão vertical em graus (75° é natural)
// near = objetos mais perto que isso são cortados
// far  = objetos mais longe que isso são cortados
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.z = 3   // recua câmera para ver o objeto

// ── 3. RENDERER ────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

// ── 4. OBJETO (Geometry + Material = Mesh) ─────────
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: '#6366f1' })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// ── 5. RESIZE HANDLER ──────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()          // ← obrigatório após mudar aspect
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ── 6. LOOP DE ANIMAÇÃO ────────────────────────────
// requestAnimationFrame sincroniza com o monitor (60/90/120fps)
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.005
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()`,
        },
      ],
      callout: {
        type: 'tip',
        text: '<strong>Boa prática:</strong> Sempre chame <code style="background:rgba(167,139,250,0.15);padding:1px 4px;border-radius:3px;font-size:11px">camera.updateProjectionMatrix()</code> depois de mudar <code style="background:rgba(167,139,250,0.15);padding:1px 4px;border-radius:3px;font-size:11px">camera.aspect</code>, <code style="background:rgba(167,139,250,0.15);padding:1px 4px;border-radius:3px;font-size:11px">fov</code> ou <code style="background:rgba(167,139,250,0.15);padding:1px 4px;border-radius:3px;font-size:11px">near/far</code>. Sem isso, a câmera continua usando a matriz de projeção antiga e a imagem distorce.',
      },
    },

    /* Conceito complementar: o que é um Mesh */
    {
      kind: 'defs',
      title: 'Anatomia de um objeto 3D no Three.js',
      paragraphs: [
        'No Three.js, tudo que aparece na cena é composto por três partes fundamentais que trabalham juntas:',
      ],
      items: [
        {
          term: 'BufferGeometry',
          desc: 'Define a <strong>forma</strong>: armazena vértices, normais, UVs e índices em buffers Float32Array que são enviados à GPU. Primitivos como BoxGeometry são subclasses de BufferGeometry.',
        },
        {
          term: 'Material',
          desc: 'Define a <strong>aparência</strong>: cor, textura, como reage à luz, transparência. Há mais de 10 tipos de material no Three.js. A escolha impacta diretamente a performance.',
        },
        {
          term: 'Mesh',
          desc: 'Combina Geometry + Material em um objeto renderizável. Herda de Object3D, ganhando position, rotation, scale e o método add() para hierarquia.',
        },
        {
          term: 'Object3D',
          desc: 'Classe base de tudo na cena (Mesh, Light, Camera, Group). Provê a TRS Matrix: Translation (position), Rotation (Euler/Quaternion) e Scale.',
        },
        {
          term: 'Scene',
          desc: 'Também herda de Object3D. É o nó raiz do grafo de cena. Adicione objetos com scene.add(mesh) e remova com scene.remove(mesh).',
        },
      ],
    },
  ],

  exercises: [
    {
      title: 'Hello Three.js World',
      difficulty: 'easy',
      desc: 'Configure um projeto do zero usando Vite e renderize sua primeira cena. O objetivo é dominar o tripé Scene + Camera + Renderer e ver algo na tela.',
      tasks: [
        { label: 'Criar projeto com npm create vite@latest e instalar Three.js' },
        { label: 'Configurar style.css com canvas full-screen (sem margin, overflow: hidden)' },
        { label: 'Instanciar Scene, PerspectiveCamera (fov 75, near 0.1, far 100) e WebGLRenderer' },
        { label: 'Adicionar BoxGeometry(1,1,1) com MeshBasicMaterial em uma cor de sua escolha' },
        { label: 'Iniciar o loop com requestAnimationFrame e rotacionar o cubo em X e Y' },
      ],
    },
    {
      title: 'Responsive Renderer + AxesHelper',
      difficulty: 'medium',
      desc: 'Faça a cena responder corretamente ao redimensionamento da janela e adicione helpers visuais para entender o sistema de coordenadas.',
      tasks: [
        { label: 'Adicionar window.addEventListener("resize") que atualiza camera.aspect e chama camera.updateProjectionMatrix()' },
        { label: 'Atualizar renderer.setSize() e setPixelRatio() dentro do handler' },
        { label: 'Adicionar AxesHelper(2) à cena — vermelho=X, verde=Y, azul=Z' },
        { label: 'Adicionar GridHelper(10, 10) no plano Y=0 para referência visual' },
        { label: 'Testar redimensionando a janela: o cubo não deve distorcer' },
      ],
    },
    {
      title: 'Comparação WebGL puro vs Three.js',
      difficulty: 'hard',
      desc: 'Crie o mesmo triângulo colorido com WebGL puro e com Three.js. Compare o código, entenda o que Three.js abstrai e documente suas conclusões.',
      tasks: [
        { label: 'WebGL puro: getContext("webgl"), compilar vertex + fragment shader, criar buffer, drawArrays' },
        { label: 'Three.js: BufferGeometry com setAttribute("position", Float32Array) + MeshBasicMaterial' },
        { label: 'Contar linhas de código de cada abordagem e comentar o que cada bloco faz' },
        { label: 'Adicionar uma cor diferente em cada vértice (vertex colors) em ambas as abordagens' },
        { label: 'Escrever um comentário explicando quando você usaria WebGL puro vs Three.js' },
      ],
    },
  ],
};

export default function Modulo1() {
  return <ModuleTheoryPage moduleNum={1} theory={theory} />;
}
