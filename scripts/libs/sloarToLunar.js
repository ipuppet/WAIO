/**
 * 来源：https://github.com/xm2by/fragment/blob/master/%E5%85%AC%E5%8E%86%E8%BD%AC%E5%86%9C%E5%8E%86/sloarToLunar.js
 */

/* 公历转农历代码思路：
1、建立农历年份查询表
2、计算输入公历日期与公历基准的相差天数
3、从农历基准开始遍历农历查询表，计算自农历基准之后每一年的天数，并用相差天数依次相减，确定农历年份
4、利用剩余相差天数以及农历每个月的天数确定农历月份
5、利用剩余相差天数确定农历哪一天 */

// 农历1949-2100年查询表
const lunarYearArr = [
        0x0b557, //1949
        0x06ca0,
        0x0b550,
        0x15355,
        0x04da0,
        0x0a5b0,
        0x14573,
        0x052b0,
        0x0a9a8,
        0x0e950,
        0x06aa0, //1950-1959
        0x0aea6,
        0x0ab50,
        0x04b60,
        0x0aae4,
        0x0a570,
        0x05260,
        0x0f263,
        0x0d950,
        0x05b57,
        0x056a0, //1960-1969
        0x096d0,
        0x04dd5,
        0x04ad0,
        0x0a4d0,
        0x0d4d4,
        0x0d250,
        0x0d558,
        0x0b540,
        0x0b6a0,
        0x195a6, //1970-1979
        0x095b0,
        0x049b0,
        0x0a974,
        0x0a4b0,
        0x0b27a,
        0x06a50,
        0x06d40,
        0x0af46,
        0x0ab60,
        0x09570, //1980-1989
        0x04af5,
        0x04970,
        0x064b0,
        0x074a3,
        0x0ea50,
        0x06b58,
        0x055c0,
        0x0ab60,
        0x096d5,
        0x092e0, //1990-1999
        0x0c960,
        0x0d954,
        0x0d4a0,
        0x0da50,
        0x07552,
        0x056a0,
        0x0abb7,
        0x025d0,
        0x092d0,
        0x0cab5, //2000-2009
        0x0a950,
        0x0b4a0,
        0x0baa4,
        0x0ad50,
        0x055d9,
        0x04ba0,
        0x0a5b0,
        0x15176,
        0x052b0,
        0x0a930, //2010-2019
        0x07954,
        0x06aa0,
        0x0ad50,
        0x05b52,
        0x04b60,
        0x0a6e6,
        0x0a4e0,
        0x0d260,
        0x0ea65,
        0x0d530, //2020-2029
        0x05aa0,
        0x076a3,
        0x096d0,
        0x04afb,
        0x04ad0,
        0x0a4d0,
        0x1d0b6,
        0x0d250,
        0x0d520,
        0x0dd45, //2030-2039
        0x0b5a0,
        0x056d0,
        0x055b2,
        0x049b0,
        0x0a577,
        0x0a4b0,
        0x0aa50,
        0x1b255,
        0x06d20,
        0x0ada0, //2040-2049
        0x14b63,
        0x09370,
        0x049f8,
        0x04970,
        0x064b0,
        0x168a6,
        0x0ea50,
        0x06b20,
        0x1a6c4,
        0x0aae0, //2050-2059
        0x0a2e0,
        0x0d2e3,
        0x0c960,
        0x0d557,
        0x0d4a0,
        0x0da50,
        0x05d55,
        0x056a0,
        0x0a6d0,
        0x055d4, //2060-2069
        0x052d0,
        0x0a9b8,
        0x0a950,
        0x0b4a0,
        0x0b6a6,
        0x0ad50,
        0x055a0,
        0x0aba4,
        0x0a5b0,
        0x052b0, //2070-2079
        0x0b273,
        0x06930,
        0x07337,
        0x06aa0,
        0x0ad50,
        0x14b55,
        0x04b60,
        0x0a570,
        0x054e4,
        0x0d160, //2080-2089
        0x0e968,
        0x0d520,
        0x0daa0,
        0x16aa6,
        0x056d0,
        0x04ae0,
        0x0a9d4,
        0x0a2d0,
        0x0d150,
        0x0f252, //2090-2099
        0x0d520 //2100
    ],
    lunarMonth = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"],
    lunarDay = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "初", "廿"],
    tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
    diZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

