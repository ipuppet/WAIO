const Widget = require("../widget")
const JoinSetting = require("./setting")

class JoinWidget extends Widget {
    constructor(kernel) {
        super(kernel, new JoinSetting(kernel))
        this.spacing = this.setting.get("spacing")
        // 左侧视图设置
        this.left = this.setting.get("left")
        this.leftJoinMode = this.setting.get("left.joinMode")
        // 右侧视图设置
        this.right = this.setting.get("right")
        this.rightJoinMode = this.setting.get("right.joinMode")
    }

    async view2x4() {
        const leftWidget = this.kernel.widgetInstance(this.left)
        const rightWidget = this.kernel.widgetInstance(this.right)
        const leftView = await leftWidget.joinView(this.leftJoinMode)
        const rightView = await rightWidget.joinView(this.rightJoinMode)
        $widget.family = this.setting.family.medium
        const width = $widget.displaySize.width / 2 - this.spacing / 2
        const height = $widget.displaySize.height
        // 调节宽度并裁剪多余部分
        if (!leftView.props.frame) leftView.props.frame = {}
        if (leftView.props.frame["maxWidth"] > width) {
            leftView.props.frame["maxWidth"] = width
        }
        leftView.props["clipped"] = true
        leftView.widgetURL = undefined
        if (!rightView.props.frame) rightView.props.frame = {}
        if (rightView.props.frame["maxWidth"] > width) {
            rightView.props.frame["maxWidth"] = width
        }
        rightView.props["clipped"] = true
        rightView.widgetURL = undefined
        return {
            type: "hstack",
            props: {
                spacing: this.spacing,
                frame: {
                    maxWidth: Infinity,
                    height: height
                }
            },
            views: [leftView, rightView]
        }
    }

    async render() {
        const nowDate = Date.now()
        const expireDate = new Date(nowDate + 1000 * 60 * 10) // 每十分钟切换
        const view2x4 = await this.view2x4()
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
                switch (ctx.family) {
                    case 0:
                        return {
                            type: "text",
                            props: { text: $l10n("NO_SMALL_VIEW") }
                        }
                    case 1:
                        return view2x4
                    /* case 2:
                        return this.view4x4() */
                    default:
                        return {
                            type: "text",
                            props: { text: "在未来可能会提供该视图" }
                        }
                }
            }
        })
    }
}

module.exports = {
    Widget: JoinWidget
}
