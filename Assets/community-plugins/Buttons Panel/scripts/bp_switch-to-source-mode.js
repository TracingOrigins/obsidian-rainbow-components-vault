// 切换到源模式的脚本
module.exports = sourceMode

async function sourceMode() {
    // 获取当前活动的工作区叶子
    const activeLeaf = this.app.workspace.activeLeaf;

    // console.log("Current active leaf:", activeLeaf);
    // console.log("Current active leaf view state:", activeLeaf.getViewState());
    // console.log("Current active leaf view state title:", activeLeaf.getViewState().title);
    // console.log("Current active leaf view state type:", activeLeaf.getViewState().type);
    // console.log("Current active leaf view state state:", activeLeaf.getViewState().state);
    // console.log("Current active leaf view state mode:", activeLeaf.getViewState().state.mode);
    // console.log("Current active leaf view state source:", activeLeaf.getViewState().state.source);
    
    // 检查是否有活动的叶子
    if (!activeLeaf) {
        new Notice("No active leaf found.");
        return;
    }

    // 获取当前视图状态
    const currentView = activeLeaf.getViewState();

    // 检查当前是否有文件打开
    if (currentView.type === "empty") {
        new Notice("There is currently no file open.");
        return;
    }

    // 检查当前视图是否为源模式
    const isSource = currentView.state.mode === 'source' && currentView.state.source === true;

    if (!isSource) {
        // 切换到源模式
        const newMode = currentView;
        newMode.state.mode = "source";
        newMode.state.source = true;
        await activeLeaf.setViewState(newMode);
    }
};
