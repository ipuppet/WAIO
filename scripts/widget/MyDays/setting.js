const NAME = "MyDays"
const Setting = require("../setting")

class MyDaysSetting extends Setting {
    constructor(kernel) {
        super(kernel, NAME)
        this.path = `${this.kernel.widgetDataPath}/${NAME}`
        if (!$file.exists(this.path)) {
            $file.mkdir(this.path)
        }
        this.imageMaxSize = 50 // kb
    }

    getBackgroundImage() {
        const files = $file.list(this.path)
        const len = files.length
        for (let i = 0; i < len; i++) {
            const path = `${this.path}/${files[i]}`
            if (this.setting.get("compressImage")) {
                if (files[i].indexOf("compress") > -1)
                    return path
            } else {
                if (files[i].indexOf("background") > -1)
                    return path
            }
        }
    }

    clearBackgroundImage() {
        $file.list(this.path).forEach(file => {
            if (file.indexOf("background") > -1) {
                $file.delete(`${this.path}/${file}`)
            }
        })
    }

    initSettingMethods() {
        this.setting.backgroundImage = animate => {
            animate.touchHighlightStart()
            $ui.menu({
                items: [$l10n("CHOOSE_IMAGE"), $l10n("CLEAR_IMAGE")],
                handler: (title, idx) => {
                    switch (idx) {
                        case 0:
                            animate.actionStart()
                            $photo.pick({
                                format: "data",
                                handler: resp => {
                                    if (!resp.status) {
                                        if (resp.error.description !== "canceled") $ui.toast($l10n("ERROR"))
                                        else animate.actionCancel()
                                    }
                                    if (!resp.data) return
                                    // 清除旧图片
                                    this.clearBackgroundImage()
                                    const fileName = "background" + resp.data.fileName.slice(resp.data.fileName.lastIndexOf("."))
                                    // 控制压缩图片大小
                                    const image = resp.data.image.jpg(this.imageMaxSize * 1000 / resp.data.info.size)
                                    $file.write({
                                        data: image,
                                        path: `${this.path}/compress.${fileName}`
                                    })
                                    $file.write({
                                        data: resp.data,
                                        path: `${this.path}/${fileName}`
                                    })
                                    animate.actionDone()
                                }
                            })
                            break
                        case 1:
                            this.clearBackgroundImage()
                            animate.actionDone()
                            break
                    }
                },
                finished: (cancelled) => {
                    if (cancelled)
                        animate.touchHighlightEnd()
                }
            })
        }
    }
}

module.exports = MyDaysSetting