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

test('La Petite Faucheuse contains approved formats and description', async () => {
  const manifest = JSON.parse(await readFile('scripts/data/projects-manifest.json', 'utf8'))
  const project = manifest.projects.find((entry) => entry.slug === 'la-petite-faucheuse')

  assert.deepEqual(project.format, ['Court-métrage', 'Scénario', 'Réalisation', 'Montage partiel'])
  assert.equal(
    project.description,
    'Le film raconte une histoire familiale éclatée suite à un drame : la mort d’Antoine, 6 ans.\nLa mère, Aurore l’hallucine comme étant toujours présent, la douleur de la perte restant\ningérable.\nLe père, VIictor, est présent et absent, il a tout perdu. Et sa femme et son enfant. Il\nregarde cette épouse dévastée, il ira jusqu’à ‘voir’ la présence de son ls pour ne pas\nperdre sa femme.',
  )
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

test('project format field supports the approved multiple values', async () => {
  const { Projects } = await import('../../src/collections/Projects.ts')
  const format = Projects.fields.find((field) => 'name' in field && field.name === 'format')

  assert.equal(format?.hasMany, true)
  assert.deepEqual(format?.options?.slice(-3), ['SCÉNARIO', 'PRISE DE VUE', 'MONTAGE'])
})

test('project formats render legacy strings and multiple values', () => {
  assert.equal(formatProjectFormats('Court-métrage'), 'Court-métrage')
  assert.equal(formatProjectFormats(['SCÉNARIO', 'PRISE DE VUE', 'MONTAGE']), 'SCÉNARIO · PRISE DE VUE · MONTAGE')
})
