import { utils, Frame, getFrameData, getFrameMethods } from '@core/packages';
import { getClassNames as css } from '@core/style';
import { createElement } from 'react';

export const createDialog = utils.createDialog.bind(utils);

export const setDefaultDialog = utils.setDefaultDialog.bind(utils);

export const useDialog = utils.useDialog.bind(utils);

export const useFrame = utils.useFrame.bind(utils);

export const createFrame = utils.createFrame.bind(utils);

export const openFrame = utils.openFrame.bind(utils);

export const isDialog = utils.isDialog.bind(utils);

export const isFrame = utils.isFrame.bind(utils);

export function createVNode(frame: Frame) {
  return createElement(frame.view, {
    className: css().dialog_view,
    frameData: getFrameData(frame),
    frameMethods: getFrameMethods(frame),
    frameProps: frame.props,
  });
}
