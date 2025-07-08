<script setup lang="ts">
const stew = [
  "Nuxt 4",
  "Nitro",
  "TypeScript",
  "Tailwind v4",
  "Tailwind Variants",
  "Pinia",
  "@nuxt/ui",
  "Vee-validate + Yup",
  "VueUse",
  "SCSS",
];

const approaches = [
  "FSD - Feature Sliced Design",
  "BFF - Backend For Frontend",
];

const formats = ["Eslint", "Prettier"];

const { data, refresh } = postEntity.useAll();
</script>

<template>
  <main
    class="w-full min-h-dvh flex justify-center items-center flex-col gap-4 bg-[url('~/assets/img/background.png')] bg-cover bg-no-repeat"
  >
    <UButton @click="refresh()">Найти</UButton>
    <UButton to="/about">абоут</UButton>
    {{ data }}
    <h1 class="text-5xl font-medium mb-8">WELCOME DEAR DEVELOPER!!!</h1>
    <h2 class="text-3xl">STEW IN PROJECT:</h2>
    <div class="max-w-1/2 flex gap-4 gap-y-3 flex-wrap justify-center">
      <UBadge
        v-for="(item, i) in stew"
        :key="i"
        size="xl"
        :color="i % 2 ? 'info' : 'primary'"
        variant="soft"
        trailing-icon="mingcute:ai-line"
        >{{ item }}</UBadge
      >
    </div>
    <h2 class="text-3xl">APPROACHES IN PROJECT:</h2>
    <div class="max-w-1/2 flex gap-4 flex-wrap justify-center">
      <UBadge
        v-for="(item, i) in approaches"
        :key="i"
        size="xl"
        color="warning"
        variant="soft"
        trailing-icon="mingcute:ai-line"
        >{{ item }}</UBadge
      >
    </div>
    <h2 class="text-3xl">FORMATTED BY:</h2>
    <div class="max-w-1/2 flex gap-4 flex-wrap justify-center">
      <UBadge
        v-for="(item, i) in formats"
        :key="i"
        size="xl"
        color="neutral"
        variant="soft"
        trailing-icon="mingcute:ai-line"
        >{{ item }}</UBadge
      >
    </div>
    <h2 class="text-3xl">SUPPORTS BY:</h2>
    <div class="max-w-1/2 flex gap-4 flex-wrap justify-center">
      <UBadge size="xl" color="error" variant="soft" icon="mdi:account"
        >KQraze (pavel.eliseev061@gmail.com)</UBadge
      >
      <UBadge
        size="xl"
        color="error"
        variant="soft"
        icon="majesticons:clock-line"
        >06.06.2025</UBadge
      >
    </div>
  </main>
</template>

<style scoped></style>
