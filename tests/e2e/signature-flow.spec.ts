import { test, expect } from '@playwright/test'

test('signature flow: home → projects → project page', async ({ page }) => {
  // 1. Home loads with hero
  await page.goto('/fr')
  await expect(page).toHaveTitle(/Katia Krylova/)
  await expect(page.locator('h1')).toContainText('Katia Krylova')

  // 2. Navigate to projects
  await page.click('text=Projects')
  await expect(page).toHaveURL(/\/fr\/projects/)

  // 3. Wait for 3D canvas and scroll invite
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText(/Scroller pour découvrir/i)).toBeVisible()

  // 4. Click CTA opens project detail
  await page.getByRole('link', { name: /Voir le projet/i }).click()
  await expect(page).toHaveURL(/\/fr\/projects\//)

  // 5. Project page with video embed
  await page.goto('/fr/projects/la-tache-noire')
  await expect(page.locator('h1')).toContainText('La Tâche Noire')
  await expect(page.locator('iframe[src*="youtube"]')).toBeVisible()
})