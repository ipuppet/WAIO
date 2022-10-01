const { SloarToLunar } = require("../../libs/sloarToLunar")

const s2l = new SloarToLunar()

/**
 * @typedef {import("../../app").AppKernel} AppKernel
 */
/**
 * @typedef {import("../widget").Widget} Widget
 */

class Calendar {
    family
    join = false
    calendar = {}
    height
    width

    font = "Helvetica Neue"
    titleBarBottomPadding = 5
    weekIndexBottomPadding = 5

    /**
     *
     * @param {Widget} widget
     */
    constructor(widget) {
        this.widget = widget
        this.kernel = widget.kernel
        this.setting = widget.setting

        this.onlyCurrentMonth = this.setting.get("onlyCurrentMonth")
        this.colorTone = this.setting.getColor(this.setting.get("colorTone"))
        this.hasHoliday = this.setting.get("holiday")
        this.holidayColor = this.setting.getColor(this.setting.get("holidayColor"))
        this.holidayNoRestColor = this.setting.getColor(this.setting.get("holidayNoRestColor")) // 调休
        if (this.hasHoliday && $file.exists(this.setting.holidayPath)) {
            // 假期信息
            this.holiday = JSON.parse($file.read(this.setting.holidayPath).string).holiday
        }
        this.monthDisplayMode = this.setting.get("monthDisplayMode") // 月份显示模式
        this.firstDayOfWeek = this.setting.get("firstDayOfWeek") // 每周第一天
        this.titleYearMode = this.setting.get("title.year.mode") // 年显示模式
        this.titleLunar = this.setting.get("title.lunar") // 标题是否显示农历
        this.titleLunarYear = this.setting.get("title.lunarYear") // 标题是否显示农历年
        this.backgroundImage = this.setting.getBackgroundImage() // 背景图片
        this.backgroundColor = this.setting.getColor(this.setting.get("backgroundColor"))
        this.backgroundColorDark = this.setting.getColor(this.setting.get("backgroundColorDark"))
        this.textColor = this.setting.getColor(this.setting.get("textColor"))
        this.textColorDark = this.setting.getColor(this.setting.get("textColorDark"))
    }

    get padding() {
        if (this.family === this.setting.family.medium) {
            return { h: 15, v: 25 }
        }
        if (this.family === this.setting.family.large) {
            return { h: 15, v: 15 }
        }
        return { h: 10, v: 10 }
    }

    get isLockscreen() {
        return this.family > this.setting.family.xLarge
    }

    /**
     * 用于解决 join 中错误的尺寸计算
     * @param {boolean} join
     */
    setJoin(join = false) {
        this.join = join
        return this
    }

    initStyle() {
        this.height = $widget.displaySize.height
        this.width = this.join ? this.height : $widget.displaySize.width

        this.titleBarHeight = Math.min(this.width * 0.11, 25) // titleBarHeight 最大值限制为 25
        this.columnWidth = (this.width - this.padding.h * 2) / 7 // 每列内容宽度
        this.singleContentFontSize = Math.min(this.columnWidth * 0.6, 20) // 字体最大 20
        this.singleContentHeight = this.widget.getContentSize($font(this.font, this.singleContentFontSize)).height
        this.contentViewHeight = this.height - this.singleContentHeight // 周指示器高度
        if (!this.isLockscreen) {
            this.contentViewHeight -=
                this.padding.v * 2 + this.titleBarHeight + this.titleBarBottomPadding + this.weekIndexBottomPadding
        }
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

    initCalendar(lunar, weekOnly = false) {
        const dateInstance = new Date()
        const year = dateInstance.getFullYear()
        const month = dateInstance.getMonth()
        const dateNow = dateInstance.getDate() // 当前日期
        const days = new Date(year, month + 1, 0).getDate() // 总天数
        let firstDay = new Date(year, month, 1).getDay() // 本月第一天是周几
        let lastMonthDates = new Date(year, month, 0).getDate() // 上个月总天数
        let nextMonth = 1 // 下个月的日期计数器
        lastMonthDates -= 7 - firstDay // 补齐本月开始前的空位
        if (this.firstDayOfWeek === 1) {
            // 设置中设定每周第一天是周几
            firstDay -= 1
            if (firstDay < 0) firstDay = 6
            lastMonthDates++ // 上周补到这周的天数少一天，加上一才会少一天
        }
        let calendar = []
        let date = 1 // 日期计数器
        for (let i = 0; i < 6; i++) {
            // 循环6次，每个月显示6周
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
                        formatDate =
                            date > days
                                ? {
                                      month: month + 1,
                                      date: nextMonth++,
                                      day: formatDay
                                  }
                                : {
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
                    formatDate["lunar"] =
                        date === dateNow ? this.lunar : s2l.sloarToLunar(year, formatDate.month + 1, formatDate.date)
                }
                // 节假日
                if (this.hasHoliday && formatDate !== 0) {
                    // 判断是否需要展示节假日
                    // month是0-11，故+1
                    const holiday = this.isHoliday(year, formatDate.month + 1, formatDate.date)
                    if (holiday) {
                        formatDate["holiday"] = holiday
                    }
                }
                week.push(formatDate)
                if (firstDay === 0) date++
            }
            if (weekOnly) {
                // 是否只获取一周
                if (date > dateNow) {
                    // 当循环日期大于当前日期时，说明本周已经循环完毕
                    calendar = [week]
                    break
                }
            }
            if (week.length > 0) calendar.push(week)
        }
        this.calendar = {
            year: year,
            month: month,
            calendar: calendar,
            date: dateNow
        }
    }

