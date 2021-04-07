export const baseurl = (() => {
    let url:string
    switch(process.env.NODE_ENV) {
        case 'development': 
            url = `${process.env.DEV_HOST}:${process.env.PORT}`
            break;
        case 'production': 
            url = process.env.PROD_HOST as string
            break;
        default:
            url = ""
    }
    return url;
})()