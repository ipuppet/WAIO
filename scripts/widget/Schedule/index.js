const Widget = require("../widget")
const ScheduleSetting = require("./setting")
const Schedule = require("./schedule")

class ScheduleWidget extends Widget {
    constructor(kernel) {
        super(kernel, new ScheduleSetting(kernel))
        this.timeSpan = this.setting.get("timeSpan")
    }

    async getCalendar(startDate, hours) {
        const nowDate = Date.now()
        const res = []
        const calendar = await $calendar.fetch({
            startDate: startDate,
            hours: hours
        })
        const store = $objc("EKEventStore").$new()
        // 未过期日程
        calendar.events.forEach(item => {
            const calendarItem = store.$calendarItemWithIdentifier(item.identifier)
            const calendar = calendarItem.$calendar()
            item.color = calendar.$color().jsValue()

            const endDate = item.endDate instanceof Date ? item.endDate.getTime() : item.endDate
            if (endDate >= nowDate) {
                res.push(item)
            }
        })
        return res
    }

    async getReminder(startDate, hours) {
        // TODO 用于暂时解决提醒事项的一个多线程 bug
        // https://github.com/cyanzhong/jsbox-issues/issues/117#issuecomment-996780241
        $reminder.fetch = async args => {
            const auth = store => {
                return new Promise(resolve => {
                    if ($objc("EKEventStore").$authorizationStatusForEntityType(1) === 3) {
                        resolve(true)
                    } else {
                        store.$requestAccessToEntityType_completion(
                            1,
                            $block("void, BOOL, NSError *", (granted, _) => {
                                resolve(granted)
                            })
                        )
                    }
                })
            }

            const store = $objc("EKEventStore").$new()
            const handler = args.handler
            const worker = async (resolve, reject) => {
                if (!(await auth(store))) {
                    $thread.main({
                        handler: () => {
                            if (reject) {
                                reject()
                            }
                            if (handler) {
                                handler({ status: false })
                            }
                        }
                    })
                    return
                }

                const hours = args.hours
                const startDate = args.startDate
                const endDate = !hours
                    ? args.endDate
                    : (() => {
                          const date = new Date(startDate.getTime())
                          date.setHours(date.getHours() + hours)
                          return date
                      })()

                const calendars = store.$calendarsForEntityType(1)
                const predicate = store.$predicateForRemindersInCalendars(calendars)
                store.$fetchRemindersMatchingPredicate_completion(
                    predicate,
                    $block("void, NSArray *", reminders => {
                        const result = { status: true, events: [] }
                        for (let index = 0; index < reminders.$count(); ++index) {
                            const reminder = reminders.$objectAtIndex(index)
                            if (
                                !reminder.$hasAlarms() ||
                                (() => {
                                    const alarm = reminder.$alarms().$firstObject()
                                    const date = alarm.$absoluteDate().jsValue()
                                    return (!startDate || date >= startDate) && (!endDate || date <= endDate)
                                })()
                            ) {
                                let item = reminder.jsValue()
                                const calendarItem = store.$calendarItemWithIdentifier(item.identifier)
                                const calendar = calendarItem.$calendar()
                                item.color = calendar.$color().jsValue()
                                result.events.push(item)
                            }
                        }

                        const callback = resolve || handler
                        if (callback) {
                            $thread.main({
                                handler: () => callback(result)
                            })
                        }
                    })
                )
            }

            if (handler) {
                worker()
            } else {
                return new Promise(worker)
            }
        }

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

    async initSchedule() {
        this.schedule = new Schedule(this)
        // 存在长时间跨度的日程，因此不能从今天开始取。以今天为中心的前后时间跨度。
        const startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * parseInt(this.timeSpan / 2))
        const hours = this.timeSpan * 24 // 此处不用除 2，因为开始日期为今天往前数半个 this.timeSpan
        const calendar = await this.getCalendar(startDate, hours)
        const reminder = await this.getReminder(startDate, hours)
        this.schedule.setData(calendar, reminder)
    }

    async joinView(mode) {
        await this.initSchedule() // 获取数据
        return this.schedule.scheduleView(mode)
    }

    async render() {
        const nowDate = Date.now()
        const expireDate = new Date(nowDate + 1000 * 60 * 5) // 每五分钟切换
        await this.initSchedule() // 获取数据
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
                const view = this.schedule.scheduleView(ctx.family)
                this.printTimeConsuming()
                return view
            }
        })
    }
}

module.exports = {
    Widget: ScheduleWidget
}
