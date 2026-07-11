import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRotatingText } from './useRotatingText';

describe('useRotatingText', () => {
    const messages =[
        'A', 'B', 'C'
    ];

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('Deve começar no item 0', () => {
        const { result } = renderHook(() => 
            useRotatingText({ items: messages, interval: 4000 })
        );
        
        expect(result.current).toBe(0);
    });
    
    it('Deve avançar para o próximo item após o intervalo', () => {
        const { result } = renderHook(() => 
            useRotatingText({ items: messages, interval: 4000 })
        );
        act(() => {
            vi.advanceTimersByTime(4000);
        });
        expect(result.current).toBe(1);
    })

    it('Deve voltar para o primeiro item após o último item', () => {
        const { result } = renderHook(() => 
            useRotatingText({ items: messages, interval: 4000 })
        );
        act(() => {
            vi.advanceTimersByTime(4000 * messages.length);
        });
        expect(result.current).toBe(0);
    });

    it("Não deve rotacionar quando houver apenas um item", () => {

        const { result } = renderHook(() =>
            useRotatingText({
                items: ["Mensagem única"],
                interval: 4000,
            })
        );

        expect(result.current).toBe(0);

        act(() => {
            vi.advanceTimersByTime(12000);
        });

        expect(result.current).toBe(0);

    });

    it("Não deve rotacionar quando a lista estiver vazia", () => {
        const { result } = renderHook(() =>
            useRotatingText({
                items: [],
                interval: 4000,
            })
        );

        expect(result.current).toBe(0);

        act(() => {
            vi.advanceTimersByTime(12000);
        });

        expect(result.current).toBe(0);
    });

    it("Deve limpar o intervalo ao desmontar", () => {
        const clearIntervalSpy = vi.spyOn(window, "clearInterval");

        const { unmount } = renderHook(() =>
            useRotatingText({
                items: messages,
            })
        );

        unmount();

        expect(clearIntervalSpy).toHaveBeenCalled();

        clearIntervalSpy.mockRestore();
    });

    it("Deve reiniciar o intervalo quando o tempo mudar", () => {
        const { result, rerender } = renderHook(
            ({ interval }) =>
                useRotatingText({
                    items: messages,
                    interval,
                }),
            {
                initialProps: {
                    interval: 4000,
                },
            }
        );

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(result.current).toBe(1);

        rerender({
            interval: 1000,
        });

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(2);
    });
});