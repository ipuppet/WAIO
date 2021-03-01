const NAME = "Album"
const Setting = require("../setting")
const Album = require("./album")

class PictureSetting extends Setting {
    constructor(kernel) {
        super(kernel, NAME)
        this.album = new Album(this.kernel, this)
    }

    initSettingMethods() {
        this.setting.album = animate => {
            animate.touchHighlightStart()
            const views = this.album.getAlbumView(),
                buttons = this.album.getAlbumButtons()
            this.kernel.UIKit.push({
                views: views,
                title: $l10n("ALBUM"),
                parent: this.widget,
                navButtons: buttons,
                hasTopOffset: true,
                disappeared: () => {
                    animate.touchHighlightEnd()
                },
            })
        }

        this.setting.clearCache = animate => {
            animate.touchHighlight()
            animate.actionStart()
            $cache.remove("switch.data")
            animate.actionDone()
        }
    }
}

module.exports = PictureSetting