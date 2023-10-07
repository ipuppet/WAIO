const { UIKit, TabBarController, Setting } = require("./libs/easy-jsbox")
const { AppKernelBase } = require("./app")
const HomeUI = require("./ui/home")

const compatibility = require("./compatibility")

/**
 * @typedef {AppKernel} AppKernel
 */
class AppKernel extends AppKernelBase {
    constructor() {
        super()
        // setting
        this.setting = new Setting({ logger: this.logger, fileStorage: this.fileStorage })
        this.initSettingMethods()

        this.initComponents()
    }

    initComponents() {
        // homeUI
        this.homeUI = new HomeUI(this)
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
        this.setting.method.tips = () => {
            $ui.alert("每个小组件中都有 README 文件，点击可以得到一些信息。")
        }

        this.setting.method.updateHomeScreenWidgetOptions = animate => {
            animate.start()
            this.updateHomeScreenWidgetOptions()
            animate.done()
        }

        this.setting.method.backupToICloud = async animate => {
            animate.start()
            const res = await $ui.alert({
                title: $l10n("BACKUP"),
                message: $l10n("START_BACKUP") + "?",
                actions: [{ title: $l10n("OK") }, { title: $l10n("CANCEL") }]
            })
            if (res.index === 0) {
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
                        name: `${$addin.current.name}-${Date.now()}.zip`,
                        handler: success => {
                            //删除压缩文件
                            $file.delete(this.backupPath)
                            if (success) {
                                animate.done()
                            } else {
                                animate.cancel()
                            }
                        }
                    })
                } catch (error) {
                    animate.cancel()
                    this.print(error)
                }
            } else {
                animate.cancel()
            }
        }

        this.setting.method.recoverFromICloud = async animate => {
            animate.start()
            const data = await $drive.open()

            // 保证目录存在
            if (!$file.exists(this.backupPath)) $file.mkdir(this.backupPath)
            $file.write({
                data: data,
                path: `${this.backupPath}/backup.zip`
            })
            // 解压
            const success = await $archiver.unzip({
                path: `${this.backupPath}/backup.zip`,
                dest: this.backupPath
            })

            if (!success) {
                animate.cancel()
                return
            }
            if (!($file.exists(`${this.backupPath}/widgets.zip`) && $file.exists(`${this.backupPath}/userdata.zip`))) {
                animate.cancel()
                return
            }

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
                animate.done()
            } catch (error) {
                animate.cancel()
                throw error
            }
        }
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

class AppUI {
    static kernel = new AppKernel()

    static renderMainUI() {
        // 检查是否携带 URL scheme
        if ($context.query["url-scheme"]) {
            $delay(0, () => {
                $app.openURL($context.query["url-scheme"])
            })
            return
        }

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
        this.kernel.setting.setEvent("onSet", key => {
            if (key === "mainUIDisplayMode") {
                $delay(0.3, () => $addin.restart())
            }
        })
        if (this.kernel.setting.get("mainUIDisplayMode") === 0) {
            this.kernel.useJsboxNav()
            this.kernel.setting.useJsboxNav()
            // 设置 navButtons
            this.kernel.setNavButtons([
                {
                    symbol: buttons.setting.icon,
                    title: buttons.setting.title,
                    handler: () => {
                        UIKit.push({
                            title: buttons.setting.title,
                            bgcolor: Setting.bgcolor,
                            views: [this.kernel.setting.getListView()]
                        })
                    }
                }
            ])

            this.kernel.UIRender({ views: [this.kernel.homeUI.getListView()] })
        } else {
            const tabBarController = new TabBarController()
            const homeNavigationView = this.kernel.homeUI.getNavigationView()
            tabBarController
                .setPages({
                    home: homeNavigationView.getPage(),
                    setting: this.kernel.setting.getPage()
                })
                .setCells({
                    home: buttons.home,
                    setting: buttons.setting
                })

            this.kernel.UIRender(tabBarController.generateView().definition)
        }
        // 监听运行状态
        $app.listen({
            pause: () => {
                $widget.reloadTimeline()
                this.kernel.updateHomeScreenWidgetOptions()
            }
        })
    }
}

module.exports = {
    run: () => {
        // 兼容性操作
        compatibility(AppUI.kernel)

        AppUI.renderMainUI()
    }
}
