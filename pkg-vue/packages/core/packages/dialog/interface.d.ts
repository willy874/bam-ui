import Frame from './frame';
export declare function getFrameMethods(frame: Frame): {
    setResizable: (bool: boolean) => void;
    setDraggable: (bool: boolean) => void;
    setOverLimit: (bool: boolean) => void;
    setFull: (bool: boolean) => void;
    setPosition: (position: import("./types").FramePosition) => void;
    setBoxSize: () => void;
    on: (type: string, callback: Function) => boolean;
    off: (type: string, callback: Function) => boolean;
};
export declare type FrameMethods = ReturnType<typeof getFrameMethods>;
export declare function getFrameData(frame: Frame): {
    id: symbol;
    dialogId: symbol;
    element: Element | null;
    top: string;
    left: string;
    width: string | number;
    height: string | number;
    mouseOffsetX: number;
    mouseOffsetY: number;
    isOverLimit: boolean;
    isDraggable: boolean;
    isResizable: boolean;
    isFull: boolean;
};
export declare type FrameData = ReturnType<typeof getFrameData>;
