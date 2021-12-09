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
                    text: data.name
                },
                describe: {
                    text: data.describe
                },
                name: data.name
            }
        }
        return data.map(item => template(item))
    }

    copyWidget(from, callback) {
        $input.text({
            placeholder: $l10n("NEW_WIDGET_NAME"),
            text: from,
            handler: newName => {
                newName = newName.trim()
                const newPath = `${this.kernel.widgetRootPath}/${newName}`
                if ($file.exists(newPath)) {
                    $ui.error($l10n("NAME_ALREADY_EXISTS"))
                    return
                }
                const fromPath = `${this.kernel.widgetRootPath}/${from}`
                if (!$file.exists(`${fromPath}/setting.js`) || !$file.exists(`${fromPath}/config.json`)) {
                    $ui.error($l10n("CANNOT_COPY_THIS_WIDGET"))
                    return
                }
                $file.copy({
                    src: fromPath,
                    dst: newPath
                })
                // 更新设置文件中的NAME常量
                let settingjs = $file.read(`${newPath}/setting.js`).string
                const firstLine = `const NAME = "${from}"`
                const newFirstLine = `const NAME = "${newName}"`
                settingjs = settingjs.replace(firstLine, newFirstLine)
                $file.write({
                    data: $data({ string: settingjs }),
                    path: `${newPath}/setting.js`
                })
                // 更新config.json
                const config = JSON.parse($file.read(`${newPath}/config.json`).string)
                if (config.from === undefined) config.from = from
                config.name = newName
                $file.write({
                    data: $data({ string: JSON.stringify(config) }),
                    path: `${newPath}/config.json`
                })
                this.kernel.updateHomeScreenWidgetOptions()
                if (typeof callback === "function") callback()
            }
        })
    }

    deleteWidget(name, callback) {
        $ui.alert({
            title: $l10n("CONFIRM_DELETE_MSG"),
            actions: [
                {
                    title: $l10n("DELETE"),
                    style: $alertActionType.destructive,
                    handler: () => {
                        $file.delete(`${this.kernel.widgetRootPath}/${name}`)
                        // 删除数据文件
                        $file.delete(`${this.kernel.widgetDataPath}/${name}`)
                        if (typeof callback === "function") callback()
                    }
                },
                { title: $l10n("CANCEL") }
            ]
        })
    }

    getView() {
        return {
            type: "list",
            props: {
                id: "waio-home-list",
                rowHeight: 100,
                data: this.getWidgetListView(),
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
                            this.copyWidget(sender.object(indexPath).name, () => {
                                // 更新列表
                                setTimeout(() => { sender.data = this.getWidgetListView() }, 200)
                            })
                        }
                    },
                    {
                        title: $l10n("DELETE"),
                        color: $color("red"),
                        handler: (sender, indexPath) => {
                            this.deleteWidget(sender.object(indexPath).name, () => {
                                sender.delete(indexPath)
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
    }
}

module.exports = HomeUI