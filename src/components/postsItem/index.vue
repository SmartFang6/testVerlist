<template>
  <div class="posts_item">
    <!-- 首页 -->
    <div>
      <div class="post_head">
        <!-- 头像区域 -->
        <Avatar
          :userItem="item.user"
          :createdTime="item.createdTime"
          class="post_item_avatar"
        ></Avatar>
        <!-- 首页帖子置顶区块 -->
        <div class="head_top right">
          <span class="iconfont icon-zhiding icon_zhiding"></span>
          <span class="zhiding">置顶</span>
        </div>
        <!-- 右侧。。。 -->
        <div class="iconfont icon-gengduo1 right icon_xuanxiangka"></div>
      </div>
      <!-- 帖子内容 -->
      <div class="home_top msg">
        <div class="topic1">
          <img
            class="topic_icon"
            src="https://cdn.lanjuxiaoyuan.com/topic_icon.png"
          /><span> 热门</span>
        </div>
        <div class="rich" v-html="item.content"></div>
      </div>
    </div>
    <!-- 帖子图片 -->
    <ImgBox
      v-if="item.imgs && item.imgs.length > 0 && item.box === 0"
      :item="item"
    />

    <!-- 话题块 -->
    <div class="topic_box">
      <div
        class="sign_in_college"
        v-if="item.form_extend && !item.form_extend.options"
      >
        立即报名
      </div>
    </div>
  </div>
</template>

<script setup>
// 按需引入, 更小的应用体积
import Avatar from "../avatar/index.vue";
import ImgBox from "./imgBox/index.vue";
defineProps({
  item: {
    type: Object,
    default() {
      return {};
    },
  },
});
</script>
<style lang="less" scoped src="./index.less"></style>
