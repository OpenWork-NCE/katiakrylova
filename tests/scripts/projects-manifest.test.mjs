import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const { formatProjectFormats } = await import('../../src/lib/utils.ts')

test('Innuit manifest entry contains approved formats and description', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'que-faire-avec-innuit-siniswichi')

  assert.deepEqual(project.format, ['SCÉNARIO', 'PRISE DE VUE', 'MONTAGE'])
  assert.equal(project.format.join(' · '), 'SCÉNARIO · PRISE DE VUE · MONTAGE')
  assert.equal(
    project.description,
    'Le projet expérimental autour du personnage d’innuit siniswichi, double conceptuel de l’artiste Sylvain Paris, est mon premier court-métrage.\nJe rencontre un homme qui se prend pour un éléphant, il se présente à moi sous le\nnom d’innuit siniswichi, je tente dans cet essai de lui donner réalité ...',
  )
})

test('La Robe Ragot manifest entry contains approved formats and description', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'la-robe-ragot')

  assert.deepEqual(project.format, ['Film-documentaire', 'Photos'])
  assert.equal(
    project.description,
    "Mini Documentaire autour de l'oeuvre du sculpteur Sophie De Meyer :\nLa Robe Ragot\n\nC’est quoi un ragot, ça sert à quoi, c’est quoi être la plus belle pour aller danser?\nLa robe de Sophie De Meyer nous parle de cela et de bien plus ou comment de\nvulgaires papiers créent une oeuvre d’art.",
  )
})

test('La Petite Faucheuse uses YouTube as its primary video', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'la-petite-faucheuse')

  assert.equal(project.externalLinks[0].platform, 'YouTube')
  assert.equal(project.externalLinks[0].url, 'https://www.youtube.com/watch?v=VPh0IlIfUdw')
})

test('La Petite Faucheuse gallery excludes IMG_2158', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'la-petite-faucheuse')

  assert.ok(!project.gallery.includes('IMG_2158.gif'))
  assert.ok(!project.gallery.includes('IMG_2158-3.gif'))
})

test('Plus de lait uses the approved featured YouTube video', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'plus-de-lait')

  assert.equal(project.externalLinks[0].platform, 'YouTube')
  assert.equal(project.externalLinks[0].url, 'https://www.youtube.com/watch?v=67XhPteM5ZI')
})

test('Innuit uses the approved featured YouTube video', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'que-faire-avec-innuit-siniswichi')

  assert.equal(project.externalLinks[0].platform, 'YouTube')
  assert.equal(project.externalLinks[0].url, 'https://www.youtube.com/watch?v=Dz-9MNOsOxc')
})

test('La Petite Faucheuse contains approved formats and description', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'la-petite-faucheuse')

  assert.deepEqual(project.format, ['Court-métrage', 'Scénario', 'Réalisation', 'Montage partiel'])
  assert.equal(
    project.description,
    'Le film raconte une histoire familiale éclatée suite à un drame : la mort d’Antoine, 6 ans.\nLa mère, Aurore l’hallucine comme étant toujours présent, la douleur de la perte restant\ningérable.\nLe père, VIictor, est présent et absent, il a tout perdu. Et sa femme et son enfant. Il\nregarde cette épouse dévastée, il ira jusqu’à ‘voir’ la présence de son ls pour ne pas\nperdre sa femme.',
  )
})

test('La Petite Faucheuse appends the supplied production stills to its gallery', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'la-petite-faucheuse')

  assert.deepEqual(project.gallery.slice(-10), [
    'LPF2.jpg',
    'LPF3.jpg',
    'LPF4.jpg',
    'LPF5.jpg',
    'LPF6.jpg',
    'LPF7.jpg',
    'LPF8.jpg',
    'LPF9.jpg',
    'LPF1.jpg',
    'LPF10.jpg',
  ])
})

test('Seconde Papillon contains approved formats, description, and cover image', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'seconde-papillon')

  assert.deepEqual(project.format, ['Performance', 'Collaboration', 'Film', 'Montage', 'Photos'])
  assert.equal(project.coverImage, 'papillon.jpg')
  assert.equal(
    project.description,
    'Vidéo Performance autour de l\'oeuvre de la plasticienne Sylvie Pichrist autour du concept de Métamorphoses.\n\nMETAMORPHOSES\n9 \' Biennale ARTour\nDu 23 juin au 25 aout 2013\nVernissage le 23 juin à 11 h au musée du Musée du Masque à Binche et\nà 13 h place Communale de la Louvière\n(www.artour.be)\n"Seconde papillon"\nEcomusée du Bois du Luc -Ancien site minier\nSylvie Pichrist',
  )
})