class SloarToLunar {
    /**
     * 公历转农历
     * @param {Number} sy 年
     * @param {Number} sm 月
     * @param {Number} sd 日
     * @returns
     */
    sloarToLunar(sy, sm, sd) {
        // 输入的月份减1处理
        sm -= 1
        // 计算与公历基准的相差天数
        // Date.UTC()返回的是距离公历1970年1月1日的毫秒数,传入的月份需要减1
        let daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1
        let ly, lm, ld
        // 确定输出的农历年份
        for (let j = 0; j < lunarYearArr.length; j++) {
            daySpan -= this.lunarYearDays(lunarYearArr[j])
            if (daySpan <= 0) {
                ly = 1949 + j
                // 获取农历年份确定后的剩余天数
                daySpan += this.lunarYearDays(lunarYearArr[j])
                break
            }
        }
        // 确定输出的农历月份
        for (let k = 0; k < this.lunarYearMonths(lunarYearArr[ly - 1949]).length; k++) {
            daySpan -= this.lunarYearMonths(lunarYearArr[ly - 1949])[k]
            if (daySpan <= 0) {
                // 有闰月时，月份的数组长度会变成13，因此，当闰月月份小于等于k时，lm不需要加1
                if (this.hasLeapMonth(lunarYearArr[ly - 1949]) && this.hasLeapMonth(lunarYearArr[ly - 1949]) <= k) {
                    if (this.hasLeapMonth(lunarYearArr[ly - 1949]) < k) {
                        lm = k
                    } else if (this.hasLeapMonth(lunarYearArr[ly - 1949]) === k) {
                        lm = "闰" + k
                    } else {
                        lm = k + 1
                    }
                } else {
                    lm = k + 1
                }
                // 获取农历月份确定后的剩余天数
                daySpan += this.lunarYearMonths(lunarYearArr[ly - 1949])[k]
                break
            }
        }
        // 确定输出农历哪一天
        ld = daySpan
        // 将计算出来的农历月份转换成汉字月份，闰月需要在前面加上闰字
        if (this.hasLeapMonth(lunarYearArr[ly - 1949]) && typeof lm === "string" && lm.indexOf("闰") > -1) {
            lm = `闰${lunarMonth[/\d/.exec(lm) - 1]}`
        } else {
            lm = lunarMonth[lm - 1]
        }
        // 将计算出来的农历年份转换为天干地支年
        ly = this.getTianGan(ly) + this.getDiZhi(ly)
        // 将计算出来的农历天数转换成汉字
        if (ld < 11) {
            ld = `${lunarDay[10]}${lunarDay[ld - 1]}`
        } else if (ld > 10 && ld < 20) {
            ld = `${lunarDay[9]}${lunarDay[ld - 11]}`
        } else if (ld === 20) {
            ld = `${lunarDay[1]}${lunarDay[9]}`
        } else if (ld > 20 && ld < 30) {
            ld = `${lunarDay[11]}${lunarDay[ld - 21]}`
        } else if (ld === 30) {
            ld = `${lunarDay[2]}${lunarDay[9]}`
        }

        return {
            lunarYear: ly,
            lunarMonth: lm,
            lunarDay: ld
        }
    }

    /**
     * 计算农历年是否有闰月
     * 农历年份信息用16进制存储，其中16进制的最后1位可以用于判断是否有闰月
     * @param {Number} ly 存储农历年的16进制
     * @returns
     */
    hasLeapMonth(ly) {
        // 获取16进制的最后1位，需要用到&与运算符
        if (ly & 0xf) {
            return ly & 0xf
        } else {
            return false
        }
    }

    /**
     * 如果有闰月，计算农历闰月天数
     * 农历年份信息用16进制存储，其中16进制的第1位（0x除外）可以用于表示闰月是大月还是小月
     * @param {Number} ly 存储农历年的16进制
     * @returns
     */
    leapMonthDays(ly) {
        if (this.hasLeapMonth(ly)) {
            // 获取16进制的第1位（0x除外）
            return ly & 0xf0000 ? 30 : 29
        } else {
            return 0
        }
    }

    /**
     * 计算农历一年的总天数
     * 农历年份信息用16进制存储，其中16进制的第2-4位（0x除外）可以用于表示正常月是大月还是小月
     * @param {Number} ly 存储农历年的16进制
     * @returns
     */
    lunarYearDays(ly) {
        let totalDays = 0
        // 获取正常月的天数，并累加
        // 获取16进制的第2-4位，需要用到>>移位运算符
        for (let i = 0x8000; i > 0x8; i >>= 1) {
            let monthDays = ly & i ? 30 : 29
            totalDays += monthDays
        }
        // 如果有闰月，需要把闰月的天数加上
        if (this.hasLeapMonth(ly)) {
            totalDays += this.leapMonthDays(ly)
        }
        return totalDays
    }

    /**
     * 获取农历每个月的天数
     * @param {Number} ly 16进制数值
     * @returns
     */
    lunarYearMonths(ly) {
        let monthArr = []
        // 获取正常月的天数，并添加到monthArr数组中
        // 获取16进制的第2-4位，需要用到>>移位运算符
        for (let i = 0x8000; i > 0x8; i >>= 1) {
            monthArr.push(ly & i ? 30 : 29)
        }
        // 如果有闰月，需要把闰月的天数加上
        if (this.hasLeapMonth(ly)) {
            monthArr.splice(this.hasLeapMonth(ly), 0, this.leapMonthDays(ly))
        }
        return monthArr
    }

    /**
     * 将农历年转换为天干，参数为农历年
     * @param {Number} ly
     * @returns
     */
    getTianGan(ly) {
        let tianGanKey = (ly - 3) % 10
        if (tianGanKey === 0) tianGanKey = 10
        return tianGan[tianGanKey - 1]
    }

    /**
     * 将农历年转换为地支，参数为农历年
     * @param {Number} ly
     * @returns
     */
    getDiZhi(ly) {
        let diZhiKey = (ly - 3) % 12
        if (diZhiKey === 0) diZhiKey = 12
        return diZhi[diZhiKey - 1]
    }
}

module.exports = {
    VERSION: "1.0.0",
    SloarToLunar
}
