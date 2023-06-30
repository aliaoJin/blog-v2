<template>
    <currencyBanner :title="'关于我'" />
    <div id="about">
        <div class="content">
            <p>又菜又爱玩的前端混子</p>
            <div class="about-img">
                <img class="wx" @mouseenter="iswx = true" @mouseleave="iswx = false" src="https://aliao-img.oss-cn-hangzhou.aliyuncs.com/aliao-img/wx.png" />
                <img @click="goPage" src="https://aliao-img.oss-cn-hangzhou.aliyuncs.com/aliao-img/github.png" />
            </div>
            <img v-if="iswx" style="height: 300px; width: 300px; margin: 0 auto" src="https://aliao-img.oss-cn-hangzhou.aliyuncs.com/aliao-img/my-wx.jpg" />
        </div>
    </div>
</template>

<script setup lang="ts">
import currencyBanner from '@/components/banner.vue';
import { ref } from 'vue';
const goPage = () => {
    window.open('https://github.com/aliaoJin', '_blank');
};
const iswx = ref(false);
const onMouseenter = () => {};
</script>

<style scoped lang="scss">
#about {
    position: relative;
    margin: 0 auto;
    padding: 70px 0;
}
@media screen and (min-width: 1280px) {
    #about {
        width: 1280px;
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding-top: 100px;
            width: 80%;
            height: 500px;
            background: var(--home-box-background-color);
            margin: 0 auto;
            .about-img {
                display: flex;
                align-items: center;
                gap: 15px;
                margin: 10px;
                img {
                    height: 30px;
                    width: 30px;
                    border-radius: 50px;
                }
            }
        }
    }
}
</style>
