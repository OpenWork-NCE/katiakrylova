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
  'la-petite-faucheuse': {
    year: 2015,
    format: ['Court-métrage', 'Scénario', 'Réalisation', 'Montage partiel'],
    description:
      'Le film raconte une histoire familiale éclatée suite à un drame : la mort d’Antoine, 6 ans.\nLa mère, Aurore l’hallucine comme étant toujours présent, la douleur de la perte restant\ningérable.\nLe père, VIictor, est présent et absent, il a tout perdu. Et sa femme et son enfant. Il\nregarde cette épouse dévastée, il ira jusqu’à ‘voir’ la présence de son ls pour ne pas\nperdre sa femme.',
    overrideDescription: true,
  },
  strangers: {
    year: 2014,
    format: 'Making Of',
    description:
      'Making Of, photos de plateau et affiche\n\nPremier court-métrage de Philippe Geus.\nAdaptation de “The strangers outside”, roman de Vanessa Morgan, scénariste du C-M.\nStrangers nous conte la soirée d’un père handicapé et de sa fille chérie, venus se retirer dans un chalet pour le week end.\nNuit d’horreur où la jeune fille perdra la vie dans des circonstances plus qu’étranges…',
  },
  'seconde-papillon': {
    year: 2014,
    format: ['Performance', 'Collaboration', 'Film', 'Montage', 'Photos'],
    coverImage: 'papillon.jpg',
    coverImageOverride: true,
    description:
      'Vidéo Performance autour de l\'oeuvre de la plasticienne Sylvie Pichrist autour du concept de Métamorphoses.\n\nMETAMORPHOSES\n9 \' Biennale ARTour\nDu 23 juin au 25 aout 2013\nVernissage le 23 juin à 11 h au musée du Musée du Masque à Binche et\nà 13 h place Communale de la Louvière\n(www.artour.be)\n"Seconde papillon"\nEcomusée du Bois du Luc -Ancien site minier\nSylvie Pichrist',
    overrideDescription: true,
  },
  paphius: {
    year: 2013,
    format: ['Making Of', 'Photos de plateau'],
    description:
      'Clip musical du nouveau groupe "JOY" de Marc Huyghens (ex Vénus).\nLa thématique du film fait référence à « On achève bien les chevaux » de Sydney\nPollack, 1969.\n\nClip filmé en super 8 par Séverine De Strycker Joy is a belgian-swedish trio founded in Brussels in 2008. The group features Françoise Vidick on drums ans vocals, Anja Naucler on cello and Marc A. Huyghens (who previously fronted the band Venus) on guitar and vocals. Their music conjures up a nightly scent of wind, earth, soot and dust.',
    overrideDescription: true,
  },
  'hip-hop-de-rue': {
    year: 2013,
    format: ['Making Of', 'Photos de plateau'],
    description: 'Making of d’un clip musical du chanteur autodidacte Rodwyn',
    overrideDescription: true,
  },
  'alice-au-pays-des-ombres': { year: 2013, format: 'Essai expérimental', description: "Essai expérimental sur base d'images fixes. Music and lyrics by David Lynch." },
  manacao: {
    year: 2013,
    format: ['Making Of', 'Photos de plateau'],
    description:
      "Si vous aimez le saphisme, l'inceste et la consanguinité et le tout dans une plaine de jeux, bon visionnage !\nCourt-Métrage de Donovan Alonso-Garcia\n\nPhotos de plateau et Making Of. Kino Kabaret International 2013 (Brussels).",
    overrideDescription: true,
  },
  'la-beaute-du-geste': {
    year: 2013,
    format: ['Réalisation', 'Scénario', 'Montage'],
    description:
      'La beauté du geste raconte les premiers émois inoffensifs d’un jeune homme méthodique.\n\nC-M dans le cadre du 5ème Kino Kabaret International de Bruxelles, du 29/03 au 5/04/13 à la Maison de la Création, Bruxelles-Nord (Laeken).',
    overrideDescription: true,
  },
  'que-faire-avec-innuit-siniswichi': {
    year: 2013,
    format: ['SCÉNARIO', 'PRISE DE VUE', 'MONTAGE'],
    description:
      'Le projet expérimental autour du personnage d’innuit siniswichi, double conceptuel de l’artiste Sylvain Paris, est mon premier court-métrage.\nJe rencontre un homme qui se prend pour un éléphant, il se présente à moi sous le\nnom d’innuit siniswichi, je tente dans cet essai de lui donner réalité ...',
    overrideDescription: true,
  },
  'le-mariage-campagnard': {
    year: 2013,
    format: ['Essai expérimental', 'Photos', 'Animation', 'Montage'],
    description: "Essai d'animation sur base de 200 photos ratées.",
  },
  'la-robe-ragot': {
    year: 2013,
    format: ['Film-documentaire', 'Photos'],
    description:
      'Mini Documentaire autour de l\'oeuvre du sculpteur Sophie De Meyer :\nLa Robe Ragot\n\nC’est quoi un ragot, ça sert à quoi, c’est quoi être la plus belle pour aller danser?\nLa robe de Sophie De Meyer nous parle de cela et de bien plus ou comment de\nvulgaires papiers créent une oeuvre d’art.',
    overrideDescription: true,
  },
  'hero-zero': { year: 2013, format: 'Court-métrage', description: "Prise de vues, photos de plateau, montage et étalonnage. Court métrage de Sébastien mélot." },
  yadel: {
    year: 2013,
    format: ['Making Of', 'Photos de plateau'],
    description:
      'Le film «YADEL» plonge dans l’intimité d’un jeune homme venu au monde dans une famille où un garçon est né et mort avant lui et qui s’appelait déjà Yadel.\nHéritier du nom d’un mort, Yadel nous entraîne dans sa quête initiatique.\nYADEL est le premier film de Kenän Gorgün.',
    overrideDescription: true,
  },
  'cine-palace': {
    year: 2013,
    format: ['Making Of', 'Photos de plateau'],
    description:
      '“CINE PALACE” court-métrage de SEVERINE DE STREYKER.\nCiné Palace retrace la journée d’une strip-teaseuse dans un huis clos d’un cinéma spectacle comme il n’en existe plus beaucoup.\n\nCine Palace\nSéverine De Streyker\nBelgium / 2011 / Fiction / 14\'18',
    overrideDescription: true,
  },
}

