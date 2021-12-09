const NAME = "Schedule"
const BaseSetting = require("../setting")

class ScheduleSetting extends BaseSetting {
    constructor(kernel) {
        super(kernel, NAME)
    }
}

module.exports = ScheduleSetting