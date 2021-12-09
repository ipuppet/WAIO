const { UIKit } = require("../../easy-jsbox")

class Album {
    constructor(kernel, setting) {
        this.kernel = kernel
        this.setting = setting
        this.albumPath = `${this.kernel.widgetDataPath}/${this.setting.widget}/pictures`
        this.mode = 0 // 0: 正常模式  1: 多选模式
        this.selected = {}
        this.selectedImageCounter = "selectedImageCounter"
        this.selectedImageCount = "selectedImageCount"
        this.imageType = {
            original: "original",
            compressed: "compressed",
            preview: "preview"
        }
        this.initStorageStructure()
    }

    initStorageStructure() {
        if (!$file.isDirectory(`${this.albumPath}/${this.imageType.original}`)) {
            $file.mkdir(`${this.albumPath}/${this.imageType.original}`)
        }
        if (!$file.isDirectory(`${this.albumPath}/${this.imageType.compressed}`)) {
            $file.mkdir(`${this.albumPath}/${this.imageType.compressed}`)
        }
        if (!$file.isDirectory(`${this.albumPath}/${this.imageType.preview}`)) {
            $file.mkdir(`${this.albumPath}/${this.imageType.preview}`)
        }
        // TODO 将在未来删除 向下兼容，重构结构
        if ($file.isDirectory(`${this.albumPath}/archive`)) {
            $file.move({
                src: `${this.albumPath}/archive`,
                dst: `${this.albumPath}/${this.imageType.compressed}`
            })
        }
        $file.list(this.albumPath).forEach(item => {
            if (!$file.isDirectory(`${this.albumPath}/${item}`)) {
                $file.move({
                    src: `${this.albumPath}/${item}`,
                    dst: `${this.albumPath}/${this.imageType.original}/${item}`
                })
            }
        })
    }

    /**
     * 获取所有图片
     * @param {String} imageType this.imageType
     */
    getImages(imageType) {
        const images = $file.list(`${this.albumPath}/${imageType}`)
        return images.length > 0 ? images.map(image => {
            return `${this.albumPath}/${imageType}/${image}`
        }) : []
    }

