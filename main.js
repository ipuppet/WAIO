const { VERSION } = require("../EasyJsBox/src/kernel")
// Check Framework
const SHARED_PATH = "shared://EasyJsBox"
if ($file.exists(SHARED_PATH)) {
    const SHARED_VERSION = eval($file.read(`${SHARED_PATH}/src/kernel.js`)?.string)?.VERSION
    if (SHARED_VERSION !== VERSION || VERSION === undefined) {
        $file.delete("/EasyJsBox")
        $file.copy({
            src: SHARED_PATH,
            dst: "/EasyJsBox"
        })
    }
    const app = require("./scripts/app")
    app.run()
} else {
    $ui.alert({
        title: "Error",
        message: "Cannot find EasyJsBox.",
        actions: [
            { title: "Cancel" },
            {
                title: "Install",
                handler: () => {
                    $ui.alert({
                        title: "Error",
                        message: "Cannot find EasyJsBoxInstaller.",
                        actions: [
                            { title: "Cancel" },
                            {
                                title: "Install",
                                handler: () => {
                                    const link = "https://github.com/ipuppet/EasyJsBoxInstaller/releases/latest"
                                    $app.openURL(link)
                                }
                            }
                        ]
                    })
                }
            }
        ]
    })
}
