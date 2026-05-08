import ModuleTheoryPage, { ModuleTheoryData } from '@/components/ModuleTheoryPage';

const theory: ModuleTheoryData = {
  blocks: [
    {
      kind: 'defs',
      title: 'Tipos de luz',
      paragraphs: [
        'Cada tipo de luz tem um comportamento diferente e um custo de performance diferente. Use o mínimo necessário para o efeito desejado.',
      ],
      items: [
        { term: 'AmbientLight', desc: 'Iluminação global uniforme. Não cria sombras. Simula luz refletida pelo ambiente. Sempre use junto com outras luzes para evitar sombras totalmente pretas.' },
        { term: 'DirectionalLight', desc: 'Raios paralelos, como o sol. Alta performance. Cria sombras nítidas. Posição define a direção, não a distância.' },
        { term: 'PointLight', desc: 'Irradia em todas as direções de um ponto, como uma lâmpada. Tem atenuação por distância (decay). Mais custosa que DirectionalLight.' },
        { term: 'SpotLight', desc: 'Cone de luz. Parâmetros: angle, penumbra, distance. A mais versátil mas também a mais custosa.' },
      ],
      callout: { type: 'warn', text: '<strong>Performance:</strong> Sombras (shadow maps) são caras. Limite a 1-2 luzes com <code style="background:rgba(251,191,36,0.15);padding:1px 4px;border-radius:3px;font-size:11px">castShadow: true</code>. Configure <code style="background:rgba(251,191,36,0.15);padding:1px 4px;border-radius:3px;font-size:11px">shadow.mapSize</code> com valores potências de 2 (512, 1024, 2048).' },
    },
    {
      kind: 'mixed',
      title: 'PBR e MeshStandardMaterial',
      paragraphs: [
        'PBR (Physically Based Rendering) é um conjunto de técnicas que simula como a luz interage com superfícies reais. O <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">MeshStandardMaterial</code> implementa PBR com dois parâmetros chave:',
      ],
      cards: [
        { title: 'roughness', text: '0 = espelho perfeito. 1 = completamente difuso (madeira fosca, pedra). Controla a dispersão da luz refletida.' },
        { title: 'metalness', text: '0 = não-metal (plástico, madeira). 1 = metal puro (aço, ouro). Afeta como as reflexões se comportam.' },
        { title: 'map', text: 'Textura de cor base (albedo). Multiplica pela cor do material.' },
        { title: 'normalMap', text: 'Simula irregularidades de superfície sem adicionar geometria. Essencial para realismo.' },
      ],
      code: {
        label: 'TextureLoader e PBR',
        code: `const loader = new THREE.TextureLoader()

const material = new THREE.MeshStandardMaterial({
  map:          loader.load('/textures/color.jpg'),
  normalMap:    loader.load('/textures/normal.jpg'),
  roughnessMap: loader.load('/textures/roughness.jpg'),
  metalnessMap: loader.load('/textures/metalness.jpg'),
  aoMap:        loader.load('/textures/ao.jpg'), // ambient occlusion
  roughness: 0.5,   // valor base (multiplicado pelo mapa)
  metalness: 0.0,
})

// Environment Map para reflexões
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
new RGBELoader().load('/env.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture  // afeta todos os materiais PBR
  scene.background = texture   // opcional: usar como fundo
})`,
      },
    },
  ],
  exercises: [
    {
      title: 'Cena Noturna vs Diurna',
      difficulty: 'easy',
      desc: 'Crie uma cena com um botão que alterna entre iluminação "dia" (DirectionalLight branca intensa) e "noite" (AmbientLight azulada fraca + PointLight laranja).',
      tasks: [
        { label: 'Configurar duas presets de luzes e alternar via botão HTML' },
        { label: 'Ativar sombras na luz diurna com castShadow' },
        { label: 'Usar MeshStandardMaterial nos objetos (reage à luz)' },
        { label: 'Adicionar um plano com receiveShadow para receber sombras' },
      ],
    },
    {
      title: 'Showcase de Material PBR',
      difficulty: 'medium',
      desc: 'Crie uma grid de esferas com roughness e metalness variando de 0 a 1 para visualizar o espaço de parâmetros PBR (estilo editor de material).',
      tasks: [
        { label: 'Criar grid 5x5 de esferas com MeshStandardMaterial' },
        { label: 'Eixo X: roughness 0→1; Eixo Y: metalness 0→1' },
        { label: 'Adicionar environment map HDR para reflexões visíveis' },
        { label: 'Adicionar labels HTML com os valores (CSS2DRenderer ou simples overlay)' },
      ],
    },
    {
      title: 'Cena Ultra-Realista',
      difficulty: 'hard',
      desc: 'Recrie a cena do artigo do Wael Yasmina sobre "ultra-realistic scenes": tone mapping, exposure, gamma correction e pelo menos um objeto com textura PBR completa (color, normal, roughness, ao maps).',
      tasks: [
        { label: 'Configurar renderer.toneMapping (ACESFilmicToneMapping) e toneMappingExposure' },
        { label: 'Baixar um conjunto de texturas PBR gratuito (ambientcg.com)' },
        { label: 'Aplicar todas as maps (color, normal, roughness, ao, displacement)' },
        { label: 'Comparar com e sem tone mapping para entender o impacto' },
      ],
    },
  ],
};

export default function Modulo3() {
  return <ModuleTheoryPage moduleNum={3} theory={theory} />;
}
