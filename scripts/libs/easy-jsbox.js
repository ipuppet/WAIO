// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
    /* eslint-disable no-undef */
    var globalObject =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {};
    /* eslint-enable no-undef */
  
    // Save the require from previous bundle to this closure if any
    var previousRequire =
      typeof globalObject[parcelRequireName] === 'function' &&
      globalObject[parcelRequireName];
  
    var cache = previousRequire.cache || {};
    // Do not use `require` to prevent Webpack from trying to bundle this call
    var nodeRequire =
      typeof module !== 'undefined' &&
      typeof module.require === 'function' &&
      module.require.bind(module);
  
    function newRequire(name, jumped) {
      if (!cache[name]) {
        if (!modules[name]) {
          // if we cannot find the module within our internal map or
          // cache jump to the current global require ie. the last bundle
          // that was added to the page.
          var currentRequire =
            typeof globalObject[parcelRequireName] === 'function' &&
            globalObject[parcelRequireName];
          if (!jumped && currentRequire) {
            return currentRequire(name, true);
          }
  
          // If there are other bundles on this page the require from the
          // previous one is saved to 'previousRequire'. Repeat this as
          // many times as there are bundles until the module is found or
          // we exhaust the require chain.
          if (previousRequire) {
            return previousRequire(name, true);
          }
  
          // Try the node require function if it exists.
          if (nodeRequire && typeof name === 'string') {
            return nodeRequire(name);
          }
  
          var err = new Error("Cannot find module '" + name + "'");
          err.code = 'MODULE_NOT_FOUND';
          throw err;
        }
  
        localRequire.resolve = resolve;
        localRequire.cache = {};
  
        var module = (cache[name] = new newRequire.Module(name));
  
        modules[name][0].call(
          module.exports,
          localRequire,
          module,
          module.exports,
          this
        );
      }
  
      return cache[name].exports;
  
      function localRequire(x) {
        var res = localRequire.resolve(x);
        return res === false ? {} : newRequire(res);
      }
  
      function resolve(x) {
        var id = modules[name][1][x];
        return id != null ? id : x;
      }
    }
  
    function Module(moduleName) {
      this.id = moduleName;
      this.bundle = newRequire;
      this.exports = {};
    }
  
    newRequire.isParcelRequire = true;
    newRequire.Module = Module;
    newRequire.modules = modules;
    newRequire.cache = cache;
    newRequire.parent = previousRequire;
    newRequire.register = function (id, exports) {
      modules[id] = [
        function (require, module) {
          module.exports = exports;
        },
        {},
      ];
    };
  
    Object.defineProperty(newRequire, 'root', {
      get: function () {
        return globalObject[parcelRequireName];
      },
    });
  
    globalObject[parcelRequireName] = newRequire;
  
    for (var i = 0; i < entry.length; i++) {
      newRequire(entry[i]);
    }
  
    if (mainEntry) {
      // Expose entry point to Node, AMD or browser globals
      // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
      var mainExports = newRequire(mainEntry);
  
      // CommonJS
      if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = mainExports;
  
        // RequireJS
      } else if (typeof define === 'function' && define.amd) {
        define(function () {
          return mainExports;
        });
  
        // <script>
      } else if (globalName) {
        this[globalName] = mainExports;
      }
    }
  })({"2A4D3":[function(require,module,exports) {
  const { VERSION  } = require("./version");
  const { Controller  } = require("./controller");
  const { FileManager  } = require("./file-manager");
  const { FileStorageParameterError , FileStorageFileNotFoundError , FileStorage  } = require("./file-storage");
  const { FixedFooterView  } = require("./fixed-footer-view");
  const { Kernel  } = require("./kernel");
  const { Matrix  } = require("./matrix");
  const { Request  } = require("./request");
  const { Setting  } = require("./setting");
  const { Sheet  } = require("./sheet");
  const { TabBarCellView , TabBarHeaderView , TabBarController  } = require("./tab-bar");
  const { Tasks  } = require("./tasks");
  const { UIKit  } = require("./ui-kit");
  const { UILoading  } = require("./ui-loading");
  const { ValidationError  } = require("./validation-error");
  const { View , PageView  } = require("./view");
  const { ViewController  } = require("./navigation-view/view-controller");
  const { NavigationView  } = require("./navigation-view/navigation-view");
  const { NavigationBar , NavigationBarController  } = require("./navigation-view/navigation-bar");
  const { NavigationBarItems , BarButtonItem  } = require("./navigation-view/navigation-bar-items");
  const { SearchBar , SearchBarController  } = require("./navigation-view/search-bar");
  module.exports = {
      VERSION,
      Controller,
      FileManager,
      FileStorageParameterError,
      FileStorageFileNotFoundError,
      FileStorage,
      FixedFooterView,
      Kernel,
      Matrix,
      Request,
      Setting,
      Sheet,
      TabBarCellView,
      TabBarHeaderView,
      TabBarController,
      Tasks,
      UIKit,
      UILoading,
      ValidationError,
      View,
      PageView,
      ViewController,
      NavigationView,
      NavigationBar,
      NavigationBarController,
      NavigationBarItems,
      BarButtonItem,
      SearchBar,
      SearchBarController
  };
  
  },{"./version":"1tka5","./controller":"gQNQr","./file-manager":"jXB3T","./file-storage":"2m0Zd","./fixed-footer-view":"jB4yI","./kernel":"6dSiu","./matrix":"5qO2y","./request":"amu5e","./setting":"lCpBo","./sheet":"cUlT6","./tab-bar":"90fDH","./tasks":"bnAky","./ui-kit":"c4IeO","./ui-loading":"jBNeq","./validation-error":"e86IV","./view":"eLzep","./navigation-view/view-controller":"cF3st","./navigation-view/navigation-view":"fikOh","./navigation-view/navigation-bar":"gMo6S","./navigation-view/navigation-bar-items":"4XBoJ","./navigation-view/search-bar":"gLIXD"}],"1tka5":[function(require,module,exports) {
  module.exports = {
      VERSION: "1.3.1"
  };
  
  },{}],"gQNQr":[function(require,module,exports) {
  class Controller {
      events = {};
      setEvents(events) {
          Object.keys(events).forEach((event)=>this.setEvent(event, events[event]));
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
  module.exports = {
      Controller
  };
  
  },{}],"jXB3T":[function(require,module,exports) {
  const { UIKit  } = require("./ui-kit");
  const { Sheet  } = require("./sheet");
  const { Kernel  } = require("./kernel");
  const { NavigationView  } = require("./navigation-view/navigation-view");
  const { NavigationBar  } = require("./navigation-view/navigation-bar");
  /**
   * @typedef {import("./navigation-view/view-controller").ViewController} ViewController
   */ class FileManager {
      /**
       * @type {ViewController}
       */ viewController;
      constructor(){
          this.listId = "file-manager-list";
          this.edges = 10;
          this.iconSize = 25;
          this.loadL10n();
      }
      loadL10n() {
          Kernel.l10n("zh-Hans", `
              "CONFIRM_DELETE_MSG" = "确认要删除吗";
              "DELETE" = "删除";
              "CANCEL" = "取消";
              "CLOSE" = "关闭";
              "SHARE" = "分享";
              "SAVE" = "保存";
              "SAVE_SUCCESS" = "保存成功";
              `);
          Kernel.l10n("en", `
              "CONFIRM_DELETE_MSG" = "Are you sure you want to delete";
              "DELETE" = "Delete";
              "CANCEL" = "Cancel";
              "CLOSE" = "Close";
              "SHARE" = "Share";
              "SAVE" = "Save";
              "SAVE_SUCCESS" = "Save Success";
              `);
      }
      /**
       *
       * @param {ViewController} viewController
       */ setViewController(viewController) {
          this.viewController = viewController;
      }
      get menu() {
          return {
              items: [
                  {
                      title: $l10n("SHARE"),
                      symbol: "square.and.arrow.up",
                      handler: async (sender, indexPath)=>{
                          const info = sender.object(indexPath).info.info;
                          $share.sheet([
                              $file.absolutePath(info.path)
                          ]);
                      }
                  }
              ]
          };
      }
      delete(info) {
          $file.delete(info.path);
      }
      edit(info) {
          const file = $file.read(info.path);
          if (file.image) $quicklook.open({
              image: file.image
          });
          else {
              const sheet = new Sheet();
              const id = $text.uuid;
              sheet.setView({
                  type: "code",
                  layout: $layout.fill,
                  props: {
                      id: id,
                      lineNumbers: true,
                      theme: $device.isDarkMode ? "atom-one-dark" : "atom-one-light",
                      text: file.string,
                      insets: $insets(15, 15, 15, 15)
                  }
              }).addNavBar({
                  title: info.file,
                  popButton: {
                      title: $l10n("CLOSE")
                  },
                  rightButtons: [
                      {
                          title: $l10n("SAVE"),
                          tapped: ()=>{
                              $file.write({
                                  data: $data({
                                      string: $(id).text
                                  }),
                                  path: info.path
                              });
                              $ui.success($l10n("SAVE_SUCCESS"));
                          }
                      }
                  ]
              });
              sheet.init().present();
          }
      }
      getFiles(basePath = "") {
          const files = $file.list(basePath).map((file)=>{
              const path = basePath + "/" + file;
              const isDirectory = $file.isDirectory(path);
              return {
                  info: {
                      info: {
                          path,
                          file,
                          isDirectory
                      }
                  },
                  icon: {
                      symbol: isDirectory ? "folder.fill" : "doc"
                  },
                  name: {
                      text: file
                  },
                  size: {
                      text: isDirectory ? "" : "--"
                  }
              };
          }).sort((a, b)=>{
              if (a.info.info.isDirectory !== b.info.info.isDirectory) return a.info.info.isDirectory ? -1 : 1;
              if (a.info.info.isDirectory === b.info.info.isDirectory) return a.info.info.file.localeCompare(b.info.info.file);
          });
          return files;
      }
      async loadFileSize(data) {
          data.map((item, i)=>{
              const info = item.info.info;
              if (!info.isDirectory) try {
                  data[i].size.text = Kernel.bytesToSize($file.read(info.path).info.size);
              } catch (error) {
                  data[i].size.text = error;
              }
          });
          return data;
      }
      get listTemplate() {
          return {
              props: {
                  bgcolor: $color("clear")
              },
              views: [
                  {
                      props: {
                          id: "info"
                      }
                  },
                  {
                      type: "image",
                      props: {
                          id: "icon"
                      },
                      layout: (make, view)=>{
                          make.centerY.equalTo(view.super);
                          make.left.inset(this.edges);
                          make.size.equalTo(this.iconSize);
                      }
                  },
                  {
                      type: "label",
                      props: {
                          id: "name",
                          lines: 1
                      },
                      layout: (make, view)=>{
                          make.centerY.equalTo(view.super);
                          make.left.equalTo(view.prev.right).offset(this.edges);
                      }
                  },
                  {
                      type: "label",
                      props: {
                          id: "size",
                          color: $color("secondaryText"),
                          lines: 1
                      },
                      layout: (make, view)=>{
                          make.centerY.equalTo(view.super);
                          make.right.inset(this.edges);
                      }
                  }
              ]
          };
      }
       #pushPage(title, view) {
          if (this.viewController) {
              const nv = new NavigationView();
              nv.setView(view).navigationBarTitle(title);
              nv.navigationBar.setLargeTitleDisplayMode(NavigationBar.largeTitleDisplayModeNever);
              this.viewController.push(nv);
          } else UIKit.push({
              title,
              views: [
                  view
              ]
          });
      }
      getListView(basePath = "") {
          return {
              // 剪切板列表
              type: "list",
              props: {
                  id: this.listId,
                  menu: this.menu,
                  info: {
                      basePath
                  },
                  bgcolor: UIKit.primaryViewBackgroundColor,
                  separatorInset: $insets(0, this.edges, 0, 0),
                  data: [],
                  template: this.listTemplate,
                  actions: [
                      {
                          // 删除
                          title: " " + $l10n("DELETE") + " ",
                          color: $color("red"),
                          handler: (sender, indexPath)=>{
                              const info = sender.object(indexPath).info.info;
                              Kernel.deleteConfirm($l10n("CONFIRM_DELETE_MSG") + ' "' + info.file + '" ?', ()=>{
                                  this.delete(info);
                                  sender.delete(indexPath);
                              });
                          }
                      }
                  ]
              },
              layout: $layout.fill,
              events: {
                  ready: ()=>{
                      const data = this.getFiles(basePath);
                      $(this.listId).data = data;
                      this.loadFileSize(data).then((data)=>{
                          $(this.listId).data = data;
                      });
                  },
                  pulled: async (sender)=>{
                      const data = this.getFiles($(this.listId).info.basePath);
                      $(this.listId).data = data;
                      $(this.listId).data = await this.loadFileSize(data);
                      $delay(0.5, ()=>{
                          sender.endRefreshing();
                      });
                  },
                  didSelect: (sender, indexPath, data)=>{
                      const info = data.info.info;
                      if (info.isDirectory) this.#pushPage(info.file, this.getListView(info.path));
                      else this.edit(info);
                  }
              }
          };
      }
      push(basePath = "") {
          const pathName = basePath.substring(basePath.lastIndexOf("/"));
          this.#pushPage(pathName, this.getListView(basePath));
      }
  }
  module.exports = {
      FileManager
  };
  
  },{"./ui-kit":"c4IeO","./sheet":"cUlT6","./kernel":"6dSiu","./navigation-view/navigation-view":"fikOh","./navigation-view/navigation-bar":"gMo6S"}],"c4IeO":[function(require,module,exports) {
  class UIKit {
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
      static NavigationBarLargeTitleHeight = $objc("UITabBarController").invoke("alloc.init").$tabBar().jsValue().frame.height + UIKit.NavigationBarNormalHeight;
      /**
       * 判断是否是分屏模式
       * @type {boolean}
       */ static get isSplitScreenMode() {
          return UIKit.isLargeScreen && $device.info.screen.width !== UIKit.windowSize.width;
      }
      static get topSafeAreaInsets() {
          return UIKit.#sharedApplication?.$keyWindow()?.$safeAreaInsets()?.top ?? 0;
      }
      static get bottomSafeAreaInsets() {
          return UIKit.#sharedApplication?.$keyWindow()?.$safeAreaInsets()?.bottom ?? 0;
      }
      static get statusBarOrientation() {
          return UIKit.#sharedApplication.$statusBarOrientation();
      }
      /**
       * 调试模式控制台高度
       * @type {number}
       */ static get consoleBarHeight() {
          if ($app.isDebugging) {
              let height = UIKit.#sharedApplication.$statusBarFrame().height + 26;
              if ($device.isIphoneX) height += 30;
              return height;
          }
          return 0;
      }
      static get isHorizontal() {
          return UIKit.statusBarOrientation === 3 || UIKit.statusBarOrientation === 4;
      }
      static loading() {
          const loading = $ui.create(UIKit.blurBox({
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
                      const width = Math.min(UIKit.windowSize.width * 0.6, 300);
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
          return UIKit.scrollViewList.indexOf(type) > -1 ? UIKit.scrollViewBackgroundColor : UIKit.primaryViewBackgroundColor;
      }
      static separatorLine(props = {}, align = UIKit.align.bottom) {
          return {
              // canvas
              type: "canvas",
              props: props,
              layout: (make, view)=>{
                  if (view.prev === undefined) make.top.equalTo(view.super);
                  else if (align === UIKit.align.bottom) make.top.equalTo(view.prev.bottom);
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
      static blurBox(props = {}, views = [], layout = $layout.fill) {
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
       */ static push({ views , statusBarStyle =0 , title ="" , navButtons =[
          {
              title: ""
          }
      ] , bgcolor =views[0]?.props?.bgcolor ?? "primarySurface" , disappeared  } = {}) {
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
  module.exports = {
      UIKit
  };
  
  },{}],"cUlT6":[function(require,module,exports) {
  const { ValidationError  } = require("./validation-error");
  const { View  } = require("./view");
  const { UIKit  } = require("./ui-kit");
  const { NavigationView  } = require("./navigation-view/navigation-view");
  const { NavigationBar  } = require("./navigation-view/navigation-bar");
  const { BarButtonItem  } = require("./navigation-view/navigation-bar-items");
  class SheetAddNavBarError extends Error {
      constructor(){
          super("Please call setView(view) first.");
          this.name = "SheetAddNavBarError";
      }
  }
  class SheetViewTypeError extends ValidationError {
      constructor(parameter, type){
          super(parameter, type);
          this.name = "SheetViewTypeError";
      }
  }
  class Sheet extends View {
      #present = ()=>{};
      #dismiss = ()=>{};
      style = Sheet.UIModalPresentationStyle.PageSheet;
      #preventDismiss = false;
      static UIModalPresentationStyle = {
          Automatic: -2,
          FullScreen: 0,
          PageSheet: 1,
          FormSheet: 2,
          CurrentContext: 3,
          Custom: 4,
          OverFullScreen: 5,
          OverCurrentContext: 6,
          Popover: 7,
          BlurOverFullScreen: 8
      };
      /**
       * @type {NavigationView}
       */ navigationView;
      init() {
          const { width , height  } = $device.info.screen;
          const UIView = $objc("UIView").invoke("initWithFrame", $rect(0, 0, width, height));
          const ViewController = $objc("UIViewController").invoke("alloc.init");
          const ViewControllerView = ViewController.$view();
          ViewControllerView.$setBackgroundColor(UIKit.primaryViewBackgroundColor);
          ViewControllerView.$addSubview(UIView);
          ViewController.$setModalPresentationStyle(this.style);
          ViewController.$setModalInPresentation(this.#preventDismiss);
          this.#present = ()=>{
              ViewControllerView.jsValue().add(this.navigationView?.getPage().definition ?? this.view);
              $ui.vc.ocValue().invoke("presentViewController:animated:completion:", ViewController, true, undefined);
          };
          this.#dismiss = ()=>ViewController.invoke("dismissViewControllerAnimated:completion:", true, undefined);
          return this;
      }
      preventDismiss() {
          this.#preventDismiss = true;
          return this;
      }
      setStyle(style) {
          this.style = style;
          return this;
      }
      /**
       * 设置 view
       * @param {Object} view 视图对象
       * @returns {this}
       */ setView(view = {}) {
          if (typeof view !== "object") throw new SheetViewTypeError("view", "object");
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
       */ addNavBar({ title ="" , popButton ={
          title: $l10n("DONE")
      } , rightButtons =[]  } = {}) {
          if (this.view === undefined) throw new SheetAddNavBarError();
          this.navigationView = new NavigationView();
          // 返回按钮
          const barButtonItem = new BarButtonItem();
          barButtonItem.setEvents(Object.assign({
              tapped: ()=>{
                  this.dismiss();
                  if (typeof popButton.tapped === "function") popButton.tapped();
              }
          }, popButton.events)).setAlign(UIKit.align.left).setSymbol(popButton.symbol).setTitle(popButton.title).setMenu(popButton.menu);
          const button = barButtonItem.definition.views[0];
          button.layout = (make, view)=>{
              make.left.equalTo(view.super.safeArea).offset(15);
              make.centerY.equalTo(view.super.safeArea);
          };
          this.navigationView.navigationBar.setLargeTitleDisplayMode(NavigationBar.largeTitleDisplayModeNever).pageSheetMode();
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
  module.exports = {
      Sheet
  };
  
  },{"./validation-error":"e86IV","./view":"eLzep","./ui-kit":"c4IeO","./navigation-view/navigation-view":"fikOh","./navigation-view/navigation-bar":"gMo6S","./navigation-view/navigation-bar-items":"4XBoJ"}],"e86IV":[function(require,module,exports) {
  class ValidationError extends Error {
      constructor(parameter, type){
          super(`The type of the parameter '${parameter}' must be '${type}'`);
          this.name = "ValidationError";
      }
  }
  module.exports = {
      ValidationError
  };
  
  },{}],"eLzep":[function(require,module,exports) {
  const { UIKit  } = require("./ui-kit");
  /**
   * 视图基类
   */ class View {
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
      constructor({ type ="view" , props ={} , views =[] , events ={} , layout =$layout.fill  } = {}){
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
              views
          });
      }
      setProps(props) {
          Object.keys(props).forEach((key)=>this.setProp(key, props[key]));
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
          Object.keys(events).forEach((event)=>this.setEvent(event, events[event]));
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
  class PageView extends View {
      constructor(args = {}){
          super(args);
          this.activeStatus = true;
      }
      scrollable() {
          let type = this.type;
          if (this.views.length > 0) type = this.views[0].type;
          return UIKit.scrollViewList.indexOf(type) > -1;
      }
      get scrollableView() {
          return this.views[0];
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
  module.exports = {
      View,
      PageView
  };
  
  },{"./ui-kit":"c4IeO"}],"fikOh":[function(require,module,exports) {
  const { View , PageView  } = require("../view");
  const { ValidationError  } = require("../validation-error");
  const { Kernel  } = require("../kernel");
  const { UIKit  } = require("../ui-kit");
  const { NavigationBar , NavigationBarController  } = require("./navigation-bar");
  const { NavigationBarItems  } = require("./navigation-bar-items");
  class NavigationViewTypeError extends ValidationError {
      constructor(parameter, type){
          super(parameter, type);
          this.name = "NavigationViewTypeError";
      }
  }
  /**
   * @typedef {NavigationView} NavigationView
   */ class NavigationView {
      /**
       * @type {PageView}
       */ page;
      navigationController = new NavigationBarController();
      navigationBar = new NavigationBar();
      navigationBarItems = new NavigationBarItems();
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
          if (typeof view !== "object") throw new NavigationViewTypeError("view", "object");
          this.view = View.create(view);
          return this;
      }
       #bindScrollEvents() {
          if (!(this.view instanceof View)) throw new NavigationViewTypeError("view", "View");
          const topSafeAreaInsets = $app.isDebugging || Kernel.isTaio ? 0 : UIKit.topSafeAreaInsets;
          // 计算偏移高度
          let height = this.navigationBar.contentViewHeightOffset;
          if (this.navigationBarItems.titleView) {
              height += this.navigationBarItems.titleView.topOffset;
              height += this.navigationBarItems.titleView.height;
              height += this.navigationBarItems.titleView.bottomOffset;
          }
          if (this.view.props.stickyHeader) height += this.navigationBar.largeTitleFontHeight;
          else if (this.navigationBar.largeTitleDisplayMode === NavigationBar.largeTitleDisplayModeNever) height += this.navigationBar.navigationBarNormalHeight;
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
                          make.top.equalTo(height);
                          make.bottom.width.equalTo(view.super);
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
          this.view.props.footer = Object.assign({
              props: {}
          }, this.view.props.footer ?? {});
          this.view.props.footer.props.height = (this.navigationBarItems.fixedFooterView?.height ?? 0) + (this.view.props.footer.props?.height ?? 0);
          // 重写布局
          if (UIKit.scrollViewList.indexOf(this.view.type) === -1) // 非滚动视图
          this.view.layout = (make, view)=>{
              make.left.right.equalTo(view.super.safeArea);
              make.bottom.equalTo(view.super);
              let topOffset = this.navigationBar.contentViewHeightOffset;
              if (this.navigationBar.largeTitleDisplayMode !== NavigationBar.largeTitleDisplayModeNever) topOffset += this.navigationBar.largeTitleFontHeight;
              if (this.navigationBarItems.titleView) topOffset += this.navigationBarItems.titleView.topOffset + this.navigationBarItems.titleView.bottomOffset;
              if ((!UIKit.isHorizontal || UIKit.isLargeScreen) && this.navigationBar.topSafeArea) topOffset += topSafeAreaInsets;
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
                  if ((!UIKit.isHorizontal || UIKit.isLargeScreen) && this.navigationBar.topSafeArea && !this.view.props.stickyHeader) contentOffset += topSafeAreaInsets;
                  this.navigationController.didScroll(contentOffset);
              }).assignEvent("didEndDragging", (sender, decelerate)=>{
                  let contentOffset = sender.contentOffset.y;
                  let zeroOffset = 0;
                  if ((!UIKit.isHorizontal || UIKit.isLargeScreen) && this.navigationBar.topSafeArea && !this.view.props.stickyHeader) {
                      contentOffset += topSafeAreaInsets;
                      zeroOffset = topSafeAreaInsets;
                  }
                  this.navigationController.didEndDragging(contentOffset, decelerate, (...args)=>sender.scrollToOffset(...args), zeroOffset);
              }).assignEvent("didEndDecelerating", (...args)=>{
                  if (args[0].tracking) return;
                  this.view.events?.didEndDragging(...args);
              });
          }
      }
       #initPage() {
          if (this.navigationBar.prefersLargeTitles) {
              this.#bindScrollEvents();
              let titleView = {};
              if (this.navigationBarItems.titleView) {
                  // 修改 titleView 背景与 navigationBar 相同
                  const isHideBackground = this.navigationBar.prefersLargeTitles ? 0 : 1;
                  titleView = View.create({
                      views: [
                          this.navigationBar.backgroundColor ? {
                              type: "view",
                              props: {
                                  alpha: isHideBackground,
                                  bgcolor: this.navigationBar.backgroundColor,
                                  id: this.navigationBar.id + "-title-view-background"
                              },
                              layout: $layout.fill
                          } : UIKit.blurBox({
                              alpha: isHideBackground,
                              id: this.navigationBar.id + "-title-view-background"
                          }),
                          UIKit.separatorLine({
                              id: this.navigationBar.id + "-title-view-underline",
                              alpha: isHideBackground
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
              this.page = PageView.createByViews([
                  this.view,
                  this.navigationBar.getLargeTitleView(),
                  titleView,
                  this.navigationBar.getNavigationBarView(),
                  this.navigationBarItems.fixedFooterView?.definition ?? {}
              ]);
          } else this.page = PageView.createByViews([
              this.view
          ]);
          if (this.view.props?.bgcolor) this.page.setProp("bgcolor", this.view.props.bgcolor);
          else this.page.setProp("bgcolor", UIKit.defaultBackgroundColor(this.view.type));
      }
      getPage() {
          if (!this.page) this.#initPage();
          return this.page;
      }
  }
  module.exports = {
      NavigationView
  };
  
  },{"../view":"eLzep","../validation-error":"e86IV","../ui-kit":"c4IeO","./navigation-bar":"gMo6S","./navigation-bar-items":"4XBoJ","../kernel":"6dSiu"}],"gMo6S":[function(require,module,exports) {
  const { View  } = require("../view");
  const { Controller  } = require("../controller");
  const { UIKit  } = require("../ui-kit");
  const { BarButtonItem  } = require("./navigation-bar-items");
  /**
   * @typedef {import("./navigation-bar-items").NavigationBarItems} NavigationBarItems
   */ class NavigationBar extends View {
      static largeTitleDisplayModeAutomatic = 0;
      static largeTitleDisplayModeAlways = 1;
      static largeTitleDisplayModeNever = 2;
      static pageSheetNavigationBarHeight = 56;
      /**
       * @type {NavigationBarItems}
       */ navigationBarItems;
      title = "";
      prefersLargeTitles = true;
      largeTitleDisplayMode = NavigationBar.largeTitleDisplayModeAutomatic;
      largeTitleFontSize = 34;
      largeTitleFontFamily = "bold";
      largeTitleFontHeight = $text.sizeThatFits({
          text: "A",
          width: 100,
          font: $font(this.largeTitleFontFamily, this.largeTitleFontSize)
      }).height;
      navigationBarTitleFontSize = 17;
      topSafeArea = true;
      contentViewHeightOffset = 10;
      navigationBarNormalHeight = UIKit.NavigationBarNormalHeight;
      navigationBarLargeTitleHeight = UIKit.NavigationBarLargeTitleHeight;
      pageSheetMode() {
          this.navigationBarLargeTitleHeight -= this.navigationBarNormalHeight;
          this.navigationBarNormalHeight = NavigationBar.pageSheetNavigationBarHeight;
          this.navigationBarLargeTitleHeight += this.navigationBarNormalHeight;
          this.topSafeArea = false;
          return this;
      }
      setTopSafeArea() {
          this.topSafeArea = true;
          return this;
      }
      removeTopSafeArea() {
          this.topSafeArea = false;
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
          return this.prefersLargeTitles && this.largeTitleDisplayMode !== NavigationBar.largeTitleDisplayModeNever ? {
              type: "label",
              props: {
                  id: this.id + "-large-title",
                  text: this.title,
                  textColor: UIKit.textColor,
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
              props: {
                  id: this.id + "-large-title"
              }
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
                      if (align === UIKit.align.left) make.left.equalTo(view.super.safeArea);
                      else make.right.equalTo(view.super.safeArea);
                      make.width.equalTo(buttons.length * BarButtonItem.size.width);
                  }
              } : {};
          };
          const rightButtonView = getButtonView(this.navigationBarItems.rightButtons, UIKit.align.right);
          const leftButtonView = this.navigationBarItems.popButtonView ?? getButtonView(this.navigationBarItems.leftButtons, UIKit.align.left);
          const isHideBackground = this.prefersLargeTitles;
          const isHideTitle = !this.prefersLargeTitles || this.largeTitleDisplayMode === NavigationBar.largeTitleDisplayModeNever;
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
                  } : UIKit.blurBox({
                      hidden: isHideBackground,
                      id: this.id + "-background"
                  }),
                  UIKit.separatorLine({
                      id: this.id + "-underline",
                      alpha: isHideBackground ? 0 : 1
                  }),
                  {
                      type: "view",
                      props: {
                          alpha: 0,
                          bgcolor: $color("clear"),
                          id: this.id + "-large-title-mask"
                      },
                      events: {
                          ready: (sender)=>{
                              sender.bgcolor = $(this.id + "-large-title")?.prev.bgcolor;
                          }
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
                          textColor: UIKit.textColor
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
  class NavigationBarController extends Controller {
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
          this.selector.backgroundView.hidden = false;
          $ui.animate({
              duration: 0.2,
              animation: ()=>{
                  this.selector.underlineView.alpha = 1;
                  // 隐藏大标题，显示小标题
                  this.selector.smallTitleView.alpha = 1;
                  this.selector.largeTitleView.alpha = 0;
              }
          });
          if (permanent && this.navigationBar.navigationBarItems) this.navigationBar.largeTitleDisplayMode = NavigationBar.largeTitleDisplayModeNever;
      }
      toLargeTitle(permanent = true) {
          this.updateSelector();
          this.selector.backgroundView.hidden = true;
          $ui.animate({
              duration: 0.2,
              animation: ()=>{
                  this.selector.underlineView.alpha = 0;
                  this.selector.smallTitleView.alpha = 0;
                  this.selector.largeTitleView.alpha = 1;
              }
          });
          if (permanent && this.navigationBar.navigationBarItems) this.navigationBar.largeTitleDisplayMode = NavigationBar.largeTitleDisplayModeAlways;
      }
       #changeLargeTitleView(largeTitleViewMode) {
          const isSmallMode = largeTitleViewMode === NavigationBarController.largeTitleViewSmallMode;
          this.selector.largeTitleView.alpha = isSmallMode ? 0 : 1;
          $ui.animate({
              duration: 0.2,
              animation: ()=>{
                  this.selector.smallTitleView.alpha = isSmallMode ? 1 : 0;
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
              if (contentOffset >= this.navigationBar.navigationBarNormalHeight) this.#changeLargeTitleView(NavigationBarController.largeTitleViewSmallMode);
              else this.#changeLargeTitleView(NavigationBarController.largeTitleViewLargeMode);
          } else {
              // 切换模式
              this.#changeLargeTitleView(NavigationBarController.largeTitleViewLargeMode);
              // 下拉放大字体
              let size = this.navigationBar.largeTitleFontSize - contentOffset * 0.04;
              if (size > titleSizeMax) size = titleSizeMax;
              this.selector.largeTitleView.font = $font(this.navigationBar.largeTitleFontFamily, size);
          }
      }
       #navigationBarScrollAction(contentOffset1) {
          const trigger = this.navigationBar.largeTitleDisplayMode === NavigationBar.largeTitleDisplayModeNever ? 5 : this.navigationBar.navigationBarNormalHeight;
          const hasTitleView = this.selector.titleViewBackgroundView !== undefined;
          if (contentOffset1 > trigger) {
              this.selector.backgroundView.hidden = false;
              const uiAction = ()=>{
                  if (hasTitleView && this.navigationBar.navigationBarItems.isPinTitleView) this.selector.titleViewBackgroundView.alpha = 1;
                  this.selector.largeTitleMaskView.alpha = 0;
                  this.selector.underlineView.alpha = 1;
              };
              if ((contentOffset1 - trigger) / 3 >= 1) uiAction();
              else $ui.animate({
                  duration: 0.2,
                  animation: ()=>{
                      uiAction();
                  }
              });
          } else {
              this.selector.largeTitleMaskView.alpha = contentOffset1 > 0 ? 1 : 0;
              this.selector.underlineView.alpha = 0;
              if (hasTitleView) this.selector.titleViewBackgroundView.alpha = 0;
              this.selector.backgroundView.hidden = true;
          }
      }
      didScroll(contentOffset) {
          if (!this.navigationBar.prefersLargeTitles) return;
          const largeTitleDisplayMode = this.navigationBar.largeTitleDisplayMode;
          if (largeTitleDisplayMode === NavigationBar.largeTitleDisplayModeAlways) return;
          this.updateSelector();
          if (largeTitleDisplayMode === NavigationBar.largeTitleDisplayModeAutomatic) {
              if (!this.navigationBar.navigationBarItems?.isPinTitleView) {
                  // titleView didScroll
                  this.navigationBar.navigationBarItems?.titleView?.controller.didScroll(contentOffset);
                  // 在 titleView 折叠前锁住主要视图
                  if (contentOffset > 0) {
                      const height = this.navigationBar.navigationBarItems?.titleView?.height ?? 0;
                      contentOffset -= height;
                      if (contentOffset < 0) contentOffset = 0;
                  }
              }
              this.#largeTitleScrollAction(contentOffset);
              this.#navigationBarScrollAction(contentOffset);
          } else if (largeTitleDisplayMode === NavigationBar.largeTitleDisplayModeNever) this.#navigationBarScrollAction(contentOffset);
      }
      didEndDragging(contentOffset, decelerate, scrollToOffset, zeroOffset) {
          if (!this.navigationBar.prefersLargeTitles) return;
          const largeTitleDisplayMode = this.navigationBar.largeTitleDisplayMode;
          if (largeTitleDisplayMode === NavigationBar.largeTitleDisplayModeAlways) return;
          this.updateSelector();
          if (largeTitleDisplayMode === NavigationBar.largeTitleDisplayModeAutomatic) {
              let titleViewHeight = 0;
              if (!this.navigationBar.navigationBarItems?.isPinTitleView) {
                  // titleView didEndDragging
                  this.navigationBar.navigationBarItems?.titleView?.controller.didEndDragging(contentOffset, decelerate, scrollToOffset, zeroOffset);
                  titleViewHeight = this.navigationBar.navigationBarItems?.titleView?.height ?? 0;
                  contentOffset -= titleViewHeight;
              }
              if (contentOffset >= 0 && contentOffset <= this.navigationBar.largeTitleFontHeight) scrollToOffset($point(0, contentOffset >= this.navigationBar.largeTitleFontHeight / 2 ? this.navigationBar.navigationBarNormalHeight + titleViewHeight - zeroOffset : titleViewHeight - zeroOffset));
          }
      }
  }
  module.exports = {
      NavigationBar,
      NavigationBarController
  };
  
  },{"../view":"eLzep","../controller":"gQNQr","../ui-kit":"c4IeO","./navigation-bar-items":"4XBoJ"}],"4XBoJ":[function(require,module,exports) {
  const { View  } = require("../view");
  const { UIKit  } = require("../ui-kit");
  class BarTitleView extends View {
      controller = {};
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
   */ class BarButtonItem extends View {
      static edges = 15;
      static size = $size(38, 38);
      static fontSize = 16;
      static iconSize = $size(BarButtonItem.size.width - BarButtonItem.edges, BarButtonItem.size.height - BarButtonItem.edges) // 比 size 小 edges
      ;
      /**
       * 标题
       * @type {string}
       */ title;
      /**
       * SF Symbol 或者 $image 对象
       * @type {string|$image}
       */ symbol;
      /**
       * 对齐方式
       */ align = UIKit.align.right;
      setTitle(title) {
          this.title = title;
          return this;
      }
      /**
       * 设置图标
       * @param {string|$image} symbol SF Symbol 或者 $image 对象
       * @returns
       */ setSymbol(symbol) {
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
                      }));
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
                  start: ()=>this.#actionStart(),
                  done: ()=>this.#actionDone(),
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
                          font: $font(BarButtonItem.fontSize),
                          tintColor: UIKit.textColor,
                          titleColor: UIKit.textColor,
                          contentEdgeInsets: $insets(0, 0, 0, 0),
                          titleEdgeInsets: $insets(0, 0, 0, 0),
                          imageEdgeInsets: $insets(0, 0, 0, 0)
                      }, this.menu ? {
                          menu: this.menu
                      } : {}, this.title ? {
                          title: this.title
                      } : {}, this.props),
                      views: [
                          {
                              type: "image",
                              props: Object.assign({
                                  id: `icon-button-${this.id}`,
                                  hidden: this.symbol === undefined,
                                  tintColor: UIKit.textColor
                              }, this.symbol === undefined ? {} : typeof this.symbol === "string" ? {
                                  symbol: this.symbol
                              } : {
                                  data: this.symbol.png
                              }),
                              layout: (make, view)=>{
                                  make.center.equalTo(view.super);
                                  make.size.equalTo(BarButtonItem.iconSize);
                              }
                          },
                          {
                              type: "image",
                              props: {
                                  id: `icon-checkmark-${this.id}`,
                                  alpha: 0,
                                  tintColor: UIKit.textColor,
                                  symbol: "checkmark"
                              },
                              layout: (make, view)=>{
                                  make.center.equalTo(view.super);
                                  make.size.equalTo(BarButtonItem.iconSize);
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
                  if (this.title) {
                      const fontSize = $text.sizeThatFits({
                          text: this.title,
                          width: UIKit.windowSize.width,
                          font: $font(BarButtonItem.fontSize)
                      });
                      const width = Math.ceil(fontSize.width) + BarButtonItem.edges // 文本按钮增加内边距
                      ;
                      make.size.equalTo($size(width, BarButtonItem.size.height));
                  } else make.size.equalTo(BarButtonItem.size);
                  make.centerY.equalTo(view.super);
                  if (view.prev && view.prev.id !== "label" && view.prev.id !== undefined) {
                      if (this.align === UIKit.align.right) make.right.equalTo(view.prev.left);
                      else make.left.equalTo(view.prev.right);
                  } else {
                      // 留一半边距，按钮内边距是另一半
                      const edges = BarButtonItem.edges / 2;
                      if (this.align === UIKit.align.right) make.right.inset(edges);
                      else make.left.inset(edges);
                  }
              }
          };
      }
      /**
       * 用于快速创建 BarButtonItem
       * @param {BarButtonItemProperties} param0
       * @returns {BarButtonItem}
       */ static creat({ symbol , title , tapped , menu , events , align =UIKit.align.right  } = {}) {
          const barButtonItem = new BarButtonItem();
          barButtonItem.setEvents(Object.assign({
              tapped: tapped
          }, events)).setAlign(align).setSymbol(symbol).setTitle(title).setMenu(menu);
          return barButtonItem;
      }
  }
  /**
   * @typedef {NavigationBarItems} NavigationBarItems
   */ class NavigationBarItems {
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
          buttons.forEach((button)=>this.addRightButton(button));
          if (!this.hasbutton) this.hasbutton = true;
          return this;
      }
      /**
       *
       * @param {BarButtonItemProperties[]} buttons
       * @returns {this}
       */ setLeftButtons(buttons) {
          buttons.forEach((button)=>this.addLeftButton(button));
          if (!this.hasbutton) this.hasbutton = true;
          return this;
      }
      /**
       *
       * @param {BarButtonItemProperties} param0
       * @returns {this}
       */ addRightButton({ symbol , title , tapped , menu , events  } = {}) {
          this.rightButtons.push(BarButtonItem.creat({
              symbol,
              title,
              tapped,
              menu,
              events,
              align: UIKit.align.right
          }).definition);
          if (!this.hasbutton) this.hasbutton = true;
          return this;
      }
      /**
       *
       * @param {BarButtonItemProperties} param0
       * @returns {this}
       */ addLeftButton({ symbol , title , tapped , menu , events  } = {}) {
          this.leftButtons.push(BarButtonItem.creat({
              symbol,
              title,
              tapped,
              menu,
              events,
              align: UIKit.align.left
          }).definition);
          if (!this.hasbutton) this.hasbutton = true;
          return this;
      }
      /**
       * 覆盖左侧按钮
       * @param {string} parent 父页面标题，将会显示为文本按钮
       * @param {Object} view 自定义按钮视图
       * @returns {this}
       */ addPopButton(parent, view) {
          if (!parent) parent = $l10n("BACK");
          this.popButtonView = view ?? {
              // 返回按钮
              type: "button",
              props: {
                  bgcolor: $color("clear"),
                  symbol: "chevron.left",
                  tintColor: UIKit.linkColor,
                  title: ` ${parent}`,
                  titleColor: UIKit.linkColor,
                  font: $font("bold", 16)
              },
              layout: (make, view)=>{
                  make.left.equalTo(view.super.safeArea).offset(BarButtonItem.edges);
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
      BarTitleView,
      BarButtonItem,
      NavigationBarItems
  };
  
  },{"../view":"eLzep","../ui-kit":"c4IeO"}],"6dSiu":[function(require,module,exports) {
  const { VERSION  } = require("./version");
  String.prototype.trim = function(char, type) {
      if (char) {
          if (type === "l") return this.replace(new RegExp("^\\" + char + "+", "g"), "");
          else if (type === "r") return this.replace(new RegExp("\\" + char + "+$", "g"), "");
          return this.replace(new RegExp("^\\" + char + "+|\\" + char + "+$", "g"), "");
      }
      return this.replace(/^\s+|\s+$/g, "");
  };
  class Kernel {
      startTime = Date.now();
      // 隐藏 jsbox 默认 nav 栏
      isUseJsboxNav = false;
      constructor(){
          if ($app.isDebugging) this.debug();
      }
      /**
       * @type {boolean}
       */ static isTaio = $app.info.bundleID.includes("taio");
      static l10n(language, content, override = true) {
          if (typeof content === "string") {
              const strings = {};
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
          const strings1 = $app.strings;
          if (override) strings1[language] = Object.assign($app.strings[language], content);
          else strings1[language] = Object.assign(content, $app.strings[language]);
          $app.strings = strings1;
      }
      /**
       * 压缩图片
       * @param {$image} image $image
       * @param {number} maxSize 图片最大尺寸 单位：像素
       * @returns {$image}
       */ static compressImage(image, maxSize = 921600) {
          const info = $imagekit.info(image);
          if (info.height * info.width > maxSize) {
              const scale = maxSize / (info.height * info.width);
              image = $imagekit.scaleBy(image, scale);
          }
          return image;
      }
      static objectEqual(a, b) {
          let aProps = Object.getOwnPropertyNames(a);
          let bProps = Object.getOwnPropertyNames(b);
          if (aProps.length !== bProps.length) return false;
          for(let i = 0; i < aProps.length; i++){
              let propName = aProps[i];
              let propA = a[propName];
              let propB = b[propName];
              if (Array.isArray(propA)) for(let i1 = 0; i1 < propA.length; i1++){
                  if (!Kernel.objectEqual(propA[i1], propB[i1])) return false;
              }
              else if (typeof propA === "object") return Kernel.objectEqual(propA, propB);
              else if (propA !== propB) return false;
          }
          return true;
      }
      /**
       * 对比版本号
       * @param {string} preVersion
       * @param {string} lastVersion
       * @returns {number} 1: preVersion 大, 0: 相等, -1: lastVersion 大
       */ static versionCompare(preVersion = "", lastVersion = "") {
          let sources = preVersion.split(".");
          let dests = lastVersion.split(".");
          let maxL = Math.max(sources.length, dests.length);
          let result = 0;
          for(let i = 0; i < maxL; ++i){
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
      static deleteConfirm(message, conformAction) {
          $ui.alert({
              title: message,
              actions: [
                  {
                      title: $l10n("DELETE"),
                      style: $alertActionType.destructive,
                      handler: ()=>{
                          conformAction();
                      }
                  },
                  {
                      title: $l10n("CANCEL")
                  }
              ]
          });
      }
      static bytesToSize(bytes) {
          if (bytes === 0) return "0 B";
          const k = 1024, sizes = [
              "B",
              "KB",
              "MB",
              "GB",
              "TB",
              "PB",
              "EB",
              "ZB",
              "YB"
          ], i = Math.floor(Math.log(bytes) / Math.log(k));
          return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
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
              if (!view.events) view.events = {};
              const oldLayoutSubviews = view.events.layoutSubviews;
              const { UIKit  } = require("./ui-kit");
              view.events.layoutSubviews = ()=>{
                  $app.notify({
                      name: "interfaceOrientationEvent",
                      object: {
                          statusBarOrientation: UIKit.statusBarOrientation,
                          isHorizontal: UIKit.isHorizontal
                      }
                  });
                  if (typeof oldLayoutSubviews === "function") oldLayoutSubviews();
              };
              $ui.render(view);
          } catch (error) {
              this.print(error);
          }
      }
      async checkUpdate() {
          const branche = "dev" // 更新版本，可选 master, dev
          ;
          const configRes = await $http.get(`https://raw.githubusercontent.com/ipuppet/EasyJsBox/${branche}/src/version.js`);
          if (configRes.error) throw configRes.error;
          const latestVersion = srcRes.data.match(/.*VERSION.?\"([0-9\.]+)\"/)[1];
          this.print(`easy-jsbox latest version: ${latestVersion}`);
          if (Kernel.versionCompare(latestVersion, VERSION) > 0) {
              const srcRes1 = await $http.get(`https://raw.githubusercontent.com/ipuppet/EasyJsBox/${branche}/dist/easy-jsbox.js`);
              if (srcRes1.error) throw srcRes1.error;
              return srcRes1.data;
          }
          return false;
      }
  }
  module.exports = {
      Kernel
  };
  
  },{"./version":"1tka5","./ui-kit":"c4IeO"}],"2m0Zd":[function(require,module,exports) {
  class FileStorageParameterError extends Error {
      constructor(parameter){
          super(`Parameter [${parameter}] is required.`);
          this.name = "FileStorageParameterError";
      }
  }
  class FileStorageFileNotFoundError extends Error {
      constructor(filePath){
          super(`File not found: ${filePath}`);
          this.name = "FileStorageFileNotFoundError";
      }
  }
  class FileStorage {
      basePath;
      constructor({ basePath ="storage"  } = {}){
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
      write(path = "", fileName, data) {
          if (!fileName) throw new FileStorageParameterError("fileName");
          if (!data) throw new FileStorageParameterError("data");
          return $file.write({
              data: data,
              path: this.#filePath(path, fileName)
          });
      }
      writeSync(path = "", fileName, data) {
          return new Promise((resolve, reject)=>{
              try {
                  const success = this.write(path, fileName, data);
                  if (success) resolve(success);
                  else reject(success);
              } catch (error) {
                  reject(error);
              }
          });
      }
      exists(path = "", fileName) {
          if (!fileName) throw new FileStorageParameterError("fileName");
          path = this.#filePath(path, fileName);
          if ($file.exists(path)) return path;
          return false;
      }
      read(path = "", fileName) {
          if (!fileName) throw new FileStorageParameterError("fileName");
          path = this.#filePath(path, fileName);
          if (!$file.exists(path)) throw new FileStorageFileNotFoundError(path);
          if ($file.isDirectory(path)) return $file.list(path);
          return $file.read(path);
      }
      readSync(path = "", fileName) {
          return new Promise((resolve, reject)=>{
              try {
                  const file = this.read(path, fileName);
                  if (file) resolve(file);
                  else reject();
              } catch (error) {
                  reject(error);
              }
          });
      }
      readAsJSON(path = "", fileName, _default = null) {
          try {
              const fileString = this.read(path, fileName)?.string;
              return JSON.parse(fileString);
          } catch (error) {
              return _default;
          }
      }
      static readFromRoot(path) {
          if (!path) throw new FileStorageParameterError("path");
          if (!$file.exists(path)) throw new FileStorageFileNotFoundError(path);
          if ($file.isDirectory(path)) return $file.list(path);
          return $file.read(path);
      }
      static readFromRootSync(path = "") {
          return new Promise((resolve, reject)=>{
              try {
                  const file = FileStorage.readFromRoot(path);
                  if (file) resolve(file);
                  else reject();
              } catch (error) {
                  reject(error);
              }
          });
      }
      static readFromRootAsJSON(path = "", _default = null) {
          try {
              const fileString = FileStorage.readFromRoot(path)?.string;
              return JSON.parse(fileString);
          } catch (error) {
              return _default;
          }
      }
      delete(path = "", fileName = "") {
          return $file.delete(this.#filePath(path, fileName));
      }
  }
  module.exports = {
      FileStorageParameterError,
      FileStorageFileNotFoundError,
      FileStorage
  };
  
  },{}],"jB4yI":[function(require,module,exports) {
  const { View  } = require("./view");
  const { UIKit  } = require("./ui-kit");
  class FixedFooterView extends View {
      height = 60;
      getView() {
          this.type = "view";
          this.setProp("bgcolor", UIKit.primaryViewBackgroundColor);
          this.layout = (make, view)=>{
              make.left.right.bottom.equalTo(view.super);
              make.top.equalTo(view.super.safeAreaBottom).offset(-this.height);
          };
          this.views = [
              View.create({
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
  module.exports = {
      FixedFooterView
  };
  
  },{"./view":"eLzep","./ui-kit":"c4IeO"}],"5qO2y":[function(require,module,exports) {
  const { View  } = require("./view");
  class Matrix extends View {
      titleStyle = {
          font: $font("bold", 21),
          height: 30
      };
      #hiddenViews;
      #templateHiddenStatus;
      templateIdByIndex(i) {
          if (this.props.template.views[i]?.props?.id === undefined) {
              if (this.props.template.views[i].props === undefined) this.props.template.views[i].props = {};
              this.props.template.views[i].props.id = $text.uuid;
          }
          return this.props.template.views[i].props.id;
      }
      get templateHiddenStatus() {
          if (!this.#templateHiddenStatus) {
              this.#templateHiddenStatus = {};
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
              this.#hiddenViews = {};
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
                      if (!item[key]) item[key] = {};
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
          let templateProps = {};
          if (this.props.template.props !== undefined) templateProps = Object.assign(this.props.template.props, {
              id: "__templateProps",
              hidden: false
          });
          this.props.template.props = {};
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
  module.exports = {
      Matrix
  };
  
  },{"./view":"eLzep"}],"amu5e":[function(require,module,exports) {
  /**
   * @typedef {import("./kernel").Kernel} Kernel
   */ class Request {
      static Method = {
          get: "GET",
          post: "POST"
      };
      #baseUrlMd5;
      #useCache = false;
      #ignoreCacheExp = false;
      cacheLife = 2592000000 // ms
      ;
      isLogRequest = true;
      timeout = 5;
      /**
       * @type {Kernel}
       */ kernel;
      /**
       *
       * @param {Kernel} kernel
       */ constructor(kernel){
          this.kernel = kernel;
      }
      getCacheKey(path) {
          if (!this.#baseUrlMd5) this.#baseUrlMd5 = $text.MD5(this.baseUrl);
          return this.#baseUrlMd5 + $text.MD5(path);
      }
      setCache(cacheKey, data) {
          $cache.set(cacheKey, data);
      }
      getCache(cacheKey, _default = null) {
          return $cache.get(cacheKey) ?? _default;
      }
      removeCache(cacheKey) {
          $cache.remove(cacheKey);
      }
      useCache() {
          this.#useCache = true;
          return this;
      }
      ignoreCacheExp() {
          this.#ignoreCacheExp = true;
      }
      /**
       *
       * @param {string} path
       * @param {string} method
       * @param {object} body
       * @param {number} cacheLife ms
       * @returns
       */ async request(path, method, body = {}, header = {}, cacheLife = this.cacheLife) {
          const url = this.baseUrl + path;
          let cacheKey;
          const useCache = this.#useCache && method === Request.Method.get;
          if (useCache) {
              cacheKey = this.getCacheKey(path);
              const cache = this.getCache(cacheKey);
              if (cache && (this.#ignoreCacheExp || cache.exp > Date.now())) {
                  if (this.isLogRequest) this.kernel.print("get data from cache: " + url);
                  return cache.data;
              }
          }
          try {
              if (this.isLogRequest) this.kernel.print(`sending request [${method}]: ${url}`);
              const resp = await $http.request({
                  header: Object.assign({
                      "Content-Type": "application/json"
                  }, header),
                  url,
                  method,
                  body,
                  timeout: this.timeout
              });
              if (resp?.response?.statusCode >= 400) {
                  let errMsg = resp.data;
                  if (typeof errMsg === "object") errMsg = JSON.stringify(errMsg);
                  throw new Error("http error: [" + resp.response.statusCode + "] " + errMsg);
              }
              if (useCache) this.setCache(cacheKey, {
                  exp: Date.now() + cacheLife,
                  data: resp.data
              });
              return resp.data;
          } catch (error) {
              if (error.code) error = new Error("network error: [" + error.code + "] " + error.localizedDescription);
              throw error;
          }
      }
  }
  module.exports = {
      Request
  };
  
  },{}],"lCpBo":[function(require,module,exports) {
  const { Controller  } = require("./controller");
  const { FileStorageFileNotFoundError , FileStorage  } = require("./file-storage");
  const { Kernel  } = require("./kernel");
  const { UIKit  } = require("./ui-kit");
  const { Sheet  } = require("./sheet");
  const { NavigationView  } = require("./navigation-view/navigation-view");
  const { NavigationBar  } = require("./navigation-view/navigation-bar");
  const { ViewController  } = require("./navigation-view/view-controller");
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
   * 脚本类型的动画
   * @typedef {Object} ScriptAnimate
   * @property {Function} animate.actionStart
   * @property {Function} animate.actionCancel
   * @property {Function} animate.actionDone
   * @property {Function} animate.touchHighlightStart
   * @property {Function} animate.touchHighlightEnd
   *
   * 用于存放 script 类型用到的方法
   * @callback SettingMethodFunction
   * @param {ScriptAnimate} animate
   *
   * @typedef {Object} SettingMethod
   * @property {SettingMethodFunction} *
   */ /**
   * @property {function(key: string, value: any)} Setting.events.onSet 键值发生改变
   * @property {function(view: Object,title: string)} Setting.events.onChildPush 进入的子页面
   */ class Setting extends Controller {
      name;
      // 存储数据
      setting = {};
      // 初始用户数据，若未定义则尝试从给定的文件读取
      userData;
      // fileStorage
      fileStorage;
      imagePath;
      // 用来控制 child 类型
      viewController = new ViewController();
      /**
       * @type {SettingMethod}
       */ method = {
          readme: ()=>{
              const content = (()=>{
                  const file = $device.info?.language?.startsWith("zh") ? "README_CN.md" : "README.md";
                  try {
                      return __README__[file] ?? __README__["README.md"];
                  } catch  {
                      return $file.read(file)?.string ?? $file.read("README.md")?.string;
                  }
              })();
              const sheet = new Sheet();
              sheet.setView({
                  type: "markdown",
                  props: {
                      content: content
                  },
                  layout: (make, view)=>{
                      make.size.equalTo(view.super);
                  }
              }).init().present();
          }
      };
      // style
      rowHeight = 50;
      edgeOffset = 10;
      iconSize = 30;
      // withTouchEvents 延时自动关闭高亮，防止 touchesMoved 事件未正常调用
      #withTouchEventsT = {};
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
       */ constructor(args = {}){
          super();
          // set 和 get 同时设置才会生效
          if (typeof args.set === "function" && typeof args.get === "function") {
              this.set = args.set;
              this.get = args.get;
              this.userData = args.userData;
          } else {
              this.fileStorage = args.fileStorage ?? new FileStorage();
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
          const userData = this.userData ?? this.fileStorage.readAsJSON("", this.dataFile, {});
          function setValue(structure) {
              const setting = {};
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
          Kernel.l10n("zh-Hans", `
              "OK" = "好";
              "DONE" = "完成";
              "CANCEL" = "取消";
              "CLEAR" = "清除";
              "BACK" = "返回";
              "ERROR" = "发生错误";
              "SUCCESS" = "成功";
              "LOADING" = "加载中";
              "INVALID_VALUE" = "非法参数";
              "CONFIRM_CHANGES" = "数据已变化，确认修改？";
              
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
          Kernel.l10n("en", `
              "OK" = "OK";
              "DONE" = "Done";
              "CANCEL" = "Cancel";
              "CLEAR" = "Clear";
              "BACK" = "Back";
              "ERROR" = "Error";
              "SUCCESS" = "Success";
              "LOADING" = "Loading";
              "INVALID_VALUE" = "Invalid value";
              "CONFIRM_CHANGES" = "The data has changed, confirm the modification?";
  
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
          if (!this.structure) this.setStructure(FileStorage.readFromRootAsJSON(structurePath));
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
              let info = FileStorage.readFromRootAsJSON("config.json", {})["info"] ?? {};
              if (!info.version || !info.author) try {
                  info = __INFO__;
              } catch  {}
              this.#footer = {};
              if (info.version && info.author) this.#footer = {
                  type: "view",
                  props: {
                      height: 70
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
       #touchHighlightEnd(id, duration = 0.3) {
          if (duration === 0) $(id).bgcolor = $color("clear");
          else $ui.animate({
              duration: duration,
              animation: ()=>{
                  $(id).bgcolor = $color("clear");
              }
          });
      }
       #withTouchEvents(id, events, withTappedHighlight = false, highlightEndDelay = 0) {
          events = Object.assign(events, {
              touchesBegan: ()=>{
                  this.#touchHighlightStart(id);
                  // 延时自动关闭高亮，防止 touchesMoved 事件未正常调用
                  this.#withTouchEventsT[id] = $delay(1, ()=>this.#touchHighlightEnd(id, 0));
              },
              touchesMoved: ()=>{
                  this.#withTouchEventsT[id]?.cancel();
                  this.#touchHighlightEnd(id, 0);
              }
          });
          if (withTappedHighlight) {
              const tapped = events.tapped;
              events.tapped = ()=>{
                  // highlight
                  this.#touchHighlightStart(id);
                  setTimeout(()=>this.#touchHighlightEnd(id), highlightEndDelay * 1000);
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
                          make.width.greaterThanOrEqualTo(10);
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
          const id = this.getId(key);
          return {
              type: "view",
              props: {
                  id,
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
          const id = this.getId(key);
          return {
              type: "view",
              props: {
                  id,
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
      createStepper(key, icon, title, min, max) {
          const id = this.getId(key);
          const labelId = `${id}-label`;
          return {
              type: "view",
              props: {
                  id,
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
          const id = this.getId(key);
          const buttonId = `${id}-button`;
          const actionStart = ()=>{
              // 隐藏 button，显示 spinner
              $(buttonId).alpha = 0;
              $(`${buttonId}-spinner`).alpha = 1;
              this.#touchHighlightStart(id);
          };
          const actionCancel = ()=>{
              $(buttonId).alpha = 1;
              $(`${buttonId}-spinner`).alpha = 0;
              this.#touchHighlightEnd(id);
          };
          const actionDone = (status = true, message = $l10n("ERROR"))=>{
              $(`${buttonId}-spinner`).alpha = 0;
              this.#touchHighlightEnd(id);
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
                  id
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
              events: this.#withTouchEvents(id, {
                  tapped: ()=>{
                      /**
                       * @type {ScriptAnimate}
                       */ const animate = {
                          actionStart: actionStart,
                          actionCancel: actionCancel,
                          actionDone: actionDone,
                          touchHighlightStart: ()=>this.#touchHighlightStart(id),
                          touchHighlightEnd: ()=>this.#touchHighlightEnd(id) // 被点击的一行颜色恢复
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
          const id = this.getId(key);
          const isCustomizeValues = items?.length > 0 && values?.length === items?.length;
          return {
              type: "view",
              props: {
                  id,
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
      createMenu(key, icon, title, items, values) {
          const id = this.getId(key);
          const labelId = `${id}-label`;
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
          const tmpItems = getItems();
          const tmpValues = getValues();
          const isCustomizeValues = tmpItems?.length > 0 && tmpValues?.length === tmpItems?.length;
          return {
              type: "view",
              props: {
                  id,
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
                                  text: isCustomizeValues ? tmpItems[tmpValues.indexOf(this.get(key))] : tmpItems[this.get(key)],
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
          const id = this.getId(key);
          const colorId = `${id}-color`;
          return {
              type: "view",
              props: {
                  id,
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
          const id = this.getId(key);
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
                  id,
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
                                  id: `${id}-label`,
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
                              $(`${id}-label`).text = getFormatDate(date);
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
      createNumber(key, icon, title) {
          return this.createInput(key, icon, title, false, $kbType.decimal, (text)=>{
              const isNumber = (str)=>{
                  const reg = /^[0-9]+.?[0-9]*$/;
                  return reg.test(str);
              };
              if (text === "" || !isNumber(text)) {
                  $ui.toast($l10n("INVALID_VALUE"));
                  return false;
              }
              return this.set(key, Number(text));
          });
      }
      createInput(key, icon, title, secure = false, kbType = $kbType.default, saveFunc) {
          if (saveFunc === undefined) saveFunc = (data)=>{
              return this.set(key, data);
          };
          const id = this.getId(key);
          const inputId = id + "-input";
          return {
              type: "view",
              props: {
                  id,
                  selectable: true
              },
              views: [
                  this.createLineLabel(title, icon),
                  {
                      type: "input",
                      props: {
                          id: inputId,
                          type: kbType,
                          align: $align.right,
                          bgcolor: $color("clear"),
                          textColor: $color("secondaryText"),
                          text: this.get(key),
                          secure: secure,
                          accessoryView: UIKit.blurBox({
                              height: 44
                          }, [
                              UIKit.separatorLine({}, UIKit.align.top),
                              {
                                  type: "button",
                                  props: {
                                      title: $l10n("DONE"),
                                      bgcolor: $color("clear"),
                                      titleColor: $color("primaryText")
                                  },
                                  layout: (make, view)=>{
                                      make.right.inset(this.edgeOffset);
                                      make.centerY.equalTo(view.super);
                                  },
                                  events: {
                                      tapped: ()=>{
                                          $(inputId).blur();
                                      }
                                  }
                              },
                              {
                                  type: "button",
                                  props: {
                                      title: $l10n("CANCEL"),
                                      bgcolor: $color("clear"),
                                      titleColor: $color("primaryText")
                                  },
                                  layout: (make, view)=>{
                                      make.left.inset(this.edgeOffset);
                                      make.centerY.equalTo(view.super);
                                  },
                                  events: {
                                      tapped: ()=>{
                                          const sender = $(inputId);
                                          const savedData = this.get(key, "");
                                          if (sender.text !== savedData) sender.text = savedData;
                                          sender.blur();
                                      }
                                  }
                              }
                          ])
                      },
                      layout: (make, view)=>{
                          // 与标题间距 this.edgeOffset
                          make.left.equalTo(view.prev.get("label").right).offset(this.edgeOffset);
                          make.right.inset(this.edgeOffset);
                          make.width.greaterThanOrEqualTo(80);
                          make.height.equalTo(view.super);
                      },
                      events: {
                          didBeginEditing: (sender)=>{
                              // 使输入可见
                              sender.secure = false;
                              // 防止键盘遮挡
                              if (!$app.autoKeyboardEnabled) $app.autoKeyboardEnabled = true;
                          },
                          returned: (sender)=>{
                              sender.blur();
                          },
                          didEndEditing: async (sender)=>{
                              const savedData = this.get(key, "");
                              if (!saveFunc(sender.text)) sender.text = savedData;
                              // 恢复 secure
                              if (secure) sender.secure = secure;
                          }
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
       */ createIcon(key, icon, title, bgcolor = "#000000") {
          const id = this.getId(key);
          const imageId = `${id}-image`;
          return {
              type: "view",
              props: {
                  id,
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
          const id = this.getId(key);
          return {
              type: "view",
              layout: $layout.fill,
              props: {
                  id,
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
                          if (this.events?.onChildPush) this.callEvent("onChildPush", this.getListView(children, {}), title);
                          else if (this.isUseJsboxNav) UIKit.push({
                              title: title,
                              bgcolor: UIKit.scrollViewBackgroundColor,
                              views: [
                                  this.getListView(children, {})
                              ]
                          });
                          else {
                              const navigationView = new NavigationView();
                              navigationView.setView(this.getListView(children, {})).navigationBarTitle(title);
                              navigationView.navigationBarItems.addPopButton();
                              navigationView.navigationBar.setLargeTitleDisplayMode(NavigationBar.largeTitleDisplayModeNever);
                              if (this.hasSectionTitle(children)) navigationView.navigationBar.setContentViewHeightOffset(-10);
                              this.viewController.push(navigationView);
                          }
                      });
                  }
              }
          };
      }
      createImage(key, icon, title) {
          const id = this.getId(key);
          const imageId = `${id}-image`;
          return {
              type: "view",
              props: {
                  id,
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
                              this.#touchHighlightStart(id);
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
                                          const image = Kernel.compressImage(resp.data.image);
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
                                      this.#touchHighlightEnd(id);
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
              for (let item of section.items){
                  const value = this.get(item.key);
                  let row = null;
                  if (!item.icon) item.icon = [
                      "square.grid.2x2.fill",
                      "#00CC00"
                  ];
                  if (typeof item.items === "object") item.items = item.items.map((item)=>$l10n(item));
                  // 更新标题值
                  item.title = $l10n(item.title);
                  switch(item.type){
                      case "switch":
                          row = this.createSwitch(item.key, item.icon, item.title);
                          break;
                      case "stepper":
                          row = this.createStepper(item.key, item.icon, item.title, item.min ?? 1, item.max ?? 12);
                          break;
                      case "string":
                          row = this.createString(item.key, item.icon, item.title);
                          break;
                      case "info":
                          row = this.createInfo(item.icon, item.title, value);
                          break;
                      case "script":
                          row = this.createScript(item.key, item.icon, item.title, value);
                          break;
                      case "tab":
                          row = this.createTab(item.key, item.icon, item.title, item.items, item.values);
                          break;
                      case "menu":
                          row = this.createMenu(item.key, item.icon, item.title, item.items, item.values);
                          break;
                      case "color":
                          row = this.createColor(item.key, item.icon, item.title);
                          break;
                      case "date":
                          row = this.createDate(item.key, item.icon, item.title, item.mode);
                          break;
                      case "number":
                          row = this.createNumber(item.key, item.icon, item.title);
                          break;
                      case "input":
                          row = this.createInput(item.key, item.icon, item.title, item.secure);
                          break;
                      case "icon":
                          row = this.createIcon(item.key, item.icon, item.title, item.bgcolor);
                          break;
                      case "child":
                          row = this.createChild(item.key, item.icon, item.title, item.children);
                          break;
                      case "image":
                          row = this.createImage(item.key, item.icon, item.title);
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
      getListView(structure, footer = this.footer) {
          return {
              type: "list",
              props: {
                  id: this.name,
                  style: 2,
                  separatorInset: $insets(0, this.iconSize + this.edgeOffset * 2, 0, this.edgeOffset),
                  bgcolor: UIKit.scrollViewBackgroundColor,
                  footer: footer,
                  data: this.#getSections(structure ?? this.structure)
              },
              layout: $layout.fill,
              events: {
                  rowHeight: (sender, indexPath)=>{
                      const info = sender.object(indexPath)?.props?.info ?? {};
                      return info.rowHeight ?? this.rowHeight;
                  }
              }
          };
      }
      getPageView() {
          const navigationView = new NavigationView();
          navigationView.setView(this.getListView(this.structure)).navigationBarTitle($l10n("SETTING"));
          if (this.hasSectionTitle(this.structure)) navigationView.navigationBar.setContentViewHeightOffset(-10);
          return navigationView.getPage();
      }
  }
  module.exports = {
      Setting
  };
  
  },{"./controller":"gQNQr","./file-storage":"2m0Zd","./kernel":"6dSiu","./ui-kit":"c4IeO","./sheet":"cUlT6","./navigation-view/navigation-view":"fikOh","./navigation-view/navigation-bar":"gMo6S","./navigation-view/view-controller":"cF3st"}],"cF3st":[function(require,module,exports) {
  const { Controller  } = require("../controller");
  /**
   * @typedef {import("./navigation-view").NavigationView} NavigationView
   */ /**
   * @property {function(NavigationView)} ViewController.events.onChange
   */ class ViewController extends Controller {
      /**
       * @type {NavigationView[]}
       */ #navigationViews = [];
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
       */ push(navigationView) {
          const parent = this.#navigationViews[this.#navigationViews.length - 1];
          navigationView.navigationBarItems.addPopButton(parent?.navigationBar.title);
          this.#navigationViews.push(navigationView);
          $ui.push({
              props: {
                  statusBarStyle: 0,
                  navBarHidden: true
              },
              events: {
                  dealloc: ()=>{
                      this.#onPop(navigationView);
                  }
              },
              views: [
                  navigationView.getPage().definition
              ],
              layout: $layout.fill
          });
      }
  }
  module.exports = {
      ViewController
  };
  
  },{"../controller":"gQNQr"}],"90fDH":[function(require,module,exports) {
  const { View , PageView  } = require("./view");
  const { Controller  } = require("./controller");
  const { UIKit  } = require("./ui-kit");
  class TabBarCellView extends View {
      constructor(args = {}){
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
                      const half = TabBarController.tabBarHeight / 2;
                      make.size.equalTo(half);
                      make.top.inset((TabBarController.tabBarHeight - half - 13) / 2);
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
  class TabBarHeaderView extends View {
      height = 60;
      getView() {
          this.type = "view";
          this.setProp("bgcolor", this.props.bgcolor ?? UIKit.primaryViewBackgroundColor);
          this.layout = (make, view)=>{
              make.left.right.bottom.equalTo(view.super);
              make.top.equalTo(view.super.safeAreaBottom).offset(-this.height - TabBarController.tabBarHeight);
          };
          this.views = [
              View.create({
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
   */ class TabBarController extends Controller {
      static tabBarHeight = 50;
      #pages = {};
      #cells = {};
      #header;
      #selected;
      #blurBoxId = $text.uuid;
      #separatorLineId = $text.uuid;
      bottomSafeAreaInsets = $app.isDebugging ? 0 : UIKit.bottomSafeAreaInsets;
      get selected() {
          return this.#selected;
      }
      set selected(selected) {
          this.switchPageTo(selected);
      }
      get contentOffset() {
          return TabBarController.tabBarHeight + (this.#header?.height ?? 0);
      }
      /**
       *
       * @param {Object} pages
       * @returns {this}
       */ setPages(pages = {}) {
          Object.keys(pages).forEach((key)=>this.setPage(key, pages[key]));
          return this;
      }
      setPage(key, page) {
          if (this.#selected === undefined) this.#selected = key;
          if (page instanceof PageView) this.#pages[key] = page;
          else this.#pages[key] = PageView.createByViews(page);
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
              // 调整背景
              this.initBackground();
          }
      }
      hideBackground(animate = true) {
          $(this.#separatorLineId).hidden = true;
          $ui.animate({
              duration: animate ? 0.2 : 0.0001,
              animation: ()=>{
                  $(this.#blurBoxId).alpha = 0;
              }
          });
      }
      showBackground(animate = true) {
          $(this.#separatorLineId).hidden = false;
          $ui.animate({
              duration: animate ? 0.2 : 0.0001,
              animation: ()=>{
                  $(this.#blurBoxId).alpha = 1;
              }
          });
      }
      initBackground() {
          const selectedPage = this.#pages[this.selected];
          if (selectedPage.scrollable()) {
              const scrollableViewId = selectedPage.scrollableView.id;
              const contentHeight = $(selectedPage.id).get(scrollableViewId).contentSize.height;
              const contentSize = contentHeight + this.bottomSafeAreaInsets;
              if (contentSize <= UIKit.windowSize.height) this.hideBackground(false);
              else this.showBackground(false);
          }
      }
      /**
       *
       * @param {Object} cells
       * @returns {this}
       */ setCells(cells = {}) {
          Object.keys(cells).forEach((key)=>this.setCell(key, cells[key]));
          return this;
      }
      setCell(key, cell) {
          if (this.#selected === undefined) this.#selected = key;
          if (!(cell instanceof TabBarCellView)) cell = new TabBarCellView({
              props: {
                  info: {
                      key
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
              if (page.scrollable()) {
                  const scrollView = page.scrollableView;
                  if (scrollView.props === undefined) scrollView.props = {};
                  // indicatorInsets
                  if (scrollView.props.indicatorInsets) {
                      const old = scrollView.props.indicatorInsets;
                      scrollView.props.indicatorInsets = $insets(old.top, old.left, old.bottom + this.contentOffset, old.right);
                  } else scrollView.props.indicatorInsets = $insets(0, 0, 0, this.contentOffset);
                  // footer
                  scrollView.footer = Object.assign({
                      props: {}
                  }, scrollView.footer ?? {});
                  if (scrollView.props.footer.props.height) scrollView.props.footer.props.height += this.contentOffset;
                  else scrollView.props.footer.props.height = this.contentOffset;
                  // Scroll
                  if (typeof scrollView.assignEvent === "function") scrollView.assignEvent("didScroll", (sender)=>{
                      const contentOffset = sender.contentOffset.y - UIKit.consoleBarHeight;
                      const contentSize = sender.contentSize.height + this.bottomSafeAreaInsets;
                      const nextSize = contentSize - UIKit.windowSize.height;
                      if (nextSize - contentOffset <= 0) this.hideBackground();
                      else this.showBackground();
                  });
              }
              return page.definition;
          });
      }
      generateView() {
          const tabBarView = {
              type: "view",
              layout: (make, view)=>{
                  make.centerX.equalTo(view.super);
                  make.width.equalTo(view.super);
                  make.top.equalTo(view.super.safeAreaBottom).offset(-TabBarController.tabBarHeight);
                  make.bottom.equalTo(view.super);
              },
              views: [
                  UIKit.blurBox({
                      id: this.#blurBoxId
                  }),
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
                  },
                  UIKit.separatorLine({
                      id: this.#separatorLineId
                  }, UIKit.align.top)
              ],
              events: {
                  ready: ()=>this.initBackground()
              }
          };
          return View.createByViews(this.#pageViews().concat(this.#header?.definition ?? [], tabBarView));
      }
  }
  module.exports = {
      TabBarCellView,
      TabBarHeaderView,
      TabBarController
  };
  
  },{"./view":"eLzep","./controller":"gQNQr","./ui-kit":"c4IeO"}],"bnAky":[function(require,module,exports) {
  class Tasks {
      #tasks = {};
      /**
       *
       * @param {Function} task
       * @param {number} delay 单位 s
       * @returns
       */ addTask(task, delay = 0) {
          const uuid = $text.uuid;
          this.#tasks[uuid] = $delay(delay, async ()=>{
              await task();
              delete this.#tasks[uuid];
          });
          return uuid;
      }
      cancelTask(id) {
          this.#tasks[id].cancel();
      }
      clearTasks() {
          Object.values(this.#tasks).forEach((task)=>task.cancel());
      }
  }
  module.exports = {
      Tasks
  };
  
  },{}],"jBNeq":[function(require,module,exports) {
  class UILoading {
      #labelId;
      text = "";
      interval;
      fullScreen = false;
      #loop = ()=>{};
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
  module.exports = {
      UILoading
  };
  
  },{}],"gLIXD":[function(require,module,exports) {
  const { Controller  } = require("../controller");
  const { BarTitleView  } = require("./navigation-bar-items");
  class SearchBar extends BarTitleView {
      height = 35;
      topOffset = 15;
      bottomOffset = 10;
      kbType = $kbType.search;
      placeholder = $l10n("SEARCH");
      constructor(args){
          super(args);
          this.setController(new SearchBarController());
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
  class SearchBarController extends Controller {
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
  module.exports = {
      SearchBar,
      SearchBarController
  };
  
  },{"../controller":"gQNQr","./navigation-bar-items":"4XBoJ"}]},["2A4D3"], "2A4D3", "parcelRequire94c2")
  
  