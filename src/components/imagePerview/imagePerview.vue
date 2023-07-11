<template>
  <div v-bind="$attrs" ref="imagePreview" class="image-preview">
    <img class="image" v-if="url" :src="url" />
    <div :class="{ Toolbar: true }">
      <Preview class="iconStyle" @click="PreviewLarger" />
      <Download
        v-if="isDownload"
        class="iconStyle"
        @click="DownloadImage(url)"
      />
      <Delete v-if="isDelete" class="DeleteStyle" @click="removeImage(url)" />
    </div>
    <div
      class="fullscreen-overlay"
      @click.self="ClosePreview()"
      :style="{
        transform: `scale(${zoom})`,
        'transform-origin': 'center center',
        transition: '0.3s',
      }"
    >
      <img
        class="Preview"
        :src="url"
        :style="{
          transform: `rotate(${rotateDeg}deg) scale(${zoomFactor})`,
          transition: '0.3s',
        }"
      />

      <div class="tools">
        <LeftRotat class="toolsIcon" @click="rotateDeg -= 90" />
        <RightRotat class="toolsIcon" @click="rotateDeg += 90" />
        <BlowUp class="toolsIcon" @click="ControlZoom('BlowUp')" />
        <minification class="toolsIcon" @click="ControlZoom('minification')" />
        <close class="toolsIcon" @click="ClosePreview()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watchEffect } from "vue";
import Delete from "@/assets/Delete.svg";
import Preview from "@/assets/Preview.svg";
import LeftRotat from "@/assets/LeftRotat.svg";
import RightRotat from "@/assets/RightRotat.svg";
import BlowUp from "@/assets/BlowUp.svg";
import minification from "@/assets/minification.svg";
import close from "@/assets/close.svg";
import Download from "@/assets/Download.svg";
export interface ImageProps {
  url: string;
  isDownload?: boolean;
  isDelete?: boolean;
}

const props = withDefaults(defineProps<ImageProps>(), {
  url: "",
  isDownload: true,
  isDelete: true,
});
const emit = defineEmits<{
  (e: "remove", event: any): void;
  (e: "download", event: any): void;
}>();

const { isDownload, url, isDelete } = toRefs(props);
const showFullScreen = ref(false); // 全屏图片显示
const rotateDeg = ref(0); // 旋转角度
const zoomFactor = ref(1); // 大图缩放比例
const zoom = ref(0); // 背景遮罩层缩放比例
const ZOOM_STEP = 1.5; // 缩放大小增量
const MAX_ZOOM = 2; // 最大缩放比例
const MIN_ZOOM = 0.5; // 最小缩放比例

const imagePreview = ref();
// 控制背景遮罩层缩放比例
watchEffect(() => {
  zoom.value = showFullScreen.value ? 1 : 0;
});

const PreviewLarger = () => {
  document.addEventListener("mousewheel", handleMouseWheel, {
    passive: false,
  });
  document.addEventListener("DOMMouseScroll", handleMouseWheel, {
    passive: false,
  });
  showFullScreen.value = true;
};
// 鼠标滚轮控制图片放大缩小
const handleMouseWheel = (event: any) => {
  const { deltaY } = event;
  const scrollDir = Math.max(-1, Math.min(1, deltaY));
  zoomFactor.value =
    scrollDir < 0
      ? Math.min(zoomFactor.value * ZOOM_STEP, MAX_ZOOM)
      : Math.max(zoomFactor.value / ZOOM_STEP, MIN_ZOOM);
};
// 工具栏控制图片缩放大小
const ControlZoom = (name: string) => {
  switch (name) {
    case "BlowUp":
      if (zoomFactor.value < MAX_ZOOM) zoomFactor.value *= ZOOM_STEP;
      break;
    case "minification":
      if (zoomFactor.value > MIN_ZOOM) zoomFactor.value /= ZOOM_STEP;
      break;
    default:
      break;
  }
};
// 关闭大图恢复默认值
const ClosePreview = () => {
  document.removeEventListener("mousewheel", handleMouseWheel);
  document.removeEventListener("DOMMouseScroll", handleMouseWheel);
  showFullScreen.value = false;
  zoomFactor.value = 1;
  rotateDeg.value = 0;
  zoom.value = 0;
};

const DownloadImage = (url: string) => {
  emit("download", url);
};
const removeImage = (url: string) => {
  emit("remove", url);
};
</script>

<style scoped>
.image-preview {
  position: relative;
  max-width: 100%;
  height: fit-content;
  cursor: pointer;
}
.image {
  max-width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  user-select: none;
}
.Toolbar {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  opacity: 0;
  transition: 0.5s;
}
.iconStyle,
.DeleteStyle {
  height: 25px;
  transition: 0.5s;
}
.iconStyle {
  width: 25px;
  color: #fff;
}
.DeleteStyle {
  width: 20px;
  color: #fff;
}
:hover {
  opacity: 1;
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(0);
}
.Preview {
  max-width: calc(100% - 10rem);
  max-height: calc(100% - 10rem);
  user-select: none;
  position: absolute;
}
.tools {
  position: fixed;
  left: 50%;
  bottom: 1rem;
  transform: translate(-50%);
  width: calc(100vw - 70%);
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 30px;
  z-index: 10001;
}
.toolsIcon {
  width: 30px;
  height: 30px;
  color: #c7c4c4;
  transition: 0.3s;
}
:hover {
  color: #fff;
}
</style>
