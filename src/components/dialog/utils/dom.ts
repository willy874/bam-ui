import png1px from '../assets/png1px';

function conditionData(value: unknown, defaultValue: unknown) {
  return value === defaultValue ? defaultValue : value || defaultValue;
}

/**
 * 清除拖拉顯示元素
 * @param {DragEvent} event
 */
export function clearDragImage(event: DragEvent) {
  if (event.dataTransfer) {
    const img = new Image();
    img.src = png1px;
    event.dataTransfer.setDragImage(img, 0, 0);
  }
}

export interface ViewportOffsetResult {
  left: number;
  top: number;
  right: number;
  bottom: number;
  rightIncludeBody: number;
  bottomIncludeBody: number;
}

export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect) {
    return 0;
  }
  return element.getBoundingClientRect();
}

export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement;

  const docScrollLeft = doc.scrollLeft;
  const docScrollTop = doc.scrollTop;
  const docClientLeft = doc.clientLeft;
  const docClientTop = doc.clientTop;

  const pageXOffset = window.pageXOffset;
  const pageYOffset = window.pageYOffset;

  const box = getBoundingClientRect(element);

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect;

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0);
  const offsetLeft = retLeft + pageXOffset;
  const offsetTop = rectTop + pageYOffset;

  const left = offsetLeft - scrollLeft;
  const top = offsetTop - scrollTop;

  const clientWidth = window.document.documentElement.clientWidth;
  const clientHeight = window.document.documentElement.clientHeight;
  return {
    left: left,
    top: top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  };
}

export interface TransformStyle {
  rotate?: string;
  rotateX?: string;
  rotateY?: string;
  rotateZ?: string;
  scaleX?: string;
  scaleY?: string;
  scaleZ?: string;
  skewX?: string;
  skewY?: string;
  translateX?: string;
  translateY?: string;
  translateZ?: string;
}

export function getTransformStyleString(transform: TransformStyle) {
  return `
  rotate(${conditionData(transform.rotate, 0)})
  rotateX(${conditionData(transform.rotateX, 0)})
  rotateY(${conditionData(transform.rotateY, 0)})
  rotateZ(${conditionData(transform.rotateZ, 0)})
  scaleX(${conditionData(transform.scaleX, 1)})
  scaleY(${conditionData(transform.scaleY, 1)})
  scaleZ(${conditionData(transform.scaleZ, 1)})
  skewX(${conditionData(transform.skewX, 0)})
  skewY(${conditionData(transform.skewY, 0)})
  translateX(${conditionData(transform.translateX, 0)})
  translateY(${conditionData(transform.translateY, 0)})
  translateZ(${conditionData(transform.translateZ, 0)})
  `;
}
