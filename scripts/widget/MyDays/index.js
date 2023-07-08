const Widget = require("../widget")
const MyDaysSetting = require("./setting")

class MyDaysWidget extends Widget {
    constructor(kernel) {
        super(kernel, new MyDaysSetting(kernel))
        this.myday = {
            title: this.setting.get("title"),
            describe: this.setting.get("describe"),
            date: this.setting.get("date") === 0 ? Date.now() : this.setting.get("date")
        }
        this.remainingDays = this.dateSpan(this.myday.date)

        // style
        this.fullWeekUnit = true // 是否显示完整周单位
        this.titleFontSize = 16
        this.infoFontSize = 12
        this.fullDateFontSize = 12
        this.font = "Helvetica Neue"

        this.dateFontSize = this.setting.get("dateFontSize")
        this.dateColor = this.setting.get("dateColor")
        this.dateColorDark = this.setting.get("dateColorDark")
        this.infoColor = this.setting.get("infoColor")
        this.infoColorDark = this.setting.get("infoColorDark")
        this.backgroundColor = this.setting.get("backgroundColor")
        this.backgroundColorDark = this.setting.get("backgroundColorDark")
        this.overdueColor = this.setting.get("overdueColor")
        this.overdueColorDark = this.setting.get("overdueColorDark")
        this.backgroundImage = this.setting.getBackgroundImage()
        this.isImageBackground = $file.exists(this.backgroundImage)
        this.showMinus = this.setting.get("showMinus")
        this.displayMode = this.setting.get("displayMode") // 0: 显示天数, 1: 显示周数
    }

    initStyle() {
        if (this.join) {
            // join 模式
            this.height = $widget.displaySize.height
            this.width = this.height
        } else {
            this.width = $widget.displaySize.width
            this.height = $widget.displaySize.height
        }
    }

    dateSpan(date) {
        if (typeof date === "number") date = new Date(date)
        // 重置时间
        date.setHours(0, 0, 0, 0)
        const span = (date.getTime() - Date.now()) / 1000 / 3600 / 24
        return Math.ceil(span)
    }

    dateSpanToString(span) {
        switch (span) {
            case 0:
                return $l10n("TODAY")
            case 1:
                return $l10n("TOMORROW")
            case -1:
                return $l10n("YESTERDAY")
            default:
                return String(this.showMinus ? span : Math.abs(span))
        }
    }

    getWeekInfo(days) {
        days = this.showMinus ? days : Math.abs(days)
        return {
            week: String(Math.trunc(days / 7)),
            day: String(Math.trunc(days % 7))
        }
    }

    mainContentTemplate(content, props = {}) {
        return {
            type: "text",
            props: Object.assign(
                {
                    text: content,
                    font: $font(this.font, this.dateFontSize),
                    color:
                        this.remainingDays >= 0
                            ? $color(this.dateColor, this.dateColorDark)
                            : $color(this.overdueColor, this.overdueColorDark),
                    padding: 0,
                    lineLimit: 1,
                    minimumScaleFactor: 0.6,
                    frame: {
                        alignment: $widget.alignment.topLeading,
                        maxWidth: Infinity,
                        maxHeight: Infinity
                    }
                },
                props
            )
        }
    }

    weekTemplate(weekInfo) {
        let view = {}
        switch (this.setting.get("week.displayStyle")) {
            case 0: // xW + xD
                view = {
                    type: "hstack",
                    props: {
                        padding: 0,
                        spacing: 0,
                        alignment: $widget.verticalAlignment.top
                    },
                    views: [
                        this.mainContentTemplate(weekInfo.week, { frame: {} }),
                        this.mainContentTemplate(weekInfo.day, {
                            font: $font(this.font, this.dateFontSize / 2),
                            offset: $point(5, this.dateFontSize - this.dateFontSize / 2)
                        })
                    ]
                }
                break
            case 1: // 只显示周
                view = this.mainContentTemplate(weekInfo.week)
                break
            case 2: // 显示小数
                view = this.mainContentTemplate(`${weekInfo.week}.${weekInfo.day}`)
                break
            case 3: // 显示小数 + 单位
                const unit = this.fullWeekUnit ? $l10n("UNIT_WEEK") : $l10n("UNIT_WEEK_2X2")
                view = this.mainContentTemplate(`${weekInfo.week}.${weekInfo.day} ${unit}`)
                break
        }
        return view
    }

    fullDateTemplate(props = {}) {
        return {
            type: "text",
            props: Object.assign(
                {
                    text: new Date(this.myday.date).toLocaleDateString(),
                    font: $font(this.font, this.fullDateFontSize),
                    color: $color(this.infoColor, this.infoColorDark),
                    frame: {
                        alignment: $widget.alignment.bottomTrailing,
                        maxWidth: Infinity
                    }
                },
                props
            )
        }
    }

