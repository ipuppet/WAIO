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
        this.dateFontSize = this.setting.get("dateFontSize")
        this.dateColor = this.setting.getColor(this.setting.get("dateColor"))
        this.dateColorDark = this.setting.getColor(this.setting.get("dateColorDark"))
        this.infoColor = this.setting.getColor(this.setting.get("infoColor"))
        this.infoColorDark = this.setting.getColor(this.setting.get("infoColorDark"))
        this.backgroundColor = this.setting.getColor(this.setting.get("backgroundColor"))
        this.backgroundColorDark = this.setting.getColor(this.setting.get("backgroundColorDark"))
        this.overdueColor = this.setting.getColor(this.setting.get("overdueColor"))
        this.overdueColorDark = this.setting.getColor(this.setting.get("overdueColorDark"))
        this.backgroundImage = this.setting.getBackgroundImage()
        this.isImageBackground = $file.exists(this.backgroundImage)
        this.showMinus = this.setting.get("showMinus")
        this.displayMode = this.setting.get("displayMode") // 0: 显示天数, 1: 显示周数
        this.weekDisplayStyle = this.setting.get("week.displayStyle") // 周样式 0: index, 1: title
    }

    dateSpan(date) {
        if (typeof date === "number") date = new Date(date)
        // 重置时间
        date.setHours(0, 0, 0, 0)
        const span = (date.getTime() - (Date.now())) / 1000 / 3600 / 24
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
            week: String(Number(days / 7).toFixed(0)),
            day: String(Number(days % 7).toFixed(0))
        }
    }

    mainContentTemplate(content, props = {}) {
        return {
            type: "text",
            props: Object.assign({
                text: content,
                font: $font(this.dateFontSize),
                color: this.remainingDays >= 0
                    ? $color(this.dateColor, this.dateColorDark)
                    : $color(this.overdueColor, this.overdueColorDark),
                padding: 0,
                frame: {
                    alignment: $widget.alignment.topLeading,
                    maxWidth: Infinity,
                    maxHeight: Infinity
                }
            }, props)
        }
    }

    weekTemplate(weekInfo, family) {
        let view = {}
        switch (this.weekDisplayStyle[0]) {
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
                            font: $font(this.dateFontSize / 2),
                            offset: $point(5, this.dateFontSize - this.dateFontSize / 2)
                        })
                    ]
                }
                break;
            case 1: // 只显示周
                view = this.mainContentTemplate(weekInfo.week)
                break;
            case 2: // 显示小数
                view = this.mainContentTemplate(`${weekInfo.week}.${weekInfo.day}`)
                break;
            case 3: // 显示小数 + 单位
                const unit = family === this.setting.family.small ? $l10n("UNIT_WEEK_2X2") : $l10n("UNIT_WEEK")
                view = this.mainContentTemplate(`${weekInfo.week}.${weekInfo.day} ${unit}`)
                break;
        }
        return view
    }

    view2x2() {
        return this.view(this.setting.family.small)
    }

    view2x4() {
        return this.view(this.setting.family.medium)
    }

    view4x4() {
        return this.view(this.setting.family.large)
    }

    view(family) {
        if (!this.myday) return {
            type: "text",
            props: { text: $l10n("NONE") }
        }
        let mainView = {}
        if (this.displayMode) { // 周数
            const weekInfo = this.getWeekInfo(this.remainingDays)
            mainView = this.weekTemplate(weekInfo, family)
        } else { //天数
            mainView = this.mainContentTemplate(this.dateSpanToString(this.remainingDays))
        }
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
            views: [mainView].concat([
                {
                    type: "text",
                    props: {
                        text: this.myday.title,
                        font: $font(16),
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
                        font: $font(12),
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
                        text: new Date(this.myday.date).toLocaleDateString(),
                        font: $font(12),
                        color: $color(this.infoColor, this.infoColorDark),
                        frame: {
                            alignment: $widget.alignment.bottomTrailing,
                            maxWidth: Infinity
                        }
                    }
                }
            ])
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
        } else return view
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
                const view = this.view(ctx.family)
                this.printTimeConsuming()
                return view
            }
        })
    }
}

module.exports = {
    Widget: MyDaysWidget
}