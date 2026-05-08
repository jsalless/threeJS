import ModuleTheoryPage, { ModuleTheoryData } from '@/components/ModuleTheoryPage';

const theory: ModuleTheoryData = {
  blocks: [
    {
      kind: 'mixed',
      title: 'Como a física funciona com Three.js',
      paragraphs: [
        'Three.js cuida da <strong>renderização</strong>. Cannon.js cuida da <strong>física</strong>. Você mantém dois mundos em paralelo: o mundo visual (Three.js) e o mundo físico (Cannon-es). A cada frame, você copia as posições e rotações do mundo físico para os objetos visuais.',
      ],
      cards: [
        { title: 'World', text: 'O mundo físico. Contém gravidade, broadphase e a lista de bodies. Chamar world.step() avança a simulação.' },
        { title: 'Body', text: 'Um objeto físico. Tem massa, velocidade, força e posição. mass: 0 = estático (imóvel).' },
        { title: 'Shape', text: 'A forma geométrica para colisão: Box, Sphere, Plane, Cylinder, ConvexPolyhedron.' },
        { title: 'ContactMaterial', text: 'Define como dois materiais interagem: fricção (friction) e restituição/bouncing (restitution).' },
      ],
      code: {
        label: 'Setup completo de física',
        code: `import * as CANNON from 'cannon-es'

// Mundo físico
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)  // gravidade realista
world.broadphase = new CANNON.NaiveBroadphase()

// Corpo físico — esfera quicando
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({ mass: 1 })
sphereBody.addShape(sphereShape)
sphereBody.position.set(0, 5, 0)
world.addBody(sphereBody)

// Chão estático (mass: 0 = imóvel)
const groundBody = new CANNON.Body({ mass: 0 })
groundBody.addShape(new CANNON.Plane())
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2)
world.addBody(groundBody)

// No loop — sincronizar física com Three.js
function animate() {
  requestAnimationFrame(animate)
  world.step(1/60, delta, 3)  // fixedStep, deltaTime, maxSubSteps

  // Copiar posição e rotação da física para o mesh
  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)

  renderer.render(scene, camera)
}`,
      },
    },
  ],
  exercises: [
    {
      title: 'Bola Quicando',
      difficulty: 'easy',
      desc: 'Esfera caindo com gravidade, quicando no chão com restituição configurável via slider HTML.',
      tasks: [
        { label: 'Configurar world com gravidade -9.82' },
        { label: 'Criar ContactMaterial com restitution ajustável' },
        { label: 'Slider HTML que ajusta restitution em tempo real (0 a 1)' },
        { label: 'Botão "Reset" que devolve a esfera à altura inicial' },
      ],
    },
    {
      title: 'Criador de Objetos Físicos',
      difficulty: 'medium',
      desc: 'Ao clicar na tela, um novo objeto (cubo ou esfera) aparece e cai com física. Limite a 20 objetos (remova o mais antigo ao adicionar um novo).',
      tasks: [
        { label: 'Raycasting para determinar posição de criação na cena' },
        { label: 'Criar mesh Three.js + body Cannon.js sincronizados' },
        { label: 'Manter array de objetos e remover o mais antigo quando >20' },
        { label: 'Remover da scene E do world ao deletar' },
      ],
    },
    {
      title: 'Torre de Dominó',
      difficulty: 'hard',
      desc: 'Crie uma fileira de peças de dominó em pé. Um clique derruba a primeira peça desencadeando uma reação em cadeia física.',
      tasks: [
        { label: 'Criar 15+ peças de dominó usando BoxBody com mass > 0' },
        { label: 'Espaçamento correto para garantir a reação em cadeia' },
        { label: 'Aplicar impulso na primeira peça ao clicar (applyImpulse)' },
        { label: 'Botão "Reset" que recoloca todas as peças na posição inicial' },
      ],
    },
  ],
};

export default function Modulo6() {
  return <ModuleTheoryPage moduleNum={6} theory={theory} />;
}
