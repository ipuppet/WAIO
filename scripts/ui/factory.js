class Factory {
    constructor(kernel) {
        this.kernel = kernel
        // 设置初始页面
        this.kernel.page.controller.setSelectedPage(0)
        this.kernel.menu.controller.setSelectedMenu(0)
    }

    home() {
        const HomeUI = require("./home")
        const interfaceUi = new HomeUI(this.kernel)
        return this.kernel.page.view.creator(interfaceUi.getViews(), 0)
    }

    setting() {
        return this.kernel.page.view.creator(this.kernel.setting.getView(), 1, false)
    }

    /**
     * 渲染页面
     */
    render() {
        this.kernel.render([
            this.home(),
            this.setting()
        ], [
            {
                icon: ["house", "house.fill"],
                title: $l10n("HOME")
            },
            {
                icon: "gear",
                title: $l10n("SETTING")
            }
        ])()
    }
}

module.exports = Factory