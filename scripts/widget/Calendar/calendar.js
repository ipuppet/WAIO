const { SloarToLunar } = require('../../libs/sloarToLunar')

const s2l = new SloarToLunar()

class Calendar {
    constructor(kernel, setting) {
        this.kernel = kernel
        this.setting = setting
        this.onlyCurrentMonth = this.setting.get("onlyCurrentMonth")
        this.colorTone = this.setting.getColor(this.setting.get("colorTone"))
        this.hasHoliday = this.setting.get("holiday")
        this.holidayColor = this.setting.getColor(this.setting.get("holidayColor"))
        this.holidayNoRestColor = this.setting.getColor(this.setting.get("holidayNoRestColor")) // 调休
        if (this.hasHoliday && $file.exists(this.setting.holidayPath)) { // 假期信息
            this.holiday = JSON.parse($file.read(this.setting.holidayPath).string).holiday
        }
        this.monthDisplayMode = this.setting.get("monthDisplayMode") // 月份显示模式
        this.firstDayOfWeek = this.setting.get("firstDayOfWeek") // 每周第一天
        this.titleYearMode = this.setting.get("title.year.mode") // 年显示模式
        this.titleLunar = this.setting.get("title.lunar") // 标题是否显示农历
        this.titleLunarYear = this.setting.get("title.lunarYear") // 标题是否显示农历年
        this.titleAddSpacer = this.setting.get("title.addSpacer") // 是否在标题和日历间增加spacer
        this.backgroundImage = this.setting.getBackgroundImage() // 背景图片
        this.backgroundColor = this.setting.getColor(this.setting.get("backgroundColor"))
        this.backgroundColorDark = this.setting.getColor(this.setting.get("backgroundColorDark"))
        this.textColor = this.setting.getColor(this.setting.get("textColor"))
        this.textColorDark = this.setting.getColor(this.setting.get("textColorDark"))
    }

    localizedWeek(index) {
        const week = [
            $l10n("SHORT_SUNDAY"),
            $l10n("SHORT_MONDAY"),
            $l10n("SHORT_TUESDAY"),
            $l10n("SHORT_WEDNESDAY"),
            $l10n("SHORT_THURSDAY"),
            $l10n("SHORT_FRIDAY"),
            $l10n("SHORT_SATURDAY")
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
        return month[index] + $l10n("BLANK_MONTH")
    }

    getBackground() {
        if ($file.exists(this.backgroundImage)) {
            return {
                type: "image",
                props: {
                    image: $image(this.backgroundImage),
                    resizable: true,
                    scaledToFill: true
                }
            }
        } else {
            return $color(this.backgroundColor, this.backgroundColorDark)
        }
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
        const key = toString(month) + "-" + toString(date)
        const holiday = this.holiday[key]
        if (holiday && holiday.date === year + "-" + key) {
            return holiday
        }
        return false
    }

    getCalendar(lunar, weekOnly = false) {
        const dateInstance = new Date()
        const year = dateInstance.getFullYear()
        const month = dateInstance.getMonth()
        const dateNow = dateInstance.getDate() // 当前日期
        const days = new Date(year, month + 1, 0).getDate() // 总天数
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
            const week = []
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
                        if (date > days) {
                            break
                        }
                        formatDate = {
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
                        formatDate = date > days ? {
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
                    this.lunar = s2l.sloarToLunar(year, month + 1, date)
                }
                if (lunar && formatDate !== 0) {
                    // month是0-11，故+1
                    formatDate["lunar"] = date === dateNow ? this.lunar : s2l.sloarToLunar(
                        year, formatDate.month + 1, formatDate.date
                    )
                }
                // 节假日
                if (this.hasHoliday && formatDate !== 0) { // 判断是否需要展示节假日
                    // month是0-11，故+1
                    const holiday = this.isHoliday(year, formatDate.month + 1, formatDate.date)
                    if (holiday) {
                        formatDate["holiday"] = holiday
                    }
                }
                week.push(formatDate)
                if (firstDay === 0) date++
            }
            if (weekOnly) { // 是否只获取一周
                if (date > dateNow) { // 当循环日期大于当前日期时，说明本周已经循环完毕
                    calendar = [week]
                    break
                }
            }
            if (week.length > 0)
                calendar.push(week)
        }
        return {
            year: year,
            month: month,
            calendar: calendar,
            date: dateNow,
        }
    }

