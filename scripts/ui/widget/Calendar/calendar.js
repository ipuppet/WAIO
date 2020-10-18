class Calendar {
    constructor(kernel, setting) {
        this.kernel = kernel
        this.setting = setting
        this.sloarToLunar = this.kernel.registerPlugin("sloarToLunar")
        this.onlyCurrentMonth = this.setting.get("onlyCurrentMonth")
        this.colorTone = this.setting.get("colorTone")
        this.hasHoliday = this.setting.get("holiday")
        this.holidayColor = this.setting.get("holidayColor")
        this.holidayNoRestColor = this.setting.get("holidayNoRestColor")// 调休
        if (this.hasHoliday && $file.exists(this.setting.holidayPath)) {// 假期信息
            this.holiday = JSON.parse($file.read(this.setting.holidayPath).string).holiday
        }
        this.monthDisplayMode = this.setting.get("monthDisplayMode")// 月份显示模式
        this.widget2x2TitleYear = this.setting.get("small.title.year")// 2x2标题是否显示年
        this.firstDayOfWeek = this.setting.get("firstDayOfWeek")// 每周第一天
        this.lunar2x2 = this.setting.get("small.lunar")// 2x2是否显示农历
    }

    localizedWeek(index) {
        const week = [
            $l10n("SUNDAY"),
            $l10n("MONDAY"),
            $l10n("TUESDAY"),
            $l10n("WEDNESDAY"),
            $l10n("THURSDAY"),
            $l10n("FRIDAY"),
            $l10n("SATURDAY")
        ]
        if (this.firstDayOfWeek === 1) {
            index += 1
            if (index > 6) index = 0
        }
        return week[index]
    }

    localizedMonth(index) {
        const mode = this.monthDisplayMode === 0 ? "_C" : "_N"
        const month = [
            $l10n("JANUARY" + mode),
            $l10n("FEBRUARY" + mode),
            $l10n("MARCH" + mode),
            $l10n("APRIL" + mode),
            $l10n("MAY" + mode),
            $l10n("JUNE" + mode),
            $l10n("JULY" + mode),
            $l10n("AUGUST" + mode),
            $l10n("SEPTEMBER" + mode),
            $l10n("OCTOBER" + mode),
            $l10n("NOVEMBER" + mode),
            $l10n("DECEMBER" + mode)
        ]
        return month[index] + $l10n("MONTH")
    }

    isHoliday(year, month, date) {
        /**
         * 数字补0
         */
        const toString = number => {
            if (number < 10) {
                number = "0" + number
            }
            return String(number)
        }
        if (!this.holiday) {
            return false
        }
        let key = toString(month) + "-" + toString(date)
        let holiday = this.holiday[key]
        if (holiday && holiday.date === year + "-" + key) {
            return holiday
        }
        return false
    }

    getCalendar(lunar) {
        let dateInstance = new Date()
        let year = dateInstance.getFullYear()
        let month = dateInstance.getMonth()
        let dateNow = dateInstance.getDate() // 当前日期
        let dates = new Date(year, month + 1, 0).getDate() // 总天数
        let firstDay = new Date(year, month, 1).getDay() // 本月第一天是周几
        let lastMonthDates = new Date(year, month, 0).getDate() // 上个月总天数
        let nextMonth = 1 // 下个月的日期计数器
        lastMonthDates -= 7 - firstDay // 补齐本月开始前的空位
        if (this.firstDayOfWeek === 1) { // 设置中设定每周第一天是周几
            firstDay -= 1
            if (firstDay < 0) firstDay = 6
            lastMonthDates++ // 上周补到这周的天数少一天，加上一才会少一天
        }
        let calendar = []
        let date = 1 // 日期计数器
        for (let i = 0; i < 6; i++) { // 循环6次，每个月显示6周
            let week = []
            for (let day = 0; day <= 6; day++) {
                // 当每周第一天为0时，代表前方无偏移量
                if (day === firstDay && firstDay !== 0) firstDay = 0
                let formatDay = this.firstDayOfWeek === 1 ? day + 1 : day // 格式化每周第一天
                if (formatDay > 6) formatDay = 0 // 格式化每周第一天 end
                // 只有当firstDay为0时才到本月第一天
                let formatDate
                // 是否仅显示本月
                if (this.onlyCurrentMonth) {
                    if (firstDay === 0) {
                        // 判断是否到达最后一天
                        formatDate = date > dates ? 0 : {
                            month: month,
                            date: date,
                            day: formatDay
                        }
                    } else {
                        formatDate = 0
                    }
                } else {
                    if (firstDay === 0) {
                        // 判断是否到达最后一天
                        formatDate = date > dates ? {
                            month: month + 1,
                            date: nextMonth++,
                            day: formatDay
                        } : {
                                month: month,
                                date: date,
                                day: formatDay
                            }
                    } else {
                        // 补齐第一周前面空缺的日期
                        formatDate = {
                            month: month - 1,
                            date: lastMonthDates++,
                            day: formatDay
                        }
                    }
                }
                // 农历
                if (date === dateNow) {
                    // 保存农历信息
                    this.lunar = this.sloarToLunar(year, month + 1, date)
                }
                if (lunar && formatDate !== 0) {
                    // month是0-11，故+1
                    formatDate["lunar"] = date === dateNow ? this.lunar : this.sloarToLunar(
                        year, formatDate.month + 1, formatDate.date
                    )
                }
                // 节假日
                if (this.hasHoliday && formatDate !== 0) { // 判断是否需要展示节假日
                    // month是0-11，故+1
                    let holiday = this.isHoliday(year, formatDate.month + 1, formatDate.date)
                    if (holiday) {
                        formatDate["holiday"] = holiday
                    }
                }
                week.push(formatDate)
                if (firstDay === 0) date++
            }
            calendar.push(week)
        }
        return {
            year: year,
            month: month,
            calendar: calendar,
            date: dateNow,
        }
    }

    formatCalendar(family, calendarInfo) {
        const template = (text, props = {}, extra = undefined) => {
            let views = [{
                type: "text",
                props: Object.assign({
                    text: text,
                    font: $font(12),
                    lineLimit: 1,
                    minimumScaleFactor: 0.5,
                    frame: {
                        maxWidth: Infinity,
                        maxHeight: Infinity
                    }
                }, props.text)
            }]
            if (extra) { // 判断是否有额外信息
                views.push({
                    type: "text",
                    props: Object.assign({
                        text: extra,
                        font: $font(12),
                        lineLimit: extra.length > 3 ? 2 : 1,
                        minimumScaleFactor: 0.5,
                        frame: {
                            maxWidth: Infinity,
                            maxHeight: Infinity
                        }
                    }, props.ext)
                })
            }
            return {
                type: "vstack",
                modifiers: [
                    Object.assign({
                        background: $color("clear"),
                        color: $color("primaryText"),
                        padding: 2
                    }, props.box),
                    {
                        frame: {
                            maxWidth: Infinity,
                            maxHeight: Infinity
                        },
                        cornerRadius: 5
                    }
                ],
                views: views
            }
        }

        let calendar = calendarInfo.calendar
        let days = []
        for (let line of calendar) { // 设置不同日期显示不同样式
            for (let date of line) {
                if (date === 0) { // 空白直接跳过
                    days.push(template(""))
                    continue
                }
                // 初始样式
                let props = {
                    text: { color: $color("primaryText") },
                    ext: { color: $color("primaryText") }, // 额外信息样式，如农历等
                    box: {}
                }
                // 周末
                if (date.day === 0 || date.day === 6) {
                    props.ext.color = props.text.color = $color("systemGray2")
                }
                // 节假日
                if (date.holiday) {
                    if (date.holiday.holiday) {
                        props.ext.color = props.text.color = $color(this.holidayColor)
                    } else {
                        props.ext.color = props.text.color = $color(this.holidayNoRestColor)
                    }
                }
                // 本月前后补位日期
                if (date.month !== calendarInfo.month) {
                    props.ext.color = props.text.color = $color("systemGray2")
                }
                // 当天
                if (date.date === calendarInfo.date) {
                    props.text.color = $color("white")
                    props.ext.color = $color("white")
                    if (!date.holiday) {
                        props.box.background = $color(this.colorTone)
                    } else {
                        if (date.holiday.holiday)
                            props.box.background = $color(this.holidayColor)
                        else
                            props.box.background = $color(this.holidayNoRestColor)
                    }
                }
                // 4x4 widget 可显示额外信息
                let ext
                if (family === this.setting.family.large) {
                    ext = date.holiday ? date.holiday.name : date.lunar.lunarDay
                }
                days.push(template(String(date.date), props, ext))
            }
        }
        // 加入星期指示器
        let title = []
        for (let i = 0; i < 7; i++) {
            title.push(template(this.localizedWeek(i), {
                text: { color: $color(this.colorTone) }
            }))
        }
        return { // 返回完整视图
            type: "vgrid",
            props: {
                columns: Array(7).fill({
                    flexible: {
                        minimum: 0,
                        maximum: Infinity
                    },
                    spacing: 0
                }),
                spacing: 0,
                frame: {
                    maxWidth: Infinity,
                    maxHeight: Infinity
                }
            },
            views: title.concat(days)
        }
    }

    calendarView(family) {
        let calendarInfo = this.getCalendar(family === this.setting.family.large)
        let calendar = this.formatCalendar(family, calendarInfo)
        // 标题栏文字内容
        let content
        if (family === this.setting.family.large) {
            content = {
                left: calendarInfo.year + $l10n("YEAR") + this.localizedMonth(calendarInfo.month),
                right: this.lunar.lunarYear + $l10n("YEAR") + this.lunar.lunarMonth + $l10n("MONTH") + this.lunar.lunarDay,
                size: 18
            }
        } else {
            let year = this.widget2x2TitleYear ? String(calendarInfo.year).slice(-2) + $l10n("YEAR") : ""
            let right = this.lunar2x2 ? this.lunar.lunarMonth + $l10n("MONTH") + this.lunar.lunarDay : ""
            content = {
                left: year + this.localizedMonth(calendarInfo.month),
                right: right
            }
        }
        let titleBar = {
            type: "hstack",
            props: {
                frame: {
                    width: Infinity,
                    height: Infinity
                },
                padding: $insets(family === this.setting.family.large ? 10 : 5, 3, 5, 3)
            },
            views: [
                {
                    type: "text",
                    props: {
                        text: content.left,
                        lineLimit: 1,
                        color: $color(this.colorTone),
                        font: $font("bold", content.size),
                        frame: {
                            alignment: $widget.alignment.leading,
                            maxWidth: Infinity,
                            height: Infinity
                        }
                    }
                },
                {
                    type: "text",
                    props: {
                        text: content.right,
                        lineLimit: 1,
                        color: $color(this.colorTone),
                        font: $font("bold", content.size),
                        frame: {
                            alignment: $widget.alignment.trailing,
                            maxWidth: Infinity,
                            height: Infinity
                        }
                    }
                }
            ]
        }
        return {
            type: "vstack",
            props: Object.assign({
                frame: {
                    maxWidth: Infinity,
                    maxHeight: Infinity
                },
                spacing: 0,
                padding: 10
            }, family === this.setting.family.medium ? {
                link: this.setting.settingUrlScheme
            } : {
                    widgetURL: this.setting.settingUrlScheme
                }),
            views: [titleBar, calendar]
        }
    }
}

module.exports = Calendar