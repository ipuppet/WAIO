class Schedule {
    constructor(kernel, setting) {
        this.kernel = kernel
        this.setting = setting
        this.timeSpan = this.setting.get("timeSpan")
        this.colorDate = this.setting.get("colorDate")
        this.colorCalendar = this.setting.get("colorCalendar")
        this.colorReminder = this.setting.get("colorReminder")
        this.itemLength = this.setting.get("itemLength")
        this.calendarUrlScheme = `jsbox://run?name=${this.kernel.name}&url-scheme=calshow://`
        this.reminderUrlScheme = `jsbox://run?name=${this.kernel.name}&url-scheme=x-apple-reminderkit://`
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
    }

    async getCalendar(startDate, hours, nowDate) {
        if (nowDate === undefined) nowDate = new Date()
        const res = []
        const calendar = await $calendar.fetch({
            startDate: startDate,
            hours: hours
        })
        // 未过期日程
        calendar.events.forEach(item => {
            if (item.endDate >= nowDate) {
                res.push(item)
            }
        })
        return res
    }

    async getReminder(startDate, hours) {
        const res = []
        const reminder = await $reminder.fetch({
            startDate: startDate,
            hours: hours
        })
        // 未完成提醒事项
        reminder.events.forEach(item => {
            if (!item.completed) {
                res.push(item)
            }
        })
        return res
    }

    async getSchedule() {
        const nowDate = new Date()
        const startDate = new Date().setDate(nowDate.getDate() - parseInt(this.timeSpan / 2))
        const hours = this.timeSpan * 24
        const calendar = await this.getCalendar(startDate, hours, nowDate)
        const reminder = await this.getReminder(startDate, hours)
        // 混合日程和提醒事项
        const schedule = [].concat(calendar).concat(reminder)
        // 按结束日期排序
        this.quicksort(schedule, 0, schedule.length - 1, (item, compare) => {
            const itemDate = item.endDate ? item.endDate : item.alarmDate ? item.alarmDate : nowDate
            const compareDate = compare.endDate ? compare.endDate : compare.alarmDate ? compare.alarmDate : nowDate
            return itemDate.getTime() >= compareDate.getTime()
        })
        return schedule
    }

    async getScheduleApart() {
        const nowDate = new Date()
        const startDate = new Date().setDate(nowDate.getDate() - parseInt(this.timeSpan / 2))
        const hours = this.timeSpan * 24
        const calendar = await this.getCalendar(startDate, hours, nowDate)
        const reminder = await this.getReminder(startDate, hours)
        // 按结束日期排序
        this.quicksort(calendar, 0, calendar.length - 1, (item, compare) => {
            const itemDate = item.endDate ? item.endDate : item.alarmDate ? item.alarmDate : nowDate
            const compareDate = compare.endDate ? compare.endDate : compare.alarmDate ? compare.alarmDate : nowDate
            return itemDate.getTime() >= compareDate.getTime()
        })
        this.quicksort(reminder, 0, reminder.length - 1, (item, compare) => {
            const itemDate = item.endDate ? item.endDate : item.alarmDate ? item.alarmDate : nowDate
            const compareDate = compare.endDate ? compare.endDate : compare.alarmDate ? compare.alarmDate : nowDate
            return itemDate.getTime() >= compareDate.getTime()
        })
        return { calendar: calendar, reminder: reminder }
    }

    /**
     * 排序
     * @param {Array} arr 数组
     * @param {CallableFunction} compare 比较大小
     */
    quicksort(arr, left, right, compare) {
        let i, j, temp, middle
        if (left > right) return
        middle = arr[left]
        i = left
        j = right
        while (i != j) {
            while (compare(arr[j], middle) && i < j) j--
            while (compare(middle, arr[i]) && i < j) i++
            if (i < j) {
                temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
            }
        }
        arr[left] = arr[i]
        arr[i] = middle
        this.quicksort(arr, left, i - 1, compare)
        this.quicksort(arr, i + 1, right, compare)
    }

    /**
     * 格式化日期时间
     * @param {Date} date 
     * @param {Number} mode 模式，0：只有日期，1：只有时间
     */
    formatDate(date, mode = 0) {
        if (!date) return $l10n("NO_DATE")
        const formatInt = int => int < 10 ? `0${int}` : String(int)
        if (mode === 0) {
            const month = date.getMonth() + 1
            date = date.getDate()
            return date === new Date().getDate() ? $l10n("TODAY") : `${month}${$l10n("MONTH")}${date}${$l10n("DATE")}`
        } else if (mode === 1) {
            return `${formatInt(date.getHours())}:${formatInt(date.getMinutes())}`
        }

    }

    getListView(list) {
        if (list.length === 0) return null
        let itemLength = 0, dateCollect = {}
        const isReminder = item => item.completed !== undefined
        const isExpire = date => date ? date.getTime() < new Date().getTime() : false
        for (let item of list) {
            // 控制显示数目
            if (itemLength >= this.itemLength) break
            const dateString = isReminder(item) ? this.formatDate(item.alarmDate) : this.formatDate(item.endDate)
            if (!dateCollect[dateString])
                dateCollect[dateString] = []
            itemLength++
            dateCollect[dateString].push(item)
        }
        const views = []
        for (let date of Object.keys(dateCollect)) {
            const view = []
            for (let item of dateCollect[date]) {
                view.push({
                    type: "vstack",
                    props: {
                        frame: { maxWidth: Infinity },
                        padding: $insets(0, 5, 3, 0),
                        // TODO 单边边框
                        /* border: {
                            color: isReminder(item) ? $color(this.colorReminder) : $color(this.colorCalendar),
                            width: 2
                        }, */
                        spacing: 0
                    },
                    views: [
                        {// 标题
                            type: "text",
                            props: {
                                lineLimit: 1,
                                text: item.title,
                                font: $font(14),
                                frame: {
                                    maxWidth: Infinity,
                                    alignment: $widget.alignment.leading
                                },
                                padding: $insets(0, 0, 2, 0)
                            }
                        },
                        {// 图标和日期
                            type: "hstack",
                            props: {
                                frame: {
                                    maxWidth: Infinity,
                                    alignment: $widget.alignment.leading,
                                },
                                spacing: 5
                            },
                            views: [
                                {
                                    type: "image",
                                    props: {
                                        symbol: isReminder(item) ? "list.dash" : "calendar",
                                        frame: {
                                            width: 12,
                                            height: 12
                                        },
                                        color: isReminder(item) ? $color(this.colorReminder) : $color(this.colorCalendar),
                                        resizable: true
                                    }
                                },
                                {
                                    type: "text",
                                    props: {
                                        lineLimit: 1,
                                        text: isReminder(item) ? this.formatDate(item.alarmDate, 1) : (() => {
                                            const startDate = this.formatDate(item.startDate, 1)
                                            const endDate = this.formatDate(item.endDate, 1)
                                            return `${startDate}-${endDate}`
                                        })(),
                                        font: $font(12),
                                        color: $color("systemGray2"),
                                        frame: { height: 10 }
                                    }
                                },
                                { // 已过期
                                    type: "image",
                                    props: {
                                        opacity: (() => {
                                            if (isReminder(item)) return isExpire(item.alarmDate) ? 1 : 0
                                            else return isExpire(item.endDate) ? 1 : 0
                                        })(),
                                        symbol: "exclamationmark.triangle.fill",
                                        color: $color("red"),
                                        frame: {
                                            width: 12,
                                            height: 12
                                        },
                                        resizable: true
                                    }
                                }
                            ]
                        }
                    ]
                })
            }
            views.push({
                type: "vstack",
                props: {
                    spacing: 5
                },
                views: [
                    {
                        type: "text",
                        props: {
                            text: date,
                            color: $color(this.colorDate),
                            font: $font("bold", 12),
                            frame: {
                                maxWidth: Infinity,
                                alignment: $widget.alignment.leading,
                                height: 10,
                            },
                            padding: $insets(-5, 5 + 2, -2, 0) // +2为竖线颜色条宽度
                        }
                    }
                ].concat(view)
            })
        }
        return views
    }

    /**
     * 获取视图
     */
    async scheduleView(family) {
        const nothingView = text => {
            return {
                type: "text",
                props: {
                    frame: {
                        maxHeight: Infinity,
                        maxWidth: Infinity,
                        alignment: $widget.alignment.top
                    },
                    text: text,
                    widgetURL: this.urlScheme
                }
            }
        }
        const listView = (views, props = {}) => {
            return {
                type: "vstack",
                props: Object.assign({
                    frame: {
                        maxHeight: Infinity,
                        alignment: $widget.verticalAlignment.firstTextBaseline
                    },
                    padding: 15,
                    spacing: 15
                }, props),
                views: views
            }
        }
        switch (family) {
            case this.setting.family.small:
                const view = this.getListView(await this.getSchedule())
                if (null === view) return nothingView($l10n("NO_CALENDAR&REMINDER"))
                return listView(view, { widgetURL: this.urlScheme })
            case this.setting.family.medium:
                // 获取数据
                const data = await this.getScheduleApart()
                // 获取视图
                const calendarView = this.getListView(data.calendar) ?? [nothingView($l10n("NO_CALENDAR"))]
                const reminderView = this.getListView(data.reminder) ?? [nothingView($l10n("NO_REMINDER"))]
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
                    views: [
                        listView(calendarView, { link: this.calendarUrlScheme }),
                        listView(reminderView, { link: this.reminderUrlScheme })
                    ]
                }
        }
    }
}

module.exports = Schedule