module.exports = removeTodayStats
let quickAddApi;

async function removeTodayStats(params) {
    ({quickAddApi} = params)
//查看文件是否存在
    app.vault.adapter.exists("assets/community-plugins/Dataview/data/daily-stats.json").then(async (exists) => {
        if (!exists) {
            app.vault.adapter.write("assets/community-plugins/Dataview/data/daily-stats.json", "{}");
            return;
        } else {
            let history = Object.assign(JSON.parse(await app.vault.adapter.read("assets/community-plugins/Dataview/data/daily-stats.json")));
//查看当天信息
            let today = moment().format("YYYY-MM-DD");
            delete history[today];
            await app.vault.adapter.write("assets/community-plugins/Dataview/data/daily-stats.json", JSON.stringify(history));
            let read = Object.assign(JSON.parse(await app.vault.adapter.read("assets/community-plugins/Dataview/data/daily-stats.json")));
            if (!read.hasOwnProperty(moment().format("YYYY-MM-DD"))) {
                return;
            }
        }
    });
}
