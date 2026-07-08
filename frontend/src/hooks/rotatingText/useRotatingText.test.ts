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
});