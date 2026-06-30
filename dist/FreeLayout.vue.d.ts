import { LayoutItem } from './types';

interface Props<TPayload = any> {
    items: LayoutItem<TPayload>[];
    animationDuration?: number;
    animationEasing?: string;
    roundPixel?: boolean;
    overflow?: 'hidden' | 'auto' | 'visible' | 'scroll';
    multiSelect?: boolean;
}
declare function __VLS_template(): {
    default?(_: {
        item: LayoutItem<any>;
        index: number;
        style: import('./types').LayoutItemStyle;
    }): any;
};
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props<any>>, {
    animationDuration: number;
    animationEasing: string;
    roundPixel: boolean;
    overflow: string;
    multiSelect: boolean;
}>>, {
    containerSize: {
        width: number;
        height: number;
    };
    getContainerSize: () => {
        width: number;
        height: number;
    };
    refreshLayout: () => void;
    resolveItem: (item: LayoutItem<any>) => {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    resolveAllItems: () => (LayoutItem<any> & {
        pixelX: number;
        pixelY: number;
        pixelW: number;
        pixelH: number;
    })[];
    getItemById: (id: string | number) => LayoutItem<any> | undefined;
    getItemIndex: (id: string | number) => number;
    getItemPixelRect: (id: string | number) => {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
    updateItem: (id: string | number, updates: Partial<Omit<LayoutItem<any>, "id">>) => boolean;
    addItem: (item: LayoutItem<any>) => number;
    removeItem: (id: string | number) => boolean;
    clearAll: () => void;
    selectItem: (id: string | number) => boolean;
    deselectItem: (id: string | number) => boolean;
    toggleSelect: (id: string | number) => boolean;
    clearSelection: () => void;
    getSelectedItems: () => LayoutItem<any>[];
    showItem: (id: string | number) => boolean;
    hideItem: (id: string | number) => boolean;
    toggleVisibility: (id: string | number) => boolean;
    getVisibleItems: () => LayoutItem<any>[];
    setZIndex: (id: string | number, zIndex: number) => boolean;
    bringToFront: (id: string | number) => boolean;
    sendToBack: (id: string | number) => boolean;
    moveForward: (id: string | number) => boolean;
    moveBackward: (id: string | number) => boolean;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "item-click": (item: LayoutItem<any>, index: number) => void;
    "item-double-click": (item: LayoutItem<any>, index: number) => void;
    "item-contextmenu": (item: LayoutItem<any>, index: number, event: MouseEvent) => void;
    "item-mouseenter": (item: LayoutItem<any>, index: number) => void;
    "item-mouseleave": (item: LayoutItem<any>, index: number) => void;
    "items-change": (changedItems: LayoutItem<any>[]) => void;
    "selection-change": (selectedItems: LayoutItem<any>[]) => void;
    "container-resize": (size: {
        width: number;
        height: number;
    }) => void;
    ready: () => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props<any>>, {
    animationDuration: number;
    animationEasing: string;
    roundPixel: boolean;
    overflow: string;
    multiSelect: boolean;
}>>> & Readonly<{
    "onItem-click"?: ((item: LayoutItem<any>, index: number) => any) | undefined;
    "onItem-double-click"?: ((item: LayoutItem<any>, index: number) => any) | undefined;
    "onItem-contextmenu"?: ((item: LayoutItem<any>, index: number, event: MouseEvent) => any) | undefined;
    "onItem-mouseenter"?: ((item: LayoutItem<any>, index: number) => any) | undefined;
    "onItem-mouseleave"?: ((item: LayoutItem<any>, index: number) => any) | undefined;
    "onItems-change"?: ((changedItems: LayoutItem<any>[]) => any) | undefined;
    "onSelection-change"?: ((selectedItems: LayoutItem<any>[]) => any) | undefined;
    "onContainer-resize"?: ((size: {
        width: number;
        height: number;
    }) => any) | undefined;
    onReady?: (() => any) | undefined;
}>, {
    animationDuration: number;
    animationEasing: string;
    roundPixel: boolean;
    multiSelect: boolean;
    overflow: "hidden" | "auto" | "visible" | "scroll";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