    /**
     * 复杂内容样式修饰器
     * @param {*} dayInfo
     * @param {*} this.calendarInfo
     * @returns
     */
    multipleContentDayStyleModifier(dayInfo) {
        if (dayInfo === 0) {
            // 空白直接跳过
            return {
                text: { text: " " },
                ext: { text: " " }
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
        if (dayInfo.date === this.calendar.date) {
            props.text.color = $color("white")
            props.ext.color = $color("white")
            if (!dayInfo.holiday) {
                props.box.background = this.colorTone
            } else {
                if (dayInfo.holiday.holiday) props.box.background = this.holidayColor
                else props.box.background = this.holidayNoRestColor
            }
        }
        // 本月前后补位日期
        if (dayInfo.month !== this.calendar.month) {
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
        // 计算高度
        const height = this.contentViewHeight / this.calendar.calendar.length

        const verticalPadding = height * 0.1
        const fontHeight = (height - verticalPadding * 2) / 2
        const fontSize = this.widget.getFontSizeByHeight(this.font, fontHeight)
        const extFontWidth = Math.min(
            fontSize,
            (this.columnWidth - verticalPadding * 2) / Math.min(props.ext.text.length, 4) // 最多 4 个字
        )

        return {
            type: "hgrid",
            props: {
                rows: Array(2).fill({
                    flexible: {
                        maximum: Infinity
                    },
                    spacing: 0
                })
            },
            modifiers: [
                Object.assign(
                    {
                        background: $color("clear"),
                        color: $color("primaryText"),
                        padding: $insets(verticalPadding, 0, verticalPadding, 0),
                        frame: {
                            minHeight: fontHeight * 2
                        }
                    },
                    props.box
                ),
                {
                    cornerRadius: 5
                }
            ],
            views: [
                {
                    type: "text",
                    props: Object.assign(
                        {
                            font: $font(this.font, fontSize),
                            lineLimit: 1,
                            frame: { width: this.columnWidth }
                        },
                        props.text
                    )
                },
                {
                    type: "text",
                    props: Object.assign(
                        {
                            font: $font(this.font, extFontWidth),
                            lineLimit: 2,
                            frame: { width: this.columnWidth }
                        },
                        props.ext
                    )
                }
            ]
        }
    }

    /**
     * 简单内容样式修饰器
     * @param {*} dayInfo
     * @param {*} this.calendarInfo
     * @returns
     */
    singleContentDayStyleModifier(dayInfo) {
        if (dayInfo === 0) {
            // 空白直接跳过
            return { text: { text: " " } }
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
        if (dayInfo.date === this.calendar.date) {
            if (this.isLockscreen) {
                props.text.color = $color("black")
                props.box.background = $color("white")
            } else {
                props.text.color = $color("white")
                if (!dayInfo.holiday) {
                    props.box.background = this.colorTone
                } else {
                    if (dayInfo.holiday.holiday) props.box.background = this.holidayColor
                    else props.box.background = this.holidayNoRestColor
                }
            }
        }
        // 本月前后补位日期
        if (dayInfo.month !== this.calendar.month) {
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
        const height = this.contentViewHeight / this.calendar.calendar.length
        let view = {
            type: "text",
            props: Object.assign(
                {
                    font: $font(this.font, this.singleContentFontSize),
                    lineLimit: 1,
                    frame: {
                        alignment: $widget.alignment.center,
                        width: this.columnWidth,
                        height: height
                    },
                    background: $color("clear")
                },
                props.text
            )
        }

        if (props?.box?.background) {
            view = {
                type: "zstack",
                props: {
                    alignment: $widget.alignment.center,
                    cornerRadius: 4
                },
                views: [props?.box?.background, view]
            }
        }

        return view
    }

    /**
     * 周指示器模板
     */
    weekIndexTemplate() {
        const title = []
        for (let i = 0; i < 7; i++) {
            title.push(
                this.singleContentDayTemplate({
                    text: {
                        text: this.localizedWeek(i),
                        color: this.colorTone
                    }
                })
            )
        }

        return {
            type: "vgrid",
            props: {
                columns: Array(7).fill({
                    flexible: {
                        maximum: Infinity
                    },
                    spacing: 0
                }),
                frame: {
                    maxWidth: Infinity,
                    maxHeight: this.singleContentHeight
                },
                padding: $insets(0, 0, this.weekIndexBottomPadding, 0)
            },
            views: title
        }
    }

    /**
     * 标题模板
     * @param {*} this.calendarInfo
     * @returns
     */
    titleBarTemplate() {
        // 标题栏文字内容
        let leftText
        if (this.titleYearMode !== 0) {
            const year = this.titleYearMode === 1 ? String(this.calendar.year).slice(-2) : this.calendar.year
            leftText = year + this.localizedMonth(this.calendar.month)
            leftText = year + $l10n("YEAR_DELIMITER") + this.localizedMonth(this.calendar.month)
        } else {
            leftText = this.localizedMonth(this.calendar.month)
        }

        const views = []
        const fontSize = this.widget.getFontSizeByHeight(this.font, this.titleBarHeight)
        views.push({
            type: "text",
            props: {
                font: $font(this.font, fontSize),
                text: leftText,
                lineLimit: 1,
                color: this.colorTone,
                bold: true,
                frame: {
                    alignment: $widget.alignment.leading,
                    width: this.widget.getContentSize($font(this.font, fontSize), leftText).width
                }
            }
        })

        if (this.titleLunar) {
            let rightText = this.lunar.lunarMonth + "月" + this.lunar.lunarDay
            if (this.titleLunarYear) rightText = this.lunar.lunarYear + "年" + rightText
            views.push({
                type: "text",
                props: {
                    font: $font(this.font, fontSize),
                    text: rightText,
                    lineLimit: 1,
                    minimumScaleFactor: 0.6,
                    color: this.colorTone,
                    bold: true,
                    frame: {
                        maxWidth: Infinity,
                        alignment: $widget.alignment.trailing
                    }
                }
            })
        }

        return {
            type: "hstack",
            props: {
                frame: {
                    alignment: $widget.alignment.leading,
                    maxWidth: Infinity,
                    maxHeight: this.titleBarHeight
                },
                padding: $insets(0, 0, this.titleBarBottomPadding, 0)
            },
            views: views
        }
    }

    calendarTemplate(dayStyleModifier, dayTemplate) {
        // 计算样式
        this.initStyle()
        // 生成视图
        const days = []
        for (let line of this.calendar.calendar) {
            // 设置不同日期显示不同样式
            for (let dayInfo of line) {
                const props = dayStyleModifier(dayInfo, this.calendar)
                days.push(dayTemplate(props))
            }
        }

        return {
            type: "vgrid",
            props: {
                columns: Array(7).fill({
                    flexible: {
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
            views: days
        }
    }

    viewTemplate() {
        const calendar =
            this.family === this.setting.family.small
                ? this.calendarTemplate(
                      dayInfo => this.singleContentDayStyleModifier(dayInfo),
                      props => this.singleContentDayTemplate(props)
                  )
                : this.calendarTemplate(
                      dayInfo => this.multipleContentDayStyleModifier(dayInfo),
                      props => this.multipleContentDayTemplate(props)
                  )
        return {
            type: "vstack",
            props: {
                background: this.getBackground(),
                frame: {
                    maxWidth: Infinity,
                    maxHeight: Infinity
                },
                spacing: 0,
                padding: $insets(this.padding.v, this.padding.h, this.padding.v, this.padding.h),
                widgetURL: this.setting.settingUrlScheme,
                link: this.setting.settingUrlScheme
            },
            views: [this.titleBarTemplate(), this.weekIndexTemplate(), calendar]
        }
    }

    getCalendarView(family) {
        $widget.family = family
        this.family = family
        this.initCalendar(family !== this.setting.family.small, family === this.setting.family.medium)
        return this.viewTemplate()
    }

    getAccessoryRectangularView() {
        this.family = this.setting.family.accessoryRectangular
        // 计算样式
        this.initStyle()
        // 初始化数据
        this.initCalendar(false)
        // 计算周数
        const dateInstance = new Date()
        const saturday = dateInstance.getDate() + (6 - dateInstance.getDay())
        const week = Math.ceil(saturday / 7) // start from 1
        const length = this.calendar.calendar.length
        const weekStart = week + 2 > length ? length - 2 : week
        const weekEnd = Math.min(weekStart + 2, length) // 最多显示 3 周
        this.calendar.calendar = this.calendar.calendar.slice(weekStart - 1, weekEnd)

        // 生成视图
        const days = this.weekIndexTemplate().views
        for (let i = 0; i < this.calendar.calendar.length; i++) {
            // 设置不同日期显示不同样式
            for (let dayInfo of this.calendar.calendar[i]) {
                const props = this.singleContentDayStyleModifier(dayInfo)
                days.push(this.singleContentDayTemplate(props))
            }
        }

        return {
            type: "vgrid",
            props: {
                columns: Array(7).fill({
                    flexible: {
                        maximum: Infinity
                    },
                    spacing: 0
                }),
                spacing: 0,
                frame: {
                    maxWidth: Infinity,
                    maxHeight: Infinity
                },
                widgetURL: this.setting.settingUrlScheme,
                link: this.setting.settingUrlScheme
            },
            views: days
        }
    }
}

module.exports = Calendar
