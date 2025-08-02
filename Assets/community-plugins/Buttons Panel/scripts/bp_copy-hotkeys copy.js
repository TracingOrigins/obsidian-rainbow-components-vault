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

  // 读取 obsidian.json 文件获取 vault 列表
  const obsidianConfigPath =
    "C:/Users/liuqj/AppData/Roaming/obsidian/obsidian.json";
  let targetDirs = [];

  try {
    if (!fs.existsSync(obsidianConfigPath)) {
      notice(`Obsidian 配置文件不存在: ${obsidianConfigPath}`);
      console.log(`Obsidian 配置文件不存在: ${obsidianConfigPath}`);
      return { successCount: 0, failCount: 1 };
    }

    const obsidianConfig = JSON.parse(
      fs.readFileSync(obsidianConfigPath, "utf8")
    );

    if (obsidianConfig.vaults) {
      // 遍历所有 vault，将路径转换为目标文件夹
      for (const vaultId in obsidianConfig.vaults) {
        const vaultPath = obsidianConfig.vaults[vaultId].path;
        // 将路径转换为正斜杠格式，并添加 /.obsidian
        const targetDir = vaultPath.replace(/\\/g, "/") + "/.obsidian";
        targetDirs.push(targetDir);
      }
    }

    notice(`从 obsidian.json 中找到 ${targetDirs.length} 个 vault`);
    console.log(`从 obsidian.json 中找到 ${targetDirs.length} 个 vault`);
  } catch (err) {
    notice(`读取 obsidian.json 失败: ${err}`);
    console.log(`读取 obsidian.json 失败: ${err}`);
    return { successCount: 0, failCount: 1 };
  }

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
