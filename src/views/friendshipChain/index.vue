<template>
    <currencyBanner :title="'友情链接'" />
    <div id="friendshipChain">
        <div v-for="(item, index) in listData" :key="index" class="friendsItem">
            <div class="friendsItem_1">
                <img :src="item.icon" alt="" class="userIcon" />
                <div class="intr">
                    <img src="@/assets/refresh.svg" alt="" class="refresh" @click="refresh(item)" />
                    <p>
                        {{ item.name }}
                    </p>
                    <p :title="item.desc" class="desc">{{ item.desc }}</p>
                    <imgLoading class="iframeLoading" :id="`imgLoading${item.id}`" />
                    <!-- <img src="@/assets/loading.gif" alt="" class="iframeLoading" :id="`imgLoading${item.id}`"> -->
                    <img :src="item.screenShot" alt="" class="iframe" @load="loadItemImg(item)" :id="`img${item.id}`" />
                </div>
                <a class="btn" @click="goPage(item.blogurl)">GO</a>
            </div>
        </div>
        <!-- Add Links -->
        <div class="friendsItem">
            <div class="addlinks">
                <button @click="dialogVisible = true">Add Links</button>
            </div>
        </div>
        <!-- 小屏幕下的友链 -->
        <div class="friendshipList">
            <ul>
                <li v-for="(item, index) in listData" :key="index" class="friendshipItem rounded-xl cursor-pointer shadow-lg">
                    <a :href="item.blogurl" target="_blank">
                        <img :src="item.icon" alt="" />
                        <div class="intr">
                            <p>{{ item.name }}</p>
                            <p :title="item.desc">{{ item.desc }}</p>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <paginationVue :total="conditionTotal" :currentObj="paginationObj" @onCurrentChange="onCurrentChange" />
    <el-dialog v-model="dialogVisible" title="添加友链" width="30%">
        <div class="dialog-content" v-if="dialogVisible">
            <el-form ref="ruleFormRef" :model="FormData" :rules="rules" class="demo-ruleForm" status-icon>
                <el-form-item label="友链名称" prop="name">
                    <el-input v-model="FormData.name" placeholder="请输入友情链接名称" />
                </el-form-item>
                <el-form-item label="友链链接" prop="blogurl">
                    <el-input v-model="FormData.blogurl" placeholder="请输入友情链接" />
                </el-form-item>
                <el-form-item label="友链图标" prop="icon">
                    <el-input v-model="FormData.icon" placeholder="请输入友情链接图标" />
                </el-form-item>
                <el-form-item label="友链截图" prop="screenShot" placeholder="请输入友情链接截图">
                    <el-input v-model="FormData.screenShot" />
                </el-form-item>
                <el-form-item label="友链描述" prop="describe" placeholder="请输入友情链接描述">
                    <el-input v-model="FormData.describe" type="textarea" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button @click="addFriendLinks(ruleFormRef)">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import currencyBanner from '@/components/banner.vue';
import { getFriendShipList, setRefreshScreenShot, addFirendly } from '@/api/api';
import paginationVue from '@/components/pagination.vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import imgLoading from '@/components/imgLoading.vue';
import { useStore } from '@/store';
const conditionTotal: any = ref(100);
const paginationObj = reactive({
    pageNum: 1,
    pageSize: 11,
});
const ruleFormRef = ref<FormInstance>();
const dialogVisible = ref(false);
const FormData = reactive({
    name: '',
    blogurl: '',
    icon: '',
    screenShot: '',
    describe: '',
});
const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入友链名称', trigger: 'blur' }],
    blogurl: [{ required: true, message: '请输入友链链接', trigger: 'blur' }],
    icon: [{ required: true, message: '请输入友链图标', trigger: 'blur' }],
    describe: [{ required: true, message: '请输入友链描述', trigger: 'blur' }],
    screenShot: [{ required: true, message: '请输入友链截图', trigger: 'blur' }],
});
const store = useStore();
const innerWidth = ref<number>(0);

onMounted(() => {
    innerWidth.value = window.innerWidth;
});

const listData = ref<any>([]);

async function getFriendList() {
    const res: any = await getFriendShipList(paginationObj);
    listData.value = res.data.lists;
    conditionTotal.value = res.data.count;
}
getFriendList();

const loadItemImg = (item: any) => {
    const imgDom: any = document.getElementById(`img${item.id}`);
    const imgLoadingDom: any = document.getElementById(`imgLoading${item.id}`);
    // imgDom.src = `${item.screenShot}?${Math.random()}`
    imgDom.style.opacity = '1';
    imgLoadingDom.style.opacity = '0';
};

const refresh = async (item: any) => {};
// 新标签页打开外部链接
function goPage(url: string) {
    window.open(url, '_blank');
}
// 添加友情链接
const addFriendLinks = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            addFirendly(FormData).then((res: any) => {
                if (res.code === 200) {
                    dialogVisible.value = false;
                    ElMessage({ message: '添加成功', type: 'success' });
                    getFriendList();
                }
            });
        }
    });
};
// 分页
const onCurrentChange = async (value: number) => {
    paginationObj.pageNum = value;
    await getFriendList();
};
</script>

