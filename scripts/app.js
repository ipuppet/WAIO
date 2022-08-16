const { compressImage, UIKit, Sheet, Kernel, TabBarController, FileStorage, Setting } = require("./libs/easy-jsbox")
const HomeUI = require("./ui/home")

// path
const fileStorage = new FileStorage()
const widgetRootPath = "scripts/widget"
const widgetDataPath = `${fileStorage.basePath}/widget`
const backupPath = `${fileStorage.basePath}/backup`

/**
 * 实例化一个小组件
 * @param {String} widget widget名
 * @param {Kernel} that Kernel实例
 */
function widgetInstance(widget, that) {
    const recover = name => {
        if (
            !$file.exists(`${widgetRootPath}/${name}/index.js`) &&
            $file.exists(`${widgetRootPath}/${name}/config.json`)
        ) {
            const config = JSON.parse($file.read(`${widgetRootPath}/${name}/config.json`).string)
            if (config.from) {
                const configFrom = JSON.parse($file.read(`${widgetRootPath}/${config.from}/config.json`).string)
                // 检查from是否需要恢复
                if (configFrom.from) recover(config.from)
                $file.list(`${widgetRootPath}/${config.from}`).forEach(file => {
                    if (file !== "config.json") {
                        $file.copy({
                            src: `${widgetRootPath}/${config.from}/${file}`,
                            dst: `${widgetRootPath}/${name}/${file}`
                        })
                    }
                })
                // 更新设置文件中的NAME常量
                let settingjs = $file.read(`${widgetRootPath}/${name}/setting.js`).string
                const firstLine = `const NAME = "${config.from}"`
                const newFirstLine = `const NAME = "${name}"`
                settingjs = settingjs.replace(firstLine, newFirstLine)
                $file.write({
                    data: $data({ string: settingjs }),
                    path: `${widgetRootPath}/${name}/setting.js`
                })
            }
        } else if (!$file.exists(`${widgetRootPath}/${name}/config.json`)) {
            $ui.alert({
                title: $l10n("ERROR"),
                message: $l10n("CANNOT_TRACE_TO_THE_SOURCE") + `: ${name}`
            })
        }
    }
    recover(widget)
    const { Widget } = require(`./widget/${widget}/index.js`)
    return new Widget(that)
}

/**
 * @typedef {AppKernel} AppKernel
 */
class AppKernel extends Kernel {
    constructor() {
        super()
        // FileStorage
        this.fileStorage = fileStorage
        // setting
        this.setting = new Setting({ fileStorage: this.fileStorage })
        this.setting.loadConfig()
        this.initSettingMethods()

        // 小组件根目录
        this.widgetRootPath = widgetRootPath
        this.widgetDataPath = widgetDataPath
        // backup
        this.backupPath = backupPath
        this.initComponents()
    }

    initComponents() {
        // homeUI
        this.homeUI = new HomeUI(this)
    }

    compressImage(image, maxSize = 1280 * 720) {
        return compressImage(image, maxSize)
    }

    updateHomeScreenWidgetOptions() {
        const config = []
        this.getWidgetList().forEach(widget => {
            config.push({
                name: widget.name,
                value: widget.name
            })
        })
        $file.write({
            data: $data({ string: JSON.stringify(config) }),
            path: "widget-options.json"
        })
    }

