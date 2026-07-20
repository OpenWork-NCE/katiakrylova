import { readFile, writeFile, mkdir, readdir } from 'fs/promises'
import { existsSync } from 'fs'
import { dirname, join, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const siteMapDir = join(root, 'previousWebsite/site-map')
const imagesDir = join(root, 'previousWebsite/images')
const outDir = join(root, 'scripts/data')

const PROJECT_SLUGS = [
  'la-tache-noire', 'casting', 'presentation-teresa-1', 'teresa-viesti', 'light-vador',
  'la-petite-faucheuse', 'strangers', 'seconde-papillon', 'paphius', 'hip-hop-de-rue',
  'alice-au-pays-des-ombres', 'manacao', 'la-beaute-du-geste', 'que-faire-avec-innuit-siniswichi',
  'le-mariage-campagnard', 'la-robe-ragot', 'hero-zero', 'yadel', 'cine-palace',
]

const PROJECT_META = {
  'la-tache-noire': { year: 2025, format: 'Court-métrage', description: "Court-métrage – Tournage express (8 heures maximum) réalisé à l'atelier de l'Académie des arts d'Uccle." },
  casting: { year: 2025, format: 'Court-métrage', description: "Casting retrace une journée haute en couleurs où il est question d'ambitions contrariées entre un réalisateur borné et des candidat.e.s, plus dingues les uns des autres!" },
  'presentation-teresa-1': { year: 2021, format: 'Documentaire', description: 'TERESA VIESTI, présentation' },
  'teresa-viesti': { year: 2021, format: 'Documentaire', description: "Défilé pour l'école de Stylisme. Présentation de quatre pièces. Teresa Viesti Collection." },
  'light-vador': { year: 2016, format: 'Court-métrage', description: "La journée extraordinaire d'un héros ordinaire. Scénario, réalisation et montage." },
  'la-petite-faucheuse': { year: 2015, format: 'Court-métrage', description: "«LA PETITE FAUCHEUSE» court-métrage de KATIA KRYLOVA Aurore, belle jeune femme de 28 ans, Victor son mari, 35 ans et leur petit garçon de 6 ans, Antoine, vivent heureux et sans histoires dans un monde …" },
  strangers: { year: 2014, format: 'Making Of', description: 'Making Of, photos de plateau et affiche Premier court-métrage de Philippe Geus.' },
  'seconde-papillon': { year: 2014, format: 'Performance', description: "Vidéo Performance autour de l'œuvre de la plasticienne Sylvie Pichrist sur la thématique des Métamorphoses." },
  paphius: { year: 2013, format: 'Clip', description: 'Making Of et photos de plateau Clip musical du nouveau groupe « JOY » de Marc Huyghens.' },
  'hip-hop-de-rue': { year: 2013, format: 'Clip', description: 'Making Of – Montage – Etalonnage – Photos Le chanteur auteur-compositeur Rodwyn.' },
  'alice-au-pays-des-ombres': { year: 2013, format: 'Essai expérimental', description: "Essai expérimental sur base d'images fixes. Music and lyrics by David Lynch." },
  manacao: { year: 2013, format: 'Making Of', description: 'Photos de plateau et Making Of. Kino Kabaret International 2013 (Brussels).' },
  'la-beaute-du-geste': { year: 2013, format: 'Court-métrage', description: "La beauté du geste raconte les premiers émois inoffensifs d'un jeune homme méthodique." },
  'que-faire-avec-innuit-siniswichi': { year: 2013, format: 'Court-métrage', description: "Le projet expérimental autour du personnage d'innuit siniswichi, double conceptuel de l'artiste Sylvain Paris." },
  'le-mariage-campagnard': { year: 2013, format: 'Essai expérimental', description: "Essai d'animation sur base de 200 photos ratées." },
  'la-robe-ragot': { year: 2013, format: 'Documentaire', description: "Mini Documentaire autour de l'oeuvre du sculpteur Sophie De Meyer." },
  'hero-zero': { year: 2013, format: 'Court-métrage', description: "Prise de vues, photos de plateau, montage et étalonnage. Court métrage de Sébastien mélot." },
  yadel: { year: 2013, format: 'Making Of', description: 'Making Of et Photos de plateau. Yadel is the last son born to a Turkish family living in Belgium.' },
  'cine-palace': { year: 2013, format: 'Making Of', description: 'Making Of, photos de plateau. Cine Palace court-métrage de Séverine De Streyker.' },
}

const EXTERNAL_LINKS = {
  'alice-au-pays-des-ombres': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=NagZ3zRKrdo' }],
  casting: [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=bfdJ_oSxmFc' }],
  'hip-hop-de-rue': [
    { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=QJZnqs8kB50' },
    { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=nDs5HIDi7BE' },
  ],
  'la-beaute-du-geste': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=7VESxLSnBDM' }],
  'la-petite-faucheuse': [
    { platform: 'Vimeo', url: 'https://vimeo.com/168341224' },
    { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=VPh0IlIfUdw' },
  ],
  'la-robe-ragot': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=XRppup7OYgc' }],
  'la-tache-noire': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=d3n17bUjCWo' }],
  'le-mariage-campagnard': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ivrH8EDRn3A' }],
  'light-vador': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=YMdizVGkzMU' }],
  manacao: [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=oFjSNHDKm4Y' }],
  paphius: [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=S5_8AzISuqM' }],
  'presentation-teresa-1': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=HrX-4HMQHuM' }],
  'seconde-papillon': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=L0MMAVRswOY' }],
  'teresa-viesti': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=O3ABvb6TfmQ' }],
}

function parseImagesSection(content) {
  const images = []
  const blocks = content.split(/### Image \d+/).slice(1)
  for (const block of blocks) {
    const localMatch = block.match(/\*\*Fichier local:\*\*\s*(.+)/)
    const roleMatch = block.match(/\*\*Role:\*\*\s*(.+)/)
    if (!localMatch) continue
    const localFile = localMatch[1].trim().replace(/^images\//, '')
    const role = roleMatch ? roleMatch[1].trim() : ''
    images.push({ localFile, role })
  }
  return images
}

function parseCredits(textSection) {
  const credits = []
  const lines = textSection.split('\n').map((l) => l.trim()).filter(Boolean)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.endsWith(':') && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('[')) {
      const role = line.replace(/:$/, '').trim()
      const names = []
      i += 1
      while (i < lines.length) {
        const next = lines[i]
        if (next.endsWith(':') && !next.includes('http')) break
        if (next.startsWith('#') || next.startsWith('- [') || next.startsWith('###')) break
        if (next && !next.startsWith('[') && !next.includes('youtube') && !next.includes('Tap to')) {
          names.push(next.replace(/Katia Fontaine/gi, 'Katia Krylova'))
        }
        i += 1
      }
      if (role && names.length > 0) {
        credits.push({ role, name: names.join(', ') })
      }
      continue
    }
    i += 1
  }
  return credits
}

function parseProjectFile(slug, content) {
  const titleMatch = content.match(/^# (.+)/m)
  const title = titleMatch ? titleMatch[1].trim() : slug
  const images = parseImagesSection(content)
  const cover = images.find((img) => img.role.includes('image principale') || img.role.includes('hero'))
  const gallery = images
    .filter((img) => img.role.includes('galerie') || img.role.includes('thumbnail'))
    .map((img) => img.localFile)
    .filter((f, idx, arr) => arr.indexOf(f) === idx)

  const textStart = content.indexOf('## Contenu textuel')
  const textSection = textStart >= 0 ? content.slice(textStart) : ''
  const synopsisMatch = textSection.match(/## [^\n]+\n\n([^\n#][^\n]+)/)
  const description = synopsisMatch
    ? synopsisMatch[1].trim().replace(/Katia Fontaine/gi, 'Katia Krylova')
    : ''

  const credits = parseCredits(textSection)

  const missing = []
  if (cover && !existsSync(join(imagesDir, cover.localFile))) missing.push(cover.localFile)
  for (const g of gallery) {
    if (!existsSync(join(imagesDir, g))) missing.push(g)
  }

  return {
    slug,
    title,
    coverImage: cover?.localFile ?? null,
    gallery,
    description,
    credits,
    externalLinks: EXTERNAL_LINKS[slug] ?? [],
    missingFiles: missing,
  }
}

async function main() {
  const projects = []
  const warnings = []

  for (let i = 0; i < PROJECT_SLUGS.length; i++) {
    const slug = PROJECT_SLUGS[i]
    const path = join(siteMapDir, `${slug}.md`)
    if (!existsSync(path)) {
      warnings.push(`Missing site-map: ${slug}.md`)
      continue
    }
    const content = await readFile(path, 'utf8')
    const parsed = parseProjectFile(slug, content)
    parsed.order = i
    const meta = PROJECT_META[slug]
    if (meta) {
      parsed.year = meta.year
      parsed.format = meta.format
      if (!parsed.description && meta.description) parsed.description = meta.description
    }
    if (parsed.missingFiles.length > 0) {
      warnings.push(`${slug}: missing ${parsed.missingFiles.join(', ')}`)
    }
    projects.push(parsed)
  }

  const globals = {
    home: {
      heroImage: 'Capture-d_écran-2025-08-01-à-14.19.23.png',
      tagline: 'Réalisatrice et artiste visuelle',
    },
    about: {
      profileImage: 'Profile Picture.png',
      gallery: ['maman.jpg', 'Image de fond.jpg'],
      bio: "Tout commence par un regard.\n\nIl y a des rencontres qui changent une vie. Les miennes n'ont jamais été préméditées ; elles se sont simplement placées sur mon chemin.\n\nJe suis psychologue clinicienne et thérapeute spécialisée en traumatologie. Depuis toujours, je m'intéresse à ce qui façonne l'être humain : ses blessures, ses ressources, ses émotions, son imaginaire. Comprendre, accompagner, révéler… c'est le fil conducteur de mon parcours.\n\nEn 1999, la vie me conduit en Italie sur le tournage d'un long métrage de fiction. Rien ne me destinait à cette aventure. J'avais même refusé le rôle que me proposait le réalisateur. Il est revenu une deuxième fois. Puis une troisième. J'ai finalement accepté, sans imaginer que cette décision allait changer le cours de ma vie.\n\nDurant le tournage, une lourde caméra Sony VHS passe entre mes mains. Je regarde à travers son objectif et cadre un simple brin d'herbe. Je reste fascinée. À travers cette caméra, ce n'est plus seulement un brin d'herbe : c'est un monde.\n\nPuis je tourne la caméra. Une jeune femme improvise un irrésistible jeu de séduction avec le chauffeur de notre authentique bus des années 60. Je filme leurs regards, leurs sourires, leurs gestes, leur plaisir de jouer. Sans le savoir, je découvre ce jour-là le bonheur immense de raconter une histoire avec une caméra.\n\nLorsque la camerawoman visionne les rushes, elle reste sans voix. Mais les cassettes VHS sont comptées. Pour pouvoir continuer à filmer, il faut en effacer une. Ce sera la mienne.\n\nMon premier film n'existe plus.\n\nEt pourtant, c'est lui qui a tout fait naître.\n\nLe tarot est arrivé de manière inattendue. Je ne cherchais pas à créer un jeu. Je réalisais des collages autour des arcanes majeures du Tarot de Marseille, uniquement pour le plaisir de créer. Peu à peu, j'ai eu le sentiment que ces images m'emmenaient ailleurs, qu'elles me demandaient de construire un univers.\n\nC'est ainsi qu'est né LE TAROT DÉCRYPTÉ, une approche qui revisite les codes traditionnels et ouvre un espace d'interprétation libre et créatif.\n\nQuelques années plus tard est né L'EGO du MOI, un jeu imaginé d'abord pour les enfants avant d'être adopté avec enthousiasme par les adultes. Une nouvelle manière d'explorer l'imaginaire, les émotions et le regard que chacun porte sur lui-même.\n\nCe n'est que bien plus tard que j'ai compris ce qui reliait toutes ces expériences. La psychologie, la création et le cinéma procèdent, pour moi, d'une même recherche : celle du regard. Regarder autrement. Déplacer le point de vue. Révéler ce qui était déjà là, mais demeurait invisible.\n\nAujourd'hui, je reviens naturellement au cinéma. Non comme une nouvelle direction, mais comme le prolongement d'un chemin commencé il y a longtemps, lorsqu'un simple brin d'herbe m'a appris qu'une caméra pouvait transformer notre regard sur le monde.",
    },
    contact: {
      email: 'contact@katiakrylova.com',
      phone: '+32(0)474 468 168',
      calComUrl: 'https://cal.com/katia-krylova',
    },
    journalPage: {
      photo: 'moodboard.jpg',
    },
    journalEntries: [
      {
        title: 'La petite faucheuse',
        slug: 'la-petite-faucheuse-news',
        excerpt: 'Premier court-métrage.',
        coverImage: 'IMG_1311-e1437043386525.jpg',
        content:
          "Le film raconte une histoire familiale éclatée suite à un drame : la mort d'un enfant, celle d'un petit garçon de 6 ans, ANTOINE. La mère, AURORE, formait et « forme » toujours une dyade inséparable avec son petit garçon qu'elle hallucine comme étant toujours présent, la douleur de la perte restant ingérable, le « ça ne peut pas avoir eu lieu ».\n\nDéni total de la réalité avec de ci de là une incursion dans la « vie d'avant », quand la petite famille, le père, la mère et l'enfant formaient une trinité heureuse.\n\nLe père, VICTOR, est présent et absent, il a tout perdu. Et sa femme et son enfant. Il regarde cette épouse dévastée, avec une tristesse infinie et une sorte d'impuissance totale, lui-même fuyant ses responsabilités d'homme dans l'alcool, afin de tout oublier. Il ira jusqu'à « voir » la présence de son fils pour ne pas perdre sa femme.",
      },
      {
        title: 'Plus de lait',
        slug: 'plus-de-lait',
        excerpt:
          "Tournage ce 3 juin 2026 de mon court-métrage : « Plus de lait », avec une team explosive!",
        coverImage: 'moodboard.jpg',
        content:
          "News\n\nTournage ce 3 juin 2026 de mon court-métrage : « Plus de lait », avec une team explosive!\n\nTrès heureuse de pouvoir à nouveau me retrouver sur un set de tournage avec des personnes talentueuses.\n\nPITCH :\n\nChaque matin, Marie-Christine, mère autoritaire et obsessionnelle, orchestre le petit déjeuner de son fils Stéphane, 30 ans, comme une cérémonie millimétrée entre médicaments, tartines et reproches passifs-agressifs. Mais lorsque Stéphane annonce tranquillement que Dieu lui parle — et semble commencer à produire des “miracles” de plus en plus gênants à table — le rituel dérape.\n\nEntre foi opportuniste, panique ménagère et déni tenace, Marie-Christine vacille : doit-elle appeler un médecin… ou réorganiser sa cuisine pour accueillir le Messie ?",
      },
    ],
  }

  await mkdir(outDir, { recursive: true })
  await writeFile(
    join(outDir, 'projects-manifest.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), count: projects.length, warnings, projects }, null, 2) + '\n',
  )
  await writeFile(
    join(outDir, 'globals-manifest.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), ...globals }, null, 2) + '\n',
  )
  console.log(`✓ Wrote ${projects.length} projects to scripts/data/projects-manifest.json`)
  if (warnings.length) console.warn('Warnings:', warnings)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})