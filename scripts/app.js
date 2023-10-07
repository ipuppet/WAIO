const { Kernel, FileStorage, Logger } = require("./libs/easy-jsbox")

/**
 * @typedef {AppKernelBase} AppKernelBase
 */
class AppKernelBase extends Kernel {
    static fileStorage = new FileStorage({ basePath: "shared://waio" })

    logPath = "logs"
    logFile = "waio.log"
    logFilePath = FileStorage.join(this.logPath, this.logFile)

    constructor() {
        super()
        // FileStorage
        this.fileStorage = AppKernelBase.fileStorage
        // Logger
        this.logger = new Logger()
        this.logger.setWriter(this.fileStorage, this.logFilePath)

        // 小组件根目录
        this.widgetRootPath = "scripts/widget"
        this.widgetDataPath = `${this.fileStorage.basePath}/widget`
        // backup
        this.backupPath = `${this.fileStorage.basePath}/backup`
    }

    /**
     * 实例化一个小组件
     * @param {String} widget widget 名
     */
    widgetInstance(widget) {
        const recover = name => {
            if (
                !$file.exists(`${this.widgetRootPath}/${name}/index.js`) &&
                $file.exists(`${this.widgetRootPath}/${name}/config.json`)
            ) {
                const config = JSON.parse($file.read(`${this.widgetRootPath}/${name}/config.json`).string)
                if (config.from) {
                    const configFrom = JSON.parse(
                        $file.read(`${this.widgetRootPath}/${config.from}/config.json`).string
                    )
                    // 检查from是否需要恢复
                    if (configFrom.from) recover(config.from)
                    $file.list(`${this.widgetRootPath}/${config.from}`).forEach(file => {
                        if (file !== "config.json") {
                            $file.copy({
                                src: `${this.widgetRootPath}/${config.from}/${file}`,
                                dst: `${this.widgetRootPath}/${name}/${file}`
                            })
                        }
                    })
                    // 更新设置文件中的NAME常量
                    let settingjs = $file.read(`${this.widgetRootPath}/${name}/setting.js`).string
                    const firstLine = `const NAME = "${config.from}"`
                    const newFirstLine = `const NAME = "${name}"`
                    settingjs = settingjs.replace(firstLine, newFirstLine)
                    $file.write({
                        data: $data({ string: settingjs }),
                        path: `${this.widgetRootPath}/${name}/setting.js`
                    })
                }
            } else if (!$file.exists(`${this.widgetRootPath}/${name}/config.json`)) {
                $ui.alert({
                    title: $l10n("ERROR"),
                    message: $l10n("CANNOT_TRACE_TO_THE_SOURCE") + `: ${name}`
                })
            }
        }
        recover(widget)
        const { Widget } = require(`./widget/${widget}/index.js`)
        return new Widget(this)
    }
}

module.exports = {
    AppKernelBase
}