    infoTemplate() {
        return [
            {
                type: "text",
                props: {
                    text: this.myday.title,
                    font: $font(this.font, this.titleFontSize),
                    color: $color(this.infoColor, this.infoColorDark),
                    frame: {
                        alignment: $widget.alignment.bottomTrailing,
                        maxWidth: Infinity
                    }
                }
            },
            {
                type: "text",
                props: {
                    text: this.myday.describe,
                    font: $font(this.font, this.infoFontSize),
                    color: $color(this.infoColor, this.infoColorDark),
                    frame: {
                        alignment: $widget.alignment.bottomTrailing,
                        maxWidth: Infinity
                    }
                }
            }
        ]
    }

    view() {
        if (!this.myday) {
            return {
                type: "text",
                props: { text: $l10n("NONE") }
            }
        }
        this.initStyle()
        // this.displayMode 0: 天数, 1: 周数
        const mainView = this.displayMode
            ? this.weekTemplate(this.getWeekInfo(this.remainingDays))
            : this.mainContentTemplate(this.dateSpanToString(this.remainingDays))
        const view = {
            type: "vstack",
            props: {
                alignment: $widget.verticalAlignment.center,
                spacing: 0,
                padding: 10,
                background: $color(this.backgroundColor, this.backgroundColorDark),
                frame: {
                    maxWidth: Infinity,
                    maxHeight: Infinity
                },
                link: this.setting.settingUrlScheme,
                widgetURL: this.setting.settingUrlScheme
            },
            views: [mainView, ...this.infoTemplate(), this.fullDateTemplate()]
        }
        if (this.isImageBackground) {
            return {
                type: "vstack",
                props: {
                    alignment: $widget.verticalAlignment.center,
                    spacing: 0,
                    padding: 0,
                    background: {
                        type: "image",
                        props: {
                            image: $image(this.backgroundImage),
                            resizable: true,
                            scaledToFill: true
                        }
                    },
                    frame: {
                        maxWidth: Infinity,
                        maxHeight: Infinity
                    }
                },
                views: [view]
            }
        } else {
            return view
        }
    }

    getSmallView() {
        this.fullWeekUnit = false
        $widget.family = this.setting.family.small
        return this.view()
    }

    getMediumView() {
        this.fullWeekUnit = true
        $widget.family = this.setting.family.medium
        return this.view()
    }

    getLargeView() {
        this.fullWeekUnit = true
        $widget.family = this.setting.family.large
        return this.view()
    }

    getAccessoryRectangular() {
        if (!this.myday) {
            return {
                type: "text",
                props: { text: $l10n("NONE") }
            }
        }
        this.initStyle()
        this.fullWeekUnit = false
        this.dateFontHeight = this.height / 2
        this.dateFontSize = this.getFontSizeByHeight(this.dateFontHeight, this.font)
        this.titleFontSize = this.getFontSizeByHeight((this.height - this.dateFontHeight) / 2, this.font)
        this.infoFontSize = this.titleFontSize
        this.fullDateFontSize = 10

        const mainView = this.displayMode
            ? this.weekTemplate(this.getWeekInfo(this.remainingDays))
            : this.mainContentTemplate(this.dateSpanToString(this.remainingDays))

        const infoView = this.infoTemplate()
        const dateView = this.fullDateTemplate({
            frame: {
                alignment: $widget.alignment.topTrailing,
                maxHeight: Infinity
            }
        })
        return {
            type: "vstack",
            props: {
                spacing: 0,
                padding: 0,
                frame: {
                    maxWidth: this.width,
                    maxHeight: this.height
                },
                link: this.setting.settingUrlScheme,
                widgetURL: this.setting.settingUrlScheme
            },
            views: [
                {
                    type: "hstack",
                    props: { padding: 0 },
                    views: [mainView, dateView]
                },
                ...infoView
            ]
        }
    }

    render() {
        // 每天0点切换
        const midnight = new Date()
        midnight.setHours(0, 0, 0, 0)
        const expireDate = new Date(midnight.getTime() + 60 * 60 * 24 * 1000)
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
            render: ctx => {
                let view
                switch (ctx.family) {
                    case this.setting.family.small:
                        view = this.getSmallView()
                        break
                    case this.setting.family.medium:
                        view = this.getMediumView()
                        break
                    case this.setting.family.large:
                        view = this.getLargeView()
                        break
                    case this.setting.family.accessoryRectangular:
                        view = this.getAccessoryRectangular()
                        break
                    default:
                        view = this.errorView
                }
                this.printTimeConsuming()
                return view
            }
        })
    }
}

module.exports = {
    Widget: MyDaysWidget
}
