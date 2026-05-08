import ModuleTheoryPage, { ModuleTheoryData } from '@/components/ModuleTheoryPage';

const theory: ModuleTheoryData = {
  blocks: [
    {
      kind: 'code',
      title: 'O loop de animação',
      paragraphs: [
        'O <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">requestAnimationFrame</code> sincroniza com o refresh da tela (tipicamente 60fps). Para animações frame-rate independentes, use o <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">Clock</code> do Three.js para medir o tempo decorrido.',
      ],
      blocks: [
        {
          label: 'Loop de animação robusto',
          code: `const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()      // segundos desde o último frame
  const elapsed = clock.getElapsedTime() // segundos desde o início

  // Frame-rate independente: velocidade constante a qualquer fps
  mesh.rotation.y += 1.0 * delta     // 1 radiano por segundo

  // Animação baseada em tempo (sin/cos para movimento cíclico)
  mesh.position.y = Math.sin(elapsed * 2) * 0.5

  renderer.render(scene, camera)
}
animate()`,
        },
      ],
    },
    {
      kind: 'code',
      title: 'Raycasting — interação com objetos 3D',
      paragraphs: [
        'O <code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">Raycaster</code> projeta um raio da câmera para o espaço 3D na direção do cursor do mouse e detecta quais objetos esse raio intersecta. É a base para hover, clique e seleção em cenas 3D.',
      ],
      blocks: [
        {
          label: 'Raycasting com hover e clique',
          code: `const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

// Converter coordenadas do mouse para espaço normalizado (-1 a 1)
window.addEventListener('mousemove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
})

// No loop de animação:
raycaster.setFromCamera(pointer, camera)
const hits = raycaster.intersectObjects(scene.children)

if (hits.length > 0) {
  const obj = hits[0].object
  obj.material.color.set('#FF6B35')  // hover: muda cor
}`,
        },
      ],
    },
  ],
  exercises: [
    {
      title: 'Animações com Clock',
      difficulty: 'easy',
      desc: 'Crie 3 objetos cada um com um padrão de animação diferente usando getElapsedTime(): bobbing (cima-baixo), spin e escala pulsante.',
      tasks: [
        { label: 'Objeto 1: position.y = Math.sin(elapsed * freq) * amplitude' },
        { label: 'Objeto 2: rotação constante (frame-rate independente com delta)' },
        { label: 'Objeto 3: scale pulsante com Math.sin()' },
        { label: 'Cada animação com frequência e amplitude diferentes' },
      ],
    },
    {
      title: 'Galeria Interativa com Raycasting',
      difficulty: 'medium',
      desc: 'Crie 6 cubos na cena. Ao hover, o cubo fica maior e muda de cor. Ao clicar, um painel HTML mostra informações sobre o cubo.',
      tasks: [
        { label: 'Raycaster detectando hover em todos os cubos' },
        { label: 'Transição suave de escala no hover (lerp)' },
        { label: 'Ao clicar, exibir div HTML com nome e cor do objeto' },
        { label: "Cursor muda para 'pointer' ao passar sobre objetos" },
      ],
    },
    {
      title: 'Objeto Seguindo um Caminho',
      difficulty: 'hard',
      desc: 'Anime um objeto que percorre uma curva fechada (CatmullRomCurve3) mantendo a orientação correta ao longo do caminho (lookAt na tangente).',
      tasks: [
        { label: 'Criar CatmullRomCurve3 com 6+ pontos e closed: true' },
        { label: 'Usar getPoint(t) e getPointAt(t + 0.001) para posição e tangente' },
        { label: 'Chamar mesh.lookAt(nextPoint) para orientação correta' },
        { label: 'Visualizar a curva com Line + BufferGeometry' },
      ],
    },
  ],
};

export default function Modulo4() {
  return <ModuleTheoryPage moduleNum={4} theory={theory} />;
}
