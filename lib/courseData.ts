export interface Lesson {
  name: string;
  detail: string;
}

export interface Module {
  num: string;
  title: string;
  desc: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  accentColor: string;
  lessons: Lesson[];
}

export const MODULES: Module[] = [
  {
    num: "01",
    title: "Fundamentos do 3D na Web",
    desc: "Entenda o ecossistema antes de codar",
    level: "beginner",
    accentColor: "#6366f1",
    lessons: [
      { name: "O que é WebGL e por que Three.js existe", detail: "Diferenças entre WebGL puro, Three.js, Babylon.js e React Three Fiber" },
      { name: "Como a renderização 3D funciona no browser", detail: "Pipeline de renderização, rasterização, GPU, canvas" },
      { name: "Configurando o ambiente de desenvolvimento", detail: "Node.js, Vite, boilerplate do Wael Yasmina (GitHub)" },
      { name: "Seu primeiro projeto Three.js", detail: "Criando a cena, câmera e renderer do zero" },
    ]
  },
  {
    num: "02",
    title: "Cena, Geometrias e Materiais",
    desc: "Os blocos de construção de qualquer cena 3D",
    level: "beginner",
    accentColor: "#10b981",
    lessons: [
      { name: "Scene, Camera e Renderer explicados a fundo", detail: "PerspectiveCamera, OrthographicCamera, parâmetros FOV/near/far" },
      { name: "Geometrias nativas: BoxGeometry, SphereGeometry e mais", detail: "Todos os built-ins do Three.js com parâmetros de segmentos" },
      { name: "Materiais: MeshBasicMaterial, MeshStandardMaterial, etc.", detail: "Comparação de todos os materiais, custo de performance" },
      { name: "Posição, Rotação e Escala com Object3D", detail: "position, rotation, scale, quaternion, lookAt()" },
      { name: "Grupos e hierarquia de objetos", detail: "Group, add(), children, parent — organização da cena" },
      { name: "OrbitControls: câmera interativa com mouse", detail: "Import, configuração, damping, limites de rotação" },
    ]
  },
  {
    num: "03",
    title: "Iluminação e Texturas",
    desc: "Dê vida e realismo às suas cenas",
    level: "beginner",
    accentColor: "#f59e0b",
    lessons: [
      { name: "Tipos de luz: AmbientLight, DirectionalLight, PointLight, SpotLight", detail: "Intensidade, cor, sombras, custo de renderização de cada tipo" },
      { name: "Sombras: castShadow e receiveShadow", detail: "Configurar ShadowMap, tipos (PCF, PCFSOFT), bias, mapSize" },
      { name: "TextureLoader e UV mapping", detail: "Carregando imagens como texturas, propriedades repeat, offset" },
      { name: "PBR com MeshStandardMaterial", detail: "map, roughnessMap, metalnessMap, normalMap, aoMap" },
      { name: "Environment Maps e realismo com HDR", detail: "RGBELoader, PMREMGenerator, envMapIntensity" },
      { name: "Criando cenas ultra-realistas", detail: "Tone mapping, exposure, gammaCorrection — artigo do Wael" },
    ]
  },
  {
    num: "04",
    title: "Animação e Interatividade",
    desc: "Movimento, tempo e resposta ao usuário",
    level: "intermediate",
    accentColor: "#8b5cf6",
    lessons: [
      { name: "O loop de animação: requestAnimationFrame", detail: "Clock, getDelta(), getElapsedTime(), frame rate independente" },
      { name: "Raycasting: clique e hover em objetos 3D", detail: "Raycaster, intersectObjects, eventos de mouse" },
      { name: "Criação interativa com cliques do mouse", detail: "Adicionar objetos à cena via mouse — tutorial do Wael" },
      { name: "Objeto seguindo um caminho (path animation)", detail: "CatmullRomCurve3, getPoint(), tangent e orientação" },
      { name: "Rotação em torno de outro objeto (órbita)", detail: "Sistema solar: Math.sin/cos, grupos de referência" },
      { name: "Câmera dinâmica controlada pelo mouse", detail: "Parallax effect, lerp de posição de câmera" },
      { name: "Camera zoom suave com OrbitControls", detail: "Interpolando dollyIn/dollyOut via tweens" },
    ]
  },
  {
    num: "05",
    title: "Modelos 3D e Animações",
    desc: "Importando assets profissionais e animando-os",
    level: "intermediate",
    accentColor: "#ec4899",
    lessons: [
      { name: "Formatos 3D: GLTF, GLB, OBJ, FBX", detail: "Qual usar, conversão, otimização com gltf-pipeline" },
      { name: "GLTFLoader: carregando e adicionando modelos à cena", detail: "scene.add(gltf.scene), escala, posição inicial" },
      { name: "AnimationMixer: reproduzindo animações do modelo", detail: "clipAction(), play(), loop, crossFadeTo()" },
      { name: "Animando modelos programaticamente", detail: "Manipular bones/joints via código sem animação pré-built" },
      { name: "Cabeça do modelo seguindo o cursor", detail: "IK simplificado, quaternion.slerp(), lookAt adaptado" },
      { name: "Clonando meshes e modelos", detail: "clone() vs SkeletonUtils.clone() para modelos animados" },
    ]
  },
  {
    num: "06",
    title: "Física com Cannon.js",
    desc: "Gravidade, colisões e simulação física real",
    level: "intermediate",
    accentColor: "#ef4444",
    lessons: [
      { name: "O que é Cannon-es e como instalar", detail: "cannon-es vs cannon.js clássico, World, setup básico" },
      { name: "Criando o mundo físico (World)", detail: "gravity, broadphase, solver iterations" },
      { name: "Bodies e Shapes: Box, Sphere, Plane", detail: "mass, position, linearDamping, material" },
      { name: "Sincronizando física com Three.js", detail: "Atualizar mesh.position/quaternion com body.position/quaternion" },
      { name: "Damping e resistência do ar", detail: "linearDamping, angularDamping, sleep" },
      { name: "Materiais físicos: fricção e restituição", detail: "ContactMaterial, friction, restitution — bola quicando" },
    ]
  }
];

export const COURSE_STATS = {
  modules: 8,
  lessons: 51,
  projects: 3,
  duration: "~60h",
};

export const RESOURCES = [
  {
    label: "Playlist Wael Yasmina",
    url: "https://www.youtube.com/playlist?list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho",
    type: "youtube",
  },
  {
    label: "Artigos waelyasmina.net",
    url: "https://waelyasmina.net/articles/category/three-js/",
    type: "blog",
  },
  {
    label: "Three.js Docs Oficiais",
    url: "https://threejs.org/docs/",
    type: "docs",
  },
  {
    label: "Three.js Examples",
    url: "https://threejs.org/examples/",
    type: "examples",
  },
];
