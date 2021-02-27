class HomeUI {
    constructor(kernel) {
        this.kernel = kernel
        // 检查是否携带widget参数，携带则打开设置页面
        if (this.kernel.query["widget"]) {
            setTimeout(() => {
                const widget = this.kernel.widgetInstance(this.kernel.query["widget"])
                if (widget) {
                    widget.custom()
                    // 清空参数
                    this.kernel.query["widget"] = undefined
                }
            }, 500)
        }
    }

    getWidgetListView() {
        const data = this.kernel.getWidgetList()
        const template = data => {
            return {
                icon: {// 如果不设置image属性，默认为小组件目录下的icon.png
                    image: $image(data.icon[0], data.icon[1])
                },
                title: {
                    text: data.title
                },
                describe: {
                    text: data.describe
                },
                name: data.name
            }
        }
        return data.map(item => template(item))
    }

    getViews() {
        return [
            {
                type: "list",
                props: {
                    id: "waio-home-list",
                    rowHeight: 100,
                    indicatorInsets: $insets(30, 0, 50, 0),
                    data: this.getWidgetListView(),
                    header: {
                        type: "view",
                        props: { height: 80 },
                        views: [{
                            type: "label",
                            props: {
                                text: "WAIO",
                                font: $font(36)
                            },
                            layout: (make, view) => {
                                make.left.inset(20)
                                make.centerY.equalTo(view.super)
                            }
                        }]
                    },
                    footer: {// 防止list被菜单遮挡
                        type: "view",
                        props: { height: 50 }
                    },
                    template: {
                        props: {
                            bgcolor: $color("clear")
                        },
                        layout: $layout.fill,
                        views: [
                            {
                                type: "image",
                                props: {
                                    id: "icon",
                                    bgcolor: $color("clear"),
                                    clipsToBounds: true,
                                    cornerRadius: 10,
                                    smoothCorners: true
                                },
                                layout: make => {
                                    make.size.equalTo(80)
                                    make.left.inset(20)
                                    make.top.inset(10)
                                }
                            },
                            {
                                type: "label",
                                props: {
                                    id: "title",
                                    font: $font(20)
                                },
                                layout: (make, view) => {
                                    make.top.equalTo(view.prev).offset(10)
                                    make.left.equalTo(view.prev.right).offset(20)
                                }
                            },
                            {
                                type: "label",
                                props: {
                                    id: "describe",
                                    font: $font(12),
                                    color: $color("systemGray2")
                                },
                                layout: (make, view) => {
                                    make.left.equalTo(view.prev)
                                    make.top.equalTo(view.prev.bottom).offset(10)
                                }
                            }
                        ]
                    },
                    actions: [
                        {
                            title: $l10n("COPY"),
                            color: $color("orange"),
                            handler: (sender, indexPath) => {
                                $input.text({
                                    placeholder: $l10n("NEW_WIDGET_NAME"),
                                    text: "",
                                    handler: text => {
                                        const widgetName = sender.object(indexPath).name
                                        if (!$file.exists(`${this.kernel.widgetRootPath}/${widgetName}/setting.js`) || !$file.exists(`${this.kernel.widgetRootPath}/${widgetName}/config.json`)) {
                                            $ui.error($l10n("CANNOT_COPY_THIS_WIDGET"))
                                            return
                                        }
                                        const newName = text === "" ? widgetName + "Copy" : text
                                        $file.copy({
                                            src: `${this.kernel.widgetRootPath}/${widgetName}`,
                                            dst: `${this.kernel.widgetRootPath}/${newName}`
                                        })
                                        // 更新设置文件中的NAME常量
                                        let settingjs = $file.read(`${this.kernel.widgetRootPath}/${newName}/setting.js`).string
                                        const firstLine = settingjs.split("\n")[0]
                                        const newFirstLine = `const NAME = "${newName}"`
                                        settingjs = settingjs.replace(firstLine, newFirstLine)
                                        $file.write({
                                            data: $data({ string: settingjs }),
                                            path: `${this.kernel.widgetRootPath}/${newName}/setting.js`
                                        })
                                        // 更新config.json
                                        const config = JSON.parse($file.read(`${this.kernel.widgetRootPath}/${newName}/config.json`).string)
                                        config.title = newName
                                        $file.write({
                                            data: $data({ string: JSON.stringify(config) }),
                                            path: `${this.kernel.widgetRootPath}/${newName}/config.json`
                                        })
                                        // 更新列表
                                        setTimeout(() => { sender.data = this.getWidgetListView() }, 200)
                                    }
                                })
                            }
                        },
                        {
                            title: $l10n("DELETE"),
                            color: $color("red"),
                            handler: (sender, indexPath) => {
                                const widgetName = sender.object(indexPath).name
                                let style = {}
                                if ($alertActionType) {
                                    style = { style: $alertActionType.destructive }
                                }
                                $ui.alert({
                                    title: $l10n("CONFIRM_DELETE_MSG"),
                                    actions: [
                                        Object.assign({
                                            title: $l10n("DELETE"),
                                            handler: () => {
                                                $file.delete(`${this.kernel.widgetRootPath}/${widgetName}`)
                                                // 删除assets
                                                $file.delete(`${this.kernel.widgetAssetsPath}/${widgetName}`)
                                                sender.delete(indexPath)
                                            }
                                        }, style),
                                        { title: $l10n("CANCEL") }
                                    ]
                                })
                            }
                        }
                    ]
                },
                events: {
                    didSelect: (sender, indexPath, data) => {
                        const widgetName = data.name
                        const widget = this.kernel.widgetInstance(widgetName)
                        if (widget) {
                            widget.custom()
                        } else {
                            $ui.error($l10n("ERROR"))
                        }
                    },
                    pulled: sender => {
                        $("waio-home-list").data = this.getWidgetListView()
                        setTimeout(() => { sender.endRefreshing() }, 500)
                    }
                },
                layout: $layout.fill
            }
        ]
    }
}

module.exports = HomeUI