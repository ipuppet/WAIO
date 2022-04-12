const Widget = require("../widget")
const TextClockSetting = require("./setting")

/**
 * https://github.com/cyanzhong/jsbox-widgets/blob/master/clock.js
 */
class TextClockWidget extends Widget {
    constructor(kernel) {
        super(kernel, new TextClockSetting(kernel))
        this.midnight = new Date()
        this.midnight.setHours(0, 0, 0, 0)
        this.oneDayInMillis = 60 * 60 * 24 * 1000
    }

    view2x2() {
        return {
            type: "text",
            props: {
                date: this.midnight,
                style: $widget.dateStyle.timer,
                bold: true,
                font: {
                    size: 120,
                    monospaced: true
                },
                frame: {
                    maxWidth: $widget.displaySize.width - 30
                },
                lineLimit: 1,
                minimumScaleFactor: 0.01
            }
        }
    }

    joinView() {
        return this.view2x2()
    }

    render() {
        $widget.setTimeline({
            policy: {
                afterDate: new Date(this.midnight.getTime() + this.oneDayInMillis)
            },
            render: () => {
                const view = this.view2x2()
                this.printTimeConsuming()
                return view
            }
        })
    }
}

module.exports = {
    Widget: TextClockWidget
}