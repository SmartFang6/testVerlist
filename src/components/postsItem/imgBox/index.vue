<template>
  <div class="msg_img_box">
    <div
      class="img_box"
      :style="{
        width: item.imgs && item.imgs.length == 1 ? '50%' : '100%',
      }"
    >
      <img
        class="msg_img"
        :class="formateImg(item)"
        v-for="img in item.imgs"
        :key="img.id"
        :src="img.img_url"
      />
    </div>
  </div>
</template>

<script setup>
function formateImg(item) {
  let len = item.imgs?.length;
  if (len == 1) {
    return "img1";
  } else if (len == 3) {
    return "img3";
  } else if (len >= 5) {
    return "than5";
  } else {
    return "less5";
  }
}
defineProps({
  item: {
    type: Object,
    default() {
      return {};
    },
  },
});
</script>
<style lang="less" scoped>
.msg_img_box {
  display: flex;
  padding-top: 8px;

  .img_box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .msg_img {
      height: 94px;
      margin-top: 8px;
      margin-right: 8px;
      border-radius: 4px;
      border: 1px solid #eff2f3;
      box-sizing: border-box;
      object-fit: cover;
    }

    .than5 {
      width: 30%;
    }

    .less5 {
      width: 46%;
    }

    .img3 {
      width: calc((100% - 30px) / 3) !important;

      &:last-child {
        margin-right: 0;
      }
    }

    .img1 {
      width: 100%;
    }
  }
}
</style>
