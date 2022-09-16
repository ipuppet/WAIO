const Widget = require("../widget")
const PictureSetting = require("./setting")

class PictureWidget extends Widget {
    constructor(kernel) {
        super(kernel, new PictureSetting(kernel))
        this.album = this.setting.album
        this.albumPath = this.album.albumPath
        this.imageSwitchMethod = this.setting.get("imageSwitchMethod")
        this.switchInterval = 1000 * 60 * Number(this.setting.get("switchInterval"))
        this.urlScheme =
            this.setting.get("urlScheme") !== ""
                ? `jsbox://run?name=${$addin.current.name}&url-scheme=${$text.URLEncode(this.setting.get("urlScheme"))}`
                : this.setting.settingUrlScheme
        this.pictures = this.album.getImages(
            this.setting.get("useCompressedImage") ? this.album.imageType.compressed : this.album.imageType.original
        )
        // 缓存
        this.data = $cache.get("switch.data")
        if (!this.data) {
            // 首次写入缓存
            this.data = {
                date: Date.now(),
                index: this.imageSwitchMethod === 0 ? this.randomNum(0, this.pictures.length - 1) : 0
            }
            $cache.set("switch.data", this.data)
        }
    }

    randomNum(min, max) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * min + 1, 10)
            case 2:
                return parseInt(Math.random() * (max - min + 1) + min, 10)
            default:
                return 0
        }
    }

    getSmallView() {
        let index = 0 // 图片索引
        if (Date.now() - this.data.date > this.switchInterval) {
            // 下一张
            if (this.imageSwitchMethod === 0) {
                // 0随机切换，1顺序切换
                index = this.randomNum(0, this.pictures.length - 1)
            } else {
                index = this.data.index + 1
                if (index > this.pictures.length - 1) index = 0
            }
            $cache.set("switch.data", {
                date: Date.now(),
                index: index
            })
        } else {
            // 维持不变
            index = this.data.index
        }
        let imagePath = this.pictures[index] // 获取图片
        let view
        if (!$file.exists(imagePath)) {
            view = {
                type: "text",
                props: {
                    widgetURL: this.setting.settingUrlScheme,
                    text: `${$l10n("NO_IMAGE")}:\n${imagePath}`
                }
            }
        } else {
            view = {
                type: "image",
                props: {
                    image: $image(imagePath),
                    resizable: true,
                    scaledToFill: true,
                    frame: {
                        maxWidth: Infinity,
                        maxHeight: Infinity
                    },
                    link: this.urlScheme,
                    widgetURL: this.urlScheme
                }
            }
        }
        return view
    }

    render() {
        const expireDate = new Date(this.data.date + this.switchInterval)
        $widget.setTimeline({
            entries: [
                {
                    date: Date.now(),
                    info: {}
                }
            ],
            policy: {
                afterDate: expireDate
            },
            render: () => {
                const view = this.getSmallView()
                this.printTimeConsuming()
                return view
            }
        })
    }
}

module.exports = {
    Widget: PictureWidget
}
