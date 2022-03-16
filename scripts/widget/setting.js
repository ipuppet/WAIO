const {
    UIKit,
    Sheet,
    Setting
} = require("../lib/easy-jsbox")

class BaseSetting {
    constructor(kernel, widget) {
        this.kernel = kernel
        this.widget = widget
        // settingUrlScheme
        this.settingUrlScheme = `jsbox://run?name=${$addin.current.name}&widget=${this.widget}`
        // 初始化
        this.loadL10n()
        this.init()
        this.family = {
            small: 0,
            medium: 1,
            large: 2,
            xLarge: 3
        }
        this.joinMode = {
            small: 0,
            medium: 1
        }
    }

    init() {
        const rootPath = `${this.kernel.widgetRootPath}/${this.widget}`,
            dataPath = `${this.kernel.widgetDataPath}/${this.widget}`
        this.config = JSON.parse($file.read(`${rootPath}/config.json`).string)
        // 检查目录是否存在，不存在则创建
        if (!$file.exists(rootPath)) { $file.mkdir(rootPath) }
        if (!$file.exists(dataPath)) { $file.mkdir(dataPath) }
        const structurePath = `${rootPath}/setting.json`,
            savePath = `${dataPath}/setting.json`
        this.setting = new Setting({
            name: `${this.widget}Setting`,
            savePath: savePath,
            structurePath: structurePath
        })
        this.setting.loadConfig().useJsboxNav()
        // 判断当前环境
        if (!this.kernel.inWidgetEnv) {
            this.setting.setFooter({ type: "view" })
            this.setting.setEvent("onChildPush", (listView, title) => {
                this.push(listView, title)
            })
            this.defaultSettingMethods()
            this.initSettingMethods()
        }
    }

    loadL10n() {
        const stringsPath = `${this.kernel.widgetRootPath}/${this.widget}/strings`
        if ($file.exists(stringsPath)) {
            $file.list(stringsPath).forEach(file => {
                this.kernel.l10n(file.slice(0, file.indexOf(".")), $file.read(`${stringsPath}/${file}`).string)
            })
        }
    }

    push(listView = this.setting.getListView(), title = this.widget) {
        UIKit.push({
            bgcolor: "insetGroupedBackground",
            topOffset: false,
            views: [listView],
            title: title,
            navButtons: [
                {
                    symbol: "rectangle.3.offgrid.fill",
                    handler: () => {
                        const widget = this.kernel.widgetInstance(this.widget)
                        if (widget) {
                            widget.render()
                        } else {
                            $ui.error($l10n("ERROR"))
                        }
                    }
                }
            ]
        })
    }

    set(key, value) {
        // 每次操作都更新缓存
        const result = this.setting.set(key, value)
        $cache.set(`setting-${this.widget}`, this.setting.setting)
        return result
    }

    get(key) {
        return this.setting.get(key)
    }

    getColor(color) {
        return this.setting.getColor(color)
    }

    defaultSettingMethods() {
        this.setting.method.readme = animate => {
            animate.touchHighlight()
            const content = $file.read(`${this.kernel.widgetRootPath}/${this.widget}/README.md`).string
            const sheet = new Sheet()
            sheet
                .setView({
                    type: "markdown",
                    props: { content: content },
                    layout: (make, view) => {
                        make.size.equalTo(view.super)
                    }
                })
                .init()
                .present()
        }
    }

    initSettingMethods() { }
}

module.exports = BaseSetting