/**
 * @typedef {import("../widget").Widget} Widget
 */

class Schedule {
    static date = new Date()

    family

    /**
     *
     * @param {Widget} widget
     */
    constructor(widget) {
        this.widget = widget
        this.setting = widget.setting
        this.colorDate = this.setting.getColor(this.setting.get("colorDate"))
        this.colorCalendar = this.setting.getColor(this.setting.get("colorCalendar"))
        this.colorReminder = this.setting.getColor(this.setting.get("colorReminder"))
        this.backgroundColor = this.setting.getColor(this.setting.get("backgroundColor"))
        this.backgroundColorDark = this.setting.getColor(this.setting.get("backgroundColorDark"))
        this.textColor = this.setting.getColor(this.setting.get("textColor"))
        this.textColorDark = this.setting.getColor(this.setting.get("textColorDark"))
        this.itemLength2x2 = this.setting.get("itemLength2x2")
        this.itemLength2x4 = this.setting.get("itemLength2x4")
        this.itemLength4x4 = this.setting.get("itemLength4x4")
        this.dataMode2x2 = this.setting.get("dataMode2x2")
        this.dataMode2x4 = this.setting.get("dataMode2x4")
        this.dataMode4x4 = this.setting.get("dataMode4x4")
        this.calendarUrlScheme = `jsbox://run?name=${$addin.current.name}&url-scheme=${$text.URLEncode("calshow://")}`
        this.reminderUrlScheme = `jsbox://run?name=${$addin.current.name}&url-scheme=${$text.URLEncode(
            "x-apple-reminderkit://"
        )}`
        switch (this.setting.get("clickEvent")) {
            case 0:
                this.urlScheme = this.setting.settingUrlScheme
                break
            case 1:
                this.urlScheme = this.reminderUrlScheme
                break
            case 2:
                this.urlScheme = this.calendarUrlScheme
                break
        }
        this.week = [
            $l10n("SUNDAY"),
            $l10n("MONDAY"),
            $l10n("TUESDAY"),
            $l10n("WEDNESDAY"),
            $l10n("THURSDAY"),
            $l10n("FRIDAY"),
            $l10n("SATURDAY")
        ]

        this.height = $widget.displaySize.height
        this.width = $widget.displaySize.width
    }

    setData(calendar, reminder) {
        this.calendar = calendar
        this.reminder = reminder
    }

    getNothingView(text) {
        return {
            type: "vstack",
            props: {
                background: $color(this.backgroundColor, this.backgroundColorDark),
                frame: {
                    maxHeight: Infinity,
                    maxWidth: Infinity
                },
                padding: 15,
                spacing: 8,
                widgetURL: this.urlScheme,
                link: this.urlScheme
            },
            views: [
                {
                    type: "vstack",
                    props: {
                        background: $color(this.backgroundColor, this.backgroundColorDark),
                        frame: {
                            maxHeight: Infinity,
                            maxWidth: Infinity,
                            alignment: $widget.alignment.leading
                        },
                        spacing: 0
                    },
                    views: [
                        {
                            type: "text",
                            props: {
                                background: $color(this.backgroundColor, this.backgroundColorDark),
                                frame: {
                                    maxHeight: Infinity,
                                    maxWidth: Infinity,
                                    alignment: $widget.alignment.leading
                                },
                                text: this.week[Schedule.date.getDay()],
                                font: $font(11),
                                color: this.colorDate
                            }
                        },
                        {
                            type: "text",
                            props: {
                                background: $color(this.backgroundColor, this.backgroundColorDark),
                                frame: {
                                    maxHeight: Infinity,
                                    maxWidth: Infinity,
                                    alignment: $widget.alignment.leading
                                },
                                text: String(Schedule.date.getDate()),
                                font: $font(33)
                            }
                        }
                    ]
                },
                {
                    type: "text",
                    props: {
                        background: $color(this.backgroundColor, this.backgroundColorDark),
                        frame: {
                            maxHeight: Infinity,
                            maxWidth: Infinity,
                            alignment: $widget.alignment.leading
                        },
                        text: text,
                        color: $color("secondaryText")
                    }
                }
            ]
        }
    }

    compareByDate(item, compare) {
        const nowDate = new Date()
        const itemDate = item.endDate ? item.endDate : item.alarmDate ? item.alarmDate : nowDate
        const compareDate = compare.endDate ? compare.endDate : compare.alarmDate ? compare.alarmDate : nowDate
        return itemDate.getTime() >= compareDate.getTime()
    }

