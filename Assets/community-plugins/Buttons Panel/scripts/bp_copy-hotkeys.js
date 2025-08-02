// scripts/copy-hotkeys.js
// 路径填写说明：
// 请统一使用正斜杠（/）分隔各级文件夹，例如：C:/Users/YourName/Obsidian/MyVault,
// 这样既可在代码中正常使用，也可在 Windows 资源管理器地址栏中粘贴并正常识别。

const fs = require("fs");
const path = require("path");

module.exports = async function (params, app, plugin, notice) {
    // 源文件列表
    const filesToCopy = [
        "C:/data/project/ObsidianVaults/01_my-vaults/digital-garden/.obsidian/hotkeys.json",
    ];

    // 目标文件夹列表
    const targetDirs = [
        "C:/data/project/ObsidianVaults/01_my-vaults/java-tutorials/.obsidian",
        "C:/data/project/ObsidianVaults/01_my-vaults/language-learning/.obsidian",
        "C:/data/project/ObsidianVaults/01_my-vaults/my-clippings/.obsidian",
        "C:/data/project/ObsidianVaults/01_my-vaults/my-favorites/.obsidian",
        "C:/data/project/ObsidianVaults/01_my-vaults/my-projects/.obsidian",
        "C:/data/project/ObsidianVaults/01_my-vaults/programming-notes/.obsidian",
        "C:/data/project/ObsidianVaults/01_my-vaults/python-tutorials/.obsidian",
        "C:/data/project/ObsidianVaults/05_my-plugins/kevin's-obsidian-plugin-dev-vault/.obsidian",
        "C:/data/project/ObsidianVaults/05_my-plugins/kevin's-obsidian-plugin-test-vault/.obsidian",
        "C:/data/project/ObsidianVaults/06_my-styles/obsidian-styles-vault/.obsidian",
    ];

    let successCount = 0;
    let failCount = 0;

    for (const file of filesToCopy) {
        let fileSuccess = 0;
        let fileFail = 0;
        if (!fs.existsSync(file)) {
            notice(`源文件不存在: ${file}`);
            console.log(`源文件不存在: ${file}`);
            failCount++;
            fileFail += targetDirs.length;
            continue;
        }
        const fileName = path.basename(file);
        for (const dir of targetDirs) {
            try {
                if (!fs.existsSync(dir)) {
                    // 如果需要自动创建目录，可以取消下面的注释
                    // fs.mkdirSync(dir, { recursive: true });

                    // 若目标目录不存在，不会自动创建，会给出提示
                    // console.log(`目标目录不存在: ${dir}`);
                    notice(`目标目录不存在: ${dir}`);
                    fileFail++;
                    failCount++;
                    continue;
                }
                const destPath = path.join(dir, fileName);
                fs.copyFileSync(file, destPath);
                successCount++;
                fileSuccess++;
            } catch (err) {
                notice(`复制失败: ${file} 到 ${dir}\n${err}`);
                console.log(`复制失败: ${file} 到 ${dir}\n${err}`);
                failCount++;
                fileFail++;
            }
        }
        // console.log(`文件 ${fileName} \n复制成功: ${fileSuccess} 次，失败: ${fileFail} 次`);
        notice(
            `文件 ${fileName} \n复制成功: ${fileSuccess} 次，失败: ${fileFail} 次`
        );
    }
    // console.log(`总计\n复制成功: ${successCount} 次，失败: ${failCount} 次`);
    notice(`总计\n复制成功: ${successCount} 次，失败: ${failCount} 次`);
    return {
        successCount,
        failCount,
    };
};
