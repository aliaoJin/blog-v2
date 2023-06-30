<template>
    <suspense>
        <template #default>
            <router-view />
        </template>
        <template #fallback>
            <div class="loading">加载中...</div>
        </template>
    </suspense>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