    /**
     * 复杂内容样式修饰器
     * @param {*} dayInfo 
     * @param {*} calendarInfo 
     * @returns 
     */
    multipleContentDayStyleModifier(dayInfo, calendarInfo) {
        if (dayInfo === 0) { // 空白直接跳过
            return {
                date: "",
                props: {},
                extra: null
            }
        }
        const extra = dayInfo.holiday ? dayInfo.holiday.name : dayInfo.lunar.lunarDay
        // 初始样式
        const props = {
            text: {
                text: String(dayInfo.date),
                color: $color(this.textColor, this.textColorDark)
            },
            ext: {
                text: extra,
                lineLimit: extra.length > 3 ? 2 : 1,
                color: $color(this.textColor, this.textColorDark)
            }, // 额外信息样式，如农历等
            box: {}
        }
        // 周末
        if (dayInfo.day === 0 || dayInfo.day === 6) {
            props.ext.color = props.text.color = $color("systemGray2")
        }
        // 节假日
        if (dayInfo.holiday) {
            if (dayInfo.holiday.holiday) {
                props.ext.color = props.text.color = this.holidayColor
            } else {
                props.ext.color = props.text.color = this.holidayNoRestColor
            }
        }
        // 当天
        if (dayInfo.date === calendarInfo.date) {
            props.text.color = $color("white")
            props.ext.color = $color("white")
            if (!dayInfo.holiday) {
                props.box.background = this.colorTone
            } else {
                if (dayInfo.holiday.holiday)
                    props.box.background = this.holidayColor
                else
                    props.box.background = this.holidayNoRestColor
            }
        }
        // 本月前后补位日期
        if (dayInfo.month !== calendarInfo.month) {
            props.ext.color = props.text.color = $color("systemGray2")
            props.box = {}
        }
        return props
    }

    /**
     * 复杂内容视图模板
     * @param {*} props 
     * @returns 
     */
    multipleContentDayTemplate(props = {}) {
        const views = [
            {
                type: "text",
                props: Object.assign({
                    lineLimit: 1,
                    frame: {
                        maxWidth: Infinity
                    }
                }, props.text)
            },
            {
                type: "text",
                props: Object.assign({
                    minimumScaleFactor: 0.8,
                    frame: {
                        maxWidth: Infinity
                    }
                }, props.ext)
            }
        ]
        return {
            type: "hgrid",
            props: {
                rows: Array(2).fill({
                    flexible: {
                        maximum: Infinity
                    },
                    spacing: 10
                })
            },
            modifiers: [
                Object.assign({
                    background: $color("clear"),
                    color: $color("primaryText"),
                    padding: 8,
                }, props.box),
                {
                    cornerRadius: 5
                }
            ],
            views: views
        }
    }

    /**
     * 简单内容样式修饰器
     * @param {*} dayInfo 
     * @param {*} calendarInfo 
     * @returns 
     */
    singleContentDayStyleModifier(dayInfo, calendarInfo) {
        if (dayInfo === 0) { // 空白直接跳过
            return {
                date: "",
                props: {},
                extra: null
            }
        }
        // 初始样式
        const props = {
            text: {
                text: String(dayInfo.date),
                color: $color(this.textColor, this.textColorDark)
            },
            box: {}
        }
        // 周末
        if (dayInfo.day === 0 || dayInfo.day === 6) {
            props.text.color = $color("systemGray2")
        }
        // 节假日
        if (dayInfo.holiday) {
            if (dayInfo.holiday.holiday) {
                props.text.color = this.holidayColor
            } else {
                props.text.color = this.holidayNoRestColor
            }
        }
        // 当天
        if (dayInfo.date === calendarInfo.date) {
            props.text.color = $color("white")
            if (!dayInfo.holiday) {
                props.box.background = this.colorTone
            } else {
                if (dayInfo.holiday.holiday)
                    props.box.background = this.holidayColor
                else
                    props.box.background = this.holidayNoRestColor
            }
        }
        // 本月前后补位日期
        if (dayInfo.month !== calendarInfo.month) {
            props.text.color = $color("systemGray2")
            props.box = {}
        }
        return props
    }

