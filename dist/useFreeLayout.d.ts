import { Ref } from 'vue';
import { LayoutItem, LayoutItemStyle, FreeLayoutOptions, SizeValue, LayoutItemPartial } from './types';

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
    refreshLayout: () => void;
    resolveItem: (item: LayoutItem<TPayload>) => {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    resolveAllItems: () => Array<LayoutItem<TPayload> & {
        pixelX: number;
        pixelY: number;
        pixelW: number;
        pixelH: number;
    }>;
    getItemById: (id: string | number) => LayoutItem<TPayload> | undefined;
    getItemIndex: (id: string | number) => number;
    getItemPixelRect: (id: string | number) => {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
    updateItem: (id: string | number, updates: LayoutItemPartial) => boolean;
    addItem: (item: LayoutItem<TPayload>) => number;
    removeItem: (id: string | number) => boolean;
    clearAll: () => void;
    selectItem: (id: string | number) => boolean;
    deselectItem: (id: string | number) => boolean;
    toggleSelect: (id: string | number) => boolean;
    clearSelection: () => void;
    getSelectedItems: () => LayoutItem<TPayload>[];
    showItem: (id: string | number) => boolean;
    hideItem: (id: string | number) => boolean;
    toggleVisibility: (id: string | number) => boolean;
    getVisibleItems: () => LayoutItem<TPayload>[];
    setZIndex: (id: string | number, zIndex: number) => boolean;
    bringToFront: (id: string | number) => boolean;
    sendToBack: (id: string | number) => boolean;
    moveForward: (id: string | number) => boolean;
    moveBackward: (id: string | number) => boolean;
};
