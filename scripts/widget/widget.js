/**
 * @typedef {import("../app").AppKernel} AppKernel
 */
/**
 * @typedef {import("./setting").WidgetSetting} WidgetSetting
 */

/**
 * @typedef {Widget} Widget
 */
class Widget {
    join = false

    /**
     *
     * @param {AppKernel} kernel
     * @param {WidgetSetting} widgetSetting
     */
    constructor(kernel, widgetSetting) {
        this.startTime = Date.now()
        this.kernel = kernel
        /**
         * @type {WidgetSetting}
         */
        this.setting = widgetSetting // 此设置是小组件的设置，主程序设置需要从kernel中取
        this.cacheDateStartFromZero = false
        this.errorView = {
            type: "text",
            props: {
                text: $l10n("VIEW_NOT_PROVIDED")
            }
        }
    }

    custom() {
        this.setting.push()
    }

    printTimeConsuming() {
        if (!this.kernel.inWidgetEnv) {
            this.kernel.print(`Use ${Date.now() - this.startTime} ms`)
        }
    }

    getContentSizeByFontSize(font, fontSize, content = "A") {
        return $text.sizeThatFits({
            text: content,
            width: content.length * content,
            font: $font(font, fontSize)
        })
    }

    getFontSizeByHeight(font, height, text = "A") {
        if (!this.helveticaNeueFontSize) {
            this.helveticaNeueFontSize = {}
        }

        if (this.helveticaNeueFontSize[height] !== undefined) {
            return this.helveticaNeueFontSize[height]
        }

        const _fontSize = height
        const _fontHeight = $text.sizeThatFits({
            text: text,
            width: _fontSize,
            font: $font(font, _fontSize)
        }).height
        const s = _fontSize / _fontHeight
        this.helveticaNeueFontSize[height] = height * s
        return this.helveticaNeueFontSize[height]
    }

    async getSmallView() {
        return this.errorView
    }

    async getMediumView() {
        return this.errorView
    }

    async getLargeView() {
        return this.errorView
    }

    async getAccessoryCircularView() {
        return this.errorView
    }

    async getAccessoryRectangularView() {
        return this.errorView
    }

    async joinView(mode) {
        this.join = true
        switch (mode) {
            case this.setting.joinMode.small:
                return this.getSmallView()
            case this.setting.joinMode.medium:
                return this.getMediumView()
            default:
                return false
        }
    }
}

module.exports = Widget