    /**
     * 排序
     * @param {Array} arr 数组
     */
    quicksort(arr, left, right) {
        let i, j, temp, middle
        if (left > right) return
        middle = arr[left]
        i = left
        j = right
        while (i != j) {
            while (this.compareByDate(arr[j], middle) && i < j) j--
            while (this.compareByDate(middle, arr[i]) && i < j) i++
            if (i < j) {
                temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
            }
        }
        arr[left] = arr[i]
        arr[i] = middle
        this.quicksort(arr, left, i - 1)
        this.quicksort(arr, i + 1, right)
    }

    /**
     * 格式化日期时间
     * @param {Date} date
     * @param {Number} mode 模式，0：只有日期，1：只有时间
     */
    formatDate(date, mode = 0) {
        if (!date) return $l10n("NO_DATE")
        const formatInt = int => (int < 10 ? `0${int}` : String(int))
        if (mode === 0) {
            const month = date.getMonth() + 1
            date = date.getDate()
            return date === new Date().getDate() ? $l10n("TODAY") : `${month}${$l10n("MONTH")}${date}${$l10n("DATE")}`
        } else if (mode === 1) {
            return `${formatInt(date.getHours())}:${formatInt(date.getMinutes())}`
        }
    }

    getListView(list, maxItemLength = null) {
        if (maxItemLength === null) maxItemLength = this.itemLength2x2
        if (list.length === 0) return null

        let itemLength = 0
        const dateCollect = {}
        const isReminder = item => item.completed !== undefined
        const isExpire = date => (date ? date.getTime() < Date.now() : false)
        for (let item of list) {
            // 控制显示数目
            if (itemLength >= maxItemLength) break
            const dateString = isReminder(item) ? this.formatDate(item.alarmDate) : this.formatDate(item.endDate)
            if (!dateCollect[dateString]) dateCollect[dateString] = []
            itemLength++
            dateCollect[dateString].push(item)
        }

        const itemSpace = 3

        const titleFontSize = 14
        const colorBarHeight = this.widget.getContentSize($font(titleFontSize)).height
        const colorBarWidth = 2

        const dateFontSize = 12
        const dateHeight = this.widget.getContentSize($font(dateFontSize)).height
        const iconFrame = { width: dateFontSize, height: dateFontSize }

        return Object.keys(dateCollect).map(date => ({
            type: "vstack",
            props: { spacing: 0 },
            views: [
                {
                    type: "text",
                    props: {
                        text: date,
                        color: this.colorDate,
                        font: $font("bold", 12),
                        frame: {
                            maxWidth: Infinity,
                            alignment: $widget.alignment.leading,
                            height: 12
                        },
                        padding: $insets(0, itemSpace, 0, 0) // 不需要加 colorBarWidth
                    }
                },
                ...dateCollect[date].map(item => ({
                    type: "vstack",
                    props: {
                        frame: { maxWidth: Infinity },
                        spacing: 0
                    },
                    views: [
                        {
                            // 颜色条和事件名称
                            type: "hstack",
                            props: {
                                frame: {
                                    maxWidth: Infinity,
                                    maxHeight: colorBarHeight,
                                    alignment: $widget.alignment.leading
                                },
                                spacing: itemSpace
                            },
                            views: [
                                {
                                    // 颜色条
                                    type: "color",
                                    props: {
                                        frame: {
                                            width: colorBarWidth,
                                            height: colorBarHeight * 0.75
                                        },
                                        color: isReminder(item) ? this.colorReminder : this.colorCalendar
                                    }
                                },
                                {
                                    // 事件名称
                                    type: "text",
                                    props: {
                                        lineLimit: 1,
                                        text: item.title,
                                        font: $font(titleFontSize),
                                        color: $color(this.textColor, this.textColorDark),
                                        frame: {
                                            maxWidth: Infinity,
                                            alignment: $widget.alignment.leading
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            // 图标和日期
                            type: "hstack",
                            props: {
                                frame: {
                                    maxWidth: Infinity,
                                    maxHeight: dateHeight,
                                    alignment: $widget.alignment.leading
                                },
                                spacing: itemSpace,
                                padding: $insets(0, itemSpace + colorBarWidth, 0, 0)
                            },
                            views: [
                                {
                                    // 图标
                                    type: "image",
                                    props: {
                                        symbol: isReminder(item) ? "list.dash" : "calendar",
                                        color: isReminder(item) ? this.colorReminder : this.colorCalendar,
                                        resizable: true,
                                        frame: iconFrame
                                    }
                                },
                                {
                                    // 日期文字
                                    type: "text",
                                    props: {
                                        lineLimit: 1,
                                        text: isReminder(item)
                                            ? this.formatDate(item.alarmDate, 1)
                                            : (() => {
                                                  const startDate = this.formatDate(item.startDate, 1)
                                                  const endDate = this.formatDate(item.endDate, 1)
                                                  return `${startDate}-${endDate}`
                                              })(),
                                        font: $font(dateFontSize),
                                        color: $color("systemGray2")
                                    }
                                },
                                {
                                    // 已过期
                                    type: "image",
                                    props: {
                                        opacity: (() => {
                                            if (isReminder(item)) return isExpire(item.alarmDate) ? 1 : 0
                                            else return isExpire(item.endDate) ? 1 : 0
                                        })(),
                                        symbol: "exclamationmark.triangle.fill",
                                        color: $color("red"),
                                        resizable: true,
                                        frame: iconFrame
                                    }
                                }
                            ]
                        }
                    ]
                }))
            ]
        }))
    }

    /**
     * 获取视图
     */
    scheduleView(family) {
        $widget.family = family
        this.family = family

        const listView = (views, props = {}) => {
            return {
                type: "vstack",
                props: Object.assign(
                    {
                        background: $color(this.backgroundColor, this.backgroundColorDark),
                        frame: {
                            maxWidth: Infinity,
                            maxHeight: Infinity,
                            alignment: $widget.verticalAlignment.firstTextBaseline
                        },
                        padding: 15,
                        spacing: 5
                    },
                    props
                ),
                views: views
            }
        }

        if (family === this.setting.family.small) {
            let schedule, emptyText
            const dataMode = this.dataMode2x2
            if (dataMode === 0) {
                emptyText = $l10n("NO_CALENDAR")
                schedule = this.calendar
            } else if (dataMode === 1) {
                emptyText = $l10n("NO_REMINDER")
                schedule = this.reminder
            } else if (dataMode === 2) {
                emptyText = $l10n("NO_CALENDAR&REMINDER")
                // 混合日程和提醒事项
                schedule = [].concat(this.calendar).concat(this.reminder)
            }
            // 按结束日期排序
            this.quicksort(schedule, 0, schedule.length - 1)
            // 获取视图
            const view = this.getListView(schedule)
            if (null === view) {
                return this.getNothingView(emptyText)
            }
            return listView(view, {
                widgetURL: this.urlScheme,
                link: this.urlScheme
            })
        } else if (family === this.setting.family.medium || family === this.setting.family.large) {
            let dataMode, eachCont, leftView, rightView, leftScheme, rightScheme
            if (family === this.setting.family.medium) {
                dataMode = this.dataMode2x4
                eachCont = this.itemLength2x4
            } else {
                dataMode = this.dataMode4x4
                eachCont = this.itemLength4x4
            }
            if (dataMode === 0) {
                // LEFT_AND_RIGHT
                // 按结束日期排序
                this.quicksort(this.calendar, 0, this.calendar.length - 1)
                this.quicksort(this.reminder, 0, this.reminder.length - 1)
                leftView = this.getListView(this.calendar, eachCont) ?? [this.getNothingView($l10n("NO_CALENDAR"))]
                rightView = this.getListView(this.reminder, eachCont) ?? [this.getNothingView($l10n("NO_REMINDER"))]
                // UrlScheme
                leftScheme = this.calendarUrlScheme
                rightScheme = this.reminderUrlScheme
            } else {
                // MIXED_MODE
                // 混合日程和提醒事项
                const schedule = [].concat(this.calendar).concat(this.reminder)
                // 空列表则直接返回
                if (schedule.length === 0) {
                    return this.getNothingView($l10n("NO_CALENDAR&REMINDER"))
                }
                // 按结束日期排序
                this.quicksort(schedule, 0, schedule.length - 1)
                // 获取视图
                leftView = this.getListView(schedule.slice(0, eachCont), eachCont)
                rightView = this.getListView(schedule.slice(eachCont, eachCont * 2), eachCont)
                // UrlScheme
                leftScheme = rightScheme = this.urlScheme
            }
            return {
                type: "hstack",
                props: {
                    frame: {
                        maxWidth: Infinity,
                        maxHeight: Infinity,
                        alignment: $widget.verticalAlignment.firstTextBaseline
                    },
                    spacing: 0
                },
                views: [listView(leftView, { link: leftScheme }), listView(rightView, { link: rightScheme })]
            }
        } else {
            // TODO 超大 widget
            return this.getNothingView("Not currently supported")
        }
    }
}

module.exports = Schedule
