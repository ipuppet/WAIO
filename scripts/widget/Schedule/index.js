const Widget = require("../widget")
const ScheduleSetting = require("./setting")
const Schedule = require("./schedule")

class ScheduleWidget extends Widget {
    constructor(kernel) {
        super(kernel, new ScheduleSetting(kernel))
        this.schedule = new Schedule(this.kernel, this.setting)
        this.timeSpan = this.setting.get("timeSpan")
    }

    async getCalendar(startDate, hours) {
        const nowDate = Date.now()
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

    view(family) {
        return this.schedule.scheduleView(family)
    }

    async joinView(mode) {
        // 获取数据
        const startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * parseInt(this.timeSpan / 2)) // 以今天为中心的前后时间跨度。单位：天
        const hours = this.timeSpan * 24
        const calendar = await this.getCalendar(startDate, hours)
        const reminder = await this.getReminder(startDate, hours)
        this.schedule.setData(calendar, reminder)
        return this.view(mode)
    }

    async render() {
        const nowDate = Date.now()
        const expireDate = new Date(nowDate + 1000 * 60 * 10)// 每十分钟切换
        // 获取数据
        const startDate = new Date(nowDate - 1000 * 60 * 60 * 24 * parseInt(this.timeSpan / 2)) // 以今天为中心的前后时间跨度。单位：天
        const hours = this.timeSpan * 24
        const calendar = await this.getCalendar(startDate, hours)
        const reminder = await this.getReminder(startDate, hours)
        this.schedule.setData(calendar, reminder)
        $widget.setTimeline({
            entries: [
                {
                    date: nowDate,
                    info: {}
                }
            ],
            policy: {
                afterDate: expireDate
            },
            render: ctx => {
                // 获取视图
                const view = this.view(ctx.family)
                this.printTimeConsuming()
                return view
            }
        })
    }
}

module.exports = {
    Widget: ScheduleWidget
}