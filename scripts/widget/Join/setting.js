const NAME = "Join"
const BaseSetting = require("../setting")

class JoinSetting extends BaseSetting {
    constructor(kernel) {
        super(kernel, NAME)
    }

    initSettingMethods() {
        // 初始化菜单
        this.menu = (() => {
            const data = this.kernel.getWidgetList()
            const result = []
            data.forEach(item => {
                if (item.name !== NAME)
                    result.push(item.name)
            })
            return result
        })()

        // 设置项内需要的函数
        this.setting.method.getMenu = () => {
            return this.menu
        }
    }
}

module.exports = JoinSetting