# Bam-Ui

目前只製作 vue 模式，引用預設使用 vue component.

## Dialog

支援多視窗開啟．自動校正定位．拖拉移動．拖拉調整視窗大小等功能。採用含式自動產生並灌入核心來建立畫面，有更好的依賴管理。

### 基本範例

App.vue

```vue
<script setup lang="ts">
  import DialogView from '@/components/DialogView.vue';
  import { BamDialog, createDialog, useDialog } from 'bam-ui';

  const onOpenDialog = async () => {
    const dialog = useDialog();
    const frame = await dialog.openFrame({ view: DialogView });
  };

  const dialogNative = createDialog();
</script>

<template>
  <div id="app">
    <div class="main">
      <button type="button" @click="onOpenDialog">打開</button>
    </div>
    <bam-dialog :dialog="dialogNative" />
  </div>
</template>
```

@/components/DialogView.vue

```vue
<script setup lang="ts">
  import { PropType } from 'vue';
  import { useDialog, BamFrameResize, BamFrameDraggable, FrameData, FrameMethods } from './dialog';
  const props = defineProps({
    data: Object as PropType<FrameData>,
    methods: Object as PropType<FrameMethods>,
    props: Object as PropType<unknown>,
  });

  const dialog = useDialog();
  const onClose = () => dialog.closeFrame(props.data?.id);
</script>

<template>
  <div class="view">
    <bam-frame-resize>
      <div style="padding: 1rem;">
        <button @click="onClose">關閉</button>
        <bam-frame-draggable>拖拉</bam-frame-draggable>
      </div>
    </bam-frame-resize>
  </div>
</template>
```

### API

#### createDialog

- Description

產生 Dialog class，包含操作介面和狀態．本身不帶 Proxy，所以不具備響應能力，不可直接操作其屬性。放入 BamDialog 之中，可以對其代理及管理。

- Interface:

```ts
function createDialog<View>(options: DialogOptions<View>): Dialog<View>;

interface DialogOptions<View> {
  name?: number | string | symbol;
  hook?: DialogHookParam;
  isBackgroundMask?: boolean;
  backgroundMask?: string;
}

interface DialogHookParam {
  mount?: Function;
  unmount?: Function;
  update?: Function;
  bgclick?: Function;
}

type View = DefineComponent;
```

#### useDialog

- Description:

呼叫 Dialog 介面，可以使用內部的方法和狀態。該呼叫方式已被 vue 代理，可以直接對其操作，也不需要使用任何 ref 其封裝，也可直接丟入 component 處理，但是必須先行使用 createDialog 產生過。參數可選擇給或不給，如果產生多個 Dialog 時，createDialog 預設取用最後建立的，或是取用 Dialog.id 給予參數來精確選取。

- Interface:

```ts
function createDialog<View>(id?: symbol): Dialog;
```

#### Dialog.prototype.openFrame

- Description

打開 Dialog 的視窗，可以傳遞參數。也可以在打開後取得 Promise，於關閉時取回 Frame 並取用內部數值，以將參數回應給外層。

- Interface:

```ts
function openFrame<View>(frame: OpenFrameOptions<View> | Frame<View>): Promise<Frame<View>>;

interface OpenFrameOptions<View> {
  view: View;
  props?: object;
  hook?: FrameHookParam;
  position?: FramePosition;
  isOverLimit?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  isFull?: boolean;
  width?: string;
  height?: string;
}

type FramePosition = 'auto' | 'center' | { top: number | string; left: number | string };

interface FrameHookParam {
  mount?: Function;
  unmount?: Function;
  update?: Function;
  bgclick?: Function;
  dragstart?: Function;
  dragover?: Function;
  dragend?: Function;
  touchstart?: Function;
  touchmove?: Function;
  touchend?: Function;
}
```
