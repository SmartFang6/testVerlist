<template>
  <!-- 头像 -->
  <div class="avater_item_userinfo">
    <div class="head_box">
      <img
        class="avatar_img"
        :src="
          (userItem && userItem.head_img + '?imgdiv2/1/w/64/h/64') ||
          'https://cdn.51zanzhu.net/campus_information_posts_1617246512658_76.png'
        "
      />
      <img
        v-if="userItem && userItem.pendant && userItem.pendant.img_url"
        class="head_mode"
        :src="userItem && userItem.pendant && userItem.pendant.img_url"
        mode="scaleToFill"
      />
    </div>
    <div class="info_box">
      <div class="username">
        <div
          :style="{ fontSize: '15px' }"
          class="name"
          v-if="userItem !== null && userItem.nickname !== null"
        >
          {{ userItem && userItem.nickname }}
        </div>
        <div class="img_box"></div>
      </div>
      <div class="school_desc">
        <div class="date">{{ createdTime }}</div>
        <span class="shu_line"></span>
        <div class="date">浏览⁡<span>11111</span>次</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userItem: {
    type: Object,
    default() {
      return {
        head_img: "",
        nickname: "",
        sex: 0,
      };
    },
  },
  createdTime: {
    type: String,
    default: "",
  },
});
</script>
<style scoped lang="less">
.avater_item_userinfo {
  position: relative;
  display: flex;
  align-items: center;

  .avatar_img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #eff2f3;
  }

  .head_box {
    position: relative;
    font-size: 0;
    line-height: 0;

    .head_mode {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 45px;
      height: 45px;
    }
  }

  .info_box {
    margin-left: 6px;

    .username {
      display: flex;
      align-items: center;

      .name {
        font-size: 15px;
        font-weight: 500;
        color: #262626;
      }

      .vipNameStyle {
        color: #f94f17;
      }

      .contributeNameStyle {
        color: #615396;
      }

      .img_box {
        display: flex;
        align-items: center;

        .gender_img {
          margin-left: 4px;
          width: 14px;
          height: 14px;
        }
      }

      .rol {
        color: #f94f17;
        margin-left: 3px;
        font-size: 13px;
      }
    }

    .school_desc {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #9b9b9b;

      & view:first-child {
        margin-right: 8px;
      }

      .date {
        margin: 0 !important;
      }

      .shu_line {
        display: block;
        width: 2px;
        height: 6px;
        margin: 0 3px;
        background: #8c8c8c;
      }

      view > text {
        margin: 0 2px;
      }
    }
  }
}
</style>
