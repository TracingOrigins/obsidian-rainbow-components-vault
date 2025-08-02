module.exports = simpleReplace;

// 读取当前文件内容，并将文件中的所有的 空行+---+空行替换为一个空行
async function simpleReplace() {
  try {
    // 判断当前激活的标签页类型是否为 markdown
    const activeLeaf = app.workspace.activeLeaf;
    if (
      !activeLeaf ||
      !activeLeaf.view ||
      typeof activeLeaf.view.getViewType !== "function" ||
      activeLeaf.view.getViewType() !== "markdown"
    ) {
      new Notice("当前激活的标签页不是 Markdown 文件，操作已取消。");
      return;
    }

    // 获取当前活动文件
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
      new Notice("当前没有打开的文件！");
      return;
    }

    // 读取文件内容
    const fileContent = await app.vault.read(activeFile);

    // 替换 "空行" + "---" + "空行" 为单个空行
    let updatedContent = fileContent.replace(/\n\n\s*---\s*\n/g, "\n");

    // 清除多余空行
    updatedContent = updatedContent.replace(/\n\s*\n\s*/g, "\n");

    // 写回文件
    await app.vault.modify(activeFile, updatedContent);

    new Notice("当前文件内容已成功更新！");
  } catch (error) {
    console.error("替换文件内容时出错：", error);
    new Notice("替换操作失败，请检查控制台日志。");
  }
}