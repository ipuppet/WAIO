const NAME = "Join"
const WidgetSetting = require("../setting")

class JoinSetting extends WidgetSetting {
    constructor(kernel) {
        super(kernel, NAME)
    }

    initSettingMethods() {
        // 初始化菜单
        this.menu = (() => {
            const data = this.kernel.getWidgetList()
            const result = []
            data.forEach(item => {
                if (item.name !== NAME && item.name !== "Calendar")
                    result.push(item.name)
            })
            // "Calendar" 作为默认值，永远排在最前面
            result.unshift("Calendar")
            return result
        })()

        // 设置项内需要的函数
        this.setting.method.getMenu = () => {
            return this.menu
        }
    }
}

module.exports = JoinSetting