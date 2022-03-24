const NAME = "TextClock"
const BaseSetting = require("../setting")

class TextClockSetting extends BaseSetting {
    constructor(kernel) {
        super(kernel, NAME)
    }

    initSettingMethods() {
    }
}

module.exports = TextClockSetting