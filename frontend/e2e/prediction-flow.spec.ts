import { test, expect } from '@playwright/test';

test.describe('Flujo de la aplicación de predicción prepartida', () => {
  test('debe poder navegar a la vista prepartida y cambiar el tema', async ({ page }) => {
    // Ajusta la URL al puerto donde levantes Vite (por defecto 5173)
    await page.goto('http://localhost:5173');

    // Suponiendo que hay un botón en el inicio que lleva a PreMatchPrediction
    await page.click('text=Modelo Predictivo Prepartida');

    // Verifica que el componente cargó
    await expect(page.locator('h1')).toHaveText('Modelo Predictivo Prepartida');
    await expect(page.locator('text=En desarrollo...')).toBeVisible();

    // Prueba el cambio de tema
    const themeButton = page.locator('button[title="Cambiar Modo"]');
    await themeButton.click();

    // Verifica que el botón de volver funciona
    await page.click('text=Volver al Inicio');
  });
});

test.describe('Flujo de la aplicación de predicción minuto 15', () => {
  test('debe poder navegar a la vista Min15 y cambiar el tema', async ({ page }) => {
    // Ajusta la URL al puerto donde levantes Vite (por defecto 5173)
    await page.goto('http://localhost:5173');

    // Suponiendo que hay un botón en el inicio que lleva a PreMatchPrediction
    await page.click('text=Modelo Predictivo Minuto 15');


    // Verifica que el componente cargó
    await expect(page.locator('h1')).toHaveText('🗡️ Predicción Minuto 15');
    await expect(page.locator('text=Equipo Azul').first()).toBeVisible();
    await expect(page.locator('text=Equipo Rojo').first()).toBeVisible();
    await expect(page.locator('button:has-text("Ejecutar Modelo Predictivo")')).toBeVisible();

    // Verifica que puede alternar entre Temporada Regular y Playoffs
    const playoffsButton = page.locator('text=Temporada Regular');
    await playoffsButton.click();
    await expect(page.locator('text=Playoffs')).toBeVisible();

    // Verifica que puede seleccionar equipos
    const bloqueAzul = page.locator('div:has-text("Equipo Azul")');
    const botonAzul = bloqueAzul.locator('button:has-text("Seleccionar equipo...")').first();
    await botonAzul.click();
    const listaAzul = bloqueAzul.locator('ul');
    await expect(listaAzul).toBeVisible();
    await listaAzul.locator('li', { hasText: 'Fnatic' }).click();

    const bloqueRojo = page.locator('div:has-text("Equipo Rojo")');
    const botonRojo = bloqueRojo.locator('button:has-text("Seleccionar equipo...")').first();
    await botonRojo.click();
    const listaRojo = bloqueRojo.locator('ul');
    await expect(listaRojo).toBeVisible();
    await listaRojo.locator('li', { hasText: 'G2 Esports' }).click();

    // Verifica que se autocompletan los jugadores al seleccionar un equipo
    await expect(page.locator('text=Empyros').first()).toBeVisible();
    await expect(page.locator('text=Razork').first()).toBeVisible();
    await expect(page.locator('text=Vladi').first()).toBeVisible();
    await expect(page.locator('text=Upset').first()).toBeVisible();
    await expect(page.locator('text=Lospa').first()).toBeVisible();

    await expect(page.locator('text=BrokenBlade').first()).toBeVisible();
    await expect(page.locator('text=SkewMond').first()).toBeVisible();
    await expect(page.locator('text=Caps').first()).toBeVisible();
    await expect(page.locator('text=Hans Sama').first()).toBeVisible();
    await expect(page.locator('text=Labrov').first()).toBeVisible();

    // Verifica que puede seleccionar campeones
    const bloqueAzulUnico = page.locator('div.border.rounded-xl').filter({ has: page.locator('h3:has-text("Equipo Azul")') });
    const composicionAzul = bloqueAzulUnico.locator('.xl\\:grid-cols-5');
    await expect(composicionAzul).toBeVisible();

    await composicionAzul.locator('> div').nth(0).locator('button').first().click();
    await bloqueAzulUnico.locator('ul li', { hasText: 'Ambessa' }).click();

    await composicionAzul.locator('> div').nth(1).locator('button').first().click();
    await bloqueAzulUnico.locator('ul li', { hasText: 'Dr. Mundo' }).click();

    await composicionAzul.locator('> div').nth(2).locator('button').first().click();
    await bloqueAzulUnico.locator('ul li', { hasText: 'Viktor' }).click();

    await composicionAzul.locator('> div').nth(3).locator('button').first().click();
    await bloqueAzulUnico.locator('ul li', { hasText: 'Aphelios' }).click();

    await composicionAzul.locator('> div').nth(4).locator('button').first().click();
    await bloqueAzulUnico.locator('ul li', { hasText: 'Milio' }).click();

    const bloqueRojoUnico = page.locator('div.border.rounded-xl').filter({ has: page.locator('h3:has-text("Equipo Rojo")') });
    const composicionRojo = bloqueRojoUnico.locator('.xl\\:grid-cols-5');
    await expect(composicionRojo).toBeVisible();

    await composicionRojo.locator('> div').nth(0).locator('button').first().click();
    await bloqueRojoUnico.locator('ul li', { hasText: 'Ambessa' }).click();

    await composicionRojo.locator('> div').nth(1).locator('button').first().click();
    await bloqueRojoUnico.locator('ul li', { hasText: 'Dr. Mundo' }).click();

    await composicionRojo.locator('> div').nth(2).locator('button').first().click();
    await bloqueRojoUnico.locator('ul li', { hasText: 'Viktor' }).click();

    await composicionRojo.locator('> div').nth(3).locator('button').first().click();
    await bloqueRojoUnico.locator('ul li', { hasText: 'Aphelios' }).click();

    await composicionRojo.locator('> div').nth(4).locator('button').first().click();
    await bloqueRojoUnico.locator('ul li', { hasText: 'Milio' }).click();

    // Verifica que puede editar valores de dragon
    const buttonDragonAzul = page.locator('button:has-text("Equipo Azul")').last();
    await buttonDragonAzul.click();
    await expect(buttonDragonAzul).toHaveClass(/border-cyan-4/);
    await expect(buttonDragonAzul).toHaveClass(/bg-cyan-900\/40/);

    const buttonDragonRojo = page.locator('button:has-text("Equipo Rojo")').last();
    await buttonDragonRojo.click();
    await expect(buttonDragonRojo).toHaveClass(/border-red-4/);
    await expect(buttonDragonRojo).toHaveClass(/bg-red-900\/40/);

    await expect(buttonDragonAzul).toHaveClass(/border-gray-5/);

    // Verifica que puede editar valores de KDA
    const inputKillsAzul = page.locator('#blue-kills-15');
    const botonKillsAzulPlus = page.locator('div:has(> #blue-kills-15)').locator('button:has-text("+")');
    await botonKillsAzulPlus.click();
    await expect(inputKillsAzul).toHaveValue('1');

    const inputAssistsAzul = page.locator('#blue-assists-15');
    const botonAssistsAzulPlus = page.locator('div:has(> #blue-assists-15)').locator('button:has-text("+")');
    await inputAssistsAzul.fill('120');
    await expect(inputAssistsAzul).toHaveValue('99');

    const inputDeathsRojo = page.locator('#red-deaths-15');
    await inputDeathsRojo.fill('34');
    await expect(inputDeathsRojo).toHaveValue('34');

    // Verifica que puede editar valores de oro
    const inputOro = page.locator('#diff-gold');
    await inputOro.fill('88');
    await expect(inputOro).toHaveValue('20');

    // Verifica que puede editar valores de XP
    const inputNiveles = page.locator('#diff-level');
    await inputNiveles.fill('5');
    await expect(inputNiveles).toHaveValue('5');

    // Verifica que puede editar valores de CS
    const inputCS = page.locator('#diff-cs');
    await inputCS.fill('50');
    await expect(inputCS).toHaveValue('50');

    // Prueba el cambio de tema
    const themeButton = page.locator('button[title="Cambiar Modo"]');
    await themeButton.click();

    // Verifica que se ejecuta el modelo predictivo
    const submitBtn = page.locator('button:has-text("Ejecutar Modelo Predictivo")');
    await submitBtn.click();
    await expect(page.locator('text=Victoria Azul')).toBeVisible();
    await expect(page.locator('text=Victoria Rojo')).toBeVisible();

    // Verifica que el botón de volver funciona
    await page.click('text=Volver al Inicio');
  });
});
