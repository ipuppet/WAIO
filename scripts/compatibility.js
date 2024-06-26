/**
 * @typedef {import("./app-main").AppKernel} AppKernel
 */

class Compatibility {
    files = []
    databases = []
    actions = {}

    /**
     * @param {AppKernel} kernel
     */
    constructor(kernel) {
        this.kernel = kernel
    }

    deleteFiles(files) {
        files.forEach(file => {
            if (!this.files.includes(file)) {
                this.files.push(file)
            }
        })
    }

    #deleteFiles() {
        this.files.forEach(file => {
            if ($file.exists(file)) {
                this.kernel.logger.info(`delete file: ${file}`)
                $file.delete(file)
            }
        })
    }

    rebuildDatabase(oldTab, newTab) {
        this.databases.push([oldTab, newTab])
    }

    #rebuildDatabase() {
        const action = (oldTab, newTab) => {
            const result = this.kernel.storage.sqlite.query(
                `SELECT count(*), name FROM sqlite_master WHERE type = "table" AND name = "${oldTab}"`
            )
            if (result.error !== null) {
                throw new Error(
                    `Code [${result.error.code}] ${result.error.domain} ${result.error.localizedDescription}`
                )
            }
            result.result.next()
            const count = result.result.get(0)
            result.result.close()

            if (count > 0) {
                this.kernel.logger.info(`copy data from old table: ${oldTab}`)
                this.kernel.storage.sqlite.update(`INSERT INTO ${newTab} SELECT * FROM ${oldTab}`)
                this.kernel.logger.info(`drop table: ${oldTab}`)
                this.kernel.storage.sqlite.update(`DROP TABLE ${oldTab}`)
            }
        }
        this.databases.forEach(db => {
            action(db[0], db[1])
        })
    }

    rebuildUserActions(actions = {}) {
        for (let type of Object.keys(actions)) {
            actions[type].forEach(action => {
                if (!this.actions[type]) {
                    this.actions[type] = []
                }
                if (!this.actions[type].includes(action)) {
                    this.actions[type].push(action)
                }
            })
        }
    }

    async #rebuildUserActions() {
        if (Object.keys(this.actions).length === 0) return
        const actionPath = `scripts/action`
        const userActionPath = `${this.kernel.fileStorage.basePath}/user_action`

        const changeList = []
        for (let type of Object.keys(this.actions)) {
            this.actions[type].forEach(action => {
                let config
                const configPath = `${actionPath}/${type}/${action}/config.json`
                if ($file.exists(configPath)) {
                    config = JSON.parse($file.read(`${actionPath}/${type}/${action}/config.json`).string)
                } else {
                    config = __INFO__
                }
                changeList.push(config.name)
            })
        }
        const alertResult = await $ui.alert({
            title: $l10n("compatibility.rebuildUserAction.alert.title"),
            message:
                $l10n("compatibility.rebuildUserAction.alert.message") +
                "\n" +
                JSON.stringify(changeList, null, 2) +
                "\n" +
                $l10n("compatibility.rebuildUserAction.alert.message2"),
            actions: [{ title: $l10n("OK") }, { title: $l10n("CANCEL") }]
        })
        if (alertResult.index === 1) {
            return
        }

        // 重建用户动作
        for (let type of Object.keys(this.actions)) {
            this.actions[type].forEach(action => {
                if ($file.exists(`${userActionPath}/${type}/${action}`)) {
                    this.kernel.logger.info(`rebuild user action: ${type}/${action}`)
                    $file.copy({
                        src: `${actionPath}/${type}/${action}/main.js`,
                        dst: `${userActionPath}/${type}/${action}/main.js`
                    })
                }
            })
        }
        this.kernel.actions.setNeedReload()
    }

    async do() {
        this.#deleteFiles()
        this.#rebuildDatabase()
        await this.#rebuildUserActions()
    }
}

class VersionActions {
    version = 2
    userVersion = $cache.get("compatibility.version") ?? 0

    /**
     * @param {AppKernel} kernel
     */
    constructor(kernel) {
        this.kernel = kernel
        this.compatibility = new Compatibility(this.kernel)
    }

    do() {
        // this.userVersion === 0 视为新用户
        if (($file.list("storage") || this.userVersion > 0) && this.userVersion < this.version) {
            console.log("do compatibility")
            this.kernel.logger.info(`compatibility: userVersion [${this.userVersion}] lower than [${this.version}]`)
            for (let i = this.userVersion + 1; i <= this.version; i++) {
                this.call(i)
            }
            this.compatibility.do().catch(e => this.kernel.logger.error(e))
        }

        // 修改版本
        $cache.set("compatibility.version", this.version)
    }

    call(version) {
        if (typeof this[`ver${version}`] === "function") {
            this[`ver${version}`]()
        } else {
            throw new ReferenceError(`Version ${version} undefined`)
        }
    }

    ver1() {
        const basePath = this.kernel.fileStorage.basePath
        $file.mkdir(basePath)
        if ($file.exists("storage")) {
            $file.move({
                src: "storage",
                dst: basePath
            })
        }

        this.compatibility.deleteFiles(["storage"])
    }

    ver2() {
        this.compatibility.deleteFiles([
            "setting.json",
            "dist/CAIO-en.json",
            "dist/CAIO-zh-Hans.json",
            "dist/CAIO.js",
            "assets/icon"
        ])
    }
}

/**
 * @param {AppKernel} kernel
 */
async function compatibility(kernel) {
    if (!kernel) return

    try {
        const versionActions = new VersionActions(kernel)
        versionActions.do()
    } catch (error) {
        kernel.logger.error(error)
        throw error
    }
}

module.exports = compatibility