const EXTERNAL_LINKS = {
  'alice-au-pays-des-ombres': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=NagZ3zRKrdo' }],
  casting: [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=bfdJ_oSxmFc' }],
  'cine-palace': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=noWSXB38NBw' }],
  'hip-hop-de-rue': [
    { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=QJZnqs8kB50' },
    {
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=nDs5HIDi7BE',
      description:
        "Apres les clips BOOM SHAKATA et MA DING WA l'artiste RODWYN vous offre ce 3eme vidéogramme de la chanson hip hop de rue réalisé et montée par un jeune talent de la street du nom de Marabout.",
    },
  ],
  'la-beaute-du-geste': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=7VESxLSnBDM' }],
  'la-petite-faucheuse': [
    { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=VPh0IlIfUdw' },
    { platform: 'Vimeo', url: 'https://vimeo.com/168341224' },
  ],
  'la-robe-ragot': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=XRppup7OYgc' }],
  'la-tache-noire': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=d3n17bUjCWo' }],
  'le-mariage-campagnard': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ivrH8EDRn3A' }],
  'light-vador': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=YMdizVGkzMU' }],
  manacao: [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=oFjSNHDKm4Y' }],
  paphius: [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=S5_8AzISuqM' }],
  'plus-de-lait': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=67XhPteM5ZI' }],
  'presentation-teresa-1': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=HrX-4HMQHuM' }],
  'que-faire-avec-innuit-siniswichi': [
    { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=Dz-9MNOsOxc' },
  ],
  'seconde-papillon': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=L0MMAVRswOY' }],
  strangers: [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=JnnRxKFuVlw' }],
  'teresa-viesti': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=O3ABvb6TfmQ' }],
  yadel: [
    { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ZAkgTis02Lw' },
    { platform: 'Vimeo', url: 'https://vimeo.com/26809851' },
    {
      platform: 'Vimeo',
      url: 'https://vimeo.com/49739191',
      description:
        'YADEL by Kenan Gorgun - turkish subtitled version\nAfter five books written and published by major houses in Paris, and two screenplays I wrote for\nmovie director Taylan Barman, I felt it was time for me to shot my own work. The result is YADEL.\nShot with very little money, it looks like to everyone that it costed 3 times more. It didn\'t. It is a good\nexample of making more with less. Had a great crew. Very short schedule to shot it but many many\nlocations; some entire sequences didn\'t survive the editing room. I made this movie as a "carte de\nvisite", in order to start working on my projet SAD SUGAR (which is meant to be the first movie of a\nthree-movie serie.) I have connections in France and Belgium, producers I worked with, and look\nfor a main producer (the movie would be shot in Turkish and English…).',
    },
  ],
}

/** Filenames excluded from a project gallery (manifest + re-parse). */
const GALLERY_EXCLUDES = {
  'la-petite-faucheuse': ['IMG_2158.gif', 'IMG_2158-3.gif'],
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
  const excluded = new Set(GALLERY_EXCLUDES[slug] ?? [])
  const gallery = images
    .filter((img) => img.role.includes('galerie') || img.role.includes('thumbnail'))
    .map((img) => img.localFile)
    .filter((f, idx, arr) => arr.indexOf(f) === idx)
    .filter((f) => !excluded.has(f))

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
      if (meta.coverImage) parsed.coverImage = meta.coverImage
      if (meta.coverImageOverride) parsed.coverImageOverride = true
      if ((!parsed.description || meta.overrideDescription) && meta.description) parsed.description = meta.description
    }
    if (parsed.missingFiles.length > 0) {
      warnings.push(`${slug}: missing ${parsed.missingFiles.join(', ')}`)
    }
    projects.push(parsed)
  }

  const globals = {
    home: {
      heroImage: 'Image de fond.jpg',
      role: 'Réalisatrice · Artiste visuelle',
      intro:
        "Une image, deux images, une séquence de lumière et d'ombre. Collant à la chose filmée ou s'en décollant. Toute en subjectivité, je les peins, les triture, les malaxe, les desserre de leur étreinte « collet monté ».",
      ctaLabel: 'Découvrir mon univers',
      tagline: 'Réalisatrice · Artiste visuelle',
    },
    about: {
      photo: 'maman.jpg',
      profileImage: 'profilepicture.jpg',
      visionImage: 'fond.jpg',
      bio: "Tout commence par un regard.\n\nIl y a des rencontres qui changent une vie. Les miennes n'ont jamais été préméditées ; elles se sont simplement placées sur mon chemin.\n\nJe suis psychologue clinicienne et thérapeute spécialisée en traumatologie. Depuis toujours, je m'intéresse à ce qui façonne l'être humain : ses blessures, ses ressources, ses émotions, son imaginaire. Comprendre, accompagner, révéler… c'est le fil conducteur de mon parcours.\n\nEn 1999, la vie me conduit en Italie sur le tournage d'un long métrage de fiction. Rien ne me destinait à cette aventure. J'avais même refusé le rôle que me proposait le réalisateur. Il est revenu une deuxième fois. Puis une troisième. J'ai finalement accepté, sans imaginer que cette décision allait changer le cours de ma vie.\n\nPendant le tournage, une caméra Sony VHS passe entre mes mains. Je regarde à travers son objectif et cadre un simple brin d'herbe. Je reste fascinée. Ce n'est plus seulement un brin d'herbe : c'est un monde.\n\nPuis je tourne la caméra vers une jeune femme qui improvise un irrésistible jeu de séduction avec le chauffeur de notre authentique bus des années 60. Je filme leurs regards, leurs sourires, leurs gestes. Sans le savoir, je découvre ce jour-là le bonheur de raconter une histoire avec une caméra.\n\nLorsque la cheffe opératrice visionne les rushes, elle est surprise. Mais les cassettes VHS sont comptées. Pour pouvoir continuer à filmer, il faut en effacer une. Ce sera la mienne.\n\nMon premier film n'existe plus.\n\nEt pourtant, c'est lui qui a tout fait naître.\n\nPar la suite, cette même envie de raconter autrement m'a conduite à créer **LE TAROT DÉCRYPTÉ**, puis **L'EGO du MOI**. Deux créations différentes, mais animées par une même recherche : explorer l'imaginaire, les émotions et la manière dont chacun construit son regard sur le monde.\n\nAvec le temps, j'ai compris que la psychologie, la création et le cinéma procèdent, pour moi, d'un même mouvement : regarder autrement, déplacer le point de vue, révéler ce qui était déjà là, mais demeurait invisible.\n\nAujourd'hui, je reviens naturellement au cinéma. Non comme une nouvelle direction, mais comme le prolongement d'un chemin commencé il y a longtemps, lorsqu'un simple brin d'herbe m'a appris qu'une caméra pouvait transformer notre regard sur le monde.",
      visionText:
        "Voir est mon plus grand péché, depuis toute petite. Manger avec gourmandise les images, les couleurs, les ombres, les vides. Voir pour savoir, connaître, faire connaissance avec l'œil.\n\nUne image, deux images, une séquence de lumière et d'ombre. Collant à la chose filmée ou s'en décollant. Toute en subjectivité, je les peins, les triture, les malaxe, les desserre de leur étreinte « collet monté ».\n\nVision triple, sonde cérébrale, flash affectif, projection d'amour. Je vous laisse découvrir mes hantises, mes fantasmes, mes angoisses et mes joies.",
    },
    contact: {
      email: 'contact@katiakrylova.com',
      phone: '+32(0)474 468 168',
      calComUrl: 'https://cal.com/katia-krylova',
      backgroundImage: 'Fonds Contact.jpg',
      egoDuMoiUrl: 'https://katiafontaine.wixsite.com/ego-du-moi',
      tarotDecrypteUrl: 'https://tarot-decrypte.be',
    },
    journalPage: {
      photo: 'Fond News.jpg',
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
          "News\n\nTournage ce 3 juin 2026 de mon court-métrage : « Plus de lait », avec une team explosive!\n\nTrès heureuse de pouvoir à nouveau me retrouver sur un set de tournage avec des personnes talentueuses.\n\nPITCH :\n\nChaque matin, Marie-Christine, mère autoritaire et obsessionnelle, orchestre le petit déjeuner de son fils Stéphane, 30 ans, comme une cérémonie millimétrée entre médicaments, tartines et reproches passifs-agressifs. Mais lorsque Stéphane annonce tranquillement que Dieu lui parle — et semble commencer à produire des “miracles” de plus en plus gênants à table — le rituel dérape.\n\nEntre foi opportuniste, panique ménagère et déni tenace, Marie-Christine vacille : doit-elle appeler un médecin… ou réorganiser sa cuisine pour accueillir le Messie ?\n\n[Voir le projet](/projects/plus-de-lait)",
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
