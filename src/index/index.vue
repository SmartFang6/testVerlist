<template>
  <div class="index" :style="{ '--height': '80px' }">
    <div class="hearBar">
      <div class="head_signIn">
        <div class="index_search_box">
          <span class="iconfont icon-sousuo"></span>
          <span class="index_search_text">搜索</span>
        </div>
      </div>
      <span>{{ navbarTitle }}</span>
    </div>

    <!-- 
    @ScrollToLower="reachBottom"
    @Scroll="onPageScroll" -->
    <div ref="containerRef" class="content_box" @scroll="onPageScroll">
      <div
        class="index-real-time"
        id="listId"
        ref="listRefs"
        :style="contentStyle"
      >
        <div
          v-for="(item, index) in visibData"
          :key="item.id + '_' + index"
          class="list_item"
          :id="item.index"
          :data-index="item.index"
        >
          <PostsItem v-if="item.type == 1" class="posts_item" :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 按需引入, 更小的应用体积
import { nextTick, ref, reactive, computed, onMounted, watch } from "vue";
import PostsItem from "../components/postsItem/index.vue";
import Reqeust from "../utils/request";
import "./index.less";
const school_id = 19;
const navbarTitle = "西安大虚";
const page = ref(1); //当前第几页
const isLoading = ref(false);
const isFinished = ref(false);
const homePagesList = ref([]);
// 虚拟列表需要用到的数据
const scrollObject = reactive({
  maxCounts: 0, // 一屏最多显示几个
  estHeight: 90, // 预估高度
  startIndex: 0, // 开始的索引
  listHight: 0, // 列表项的高度
});
// 虚拟列表位置信息数据对应真实数据的数组
const positions = ref([]);
watch(
  () => scrollObject.startIndex,
  () => {
    setPosition();
  }
);
const listRefs = ref(null);
watch(
  [() => homePagesList.value, () => listRefs.value],
  () => {
    homePagesList.value.length && initPosition();
    nextTick(() => {
      homePagesList.value.length > 0 && setPosition();
    });
  },
  {
    deep: true,
  }
);
// 上订的距离
const offsetDistance = computed(() => {
  return scrollObject.startIndex > 0
    ? positions.value[scrollObject.startIndex - 1]?.bottom
    : 0;
});

// list 的样式
const contentStyle = computed(() => {
  return {
    height: `${scrollObject.listHight - offsetDistance.value}px`,
    transform: `translate3d(0,${offsetDistance.value}px,0)`,
  };
});
// 虚拟列表剪切最后的值
const endIndex = computed(() => {
  return Math.min(
    homePagesList.value.length,
    scrollObject.startIndex + scrollObject.maxCounts
  );
});
// 虚拟列表 展示的 list
const visibData = computed(() =>
  homePagesList.value.slice(scrollObject.startIndex, endIndex.value)
);
onMounted(() => {
  nextTick(() => {
    init();
  });
});
//下拉触底回调
const reachBottom = () => {
  if (isFinished.value || isLoading.value) return;
  getHomePosts();
};
const onPageScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  const bottom = scrollHeight - clientHeight - scrollTop <= 100;
  scrollObject.startIndex = binarySearch(positions.value, scrollTop);
  if (bottom) {
    // console.log("🚀 ~ file: index.vue:113 ~ onPageScroll ~ bottom:", bottom);
    reachBottom();
  }
};
//#region 虚拟列表操作
// 初始化
const init = () => {
  const windowHeight = document.body.clientHeight;
  scrollObject.estHeight = scrollObject.estHeight;
  scrollObject.maxCounts = windowHeight / scrollObject.estHeight;
};
// 初始化pos 数据
const initPosition = () => {
  const pos = [];
  const estHeight = scrollObject.estHeight;
  const length = homePagesList.value.length;
  for (let i = 0; i < length; i++) {
    pos.push({
      index: i,
      height: estHeight,
      top: i * estHeight,
      bottom: (i + 1) * estHeight,
      dHeight: 0,
    });
  }
  positions.value = pos;
};
// 动态更新真实的 pos 数据
const setPosition = () => {
  nextTick(() => {
    try {
      const nodes = listRefs.value?.children;
      if (!nodes || !nodes.length) return;
      [...nodes].forEach((node) => {
        let index = Number(node.dataset.index);
        let rect = node.getBoundingClientRect();
        const height = rect.height;
        const item = positions.value[index];
        const dHeight = item.height - height;
        if (dHeight) {
          item.height = height;
          //  此时 bottom 的值还只是基于预估高度计算的 只是修改了差值，但是height和 top 变了之后还是不对的
          item.bottom = item.bottom - dHeight;
          item.dHeight = dHeight;
        }
        positions.value[index] = item;
      });
      // 从第一条开始算 更新对的每一项的 top，bottom 值。因为需要依赖算对的 height 和 差值累加计算 所以需要另外循环
      const startIndexId = Number("0");
      const len = positions.value.length;
      // 初始的差值，需要累加
      let startDHeight = positions.value[startIndexId].dHeight;
      positions.value[startIndexId].dHeight = 0;
      for (let i = startIndexId + 1; i < len; i++) {
        const item = positions.value[i];
        const preItem = positions.value[i - 1];
        item.top = preItem.bottom;
        // 之前的 bottom - 累加的差值 --得正 即为正确的 bottom
        item.bottom = item.bottom - startDHeight;
        // 差值累加
        if (item.dHeight !== 0) {
          startDHeight += item.dHeight;
          item.dHeight = 0;
        }
        positions.value[i] = item;
      }
      scrollObject.listHight = positions.value[len - 1].bottom;
      // console.log(positions.value, "positions");
    } catch (error) {
      console.log(error);
    }
  });
};
// 二分法 计算 startIndex
const binarySearch = (list, value) => {
  let left = 0;
  let right = list.length - 1;
  let templateIndex = -1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = list[mid].bottom;
    if (midValue === value) return mid;
    else if (midValue < value) {
      left = mid + 1;
    } else {
      if (templateIndex === -1 || templateIndex > mid) templateIndex = mid;
      right = mid;
    }
  }
  return templateIndex;
};
//#endregion
//获取帖子列表信息
const getHomePosts = async (type = "") => {
  if (isFinished.value || isLoading.value) return;
  console.log("下拉触底回调");
  let posts;
  if (type == "one") {
    homePagesList.value = [];
    page.value = 1;
  }
  isLoading.value = true;
  let data = {
    page: page.value,
    per_page: 30,
    school_id,
  };
  // 首页信息流(新)
  posts = await Reqeust.get("admin/posts", { params: data });
  //  getHomePage("feed/home", data);
  // 类型为1时是帖子
  posts.data = posts.data.map((item) => {
    if (item?.type == 1) {
      // 首页时间显示
      item.createdTime = item.pub_at;
      item.content = item.content;
    }
    return item;
  });
  // homePagesList.value.push(...posts.data);
  const list = [...homePagesList.value, ...posts.data];
  homePagesList.value = list.map((i, index) => {
    i.index = index;
    return i;
  });
  console.log(homePagesList.value, "list---");
  if (posts.data.length === 30) {
    isFinished.value = false;
    page.value++;
  } else {
    isFinished.value = true;
  }
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};
getHomePosts("one");
</script>
