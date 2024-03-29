const NAME = "Album"
const WidgetSetting = require("../setting")
const Album = require("./album")
const { UIKit } = require("../../libs/easy-jsbox")

class PictureSetting extends WidgetSetting {
    constructor(kernel) {
        super(kernel, NAME)
        this.cacheKey = "switch.data" + this.config.name ?? ""
        this.album = new Album(this.kernel, this)
    }

    initSettingMethods() {
        this.setting.method.album = animate => {
            const views = this.album.getAlbumView(),
                buttons = this.album.getAlbumButtons()
            UIKit.push({
                views: views,
                title: $l10n("ALBUM"),
                navButtons: buttons
            })
        }

        this.setting.method.clearCache = animate => {
            animate.start()
            $cache.remove(this.cacheKey)
            animate.done()
        }
    }
}

module.exports = PictureSetting
