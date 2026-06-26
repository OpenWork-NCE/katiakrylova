import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  // 1. Globals
  await payload.updateGlobal({
    slug: 'about',
    data: {
      bio: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              version: 1,
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              children: [{
                mode: 'normal',
                text: "Voir est mon plus grand péché, depuis toute petite. Manger avec gourmandise les images, les couleurs, les ombres, les vides. Voir pour savoir, connaître, faire connaissance avec l'œil.\n\nUne image, deux images, une séquence de lumière et d'ombre. Collant à la chose filmée ou s'en décollant. Toute en subjectivité, je les peins, les triture, les malaxe, les desserre de leur étreinte « collet monté ».\n\nVision triple, sonde cérébrale, flash affectif, projection d'amour. Je vous laisse découvrir mes hantises, mes fantasmes, mes angoisses et mes joies.",
                type: 'text',
                version: 1,
                detail: 0,
                style: '',
              }],
            },
          ],
        },
      },
    },
    locale: 'fr',
  })

  await payload.updateGlobal({
    slug: 'contact',
    data: {
      email: 'contact@katiakrylova.com',
      phone: '+32(0)474 468 168',
      calComUrl: 'https://cal.com/katia-krylova',
    },
    locale: 'fr',
  })

  // 2. Portfolio categories
  const categories = ['Collage', 'Gravure', 'Identity', 'Letter']
  for (let i = 0; i < categories.length; i++) {
    await payload.create({
      collection: 'portfolio-categories',
      data: { name: categories[i], slug: categories[i].toLowerCase(), order: i },
      locale: 'fr',
      draft: true,
    })
  }

  // 3. Projects — slug + year + format from INDEX.md
  const projectsData = [
    { slug: 'la-tache-noire', title: 'La Tâche Noire', year: 2025, format: 'Court-métrage', description: "Court-métrage – Tournage express (8 heures maximum) réalisé à l'atelier de l'Académie des arts d'Uccle." },
    { slug: 'casting', title: 'CASTING', year: 2025, format: 'Court-métrage', description: "Casting retrace une journée haute en couleurs où il est question d'ambitions contrariées entre un réalisateur borné et des candidat.e.s, plus dingues les uns des autres!" },
    { slug: 'presentation-teresa-1', title: 'TERESA Présentation', year: 2021, format: 'Documentaire', description: 'TERESA VIESTI, présentation' },
    { slug: 'teresa-viesti', title: 'DÉFILÉ MODE', year: 2021, format: 'Documentaire', description: "Défilé pour l'école de Stylisme. Présentation de quatre pièces. Teresa Viesti Collection." },
    { slug: 'light-vador', title: 'LIGHT VADOR', year: 2016, format: 'Court-métrage', description: "La journée extraordinaire d'un héros ordinaire. Scénario, réalisation et montage." },
    { slug: 'la-petite-faucheuse', title: 'LA PETITE FAUCHEUSE', year: 2015, format: 'Court-métrage', description: "«LA PETITE FAUCHEUSE» court-métrage de KATIA FONTAINE Aurore, belle jeune femme de 28 ans, Victor son mari, 35 ans et leur petit garçon de 6 ans, Antoine, vivent heureux et sans histoires dans un monde …" },
    { slug: 'strangers', title: 'STRANGERS', year: 2014, format: 'Making Of', description: 'Making Of, photos de plateau et affiche Premier court-métrage de Philippe Geus.' },
    { slug: 'seconde-papillon', title: 'SECONDE PAPILLON', year: 2014, format: 'Performance', description: "Vidéo Performance autour de l'œuvre de la plasticienne Sylvie Pichrist sur la thématique des Métamorphoses." },
    { slug: 'paphius', title: 'MIRAGE', year: 2013, format: 'Clip', description: 'Making Of et photos de plateau Clip musical du nouveau groupe « JOY » de Marc Huyghens.' },
    { slug: 'hip-hop-de-rue', title: 'HIP HOP DE RUE', year: 2013, format: 'Clip', description: 'Making Of – Montage – Etalonnage – Photos Le chanteur auteur-compositeur Rodwyn.' },
    { slug: 'alice-au-pays-des-ombres', title: 'ALICE AU PAYS DES OMBRES', year: 2013, format: 'Essai expérimental', description: "Essai expérimental sur base d'images fixes. Music and lyrics by David Lynch." },
    { slug: 'manacao', title: 'MANACAO', year: 2013, format: 'Making Of', description: 'Photos de plateau et Making Of. Kino Kabaret International 2013 (Brussels).' },
    { slug: 'la-beaute-du-geste', title: 'LA BEAUTE DU GESTE', year: 2013, format: 'Court-métrage', description: "La beauté du geste raconte les premiers émois inoffensifs d'un jeune homme méthodique." },
    { slug: 'que-faire-avec-innuit-siniswichi', title: 'QUE FAIRE AVEC INNUIT SINISWICHI', year: 2013, format: 'Court-métrage', description: "Le projet expérimental autour du personnage d'innuit siniswichi, double conceptuel de l'artiste Sylvain Paris." },
    { slug: 'le-mariage-campagnard', title: 'LE MARIAGE CAMPAGNARD', year: 2013, format: 'Essai expérimental', description: "Essai d'animation sur base de 200 photos ratées." },
    { slug: 'la-robe-ragot', title: 'LA ROBE RAGOT', year: 2013, format: 'Documentaire', description: "Mini Documentaire autour de l'oeuvre du sculpteur Sophie De Meyer." },
    { slug: 'hero-zero', title: 'HERO ZERO', year: 2013, format: 'Court-métrage', description: "Prise de vues, photos de plateau, montage et étalonnage. Court métrage de Sébastien mélot." },
    { slug: 'yadel', title: 'YADEL', year: 2013, format: 'Making Of', description: 'Making Of et Photos de plateau. Yadel is the last son born to a Turkish family living in Belgium.' },
    { slug: 'cine-palace', title: 'CINE PALACE', year: 2013, format: 'Making Of', description: 'Making Of, photos de plateau. Cine Palace court-métrage de Séverine De Streyker.' },
  ]

  const externalLinks: Record<string, { platform: 'Vimeo' | 'YouTube'; url: string }[]> = {
    'alice-au-pays-des-ombres': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=NagZ3zRKrdo' }],
    'casting': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=bfdJ_oSxmFc' }],
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
    'manacao': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=oFjSNHDKm4Y' }],
    'paphius': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=S5_8AzISuqM' }],
    'presentation-teresa-1': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=HrX-4HMQHuM' }],
    'seconde-papillon': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=L0MMAVRswOY' }],
    'teresa-viesti': [{ platform: 'YouTube', url: 'https://www.youtube.com/watch?v=O3ABvb6TfmQ' }],
  }

  for (let i = 0; i < projectsData.length; i++) {
    const p = projectsData[i]
    await payload.create({
      collection: 'projects',
      data: {
        title: p.title,
        slug: p.slug,
        year: p.year,
        format: p.format as 'Court-métrage' | 'Clip' | 'Performance' | 'Documentaire' | 'Essai expérimental' | 'Making Of',
        description: p.description,
        order: i,
        externalLinks: externalLinks[p.slug] ?? [],
      },
      locale: 'fr',
      draft: true,
    })
  }

  console.log(`✓ Migrated ${projectsData.length} projects`)
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })