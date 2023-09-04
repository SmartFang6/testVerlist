<template>
  <div>
    <div ref="list" class="v-scroll" @scroll="scrollEvent($event)">
      <div class="infinite-list" :style="{ height: listHeight + 'px' }"></div>

      <div class="scroll-list" :style="{ transform: getTransform }">
        <div
          ref="items"
          class="scroll-item"
          v-for="item in visibleData"
          :key="item.id"
          :style="{
            height: screenData.itemHeight + 'px',
            lineHeight: screenData.itemHeight + 'px',
          }"
        >
          {{ item.msg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
// import { throttle } from "lodash";
let listData = ref([]);
for (let i = 1; i <= 50; i++) {
  listData.value.push({
    id: i,
    msg: i + ":" + Math.floor(Math.random() * 10000),
  });
}
const listLen = computed(() => listData.value.length);
// 显示宽度
const screenData = reactive({
  // 每一项目的高度
  itemHeight: 100,
  // 可视区域高度
  screenHeight: window.innerHeight,
  //偏移量
  startOffset: 0,
  //起始索引
  start: 0,
  //结束索引
  end: null,
});

// 列表总高度
const listHeight = computed(() => {
  return listLen.value * screenData.itemHeight;
});
// 可显示的列表项数
const visibleCount = computed(() => {
  return Math.ceil(screenData.screenHeight / screenData.itemHeight);
});
//偏移量对应的style
const getTransform = computed(() => {
  return `translate3d(0,${screenData.startOffset}px,0)`;
});
//获取真实显示列表数据
const visibleData = computed(() => {
  return listData.value.slice(
    screenData.start,
    Math.min(screenData.end, listLen.value)
  );
});
onMounted(() => {
  screenData.start = 0;
  screenData.end = screenData.start + visibleCount.value;
});
const list = ref(null);
const scrollEvent = () => {
  //当前滚动位置
  let scrollTop = list.value.scrollTop;
  console.log(scrollTop);
  //此时的开始索引
  screenData.start = Math.floor(scrollTop / screenData.itemHeight);
  console.log(
    "🚀 ~ file: verList1.vue:79 ~ scrollEvent ~ screenData.start:",
    screenData.start
  );
  //此时的结束索引
  screenData.end = screenData.start + visibleCount.value;
  //此时的偏移量
  screenData.startOffset = scrollTop - (scrollTop % screenData.itemHeight);
  const len = listLen.value;
  if (scrollTop + screenData.screenHeight + 300 >= listHeight.value) {
    const list = [];
    for (let i = len; i <= len + 30; i++) {
      list.push({
        id: i,
        msg: i + ":" + Math.floor(Math.random() * 10000),
      });
    }
    listData.value = listData.value.concat(list);
  }
};
</script>
<style scoped>
.v-scroll {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  border: 3px solid #000;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.scroll-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.scroll-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
