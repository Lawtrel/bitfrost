import { act, renderHook } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { useMediaLoading } from './useMediaLoading';

describe("useMediaLoading", () => {

    beforeEach(() => {
        vi.useFakeTimers();
    })

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it("Deve iniciar com loading ativo e progresso 0", () => {
        const { result } = renderHook(() => 
            useMediaLoading()
        );
        
        expect(result.current.isLoading).toBe(true);

        expect(result.current.progress).toBe(0);
    });

    it('Deve aumentar o progresso automaticamente', () => {
        const { result } = renderHook(() => 
            useMediaLoading({
                speed: 100
            })
        );
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current.progress).toBeGreaterThan(0);
    });

    it("Não deve ultrapassar 90% durante o carregamento", () => {
        const { result } = renderHook(() =>
            useMediaLoading({
                speed: 10
            })
        )

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        expect(result.current.progress).toBeLessThanOrEqual(90);
    })

    it("Deve completar o carregamento", () => {
        const { result } = renderHook(() =>
            useMediaLoading()
        )

        act(() => {
            result.current.completeLoading();
        });

        expect(result.current.progress).toBe(100);
    })

    it("Deve remover o loading e resetar o carregamento", () => {
        const { result } = renderHook(() =>
            useMediaLoading({
                completionDelay:100
            })
        );

        act(() => {
            result.current.completeLoading();
        })

        expect(result.current.progress).toBe(100);

        act(() => {
            vi.runAllTimers();
        });

        expect(result.current.isLoading).toBe(false);

        act(() => {
            result.current.reset();
        })

        expect(result.current.isLoading).toBe(true)

        expect(result.current.progress).toBe(0);
    });
})