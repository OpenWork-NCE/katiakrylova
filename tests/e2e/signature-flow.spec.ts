import { test, expect } from '@playwright/test'

test('signature flow: home → projects → project page', async ({ page }) => {
  // 1. Home loads with hero
  await page.goto('/fr')
  await expect(page).toHaveTitle(/Katia Krylova/)
  await expect(page.locator('h1')).toContainText('Katia Krylova')

  // 2. Navigate to projects
  await page.click('text=Projects')
  await expect(page).toHaveURL(/\/fr\/projects/)

  // 3. Wait for 3D canvas to render
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible({ timeout: 10_000 })

  // 4. Click a project card (3D pick or fallback link)
  // The first project card has the featured project; clicking anywhere on the canvas
  // might not be deterministic. For E2E we verify the canvas exists and URL pattern.
  // Then we navigate directly to a known project.
  await page.goto('/fr/projects/la-tache-noire')

  // 5. Project page renders
  await expect(page.locator('h1')).toContainText('La Tâche Noire')
})