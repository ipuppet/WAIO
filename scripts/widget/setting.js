const { L10n, UIKit, Sheet, NavigationBar, NavigationView, FileStorage, Setting } = require("../libs/easy-jsbox")

/**
 * @typedef {import("../app").AppKernel} AppKernel
 */
/**
 * @typedef {import("./widget").Widget} Widget
 */

/**
 * @typedef {WidgetSetting} WidgetSetting
 */
class WidgetSetting {
    /**
     *
     * @param {AppKernel} kernel
     * @param {Widget} widget
     */
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
            xLarge: 3,
            accessoryCircular: 5,
            accessoryRectangular: 6,
            accessoryInline: 7
        }
        this.joinMode = {
            small: 0,
            medium: 1
        }
    }

    init() {
        this.rootStorage = new FileStorage({ basePath: this.kernel.widgetRootPath })

        this.config = this.rootStorage.readAsJSON(`${this.widget}/config.json`)
        this.setting = new Setting({
            name: `${this.widget}Setting`,
            fileStorage: new FileStorage({ basePath: `${this.kernel.widgetDataPath}/${this.widget}` }),
            saveFile: "setting.json",
            structure: this.rootStorage.readAsJSON(`${this.widget}/setting.json`)
        })
        // 判断当前环境
        if (!this.kernel.inWidgetEnv) {
            if (this.kernel.isUseJsboxNav) {
                this.setting.useJsboxNav()
            }
            this.setting.setFooter({ type: "view" })
            this.setting.setEvent("onChildPush", (listView, title) => {
                this.push(listView, title)
            })
            this.defaultSettingMethods()
            this.initSettingMethods()
        } else {
            this.setting.setReadonly()
        }
    }

    loadL10n() {
        const stringsPath = `${this.kernel.widgetRootPath}/${this.widget}/strings`
        if ($file.exists(stringsPath)) {
            $file.list(stringsPath).forEach(file => {
                L10n.add(file.slice(0, file.indexOf(".")), $file.read(`${stringsPath}/${file}`).string)
            })
        }
    }

    push(listView = this.setting.getListView(), title = this.widget) {
        const navButtons = [
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
        if (this.kernel.isUseJsboxNav) {
            UIKit.push({
                bgcolor: Setting.bgcolor,
                topOffset: false,
                views: [listView],
                title: title,
                navButtons: navButtons
            })
        } else {
            const navigationView = new NavigationView()
            navigationView.setView(listView).navigationBarTitle(title)
            navigationView.navigationBar.setLargeTitleDisplayMode(NavigationBar.largeTitleDisplayModeNever)
            navigationView.navigationBarItems.setRightButtons(
                navButtons.map(button => {
                    button.tapped = button.handler
                    delete button.handler
                    return button
                })
            )
            this.kernel?.homeUI.viewController.push(navigationView)
        }
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

    defaultSettingMethods() {
        this.setting.method.readme = animate => {
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

    initSettingMethods() {}
}

module.exports = WidgetSetting
