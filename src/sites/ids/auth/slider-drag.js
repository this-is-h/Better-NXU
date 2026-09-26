import { dragSlider } from '../../../utils/slider-drag.js';

/** IDS 展示坐标适配；识别器返回的距离保持原样传给共享鼠标拖动工具。 */
export function dragIdsSlider(slider, distance, options = {}) {
  return dragSlider({
    ...options,
    handle: slider,
    track: slider?.closest('.sliderContainer'),
    distance,
  });
}
