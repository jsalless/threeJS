import ModuleTheoryPage, { ModuleTheoryData } from '@/components/ModuleTheoryPage';

const theory: ModuleTheoryData = {
  blocks: [
    {
      kind: 'mixed',
      title: 'Formatos 3D e por que GLTF',
      paragraphs: [
        'O <strong>GLTF</strong> (GL Transmission Format) é o "JPEG do 3D" — otimizado para transmissão e carregamento rápido no browser. O formato <strong>GLB</strong> é a versão binária compacta do GLTF (tudo em um arquivo).',
      ],
      defs: [
        { term: 'GLTF / GLB', desc: 'Padrão moderno. Suporta PBR, animações, morfologia, câmeras e muito mais. Use sempre que possível.' },
        { term: 'OBJ', desc: 'Formato legado simples. Não suporta animações. Útil para geometrias estáticas simples.' },
        { term: 'FBX', desc: 'Formato proprietário da Autodesk. Suporta animações mas é pesado. Evite se possível — converta para GLTF.' },
      ],
      code: {
        label: 'Carregando e animando um modelo GLTF',
        code: `import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let mixer

const loader = new GLTFLoader()
loader.load('/models/character.glb', (gltf) => {
  const model = gltf.scene
  model.scale.setScalar(0.5)
  scene.add(model)

  // Configurar AnimationMixer
  mixer = new THREE.AnimationMixer(model)

  // Reproduzir primeira animação em loop
  const action = mixer.clipAction(gltf.animations[0])
  action.play()

  // Crossfade entre animações
  const idle = mixer.clipAction(gltf.animations[0])
  const walk = mixer.clipAction(gltf.animations[1])
  idle.play()
  // Para trocar: idle.crossFadeTo(walk, 0.5, true)
})

// No loop de animação — SEMPRE atualizar o mixer
function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera)
}`,
      },
    },
  ],
  exercises: [
    {
      title: 'Vitrine de Modelo',
      difficulty: 'easy',
      desc: 'Carregue um modelo GLTF gratuito (sketchfab.com ou market.pmnd.rs) e apresente-o com iluminação adequada e OrbitControls.',
      tasks: [
        { label: 'Usar GLTFLoader para carregar o modelo' },
        { label: 'Centralizar o modelo usando Box3 e getCenter()' },
        { label: 'Adicionar environment map HDR para reflexões' },
        { label: 'Tela de loading com percentual usando onProgress callback' },
      ],
    },
    {
      title: 'Controlador de Animações',
      difficulty: 'medium',
      desc: 'Carregue um modelo com múltiplas animações e crie botões HTML para alternar entre elas com crossfade suave.',
      tasks: [
        { label: 'Listar todas as animações do modelo e criar um botão para cada' },
        { label: 'Implementar crossFadeTo() com duração de 0.5s' },
        { label: 'Destacar o botão da animação ativa' },
        { label: 'Usar modelo gratuito com 3+ animações (Mixamo ou Ready Player Me)' },
      ],
    },
    {
      title: 'Cabeça que Segue o Cursor',
      difficulty: 'hard',
      desc: 'Acesse o bone da cabeça de um personagem e faça-o rotacionar suavemente para olhar na direção do cursor do mouse.',
      tasks: [
        { label: "Encontrar o bone 'Head' ou similar via model.getObjectByName()" },
        { label: 'Raycasting na cena para obter a posição 3D do cursor' },
        { label: 'Usar quaternion.slerp() para interpolação suave' },
        { label: 'Limitar ângulo máximo de rotação para parecer natural' },
      ],
    },
  ],
};

export default function Modulo5() {
  return <ModuleTheoryPage moduleNum={5} theory={theory} />;
}
