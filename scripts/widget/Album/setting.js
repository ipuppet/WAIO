const NAME = "Album"
const WidgetSetting = require("../setting")
const Album = require("./album")
const { UIKit } = require("../../libs/easy-jsbox")

class PictureSetting extends WidgetSetting {
    constructor(kernel) {
        super(kernel, NAME)
        this.album = new Album(this.kernel, this)
    }

    initSettingMethods() {
        this.setting.method.album = animate => {
            animate.touchHighlightStart()
            const views = this.album.getAlbumView(),
                buttons = this.album.getAlbumButtons()
            UIKit.push({
                views: views,
                title: $l10n("ALBUM"),
                navButtons: buttons,
                disappeared: () => {
                    animate.touchHighlightEnd()
                }
            })
        }

        this.setting.method.clearCache = animate => {
            animate.actionStart()
            $cache.remove("switch.data")
            animate.actionDone()
        }
    }
}

module.exports = PictureSetting
