<template>
    <div id="artlist">
        <div class="leftList">
            <div class="artBox" v-for="item in artList" :key="item.id" @click="artDetail(item.id)">
                <h2>{{ item.title || '--' }}</h2>
                <div class="container">
                    <div class="imgBox">
                        <template v-if="item.coverUrl">
                            <img :src="item.coverUrl || imgUrl" alt="" @load="loadItemImg(item.id)" :id="`img${item.id}`" />
                        </template>
                        <img :src="imgUrl" alt="" v-else />
                    </div>
                    <div class="content">
                        <div class="desc">
                            <div style="width: 45px; height: 80px; float: left; clear: both" align="center" class="div111"></div>
                            {{ item.describe }}
                            <p class="artEpitomize">
                                <span>
                                    <img src="@/assets/author.svg" alt="" width="14" height="14" />
                                    长夜有星辰
                                </span>
                                <span>
                                    <img src="@/assets/time.svg" alt="" width="14" height="14" />
                                    {{ date(item.createTime) }}
                                </span>
                                <span>
                                    <img src="@/assets/classify.svg" alt="" width="14" height="14" />
                                    {{ item.tag }}
                                </span>
                                <span>
                                    <img src="@/assets/views.svg" alt="" width="14" height="14" />
                                    {{ item.Views || 100 }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <paginationVue :total="conditionTotal" :currentObj="paginationObj" @onCurrentChange="onCurrentChange" />
        </div>
        <div class="userMsg">
            <div class="userDesc">
                <img :src="portrait" alt="" class="userIcon" />
                <img src="@/assets/iconKuang.png" alt="" class="userIconFrame" />
                <span class="userName">长夜有星辰</span>
                <div class="num-box">
                    <div class="num1">
                        <p class="p1">{{ total || '--' }}</p>
                        <p class="p2">文章</p>
                    </div>
                    <div class="num1">
                        <p class="p1">{{ classifyList?.length }}</p>
                        <p class="p2">分类</p>
                    </div>
                </div>
            </div>
            <div class="timeDetail">博客已平稳运行{{ days }}天</div>
            <cityWeather />
            <div class="category">
                <p>分类</p>
                <ul>
                    <li @click="selectArtList()">
                        <span>全部</span>
                        <span></span>
                    </li>
                    <li v-for="item in classifyList" :key="item.tid" @click="selectArtList(item.tid)">
                        <span>{{ item.typeName }}</span>
                        <span>{{ item.amount }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { getArticleList, getClassifyIdList } from '@/api/api';
import { date } from '@/util/date';
import { ref, reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import paginationVue from '@/components/pagination.vue';
import cityWeather from '@/components/cityWeather.vue';
const portrait = 'https://foruda.gitee.com/avatar/1677140077959490280/8514949_liao-jinping_1609308207.png';
const isImgLoaing = ref<boolean>(false);
const store = useStore();
const artList: any = ref([]);
const total = ref<number>(0);
const days = ref<number>(0);
const conditionTotal: any = ref(100);
const classifyList: any = ref([]);
const paginationObj = reactive({
    pageNo: 1,
    pageSize: 10,
});
const articleType = ref<number | string>(' ');
const router = useRouter();
// 获取文章列表
const articleList = async (params: object) => {
    const res: any = await getArticleList(Object.assign(params, paginationObj));
    artList.value = res.data.lists;
    total.value = res.data.count;
    conditionTotal.value = res.data.count;
    return res.data.lists;
};
const time = () => {
    const start: any = new Date('2023-05-20'); //开始的时间
    const end: any = new Date(); //结束的时间
    const se = end - start; //计算两个时间之间的秒数
    days.value = Math.floor(se / (24 * 3600 * 1000)); // 计算天数
};
const classify = async () => {
    const res: any = await getClassifyIdList();
    classifyList.value = res.data.lists;
};
const init = async () => {
    await time();
    await classify();
    await articleList({});
};
init();
const artDetail = (id: any) => {
    if (window.innerWidth <= 800) {
        router.push({ path: '/artDetail', query: { id: id } });
        const homeDom: any = document.querySelector('#home');
        homeDom.scrollTop = 0;
    } else {
        const url = router.resolve({ path: '/artDetail', query: { id: id } });
        window.open(url.href, '_blank');
    }
};
const selectArtList = async (item: number | string = '') => {
    articleType.value = item;
    paginationObj.pageNo = 1;
    articleList({ type: item });
    // 设置滚动条位置
    scrollHome();
};
const hScroll = computed(() => {
    return store.scroll;
});
const scrollHome = () => {
    const homeDom: any = document.querySelector('#home');
    homeDom.scrollTop = window.innerHeight - 65;
};
const onCurrentChange = async (value: number) => {
    paginationObj.pageNo = value;
    await articleList({ type: articleType.value });
    await scrollHome();
};

const loadItemImg = (id: any) => {
    isImgLoaing.value = true;
    const imgDom: any = document.getElementById(`img${id}`);
    const imgLoadingDom: any = document.getElementById(`imgLoading${id}`);
    imgDom.style.zIndex = '5';
    imgDom.style.opacity = '1';
    imgLoadingDom.style.opacity = '0';
};
const imgUrl = 'https://w.wallhaven.cc/full/we/wallhaven-we63yx.jpg';
// 菜单定位模式
watch(hScroll, (newVal) => {
    console.log(newVal);
});
</script>
<style lang="scss" scoped>
#artlist {
    margin: auto;
    padding-top: 100px;
    .artListItem {
        transition: all 0.5s;
        &:hover {
            @apply scale-105;
        }
        .artEpitomize {
            margin-top: 10px;
            font-size: 12px;
            span {
                margin-right: 20px;
            }
        }
    }
}
.textStroke {
    -webkit-text-stroke: 1px rgba(219, 219, 219, 0.411);
}
@media screen and (min-width: 320px) {
    #artlist {
        width: 95%;
        .leftList {
            width: 100%;
            .artBox {
                position: relative;
                width: 100%;
                margin-bottom: 20px;
                // transition: all 0.5s;
                // box-shadow: 0px 0px 10px 0px var(--hover-shadow-color);
                border-radius: 6px;
                cursor: pointer;
                h2 {
                    position: absolute;
                    top: 58%;
                    left: 0;
                    width: 100%;
                    margin-bottom: 20px;
                    font-size: 20px;
                    color: #000;
                    z-index: 2;
                    transition: all 0.5s;
                }
                .container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    max-width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    margin: 0;
                    .imgBox {
                        position: relative;
                        width: 100%;
                        height: 200px;
                        overflow: hidden;
                        border-radius: 12px 12px 0 0;
                        img {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            width: 100%;
                            z-index: 1;
                            object-fit: cover;
                            transition: all 0.5s;
                        }
                    }
                    .content {
                        position: relative;
                        // top: 58px;
                        // left: 200px;
                        // margin-bottom: 20px;
                        padding: 60px 20px 25px;
                        background: var(--home-box-background-color);
                        font-size: 14px;
                        z-index: 1;
                        width: 100%;
                        height: 170px;
                        color: var(--color);
                        // box-shadow: 0 0 15px 2px var(--hover-shadow-color);
                        border-radius: 0 0 12px 12px;
                        text-align: start;
                        transition: all 0.5s;
                        .div111 {
                            display: none;
                        }
                        .desc {
                            width: 100%;
                            height: 50%;
                            word-break: break-all; //在恰当的断字点进行换行
                            overflow: hidden; //文字超出的进行隐藏
                            text-overflow: ellipsis; //超出的文字用省略号表示
                            display: -webkit-box; //将元素设为盒子伸缩模型显示         //利用盒子模型
                            -webkit-box-orient: vertical; //伸缩方向设为垂直方向
                            -webkit-line-clamp: 2;
                            user-select: none;
                        }
                        .artEpitomize {
                            position: absolute;
                            bottom: 10px;
                            left: 20px;
                            transition: all 0.5s;
                            display: flex;
                            span {
                                display: flex;
                                justify-content: flex-start;
                                margin-right: 20px;
                                img {
                                    margin: 5px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .userMsg {
            display: none;
        }
    }
}
@media screen and (min-width: 800px) {
    #artlist {
        width: 800px;
        .leftList {
            width: 100%;
            .artBox {
                position: relative;
                width: 100%;
                margin-bottom: 20px;
                transition: all 0.5s;
                // box-shadow: 0px 0px 10px 1px var(--hover-shadow-color);
                border-radius: 6px;
                cursor: pointer;
                h2 {
                    position: absolute;
                    top: 20px;
                    left: 270px;
                    width: auto;
                    margin-bottom: 20px;
                    font-size: 20px;
                    color: #000;
                    z-index: 2;
                    transition: all 0.5s;
                }
                .container {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    max-width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    margin: 0;
                    .imgBox {
                        position: relative;
                        width: 250px;
                        height: 170px;
                        overflow: hidden;
                        border-radius: 12px 0 0 12px;
                        img {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            width: 100%;
                            height: 100%;
                            z-index: 2;
                            object-fit: cover;
                            transition: all 0.5s;
                        }
                    }
                    .content {
                        position: relative;
                        // top: 58px;
                        // left: 200px;
                        // margin-bottom: 20px;
                        padding: 60px 20px 25px;
                        // background: var(--home-box-background-color);
                        font-size: 14px;
                        z-index: 1;
                        width: calc(100% - 250px);
                        height: 170px;
                        // color: #000;
                        // box-shadow: 0 15px 25px var(--hover-shadow-color);
                        border-radius: 0 12px 12px 0;
                        text-align: start;
                        transition: all 0.5s;
                        .div111 {
                            display: none;
                        }
                        .desc {
                            width: 100%;
                            height: 50%;
                            word-break: break-all; //在恰当的断字点进行换行
                            overflow: hidden; //文字超出的进行隐藏
                            text-overflow: ellipsis; //超出的文字用省略号表示
                            display: -webkit-box; //将元素设为盒子伸缩模型显示         //利用盒子模型
                            -webkit-box-orient: vertical; //伸缩方向设为垂直方向
                            -webkit-line-clamp: 2;
                            user-select: none;
                        }
                        .artEpitomize {
                            position: absolute;
                            bottom: 10px;
                            left: 20px;
                            transition: all 0.5s;
                            span {
                                &:not(:last-child) {
                                    margin-right: 30px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .userMsg {
            display: none;
        }
    }
}
@media screen and (min-width: 1280px) {
    #artlist {
        position: relative;
        width: 1200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        .leftList {
            width: 70%;
            .artBox {
                position: relative;
                width: 100%;
                margin-bottom: 70px;
                transition: all 0.5s;
                box-shadow: none;
                cursor: pointer;
                &:hover {
                    filter: drop-shadow(2px 2px 8px var(--home-artBox-shadow-color));
                    h2 {
                        top: 100px;
                    }
                    .container {
                        .imgBox {
                            img {
                                filter: saturate(120%);
                                transform: scale(1.1);
                            }
                        }
                        .content {
                            top: 30px;
                            .desc {
                            }
                            .artEpitomize {
                                span img {
                                    filter: saturate(90);
                                }
                            }
                        }
                    }
                }
                h2 {
                    position: absolute;
                    top: 20px;
                    left: 300px;
                    width: auto;
                    margin-bottom: 20px;
                    font-size: 30px;
                    color: var(--color);
                    transition: all 0.5s;
                    z-index: 0;
                }
                .container {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .imgBox {
                        position: relative;
                        width: 250px;
                        height: 160px;
                        overflow: hidden;
                        z-index: 2;
                        // box-shadow: 0px 0px 8px 0px rgb(0, 0, 0, 0.5);
                        border-radius: 12px;
                        img {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            width: 100%;
                            height: 100%;
                            z-index: 2;
                            object-fit: cover;
                            transition: all 0.5s;
                        }
                    }
                    .content {
                        position: absolute;
                        top: 58px;
                        left: 200px;
                        margin-bottom: 20px;
                        padding: 20px 20px 55px;
                        // background: var(--home-box-background-color);
                        font-size: 16px;
                        z-index: 1;
                        width: 630px;
                        height: 140px;
                        // color: var(--color);
                        // box-shadow: 0 0 15px 5px var(--hover-shadow-color);
                        border-radius: 12px;
                        text-align: start;
                        transition: all 0.5s;
                        .div111 {
                            display: block;
                        }
                        .desc {
                            width: 100%;
                            height: 100%;
                            word-break: break-all; //在恰当的断字点进行换行
                            overflow: hidden; //文字超出的进行隐藏
                            text-overflow: ellipsis; //超出的文字用省略号表示
                            display: -webkit-box; //将元素设为盒子伸缩模型显示      //利用盒子模型
                            -webkit-box-orient: vertical; //伸缩方向设为垂直方向
                            -webkit-line-clamp: 3;
                            user-select: none;
                        }
                        .artEpitomize {
                            position: absolute;
                            bottom: 8px;
                            left: 60px;
                            transition: all 0.5s;
                            span {
                                margin-right: 20px;
                            }
                        }
                    }
                }
            }
        }
        .userMsg {
            user-select: none;
            display: block;
            position: absolute;
            top: 100px;
            right: 0;
            width: 300px;
            // height: 500px;
            // box-shadow: 0 0 15px 5px var(--hover-shadow-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            .userDesc,
            .timeDetail,
            .category {
                @apply rounded-xl;
                // border-radius: 6px;
                transition: all 0.5s;
                background: var(--home-box-background-color);
                padding: 20px;
                &:hover {
                    // box-shadow: 0 0 15px 5px var(--hover-shadow-color);
                    filter: drop-shadow(0 0 5px var(--hover-shadow-color));
                }
            }

            .userDesc {
                position: relative;
                width: 100%;
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
                img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50px;
                    margin-bottom: 15px;
                }
                .userIconFrame {
                    display: none;
                }
                .userName {
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                .num-box {
                    width: 100%;
                    align-items: center;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 10px;
                    .num1 {
                        width: 30%;
                    }
                    .num1:first-child {
                        border-right: 2px solid #000;
                    }
                }
            }
            .timeDetail {
                position: relative;
                width: 100%;
                height: 36px;
                line-height: 36px;
                padding: 0;
                box-sizing: border-box;
                margin-bottom: 15px;
            }
            .category {
                position: relative;
                width: 100%;
                p {
                    text-align: left;
                    padding-left: 30px;
                    background: url('@/assets/category.svg') no-repeat 10px 1px;
                    background-size: 18px;
                    margin-bottom: 2px;
                }
                ul {
                    list-style: none;
                    padding: 5px 10px;
                    li {
                        height: 35px;
                        line-height: 35px;
                        // box-shadow: 0 0 10px 1px var(--hover-shadow-color);
                        margin-bottom: 10px;
                        border-radius: 6px;
                        text-align: left;
                        padding: 0 20px;
                        cursor: pointer;
                        transition: all 0.5s;
                        span:last-child {
                            float: right;
                        }
                        &:hover {
                            transform: scale(1.05);
                            box-shadow: 0 0 10px 2px var(--hover-shadow-color);
                        }
                    }
                }
            }
        }
    }
    .guo-feng {
        .userDesc {
            border-radius: 40px;
            &::after {
                position: absolute;
                top: -25px;
                width: 352px;
                height: 276px;
                background: url(/src/assets/frame.png) no-repeat;
                background-size: 100% 100%;
                content: '';
            }
            .userIconFrame {
                position: absolute;
                top: 4px;
                left: -6px;
                right: 0;
                display: inline-block;
                margin: auto;
                width: 138px;
                height: 138px;
            }
        }
        .timeDetail {
            &::after {
                position: absolute;
                top: -5px;
                left: -6px;
                width: 313px;
                height: 46px;
                background: url('@/assets/timeBorder.png') no-repeat;
                background-size: 100% 100%;
                content: '';
            }
        }
    }
}
</style>
