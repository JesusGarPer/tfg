// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';
import Min15Prediction from '../Min15Prediction';

// Simulamos los componentes hijos para aislar la prueba de Min15Prediction
// Esto evita las alertas por datos no rellenados en los selects y nos permite centrarnos en la lógica del componente principal.
vi.mock('../utils/SearchableSelect', () => ({
  default: ({ placeholder, name }: { placeholder: string; name?: string }) => (
    <div data-testid="mock-select">
      {placeholder}
      {name && <input type="hidden" name={name} value="MockValidData" />}
    </div>
  )
}));

describe('Componente Min15Prediction', () => {
  // Simulamos la función fetch global
  const mockFetch = vi.fn();
  vi.stubGlobal('fetch', mockFetch);

  // Simulamos la función alert global para evitar pop-ups durante las pruebas
  vi.stubGlobal('alert', vi.fn());

  beforeEach(() => {
    mockFetch.mockReset();

    // Por defecto, simulamos que todas las peticiones GET del useEffect devuelven arrays vacíos
    // para que el componente se renderice sin errores.
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} })
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.unstubAllGlobals(); // Se libera el fetch y el alert solo cuando terminan los 6 tests
  });

  it('renderiza el título y los elementos principales correctamente', async () => {
    render(<Min15Prediction onBack={() => {}} isDark={true} toggleTheme={() => {}} />);

    // Verificamos que el título se muestra
    expect(screen.getByText(/Predicción Minuto 15/i)).toBeDefined();

    // Verificamos que se renderizan las secciones de los equipos
    expect(screen.getAllByText('Equipo Azul').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Equipo Rojo').length).toBeGreaterThan(0);

    // Botón de ejecución presente
    expect(screen.getByText('Ejecutar Modelo Predictivo')).toBeDefined();
  });

  it('llama a las funciones de navegación y tema (props)', () => {
    const mockOnBack = vi.fn();
    const mockToggleTheme = vi.fn();

    render(<Min15Prediction onBack={mockOnBack} isDark={true} toggleTheme={mockToggleTheme} />);

    // Probar el botón de volver
    const backButton = screen.getByText(/Volver al Inicio/i);
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledOnce();

    // Probar el botón del tema
    const themeButton = screen.getByTitle('Cambiar Modo');
    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });

  it('alterna correctamente el botón de Playoffs / Temporada Regular', () => {
    render(<Min15Prediction onBack={() => {}} isDark={true} toggleTheme={() => {}} />);

    // Inicialmente debe decir Temporada Regular
    const toggleButton = screen.getByText(/Temporada Regular/i);
    expect(toggleButton).toBeDefined();

    // Al hacer clic, debe cambiar a Playoffs
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Playoffs/i)).toBeDefined();
  });

  it('incrementa el valor de un input al mantener pulsado el botón "+"', () => {
    // Activamos los temporizadores falsos
    vi.useFakeTimers();

    render(<Min15Prediction onBack={() => {}} isDark={true} toggleTheme={() => {}} />);

    // Cogemos el primer botón "+" que encontremos
    const botonesPlus = screen.getAllByText(/\+/);
    const primerBotonPlus = botonesPlus[0];

    // Buscamos el input numérico correspondiente.
    const inputsNumericos = screen.getAllByRole('textbox');
    const inputAsociado = inputsNumericos[0];

    // Guardamos el valor inicial para comparar
    const valorInicial = Number(inputAsociado.getAttribute('value')) || 0;

    // Simulamos mantener pulsado el botón
    fireEvent.mouseDown(primerBotonPlus);

    // Avanzamos el tiempo 1000 milisegundos de forma instantánea
    vi.advanceTimersByTime(1000);

    // Soltamos el botón
    fireEvent.mouseUp(primerBotonPlus);

    // Comprobamos el resultado.
    const valorFinal = Number((inputAsociado as HTMLInputElement).value);
    expect(valorFinal).toBeGreaterThan(valorInicial);

    // Restauramos el reloj normal para que los demás tests no fallen
    vi.useRealTimers();
  });

  it('envía el formulario y muestra la predicción exitosa', async () => {
    render(<Min15Prediction onBack={() => {}} isDark={true} toggleTheme={() => {}} />);

    // Preparamos el mock de fetch para interceptar específicamente el POST de predicción
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes('/api/predict-match')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            blue_team: "Equipo Azul",
            red_team: "Equipo Rojo",
            win_probability_blue: 0.654,
            win_probability_red: 0.346
          })
        };
      }
      return { ok: true, json: async () => ({ data: {} }) }; // Fallback para los GET iniciales
    });

    const submitBtn = screen.getByText('Ejecutar Modelo Predictivo');

    // Enviamos el formulario
    fireEvent.click(submitBtn);

    // Esperamos a que la UI se actualice con los resultados de la promesa
    await waitFor(() => {
      // El componente formatea el 0.654 a 65.4%
      expect(screen.getByText('65.4%')).toBeDefined();
      expect(screen.getByText('34.6%')).toBeDefined();
      expect(screen.getByText('Victoria Azul')).toBeDefined();
      expect(screen.getByText('Victoria Rojo')).toBeDefined();
    });
  });

  it('muestra un mensaje de error si la API de predicción falla', async () => {
    render(<Min15Prediction onBack={() => {}} isDark={true} toggleTheme={() => {}} />);

    // Simulamos un error 400 del backend
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes('/api/predict-match')) {
        return {
          ok: false,
          status: 400,
          json: async () => ({
            detail: "Faltan estadísticas de la partida"
          })
        };
      }
      return { ok: true, json: async () => ({ data: {} }) };
    });

    const submitBtn = screen.getByText('Ejecutar Modelo Predictivo');
    fireEvent.click(submitBtn);

    // Verificamos que el mensaje de error se renderiza en la pantalla
    await waitFor(() => {
      expect(screen.getByText('Faltan estadísticas de la partida')).toBeDefined();
    });
  });
});
