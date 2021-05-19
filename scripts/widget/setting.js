class Setting {
    constructor(kernel, widget) {
        this.kernel = kernel
        this.widget = widget
        // settingUrlScheme
        this.settingUrlScheme = `jsbox://run?name=${this.kernel.name}&widget=${this.widget}`
        // 初始化
        this.init()
        this.family = {
            small: 0,
            medium: 1,
            large: 2
        }
        this.joinMode = {
            small: 0,
            medium: 1
        }
    }

    init() {
        const rootPath = `${this.kernel.widgetRootPath}/${this.widget}`,
            dataPath = `${this.kernel.widgetDataPath}/${this.widget}`
        // 检查目录是否存在，不存在则创建
        if (!$file.exists(rootPath)) { $file.mkdir(rootPath) }
        if (!$file.exists(dataPath)) { $file.mkdir(dataPath) }
        const structurePath = `${rootPath}/setting.json`,
            savePath = `${dataPath}/setting.json`
        this.settingComponent = this.kernel.registerComponent("setting", {
            name: `${this.widget}Setting`,
            savePath: savePath,
            structurePath: structurePath
        })
        this.setting = this.settingComponent.controller
        // 判断当前环境
        if (!this.kernel.inWidgetEnv) {
            this.setting.isSecondaryPage(true, () => { $ui.pop() })
            this.setting.setFooter({ type: "view" })
            this.defaultSettingMethods()
            this.initSettingMethods()
        }
    }

    push() {
        this.kernel.UIKit.push({
            bgcolor: "insetGroupedBackground",
            topOffset: false,
            views: this.setting.getView(),
            title: this.widget
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
        this.setting.readme = animate => {
            animate.touchHighlight()
            const content = $file.read(`${this.kernel.widgetRootPath}/${this.widget}/README.md`).string
            this.kernel.UIKit.pushPageSheet({
                views: [{
                    type: "markdown",
                    props: { content: content },
                    layout: (make, view) => {
                        make.size.equalTo(view.super)
                    }
                }],
                title: $l10n("README")
            })
        }

        this.setting.preview = animate => {
            animate.touchHighlight()
            const widget = this.kernel.widgetInstance(this.widget)
            if (widget) {
                widget.render()
            } else {
                $ui.error($l10n("ERROR"))
            }
        }
    }

    initSettingMethods() { }
}

module.exports = Setting