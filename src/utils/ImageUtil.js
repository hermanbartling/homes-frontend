class ImageUtil {

    constructor() {
        this.imageHost = "";
        if (process.env.REACT_APP_IMAGE_HOST != null) {
            this.imageHost = process.env.REACT_APP_IMAGE_HOST;
        }
    }

    getUrl(path) {
        return this.imageHost + path;
    }
}

export default ImageUtil;