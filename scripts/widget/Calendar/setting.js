const NAME = "Calendar"
const WidgetSetting = require("../setting")
const { UIKit } = require("../../libs/easy-jsbox")

class CalendarSetting extends WidgetSetting {
    constructor(kernel) {
        super(kernel, NAME)
        this.path = `${this.kernel.widgetDataPath}/${NAME}`
        if (!$file.exists(this.path)) {
            $file.mkdir(this.path)
        }
        this.holidayPath = `${this.path}/holiday.json`
        // 自动获取节假日信息，有效期7天
        this.getHoliday(1000 * 60 * 60 * 24 * 7)
    }

    /**
     * 获取节假日信息
     * @param {Number} life 缓存有效期，单位ms
     */
    async getHoliday(life) {
        const getHolidayAction = () => {
            const year = new Date().getFullYear()
            $http.get({
                url: `http://timor.tech/api/holiday/year/${year}/`,
                handler: response => {
                    if (response.error) {
                        this.kernel.logger.info(response.error)
                        $ui.error(response.error)
                        return
                    }
                    if (response.data.code !== 0) {
                        $ui.error($l10n("HOLIDAY_API_ERROR"))
                        return
                    }
                    const content = {
                        holiday: response.data.holiday,
                        date: Date.now()
                    }
                    $file.write({
                        data: $data({ string: JSON.stringify(content) }),
                        path: this.holidayPath
                    })
                }
            })
        }
        if ($file.exists(this.holidayPath)) {
            const holiday = JSON.parse($file.read(this.holidayPath).string)
            if (Date.now() - holiday.date > life) {
                getHolidayAction()
            }
        } else {
            getHolidayAction()
        }
    }

    getBackgroundImage() {
        let path = null
        $file.list(this.path).forEach(file => {
            if (file.slice(0, file.indexOf(".")) === "background") {
                if (path === null) {
                    path = `${this.path}/${file}`
                } else if (typeof path === "string") {
                    path = [path]
                    path.push(file)
                } else {
                    path.push(file)
                }
                return
            }
        })
        return path
    }

    clearBackgroundImage() {
        $file.list(this.path).forEach(file => {
            if (file.slice(0, file.indexOf(".")) === "background") {
                $file.delete(`${this.path}/${file}`)
            }
        })
    }

    initSettingMethods() {
        this.setting.method.clearHoliday = animate => {
            animate.start()
            let style = {}
            if ($alertActionType) {
                style = { style: $alertActionType.destructive }
            }
            $ui.alert({
                title: $l10n("CLEAR_HOLIDAY_DATA"),
                actions: [
                    Object.assign(
                        {
                            title: $l10n("CLEAR"),
                            handler: () => {
                                $file.delete(this.holidayPath)
                                animate.done()
                            }
                        },
                        style
                    ),
                    {
                        title: $l10n("CANCEL"),
                        handler: () => {
                            animate.cancel()
                        }
                    }
                ]
            })
        }

        /**
         * 用于设置页面手动获取节假日信息
         */
        this.setting.method.getHoliday = async animate => {
            animate.start()
            const saveHolidayAction = () => {
                const year = new Date().getFullYear()
                $http.get({
                    url: `http://timor.tech/api/holiday/year/${year}/`,
                    handler: response => {
                        if (response.error) {
                            $ui.error(response.error)
                            animate.cancel()
                            return
                        }
                        if (response.data.code !== 0) {
                            $ui.error($l10n("HOLIDAY_API_ERROR"))
                            animate.cancel()
                            return
                        }
                        const content = {
                            holiday: response.data.holiday,
                            date: Date.now()
                        }
                        $file.write({
                            data: $data({ string: JSON.stringify(content) }),
                            path: this.holidayPath
                        })
                        animate.done()
                    }
                })
            }
            if ($file.exists(this.holidayPath)) {
                $ui.alert({
                    title: $l10n("HOLIDAY_ALREADY_EXISTS"),
                    message: $l10n("NO_NEED_TO_OBTAIN_MANUALLY"),
                    actions: [
                        {
                            title: $l10n("OK"),
                            handler: saveHolidayAction
                        },
                        {
                            title: $l10n("CANCEL"),
                            handler: () => {
                                animate.cancel()
                            }
                        }
                    ]
                })
            } else {
                saveHolidayAction()
            }
            return
        }

        this.setting.method.backgroundImage = animate => {
            $ui.menu({
                items: [$l10n("CHOOSE_IMAGE"), $l10n("CLEAR_IMAGE")],
                handler: (title, idx) => {
                    switch (idx) {
                        case 0:
                            animate.start()
                            $photo.pick({
                                format: "data",
                                handler: resp => {
                                    if (!resp.status) {
                                        if (resp.error.description !== "canceled") $ui.toast($l10n("ERROR"))
                                        else animate.cancel()
                                    }
                                    if (!resp.data) return
                                    // 清除旧图片
                                    this.clearBackgroundImage()
                                    const fileName =
                                        "background" + resp.data.fileName.slice(resp.data.fileName.lastIndexOf("."))
                                    const image = UIKit.compressImage(resp.data.image)
                                    $file.write({
                                        data: image.png,
                                        path: `${this.path}/${fileName}`
                                    })
                                    animate.done()
                                }
                            })
                            break
                        case 1:
                            this.clearBackgroundImage()
                            animate.done()
                            break
                    }
                }
            })
        }
    }
}

module.exports = CalendarSetting
