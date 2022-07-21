const NAME = "TextClock"
const WidgetSetting = require("../setting")

class TextClockSetting extends WidgetSetting {
    constructor(kernel) {
        super(kernel, NAME)
    }

    initSettingMethods() {
    }
}

module.exports = TextClockSetting