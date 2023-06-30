import axios from './index';

// 文章列表
export const getArticleList = (params: object) => {
    return axios.get('/blogArticle/list', { params });
};
// 文章详情
export const getArticleDetail = (params: any) => {
    return axios.get('/blogArticle/detail', { params });
};
// 一言
export const aWord = (params: object) => {
    return axios.get('https://v1.hitokoto.cn/', { params });
};
// 分类列表
export const getClassifyIdList = (params?: object) => {
    return axios.get('/blogArticleType/list', { params });
};
// 友链列表
export const getFriendShipList = (params?: object) => {
    return axios.get('/friendlyLinks/list', { params });
};
// 友链列表单个刷新
export const setRefreshScreenShot = (params: object) => {
    return axios.post('/refreshScreenShot', params);
};
// 实况天气
export const getCityWeather = (params: object) => {
    return {
        code: 200,
        data: {
            address: 'CN|上海市|上海市|None|None|100|100',
            temperature: 27,
            skyconCn: '多云（白天）',
            skyconEn: 'PARTLY_CLOUDY_DAY',
            pm25: 12,
        },
        message: '获取数据成功',
    };
    return axios.get('/cityWeather', { params });
};

// 添加友链
export const addFirendly = (params: object) => {
    return axios.post('/friendlyLinks/add', params);
};