    /**
     * 简单内容视图模板
     * @param {*} props 
     * @returns 
     */
    singleContentDayTemplate(props = {}) {
        const views = [{
            type: "text",
            props: Object.assign({
                font: $font(13),
                lineLimit: 1,
                frame: {
                    maxWidth: Infinity,
                    maxHeight: Infinity
                }
            }, props.text)
        }]
        return {
            type: "hgrid",
            props: {
                rows: [{
                    flexible: {
                        maximum: Infinity
                    },
                    spacing: 0
                }]
            },
            modifiers: [
                Object.assign({
                    background: $color("clear"),
                    color: $color("primaryText"),
                    padding: 3,
                }, props.box),
                {
                    cornerRadius: 5
                }
            ],
            views: views
        }
    }

    /**
     * 周指示器模板
     */
    weekIndexTemplate() {
        const title = []
        for (let i = 0; i < 7; i++) {
            title.push(this.singleContentDayTemplate({
                text: {
                    font: $font(14),
                    text: this.localizedWeek(i),
                    color: this.colorTone
                }
            }))
        }
        return title
    }

    /**
     * 标题模板
     * @param {*} calendarInfo 
     * @returns 
     */
    titleBarTemplate(calendarInfo) {
        // 标题栏文字内容
        let leftText, views = []
        if (this.titleYearMode !== 0) {
            const year = this.titleYearMode === 1 ? String(calendarInfo.year).slice(-2) : calendarInfo.year
            leftText = year + this.localizedMonth(calendarInfo.month)
            leftText = year + $l10n("YEAR_DELIMITER") + this.localizedMonth(calendarInfo.month)
        } else {
            leftText = this.localizedMonth(calendarInfo.month)
        }
        views.push({
            type: "text",
            props: {
                text: leftText,
                lineLimit: 1,
                color: this.colorTone,
                bold: true,
                frame: {
                    alignment: $widget.alignment.leading,
                    maxWidth: Infinity,
                    height: Infinity
                }
            }
        })
        if (this.titleLunar) {
            let rightText = this.lunar.lunarMonth + "月" + this.lunar.lunarDay
            if (this.titleLunarYear) rightText = this.lunar.lunarYear + "年" + rightText
            views.push({
                type: "text",
                props: {
                    text: rightText,
                    lineLimit: 1,
                    color: this.colorTone,
                    bold: true,
                    frame: {
                        alignment: $widget.alignment.trailing,
                        maxWidth: Infinity,
                        height: Infinity
                    }
                }
            })
        }
        return {
            type: "hstack",
            props: {
                frame: {
                    maxWidth: Infinity,
                    maxHeight: Infinity
                }
            },
            views: views
        }
    }

    calendarTemplate(calendarInfo, dayStyleModifier, dayTemplate, vSpacing = 5) {
        const days = []
        for (let line of calendarInfo.calendar) { // 设置不同日期显示不同样式
            for (let dayInfo of line) {
                const props = dayStyleModifier(dayInfo, calendarInfo)
                days.push(dayTemplate(props))
            }
        }

        const calendar = {
            type: "vgrid",
            props: {
                columns: Array(7).fill({
                    flexible: {
                        maximum: Infinity
                    },
                    spacing: 0
                }),
                spacing: vSpacing,
                frame: {
                    maxWidth: Infinity,
                    maxHeight: Infinity
                }
            },
            views: this.weekIndexTemplate().concat(days)
        }
        const titleBar = this.titleBarTemplate(calendarInfo)

        return {
            type: "vstack",
            props: {
                background: this.getBackground(),
                frame: {
                    maxWidth: Infinity,
                    maxHeight: Infinity
                },
                spacing: 0,
                padding: 10,
                widgetURL: this.setting.settingUrlScheme,
                link: this.setting.settingUrlScheme
            },
            views: this.titleAddSpacer ? [
                { type: "spacer" }, titleBar, { type: "spacer" }, calendar, { type: "spacer" }
            ] : [
                { type: "spacer" }, titleBar, calendar, { type: "spacer" }
            ]
        }
    }

    smallCalendarView() {
        const calendarInfo = this.getCalendar(false)
        return this.calendarTemplate(
            calendarInfo,
            (dayInfo, calendarInfo) => this.singleContentDayStyleModifier(dayInfo, calendarInfo),
            props => this.singleContentDayTemplate(props),
            0
        )
    }

    calendarView(family) {
        const calendarInfo = this.getCalendar(true, family === this.setting.family.medium)
        return this.calendarTemplate(
            calendarInfo,
            (dayInfo, calendarInfo) => this.multipleContentDayStyleModifier(dayInfo, calendarInfo),
            props => this.multipleContentDayTemplate(props)
        )
    }
}

module.exports = Calendar