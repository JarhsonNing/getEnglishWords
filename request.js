const $axios = require("axios");

let axios = $axios.create({
    baseURL:"https://www.koolearn.com",
    timeout:6000
});
// 添加请求拦截器
axios.interceptors.request.use(
    config => {
        // console.log(config)
        config.headers['Content-Type'] = 'application/json; charset=UTF-8';
        if (config.method === 'post') {
            // config.data = qs.stringify(config.data);
            config.data = JSON.stringify(config.data);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器，
axios.interceptors.response.use((res) => {
        if(res.status === 200){
            return res.data
        }else{
            return res.status
        }
    },
    error => {
        // console.log(error,error.response,'err');
        return Promise.reject(error);
    }
);
class request {
    static async get(url,data){
        let res = await axios.get(url,{params:data})
        return res
    }
    static download({ type = 'get', url, path }) {

        axios({
            method: type,
            url,
            responseType: 'stream'
        }).then((response) => {

            response.data.pipe(fs.createWriteStream(path));

        });
    }
}

module.exports = request