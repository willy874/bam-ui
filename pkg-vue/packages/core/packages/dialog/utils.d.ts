import type { DialogOptions, FrameOptions, OpenFrameOptions } from './types';
import Frame from './frame';
import Dialog from './dialog';
export declare function createDialog(options?: DialogOptions, pluginHandler?: Function): Dialog;
export declare function useDialog(id?: symbol): Dialog;
export declare function createFrame<V>(options: FrameOptions<V>, pluginHandler?: Function): Frame<V>;
export declare function openFrame<V>(view: (() => V) | Frame<V>, options?: OpenFrameOptions): Promise<Frame<V>>;
export declare function useFrame<V>(id: symbol): Frame<V>;
export declare function isFrame<V>(f: unknown): f is Frame<V>;
