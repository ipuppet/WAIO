const { AppKernelBase } = require("./app")

class WidgetKernel extends AppKernelBase {
    constructor() {
        super()
        this.inWidgetEnv = true
    }
}

class Widget {
    static renderError() {
        $widget.setTimeline({
            render: () => {
                return {
                    type: "text",
                    props: {
                        text: "加载失败，可能是参数有误？去主程序更新参数再来试试？"
                    }
                }
            }
        })
    }

    static render(widgetName = $widget.inputValue) {
        const kernel = new WidgetKernel()
        const widget = kernel.widgetInstance(widgetName)
        if (widget) {
            widget.render()
        } else {
            Widget.renderError()
        }
    }
}

module.exports = {
    Widget,
    run: widgetName => {
        Widget.render(widgetName)
    }
}
