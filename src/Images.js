import React from "react";
import Gallery from 'react-grid-gallery';
import ImageUtil from "./utils/ImageUtil";


export default class Images extends React.Component {

    constructor(props) {
        super(props);
        this.imageUtil = new ImageUtil();
    }

    render() {
        const {urls} = this.props;

        if (urls.length < 1) {
            return (
                <div>
                    No images :-(
                </div>
            );
        }

        let images = [];
        for(let i = 0; i < urls.length; i++){
            images.push(
                {
                    src: this.imageUtil.getUrl(urls[i]),
                    thumbnail: this.imageUtil.getUrl(urls[i]),
                    thumbnailWidth: 300,
                    thumbnailHeight: 200,
                }
            );
        }

        return (
            <div>
                <Gallery images={images}/>
                {/*{urls.map((url) => (*/}
                    {/*<img*/}
                        {/*key={index++}*/}
                        {/*src={url}*/}
                        {/*alt={``}*/}
                        {/*className="img-thumbnail thumbnail-size"*/}
                    {/*/>*/}
                {/*))}*/}
            </div>
        );

    }

}

