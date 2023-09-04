<template>
  <div></div>
</template>
<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();
axios
  .post("api/authorizations", {
    name: "test",
    password: "123456",
  })
  .then((res) => {
    console.log(res);
    const token = res.data.data.token;
    localStorage.setItem("token", token);
    router.push("/home");
  });
</script>
