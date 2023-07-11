<script setup lang="ts">
import { imagePerview } from "./components";
import "../dist/style.css";
import aaa from "./assets/09a78324-dd61-4941-92b9-a336e108c7ff.png";

const download = (aaa: string) => {
  console.log(aaa);
};
const remove = (aaa: string) => {
  console.log(aaa);
};
</script>

<template>
  <imagePerview :url="aaa" @download="download" @remove="remove" />
</template>

<style scoped></style>