    /**
     * 注入设置中的脚本类型方法
     */
    initSettingMethods() {
        this.setting.method.readme = animate => {
            const content = $file.read("/README.md").string
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

        this.setting.method.tips = animate => {
            $ui.alert("每个小组件中都有README文件，点击可以得到一些信息。")
        }

        this.setting.method.updateHomeScreenWidgetOptions = animate => {
            animate.actionStart()
            this.updateHomeScreenWidgetOptions()
            animate.actionDone()
        }

        this.setting.method.backupToICloud = animate => {
            animate.actionStart()
            const backupAction = async () => {
                // 保证目录存在
                if (!$file.exists(this.backupPath)) $file.mkdir(this.backupPath)
                try {
                    // 打包压缩
                    await $archiver.zip({
                        directory: this.widgetRootPath,
                        dest: `${this.backupPath}/widgets.zip`
                    })
                    await $archiver.zip({
                        directory: this.widgetDataPath,
                        dest: `${this.backupPath}/userdata.zip`
                    })
                    await $archiver.zip({
                        paths: [`${this.backupPath}/widgets.zip`, `${this.backupPath}/userdata.zip`],
                        dest: `${this.backupPath}/backup.zip`
                    })
                    // 用户选择保存位置
                    $drive.save({
                        data: $data({ path: `${this.backupPath}/backup.zip` }),
                        name: `${this.name}Backup-${Date.now()}.zip`,
                        handler: success => {
                            //删除压缩文件
                            $file.delete(this.backupPath)
                            if (success) {
                                animate.actionDone()
                            } else {
                                animate.actionCancel()
                            }
                        }
                    })
                } catch (error) {
                    animate.actionCancel()
                    this.print(error)
                }
            }
            $ui.alert({
                title: $l10n("BACKUP"),
                message: $l10n("START_BACKUP") + "?",
                actions: [
                    {
                        title: $l10n("OK"),
                        handler: () => {
                            backupAction()
                        }
                    },
                    {
                        title: $l10n("CANCEL"),
                        handler: () => {
                            animate.actionCancel()
                        }
                    }
                ]
            })
        }

        this.setting.method.recoverFromICloud = animate => {
            animate.actionStart()
            $drive.open({
                handler: data => {
                    // 保证目录存在
                    if (!$file.exists(this.backupPath)) $file.mkdir(this.backupPath)
                    $file.write({
                        data: data,
                        path: `${this.backupPath}/backup.zip`
                    })
                    // 解压
                    $archiver.unzip({
                        path: `${this.backupPath}/backup.zip`,
                        dest: this.backupPath,
                        handler: async success => {
                            if (success) {
                                if (
                                    $file.exists(`${this.backupPath}/widgets.zip`) &&
                                    $file.exists(`${this.backupPath}/userdata.zip`)
                                ) {
                                    try {
                                        // 保证目录存在
                                        $file.mkdir(`${this.backupPath}/widgets`)
                                        $file.mkdir(`${this.backupPath}/userdata`)
                                        // 解压
                                        await $archiver.unzip({
                                            path: `${this.backupPath}/widgets.zip`,
                                            dest: `${this.backupPath}/widgets`
                                        })
                                        await $archiver.unzip({
                                            path: `${this.backupPath}/userdata.zip`,
                                            dest: `${this.backupPath}/userdata`
                                        })
                                        // 恢复
                                        $file.list(`${this.backupPath}/widgets`).forEach(item => {
                                            if ($file.isDirectory(`${this.backupPath}/widgets/${item}`)) {
                                                $file.delete(`${this.widgetRootPath}/${item}`)
                                                $file.move({
                                                    src: `${this.backupPath}/widgets/${item}`,
                                                    dst: `${this.widgetRootPath}/${item}`
                                                })
                                            }
                                        })
                                        $file.move({
                                            src: `${this.backupPath}/userdata`,
                                            dst: this.widgetDataPath
                                        })
                                        // 删除文件
                                        $file.delete(`${this.backupPath}/backup.zip`)
                                        $file.delete(`${this.backupPath}/widgets.zip`)
                                        $file.delete(`${this.backupPath}/userdata.zip`)
                                        $file.delete(this.backupPath)
                                        animate.actionDone()
                                    } catch (error) {
                                        animate.actionCancel()
                                        throw error
                                    }
                                }
                            } else {
                                animate.actionCancel()
                            }
                        }
                    })
                }
            })
        }
    }

    widgetInstance(widget) {
        return widgetInstance(widget, this)
    }

    getWidgetList() {
        const data = []
        const widgets = $file.list(this.widgetRootPath)
        for (let widget of widgets) {
            const widgetPath = `${this.widgetRootPath}/${widget}`
            if ($file.exists(`${widgetPath}/config.json`)) {
                const config = JSON.parse($file.read(`${widgetPath}/config.json`).string)
                if (typeof config.icon !== "object") {
                    config.icon = [config.icon, config.icon]
                }
                config.icon = config.icon.map(icon => (icon[0] === "@" ? icon.replace("@", widgetPath) : icon))
                data.push({
                    describe: config.describe,
                    name: widget,
                    icon: config.icon
                })
            } else {
                // 没有config.json文件则跳过
                continue
            }
        }
        return data
    }
}

class WidgetKernel extends Kernel {
    constructor() {
        super()
        this.inWidgetEnv = true
        // 小组件根目录
        this.widgetRootPath = widgetRootPath
        this.widgetDataPath = widgetDataPath
    }

    widgetInstance(widget) {
        return widgetInstance(widget, this)
    }
}

class AppUI {
    static renderMainUI() {
        // 检查是否携带 URL scheme
        if ($context.query["url-scheme"]) {
            $delay(0, () => {
                $app.openURL($context.query["url-scheme"])
            })
            return
        }

        const kernel = new AppKernel()
        const buttons = {
            home: {
                icon: ["house", "house.fill"],
                title: $l10n("HOME")
            },
            setting: {
                icon: "gear",
                title: $l10n("SETTING")
            }
        }
        kernel.setting.setEvent("onSet", key => {
            if (key === "mainUIDisplayMode") {
                $delay(0.3, () => $addin.restart())
            }
        })
        if (kernel.setting.get("mainUIDisplayMode") === 0) {
            kernel.useJsboxNav()
            kernel.setting.useJsboxNav()
            // 设置 navButtons
            kernel.setNavButtons([
                {
                    symbol: buttons.setting.icon,
                    title: buttons.setting.title,
                    handler: () => {
                        UIKit.push({
                            title: buttons.setting.title,
                            bgcolor: Setting.bgcolor,
                            views: [kernel.setting.getListView()]
                        })
                    }
                }
            ])

            kernel.UIRender({ views: [kernel.homeUI.getListView()] })
        } else {
            const tabBarController = new TabBarController()
            const homeNavigationView = kernel.homeUI.getNavigationView()
            tabBarController
                .setPages({
                    home: homeNavigationView.getPage(),
                    setting: kernel.setting.getPageView()
                })
                .setCells({
                    home: buttons.home,
                    setting: buttons.setting
                })

            kernel.UIRender(tabBarController.generateView().definition)
        }
        // 监听运行状态
        $app.listen({
            pause: () => {
                $widget.reloadTimeline()
                kernel.updateHomeScreenWidgetOptions()
            }
        })
    }

    static renderUnsupported() {
        $intents.finish("不支持在此环境中运行")
        $ui.render({
            views: [
                {
                    type: "label",
                    props: {
                        text: "不支持在此环境中运行",
                        align: $align.center
                    },
                    layout: $layout.fill
                }
            ]
        })
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
    run: () => {
        //Widget.render("Calendar"); return
        if ($app.env === $env.widget) {
            Widget.render()
        } else if ($app.env === $env.app) {
            AppUI.renderMainUI()
        } else {
            AppUI.renderUnsupported()
        }
    }
}