test('Mirage contains approved formats and description', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'paphius')

  assert.deepEqual(project.format, ['Making Of', 'Photos de plateau'])
  assert.equal(
    project.description,
    'Clip musical du nouveau groupe "JOY" de Marc Huyghens (ex Vénus).\nLa thématique du film fait référence à « On achève bien les chevaux » de Sydney\nPollack, 1969.\n\nClip filmé en super 8 par Séverine De Strycker Joy is a belgian-swedish trio founded in Brussels in 2008. The group features Françoise Vidick on drums ans vocals, Anja Naucler on cello and Marc A. Huyghens (who previously fronted the band Venus) on guitar and vocals. Their music conjures up a nightly scent of wind, earth, soot and dust.',
  )
})

test('Hip Hop de Rue contains approved formats, description, and annotated second video', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'hip-hop-de-rue')

  assert.deepEqual(project.format, ['Making Of', 'Photos de plateau'])
  assert.equal(project.description, 'Making of d’un clip musical du chanteur autodidacte Rodwyn')
  assert.deepEqual(project.externalLinks[1], {
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=nDs5HIDi7BE',
    description:
      "Apres les clips BOOM SHAKATA et MA DING WA l'artiste RODWYN vous offre ce 3eme vidéogramme de la chanson hip hop de rue réalisé et montée par un jeune talent de la street du nom de Marabout.",
  })
})

test('Manacao contains approved formats and replacement description', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'manacao')

  assert.deepEqual(project.format, ['Making Of', 'Photos de plateau'])
  assert.equal(
    project.description,
    "Si vous aimez le saphisme, l'inceste et la consanguinité et le tout dans une plaine de jeux, bon visionnage !\nCourt-Métrage de Donovan Alonso-Garcia\n\nPhotos de plateau et Making Of. Kino Kabaret International 2013 (Brussels).",
  )
})

test('La Beauté du Geste contains approved formats, description, and video', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'la-beaute-du-geste')

  assert.deepEqual(project.format, ['Réalisation', 'Scénario', 'Montage'])
  assert.equal(
    project.description,
    'La beauté du geste raconte les premiers émois inoffensifs d’un jeune homme méthodique.\n\nC-M dans le cadre du 5ème Kino Kabaret International de Bruxelles, du 29/03 au 5/04/13 à la Maison de la Création, Bruxelles-Nord (Laeken).',
  )
  assert.equal(project.externalLinks[0].url, 'https://www.youtube.com/watch?v=7VESxLSnBDM')
})

test('Le Mariage Campagnard preserves its current format and adds the approved formats', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'le-mariage-campagnard')

  assert.deepEqual(project.format, ['Essai expérimental', 'Photos', 'Animation', 'Montage'])
})

test('YADEL contains approved formats, description, and videos', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'yadel')

  assert.deepEqual(project.format, ['Making Of', 'Photos de plateau'])
  assert.equal(
    project.description,
    'Le film «YADEL» plonge dans l’intimité d’un jeune homme venu au monde dans une famille où un garçon est né et mort avant lui et qui s’appelait déjà Yadel.\nHéritier du nom d’un mort, Yadel nous entraîne dans sa quête initiatique.\nYADEL est le premier film de Kenän Gorgün.',
  )
  assert.deepEqual(project.externalLinks.map((link) => link.url), [
    'https://www.youtube.com/watch?v=ZAkgTis02Lw',
    'https://vimeo.com/49739191',
  ])
  assert.equal(
    project.externalLinks[1].description,
    'YADEL by Kenan Gorgun - turkish subtitled version\nAfter five books written and published by major houses in Paris, and two screenplays I wrote for\nmovie director Taylan Barman, I felt it was time for me to shot my own work. The result is YADEL.\nShot with very little money, it looks like to everyone that it costed 3 times more. It didn\'t. It is a good\nexample of making more with less. Had a great crew. Very short schedule to shot it but many many\nlocations; some entire sequences didn\'t survive the editing room. I made this movie as a "carte de\nvisite", in order to start working on my projet SAD SUGAR (which is meant to be the first movie of a\nthree-movie serie.) I have connections in France and Belgium, producers I worked with, and look\nfor a main producer (the movie would be shot in Turkish and English…).',
  )
})