<style lang="scss" scoped>
#friendshipChain {
    margin: 0 auto;
    position: relative;

    .friendshipList {
        width: 100%;
        height: calc(100% - 50px - 20px);
        overflow: hidden;

        ul {
            width: auto;
            height: 100%;
            list-style: none;
            overflow: overlay;

            .friendshipItem {
                width: 262px;
                height: 125px;
                background: var(--home-box-background-color);
                margin: 18px;
                border-radius: 10px;
                float: left;
                transition: all 0.5s;

                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.411);

                    a {
                        color: #000;
                    }
                }

                a {
                    position: relative;
                    display: inline-block;
                    width: 100%;
                    height: 100%;

                    img {
                        width: 55px;
                        height: 55px;
                        border-radius: 28px;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 25px;
                        margin: auto;
                    }

                    .intr {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding: 20px 0 20px 100px;

                        p {
                            align-items: center;
                            padding-right: 25px;
                            text-align: left;

                            &:last-child {
                                height: 48px;
                                font-size: 12px;
                                word-break: break-all; //在恰当的断字点进行换行
                                overflow: hidden; //文字超出的进行隐藏
                                text-overflow: ellipsis; //超出的文字用省略号表示
                                display: -webkit-box; //将元素设为盒子伸缩模型显示         //利用盒子模型
                                -webkit-box-orient: vertical; //伸缩方向设为垂直方向
                                -webkit-line-clamp: 2;
                            }
                        }
                    }
                }
            }
        }
    }
}

@media screen and (min-width: 320px) {
    .banner {
        display: none;
    }

    #friendshipChain {
        width: 95%;
        padding-top: 80px;
        padding-bottom: 20px;
        height: auto;

        .friendsItem {
            display: none;
        }

        .friendshipList {
            display: block;
            width: 100%;
            height: 100%;
            overflow: overlay;

            ul {
                .friendshipItem {
                    margin: 12px 0;
                    width: 99%;
                }
            }
        }
    }
}

@media screen and (min-width: 800px) {
    #friendshipChain {
        width: 800px;
        padding: 50px 0;
        height: auto;

        .friendsItem {
            display: none;
        }

        .friendshipList {
            display: block;
            width: 100%;
            height: calc(100% - 40px);
            overflow: overlay;

            ul {
                .friendshipItem {
                    margin: 18px;
                    width: 28%;
                }
            }
        }
    }
}

@media screen and (min-width: 1280px) {
    #friendshipChain {
        padding: 70px 0;
        width: 1200px;
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        min-height: 500px;
        margin: 0 auto;
        flex-wrap: wrap;

        // position: relative;
        .friendsItem {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 23%;
            height: 125px;
            margin-bottom: 45px;
            user-select: none;
            .addlinks button {
                position: absolute;
                top: 25px;
                left: 25%;
                transform: (-25%, -25%);
            }

            .friendsItem_1 {
                position: absolute;
                background: var(--home-box-background-color);
                border-radius: 10px;
                width: 100%;
                height: 100%;
                z-index: 0;
                transition: all 0.3s ease-in-out;

                img.userIcon {
                    border: 2px solid var(--home-box-background-color);
                    position: absolute;
                    top: -40px;
                    left: 0;
                    right: 0;
                    margin: auto;
                    width: 80px;
                    height: 80px;
                    border-radius: 40px;
                    background: var(--home-box-background-color);
                }

                .intr {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    padding: 40px 20px 20px;

                    img.refresh {
                        position: absolute;
                        top: 45px;
                        right: 20px;
                        opacity: 0;
                        height: 20px;
                        width: 20px;
                        cursor: pointer;
                    }

                    p {
                        // padding-right: 25px;
                        text-align: left;
                    }

                    .desc {
                        height: 48px;
                        font-size: 13px;
                        word-break: break-all; //在恰当的断字点进行换行
                        overflow: hidden; //文字超出的进行隐藏
                        text-overflow: ellipsis; //超出的文字用省略号表示
                        display: -webkit-box; //将元素设为盒子伸缩模型显示         //利用盒子模型
                        -webkit-box-orient: vertical; //伸缩方向设为垂直方向
                        -webkit-line-clamp: 2;
                    }

                    .iframe {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        top: 0;
                        right: 0;
                        margin: auto;
                        width: 85%;
                        height: 0;
                        opacity: 0;
                        transition: all 0.3s;
                        border-radius: 0;
                        object-fit: cover;
                    }

                    .iframeLoading {
                        // display: none;
                        transform: scale(0);
                        opacity: 0;
                    }
                }

                .btn {
                    position: absolute;
                    bottom: 10px;
                    right: 20px;
                    display: inline-block;
                    width: 45px;
                    background: #ff9359;
                    color: #fff;
                    border-radius: 6px;
                    opacity: 0;
                    transition: all 0.3s;

                    &:hover {
                        background: #ff5e08;
                    }
                }
            }

            &:not(:nth-child(4n)) {
                margin-right: 30px;
            }

            &:hover {
                .friendsItem_1 {
                    filter: drop-shadow(0px 0px 15px rgba(131, 131, 131, 0.411));
                    // box-shadow: 0px 0px 15px 0px rgba(131, 131, 131, 0.411);
                    background: var(--home-box-background-color);
                    height: 300px;
                    z-index: 10;

                    .intr {
                        position: relative;
                        img.refresh {
                            opacity: 1;
                            top: 42px;
                            right: 20px;
                            &:hover {
                                filter: contrast(0.5);
                            }
                        }
                        .desc {
                            display: none;
                        }

                        .iframe {
                            height: 130px;
                            border: 2px solid rgba(201, 201, 201, 0.205);
                            opacity: 0;
                        }

                        .iframeLoading {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    .btn {
                        opacity: 1;
                    }
                }
            }
        }

        .friendshipList {
            display: none;
        }
    }
}

.addlinks {
    position: absolute;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    z-index: 0;
    button {
        padding: 1.3em 3em;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 2.5px;
        font-weight: 500;
        color: #000;
        background-color: #fff;
        border: none;
        border-radius: 45px;
        box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease 0s;
        cursor: pointer;
        outline: none;
    }

    button:hover {
        background-color: #23c483;
        box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
        color: #fff;
        transform: translateY(-7px);
    }

    button:active {
        transform: translateY(-1px);
    }
}
</style>
