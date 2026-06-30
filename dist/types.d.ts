export type SizeValue = number | string;
export interface LayoutItem<TPayload = any> {
    id: string | number;
    x: SizeValue;
    y: SizeValue;
    w: SizeValue;
    h: SizeValue;
    zIndex?: number;
    selected?: boolean;
    visible?: boolean;
    locked?: boolean;
    payload?: TPayload;
    [key: string]: any;
}
export interface LayoutItemStyle extends Record<string, any> {
    position: 'absolute';
    left: string;
    top: string;
    width: string;
    height: string;
    transform: string;
    zIndex: number;
    transition: string;
}
export interface ContainerSize {
    width: number;
    height: number;
}
export interface FreeLayoutOptions {
    animationDuration?: number;
    animationEasing?: string;
    itemKey?: string;
    roundPixel?: boolean;
    multiSelect?: boolean;
}
export interface ResolvedLayoutItem<TPayload = any> extends LayoutItem<TPayload> {
    pixelX: number;
    pixelY: number;
    pixelW: number;
    pixelH: number;
}
export type LayoutItemPartial = Partial<Omit<LayoutItem, 'id'>>;
