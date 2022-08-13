const NAME = "Schedule"
const WidgetSetting = require("../setting")

class ScheduleSetting extends WidgetSetting {
    constructor(kernel) {
        super(kernel, NAME)
    }
}

module.exports = ScheduleSetting