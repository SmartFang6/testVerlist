<template>
  <div class="page">
    <!-- 可视区域 -->
    <div class="visibel_list" ref="visibelListRefs" @scroll="onScroll">
      <!-- 空白占位区域 -->
      <div class="infinite-list" :style="{ height: trueListHeight + 'px' }"></div>
      <!-- 真实列表区域 -->
      <div class="true_list" :style="{ transform: startOffsetStyle }">
        <!-- 每一项item -->
        <div class="item" v-for="item in visibelList" :key="item.id" :class="{ oddItem: item.id % 2 == 0 }">{{ item.name
        }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
// 真实数据
const trueList = ref([])
for (let i = 0; i < 1000; i++) {
  trueList.value.push({
    id: i,
    name: 'item' + i
  })
}
// 定义数据
const scrData = reactive({
  itemHeight: 100, // 每一项itemd的高度
  visualHeight: 0, // 可视区域的高度
  bufferCount: 2, // 缓存区域的数量
  startIndex: 0, // 分割起始索引
  startOffset: 0 // 向上偏移量
})
// 真实列表高度
const trueListHeight = computed(() => {
  return trueList.value.length * scrData.itemHeight
})
// 一屏渲染多少个item
const visualCount = computed(() => Math.ceil(scrData.visualHeight / scrData.itemHeight))
// 分割结束索引
const endIndex = computed(() => scrData.startIndex + visualCount.value)
// 渲染的虚拟数据
const visibelList = computed(() => {
  // 此处涉及到的 bufferCount 就是为了多渲染一些item 防止加载白屏问题
  let start = scrData.startIndex
  // if (scrData.startIndex >= scrData.bufferCount) {
  //   start = Math.max(0, scrData.startIndex - scrData.bufferCount)
  // }
  // const start = Math.max(0, scrData.startIndex - scrData.bufferCount)
  const end = Math.min(trueList.value.length - 1, endIndex.value + scrData.bufferCount)
  return trueList.value.slice(start, end)
})
// 向上偏移量
const startOffsetStyle = computed(() => {
  return `translate3d(0,${scrData.startOffset}px,0)`;
})
const visibelListRefs = ref(null)
onMounted(() => {
  scrData.visualHeight = visibelListRefs.value.offsetHeight
})

// 滚动事件
const onScroll = e => {
  const scrollTop = e.target.scrollTop;
  const startIndex = Math.floor(scrollTop / scrData.itemHeight)
  if (scrData.startIndex == startIndex) {
    return
  }
  scrData.startIndex = startIndex
  scrData.startOffset = scrollTop - (scrollTop % scrData.itemHeight)
  // scrData.startOffset = Math.floor(scrollTop / scrData.itemHeight)
  // 是否触底
  // const isBottom = ;
  // console.log("🚀 ~ file: verList2.vue:65 ~ onScroll ~ isBottom:", trueListHeight.value, scrollTop)
  // if (isBottom == 0) {
  //   console.log("🚀 ~ file: verList2.vue:65 ~ onScroll ~ isBottom:", isBottom)
  // }
}

// 加载更多
const onReachBottom = () => {

}
</script>
<style lang="less" scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: #000;
}

.visibel_list {
  width: 100%;
  height: 80vh;
  background: #fff;
  font-size: 16px;
  overflow: hidden;
  overflow-y: auto;
  position: relative;

  .infinite-list {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100px;
    color: #000;
    border: 1px solid #999;
    box-sizing: border-box;
  }

  .oddItem {
    background: #ccc;
  }
}
</style>