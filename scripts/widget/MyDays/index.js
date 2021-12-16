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
        this.weekXWXD = this.setting.get("week.xWxD") // 0: 显示天数, 1: 显示周数
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

    view2x2() {
        const myday = this.myday
        if (!myday) return {
            type: "text",
            props: { text: $l10n("NONE") }
        }
        const remainingDays = this.dateSpan(myday.date)
        const getContent = (content, props = {}) => ({
            type: "text",
            props: Object.assign({
                text: content,
                font: $font(this.dateFontSize),
                color: remainingDays >= 0 ? $color(this.dateColor, this.dateColorDark) : $color(this.overdueColor, this.overdueColorDark),
                padding: 0,
                frame: {
                    alignment: $widget.alignment.topLeading,
                    maxWidth: Infinity,
                    maxHeight: Infinity
                }
            }, props)
        })
        const mainView = []
        if (this.displayMode) { // 周数
            const weekInfo = this.getWeekInfo(remainingDays)
            if (this.weekXWXD) {
                mainView.push({
                    type: "hstack",
                    props: {
                        padding: 0,
                        spacing: 0,
                        frame: {
                            alignment: $widget.alignment.topLeading,
                            maxWidth: Infinity,
                            maxHeight: Infinity
                        }
                    },
                    views: [
                        getContent(weekInfo.week, {
                            frame: {
                                alignment: $widget.alignment.topTrailing,
                                maxWidth: this.dateFontSize,
                                maxHeight: Infinity
                            }
                        }),
                        getContent(weekInfo.day, {
                            font: $font(this.dateFontSize / 2),
                            offset: $point(5, this.dateFontSize - this.dateFontSize / 2)
                        })
                    ]
                })
            } else {
                mainView.push(getContent(weekInfo.week))
            }
        } else { //天数
            mainView.push(getContent(this.dateSpanToString(remainingDays)))
        }
        let view = {
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
            views: mainView.concat([
                {
                    type: "text",
                    props: {
                        text: myday.title,
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
                        text: myday.describe,
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
                        text: new Date(myday.date).toLocaleDateString(),
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
            render: () => {
                const view = this.view2x2()
                this.printTimeConsuming()
                return view
            }
        })
    }
}

module.exports = {
    Widget: MyDaysWidget
}