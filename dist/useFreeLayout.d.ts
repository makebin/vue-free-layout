import { Ref } from 'vue';
import { LayoutItem, LayoutItemStyle, FreeLayoutOptions, SizeValue } from './types';

export declare function useFreeLayout<TPayload = any>(itemsRef: Ref<LayoutItem<TPayload>[]>, options?: FreeLayoutOptions): {
    containerRef: Ref<HTMLElement | null, HTMLElement | null>;
    containerSize: {
        width: number;
        height: number;
    };
    itemStyles: import('vue').ComputedRef<LayoutItemStyle[]>;
    toPixel: (val: SizeValue, base: number) => number;
    normalizeSize: (val: SizeValue) => string;
    findChangedItems: (newItems: LayoutItem<TPayload>[], oldItems: LayoutItem<TPayload>[]) => LayoutItem<TPayload>[];
};
