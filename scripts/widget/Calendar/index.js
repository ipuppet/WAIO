const Widget = require("../widget")
const CalendarSetting = require("./setting")
const Calendar = require("./calendar")

class CalendarWidget extends Widget {
    constructor(kernel) {
        super(kernel, new CalendarSetting(kernel))
        this.calendar = new Calendar(this.kernel, this.setting)
        this.cacheLife = 1000 * 60 * 60 * 24
        this.cacheDateStartFromZero = true
    }

    view2x2() {
        $widget.family = this.setting.family.small
        this.calendar.initStyle(this.join)
        return this.calendar.smallCalendarView()
    }

    view2x4() {
        $widget.family = this.setting.family.medium
        this.calendar.initStyle(this.join)
        return this.calendar.calendarView(this.setting.family.medium)
    }

    view4x4() {
        $widget.family = this.setting.family.large
        this.calendar.initStyle(this.join)
        return this.calendar.calendarView(this.setting.family.large)
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
                    case 0:
                        view = this.view2x2()
                        break
                    case 1:
                        view = this.view2x4()
                        break
                    case 2:
                        view = this.view4x4()
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
    Widget: CalendarWidget
}