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

    getSmallView() {
        $widget.family = this.setting.family.small
        return this.calendar.setJoin(this.join).smallCalendarView()
    }

    getMediumView() {
        $widget.family = this.setting.family.medium
        return this.calendar.setJoin(this.join).calendarView(this.setting.family.medium)
    }

    getLargeView() {
        $widget.family = this.setting.family.large
        return this.calendar.setJoin(this.join).calendarView(this.setting.family.large)
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
                        view = this.getSmallView()
                        break
                    case 1:
                        view = this.getMediumView()
                        break
                    case 2:
                        view = this.getLargeView()
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
