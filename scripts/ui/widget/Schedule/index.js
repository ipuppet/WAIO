const Widget = require("../widget")
const ScheduleSetting = require("./setting")
const Schedule = require("./schedule")

class ScheduleWidget extends Widget {
    constructor(kernel) {
        super(kernel, new ScheduleSetting(kernel))
        this.schedule = new Schedule(this.kernel, this.setting)
    }

    async view2x2() {
        return await this.schedule.scheduleView(this.setting.family.small)
    }

    async view2x4() {
        return await this.schedule.scheduleView(this.setting.family.medium)
    }

    async render() {
        const nowDate = new Date()
        const expireDate = new Date(nowDate + this.cacheLife)
        // 获取视图
        let view
        switch ($widget.family) {
            case 0:
                view = await this.view2x2()
                break
            case 1:
                view = await this.view2x4()
                break
            case 2:
                view = await this.view2x4()
                break
            default:
                view = this.errorView
        }
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
                this.printTimeConsuming()
                return view
            }
        })
    }
}

module.exports = {
    Widget: ScheduleWidget
}