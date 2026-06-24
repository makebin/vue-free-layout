import { LayoutItem } from './types';

interface Props<TPayload = any> {
    items: LayoutItem<TPayload>[];
    animationDuration?: number;
    animationEasing?: string;
    roundPixel?: boolean;
    overflow?: 'hidden' | 'auto' | 'visible' | 'scroll';
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
}>>, {
    containerSize: {
        width: number;
        height: number;
    };
    getContainerSize: () => {
        width: number;
        height: number;
    };
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "item-click": (item: LayoutItem<any>, index: number) => void;
    "item-mouseenter": (item: LayoutItem<any>, index: number) => void;
    "item-mouseleave": (item: LayoutItem<any>, index: number) => void;
    "items-change": (changedItems: LayoutItem<any>[]) => void;
    "container-resize": (size: {
        width: number;
        height: number;
    }) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props<any>>, {
    animationDuration: number;
    animationEasing: string;
    roundPixel: boolean;
    overflow: string;
}>>> & Readonly<{
    "onItem-click"?: ((item: LayoutItem<any>, index: number) => any) | undefined;
    "onItem-mouseenter"?: ((item: LayoutItem<any>, index: number) => any) | undefined;
    "onItem-mouseleave"?: ((item: LayoutItem<any>, index: number) => any) | undefined;
    "onItems-change"?: ((changedItems: LayoutItem<any>[]) => any) | undefined;
    "onContainer-resize"?: ((size: {
        width: number;
        height: number;
    }) => any) | undefined;
}>, {
    animationDuration: number;
    animationEasing: string;
    roundPixel: boolean;
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
