const NAME = "Album"
const BaseSetting = require("../setting")
const Album = require("./album")

class PictureSetting extends BaseSetting {
    constructor(kernel) {
        super(kernel, NAME)
        this.album = new Album(this.kernel, this)
    }

    initSettingMethods() {
        this.setting.method.album = animate => {
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

        this.setting.method.clearCache = animate => {
            animate.touchHighlight()
            animate.actionStart()
            $cache.remove("switch.data")
            animate.actionDone()
        }
    }
}

module.exports = PictureSetting