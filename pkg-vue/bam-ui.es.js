var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { isVNode, h, reactive, defineComponent, getCurrentInstance, computed, onMounted, onUpdated, onUnmounted, createVNode, isReactive, markRaw, Fragment } from "vue";
import { getViewportOffset, clearDragImage, getTransformStyleString } from "bam-utility-plugins";
function isSymbol(value) {
  return typeof value === "symbol";
}
var DragEventType;
(function(DragEventType2) {
  DragEventType2[DragEventType2["NORMAL"] = 0] = "NORMAL";
  DragEventType2[DragEventType2["DRAG_MOVE"] = 1] = "DRAG_MOVE";
  DragEventType2[DragEventType2["RESIZE_TOP"] = 2] = "RESIZE_TOP";
  DragEventType2[DragEventType2["RESIZE_LEFT"] = 3] = "RESIZE_LEFT";
  DragEventType2[DragEventType2["RESIZE_BOTTOM"] = 4] = "RESIZE_BOTTOM";
  DragEventType2[DragEventType2["RESIZE_RIGHT"] = 5] = "RESIZE_RIGHT";
})(DragEventType || (DragEventType = {}));
const DialogCollection$1 = {};
const FrameCollection$1 = {};
const defaultDialogRef$1 = {
  get: null
};
function useFrameHandler(frame, callback) {
  const result = callback ? callback(frame) : null;
  return result instanceof Frame$1 ? result : frame;
}
function useDialog$1(id) {
  {
    throw new Error("not created dialog");
  }
  const getDialog = id && DialogCollection$1[id] || defaultDialogRef$1.get;
}
function createFrame$1(options, pluginHandler) {
  const frame = new Frame$1(__spreadProps(__spreadValues({}, options), {
    dialogId: options.name ? Symbol(options.name) : Symbol("Frame")
  }));
  FrameCollection$1[frame.id] = () => useFrameHandler(frame, pluginHandler);
  return frame;
}
function isFrame$1(f) {
  return typeof f === "object" && f instanceof Frame$1;
}
const hook$1 = {
  mount: [],
  unmount: [],
  update: [],
  bgclick: [],
  dragstart: [],
  dragover: [],
  dragend: [],
  touchstart: [],
  touchmove: [],
  touchend: []
};
class Frame$1 {
  constructor(args) {
    __publicField(this, "id");
    __publicField(this, "dialogId");
    __publicField(this, "view");
    __publicField(this, "props");
    __publicField(this, "isOverLimit");
    __publicField(this, "isDraggable");
    __publicField(this, "isResizable");
    __publicField(this, "isFull", false);
    __publicField(this, "position");
    __publicField(this, "element", null);
    __publicField(this, "top", "0px");
    __publicField(this, "left", "0px");
    __publicField(this, "width");
    __publicField(this, "height");
    __publicField(this, "mouseOffsetX", 0);
    __publicField(this, "mouseOffsetY", 0);
    __publicField(this, "close");
    __publicField(this, "onError");
    __publicField(this, "hook");
    __publicField(this, "resizeObserver", null);
    __publicField(this, "isDragged", false);
    __publicField(this, "isResized", false);
    __publicField(this, "dialogPadding", 60);
    this.id = Symbol("Frame");
    this.dialogId = args.dialogId;
    this.view = args.view;
    this.props = args.props || {};
    this.isOverLimit = args.isOverLimit === false ? false : true;
    this.isDraggable = args.isDraggable === false ? false : true;
    this.isResizable = args.isResizable === false ? false : true;
    this.isFull = args.isFull || false;
    this.position = args.position || "auto";
    this.width = typeof args.width === "number" ? args.width + "px" : args.width || "auto";
    this.height = typeof args.height === "number" ? args.height + "px" : args.height || "auto";
    this.close = args.close;
    this.onError = args.onError;
    this.hook = __spreadValues({}, hook$1);
    Object.keys(hook$1).forEach((hook2) => {
      if (args.hook) {
        this.on(hook2, args.hook[hook2]);
      }
    });
    this.setPosition(args.position || "auto");
  }
  setFrameElement(value) {
    this.element = value instanceof Element ? value : null;
  }
  setDraggable(bool) {
    if (bool) {
      this.isDraggable = true;
      this.isDragged = false;
    } else {
      this.isDraggable = false;
      this.isDragged = true;
    }
  }
  setResizable(bool) {
    if (bool) {
      this.isResizable = true;
      this.isResized = false;
    } else {
      this.isResizable = false;
      this.isResized = true;
    }
  }
  setOverLimit(bool) {
    this.isOverLimit = bool;
  }
  setFull(bool) {
    this.isFull = bool;
  }
  setPosition(position) {
    const dialog2 = useDialog$1(this.dialogId);
    this._setPosition(position, dialog2);
  }
  _setPosition(position, dialog2) {
    if (typeof position === "object") {
      this.top = typeof position.top === "number" ? position.top + "px" : position.top || "0";
      this.left = typeof position.left === "number" ? position.left + "px" : position.left || "0";
    }
    if (this.element) {
      const elementClientWidth = this.element.clientWidth;
      const elementClientHeight = this.element.clientHeight;
      if (position === "center") {
        this.top = window.innerHeight / 2 - elementClientHeight / 2 + "px";
        this.left = window.innerWidth / 2 - elementClientWidth / 2 + "px";
      }
      if (position === "auto") {
        const length = dialog2.frames.length;
        this.top = window.innerHeight / 3 - elementClientHeight / 3 + 10 * (length - 1) + "px";
        this.left = window.innerWidth / 2 - elementClientWidth / 2 + 10 * (length - 1) + "px";
      }
    } else {
      if (position === "center") {
        this.top = `calc(${window.innerHeight / 2}px - 50%)`;
        this.left = `calc(${window.innerWidth / 2}px - 50%)`;
      }
      if (position === "auto") {
        const length = dialog2.frames.length;
        this.top = `calc(${window.innerHeight / 3 + 10 * (length - 1)}px)`;
        this.left = `calc(${window.innerWidth / 2 + 10 * (length - 1)}px - 50%)`;
      }
    }
  }
  setBoxSize() {
    if (this.element && this.isOverLimit) {
      const elementClientWidth = this.element.clientWidth;
      const elementClientHeight = this.element.clientHeight;
      const viewPort = getViewportOffset(this.element);
      if (viewPort.left + elementClientWidth > window.innerWidth) {
        this.width = window.innerWidth - viewPort.left - this.dialogPadding + "px";
      }
      if (viewPort.top + elementClientHeight > window.innerWidth) {
        this.height = window.innerHeight - viewPort.top - this.dialogPadding + "px";
      }
    }
  }
  on(type, callback) {
    if (callback && Object.keys(hook$1).includes(type)) {
      this.hook[type].push(callback);
      return true;
    }
    return false;
  }
  off(type, callback) {
    const events = this.hook[type];
    if (callback) {
      if (events.includes(callback)) {
        const indexOf = events.indexOf(callback);
        if (indexOf >= 0) {
          events.splice(indexOf, 1);
          return true;
        }
      }
    } else {
      events.splice(0);
      return true;
    }
    return false;
  }
  async _onClose(dialog2) {
    const indexOf = dialog2.frames.map((f) => f.id).indexOf(this.id);
    const frames = dialog2.frames.splice(indexOf, 1);
    const target = frames[0];
    if (target == null ? void 0 : target.close)
      await target.close(dialog2);
    this.close = null;
    return target;
  }
  onClose() {
    const dialog2 = useDialog$1(this.dialogId);
    return this._onClose(dialog2);
  }
  onMount(...args) {
    if (this.element) {
      this.resizeObserver = new ResizeObserver(() => {
        if (typeof this.position === "string") {
          if (!this.isDraggable) {
            this.setPosition(this.position);
          }
          if (!this.isResizable) {
            this.setBoxSize();
          }
        }
      });
      this.resizeObserver.observe(this.element);
    }
    this.hook.mount.forEach((event) => {
      event.apply(this, args);
    });
  }
  onUnmount(...args) {
    if (this.element && this.resizeObserver) {
      this.resizeObserver.unobserve(this.element);
    }
    this.element = null;
    this.hook.unmount.forEach((event) => {
      event.apply(this, args);
    });
  }
  onUpdate(...args) {
    this.hook.update.forEach((event) => {
      event.apply(this, args);
    });
  }
  onResize(...args) {
    this.setPosition(this.position);
    this.setBoxSize();
    this.hook.update.forEach((event) => {
      event.apply(this, args);
    });
  }
  onDragstart(...args) {
    this.hook.update.forEach((event) => {
      event.apply(this, args);
    });
  }
  onTouchstart(...args) {
    this.hook.touchstart.forEach((event) => {
      event.apply(this, args);
    });
  }
  onDragmove(pos) {
    this.isFull = false;
    if (this.element && this.isDraggable) {
      this.isDragged = true;
      const position = { top: this.top, left: this.left };
      const elementClientWidth = this.element.clientWidth;
      const elementClientHeight = this.element.clientHeight;
      if (this.isOverLimit) {
        if (window.innerWidth - elementClientWidth < pos.pageX - this.mouseOffsetX) {
          position.left = window.innerWidth - elementClientWidth - 1 + "px";
        } else if (pos.pageX - this.mouseOffsetX < 1) {
          position.left = "0";
        } else {
          position.left = pos.pageX - this.mouseOffsetX + "px";
        }
        if (window.innerHeight - elementClientHeight < pos.pageY - this.mouseOffsetY) {
          position.top = window.innerHeight - elementClientHeight - 1 + "px";
        } else if (pos.pageY - this.mouseOffsetY < 1) {
          position.top = "0";
        } else {
          position.top = pos.pageY - this.mouseOffsetY + "px";
        }
      } else {
        position.top = pos.pageY - this.mouseOffsetY + "px";
        position.left = pos.pageX - this.mouseOffsetX + "px";
      }
      this.setPosition(position);
    }
  }
  onDragresize(pos, type) {
    this.isFull = false;
    if (this.element && this.isResizable) {
      this.isResized = true;
      const elementClientWidth = this.element.clientWidth;
      const elementClientHeight = this.element.clientHeight;
      const viewPort = getViewportOffset(this.element);
      this.top = viewPort.top + "px";
      this.left = viewPort.left + "px";
      this.width = elementClientWidth + "px";
      this.height = elementClientHeight + "px";
      if (type === DragEventType.RESIZE_TOP) {
        const plusHeight = viewPort.top - pos.pageY;
        this.top = viewPort.top - plusHeight + "px";
        this.height = elementClientHeight + plusHeight + "px";
      }
      if (type === DragEventType.RESIZE_BOTTOM) {
        const plusHeight = pos.pageY - viewPort.top - elementClientHeight;
        this.height = elementClientHeight + plusHeight + "px";
      }
      if (type === DragEventType.RESIZE_RIGHT) {
        const plusWidth = pos.pageX - viewPort.left - elementClientWidth;
        this.width = elementClientWidth + plusWidth + "px";
      }
      if (type === DragEventType.RESIZE_LEFT) {
        const plusWidth = viewPort.left - pos.pageX;
        this.left = viewPort.left - plusWidth + "px";
        this.width = elementClientWidth + plusWidth + "px";
      }
    }
  }
  onDragover(...args) {
    this.hook.dragover.forEach((event) => {
      event.apply(this, args);
    });
  }
  onTouchmove(...args) {
    this.hook.touchmove.forEach((event) => {
      event.apply(this, args);
    });
  }
  onDragend(...args) {
    this.hook.dragend.forEach((event) => {
      event.apply(this, args);
    });
  }
  onTouchend(...args) {
    this.hook.touchend.forEach((event) => {
      event.apply(this, args);
    });
  }
  createVNode() {
    return this.view;
  }
}
const hook = {
  mount: [],
  unmount: [],
  update: [],
  bgclick: []
};
class Dialog$1 {
  constructor(args) {
    __publicField(this, "id");
    __publicField(this, "frames", []);
    __publicField(this, "isBackgroundMask");
    __publicField(this, "backgroundMask");
    __publicField(this, "focusFrame", null);
    __publicField(this, "eventType", DragEventType.NORMAL);
    __publicField(this, "element", null);
    __publicField(this, "touches", []);
    __publicField(this, "prevTouches", []);
    __publicField(this, "hook");
    this.id = args.id;
    this.isBackgroundMask = args.isBackgroundMask;
    this.backgroundMask = args.backgroundMask;
    this.hook = __spreadValues({}, hook);
    Object.keys(hook).forEach((hook2) => {
      if (args.hook) {
        this.on(hook2, args.hook[hook2]);
      }
    });
  }
  on(type, callback) {
    if (callback && Object.keys(hook).includes(type)) {
      this.hook[type].push(callback);
      return true;
    }
    return false;
  }
  off(type, callback) {
    const events = this.hook[type];
    if (events.includes(callback)) {
      const indexOf = events.indexOf(callback);
      if (indexOf >= 0) {
        events.splice(indexOf, 1);
        return true;
      }
    }
    return false;
  }
  onMount(...args) {
    this.hook.mount.forEach((event) => {
      event.apply(this, args);
    });
  }
  onUnmount(...args) {
    this.element = null;
    this.hook.unmount.forEach((event) => {
      event.apply(this, args);
    });
  }
  onUpdate(...args) {
    this.hook.update.forEach((event) => {
      event.apply(this, args);
    });
  }
  onResize(e) {
    [...this.frames].forEach((frame) => {
      frame.onResize(e);
    });
  }
  onBgclick(e) {
    if (this.element && e.target instanceof Node && this.element.contains(e.target)) {
      this.hook.bgclick.forEach((event) => {
        event.apply(this, e);
      });
      [...this.frames].forEach((f) => {
        var _a;
        if ((_a = f.hook) == null ? void 0 : _a.bgclick) {
          f.hook.bgclick.forEach((event) => {
            event.apply(f, e);
          });
        }
      });
    }
  }
  onDragstart(event, id, type) {
    const frame = this.getFrame(id);
    if (frame && frame.element && event.dataTransfer) {
      clearDragImage(event);
      this.focusFrame = frame;
      const viewPort = getViewportOffset(frame.element);
      frame.mouseOffsetX = event.pageX - viewPort.left;
      frame.mouseOffsetY = event.pageY - viewPort.top;
      this.eventType = type;
      frame.onDragstart(event);
    } else {
      console.warn("not element or event not dataTransfer target");
    }
  }
  onTouchstart(event, id, type) {
    const frame = this.getFrame(id);
    if (frame) {
      this.touches = Array.from(event.touches);
      if (frame.element && type === DragEventType.DRAG_MOVE) {
        const touch = this.touches[0];
        const viewPort = getViewportOffset(frame.element);
        frame.mouseOffsetX = touch.pageX - viewPort.left;
        frame.mouseOffsetY = touch.pageY - viewPort.top;
        this.focusFrame = frame;
        this.eventType = type;
      }
      frame.onTouchstart(event);
    }
  }
  onDragover(event) {
    const frame = this.focusFrame;
    if (frame && frame.element) {
      const pos = {
        pageX: event.pageX,
        pageY: event.pageY
      };
      if (this.eventType === DragEventType.DRAG_MOVE) {
        frame.onDragmove(pos);
      }
      if (this.eventType === DragEventType.RESIZE_TOP || this.eventType === DragEventType.RESIZE_LEFT || this.eventType === DragEventType.RESIZE_BOTTOM || this.eventType === DragEventType.RESIZE_RIGHT) {
        frame.onDragresize(pos, this.eventType);
      }
      frame.onDragover(event);
    }
  }
  onTouchmove(event) {
    const frame = this.focusFrame;
    if (frame) {
      this.touches = Array.from(event.touches);
      if (this.eventType === DragEventType.DRAG_MOVE && this.touches.length === 1) {
        const touch = this.touches[0];
        frame.onDragmove({
          pageX: touch.pageX,
          pageY: touch.pageY
        });
      }
      frame.onTouchmove(event);
    }
  }
  onDragend(event) {
    const frame = this.focusFrame;
    if (frame) {
      this.eventType = DragEventType.NORMAL;
      frame.mouseOffsetX = 0;
      frame.mouseOffsetY = 0;
      frame.onDragend(event);
    }
  }
  onTouchend(event) {
    const frame = this.focusFrame;
    if (frame) {
      this.touches = Array.from(event.touches);
      if (this.touches.length === 0) {
        this.eventType = DragEventType.NORMAL;
        frame.mouseOffsetX = 0;
        frame.mouseOffsetY = 0;
      }
      frame.onTouchend(event);
    }
  }
  setRootElement(value) {
    this.element = value instanceof Element ? value : null;
  }
  setFrameItemElement(index) {
    return (value) => {
      this.frames[index].element = value;
    };
  }
  sortToRight(id) {
    const frame = this.getFrame(id);
    if (frame) {
      const indexOf = this.frames.map((p) => p.id).indexOf(frame.id);
      const frames = this.frames.splice(indexOf, 1);
      this.frames.push(...frames);
    }
  }
  openFrame(view, options) {
    return new Promise(async (resolve, reject) => {
      if (isFrame$1(view)) {
        view.close = resolve;
        view.onError = reject;
      }
      const frame = isFrame$1(view) ? view : createFrame$1(__spreadProps(__spreadValues({}, options), {
        view: await view(),
        close: resolve,
        onError: reject
      }));
      this.frames.push(frame);
    });
  }
  async callbackCloseFrame(frames, callback) {
    return await Promise.all(frames.map(async (f) => {
      const res = await f.onClose();
      if (callback)
        callback(res);
      return res;
    }));
  }
  async closeFrame(arg, callback) {
    let frames = [];
    if (typeof arg === "number") {
      const index = arg;
      frames = this.frames.slice(index, index + 1);
    } else if (isSymbol(arg)) {
      const id = arg;
      const indexOf = this.frames.map((f) => f.id).indexOf(id);
      frames = this.frames.slice(indexOf, indexOf + 1);
    } else if (typeof arg === "object") {
      if (isFrame$1(arg)) {
        const target = arg;
        frames = this.frames.filter((f) => f.dialogId === target.dialogId);
      }
    } else if (typeof arg === "function") {
      const func = arg;
      frames = func(this.frames);
    } else {
      frames = this.frames.slice();
    }
    return await this.callbackCloseFrame(frames, callback);
  }
  _getFrame(arg) {
    if (typeof arg === "object") {
      if (arg instanceof Frame$1) {
        return this.frames.find((f) => f.id === arg.id);
      }
    }
    if (typeof arg === "number") {
      const index = arg;
      return this.frames[index];
    }
    if (typeof arg === "symbol") {
      const id = arg;
      return this.frames.find((f) => f.id === id);
    }
  }
  getFrame(arg) {
    return this._getFrame(arg);
  }
}
function getFrameMethods(frame) {
  return {
    setResizable: (bool) => frame.setResizable(bool),
    setDraggable: (bool) => frame.setDraggable(bool),
    setOverLimit: (bool) => frame.setOverLimit(bool),
    setFull: (bool) => frame.setFull(bool),
    setPosition: (...args) => frame.setPosition(...args),
    setBoxSize: () => frame.setBoxSize(),
    on: (type, callback) => frame.on(type, callback),
    off: (type, callback) => frame.off(type, callback)
  };
}
function getFrameData(frame) {
  return {
    id: frame.id,
    dialogId: frame.dialogId,
    element: frame.element,
    top: frame.top,
    left: frame.left,
    width: frame.width,
    height: frame.height,
    mouseOffsetX: frame.mouseOffsetX,
    mouseOffsetY: frame.mouseOffsetY,
    isOverLimit: frame.isOverLimit,
    isDraggable: frame.isDraggable,
    isResizable: frame.isResizable,
    isFull: frame.isFull
  };
}
const dialog = "bam-dialog";
const dialog_container = "bam-dialog_container";
const dialog_frame = "bam-dialog_frame";
const dialog_view = "bam-dialog_view";
const dialog_resize_mode = "bam-dialog_resize_mode";
const dialog_resize_top = "bam-dialog_resize_top";
const dialog_resize_bottom = "bam-dialog_resize_bottom";
const dialog_resize_right = "bam-dialog_resize_right";
const dialog_resize_left = "bam-dialog_resize_left";
const css = {
  dialog: ".dialog {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}",
  dialog_container: ".dialog_container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}",
  dialog_frame: ".dialog_frame {\n  position: absolute;\n  top: 0;\n  left: 0;\n  pointer-events: auto;\n}",
  dialog_view: ".dialog_view {\n  width: 100%;\n  height: 100%;\n}",
  dialog_resize_mode: ".dialog_resize_mode {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow: auto;\n  scroll-behavior: smooth;\n  overscroll-behavior: none;\n}",
  dialog_resize_top: ".dialog_resize_top {\n  position: absolute;\n  cursor: ns-resize;\n  height: 0.5rem;\n  top: -1px;\n  left: 0;\n  right: 0;\n}",
  dialog_resize_bottom: ".dialog_resize_bottom {\n  position: absolute;\n  cursor: ns-resize;\n  height: 0.5rem;\n  bottom: -1px;\n  left: 0;\n  right: 0;\n}",
  dialog_resize_right: ".dialog_resize_right {\n  position: absolute;\n  cursor: ew-resize;\n  width: 0.5rem;\n  right: -1px;\n  top: 0;\n  bottom: 0;\n}",
  dialog_resize_left: ".dialog_resize_left {\n  position: absolute;\n  cursor: ew-resize;\n  width: 0.5rem;\n  left: -1px;\n  top: 0;\n  bottom: 0;\n}"
};
var css$1 = {
  dialog,
  dialog_container,
  dialog_frame,
  dialog_view,
  dialog_resize_mode,
  dialog_resize_top,
  dialog_resize_bottom,
  dialog_resize_right,
  dialog_resize_left,
  css
};
class VueDialog extends Dialog$1 {
  constructor(args) {
    super(args);
    __publicField(this, "tag", "vue");
    __publicField(this, "frames", []);
    __publicField(this, "focusFrame", null);
  }
  getFrame(arg) {
    return this._getFrame(arg);
  }
  openFrame(view, options) {
    return new Promise(async (resolve, reject) => {
      if (isFrame(view)) {
        view.close = resolve;
        view.onError = reject;
      }
      const frame = isFrame(view) ? view : createFrame(__spreadProps(__spreadValues({}, options), {
        view: await view(),
        close: resolve,
        onError: reject
      }));
      this.frames.push(frame);
    });
  }
}
class VueFrame extends Frame$1 {
  constructor(args) {
    super(args);
    __publicField(this, "tag", "vue");
  }
  setPosition(position) {
    const dialog2 = useDialog(this.dialogId);
    this._setPosition(position, dialog2);
  }
  onClose() {
    const dialog2 = useDialog(this.dialogId);
    return this._onClose(dialog2);
  }
  createVNode() {
    if (isVNode(this.view)) {
      return this.view;
    } else {
      return h(this.view, {
        class: css$1.dialog_view,
        frameData: getFrameData(this),
        frameMethods: getFrameMethods(this),
        frameProps: this.props
      });
    }
  }
}
const DialogCollection = {};
const FrameCollection = {};
const defaultDialogRef = {
  get: null
};
function createDialog(options = {}) {
  const dialog2 = new VueDialog({
    id: typeof options.name === "symbol" ? options.name : Symbol(options.name),
    hook: options.hook || {},
    isBackgroundMask: options.isBackgroundMask === false ? false : true,
    backgroundMask: options.backgroundMask || "transparent"
  });
  const getDialog = () => reactive(dialog2);
  DialogCollection[dialog2.id] = getDialog;
  if (!defaultDialogRef.get) {
    defaultDialogRef.get = getDialog;
  }
  return dialog2;
}
function setDefaultDialog(dialog2) {
  const getDialog = () => reactive(dialog2);
  DialogCollection[dialog2.id] = getDialog;
  defaultDialogRef.get = getDialog;
  return getDialog();
}
function useDialog(id) {
  if (!defaultDialogRef.get) {
    throw new Error("not created dialog");
  }
  const getDialog = id && DialogCollection[id] || defaultDialogRef.get;
  return getDialog();
}
function useFrame(id) {
  const getFrame = FrameCollection[id];
  return getFrame();
}
function createFrame(options) {
  const frame = new VueFrame(__spreadProps(__spreadValues({}, options), {
    dialogId: options.name ? Symbol(options.name) : Symbol("Frame")
  }));
  FrameCollection[frame.id] = () => frame;
  return frame;
}
function isFrame(f) {
  return typeof f === "object" && f instanceof VueFrame;
}
var Frame = defineComponent({
  name: "BamFrame",
  props: {
    dialog: {
      type: Object,
      required: true
    },
    view: {
      type: Object,
      required: true
    },
    frame: {
      type: Object,
      required: true
    },
    zIndex: {
      type: Number,
      default: 0
    }
  },
  setup(props, {
    expose
  }) {
    const instance = getCurrentInstance();
    expose({});
    if (props.dialog.isBackgroundMask && props.frame.hook.bgclick.length === 0) {
      props.frame.on("bgclick", () => props.frame.onClose());
    }
    const frameData = computed(() => getFrameData(props.frame));
    const frameMethods = computed(() => getFrameMethods(props.frame));
    onMounted(() => props.frame.onMount(instance));
    onUpdated(() => props.frame.onUpdate(instance));
    onUnmounted(() => props.frame.onUnmount(instance));
    return () => createVNode("div", {
      "ref": (e) => props.frame.setFrameElement(e),
      "class": css$1.dialog_frame,
      "style": {
        zIndex: props.zIndex,
        transform: getTransformStyleString({
          translateX: props.frame.isFull ? "0" : props.frame.left,
          translateY: props.frame.isFull ? "0" : props.frame.top
        }),
        width: props.frame.isFull ? "100vw" : props.frame.width,
        height: props.frame.isFull ? "100vh" : props.frame.height
      },
      "onClick": (e) => e.stopPropagation(),
      "onMousedown": () => props.dialog.sortToRight(props.frame.id)
    }, [isVNode(props.view) ? props.view : createVNode(props.view, {
      "class": css$1.dialog_view,
      "frame-data": frameData.value,
      "frame-methods": frameMethods.value,
      "frame-props": props.frame.props
    }, null)]);
  }
});
var Dialog = defineComponent({
  name: "BamDialog",
  props: {
    dialog: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, {
    expose
  }) {
    const instance = getCurrentInstance();
    const _dialog = props.dialog instanceof Dialog$1 ? props.dialog : createDialog(props.dialog);
    const dialog2 = isReactive(_dialog) ? _dialog : setDefaultDialog(_dialog);
    expose({
      dialog: dialog2
    });
    const isBackgroundMask = computed(() => dialog2.isBackgroundMask && dialog2.frames.length);
    const onClick = (e) => dialog2.onBgclick(e);
    const onDragover = (e) => dialog2.onDragover(e);
    const onDragend = (e) => dialog2.onDragend(e);
    const onTouchmove = (e) => dialog2.onTouchmove(e);
    const onTouchend = (e) => dialog2.onTouchend(e);
    const onResize = (e) => dialog2.onResize(e);
    onMounted(() => {
      dialog2.onMount(instance);
      document.body.addEventListener("click", onClick);
      document.body.addEventListener("dragover", onDragover);
      document.body.addEventListener("dragend", onDragend);
      document.body.addEventListener("touchmove", onTouchmove);
      document.body.addEventListener("touchend", onTouchend);
      window.addEventListener("resize", onResize);
    });
    onUpdated(() => {
      dialog2.onUpdate(instance);
    });
    onUnmounted(() => {
      dialog2.onUnmount(instance);
      document.body.removeEventListener("click", onClick);
      document.body.removeEventListener("dragover", onDragover);
      document.body.removeEventListener("dragend", onDragend);
      document.body.removeEventListener("touchmove", onTouchmove);
      document.body.removeEventListener("touchend", onTouchend);
      window.removeEventListener("resize", onResize);
    });
    return () => createVNode("div", {
      "ref": (e) => dialog2.setRootElement(e),
      "class": css$1.dialog,
      "style": {
        pointerEvents: isBackgroundMask.value ? "auto" : "none",
        opacity: dialog2.frames.length ? 1 : 0
      }
    }, [createVNode("div", {
      "class": css$1.dialog_container,
      "style": {
        background: dialog2.backgroundMask
      }
    }, null), dialog2.frames.map((frame, index) => {
      const target = useFrame(frame.id);
      if (target) {
        const View = markRaw(target.createVNode());
        return createVNode(Frame, {
          "key": frame.id,
          "z-index": index,
          "frame": frame,
          "dialog": dialog2,
          "view": View
        }, null);
      } else {
        return null;
      }
    })]);
  }
});
function recursionParent(paths, vm) {
  paths.push(vm);
  if (vm.parent) {
    return recursionParent(paths, vm.parent);
  } else {
    return paths;
  }
}
function getComponentPaths(vm) {
  const paths = [];
  if (vm) {
    return recursionParent(paths, vm);
  }
  return [];
}
function findParentComponent(component) {
  const instance = getCurrentInstance();
  if (instance && component) {
    const paths = getComponentPaths(instance);
    for (const vm of paths) {
      if (!vm.type.name && !component.name) {
        return;
      }
      if (vm.type.name === component.name) {
        return vm.proxy;
      }
    }
  }
}
var Draggable = defineComponent({
  name: "bam-frame-draggable",
  props: {
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props, context) {
    const onDragstart = (FrameComponent2) => {
      return (e) => {
        if (FrameComponent2) {
          FrameComponent2.dialog.onDragstart(e, FrameComponent2.frame.id, DragEventType.DRAG_MOVE);
        }
      };
    };
    const onTouchstart = (FrameComponent2) => {
      return (e) => {
        if (FrameComponent2) {
          FrameComponent2.dialog.onTouchstart(e, FrameComponent2.frame.id, DragEventType.DRAG_MOVE);
        }
      };
    };
    const FrameComponent = findParentComponent(Frame);
    return () => {
      if (FrameComponent) {
        return createVNode(props.tag, {
          "style": {
            cursor: FrameComponent.frame.isDraggable && "move"
          },
          "draggable": true,
          "onDragstart": onDragstart(FrameComponent),
          "onTouchstart": onTouchstart(FrameComponent)
        }, {
          default: () => [context.slots.default && context.slots.default()]
        });
      }
      return null;
    };
  }
});
var Resize = defineComponent({
  name: "bam-frame-resize",
  props: {
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props, context) {
    const onDragstart = (FrameComponent2, type) => {
      return (e) => {
        if (FrameComponent2) {
          FrameComponent2.dialog.onDragstart(e, FrameComponent2.frame.id, type);
        }
      };
    };
    const FrameComponent = findParentComponent(Frame);
    return () => {
      if (FrameComponent) {
        return createVNode(Fragment, null, [createVNode(props.tag, {
          "class": {
            [css$1.dialog_resize_mode]: FrameComponent.frame.width !== "auto" && FrameComponent.frame.height !== "auto"
          }
        }, {
          default: () => [context.slots.default && context.slots.default()]
        }), FrameComponent.frame.isResizable ? createVNode(Fragment, null, [createVNode("div", {
          "class": css$1.dialog_resize_top,
          "onClick": (e) => e.stopPropagation(),
          "draggable": true,
          "onDragstart": onDragstart(FrameComponent, DragEventType.RESIZE_TOP)
        }, null), createVNode("div", {
          "class": css$1.dialog_resize_bottom,
          "onClick": (e) => e.stopPropagation(),
          "draggable": true,
          "onDragstart": onDragstart(FrameComponent, DragEventType.RESIZE_BOTTOM)
        }, null), createVNode("div", {
          "class": css$1.dialog_resize_right,
          "onClick": (e) => e.stopPropagation(),
          "draggable": true,
          "onDragstart": onDragstart(FrameComponent, DragEventType.RESIZE_RIGHT)
        }, null), createVNode("div", {
          "class": css$1.dialog_resize_left,
          "onClick": (e) => e.stopPropagation(),
          "draggable": true,
          "onDragstart": onDragstart(FrameComponent, DragEventType.RESIZE_LEFT)
        }, null)]) : null]);
      }
      return context.slots.default && context.slots.default();
    };
  }
});
export { Dialog as BamDialog, Frame as BamFrame, Draggable as BamFrameDraggable, Resize as BamFrameResize, VueDialog as Dialog, VueFrame as Frame, createDialog, createFrame, isFrame, setDefaultDialog, useDialog, useFrame };
