import { test, expect } from '@playwright/test'

test('signature flow: home → projects → project page', async ({ page }) => {
  // 1. Home loads with hero
  await page.goto('/fr')
  await expect(page).toHaveTitle(/Katia Krylova/)
  await expect(page.locator('h1')).toContainText('Katia Krylova')

  // 2. Navigate to projects
  await page.click('text=Projets')
  await expect(page).toHaveURL(/\/fr\/projects/)

  // 3. Dismiss intro overlay if present, then vertical list is available
  const intro = page.getByRole('dialog', { name: /Mes projets/i })
  if (await intro.isVisible().catch(() => false)) {
    await intro.click()
  }
  await expect(page.getByRole('heading', { name: 'Projets', exact: true })).toBeVisible({
    timeout: 10_000,
  })
  await expect(page.getByRole('link', { name: /Voir le projet/i }).first()).toBeVisible()

  // 4. Open first project from the scroll list
  await page.getByRole('link', { name: /Voir le projet/i }).first().click()
  await expect(page).toHaveURL(/\/fr\/projects\//)

  // 5. Project page with video embed
  await page.goto('/fr/projects/la-tache-noire')
  await expect(page.locator('h1')).toContainText('La Tâche Noire')
  await expect(page.locator('iframe[src*="youtube"]')).toBeVisible()
})