test('Cine Palace contains approved formats and replacement description', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'cine-palace')

  assert.deepEqual(project.format, ['Making Of', 'Photos de plateau'])
  assert.equal(
    project.description,
    '“CINE PALACE” court-métrage de SEVERINE DE STREYKER.\nCiné Palace retrace la journée d’une strip-teaseuse dans un huis clos d’un cinéma spectacle comme il n’en existe plus beaucoup.\n\nCine Palace\nSéverine De Streyker\nBelgium / 2011 / Fiction / 14\'18',
  )
})

test('project format field supports the approved multiple values', async () => {
  // Read source (avoid loading Payload collection modules under bare Node)
  const source = await readFile('src/collections/Projects.ts', 'utf8')
  assert.match(source, /name:\s*'format'/)
  assert.match(source, /hasMany:\s*true/)
  assert.match(source, /'SCÉNARIO'/)
  assert.match(source, /'PRISE DE VUE'/)
  assert.match(source, /'MONTAGE'/)
})

test('project formats render legacy strings and multiple values', () => {
  assert.equal(formatProjectFormats('Court-métrage'), 'Court-métrage')
  assert.equal(formatProjectFormats(['SCÉNARIO', 'PRISE DE VUE', 'MONTAGE']), 'SCÉNARIO · PRISE DE VUE · MONTAGE')
})

test('home hero shade keeps the background image visible', async () => {
  const styles = await readFile('src/styles/home-hero.css', 'utf8')

  assert.match(styles, /\.home-hero__shade\s*\{\s*background: rgba\(10, 10, 10, 0\.22\);\s*\}/)
})

test('projects presentation body is left aligned', async () => {
  const styles = await readFile('src/styles/projects-intro.css', 'utf8')

  assert.match(styles, /\.projects-intro__body\s*\{[\s\S]*?text-align: left;/)
})

test('about manifest uses the new vision section instead of the bottom gallery', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/globals-manifest.json', 'utf8'))

  assert.equal(manifest.about.visionImage, 'fond.jpg')
  assert.equal(
    manifest.about.visionText,
    "Voir est mon plus grand péché, depuis toute petite. Manger avec gourmandise les images, les couleurs, les ombres, les vides. Voir pour savoir, connaître, faire connaissance avec l'œil.\n\nUne image, deux images, une séquence de lumière et d'ombre. Collant à la chose filmée ou s'en décollant. Toute en subjectivité, je les peins, les triture, les malaxe, les desserre de leur étreinte « collet monté ».\n\nVision triple, sonde cérébrale, flash affectif, projection d'amour. Je vous laisse découvrir mes hantises, mes fantasmes, mes angoisses et mes joies.",
  )
  assert.equal('gallery' in manifest.about, false)
})

test('about page renders the portrait first and the CMS vision section', async () => {
  const view = await readFile('src/components/about/AboutView.tsx', 'utf8')
  const styles = await readFile('src/styles/about-page.css', 'utf8')

  assert.ok(view.indexOf('about-page__aside') < view.indexOf('about-page__bio'))
  assert.match(view, /about-page__vision/)
  assert.match(styles, /\.about-page__bio\s*\{[\s\S]*?font-size: clamp\(0\.8125rem, 2vw, 0\.9375rem\);/)
  assert.match(styles, /\.about-page__vision-copy\s*\{[\s\S]*?text-align: left;/)
})

test('about keeps its two image sections isolated', async () => {
  const view = await readFile('src/components/about/AboutView.tsx', 'utf8')
  const styles = await readFile('src/styles/about-page.css', 'utf8')

  assert.match(view, /about-page__intro/)
  assert.match(view, /about-page__intro-backdrop/)
  assert.match(styles, /\.about-page__intro-backdrop\s*\{[\s\S]*?position:\s*absolute;/)
  assert.match(styles, /\.about-page__bg\s*\{[\s\S]*?background-size:\s*cover;/)
  assert.match(styles, /\.about-page__vision\s*\{[\s\S]*?margin-top:\s*0;/)
})
