class Widget {
    constructor(kernel, setting) {
        this.startTime = Date.now()
        this.kernel = kernel
        this.setting = setting // 此设置是小组件的设置，主程序设置需要从kernel中取
        this.cacheDateStartFromZero = false
        this.errorView = {
            type: "text",
            props: {
                text: $l10n("VIEW_NOT_PROVIDED")
            }
        }
    }

    custom() {
        this.setting.push()
    }

    printTimeConsuming() {
        if (!this.kernel.inWidgetEnv && this.kernel.setting.get("isPrintTimeConsuming"))
            console.log(`Use ${Date.now() - this.startTime} ms`)
    }

    async view2x2() {
        return this.errorView
    }

    async view2x4() {
        return this.errorView
    }

    async view4x4() {
        return this.errorView
    }

    async joinView(mode) {
        switch (mode) {
            case this.setting.joinMode.small:
                return this.view2x2()
            case this.setting.joinMode.medium:
                return this.view2x4()
            default:
                return false
        }
    }
}

module.exports = Widget