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
