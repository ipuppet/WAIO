var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire94c2"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire94c2"] = parcelRequire;
}
parcelRequire.register("7Efsa", function(module, exports) {

var $5918418d6afcdbce$require$Controller = $148154be0b117222$exports.Controller;

var $5918418d6afcdbce$require$l10n = $d82e3dbdc05d08e1$exports.l10n;

var $5918418d6afcdbce$require$UIKit = $43f719df810a67fe$exports.UIKit;

var $5918418d6afcdbce$require$FileStorage = $d98b0c7ec7b0e4b6$exports.FileStorage;

var $gEL05 = parcelRequire("gEL05");
var $5918418d6afcdbce$require$NavigationView = $gEL05.NavigationView;

var $1gPEj = parcelRequire("1gPEj");
var $5918418d6afcdbce$require$NavigationBar = $1gPEj.NavigationBar;

var $4k0q0 = parcelRequire("4k0q0");
var $5918418d6afcdbce$require$ViewController = $4k0q0.ViewController;
class SettingLoadConfigError extends Error {
    constructor(){
        super("Call loadConfig() first.");
        this.name = "SettingLoadConfigError";
    }
}
class SettingReadonlyError extends Error {
    constructor(){
        super("Attempted to assign to readonly property.");
        this.name = "SettingReadonlyError";
    }
}
/**
 * @property {function(key: string, value: any)} Setting.events.onSet 键值发生改变
 * @property {function(view: Object,title: string)} Setting.events.onChildPush 进入的子页面
 */ class Setting extends $5918418d6afcdbce$require$Controller {
    name;
    // 存储数据
    setting = {
    };
    // 初始用户数据，若未定义则尝试从给定的文件读取
    userData;
    // fileStorage
    fileStorage;
    imagePath;
    // 用来控制 child 类型
    viewController = new $5918418d6afcdbce$require$ViewController();
    // 用于存放 script 类型用到的方法
    method = {
    };
    // style
    rowHeight = 50;
    edgeOffset = 10;
    iconSize = 30;
    // withTouchEvents 延时自动关闭高亮，防止 touchesMoved 事件未正常调用
    #withTouchEventsT = {
    };
    // read only
    #readonly = false;
    // 判断是否已经加载数据加载
    #loadConfigStatus = false;
    #footer;
    /**
     *
     * @param {Object} args
     * @param {Function} args.set 自定义 set 方法，定义后将忽略 fileStorage 和 dataFile
     * @param {Function} args.get 自定义 get 方法，定义后将忽略 fileStorage 和 dataFile
     * @param {Object} args.userData 初始用户数据，定义后将忽略 fileStorage 和 dataFile
     * @param {FileStorage} args.fileStorage FileStorage 对象，用于文件操作
     * @param {string} args.dataFile 持久化数据保存文件
     * @param {Object} args.structure 设置项结构
     * @param {string} args.structurePath 结构路径，优先级低于 structure
     * @param {boolean} args.isUseJsboxNav 是否使用 JSBox 默认 nav 样式
     * @param {string} args.name 唯一名称，默认分配一个 UUID
     */ constructor(args = {
    }){
        super();
        // set 和 get 同时设置才会生效
        if (typeof args.set === "function" && typeof args.get === "function") {
            this.set = args.set;
            this.get = args.get;
            this.userData = args.userData;
        } else {
            this.fileStorage = args.fileStorage ?? new $5918418d6afcdbce$require$FileStorage();
            this.dataFile = args.dataFile ?? "setting.json";
        }
        if (args.structure) this.setStructure(args.structure) // structure 优先级高于 structurePath
        ;
        else this.setStructurePath(args.structurePath ?? "setting.json");
        this.isUseJsboxNav = args.isUseJsboxNav ?? false;
        // 不能使用 uuid
        this.imagePath = (args.name ?? "default") + ".image";
        this.setName(args.name ?? $text.uuid);
        // l10n
        this.loadL10n();
    }
    useJsboxNav() {
        this.isUseJsboxNav = true;
        return this;
    }
     #checkLoadConfigError() {
        if (!this.#loadConfigStatus) throw new SettingLoadConfigError();
    }
    /**
     * 从 this.structure 加载数据
     * @returns {this}
     */ loadConfig() {
        const exclude = [
            "script",
            "info"
        ];
        const userData = this.userData ?? this.fileStorage.readAsJSON("", this.dataFile, {
        });
        function setValue(structure) {
            const setting = {
            };
            for (let section of structure)for (let item of section.items){
                if (item.type === "child") {
                    const child = setValue(item.children);
                    Object.assign(setting, child);
                } else if (exclude.indexOf(item.type) === -1) setting[item.key] = item.key in userData ? userData[item.key] : item.value;
                else // 被排除的项目直接赋值
                setting[item.key] = item.value;
            }
            return setting;
        }
        this.setting = setValue(this.structure);
        this.#loadConfigStatus = true;
        return this;
    }
    hasSectionTitle(structure) {
        this.#checkLoadConfigError();
        return structure[0]["title"] ? true : false;
    }
    loadL10n() {
        $5918418d6afcdbce$require$l10n("zh-Hans", `
            "OK" = "好";
            "CANCEL" = "取消";
            "CLEAR" = "清除";
            "BACK" = "返回";
            "ERROR" = "发生错误";
            "SUCCESS" = "成功";
            "LOADING" = "加载中";
            "INVALID_VALUE" = "非法参数";
            
            "SETTING" = "设置";
            "GENERAL" = "一般";
            "ADVANCED" = "高级";
            "TIPS" = "小贴士";
            "COLOR" = "颜色";
            "COPY" = "复制";
            "COPIED" = "复制成功";
            
            "JSBOX_ICON" = "JSBox 内置图标";
            "SF_SYMBOLS" = "SF Symbols";
            "IMAGE_BASE64" = "图片 / base64";

            "PREVIEW" = "预览";
            "SELECT_IMAGE" = "选择图片";
            "CLEAR_IMAGE" = "清除图片";
            "NO_IMAGE" = "无图片";
            
            "ABOUT" = "关于";
            "VERSION" = "Version";
            "AUTHOR" = "作者";
            "AT_BOTTOM" = "已经到底啦~";
            `, false);
        $5918418d6afcdbce$require$l10n("en", `
            "OK" = "OK";
            "CANCEL" = "Cancel";
            "CLEAR" = "Clear";
            "BACK" = "Back";
            "ERROR" = "Error";
            "SUCCESS" = "Success";
            "LOADING" = "Loading";
            "INVALID_VALUE" = "Invalid value";

            "SETTING" = "Setting";
            "GENERAL" = "General";
            "ADVANCED" = "Advanced";
            "TIPS" = "Tips";
            "COLOR" = "Color";
            "COPY" = "Copy";
            "COPIED" = "Copide";

            "JSBOX_ICON" = "JSBox in app icon";
            "SF_SYMBOLS" = "SF Symbols";
            "IMAGE_BASE64" = "Image / base64";

            "PREVIEW" = "Preview";
            "SELECT_IMAGE" = "Select Image";
            "CLEAR_IMAGE" = "Clear Image";
            "NO_IMAGE" = "No Image";

            "ABOUT" = "About";
            "VERSION" = "Version";
            "AUTHOR" = "Author";
            "AT_BOTTOM" = "It's the end~";
            `, false);
    }
    setUserData(userData) {
        this.userData = userData;
    }
    setStructure(structure) {
        this.structure = structure;
        return this;
    }
    /**
     * 设置结构文件目录。
     * 若调用了 setStructure(structure) 或构造函数传递了 structure 数据，则不会加载结构文件
     * @param {string} structurePath
     * @returns {this}
     */ setStructurePath(structurePath) {
        if (!this.structure) this.setStructure($5918418d6afcdbce$require$FileStorage.readFromRootAsJSON(structurePath));
        return this;
    }
    /**
     * 设置一个独一无二的名字，防止多个 Setting 导致 UI 冲突
     * @param {string} name 名字
     */ setName(name) {
        this.name = name;
        return this;
    }
    setFooter(footer) {
        this.#footer = footer;
        return this;
    }
    set footer(footer) {
        this.#footer = footer;
    }
    get footer() {
        if (this.#footer === undefined) {
            let info = $5918418d6afcdbce$require$FileStorage.readFromRootAsJSON("config.json", {
            })["info"] ?? {
            };
            if (!info.version || !info.author) try {
                info = __INFO__;
            } catch  {
            }
            this.#footer = info.version && info.author ? {
                type: "view",
                props: {
                    height: 130
                },
                views: [
                    {
                        type: "label",
                        props: {
                            font: $font(14),
                            text: `${$l10n("VERSION")} ${info.version} ♥ ${info.author}`,
                            textColor: $color({
                                light: "#C0C0C0",
                                dark: "#545454"
                            }),
                            align: $align.center
                        },
                        layout: (make)=>{
                            make.left.right.inset(0);
                            make.top.inset(10);
                        }
                    }
                ]
            } : {
            };
        }
        return this.#footer;
    }
    setReadonly() {
        this.#readonly = true;
        return this;
    }
    set(key, value) {
        if (this.#readonly) throw new SettingReadonlyError();
        this.#checkLoadConfigError();
        this.setting[key] = value;
        this.fileStorage.write("", this.dataFile, $data({
            string: JSON.stringify(this.setting)
        }));
        this.callEvent("onSet", key, value);
        return true;
    }
    get(key, _default = null) {
        this.#checkLoadConfigError();
        if (Object.prototype.hasOwnProperty.call(this.setting, key)) return this.setting[key];
        else return _default;
    }
    getColor(color) {
        return typeof color === "string" ? $color(color) : $rgba(color.red, color.green, color.blue, color.alpha);
    }
    getImageName(key, compress = false) {
        let name = $text.MD5(key) + ".jpg";
        if (compress) name = "compress." + name;
        return name;
    }
    getImage(key, compress = false) {
        try {
            const name = this.getImageName(key, compress);
            return this.fileStorage.read(this.imagePath, name).image;
        } catch (error) {
            if (error instanceof FileStorageFileNotFoundError) return null;
            throw error;
        }
    }
    getId(key) {
        return `setting-${this.name}-${key}`;
    }
     #touchHighlightStart(id) {
        $(id).bgcolor = $color("systemFill");
    }
     #touchHighlightEnd(id1, duration = 0.3) {
        if (duration === 0) $(id1).bgcolor = $color("clear");
        else $ui.animate({
            duration: duration,
            animation: ()=>{
                $(id1).bgcolor = $color("clear");
            }
        });
    }
     #withTouchEvents(id2, events, withTappedHighlight = false, highlightEndDelay = 0) {
        events = Object.assign(events, {
            touchesBegan: ()=>{
                this.#touchHighlightStart(id2);
                // 延时自动关闭高亮，防止 touchesMoved 事件未正常调用
                this.#withTouchEventsT[id2] = $delay(1, ()=>this.#touchHighlightEnd(id2, 0)
                );
            },
            touchesMoved: ()=>{
                this.#withTouchEventsT[id2]?.cancel();
                this.#touchHighlightEnd(id2, 0);
            }
        });
        if (withTappedHighlight) {
            const tapped = events.tapped;
            events.tapped = ()=>{
                // highlight
                this.#touchHighlightStart(id2);
                setTimeout(()=>this.#touchHighlightEnd(id2)
                , highlightEndDelay * 1000);
                if (typeof tapped === "function") tapped();
            };
        }
        return events;
    }
    createLineLabel(title, icon) {
        if (!icon[1]) icon[1] = "#00CC00";
        if (typeof icon[1] !== "object") icon[1] = [
            icon[1],
            icon[1]
        ];
        if (typeof icon[0] !== "object") icon[0] = [
            icon[0],
            icon[0]
        ];
        return {
            type: "view",
            views: [
                {
                    // icon
                    type: "view",
                    props: {
                        bgcolor: $color(icon[1][0], icon[1][1]),
                        cornerRadius: 5,
                        smoothCorners: true
                    },
                    views: [
                        {
                            type: "image",
                            props: {
                                tintColor: $color("white"),
                                image: $image(icon[0][0], icon[0][1])
                            },
                            layout: (make, view)=>{
                                make.center.equalTo(view.super);
                                make.size.equalTo(20);
                            }
                        }
                    ],
                    layout: (make, view)=>{
                        make.centerY.equalTo(view.super);
                        make.size.equalTo(this.iconSize);
                        make.left.inset(this.edgeOffset);
                    }
                },
                {
                    // title
                    type: "label",
                    props: {
                        text: title,
                        lines: 1,
                        textColor: this.textColor,
                        align: $align.left
                    },
                    layout: (make, view)=>{
                        make.centerY.equalTo(view.super);
                        make.height.equalTo(view.super);
                        make.left.equalTo(view.prev.right).offset(this.edgeOffset);
                    }
                }
            ],
            layout: (make, view)=>{
                make.height.centerY.equalTo(view.super);
                make.left.inset(0);
            }
        };
    }
    createInfo(icon, title, value) {
        const isArray = Array.isArray(value);
        const text = isArray ? value[0] : value;
        const moreInfo = isArray ? value[1] : value;
        return {
            type: "view",
            props: {
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "label",
                    props: {
                        text: text,
                        align: $align.right,
                        textColor: $color("darkGray")
                    },
                    layout: (make, view)=>{
                        make.centerY.equalTo(view.prev);
                        make.right.inset(this.edgeOffset);
                        make.width.equalTo(180);
                    }
                },
                {
                    // 监听点击动作
                    type: "view",
                    events: {
                        tapped: ()=>{
                            $ui.alert({
                                title: title,
                                message: moreInfo,
                                actions: [
                                    {
                                        title: $l10n("COPY"),
                                        handler: ()=>{
                                            $clipboard.text = moreInfo;
                                            $ui.toast($l10n("COPIED"));
                                        }
                                    },
                                    {
                                        title: $l10n("OK")
                                    }
                                ]
                            });
                        }
                    },
                    layout: (make, view)=>{
                        make.right.inset(0);
                        make.size.equalTo(view.super);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    createSwitch(key, icon, title) {
        const id3 = this.getId(key);
        return {
            type: "view",
            props: {
                id: id3,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "switch",
                    props: {
                        on: this.get(key),
                        onColor: $color("#00CC00")
                    },
                    events: {
                        changed: (sender)=>{
                            try {
                                this.set(key, sender.on);
                            } catch (error) {
                                // 恢复开关状态
                                sender.on = !sender.on;
                                throw error;
                            }
                        }
                    },
                    layout: (make, view)=>{
                        make.centerY.equalTo(view.prev);
                        make.right.inset(this.edgeOffset);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    createString(key, icon, title) {
        const id4 = this.getId(key);
        return {
            type: "view",
            props: {
                id: id4,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "button",
                    props: {
                        symbol: "square.and.pencil",
                        bgcolor: $color("clear"),
                        tintColor: $color("primaryText")
                    },
                    events: {
                        tapped: (sender)=>{
                            const popover = $ui.popover({
                                sourceView: sender,
                                sourceRect: sender.bounds,
                                directions: $popoverDirection.down,
                                size: $size(320, 150),
                                views: [
                                    {
                                        type: "text",
                                        props: {
                                            id: `${this.name}-string-${key}`,
                                            align: $align.left,
                                            text: this.get(key)
                                        },
                                        layout: (make)=>{
                                            make.left.right.inset(10);
                                            make.top.inset(20);
                                            make.height.equalTo(90);
                                        }
                                    },
                                    {
                                        type: "button",
                                        props: {
                                            symbol: "checkmark",
                                            bgcolor: $color("clear"),
                                            titleEdgeInsets: 10,
                                            contentEdgeInsets: 0
                                        },
                                        layout: (make)=>{
                                            make.right.inset(10);
                                            make.bottom.inset(25);
                                            make.size.equalTo(30);
                                        },
                                        events: {
                                            tapped: ()=>{
                                                this.set(key, $(`${this.name}-string-${key}`).text);
                                                popover.dismiss();
                                            }
                                        }
                                    }
                                ]
                            });
                        }
                    },
                    layout: (make, view)=>{
                        make.centerY.equalTo(view.prev);
                        make.right.inset(0);
                        make.size.equalTo(50);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    createNumber(key, icon, title) {
        const id5 = this.getId(key);
        const labelId = `${id5}-label`;
        return {
            type: "view",
            props: {
                id: id5,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "label",
                    props: {
                        id: labelId,
                        align: $align.right,
                        text: this.get(key)
                    },
                    events: {
                        tapped: ()=>{
                            $input.text({
                                type: $kbType.decimal,
                                text: this.get(key),
                                placeholder: title,
                                handler: (text)=>{
                                    const isNumber = (str)=>{
                                        const reg = /^[0-9]+.?[0-9]*$/;
                                        return reg.test(str);
                                    };
                                    if (text === "" || !isNumber(text)) {
                                        $ui.toast($l10n("INVALID_VALUE"));
                                        return;
                                    }
                                    this.set(key, text);
                                    $(labelId).text = text;
                                }
                            });
                        }
                    },
                    layout: (make, view)=>{
                        make.centerY.equalTo(view.prev);
                        make.right.inset(this.edgeOffset);
                        make.height.equalTo(this.rowHeight);
                        make.width.equalTo(100);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    createStepper(key, icon, title, min, max) {
        const id6 = this.getId(key);
        const labelId = `${id6}-label`;
        return {
            type: "view",
            props: {
                id: id6,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "label",
                    props: {
                        id: labelId,
                        text: this.get(key),
                        textColor: this.textColor,
                        align: $align.left
                    },
                    layout: (make, view)=>{
                        make.height.equalTo(view.super);
                        make.right.inset(120);
                    }
                },
                {
                    type: "stepper",
                    props: {
                        min: min,
                        max: max,
                        value: this.get(key)
                    },
                    events: {
                        changed: (sender)=>{
                            $(labelId).text = sender.value;
                            try {
                                this.set(key, sender.value);
                            } catch (error) {
                                // 恢复标签显示数据
                                $(labelId).text = this.get(key);
                                throw error;
                            }
                        }
                    },
                    layout: (make, view)=>{
                        make.centerY.equalTo(view.prev);
                        make.right.inset(this.edgeOffset);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    createScript(key, icon, title, script) {
        const id7 = this.getId(key);
        const buttonId = `${id7}-button`;
        const actionStart = ()=>{
            // 隐藏 button，显示 spinner
            $(buttonId).alpha = 0;
            $(`${buttonId}-spinner`).alpha = 1;
            this.#touchHighlightStart(id7);
        };
        const actionCancel = ()=>{
            $(buttonId).alpha = 1;
            $(`${buttonId}-spinner`).alpha = 0;
            this.#touchHighlightEnd(id7);
        };
        const actionDone = (status = true, message = $l10n("ERROR"))=>{
            $(`${buttonId}-spinner`).alpha = 0;
            this.#touchHighlightEnd(id7);
            const button = $(buttonId);
            if (!status) {
                // 失败
                $ui.toast(message);
                button.alpha = 1;
                return;
            }
            // 成功动画
            button.symbol = "checkmark";
            $ui.animate({
                duration: 0.6,
                animation: ()=>{
                    button.alpha = 1;
                },
                completion: ()=>{
                    setTimeout(()=>{
                        $ui.animate({
                            duration: 0.4,
                            animation: ()=>{
                                button.alpha = 0;
                            },
                            completion: ()=>{
                                button.symbol = "chevron.right";
                                $ui.animate({
                                    duration: 0.4,
                                    animation: ()=>{
                                        button.alpha = 1;
                                    },
                                    completion: ()=>{
                                        button.alpha = 1;
                                    }
                                });
                            }
                        });
                    }, 600);
                }
            });
        };
        return {
            type: "view",
            props: {
                id: id7
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "view",
                    views: [
                        {
                            // 仅用于显示图片
                            type: "image",
                            props: {
                                id: buttonId,
                                symbol: "chevron.right",
                                tintColor: $color("secondaryText")
                            },
                            layout: (make, view)=>{
                                make.centerY.equalTo(view.super);
                                make.right.inset(0);
                                make.size.equalTo(15);
                            }
                        },
                        {
                            type: "spinner",
                            props: {
                                id: `${buttonId}-spinner`,
                                loading: true,
                                alpha: 0
                            },
                            layout: (make, view)=>{
                                make.size.equalTo(view.prev);
                                make.left.top.equalTo(view.prev);
                            }
                        }
                    ],
                    layout: (make, view)=>{
                        make.right.inset(this.edgeOffset);
                        make.height.equalTo(this.rowHeight);
                        make.width.equalTo(view.super);
                    }
                }
            ],
            events: this.#withTouchEvents(id7, {
                tapped: ()=>{
                    // 生成开始事件和结束事件动画，供函数调用
                    const animate = {
                        actionStart: actionStart,
                        actionCancel: actionCancel,
                        actionDone: actionDone,
                        touchHighlightStart: ()=>this.#touchHighlightStart(id7)
                        ,
                        touchHighlightEnd: ()=>this.#touchHighlightEnd(id7) // 被点击的一行颜色恢复
                    };
                    // 执行代码
                    if (typeof script === "function") script(animate);
                    else if (script.startsWith("this")) // 传递 animate 对象
                    eval(`(()=>{return ${script}(animate)})()`);
                    else eval(script);
                }
            }),
            layout: $layout.fill
        };
    }
    createTab(key, icon, title, items, values) {
        if (typeof items === "string") items = eval(`(()=>{return ${items}()})()`);
        else if (typeof items === "function") items = items();
        if (typeof values === "string") values = eval(`(()=>{return ${values}()})()`);
        else if (typeof values === "function") values = values();
        const id8 = this.getId(key);
        const isCustomizeValues = items?.length > 0 && values?.length === items?.length;
        return {
            type: "view",
            props: {
                id: id8,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "tab",
                    props: {
                        items: items ?? [],
                        index: isCustomizeValues ? values.indexOf(this.get(key)) : this.get(key),
                        dynamicWidth: true
                    },
                    layout: (make, view)=>{
                        make.right.inset(this.edgeOffset);
                        make.centerY.equalTo(view.prev);
                    },
                    events: {
                        changed: (sender)=>{
                            if (isCustomizeValues) this.set(key, values[sender.index]);
                            else this.set(key, sender.index);
                        }
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    createMenu(key, icon, title1, items, values) {
        const id9 = this.getId(key);
        const labelId = `${id9}-label`;
        // 数据生成函数
        const getItems = ()=>{
            let res;
            if (typeof items === "string") res = eval(`(()=>{return ${items}()})()`);
            else if (typeof items === "function") res = items();
            else res = items ?? [];
            return res;
        };
        const getValues = ()=>{
            let res;
            if (typeof values === "string") res = eval(`(()=>{return ${values}()})()`);
            else if (typeof values === "function") res = values();
            else res = values;
            return res;
        };
        const tmpItems1 = getItems();
        const tmpValues1 = getValues();
        const isCustomizeValues = tmpItems1?.length > 0 && tmpValues1?.length === tmpItems1?.length;
        return {
            type: "view",
            props: {
                id: id9,
                selectable: true
            },
            views: [
                this.createLineLabel(title1, icon),
                {
                    type: "view",
                    views: [
                        {
                            type: "label",
                            props: {
                                text: isCustomizeValues ? tmpItems1[tmpValues1.indexOf(this.get(key))] : tmpItems1[this.get(key)],
                                color: $color("secondaryText"),
                                id: labelId
                            },
                            layout: (make, view)=>{
                                make.right.inset(0);
                                make.height.equalTo(view.super);
                            }
                        }
                    ],
                    layout: (make, view)=>{
                        make.right.inset(this.edgeOffset);
                        make.height.equalTo(this.rowHeight);
                        make.width.equalTo(view.super);
                    }
                }
            ],
            events: {
                tapped: ()=>{
                    const tmpItems = getItems();
                    const tmpValues = getValues();
                    $ui.menu({
                        items: tmpItems,
                        handler: (title, idx)=>{
                            if (isCustomizeValues) this.set(key, tmpValues[idx]);
                            else this.set(key, idx);
                            $(labelId).text = $l10n(title);
                        }
                    });
                }
            },
            layout: $layout.fill
        };
    }
    createColor(key, icon, title) {
        const id10 = this.getId(key);
        const colorId = `${id10}-color`;
        return {
            type: "view",
            props: {
                id: id10,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "view",
                    views: [
                        {
                            // 颜色预览以及按钮功能
                            type: "view",
                            props: {
                                id: colorId,
                                bgcolor: this.getColor(this.get(key)),
                                circular: true,
                                borderWidth: 1,
                                borderColor: $color("#e3e3e3")
                            },
                            layout: (make, view)=>{
                                make.centerY.equalTo(view.super);
                                make.right.inset(this.edgeOffset);
                                make.size.equalTo(20);
                            }
                        },
                        {
                            // 用来监听点击事件，增大可点击面积
                            type: "view",
                            events: {
                                tapped: async ()=>{
                                    const color = await $picker.color({
                                        color: this.getColor(this.get(key))
                                    });
                                    this.set(key, color.components);
                                    $(colorId).bgcolor = $rgba(color.components.red, color.components.green, color.components.blue, color.components.alpha);
                                }
                            },
                            layout: (make, view)=>{
                                make.right.inset(0);
                                make.height.width.equalTo(view.super.height);
                            }
                        }
                    ],
                    layout: (make, view)=>{
                        make.height.equalTo(this.rowHeight);
                        make.width.equalTo(view.super);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    createDate(key, icon, title, mode = 2) {
        const id11 = this.getId(key);
        const getFormatDate = (date)=>{
            let str = "";
            if (typeof date === "number") date = new Date(date);
            switch(mode){
                case 0:
                    str = date.toLocaleTimeString();
                    break;
                case 1:
                    str = date.toLocaleDateString();
                    break;
                case 2:
                    str = date.toLocaleString();
                    break;
            }
            return str;
        };
        return {
            type: "view",
            props: {
                id: id11,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "view",
                    views: [
                        {
                            type: "label",
                            props: {
                                id: `${id11}-label`,
                                color: $color("secondaryText"),
                                text: this.get(key) ? getFormatDate(this.get(key)) : "None"
                            },
                            layout: (make, view)=>{
                                make.right.inset(0);
                                make.height.equalTo(view.super);
                            }
                        }
                    ],
                    events: {
                        tapped: async ()=>{
                            const settingData = this.get(key);
                            const date = await $picker.date({
                                props: {
                                    mode: mode,
                                    date: settingData ? settingData : Date.now()
                                }
                            });
                            this.set(key, date.getTime());
                            $(`${id11}-label`).text = getFormatDate(date);
                        }
                    },
                    layout: (make, view)=>{
                        make.right.inset(this.edgeOffset);
                        make.height.equalTo(this.rowHeight);
                        make.width.equalTo(view.super);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    createInput(key, icon, title) {
        const id12 = this.getId(key);
        return {
            type: "view",
            props: {
                id: id12,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "view",
                    views: [
                        {
                            type: "input",
                            props: {
                                align: $align.right,
                                bgcolor: $color("clear"),
                                textColor: $color("secondaryText"),
                                text: this.get(key)
                            },
                            layout: function(make, view) {
                                make.right.inset(0);
                                make.size.equalTo(view.super);
                            },
                            events: {
                                didBeginEditing: ()=>{
                                    // 防止键盘遮挡
                                    if (!$app.autoKeyboardEnabled) $app.autoKeyboardEnabled = true;
                                },
                                returned: (sender)=>{
                                    // 结束编辑，由 didEndEditing 进行保存
                                    sender.blur();
                                },
                                didEndEditing: (sender)=>{
                                    this.set(key, sender.text);
                                    sender.blur();
                                }
                            }
                        }
                    ],
                    layout: (make, view)=>{
                        // 与标题间距 this.edgeOffset
                        make.left.equalTo(view.prev.get("label").right).offset(this.edgeOffset);
                        make.right.inset(this.edgeOffset);
                        make.height.equalTo(view.super);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    /**
     *
     * @param {string} key
     * @param {string} icon
     * @param {string} title
     * @param {Object} events
     * @param {string|Object} bgcolor 指定预览时的背景色，默认 "#000000"
     * @returns {Object}
     */ createIcon(key, icon1, title2, bgcolor = "#000000") {
        const id13 = this.getId(key);
        const imageId = `${id13}-image`;
        return {
            type: "view",
            props: {
                id: id13,
                selectable: true
            },
            views: [
                this.createLineLabel(title2, icon1),
                {
                    type: "view",
                    views: [
                        {
                            type: "image",
                            props: {
                                cornerRadius: 8,
                                bgcolor: typeof bgcolor === "string" ? $color(bgcolor) : bgcolor,
                                smoothCorners: true
                            },
                            layout: (make, view)=>{
                                make.right.inset(this.edgeOffset);
                                make.centerY.equalTo(view.super);
                                make.size.equalTo($size(30, 30));
                            }
                        },
                        {
                            type: "image",
                            props: {
                                id: imageId,
                                image: $image(this.get(key)),
                                icon: $icon(this.get(key).slice(5, this.get(key).indexOf(".")), $color("#ffffff")),
                                tintColor: $color("#ffffff")
                            },
                            layout: (make, view)=>{
                                make.right.equalTo(view.prev).offset(-5);
                                make.centerY.equalTo(view.super);
                                make.size.equalTo($size(20, 20));
                            }
                        }
                    ],
                    events: {
                        tapped: ()=>{
                            $ui.menu({
                                items: [
                                    $l10n("JSBOX_ICON"),
                                    $l10n("SF_SYMBOLS"),
                                    $l10n("IMAGE_BASE64")
                                ],
                                handler: async (title, idx)=>{
                                    if (idx === 0) {
                                        const icon = await $ui.selectIcon();
                                        this.set(key, icon);
                                        $(imageId).icon = $icon(icon.slice(5, icon.indexOf(".")), $color("#ffffff"));
                                    } else if (idx === 1 || idx === 2) $input.text({
                                        text: "",
                                        placeholder: title,
                                        handler: (text)=>{
                                            if (text === "") {
                                                $ui.toast($l10n("INVALID_VALUE"));
                                                return;
                                            }
                                            this.set(key, text);
                                            if (idx === 1) $(imageId).symbol = text;
                                            else $(imageId).image = $image(text);
                                        }
                                    });
                                }
                            });
                        }
                    },
                    layout: (make, view)=>{
                        make.right.inset(0);
                        make.height.equalTo(this.rowHeight);
                        make.width.equalTo(view.super);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
    createChild(key, icon, title, children) {
        const id14 = this.getId(key);
        return {
            type: "view",
            layout: $layout.fill,
            props: {
                id: id14,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    // 仅用于显示图片
                    type: "image",
                    props: {
                        symbol: "chevron.right",
                        tintColor: $color("secondaryText")
                    },
                    layout: (make, view)=>{
                        make.centerY.equalTo(view.super);
                        make.right.inset(this.edgeOffset);
                        make.size.equalTo(15);
                    }
                }
            ],
            events: {
                tapped: ()=>{
                    setTimeout(()=>{
                        if (this.events?.onChildPush) this.callEvent("onChildPush", this.getListView(children, {
                        }), title);
                        else if (this.isUseJsboxNav) $5918418d6afcdbce$require$UIKit.push({
                            title: title,
                            bgcolor: $5918418d6afcdbce$require$UIKit.scrollViewBackgroundColor,
                            views: [
                                this.getListView(children, {
                                })
                            ]
                        });
                        else {
                            const navigationView = new $5918418d6afcdbce$require$NavigationView();
                            navigationView.setView(this.getListView(children, {
                            })).navigationBarTitle(title);
                            navigationView.navigationBarItems.addPopButton();
                            navigationView.navigationBar.setLargeTitleDisplayMode($5918418d6afcdbce$require$NavigationBar.largeTitleDisplayModeNever);
                            if (this.hasSectionTitle(children)) navigationView.navigationBar.setContentViewHeightOffset(-10);
                            this.viewController.push(navigationView);
                        }
                    });
                }
            }
        };
    }
    createImage(key, icon, title) {
        const id15 = this.getId(key);
        const imageId = `${id15}-image`;
        return {
            type: "view",
            props: {
                id: id15,
                selectable: true
            },
            views: [
                this.createLineLabel(title, icon),
                {
                    type: "view",
                    views: [
                        {
                            type: "image",
                            props: {
                                id: imageId,
                                image: this.getImage(key, true) ?? $image("questionmark.square.dashed")
                            },
                            layout: (make, view)=>{
                                make.right.inset(this.edgeOffset);
                                make.centerY.equalTo(view.super);
                                make.size.equalTo($size(30, 30));
                            }
                        }
                    ],
                    events: {
                        tapped: ()=>{
                            this.#touchHighlightStart(id15);
                            $ui.menu({
                                items: [
                                    $l10n("PREVIEW"),
                                    $l10n("SELECT_IMAGE"),
                                    $l10n("CLEAR_IMAGE")
                                ],
                                handler: (title, idx)=>{
                                    if (idx === 0) {
                                        const image = this.getImage(key);
                                        if (image) $quicklook.open({
                                            image: image
                                        });
                                        else $ui.toast($l10n("NO_IMAGE"));
                                    } else if (idx === 1) $photo.pick({
                                        format: "data"
                                    }).then((resp)=>{
                                        $ui.toast($l10n("LOADING"));
                                        if (!resp.status || !resp.data) {
                                            if (resp?.error?.description !== "canceled") $ui.toast($l10n("ERROR"));
                                            return;
                                        }
                                        // 控制压缩图片大小
                                        const image = compressImage(resp.data.image);
                                        this.fileStorage.write(this.imagePath, this.getImageName(key, true), image.jpg(0.8));
                                        this.fileStorage.write(this.imagePath, this.getImageName(key), resp.data);
                                        $(imageId).image = image;
                                        $ui.success($l10n("SUCCESS"));
                                    });
                                    else if (idx === 2) {
                                        this.fileStorage.delete(this.imagePath, this.getImageName(key, true));
                                        this.fileStorage.delete(this.imagePath, this.getImageName(key));
                                        $(imageId).image = $image("questionmark.square.dashed");
                                        $ui.success($l10n("SUCCESS"));
                                    }
                                },
                                finished: ()=>{
                                    this.#touchHighlightEnd(id15);
                                }
                            });
                        }
                    },
                    layout: (make, view)=>{
                        make.right.inset(0);
                        make.height.equalTo(this.rowHeight);
                        make.width.equalTo(view.super);
                    }
                }
            ],
            layout: $layout.fill
        };
    }
     #getSections(structure) {
        const sections = [];
        for (let section of structure){
            const rows = [];
            for (let item1 of section.items){
                const value = this.get(item1.key);
                let row = null;
                if (!item1.icon) item1.icon = [
                    "square.grid.2x2.fill",
                    "#00CC00"
                ];
                if (typeof item1.items === "object") item1.items = item1.items.map((item3)=>$l10n(item3)
                );
                // 更新标题值
                item1.title = $l10n(item1.title);
                switch(item1.type){
                    case "switch":
                        row = this.createSwitch(item1.key, item1.icon, item1.title);
                        break;
                    case "stepper":
                        row = this.createStepper(item1.key, item1.icon, item1.title, item1.min ?? 1, item1.max ?? 12);
                        break;
                    case "string":
                        row = this.createString(item1.key, item1.icon, item1.title);
                        break;
                    case "number":
                        row = this.createNumber(item1.key, item1.icon, item1.title);
                        break;
                    case "info":
                        row = this.createInfo(item1.icon, item1.title, value);
                        break;
                    case "script":
                        row = this.createScript(item1.key, item1.icon, item1.title, value);
                        break;
                    case "tab":
                        row = this.createTab(item1.key, item1.icon, item1.title, item1.items, item1.values);
                        break;
                    case "menu":
                        row = this.createMenu(item1.key, item1.icon, item1.title, item1.items, item1.values);
                        break;
                    case "color":
                        row = this.createColor(item1.key, item1.icon, item1.title);
                        break;
                    case "date":
                        row = this.createDate(item1.key, item1.icon, item1.title, item1.mode);
                        break;
                    case "input":
                        row = this.createInput(item1.key, item1.icon, item1.title);
                        break;
                    case "icon":
                        row = this.createIcon(item1.key, item1.icon, item1.title, item1.bgcolor);
                        break;
                    case "child":
                        row = this.createChild(item1.key, item1.icon, item1.title, item1.children);
                        break;
                    case "image":
                        row = this.createImage(item1.key, item1.icon, item1.title);
                        break;
                    default:
                        continue;
                }
                rows.push(row);
            }
            sections.push({
                title: $l10n(section.title ?? ""),
                rows: rows
            });
        }
        return sections;
    }
    getListView(structure1, footer = this.footer) {
        return {
            type: "list",
            props: {
                id: this.name,
                style: 2,
                separatorInset: $insets(0, this.iconSize + this.edgeOffset * 2, 0, this.edgeOffset),
                bgcolor: $5918418d6afcdbce$require$UIKit.scrollViewBackgroundColor,
                footer: footer,
                data: this.#getSections(structure1 ?? this.structure)
            },
            layout: $layout.fill,
            events: {
                rowHeight: (sender, indexPath)=>{
                    const info = sender.object(indexPath)?.props?.info ?? {
                    };
                    return info.rowHeight ?? this.rowHeight;
                }
            }
        };
    }
    getPageView() {
        const navigationView = new $5918418d6afcdbce$require$NavigationView();
        navigationView.setView(this.getListView(this.structure)).navigationBarTitle($l10n("SETTING"));
        if (this.hasSectionTitle(this.structure)) navigationView.navigationBar.setContentViewHeightOffset(-10);
        return navigationView.getPage();
    }
}
module.exports = {
    Setting
};

});
var $148154be0b117222$exports = {};
class $148154be0b117222$var$Controller {
    events = {
    };
    setEvents(events) {
        Object.keys(events).forEach((event)=>this.setEvent(event, events[event])
        );
        return this;
    }
    setEvent(event, callback) {
        this.events[event] = callback;
        return this;
    }
    callEvent(event, ...args) {
        if (typeof this.events[event] === "function") this.events[event](...args);
    }
}
$148154be0b117222$exports = {
    Controller: $148154be0b117222$var$Controller
};

var $d82e3dbdc05d08e1$exports = {};
const $d82e3dbdc05d08e1$var$VERSION = "1.2.3";
String.prototype.trim = function(char, type) {
    if (char) {
        if (type === "l") return this.replace(new RegExp("^\\" + char + "+", "g"), "");
        else if (type === "r") return this.replace(new RegExp("\\" + char + "+$", "g"), "");
        return this.replace(new RegExp("^\\" + char + "+|\\" + char + "+$", "g"), "");
    }
    return this.replace(/^\s+|\s+$/g, "");
};
/**
 * 对比版本号
 * @param {string} preVersion
 * @param {string} lastVersion
 * @returns {number} 1: preVersion 大, 0: 相等, -1: lastVersion 大
 */ function $d82e3dbdc05d08e1$var$versionCompare(preVersion = "", lastVersion = "") {
    let sources = preVersion.split(".");
    let dests = lastVersion.split(".");
    let maxL = Math.max(sources.length, dests.length);
    let result = 0;
    for(let i = 0; i < maxL; i++){
        let preValue = sources.length > i ? sources[i] : 0;
        let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
        let lastValue = dests.length > i ? dests[i] : 0;
        let lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
        if (preNum < lastNum) {
            result = -1;
            break;
        } else if (preNum > lastNum) {
            result = 1;
            break;
        }
    }
    return result;
}
function $d82e3dbdc05d08e1$var$l10n(language, content, override = true) {
    if (typeof content === "string") {
        const strings = {
        };
        const strArr = content.split(";");
        strArr.forEach((line)=>{
            line = line.trim();
            if (line !== "") {
                const kv = line.split("=");
                strings[kv[0].trim().slice(1, -1)] = kv[1].trim().slice(1, -1);
            }
        });
        content = strings;
    }
    const strings = $app.strings;
    if (override) strings[language] = Object.assign($app.strings[language], content);
    else strings[language] = Object.assign(content, $app.strings[language]);
    $app.strings = strings;
}
function $d82e3dbdc05d08e1$var$objectEqual(a, b) {
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) return false;
    for(let i = 0; i < aProps.length; i++){
        let propName = aProps[i];
        let propA = a[propName];
        let propB = b[propName];
        if (Array.isArray(propA)) for(let i = 0; i < propA.length; i++){
            if (!$d82e3dbdc05d08e1$var$objectEqual(propA[i], propB[i])) return false;
        }
        else if (typeof propA === "object") return $d82e3dbdc05d08e1$var$objectEqual(propA, propB);
        else if (propA !== propB) return false;
    }
    return true;
}
/**
 * 压缩图片
 * @param {$image} image $image
 * @param {number} maxSize 图片最大尺寸 单位：像素
 * @returns {$image}
 */ function $d82e3dbdc05d08e1$var$compressImage(image, maxSize = 921600) {
    const info = $imagekit.info(image);
    if (info.height * info.width > maxSize) {
        const scale = maxSize / (info.height * info.width);
        image = $imagekit.scaleBy(image, scale);
    }
    return image;
}
var $43f719df810a67fe$exports = {};
class $43f719df810a67fe$var$UIKit {
    static #sharedApplication = $objc("UIApplication").$sharedApplication();
    /**
     * 对齐方式
     */ static align = {
        left: 0,
        right: 1,
        top: 2,
        bottom: 3
    };
    /**
     * 默认文本颜色
     */ static textColor = $color("primaryText", "secondaryText");
    /**
     * 默认链接颜色
     */ static linkColor = $color("systemLink");
    static primaryViewBackgroundColor = $color("primarySurface");
    static scrollViewBackgroundColor = $color("insetGroupedBackground");
    /**
     * 可滚动视图列表
     * @type {string[]}
     */ static scrollViewList = [
        "list",
        "matrix"
    ];
    /**
     * 是否属于大屏设备
     * @type {boolean}
     */ static isLargeScreen = $device.isIpad || $device.isIpadPro;
    /**
     * 获取Window大小
     */ static get windowSize() {
        return $objc("UIWindow").$keyWindow().jsValue().size;
    }
    static NavigationBarNormalHeight = $objc("UINavigationController").invoke("alloc.init").$navigationBar().jsValue().frame.height;
    static NavigationBarLargeTitleHeight = $objc("UITabBarController").invoke("alloc.init").$tabBar().jsValue().frame.height + $43f719df810a67fe$var$UIKit.NavigationBarNormalHeight;
    /**
     * 判断是否是分屏模式
     * @type {boolean}
     */ static get isSplitScreenMode() {
        return $43f719df810a67fe$var$UIKit.isLargeScreen && $device.info.screen.width !== $43f719df810a67fe$var$UIKit.windowSize.width;
    }
    static get statusBarHeight() {
        return $app.isDebugging ? 0 : $43f719df810a67fe$var$UIKit.#sharedApplication.$statusBarFrame().height;
    }
    static get statusBarOrientation() {
        return $43f719df810a67fe$var$UIKit.#sharedApplication.$statusBarOrientation();
    }
    static get isHorizontal() {
        return $43f719df810a67fe$var$UIKit.statusBarOrientation === 3 || $43f719df810a67fe$var$UIKit.statusBarOrientation === 4;
    }
    static loading() {
        const loading = $ui.create($43f719df810a67fe$var$UIKit.blurBox({
            cornerRadius: 15
        }, [
            {
                type: "spinner",
                props: {
                    loading: true,
                    style: 0
                },
                layout: (make, view)=>{
                    make.size.equalTo(view.prev);
                    make.center.equalTo(view.super);
                }
            }
        ]));
        return {
            start: ()=>{
                $ui.controller.view.insertAtIndex(loading, 0);
                loading.layout((make, view)=>{
                    make.center.equalTo(view.super);
                    const width = Math.min($43f719df810a67fe$var$UIKit.windowSize.width * 0.6, 300);
                    make.size.equalTo($size(width, width));
                });
                loading.moveToFront();
            },
            end: ()=>{
                loading.remove();
            }
        };
    }
    static defaultBackgroundColor(type) {
        return $43f719df810a67fe$var$UIKit.scrollViewList.indexOf(type) > -1 ? $43f719df810a67fe$var$UIKit.scrollViewBackgroundColor : $43f719df810a67fe$var$UIKit.primaryViewBackgroundColor;
    }
    static separatorLine(props = {
    }, align = $43f719df810a67fe$var$UIKit.align.bottom) {
        return {
            // canvas
            type: "canvas",
            props: props,
            layout: (make, view)=>{
                if (view.prev === undefined) make.top.equalTo(view.super);
                else if (align === $43f719df810a67fe$var$UIKit.align.bottom) make.top.equalTo(view.prev.bottom);
                else make.top.equalTo(view.prev.top);
                make.height.equalTo(1 / $device.info.screen.scale);
                make.left.right.inset(0);
            },
            events: {
                draw: (view, ctx)=>{
                    ctx.strokeColor = props.bgcolor ?? $color("separatorColor");
                    ctx.setLineWidth(1);
                    ctx.moveToPoint(0, 0);
                    ctx.addLineToPoint(view.frame.width, 0);
                    ctx.strokePath();
                }
            }
        };
    }
    static blurBox(props = {
    }, views = [], layout = $layout.fill) {
        return {
            type: "blur",
            props: Object.assign({
                style: $blurStyle.thinMaterial
            }, props),
            views: views,
            layout: layout
        };
    }
    /**
     * 建议仅在使用 JSBox nav 时使用，便于统一风格
     */ static push({ views: views , statusBarStyle: statusBarStyle = 0 , title: title = "" , navButtons: navButtons = [
        {
            title: ""
        }
    ] , bgcolor: bgcolor = views[0]?.props?.bgcolor ?? "primarySurface" , disappeared: disappeared  } = {
    }) {
        $ui.push({
            props: {
                statusBarStyle: statusBarStyle,
                navButtons: navButtons,
                title: title,
                bgcolor: typeof bgcolor === "string" ? $color(bgcolor) : bgcolor
            },
            events: {
                disappeared: ()=>{
                    if (disappeared !== undefined) disappeared();
                }
            },
            views: [
                {
                    type: "view",
                    views: views,
                    layout: (make, view)=>{
                        make.top.equalTo(view.super.safeArea);
                        make.bottom.equalTo(view.super);
                        make.left.right.equalTo(view.super.safeArea);
                    }
                }
            ]
        });
    }
}
$43f719df810a67fe$exports = {
    UIKit: $43f719df810a67fe$var$UIKit
};


var $d82e3dbdc05d08e1$require$UIKit = $43f719df810a67fe$exports.UIKit;
class $d82e3dbdc05d08e1$var$Kernel {
    startTime = Date.now();
    version = $d82e3dbdc05d08e1$var$VERSION;
    // 隐藏 jsbox 默认 nav 栏
    isUseJsboxNav = false;
    constructor(){
        if ($app.isDebugging) this.debug();
    }
    l10n(language, content, override = true) {
        $d82e3dbdc05d08e1$var$l10n(language, content, override);
    }
    debug(print, error) {
        this.debugMode = true;
        $app.idleTimerDisabled = true;
        if (typeof print === "function") this.debugPrint = print;
        if (typeof error === "function") this.debugError = error;
        this.print("You are running EasyJsBox in debug mode.");
    }
    print(message) {
        if (!this.debugMode) return;
        if (typeof this.debugPrint === "function") this.debugPrint(message);
        else console.log(message);
    }
    error(error) {
        if (!this.debugMode) return;
        if (typeof this.debugError === "function") this.debugError(error);
        else console.error(error);
    }
    useJsboxNav() {
        this.isUseJsboxNav = true;
        return this;
    }
    setTitle(title) {
        if (this.isUseJsboxNav) $ui.title = title;
        this.title = title;
    }
    setNavButtons(buttons) {
        this.navButtons = buttons;
    }
    UIRender(view) {
        try {
            view.props = Object.assign({
                title: this.title,
                navBarHidden: !this.isUseJsboxNav,
                navButtons: this.navButtons ?? [],
                statusBarStyle: 0
            }, view.props);
            if (!view.events) view.events = {
            };
            const oldLayoutSubviews = view.events.layoutSubviews;
            view.events.layoutSubviews = ()=>{
                $app.notify({
                    name: "interfaceOrientationEvent",
                    object: {
                        statusBarOrientation: $d82e3dbdc05d08e1$require$UIKit.statusBarOrientation,
                        isHorizontal: $d82e3dbdc05d08e1$require$UIKit.isHorizontal
                    }
                });
                if (typeof oldLayoutSubviews === "function") oldLayoutSubviews();
            };
            $ui.render(view);
        } catch (error) {
            this.print(error);
        }
    }
    async checkUpdate(callback) {
        const branche = "master" // 更新版本，可选 master, dev
        ;
        const res = await $http.get(`https://raw.githubusercontent.com/ipuppet/EasyJsBox/${branche}/src/easy-jsbox.js`);
        if (res.error) throw res.error;
        const firstLine = res.data.split("\n")[0];
        const latestVersion = firstLine.slice(16).replaceAll('"', "");
        if ($d82e3dbdc05d08e1$var$versionCompare(latestVersion, $d82e3dbdc05d08e1$var$VERSION) > 0) {
            if (typeof callback === "function") callback(res.data);
        }
    }
}
$d82e3dbdc05d08e1$exports = {
    versionCompare: $d82e3dbdc05d08e1$var$versionCompare,
    l10n: $d82e3dbdc05d08e1$var$l10n,
    objectEqual: $d82e3dbdc05d08e1$var$objectEqual,
    compressImage: $d82e3dbdc05d08e1$var$compressImage,
    Kernel: $d82e3dbdc05d08e1$var$Kernel
};

var $d98b0c7ec7b0e4b6$exports = {};
class $d98b0c7ec7b0e4b6$var$FileStorageParameterError extends Error {
    constructor(parameter){
        super(`Parameter [${parameter}] is required.`);
        this.name = "FileStorageParameterError";
    }
}
class $d98b0c7ec7b0e4b6$var$FileStorageFileNotFoundError extends Error {
    constructor(filePath){
        super(`File not found: ${filePath}`);
        this.name = "FileStorageFileNotFoundError";
    }
}
class $d98b0c7ec7b0e4b6$var$FileStorage {
    basePath;
    constructor({ basePath: basePath = "storage"  } = {
    }){
        this.basePath = basePath;
        this.#createDirectory(this.basePath);
    }
     #createDirectory(path) {
        if (!$file.isDirectory(path)) $file.mkdir(path);
    }
     #filePath(path1 = "", fileName) {
        path1 = `${this.basePath}/${path1.trim("/")}`.trim("/");
        this.#createDirectory(path1);
        path1 = `${path1}/${fileName}`;
        return path1;
    }
    write(path2 = "", fileName1, data) {
        if (!fileName1) throw new $d98b0c7ec7b0e4b6$var$FileStorageParameterError("fileName");
        if (!data) throw new $d98b0c7ec7b0e4b6$var$FileStorageParameterError("data");
        return $file.write({
            data: data,
            path: this.#filePath(path2, fileName1)
        });
    }
    writeSync(path3 = "", fileName2, data) {
        return new Promise((resolve, reject)=>{
            try {
                const success = this.write(path3, fileName2, data);
                if (success) resolve(success);
                else reject(success);
            } catch (error) {
                reject(error);
            }
        });
    }
    exists(path4 = "", fileName3) {
        if (!fileName3) throw new $d98b0c7ec7b0e4b6$var$FileStorageParameterError("fileName");
        path4 = this.#filePath(path4, fileName3);
        if ($file.exists(path4)) return path4;
        return false;
    }
    read(path5 = "", fileName4) {
        if (!fileName4) throw new $d98b0c7ec7b0e4b6$var$FileStorageParameterError("fileName");
        path5 = this.#filePath(path5, fileName4);
        if (!$file.exists(path5)) throw new $d98b0c7ec7b0e4b6$var$FileStorageFileNotFoundError(path5);
        if ($file.isDirectory(path5)) return $file.list(path5);
        return $file.read(path5);
    }
    readSync(path6 = "", fileName5) {
        return new Promise((resolve, reject)=>{
            try {
                const file = this.read(path6, fileName5);
                if (file) resolve(file);
                else reject();
            } catch (error) {
                reject(error);
            }
        });
    }
    readAsJSON(path7 = "", fileName6, _default = null) {
        try {
            const fileString = this.read(path7, fileName6)?.string;
            return JSON.parse(fileString);
        } catch (error) {
            return _default;
        }
    }
    static readFromRoot(path8) {
        if (!path8) throw new $d98b0c7ec7b0e4b6$var$FileStorageParameterError("path");
        if (!$file.exists(path8)) throw new $d98b0c7ec7b0e4b6$var$FileStorageFileNotFoundError(path8);
        if ($file.isDirectory(path8)) return $file.list(path8);
        return $file.read(path8);
    }
    static readFromRootSync(path9 = "") {
        return new Promise((resolve, reject)=>{
            try {
                const file = $d98b0c7ec7b0e4b6$var$FileStorage.readFromRoot(path9);
                if (file) resolve(file);
                else reject();
            } catch (error) {
                reject(error);
            }
        });
    }
    static readFromRootAsJSON(path10 = "", _default = null) {
        try {
            const fileString = $d98b0c7ec7b0e4b6$var$FileStorage.readFromRoot(path10)?.string;
            return JSON.parse(fileString);
        } catch (error) {
            return _default;
        }
    }
    delete(path11 = "", fileName7 = "") {
        return $file.delete(this.#filePath(path11, fileName7));
    }
}
$d98b0c7ec7b0e4b6$exports = {
    FileStorage: $d98b0c7ec7b0e4b6$var$FileStorage
};

parcelRequire.register("gEL05", function(module, exports) {

var $c204d7162f755c63$require$View = $57ea6937db5a938e$exports.View;
var $c204d7162f755c63$require$PageView = $57ea6937db5a938e$exports.PageView;

var $8O0aX = parcelRequire("8O0aX");
var $c204d7162f755c63$require$ValidationError = $8O0aX.ValidationError;

var $c204d7162f755c63$require$UIKit = $43f719df810a67fe$exports.UIKit;

var $1gPEj = parcelRequire("1gPEj");
var $c204d7162f755c63$require$NavigationBar = $1gPEj.NavigationBar;
var $c204d7162f755c63$require$NavigationBarController = $1gPEj.NavigationBarController;

var $hlbNb = parcelRequire("hlbNb");
var $c204d7162f755c63$require$NavigationBarItems = $hlbNb.NavigationBarItems;
class $c204d7162f755c63$var$NavigationViewTypeError extends $c204d7162f755c63$require$ValidationError {
    constructor(parameter, type){
        super(parameter, type);
        this.name = "NavigationViewTypeError";
    }
}
class $c204d7162f755c63$var$NavigationView {
    /**
     * @type {PageView}
     */ page;
    navigationController = new $c204d7162f755c63$require$NavigationBarController();
    navigationBar = new $c204d7162f755c63$require$NavigationBar();
    navigationBarItems = new $c204d7162f755c63$require$NavigationBarItems();
    constructor(){
        this.navigationBar.navigationBarItems = this.navigationBarItems;
        this.navigationController.navigationBar = this.navigationBar;
    }
    navigationBarTitle(title) {
        this.navigationBar.setTitle(title);
        return this;
    }
    /**
     *
     * @param {Object} view
     * @returns {this}
     */ setView(view) {
        if (typeof view !== "object") throw new $c204d7162f755c63$var$NavigationViewTypeError("view", "object");
        this.view = $c204d7162f755c63$require$View.create(view);
        return this;
    }
     #bindScrollEvents() {
        if (!(this.view instanceof $c204d7162f755c63$require$View)) throw new $c204d7162f755c63$var$NavigationViewTypeError("view", "View");
        // 计算偏移高度
        let height = this.navigationBar.contentViewHeightOffset;
        if (this.navigationBarItems.titleView) {
            height += this.navigationBarItems.titleView.topOffset;
            height += this.navigationBarItems.titleView.height;
            height += this.navigationBarItems.titleView.bottomOffset;
        }
        if (this.view.props.stickyHeader) height += this.navigationBar.largeTitleFontHeight;
        else if (this.navigationBarItems.largeTitleDisplayMode === $c204d7162f755c63$require$NavigationBar.largeTitleDisplayModeNever) height += this.navigationBar.navigationBarNormalHeight;
        else height += this.navigationBar.navigationBarLargeTitleHeight;
        // 修饰视图顶部偏移
        if (this.view.props.header) this.view.props.header = {
            type: "view",
            props: {
                height: height + (this.view.props.header?.props?.height ?? 0)
            },
            views: [
                {
                    type: "view",
                    props: {
                        clipsToBounds: true
                    },
                    views: [
                        this.view.props.header
                    ],
                    layout: (make, view)=>{
                        make.top.inset(height);
                        make.height.equalTo(this.view.props.header?.props?.height ?? 0);
                        make.width.equalTo(view.super);
                    }
                }
            ]
        };
        else this.view.props.header = {
            props: {
                height: height
            }
        };
        // 修饰视图底部偏移
        if (!this.view.props.footer) this.view.props.footer = {
        };
        this.view.props.footer.props = Object.assign(this.view.props.footer.props ?? {
        }, {
            height: (this.navigationBarItems.fixedFooterView?.height ?? 0) + (this.view.props.footer.props?.height ?? 0)
        });
        // 重写布局
        if ($c204d7162f755c63$require$UIKit.scrollViewList.indexOf(this.view.type) === -1) // 非滚动视图
        this.view.layout = (make, view)=>{
            make.left.right.equalTo(view.super.safeArea);
            make.bottom.equalTo(view.super);
            let topOffset = this.navigationBar.contentViewHeightOffset;
            if (this.navigationBarItems.largeTitleDisplayMode !== $c204d7162f755c63$require$NavigationBar.largeTitleDisplayModeNever) topOffset += this.navigationBar.largeTitleFontHeight;
            if (this.navigationBarItems.titleView) topOffset += this.navigationBarItems.titleView.topOffset + this.navigationBarItems.titleView.bottomOffset;
            if ((!$c204d7162f755c63$require$UIKit.isHorizontal || $c204d7162f755c63$require$UIKit.isLargeScreen) && this.navigationBar.addStatusBarHeight) topOffset += $c204d7162f755c63$require$UIKit.statusBarHeight;
            make.top.equalTo(this.navigationBar.navigationBarNormalHeight + topOffset);
        };
        else {
            // indicatorInsets
            const pinTitleViewOffset = this.navigationBarItems.isPinTitleView ? this.navigationBarItems.titleView.height + this.navigationBarItems.titleView.bottomOffset + this.navigationBar.contentViewHeightOffset : 0;
            if (this.view.props.indicatorInsets) {
                const old = this.view.props.indicatorInsets;
                this.view.props.indicatorInsets = $insets(old.top + this.navigationBar.navigationBarNormalHeight + pinTitleViewOffset, old.left, old.bottom + (this.navigationBarItems.fixedFooterView?.height ?? 0), old.right);
            } else this.view.props.indicatorInsets = $insets(this.navigationBar.navigationBarNormalHeight + pinTitleViewOffset, 0, this.navigationBarItems.fixedFooterView?.height ?? 0, 0);
            // layout
            this.view.layout = (make, view)=>{
                if (this.view.props.stickyHeader) make.top.equalTo(view.super.safeArea).offset(this.navigationBar.navigationBarNormalHeight);
                else make.top.equalTo(view.super);
                make.left.right.equalTo(view.super.safeArea);
                make.bottom.equalTo(view.super);
            };
            // 重写滚动事件
            this.view.assignEvent("didScroll", (sender)=>{
                let contentOffset = sender.contentOffset.y;
                if ((!$c204d7162f755c63$require$UIKit.isHorizontal || $c204d7162f755c63$require$UIKit.isLargeScreen) && this.navigationBar.addStatusBarHeight && !this.view.props.stickyHeader) contentOffset += $c204d7162f755c63$require$UIKit.statusBarHeight;
                this.navigationController.didScroll(contentOffset);
            }).assignEvent("didEndDragging", (sender, decelerate)=>{
                let contentOffset = sender.contentOffset.y;
                let zeroOffset = 0;
                if ((!$c204d7162f755c63$require$UIKit.isHorizontal || $c204d7162f755c63$require$UIKit.isLargeScreen) && this.navigationBar.addStatusBarHeight && !this.view.props.stickyHeader) {
                    contentOffset += $c204d7162f755c63$require$UIKit.statusBarHeight;
                    zeroOffset = $c204d7162f755c63$require$UIKit.statusBarHeight;
                }
                this.navigationController.didEndDragging(contentOffset, decelerate, (...args)=>sender.scrollToOffset(...args)
                , zeroOffset);
            }).assignEvent("didEndDecelerating", (...args)=>{
                if (args[0].tracking) return;
                this.view.events?.didEndDragging(...args);
            });
        }
    }
     #initPage() {
        if (this.navigationBar.prefersLargeTitles) {
            this.#bindScrollEvents();
            let titleView = {
            };
            if (this.navigationBarItems.titleView) {
                // 修改 titleView 背景与 navigationBar 相同
                const isHideBackground = this.navigationBar.prefersLargeTitles;
                titleView = $c204d7162f755c63$require$View.create({
                    views: [
                        this.navigationBar.backgroundColor ? {
                            type: "view",
                            props: {
                                hidden: isHideBackground,
                                bgcolor: this.navigationBar.backgroundColor,
                                id: this.navigationBar.id + "-title-view-background"
                            },
                            layout: $layout.fill
                        } : $c204d7162f755c63$require$UIKit.blurBox({
                            hidden: isHideBackground,
                            id: this.navigationBar.id + "-title-view-background"
                        }),
                        $c204d7162f755c63$require$UIKit.separatorLine({
                            id: this.navigationBar.id + "-title-view-underline",
                            alpha: isHideBackground ? 0 : 1
                        }),
                        this.navigationBarItems.titleView.definition
                    ],
                    layout: (make, view)=>{
                        make.top.equalTo(view.prev.bottom);
                        make.width.equalTo(view.super);
                        make.height.equalTo(this.navigationBarItems.titleView.topOffset + this.navigationBarItems.titleView.height + this.navigationBarItems.titleView.bottomOffset);
                    }
                });
            }
            // 初始化 PageView
            this.page = $c204d7162f755c63$require$PageView.createByViews([
                this.view,
                this.navigationBar.getLargeTitleView(),
                titleView,
                this.navigationBar.getNavigationBarView(),
                this.navigationBarItems.fixedFooterView?.definition ?? {
                }
            ]);
        } else this.page = $c204d7162f755c63$require$PageView.createByViews([
            this.view
        ]);
        if (this.view.props?.bgcolor) this.page.setProp("bgcolor", this.view.props.bgcolor);
        else this.page.setProp("bgcolor", $c204d7162f755c63$require$UIKit.defaultBackgroundColor(this.view.type));
        return this;
    }
    getPage() {
        if (!this.page) this.#initPage();
        return this.page;
    }
}
module.exports = {
    NavigationView: $c204d7162f755c63$var$NavigationView
};

});
var $57ea6937db5a938e$exports = {};
/**
 * 视图基类
 */ class $57ea6937db5a938e$var$View {
    /**
     * id
     * @type {string}
     */ id = $text.uuid;
    /**
     * 类型
     * @type {string}
     */ type;
    /**
     * 属性
     * @type {Object}
     */ props;
    /**
     * 子视图
     * @type {Array}
     */ views;
    /**
     * 事件
     * @type {Object}
     */ events;
    /**
     * 布局函数
     * @type {Function}
     */ layout;
    constructor({ type: type = "view" , props: props = {
    } , views: views = [] , events: events = {
    } , layout: layout = $layout.fill  } = {
    }){
        // 属性
        this.type = type;
        this.props = props;
        this.views = views;
        this.events = events;
        this.layout = layout;
        if (this.props.id) this.id = this.props.id;
        else this.props.id = this.id;
    }
    static create(args) {
        return new this(args);
    }
    static createByViews(views) {
        return new this({
            views: views
        });
    }
    setProps(props) {
        Object.keys(props).forEach((key)=>this.setProp(key, props[key])
        );
        return this;
    }
    setProp(key, prop) {
        if (key === "id") this.id = prop;
        this.props[key] = prop;
        return this;
    }
    setViews(views) {
        this.views = views;
        return this;
    }
    setEvents(events) {
        Object.keys(events).forEach((event)=>this.setEvent(event, events[event])
        );
        return this;
    }
    setEvent(event, action) {
        this.events[event] = action;
        return this;
    }
    /**
     * 事件中间件
     *
     * 调用处理函数 `action`，第一个参数为用户定义的事件处理函数
     * 其余参数为 JSBox 传递的参数，如 sender 等
     *
     * @param {string} event 事件名称
     * @param {Function} action 处理事件的函数
     * @returns {this}
     */ eventMiddleware(event, action) {
        const old = this.events[event];
        this.events[event] = (...args)=>{
            if (typeof old === "function") // 调用处理函数
            action(old, ...args);
        };
        return this;
    }
    assignEvent(event, action) {
        const old = this.events[event];
        this.events[event] = (...args)=>{
            if (typeof old === "function") old(...args);
            action(...args);
        };
        return this;
    }
    setLayout(layout) {
        this.layout = layout;
        return this;
    }
    getView() {
        return this;
    }
    get definition() {
        return this.getView();
    }
}
class $57ea6937db5a938e$var$PageView extends $57ea6937db5a938e$var$View {
    constructor(args = {
    }){
        super(args);
        this.activeStatus = true;
    }
    show() {
        $(this.props.id).hidden = false;
        this.activeStatus = true;
    }
    hide() {
        $(this.props.id).hidden = true;
        this.activeStatus = false;
    }
    setHorizontalSafeArea(bool) {
        this.horizontalSafeArea = bool;
        return this;
    }
     #layout(make, view) {
        make.top.bottom.equalTo(view.super);
        if (this.horizontalSafeArea) make.left.right.equalTo(view.super.safeArea);
        else make.left.right.equalTo(view.super);
    }
    getView() {
        this.layout = this.#layout;
        this.props.clipsToBounds = true;
        this.props.hidden = !this.activeStatus;
        return super.getView();
    }
}
$57ea6937db5a938e$exports = {
    View: $57ea6937db5a938e$var$View,
    PageView: $57ea6937db5a938e$var$PageView
};

parcelRequire.register("8O0aX", function(module, exports) {
class $6693211ea334f24f$var$ValidationError extends Error {
    constructor(parameter, type){
        super(`The type of the parameter '${parameter}' must be '${type}'`);
        this.name = "ValidationError";
    }
}
module.exports = {
    ValidationError: $6693211ea334f24f$var$ValidationError
};

});

parcelRequire.register("1gPEj", function(module, exports) {

var $0ecf598660b3c447$require$View = $57ea6937db5a938e$exports.View;

var $0ecf598660b3c447$require$Controller = $148154be0b117222$exports.Controller;

var $0ecf598660b3c447$require$UIKit = $43f719df810a67fe$exports.UIKit;

var $hlbNb = parcelRequire("hlbNb");
var $0ecf598660b3c447$require$BarButtonItem = $hlbNb.BarButtonItem;
/**
 * @typedef {import("./navigation-bar-items").NavigationBarItems} NavigationBarItems
 */ class $0ecf598660b3c447$var$NavigationBar extends $0ecf598660b3c447$require$View {
    static largeTitleDisplayModeAutomatic = 0;
    static largeTitleDisplayModeAlways = 1;
    static largeTitleDisplayModeNever = 2;
    static pageSheetNavigationBarHeight = 56;
    /**
     * @type {NavigationBarItems}
     */ navigationBarItems;
    title = "";
    prefersLargeTitles = true;
    largeTitleDisplayMode = $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeAutomatic;
    largeTitleFontSize = 34;
    largeTitleFontFamily = "bold";
    largeTitleFontHeight = $text.sizeThatFits({
        text: "A",
        width: 100,
        font: $font(this.largeTitleFontFamily, this.largeTitleFontSize)
    }).height;
    navigationBarTitleFontSize = 17;
    addStatusBarHeight = true;
    contentViewHeightOffset = 10;
    navigationBarNormalHeight = $0ecf598660b3c447$require$UIKit.NavigationBarNormalHeight;
    navigationBarLargeTitleHeight = $0ecf598660b3c447$require$UIKit.NavigationBarLargeTitleHeight;
    pageSheetMode() {
        this.navigationBarLargeTitleHeight -= this.navigationBarNormalHeight;
        this.navigationBarNormalHeight = $0ecf598660b3c447$var$NavigationBar.pageSheetNavigationBarHeight;
        this.navigationBarLargeTitleHeight += this.navigationBarNormalHeight;
        this.addStatusBarHeight = false;
        return this;
    }
    withStatusBarHeight() {
        this.addStatusBarHeight = true;
        return this;
    }
    withoutStatusBarHeight() {
        this.addStatusBarHeight = false;
        return this;
    }
    setLargeTitleDisplayMode(mode) {
        this.largeTitleDisplayMode = mode;
        return this;
    }
    setBackgroundColor(backgroundColor) {
        this.backgroundColor = backgroundColor;
        return this;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setPrefersLargeTitles(bool) {
        this.prefersLargeTitles = bool;
        return this;
    }
    setContentViewHeightOffset(offset) {
        this.contentViewHeightOffset = offset;
        return this;
    }
    /**
     * 页面大标题
     */ getLargeTitleView() {
        return this.prefersLargeTitles && this.largeTitleDisplayMode !== $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeNever ? {
            type: "label",
            props: {
                id: this.id + "-large-title",
                text: this.title,
                textColor: $0ecf598660b3c447$require$UIKit.textColor,
                align: $align.left,
                font: $font(this.largeTitleFontFamily, this.largeTitleFontSize),
                line: 1
            },
            layout: (make, view)=>{
                make.left.equalTo(view.super.safeArea).offset(15);
                make.height.equalTo(this.largeTitleFontHeight);
                make.top.equalTo(view.super.safeAreaTop).offset(this.navigationBarNormalHeight);
            }
        } : {
        };
    }
    getNavigationBarView() {
        const getButtonView = (buttons, align)=>{
            return buttons.length > 0 ? {
                type: "view",
                views: [
                    {
                        type: "view",
                        views: buttons,
                        layout: $layout.fill
                    }
                ],
                layout: (make, view)=>{
                    make.top.equalTo(view.super.safeAreaTop);
                    make.bottom.equalTo(view.super.safeAreaTop).offset(this.navigationBarNormalHeight);
                    if (align === $0ecf598660b3c447$require$UIKit.align.left) make.left.equalTo(view.super.safeArea);
                    else make.right.equalTo(view.super.safeArea);
                    make.width.equalTo(buttons.length * $0ecf598660b3c447$require$BarButtonItem.size.width);
                }
            } : {
            };
        };
        const rightButtonView = getButtonView(this.navigationBarItems.rightButtons, $0ecf598660b3c447$require$UIKit.align.right);
        const leftButtonView = this.navigationBarItems.popButtonView ?? getButtonView(this.navigationBarItems.leftButtons, $0ecf598660b3c447$require$UIKit.align.left);
        const isHideBackground = this.prefersLargeTitles;
        const isHideTitle = !this.prefersLargeTitles || this.largeTitleDisplayMode === $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeNever;
        return {
            // 顶部 bar
            type: "view",
            props: {
                id: this.id + "-navigation",
                bgcolor: $color("clear")
            },
            layout: (make, view)=>{
                make.left.top.right.inset(0);
                make.bottom.equalTo(view.super.safeAreaTop).offset(this.navigationBarNormalHeight);
            },
            views: [
                this.backgroundColor ? {
                    type: "view",
                    props: {
                        hidden: isHideBackground,
                        bgcolor: this.backgroundColor,
                        id: this.id + "-background"
                    },
                    layout: $layout.fill
                } : $0ecf598660b3c447$require$UIKit.blurBox({
                    hidden: isHideBackground,
                    id: this.id + "-background"
                }),
                $0ecf598660b3c447$require$UIKit.separatorLine({
                    id: this.id + "-underline",
                    alpha: isHideBackground ? 0 : 1
                }),
                {
                    type: "view",
                    props: {
                        hidden: true,
                        bgcolor: $color("clear"),
                        id: this.id + "-large-title-mask"
                    },
                    layout: $layout.fill
                },
                {
                    // 标题
                    type: "label",
                    props: {
                        id: this.id + "-small-title",
                        alpha: isHideTitle ? 1 : 0,
                        text: this.title,
                        font: $font(this.largeTitleFontFamily, this.navigationBarTitleFontSize),
                        align: $align.center,
                        bgcolor: $color("clear"),
                        textColor: $0ecf598660b3c447$require$UIKit.textColor
                    },
                    layout: (make, view)=>{
                        make.left.right.inset(0);
                        make.height.equalTo(20);
                        make.centerY.equalTo(view.super.safeArea);
                    }
                }
            ].concat(rightButtonView, leftButtonView)
        };
    }
}
class $0ecf598660b3c447$var$NavigationBarController extends $0ecf598660b3c447$require$Controller {
    static largeTitleViewSmallMode = 0;
    static largeTitleViewLargeMode = 1;
    /**
     * @type {NavigationBar}
     */ navigationBar;
    updateSelector() {
        this.selector = {
            navigation: $(this.navigationBar.id + "-navigation"),
            largeTitleView: $(this.navigationBar.id + "-large-title"),
            smallTitleView: $(this.navigationBar.id + "-small-title"),
            underlineView: this.navigationBar.navigationBarItems.isPinTitleView ? $(this.navigationBar.id + "-title-view-underline") : $(this.navigationBar.id + "-underline"),
            largeTitleMaskView: $(this.navigationBar.id + "-large-title-mask"),
            backgroundView: $(this.navigationBar.id + "-background"),
            titleViewBackgroundView: $(this.navigationBar.id + "-title-view-background")
        };
    }
    toNormal(permanent = true) {
        this.updateSelector();
        $ui.animate({
            duration: 0.2,
            animation: ()=>{
                // 显示下划线和背景
                this.selector.underlineView.alpha = 1;
                this.selector.backgroundView.hidden = false;
                // 隐藏大标题，显示小标题
                this.selector.smallTitleView.alpha = 1;
                this.selector.largeTitleView.alpha = 0;
            }
        });
        if (permanent && this.navigationBar.navigationBarItems) this.navigationBar.largeTitleDisplayMode = $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeNever;
    }
    toLargeTitle(permanent = true) {
        this.updateSelector();
        this.selector.underlineView.alpha = 0;
        this.selector.backgroundView.hidden = true;
        $ui.animate({
            duration: 0.2,
            animation: ()=>{
                this.selector.smallTitleView.alpha = 0;
                this.selector.largeTitleView.alpha = 1;
            }
        });
        if (permanent && this.navigationBar.navigationBarItems) this.navigationBar.largeTitleDisplayMode = $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeAlways;
    }
     #changeLargeTitleView(largeTitleViewMode) {
        const isSmallMode = largeTitleViewMode === $0ecf598660b3c447$var$NavigationBarController.largeTitleViewSmallMode;
        $ui.animate({
            duration: 0.2,
            animation: ()=>{
                // 隐藏大标题，显示小标题
                this.selector.smallTitleView.alpha = isSmallMode ? 1 : 0;
                this.selector.largeTitleView.alpha = isSmallMode ? 0 : 1;
            }
        });
    }
     #largeTitleScrollAction(contentOffset) {
        const titleSizeMax = 40 // 下拉放大字体最大值
        ;
        // 标题跟随
        this.selector.largeTitleView.updateLayout((make, view)=>{
            if (this.navigationBar.navigationBarNormalHeight - contentOffset > 0) // 标题上移致隐藏后停止移动
            make.top.equalTo(view.super.safeAreaTop).offset(this.navigationBar.navigationBarNormalHeight - contentOffset);
            else make.top.equalTo(view.super.safeAreaTop).offset(0);
        });
        if (contentOffset > 0) {
            if (contentOffset >= this.navigationBar.navigationBarNormalHeight) this.#changeLargeTitleView($0ecf598660b3c447$var$NavigationBarController.largeTitleViewSmallMode);
            else this.#changeLargeTitleView($0ecf598660b3c447$var$NavigationBarController.largeTitleViewLargeMode);
        } else {
            // 切换模式
            this.#changeLargeTitleView($0ecf598660b3c447$var$NavigationBarController.largeTitleViewLargeMode);
            // 下拉放大字体
            let size = this.navigationBar.largeTitleFontSize - contentOffset * 0.04;
            if (size > titleSizeMax) size = titleSizeMax;
            this.selector.largeTitleView.font = $font(this.navigationBar.largeTitleFontFamily, size);
        }
    }
     #navigationBarScrollAction(contentOffset1) {
        if (this.navigationBar.navigationBarItems?.isPinTitleView) {
            // titleView 背景
            if (this.navigationBar.navigationBarNormalHeight - contentOffset1 > 0) this.selector.titleViewBackgroundView.hidden = true;
            else this.selector.titleViewBackgroundView.hidden = false;
        }
        let trigger = this.navigationBar.navigationBarItems.largeTitleDisplayMode === $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeNever ? 5 : this.navigationBar.navigationBarNormalHeight;
        if (contentOffset1 > trigger) {
            // 隐藏遮罩
            this.selector.largeTitleMaskView.hidden = true;
            $ui.animate({
                duration: 0.2,
                animation: ()=>{
                    // 显示下划线和背景
                    this.selector.underlineView.hidden = false;
                    this.selector.backgroundView.hidden = false;
                }
            });
        } else {
            const contentViewBackgroundColor = this.selector.largeTitleView?.prev.bgcolor;
            this.selector.largeTitleMaskView.bgcolor = contentViewBackgroundColor;
            this.selector.largeTitleMaskView.hidden = false;
            // 隐藏背景
            this.selector.underlineView.hidden = true;
            this.selector.backgroundView.hidden = true;
        }
    }
    didScroll(contentOffset2) {
        if (!this.navigationBar.prefersLargeTitles) return;
        const largeTitleDisplayMode = this.navigationBar.largeTitleDisplayMode;
        if (largeTitleDisplayMode === $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeAlways) return;
        this.updateSelector();
        if (largeTitleDisplayMode === $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeAutomatic) {
            if (!this.navigationBar.navigationBarItems?.isPinTitleView) {
                // titleView didScroll
                this.navigationBar.navigationBarItems?.titleView?.controller.didScroll(contentOffset2);
                // 在 titleView 折叠前锁住主要视图
                if (contentOffset2 > 0) {
                    const height = this.navigationBar.navigationBarItems?.titleView?.height ?? 0;
                    contentOffset2 -= height;
                    if (contentOffset2 < 0) contentOffset2 = 0;
                }
            }
            this.#largeTitleScrollAction(contentOffset2);
            this.#navigationBarScrollAction(contentOffset2);
        } else if (largeTitleDisplayMode === $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeNever) this.#navigationBarScrollAction(contentOffset2);
    }
    didEndDragging(contentOffset3, decelerate, scrollToOffset, zeroOffset) {
        if (!this.navigationBar.prefersLargeTitles) return;
        const largeTitleDisplayMode = this.navigationBar.navigationBarItems.largeTitleDisplayMode;
        if (largeTitleDisplayMode === $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeAlways) return;
        this.updateSelector();
        if (largeTitleDisplayMode === $0ecf598660b3c447$var$NavigationBar.largeTitleDisplayModeAutomatic) {
            let titleViewHeight = 0;
            if (!this.navigationBar.navigationBarItems?.isPinTitleView) {
                // titleView didEndDragging
                this.navigationBar.navigationBarItems?.titleView?.controller.didEndDragging(contentOffset3, decelerate, scrollToOffset, zeroOffset);
                titleViewHeight = this.navigationBar.navigationBarItems?.titleView?.height ?? 0;
                contentOffset3 -= titleViewHeight;
            }
            if (contentOffset3 >= 0 && contentOffset3 <= this.navigationBar.largeTitleFontHeight) scrollToOffset($point(0, contentOffset3 >= this.navigationBar.largeTitleFontHeight / 2 ? this.navigationBar.navigationBarNormalHeight + titleViewHeight - zeroOffset : titleViewHeight - zeroOffset));
        }
    }
}
module.exports = {
    NavigationBar: $0ecf598660b3c447$var$NavigationBar,
    NavigationBarController: $0ecf598660b3c447$var$NavigationBarController
};

});
parcelRequire.register("hlbNb", function(module, exports) {

var $c9fd8b88f9436ac1$require$View = $57ea6937db5a938e$exports.View;

var $c9fd8b88f9436ac1$require$UIKit = $43f719df810a67fe$exports.UIKit;
class $c9fd8b88f9436ac1$var$BarTitleView extends $c9fd8b88f9436ac1$require$View {
    height = 20;
    topOffset = 15;
    bottomOffset = 10;
    controller = {
    };
    setController(controller) {
        this.controller = controller;
        return this;
    }
}
/**
 * 用于创建一个靠右侧按钮（自动布局）
 * this.events.tapped 按钮点击事件，会传入三个函数，start()、done() 和 cancel()
 *     调用 start() 表明按钮被点击，准备开始动画
 *     调用 done() 表明您的操作已经全部完成，默认操作成功完成，播放一个按钮变成对号的动画
 *                 若第一个参数传出false则表示运行出错
 *                 第二个参数为错误原因($ui.toast(message))
 *     调用 cancel() 表示取消操作
 *     示例：
 *      (start, done, cancel) => {
 *          start()
 *          const upload = (data) => { return false }
 *          if (upload(data)) { done() }
 *          else { done(false, "Upload Error!") }
 *      }
 */ /**
 * @typedef {Object} BarButtonItemProperties
 * @property {string} title
 * @property {string} symbol
 * @property {Function} tapped
 * @property {Object} menu
 * @property {Object} events
 *
 */ class $c9fd8b88f9436ac1$var$BarButtonItem extends $c9fd8b88f9436ac1$require$View {
    static size = $size(38, 38);
    static iconSize = $size(23, 23) // 比 size 小 edges
    ;
    static edges = 15;
    /**
     * 标题
     * @type {string}
     */ title = "";
    /**
     * 对齐方式
     */ align = $c9fd8b88f9436ac1$require$UIKit.align.right;
    setTitle(title = "") {
        this.title = title;
        return this;
    }
    setSymbol(symbol) {
        this.symbol = symbol;
        return this;
    }
    setMenu(menu) {
        this.menu = menu;
        return this;
    }
    setAlign(align) {
        this.align = align;
        return this;
    }
     #actionStart() {
        // 隐藏button，显示spinner
        $(this.id).hidden = true;
        $("spinner-" + this.id).hidden = false;
    }
     #actionDone() {
        const buttonIcon = $(`icon-button-${this.id}`);
        const checkmarkIcon = $(`icon-checkmark-${this.id}`);
        buttonIcon.alpha = 0;
        $(this.id).hidden = false;
        $("spinner-" + this.id).hidden = true;
        // 成功动画
        $ui.animate({
            duration: 0.6,
            animation: ()=>{
                checkmarkIcon.alpha = 1;
            },
            completion: ()=>{
                $delay(0.3, ()=>$ui.animate({
                        duration: 0.6,
                        animation: ()=>{
                            checkmarkIcon.alpha = 0;
                        },
                        completion: ()=>{
                            $ui.animate({
                                duration: 0.4,
                                animation: ()=>{
                                    buttonIcon.alpha = 1;
                                },
                                completion: ()=>{
                                    buttonIcon.alpha = 1;
                                }
                            });
                        }
                    })
                );
            }
        });
    }
     #actionCancel() {
        $(this.id).hidden = false;
        $("spinner-" + this.id).hidden = true;
    }
    getView() {
        const userTapped = this.events.tapped;
        this.events.tapped = (sender)=>{
            if (!userTapped) return;
            userTapped({
                start: ()=>this.#actionStart()
                ,
                done: ()=>this.#actionDone()
                ,
                cancel: ()=>this.#actionCancel()
            }, sender);
        };
        return {
            type: "view",
            views: [
                {
                    type: "button",
                    props: Object.assign({
                        id: this.id,
                        bgcolor: $color("clear"),
                        tintColor: $c9fd8b88f9436ac1$require$UIKit.textColor,
                        titleColor: $c9fd8b88f9436ac1$require$UIKit.textColor,
                        contentEdgeInsets: $insets(0, 0, 0, 0),
                        titleEdgeInsets: $insets(0, 0, 0, 0),
                        imageEdgeInsets: $insets(0, 0, 0, 0)
                    }, this.menu ? {
                        menu: this.menu
                    } : {
                    }, this.title?.length > 0 ? {
                        title: this.title
                    } : {
                    }, this.props),
                    views: [
                        {
                            type: "image",
                            props: Object.assign({
                                id: `icon-button-${this.id}`,
                                hidden: this.symbol === undefined,
                                tintColor: $c9fd8b88f9436ac1$require$UIKit.textColor
                            }, this.symbol === undefined ? {
                            } : typeof this.symbol === "string" ? {
                                symbol: this.symbol
                            } : {
                                data: this.symbol.png
                            }),
                            layout: (make, view)=>{
                                make.center.equalTo(view.super);
                                make.size.equalTo($c9fd8b88f9436ac1$var$BarButtonItem.iconSize);
                            }
                        },
                        {
                            type: "image",
                            props: {
                                id: `icon-checkmark-${this.id}`,
                                alpha: 0,
                                tintColor: $c9fd8b88f9436ac1$require$UIKit.textColor,
                                symbol: "checkmark"
                            },
                            layout: (make, view)=>{
                                make.center.equalTo(view.super);
                                make.size.equalTo($c9fd8b88f9436ac1$var$BarButtonItem.iconSize);
                            }
                        }
                    ],
                    events: this.events,
                    layout: $layout.fill
                },
                {
                    type: "spinner",
                    props: {
                        id: "spinner-" + this.id,
                        loading: true,
                        hidden: true
                    },
                    layout: $layout.fill
                }
            ],
            layout: (make, view)=>{
                make.size.equalTo($c9fd8b88f9436ac1$var$BarButtonItem.size);
                make.centerY.equalTo(view.super);
                if (view.prev && view.prev.id !== "label" && view.prev.id !== undefined) {
                    if (this.align === $c9fd8b88f9436ac1$require$UIKit.align.right) make.right.equalTo(view.prev.left);
                    else make.left.equalTo(view.prev.right);
                } else {
                    // 图片类型留一半边距，图标和按钮边距是另一半
                    const edges = this.symbol ? $c9fd8b88f9436ac1$var$BarButtonItem.edges / 2 : $c9fd8b88f9436ac1$var$BarButtonItem.edges;
                    if (this.align === $c9fd8b88f9436ac1$require$UIKit.align.right) make.right.inset(edges);
                    else make.left.inset(edges);
                }
            }
        };
    }
    /**
     * 用于快速创建 BarButtonItem
     * @param {BarButtonItemProperties} param0
     * @returns {BarButtonItem}
     */ static creat({ symbol: symbol , title: title , tapped: tapped , menu: menu , events: events , align: align = $c9fd8b88f9436ac1$require$UIKit.align.right  }) {
        const barButtonItem = new $c9fd8b88f9436ac1$var$BarButtonItem();
        barButtonItem.setEvents(Object.assign({
            tapped: tapped
        }, events)).setAlign(align).setSymbol(symbol).setTitle(title).setMenu(menu);
        return barButtonItem;
    }
}
/**
 * @typedef {NavigationBarItems} NavigationBarItems
 */ class $c9fd8b88f9436ac1$var$NavigationBarItems {
    rightButtons = [];
    leftButtons = [];
    hasbutton = false;
    isPinTitleView = false;
    setTitleView(titleView) {
        this.titleView = titleView;
        return this;
    }
    pinTitleView() {
        this.isPinTitleView = true;
        return this;
    }
    setFixedFooterView(fixedFooterView) {
        this.fixedFooterView = fixedFooterView;
        return this;
    }
    /**
     *
     * @param {BarButtonItemProperties[]} buttons
     * @returns {this}
     */ setRightButtons(buttons) {
        buttons.forEach((button)=>this.addRightButton(button)
        );
        if (!this.hasbutton) this.hasbutton = true;
        return this;
    }
    /**
     *
     * @param {BarButtonItemProperties[]} buttons
     * @returns {this}
     */ setLeftButtons(buttons) {
        buttons.forEach((button)=>this.addLeftButton(button)
        );
        if (!this.hasbutton) this.hasbutton = true;
        return this;
    }
    /**
     *
     * @param {BarButtonItemProperties} param0
     * @returns {this}
     */ addRightButton({ symbol: symbol , title: title , tapped: tapped , menu: menu , events: events  }) {
        this.rightButtons.push($c9fd8b88f9436ac1$var$BarButtonItem.creat({
            symbol: symbol,
            title: title,
            tapped: tapped,
            menu: menu,
            events: events,
            align: $c9fd8b88f9436ac1$require$UIKit.align.right
        }).definition);
        if (!this.hasbutton) this.hasbutton = true;
        return this;
    }
    /**
     *
     * @param {BarButtonItemProperties} param0
     * @returns {this}
     */ addLeftButton({ symbol: symbol , title: title , tapped: tapped , menu: menu , events: events  }) {
        this.leftButtons.push($c9fd8b88f9436ac1$var$BarButtonItem.creat({
            symbol: symbol,
            title: title,
            tapped: tapped,
            menu: menu,
            events: events,
            align: $c9fd8b88f9436ac1$require$UIKit.align.left
        }).definition);
        if (!this.hasbutton) this.hasbutton = true;
        return this;
    }
    /**
     * 覆盖左侧按钮
     * @param {string} parent 父页面标题，将会显示为文本按钮
     * @param {Object} view 自定义按钮视图
     * @returns {this}
     */ addPopButton(parent, view1) {
        if (!parent) parent = $l10n("BACK");
        this.popButtonView = view1 ?? {
            // 返回按钮
            type: "button",
            props: {
                bgcolor: $color("clear"),
                symbol: "chevron.left",
                tintColor: $c9fd8b88f9436ac1$require$UIKit.linkColor,
                title: ` ${parent}`,
                titleColor: $c9fd8b88f9436ac1$require$UIKit.linkColor,
                font: $font("bold", 16)
            },
            layout: (make, view)=>{
                make.left.equalTo(view.super.safeArea).offset($c9fd8b88f9436ac1$var$BarButtonItem.edges);
                make.centerY.equalTo(view.super.safeArea);
            },
            events: {
                tapped: ()=>{
                    $ui.pop();
                }
            }
        };
        return this;
    }
    removePopButton() {
        this.popButtonView = undefined;
        return this;
    }
}
module.exports = {
    BarTitleView: $c9fd8b88f9436ac1$var$BarTitleView,
    BarButtonItem: $c9fd8b88f9436ac1$var$BarButtonItem,
    NavigationBarItems: $c9fd8b88f9436ac1$var$NavigationBarItems
};

});



parcelRequire.register("4k0q0", function(module, exports) {

var $32595ac88b7cb59e$require$Controller = $148154be0b117222$exports.Controller;
/**
 * @property {function(NavigationView)} ViewController.events.onChange
 */ class $32595ac88b7cb59e$var$ViewController extends $32595ac88b7cb59e$require$Controller {
    #navigationViews = [];
    /**
     * @param {NavigationView} navigationView
     */  #onPop(navigationView) {
        this.callEvent("onPop", navigationView) // 被弹出的对象
        ;
        this.#navigationViews.pop();
    }
    /**
     * push 新页面
     * @param {NavigationView} navigationView
     */ push(navigationView1) {
        const parent = this.#navigationViews[this.#navigationViews.length - 1];
        navigationView1.navigationItem.addPopButton(parent?.navigationItem.title);
        this.#navigationViews.push(navigationView1);
        $ui.push({
            props: {
                statusBarStyle: 0,
                navBarHidden: true
            },
            events: {
                dealloc: ()=>{
                    this.#onPop(navigationView1);
                }
            },
            views: [
                navigationView1.getPage().definition
            ],
            layout: $layout.fill
        });
    }
}
module.exports = {
    ViewController: $32595ac88b7cb59e$var$ViewController
};

});



var $2f6017b2e340210e$require$Controller = $148154be0b117222$exports.Controller;

var $2f6017b2e340210e$require$FileStorage = $d98b0c7ec7b0e4b6$exports.FileStorage;
var $a71e4201aa77432f$exports = {};

var $a71e4201aa77432f$require$View = $57ea6937db5a938e$exports.View;

var $a71e4201aa77432f$require$UIKit = $43f719df810a67fe$exports.UIKit;
class $a71e4201aa77432f$var$FixedFooterView extends $a71e4201aa77432f$require$View {
    height = 60;
    getView() {
        this.type = "view";
        this.setProp("bgcolor", $a71e4201aa77432f$require$UIKit.primaryViewBackgroundColor);
        this.layout = (make, view)=>{
            make.left.right.bottom.equalTo(view.super);
            make.top.equalTo(view.super.safeAreaBottom).offset(-this.height);
        };
        this.views = [
            $a71e4201aa77432f$require$View.create({
                props: this.props,
                views: this.views,
                layout: (make, view)=>{
                    make.left.right.top.equalTo(view.super);
                    make.height.equalTo(this.height);
                }
            })
        ];
        return this;
    }
}
$a71e4201aa77432f$exports = {
    FixedFooterView: $a71e4201aa77432f$var$FixedFooterView
};


var $2f6017b2e340210e$require$FixedFooterView = $a71e4201aa77432f$exports.FixedFooterView;

var $2f6017b2e340210e$require$versionCompare = $d82e3dbdc05d08e1$exports.versionCompare;
var $2f6017b2e340210e$require$l10n = $d82e3dbdc05d08e1$exports.l10n;
var $2f6017b2e340210e$require$objectEqual = $d82e3dbdc05d08e1$exports.objectEqual;
var $2f6017b2e340210e$require$compressImage = $d82e3dbdc05d08e1$exports.compressImage;
var $2f6017b2e340210e$require$Kernel = $d82e3dbdc05d08e1$exports.Kernel;
var $790743eca146f196$exports = {};

var $790743eca146f196$require$View = $57ea6937db5a938e$exports.View;
class $790743eca146f196$var$Matrix extends $790743eca146f196$require$View {
    titleStyle = {
        font: $font("bold", 21),
        height: 30
    };
    #hiddenViews;
    #templateHiddenStatus;
    templateIdByIndex(i) {
        if (this.props.template.views[i]?.props?.id === undefined) {
            if (this.props.template.views[i].props === undefined) this.props.template.views[i].props = {
            };
            this.props.template.views[i].props.id = $text.uuid;
        }
        return this.props.template.views[i].props.id;
    }
    get templateHiddenStatus() {
        if (!this.#templateHiddenStatus) {
            this.#templateHiddenStatus = {
            };
            for(let i = 0; i < this.props.template.views.length; i++){
                // 未定义 id 以及 hidden 的模板默认 hidden 设置为 false
                if (this.props.template.views[i].props.id === undefined && this.props.template.views[i].props.hidden === undefined) this.#templateHiddenStatus[this.templateIdByIndex(i)] = false;
                // 模板中声明 hidden 的值，在数据中将会成为默认值
                if (this.props.template.views[i].props.hidden !== undefined) this.#templateHiddenStatus[this.templateIdByIndex(i)] = this.props.template.views[i].props.hidden;
            }
        }
        return this.#templateHiddenStatus;
    }
    get hiddenViews() {
        if (!this.#hiddenViews) {
            this.#hiddenViews = {
            };
            // hide other views
            for(let i = 0; i < this.props.template.views.length; i++)this.#hiddenViews[this.templateIdByIndex(i)] = {
                hidden: true
            };
        }
        return this.#hiddenViews;
    }
     #titleToData(title) {
        let hiddenViews = {
            ...this.hiddenViews
        };
        // templateProps & title
        Object.assign(hiddenViews, {
            __templateProps: {
                hidden: true
            },
            __title: {
                hidden: false,
                text: title,
                info: {
                    title: true
                }
            }
        });
        return hiddenViews;
    }
    rebuildData(data = []) {
        // rebuild data
        return data.map((section)=>{
            section.items = section.items.map((item)=>{
                // 所有元素都重置 hidden 属性
                Object.keys(item).forEach((key)=>{
                    item[key].hidden = this.templateHiddenStatus[key] ?? false;
                });
                // 修正数据
                Object.keys(this.templateHiddenStatus).forEach((key)=>{
                    if (!item[key]) item[key] = {
                    };
                    item[key].hidden = this.templateHiddenStatus[key];
                });
                item.__templateProps = {
                    hidden: false
                };
                item.__title = {
                    hidden: true
                };
                return item;
            });
            if (section.title) section.items.unshift(this.#titleToData(section.title));
            return section;
        });
    }
    rebuildTemplate() {
        let templateProps = {
        };
        if (this.props.template.props !== undefined) templateProps = Object.assign(this.props.template.props, {
            id: "__templateProps",
            hidden: false
        });
        this.props.template.props = {
        };
        // rebuild template
        const templateViews = [
            {
                // templateProps
                type: "view",
                props: templateProps,
                layout: $layout.fill
            },
            {
                // title
                type: "label",
                props: {
                    id: "__title",
                    hidden: true,
                    font: this.titleStyle.font
                },
                layout: (make, view)=>{
                    make.top.inset(-(this.titleStyle.height / 4) * 3);
                    make.height.equalTo(this.titleStyle.height);
                    make.width.equalTo(view.super.safeArea);
                }
            }
        ].concat(this.props.template.views);
        this.props.template.views = templateViews;
    }
    insert(data, withTitleOffset = true) {
        data.indexPath = this.indexPath(data.indexPath, withTitleOffset);
        return $(this.id).insert(data);
    }
    delete(indexPath, withTitleOffset = true) {
        indexPath = this.indexPath(indexPath, withTitleOffset);
        return $(this.id).delete(indexPath);
    }
    object(indexPath, withTitleOffset = true) {
        indexPath = this.indexPath(indexPath, withTitleOffset);
        return $(this.id).object(indexPath);
    }
    cell(indexPath, withTitleOffset = true) {
        indexPath = this.indexPath(indexPath, withTitleOffset);
        return $(this.id).cell(indexPath);
    }
    /**
     * 获得修正后的 indexPath
     * @param {$indexPath||number} indexPath
     * @param {boolean} withTitleOffset 输入的 indexPath 是否已经包含了标题列。通常自身事件返回的 indexPath 视为已包含，使用默认值即可。
     * @returns {$indexPath}
     */ indexPath(indexPath, withTitleOffset) {
        let offset = withTitleOffset ? 0 : 1;
        if (typeof indexPath === "number") indexPath = $indexPath(0, indexPath);
        indexPath = $indexPath(indexPath.section, indexPath.row + offset);
        return indexPath;
    }
    update(data) {
        this.props.data = this.rebuildData(data);
        $(this.id).data = this.props.data;
    }
    getView() {
        // rebuild data, must first
        this.props.data = this.rebuildData(this.props.data);
        // rebuild template
        this.rebuildTemplate();
        // itemSize event
        this.setEvent("itemSize", (sender, indexPath)=>{
            const info = sender.object(indexPath)?.__title?.info;
            if (info?.title) return $size(Math.max($device.info.screen.width, $device.info.screen.height), 0);
            const columns = this.props.columns ?? 2;
            const spacing = this.props.spacing ?? 15;
            const width = (this.props.itemWidth ?? this.props.itemSize?.width) ?? (sender.super.frame.width - spacing * (columns + 1)) / columns;
            const height = (this.props.itemHeight ?? this.props.itemSize?.height) ?? 100;
            return $size(width, height);
        });
        return this;
    }
}
$790743eca146f196$exports = {
    Matrix: $790743eca146f196$var$Matrix
};


var $2f6017b2e340210e$require$Matrix = $790743eca146f196$exports.Matrix;

var $7Efsa = parcelRequire("7Efsa");
var $2f6017b2e340210e$require$Setting = $7Efsa.Setting;
var $e9ac085fc9cb6318$exports = {};

var $8O0aX = parcelRequire("8O0aX");
var $e9ac085fc9cb6318$require$ValidationError = $8O0aX.ValidationError;

var $e9ac085fc9cb6318$require$View = $57ea6937db5a938e$exports.View;

var $e9ac085fc9cb6318$require$UIKit = $43f719df810a67fe$exports.UIKit;

var $gEL05 = parcelRequire("gEL05");
var $e9ac085fc9cb6318$require$NavigationBar = $gEL05.NavigationBar;
var $e9ac085fc9cb6318$require$NavigationView = $gEL05.NavigationView;
class $e9ac085fc9cb6318$var$SheetAddNavBarError extends Error {
    constructor(){
        super("Please call setView(view) first.");
        this.name = "SheetAddNavBarError";
    }
}
class $e9ac085fc9cb6318$var$SheetViewTypeError extends $e9ac085fc9cb6318$require$ValidationError {
    constructor(parameter, type){
        super(parameter, type);
        this.name = "SheetViewTypeError";
    }
}
class $e9ac085fc9cb6318$var$Sheet extends $e9ac085fc9cb6318$require$View {
    #present = ()=>{
    };
    #dismiss = ()=>{
    };
    /**
     * @type {NavigationView}
     */ navigationView;
    init() {
        const UIModalPresentationStyle = {
            pageSheet: 1
        } // TODO: sheet style
        ;
        const { width: width , height: height  } = $device.info.screen;
        const UIView = $objc("UIView").invoke("initWithFrame", $rect(0, 0, width, height));
        const PSViewController = $objc("UIViewController").invoke("alloc.init");
        const PSViewControllerView = PSViewController.$view();
        PSViewControllerView.$setBackgroundColor($color("primarySurface"));
        PSViewControllerView.$addSubview(UIView);
        PSViewController.$setModalPresentationStyle(UIModalPresentationStyle.pageSheet);
        this.#present = ()=>{
            PSViewControllerView.jsValue().add(this.navigationView?.getPage().definition ?? this.view);
            $ui.vc.ocValue().invoke("presentModalViewController:animated", PSViewController, true);
        };
        this.#dismiss = ()=>PSViewController.invoke("dismissModalViewControllerAnimated", true)
        ;
        return this;
    }
    /**
     * 设置 view
     * @param {Object} view 视图对象
     * @returns {this}
     */ setView(view = {
    }) {
        if (typeof view !== "object") throw new $e9ac085fc9cb6318$var$SheetViewTypeError("view", "object");
        this.view = view;
        return this;
    }
    /**
     * 为 view 添加一个 navBar
     * @param {Object} param
     *  {
     *      {string} title
     *      {Object} popButton 参数与 BarButtonItem 一致
     *      {Array} rightButtons
     *  }
     * @returns {this}
     */ addNavBar({ title: title , popButton: popButton = {
        title: "Done"
    } , rightButtons: rightButtons = []  }) {
        if (this.view === undefined) throw new $e9ac085fc9cb6318$var$SheetAddNavBarError();
        this.navigationView = new $e9ac085fc9cb6318$require$NavigationView();
        // 返回按钮
        const barButtonItem = new BarButtonItem();
        barButtonItem.setEvents(Object.assign({
            tapped: ()=>{
                this.dismiss();
                if (typeof popButton.tapped === "function") popButton.tapped();
            }
        }, popButton.events)).setAlign($e9ac085fc9cb6318$require$UIKit.align.left).setSymbol(popButton.symbol).setTitle(popButton.title).setMenu(popButton.menu);
        const button = barButtonItem.definition.views[0];
        button.layout = (make, view)=>{
            make.left.equalTo(view.super.safeArea).offset(15);
            make.centerY.equalTo(view.super.safeArea);
        };
        this.navigationView.navigationBar.setLargeTitleDisplayMode($e9ac085fc9cb6318$require$NavigationBar.largeTitleDisplayModeNever).pageSheetMode();
        this.navigationView.navigationBarItems.addPopButton("", button).setRightButtons(rightButtons);
        this.navigationView.setView(this.view).navigationBarTitle(title);
        if (this.view.props?.bgcolor) this.navigationView?.getPage().setProp("bgcolor", this.view.props?.bgcolor);
        return this;
    }
    /**
     * 弹出 Sheet
     */ present() {
        this.#present();
    }
    /**
     * 关闭 Sheet
     */ dismiss() {
        this.#dismiss();
    }
}
$e9ac085fc9cb6318$exports = {
    Sheet: $e9ac085fc9cb6318$var$Sheet
};


var $2f6017b2e340210e$require$Sheet = $e9ac085fc9cb6318$exports.Sheet;
var $a5c79c1759137757$exports = {};

var $a5c79c1759137757$require$View = $57ea6937db5a938e$exports.View;
var $a5c79c1759137757$require$PageView = $57ea6937db5a938e$exports.PageView;

var $a5c79c1759137757$require$Controller = $148154be0b117222$exports.Controller;

var $a5c79c1759137757$require$UIKit = $43f719df810a67fe$exports.UIKit;
class $a5c79c1759137757$var$TabBarCellView extends $a5c79c1759137757$require$View {
    constructor(args = {
    }){
        super(args);
        this.setIcon(args.icon);
        this.setTitle(args.title);
        if (args.activeStatus !== undefined) this.activeStatus = args.activeStatus;
    }
    setIcon(icon) {
        // 格式化单个icon和多个icon
        if (icon instanceof Array) this.icon = icon;
        else this.icon = [
            icon,
            icon
        ];
        return this;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    active() {
        $(`${this.props.id}-icon`).image = $image(this.icon[1]);
        $(`${this.props.id}-icon`).tintColor = $color("systemLink");
        $(`${this.props.id}-title`).textColor = $color("systemLink");
        this.activeStatus = true;
    }
    inactive() {
        $(`${this.props.id}-icon`).image = $image(this.icon[0]);
        $(`${this.props.id}-icon`).tintColor = $color("lightGray");
        $(`${this.props.id}-title`).textColor = $color("lightGray");
        this.activeStatus = false;
    }
    getView() {
        this.views = [
            {
                type: "image",
                props: {
                    id: `${this.props.id}-icon`,
                    image: $image(this.activeStatus ? this.icon[1] : this.icon[0]),
                    bgcolor: $color("clear"),
                    tintColor: $color(this.activeStatus ? "systemLink" : "lightGray")
                },
                layout: (make, view)=>{
                    make.centerX.equalTo(view.super);
                    const half = $a5c79c1759137757$var$TabBarController.tabBarHeight / 2;
                    make.size.equalTo(half);
                    make.top.inset(($a5c79c1759137757$var$TabBarController.tabBarHeight - half - 13) / 2);
                }
            },
            {
                type: "label",
                props: {
                    id: `${this.props.id}-title`,
                    text: this.title,
                    font: $font(10),
                    textColor: $color(this.activeStatus ? "systemLink" : "lightGray")
                },
                layout: (make, view)=>{
                    make.centerX.equalTo(view.prev);
                    make.top.equalTo(view.prev.bottom).offset(3);
                }
            }
        ];
        return this;
    }
}
class $a5c79c1759137757$var$TabBarHeaderView extends $a5c79c1759137757$require$View {
    height = 60;
    getView() {
        this.type = "view";
        this.setProp("bgcolor", this.props.bgcolor ?? $a5c79c1759137757$require$UIKit.primaryViewBackgroundColor);
        this.layout = (make, view)=>{
            make.left.right.bottom.equalTo(view.super);
            make.top.equalTo(view.super.safeAreaBottom).offset(-this.height - $a5c79c1759137757$var$TabBarController.tabBarHeight);
        };
        this.views = [
            $a5c79c1759137757$require$View.create({
                props: this.props,
                views: this.views,
                layout: (make, view)=>{
                    make.left.right.top.equalTo(view.super);
                    make.height.equalTo(this.height);
                }
            })
        ];
        return this;
    }
}
/**
 * @property {function(from: string, to: string)} TabBarController.events.onChange
 */ class $a5c79c1759137757$var$TabBarController extends $a5c79c1759137757$require$Controller {
    static tabBarHeight = 50;
    #pages = {
    };
    #cells = {
    };
    #header;
    #selected;
    get selected() {
        return this.#selected;
    }
    set selected(selected) {
        this.switchPageTo(selected);
    }
    get contentOffset() {
        return $a5c79c1759137757$var$TabBarController.tabBarHeight + (this.#header?.height ?? 0);
    }
    /**
     *
     * @param {Object} pages
     * @returns {this}
     */ setPages(pages = {
    }) {
        Object.keys(pages).forEach((key)=>this.setPage(key, pages[key])
        );
        return this;
    }
    setPage(key, page) {
        if (this.#selected === undefined) this.#selected = key;
        if (page instanceof $a5c79c1759137757$require$PageView) this.#pages[key] = page;
        else this.#pages[key] = $a5c79c1759137757$require$PageView.createByViews(page);
        if (this.#selected !== key) this.#pages[key].activeStatus = false;
        return this;
    }
    switchPageTo(key) {
        if (this.#pages[key]) {
            if (this.#selected === key) return;
            // menu 动画
            $ui.animate({
                duration: 0.4,
                animation: ()=>{
                    // 点击的图标
                    this.#cells[key].active();
                }
            });
            // 之前的图标
            this.#cells[this.#selected].inactive();
            // 切换页面
            this.#pages[this.#selected].hide();
            this.#pages[key].show();
            this.callEvent("onChange", this.#selected, key);
            this.#selected = key;
        }
    }
    /**
     *
     * @param {Object} cells
     * @returns {this}
     */ setCells(cells = {
    }) {
        Object.keys(cells).forEach((key)=>this.setCell(key, cells[key])
        );
        return this;
    }
    setCell(key, cell) {
        if (this.#selected === undefined) this.#selected = key;
        if (!(cell instanceof $a5c79c1759137757$var$TabBarCellView)) cell = new $a5c79c1759137757$var$TabBarCellView({
            props: {
                info: {
                    key: key
                }
            },
            icon: cell.icon,
            title: cell.title,
            activeStatus: this.#selected === key
        });
        this.#cells[key] = cell;
        return this;
    }
    setHeader(view) {
        this.#header = view;
        return this;
    }
     #cellViews() {
        const views = [];
        Object.values(this.#cells).forEach((cell)=>{
            cell.setEvent("tapped", (sender)=>{
                const key = sender.info.key;
                // 切换页面
                this.switchPageTo(key);
            });
            views.push(cell.getView());
        });
        return views;
    }
     #pageViews() {
        return Object.values(this.#pages).map((page)=>{
            const view = page.definition;
            if ($a5c79c1759137757$require$UIKit.scrollViewList.indexOf(view.views[0].type) > -1) {
                if (view.views[0].props === undefined) view.views[0].props = {
                };
                // indicatorInsets
                if (view.views[0].props.indicatorInsets) {
                    const old = view.views[0].props.indicatorInsets;
                    view.views[0].props.indicatorInsets = $insets(old.top, old.left, old.bottom + this.contentOffset, old.right);
                } else view.views[0].props.indicatorInsets = $insets(0, 0, 0, this.contentOffset);
                // footer
                if (view.views[0].footer === undefined) view.views[0].footer = {
                    props: {
                    }
                };
                else if (view.views[0].footer.props === undefined) view.views[0].footer.props = {
                };
                if (view.views[0].props.footer.props.height) view.views[0].props.footer.props.height += this.contentOffset;
                else view.views[0].props.footer.props.height = this.contentOffset;
            }
            return view;
        });
    }
    generateView() {
        const tabBarView = {
            type: "view",
            layout: (make, view)=>{
                make.centerX.equalTo(view.super);
                make.width.equalTo(view.super);
                make.top.equalTo(view.super.safeAreaBottom).offset(-$a5c79c1759137757$var$TabBarController.tabBarHeight);
                make.bottom.equalTo(view.super);
            },
            views: [
                $a5c79c1759137757$require$UIKit.blurBox({
                }, [
                    {
                        type: "stack",
                        layout: $layout.fillSafeArea,
                        props: {
                            axis: $stackViewAxis.horizontal,
                            distribution: $stackViewDistribution.fillEqually,
                            spacing: 0,
                            stack: {
                                views: this.#cellViews()
                            }
                        }
                    }
                ]),
                $a5c79c1759137757$require$UIKit.separatorLine({
                }, $a5c79c1759137757$require$UIKit.align.top)
            ]
        };
        return $a5c79c1759137757$require$View.createByViews(this.#pageViews().concat(this.#header?.definition ?? [], tabBarView));
    }
}
$a5c79c1759137757$exports = {
    TabBarCellView: $a5c79c1759137757$var$TabBarCellView,
    TabBarHeaderView: $a5c79c1759137757$var$TabBarHeaderView,
    TabBarController: $a5c79c1759137757$var$TabBarController
};


var $2f6017b2e340210e$require$TabBarCellView = $a5c79c1759137757$exports.TabBarCellView;
var $2f6017b2e340210e$require$TabBarHeaderView = $a5c79c1759137757$exports.TabBarHeaderView;
var $2f6017b2e340210e$require$TabBarController = $a5c79c1759137757$exports.TabBarController;

var $2f6017b2e340210e$require$UIKit = $43f719df810a67fe$exports.UIKit;
var $f3fe29a756aac6d8$exports = {};
class $f3fe29a756aac6d8$var$UILoading {
    #labelId;
    text = "";
    interval;
    fullScreen = false;
    #loop = ()=>{
    };
    constructor(){
        this.#labelId = $text.uuid;
    }
    updateText(text) {
        $(this.#labelId).text = text;
    }
    setLoop(loop) {
        if (typeof loop !== "function") throw "loop must be a function";
        this.#loop = loop;
    }
    done() {
        clearInterval(this.interval);
    }
    load() {
        $ui.render({
            props: {
                navBarHidden: this.fullScreen
            },
            views: [
                {
                    type: "spinner",
                    props: {
                        loading: true
                    },
                    layout: (make, view)=>{
                        make.centerY.equalTo(view.super).offset(-15);
                        make.width.equalTo(view.super);
                    }
                },
                {
                    type: "label",
                    props: {
                        id: this.#labelId,
                        align: $align.center,
                        text: ""
                    },
                    layout: (make, view)=>{
                        make.top.equalTo(view.prev.bottom).offset(10);
                        make.left.right.equalTo(view.super);
                    }
                }
            ],
            layout: $layout.fill,
            events: {
                appeared: ()=>{
                    this.interval = setInterval(()=>{
                        this.#loop();
                    }, 100);
                }
            }
        });
    }
}
$f3fe29a756aac6d8$exports = {
    UILoading: $f3fe29a756aac6d8$var$UILoading
};


var $2f6017b2e340210e$require$UILoading = $f3fe29a756aac6d8$exports.UILoading;

var $8O0aX = parcelRequire("8O0aX");
var $2f6017b2e340210e$require$ValidationError = $8O0aX.ValidationError;

var $2f6017b2e340210e$require$View = $57ea6937db5a938e$exports.View;
var $2f6017b2e340210e$require$PageView = $57ea6937db5a938e$exports.PageView;

var $4k0q0 = parcelRequire("4k0q0");
var $2f6017b2e340210e$require$ViewController = $4k0q0.ViewController;

var $gEL05 = parcelRequire("gEL05");
var $2f6017b2e340210e$require$NavigationView = $gEL05.NavigationView;

var $1gPEj = parcelRequire("1gPEj");
var $2f6017b2e340210e$require$NavigationBar = $1gPEj.NavigationBar;
var $2f6017b2e340210e$require$NavigationBarController = $1gPEj.NavigationBarController;

var $hlbNb = parcelRequire("hlbNb");
var $2f6017b2e340210e$require$NavigationBarItems = $hlbNb.NavigationBarItems;
var $9a07582546ca6ab2$exports = {};

var $9a07582546ca6ab2$require$Controller = $148154be0b117222$exports.Controller;

var $hlbNb = parcelRequire("hlbNb");
var $9a07582546ca6ab2$require$BarTitleView = $hlbNb.BarTitleView;
class $9a07582546ca6ab2$var$SearchBar extends $9a07582546ca6ab2$require$BarTitleView {
    height = 35;
    topOffset = 15;
    bottomOffset = 10;
    kbType = $kbType.search;
    placeholder = $l10n("SEARCH");
    constructor(args){
        super(args);
        this.setController(new $9a07582546ca6ab2$var$SearchBarController());
        this.controller.setSearchBar(this);
        this.init();
    }
    init() {
        this.props = {
            id: this.id,
            smoothCorners: true,
            cornerRadius: 6,
            bgcolor: $color("#EEF1F1", "#212121")
        };
        this.views = [
            {
                type: "input",
                props: {
                    id: this.id + "-input",
                    type: this.kbType,
                    bgcolor: $color("clear"),
                    placeholder: this.placeholder
                },
                layout: $layout.fill,
                events: {
                    changed: (sender)=>this.controller.callEvent("onChange", sender.text)
                }
            }
        ];
        this.layout = (make, view)=>{
            make.height.equalTo(this.height);
            make.top.equalTo(view.super.safeArea).offset(this.topOffset);
            make.left.equalTo(view.super.safeArea).offset(15);
            make.right.equalTo(view.super.safeArea).offset(-15);
        };
    }
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }
    setKbType(kbType) {
        this.kbType = kbType;
        return this;
    }
}
class $9a07582546ca6ab2$var$SearchBarController extends $9a07582546ca6ab2$require$Controller {
    setSearchBar(searchBar) {
        this.searchBar = searchBar;
        return this;
    }
    updateSelector() {
        this.selector = {
            inputBox: $(this.searchBar.id),
            input: $(this.searchBar.id + "-input")
        };
    }
    hide() {
        this.updateSelector();
        this.selector.inputBox.updateLayout((make)=>{
            make.height.equalTo(0);
        });
    }
    show() {
        this.updateSelector();
        this.selector.inputBox.updateLayout((make)=>{
            make.height.equalTo(this.searchBar.height);
        });
    }
    didScroll(contentOffset) {
        this.updateSelector();
        // 调整大小
        let height = this.searchBar.height - contentOffset;
        height = height > 0 ? height > this.searchBar.height ? this.searchBar.height : height : 0;
        this.selector.inputBox.updateLayout((make)=>{
            make.height.equalTo(height);
        });
        // 隐藏内容
        if (contentOffset > 0) {
            const alpha = (this.searchBar.height / 2 - 5 - contentOffset) / 10;
            this.selector.input.alpha = alpha;
        } else this.selector.input.alpha = 1;
    }
    didEndDragging(contentOffset, decelerate, scrollToOffset) {
        this.updateSelector();
        if (contentOffset >= 0 && contentOffset <= this.searchBar.height) scrollToOffset($point(0, contentOffset >= this.searchBar.height / 2 ? this.searchBar.height : 0));
    }
}
$9a07582546ca6ab2$exports = {
    SearchBar: $9a07582546ca6ab2$var$SearchBar,
    SearchBarController: $9a07582546ca6ab2$var$SearchBarController
};


var $2f6017b2e340210e$require$SearchBar = $9a07582546ca6ab2$exports.SearchBar;
var $2f6017b2e340210e$require$SearchBarController = $9a07582546ca6ab2$exports.SearchBarController;
module.exports = {
    Controller: $2f6017b2e340210e$require$Controller,
    FileStorage: $2f6017b2e340210e$require$FileStorage,
    FixedFooterView: $2f6017b2e340210e$require$FixedFooterView,
    versionCompare: $2f6017b2e340210e$require$versionCompare,
    l10n: $2f6017b2e340210e$require$l10n,
    objectEqual: $2f6017b2e340210e$require$objectEqual,
    compressImage: $2f6017b2e340210e$require$compressImage,
    Kernel: $2f6017b2e340210e$require$Kernel,
    Matrix: $2f6017b2e340210e$require$Matrix,
    Setting: $2f6017b2e340210e$require$Setting,
    Sheet: $2f6017b2e340210e$require$Sheet,
    TabBarCellView: $2f6017b2e340210e$require$TabBarCellView,
    TabBarHeaderView: $2f6017b2e340210e$require$TabBarHeaderView,
    TabBarController: $2f6017b2e340210e$require$TabBarController,
    UIKit: $2f6017b2e340210e$require$UIKit,
    UILoading: $2f6017b2e340210e$require$UILoading,
    ValidationError: $2f6017b2e340210e$require$ValidationError,
    View: $2f6017b2e340210e$require$View,
    PageView: $2f6017b2e340210e$require$PageView,
    ViewController: $2f6017b2e340210e$require$ViewController,
    NavigationView: $2f6017b2e340210e$require$NavigationView,
    NavigationBar: $2f6017b2e340210e$require$NavigationBar,
    NavigationBarController: $2f6017b2e340210e$require$NavigationBarController,
    NavigationBarItems: $2f6017b2e340210e$require$NavigationBarItems,
    SearchBar: $2f6017b2e340210e$require$SearchBar,
    SearchBarController: $2f6017b2e340210e$require$SearchBarController
};