    deleteImage(src, indexPath, alert = true) {
        const action = () => {
            const name = src.slice(src.lastIndexOf("/"))
            $file.delete(`${this.albumPath}/${this.imageType.original}/${name}`)
            $file.delete(`${this.albumPath}/${this.imageType.compressed}/${name}`)
            $file.delete(`${this.albumPath}/${this.imageType.preview}/${name}`)
            // 调整 UI
            if (indexPath) {
                const sender = $("picture-edit-matrix")
                sender.delete(indexPath)
                // 检查是否已经为空，为空则显示提示字样
                if (sender.data.length === 0) {
                    $("no-image-text").hidden = false
                    sender.hidden = true
                }
            }
        }
        if (alert) {
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
                            action()
                        }
                    }, style),
                    { title: $l10n("CANCEL") }
                ]
            })
        } else { action() }
    }

    previewImage(index, data) {
        $quicklook.open({
            data: $data({ path: data.replace(this.imageType.preview, this.imageType.original) })
        })
        return
        // TODO 画廊无法设置 page，且切换过程 page 混乱
        const getData = originalImageIndex => {
            return this.getImages(this.imageType.preview).map((image, index) => {
                if (originalImageIndex - 1 <= index && index <= originalImageIndex + 1) {
                    image = image.replace(this.imageType.preview, this.imageType.original)
                }
                return {
                    type: "image",
                    props: {
                        src: image
                    }
                }
            })
        }
        UIKit.push({
            views: [{
                type: "gallery",
                props: {
                    items: getData(index),
                    hidden: true,
                    page: index,
                    interval: 0
                },
                events: {
                    ready: sender => {
                        setTimeout(() => {
                            //sender.scrollToPage(index)
                            setTimeout(() => {
                                sender.hidden = false
                            }, 500)
                        }, 100)
                    },
                    changed: sender => {
                        console.log(sender.page)
                        sender.items = getData(sender.page)
                    }
                },
                layout: $layout.fill
            }]
        })
    }

    multipleSelectionMode(sender, indexPath, data) {
        if (this.selected[data.image.src]) {
            sender.cell(indexPath).alpha = 1
            delete this.selected[data.image.src]
        } else {
            sender.cell(indexPath).alpha = 0.2
            this.selected[data.image.src] = {
                indexPath: indexPath,
                data: data
            }
        }
        $(this.selectedImageCount).text = Object.keys(this.selected).length
    }

    changeMode() {
        const matrix = $("picture-edit-matrix")
        switch (this.mode) {
            case 0: // 切换到多选模式
                if (matrix.data.length === 0) {
                    $ui.toast($l10n("NO_IMAGES"))
                    break
                }
                this.mode = 1
                $(this.selectedImageCounter).hidden = false // 计数器控制
                break
            case 1:
                this.mode = 0
                $(this.selectedImageCounter).hidden = true
                // 恢复选中的选项
                try {
                    Object.values(this.selected).forEach(item => {
                        matrix.cell(item.indexPath).alpha = 1
                    })
                } catch (error) { }
                break
        }
        // 清空数据
        this.selected = {}
    }

    getAlbumButtons() {
        return [
            { // 添加新图片
                symbol: "plus",
                handler: () => {
                    $ui.menu({
                        items: [$l10n("SYSTEM_ALBUM"), "iCloud"],
                        handler: (title, idx) => {
                            const saveImageAction = (data, index) => {
                                const extension = data.fileName.slice(data.fileName.lastIndexOf("."))
                                const fileName = Date.now() + index + extension
                                // original
                                $file.write({
                                    data: data,
                                    path: `${this.albumPath}/${this.imageType.original}/${fileName}`
                                })
                                this.kernel.print(`original saved:`)
                                this.kernel.print(fileName)
                                const image = this.kernel.compressImage(data.image)
                                // preview
                                $file.write({
                                    data: image.jpg(0.1),
                                    path: `${this.albumPath}/${this.imageType.preview}/${fileName}`
                                })
                                // compressed
                                if (this.setting.get("useCompressedImage")) {
                                    $file.write({
                                        data: image.jpg(0.8),
                                        path: `${this.albumPath}/${this.imageType.compressed}/${fileName}`
                                    })
                                }
                                this.kernel.print(`compressed & preview saved:`)
                                this.kernel.print(fileName)
                                // UI 隐藏无图片提示字符
                                if (!$("no-image-text").hidden) $("no-image-text").hidden = true
                                // UI 插入图片
                                const matrix = $("picture-edit-matrix")
                                matrix.hidden = false
                                matrix.insert({
                                    indexPath: $indexPath(0, matrix.data.length),
                                    value: {
                                        image: { src: `${this.albumPath}/${this.imageType.preview}/${fileName}` }
                                    }
                                })
                            }
                            if (idx === 0) { // 从系统相册选取图片
                                $photo.pick({
                                    format: "data",
                                    multi: true,
                                    handler: resp => {
                                        if (!resp.status && resp.error.description !== "canceled") {
                                            $ui.error($l10n("ERROR"))
                                            return
                                        }
                                        if (!resp.results) {
                                            return
                                        }
                                        $ui.toast($l10n("LOADING"))
                                        resp.results.forEach((image, index) => {
                                            // TODO 文件操作会阻塞整个程序
                                            $thread.background({
                                                delay: 0,
                                                handler: () => {
                                                    saveImageAction(image.data, index)
                                                }
                                            })
                                        })
                                    }
                                })
                            } else if (idx === 1) { // 从iCloud选取图片
                                $drive.open({
                                    handler: file => {
                                        if (!file) {
                                            return
                                        }
                                        saveImageAction(file, 0)
                                        $ui.toast($l10n("SUCCESS"))
                                    }
                                })
                            }
                        }
                    })
                }
            },
            {
                symbol: "trash",
                handler: () => {
                    let length = Object.keys(this.selected).length
                    if (this.mode === 1 && length > 0) {
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
                                        for (let i = $("picture-edit-matrix").data.length - 1; i >= 0; i--) {
                                            if (length === 0) break
                                            Object.values(this.selected).forEach(item => {
                                                if (i === item.indexPath.item) {
                                                    this.deleteImage(item.data.image.src, item.indexPath, false)
                                                    length--
                                                }
                                            })
                                        }
                                        this.changeMode() // 切换回普通模式
                                    }
                                }, style),
                                {
                                    title: $l10n("CANCEL")
                                }
                            ]
                        })
                    } else {
                        $ui.toast($l10n("NO_SELECTED_IMAGE"))
                    }
                }
            }
        ]
    }

    getAlbumView() {
        const pictures = this.getImages(this.imageType.preview).map(item => ({
            image: { src: item }
        }))
        return [
            { // 无图片提示字符
                type: "label",
                layout: $layout.fill,
                props: {
                    id: "no-image-text",
                    hidden: pictures.length > 0 ? true : false,
                    text: $l10n("NO_IMAGES"),
                    color: $color("secondaryText"),
                    align: $align.center
                }
            },
            { // 图片列表
                type: "matrix",
                props: {
                    id: "picture-edit-matrix",
                    hidden: pictures.length > 0 ? false : true,
                    columns: this.setting.get("columns"),
                    square: true,
                    data: pictures,
                    menu: {
                        title: $l10n("MENU"),
                        items: [
                            {
                                title: $l10n("SAVE_TO_SYSTEM_ALBUM"),
                                symbol: "square.and.arrow.down",
                                handler: (sender, indexPath) => {
                                    const data = sender.object(indexPath)
                                    $photo.save({
                                        data: $file.read(data.image.src),
                                        handler: success => {
                                            if (success)
                                                $ui.success($l10n("SUCCESS"))
                                            else
                                                $ui.error($l10n("ERROR"))
                                        }
                                    })
                                }
                            },
                            {
                                title: $l10n("SELECT"),
                                symbol: "square.grid.2x2",
                                handler: (sender, indexPath) => {
                                    this.changeMode()
                                    setTimeout(() => {
                                        const data = sender.object(indexPath)
                                        this.multipleSelectionMode(sender, indexPath, data)
                                    }, 10)
                                }
                            },
                            {
                                title: $l10n("DELETE"),
                                destructive: true,
                                symbol: "trash",
                                handler: (sender, indexPath) => {
                                    const data = sender.object(indexPath)
                                    this.deleteImage(data.image.src, indexPath)
                                }
                            }
                        ]
                    },
                    template: {
                        props: {},
                        views: [
                            {
                                type: "image",
                                props: {
                                    id: "image"
                                },
                                layout: make => {
                                    make.size.equalTo($device.info.screen.width / this.setting.get("columns"))
                                }
                            }
                        ]
                    }
                },
                events: {
                    didSelect: (sender, indexPath, data) => {
                        switch (this.mode) {
                            case 0:
                                this.previewImage(indexPath.item, data.image.src)
                                break
                            case 1:
                                this.multipleSelectionMode(sender, indexPath, data)
                                break
                        }
                    }
                },
                layout: $layout.fill
            },
            { // 选中图片指示器
                type: "view",
                props: {
                    id: this.selectedImageCounter,
                    hidden: true
                },
                layout: (make, view) => {
                    make.left.top.equalTo(10)
                    make.width.equalTo(100)
                    make.height.equalTo(30)
                },
                views: [
                    {
                        type: "view",
                        props: {
                            alpha: 0.8,
                            bgcolor: $color("#adadad"),
                            cornerRadius: 5,
                            smoothCorners: true
                        },
                        layout: $layout.fill
                    },
                    {
                        type: "label",
                        props: {
                            id: this.selectedImageCount,
                            text: "1",
                            lines: 1,
                            textColor: $color("#ffffff"),
                            align: $align.center
                        },
                        layout: (make, view) => {
                            make.left.equalTo(10)
                            make.top.inset(5)
                        }
                    },
                    {
                        type: "button",
                        props: {
                            bgcolor: $color("clear"),
                            fot: $font(12),
                            title: $l10n("CANCEL"),
                            titleColor: $color("#ffffff")
                        },
                        events: {
                            tapped: () => {
                                if (this.mode === 0) return
                                this.changeMode()
                            }
                        },
                        layout: (make, view) => {
                            make.right.equalTo(view.super).offset(-5)
                            make.height.equalTo(30)
                            make.top.inset(0)
                        }
                    }
                ]
            }
        ]
    }
}

module.exports = Album