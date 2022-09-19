const Widget = require("../widget")
const CalendarSetting = require("./setting")
const Calendar = require("./calendar")

class CalendarWidget extends Widget {
    constructor(kernel) {
        super(kernel, new CalendarSetting(kernel))
        /**
         * @type {Calendar}
         */
        this.calendar = new Calendar(this)

        this.cacheLife = 1000 * 60 * 60 * 24
        this.cacheDateStartFromZero = true
    }

    getSmallView() {
        return this.calendar.setJoin(this.join).getCalendarView(this.setting.family.small)
    }

    getMediumView() {
        return this.calendar.setJoin(this.join).getCalendarView(this.setting.family.medium)
    }

    getLargeView() {
        return this.calendar.setJoin(this.join).getCalendarView(this.setting.family.large)
    }

    getAccessoryRectangularView() {
        return this.calendar.getAccessoryRectangularView()
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
                        view = this.getAccessoryRectangularView()
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
