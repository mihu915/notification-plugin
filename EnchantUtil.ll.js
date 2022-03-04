//LiteXLoader Dev Helper
//LiteLoaderScript Dev Helper
/// <reference path="e:\PersonCode\lite-loader-library/Library/JS/Api.js" /> 



// 注：大概510行开始为指令注册部分
let VERSION = [1, 0, 0];
let IS_BETA = false;
let AUTHOR = "xiaoqch";
let VERSION_STRING = VERSION.join(".") + (IS_BETA ? " Beta" : "");
let PLUGIN_NAME = "EnchantUtil";
let PLUGIN_DESCRIPTION = "LLSE 真指令示例插件";

logger.setTitle(PLUGIN_NAME);

if(!ll.requireVersion(2, 1, 3)){
    logger.error("LiteLoader 版本过低，请使用 2.1.3 或更高版本");
    forceExit();
}
ll.registerPlugin(PLUGIN_NAME, PLUGIN_DESCRIPTION, VERSION,
    {
        Author: AUTHOR,
    });

////////////////////////////// 以下枚举均为LLSE定义枚举，此处定义仅为了代码提示 //////////////////////////////////////
class FakeParamType {
    static Bool = ParamType.Bool;           //bool
    static Int = ParamType.Int;             //int
    static Float = ParamType.Float;         //float
    static String = ParamType.String;       //std::string
    static Actor = ParamType.Actor;         //CommandSelector<Actor>
    static Player = ParamType.Player;       //CommandSelector<Player>
    static BlockPos = ParamType.BlockPos;   //CommandPosition
    static Vec3 = ParamType.Vec3;           //CommandPositionFloat
    static RawText = ParamType.RawText;     //CommandRawText
    static Message = ParamType.Message;     //CommandMessage
    static JsonValue = ParamType.JsonValue; //Json::Value
    static Item = ParamType.Item;           //CommandItem
    static Block = ParamType.Block;         //Block const*
    static Effect = ParamType.Effect;       //MobEffect const*
    static Enum = ParamType.Enum;           //ENUM
    static SoftEnum = ParamType.SoftEnum;   //SOFT_ENUM
    static ActorType = ParamType.ActorType; //ActorDefinitionIdentifier const*
    static Command = ParamType.Command;     //std::unique_ptr<Command>
}
class FakePermType {
    static Any = PermType.Any;
    static GameMasters = PermType.GameMasters;
    static Admin = PermType.Admin;
    static HostPlayer = PermType.HostPlayer;
    static Console = PermType.Console;
    static Internal = PermType.Internal;
};
class FakeOriginType {
    static Player = OriginType.Player;
    static Block = OriginType.Block;
    static MinecartBlock = OriginType.MinecartBlock;
    static DevConsole = OriginType.DevConsole;
    static Test = OriginType.Test;
    static AutomationPlayer = OriginType.AutomationPlayer;
    static ClientAutomation = OriginType.ClientAutomation;
    static Server = OriginType.Server;
    static Actor = OriginType.Actor;
    static Virtual = OriginType.Virtual;
    static GameArgument = OriginType.GameArgument;
    static ActorServer = OriginType.ActorServer;
    static Precompiled = OriginType.Precompiled;
    static GameDirectorEntity = OriginType.GameDirectorEntity;
    static Script = OriginType.Script;
    static ExecuteContext = OriginType.ExecuteContext;
    static DedicatedServer = OriginType.DedicatedServer;
};
ParamType = FakeParamType;
PermType = FakePermType;
OriginType = FakeOriginType;

////////////////////////////// 数据 //////////////////////////////////////
let EnchantIds = {
    protection: 0,            //保护
    fire_protection: 1,       //火焰保护
    feather_falling: 2,       //摔落保护
    blast_protection: 3,      //爆炸保护
    projectile_protection: 4, //弹射物保护
    thorns: 5,                //荆棘
    respiration: 6,           //水下呼吸
    depth_strider: 7,         //深海探索者
    aqua_affinity: 8,         //水下速掘
    sharpness: 9,             //锋利
    smite: 10,                //亡灵杀手
    bane_of_arthropods: 11,   //节肢杀手
    knockback: 12,            //击退
    fire_aspect: 13,          //火焰附加
    looting: 14,              //抢夺
    efficiency: 15,           //效率
    silk_touch: 16,           //精准采集
    unbreaking: 17,           //耐久
    fortune: 18,              //时运
    power: 19,                //力量
    punch: 20,                //冲击
    flame: 21,                //火矢
    infinity: 22,             //无限
    luck_of_the_sea: 23,      //海之眷顾
    lure: 24,                 //饵钓
    frost_walker: 25,         //冰霜行者
    mending: 26,              //经验修补
    binding: 27,              //绑定诅咒
    vanishing: 28,            //消失诅咒
    impaling: 29,             //穿刺
    riptide: 30,              //激流
    loyalty: 31,              //忠诚
    channeling: 32,           //引雷
    multishot: 33,            //多重箭
    piercing: 34,             //穿透
    quick_charge: 35,         //快速装填
    soul_speed: 36,           //灵魂疾行
};

let EnchantNameMap = {
    0: "保护",
    1: "火焰保护",
    2: "摔落保护",
    3: "爆炸保护",
    4: "弹射物保护",
    5: "荆棘",
    6: "水下呼吸",
    7: "深海探索者",
    8: "水下速掘",
    9: "锋利",
    10: "亡灵杀手",
    11: "节肢杀手",
    12: "击退",
    13: "火焰附加",
    14: "抢夺",
    15: "效率",
    16: "精准采集",
    17: "耐久",
    18: "时运",
    19: "力量",
    20: "冲击",
    21: "火矢",
    22: "无限",
    23: "海之眷顾",
    24: "饵钓",
    25: "冰霜行者",
    26: "经验修补",
    27: "绑定诅咒",
    28: "消失诅咒",
    29: "穿刺",
    30: "激流",
    31: "忠诚",
    32: "引雷",
    33: "多重箭",
    34: "穿透",
    35: "快速装填",
    36: "灵魂疾行",
};
let EnchantNames = Object.values(EnchantNameMap);

//////////////////////////////// 附魔管理工具 //////////////////////////////////////////
class Enchant {
    constructor(id, level = 1) {
        this.setId(id);
        this.setLevel(level);
    }
    getId() {
        return this.id;
    }
    getLevel() {
        return this.level;
    }
    setId(id) {
        if (typeof id === "string") {
            this.id = Object.keys(EnchantIds).contains(id) ? EnchantIds[id] : Number.parseInt(id);
        } else if (typeof id === "number") {
            this.id = id;
        } else {
            throw new Error(`invalid id type: ${typeof id}`);
        }
        this.id = this.id == NaN ? 0 : this.id;
    }
    setLevel(level) {
        if (typeof level === "string") {
            this.level = Number.parseInt(level);
        } else if (typeof level === "number") {
            this.level = level;
        } else {
            throw new Error("level must be number or string");
        }
        this.level = this.level == NaN ? 0 : this.level;
    }
    set(id, level) {
        this.setId(id);
        this.setLevel(level);
    }
    getName() {
        return EnchantNames.hasOwnProperty(this.id) ? EnchantNames[this.id] : `未知附魔(${this.id})`;
    }
    getDisplay() {
        return `§1§l${this.getName()}§r : §4§l${this.level}§r`;
    }
    toTag() {
        return new NbtCompound({
            id: new NbtShort(this.id),
            lvl: new NbtShort(this.level),
        });
    }
}

class EnchantManager {
    item;
    enchantData = [];
    repairCost = 0;
    constructor(item) {
        this.item = item;
        this.initEnchantData();
        this.repairCost = this.getRepairCost();
    }
    initEnchantData() {
        let nbt = this.item.getNbt();
        let tag = nbt.getTag("tag");
        if (tag == undefined)
            return;
        let ench = tag.getTag("ench");
        if (ench == undefined)
            return;
        for (let i = 0; i < ench.getSize(); i++) {
            let e = ench.getTag(i);
            let id = e.getTag("id").get();
            let level = e.getTag("lvl").get();
            this.enchantData.push(new Enchant(id, level));
        }
    }
    getRepairCost() {
        let nbt = this.item.getNbt();
        let tag = nbt.getTag("tag");
        if (tag == undefined) {
            return 0;
        }
        let repairCost = tag.getTag("RepairCost");
        if (repairCost == undefined) {
            return 0;
        }
        return repairCost.get();
    }
    applyEnchantData() {
        let nbt = this.item.getNbt();
        let tag = nbt.getTag("tag");
        if (tag == undefined) {
            nbt.setTag("tag", new NbtCompound());
            tag = nbt.getTag("tag");
        }
        if (this.enchantData.length == 0) {
            tag.removeTag("ench");
        } else {
            let ench = new NbtList();
            for (let i = 0; i < this.enchantData.length; i++) {
                let e = this.enchantData[i];
                ench.addTag(e.toTag());
            }
            tag.setTag("ench", ench);
        }
        tag.setTag("RepairCost", new NbtInt(this.repairCost));
        this.item.setNbt(nbt);
    }
    logAllEnchantData() {
        this.enchantData.forEach(e => {
            logger.warn(e.getDisplay());
        });
    }
    addEnchant(enchant) {
        this.enchantData.push(enchant);
    }
    addLevel(enchantId, level) {
        let enchant = this.getEnchant(enchantId);
        if (enchant == undefined) {
            enchant = new Enchant(enchantId, level);
            this.enchantData.push(enchant);
            return;
        }
        enchant.setLevel(enchant.getLevel() + level);
    }

    removeWhere(predicate) {
        for (let i = this.enchantData.length; i--;) {
            if (predicate(this.enchantData[i])) {
                this.enchantData.splice(i, 1);
            }
        }
    }
    removeEnchant(enchant) {
        if (typeof enchant === "number") {
            this.removeWhere(e => e.getId() == enchant);
        } else if (typeof enchant === "string") {
            this.removeWhere(e => e.getName() == enchant);
        } else if (enchant instanceof Enchant) {
            this.removeWhere(e => e.getId() == enchant.getId());
        }
    }
    setEnchant(enchant) {
        let ench = this.getEnchant(enchant.getId());
        if (ench == undefined) {
            this.addEnchant(enchant);
        } else {
            // logger.warn(enchant.getDisplay());
            ench.setLevel(enchant.getLevel());
        }
    }
    removeAll() {
        this.enchantData = [];
    }
    getEnchant(enchantId) {
        if (typeof enchantId === "number") {
            return this.enchantData.find(e => e.getId() == enchantId);
        } else if (typeof enchantId === "string") {
            return this.enchantData.find(e => e.getName() == enchantId);
        }
    }
    getEnchantLevel(enchantId) {
        let e = this.getEnchant(enchantId);
        return e == undefined ? 0 : e.getLevel();
    }
    getEnchantDisplay(enchantId) {
        let e = this.getEnchant(enchantId);
        return e == undefined ? "未知附魔" : e.getDisplay();
    }
    getEnchantList() {
        return this.enchantData;
    }
    setRepairCost(cost) {
        this.repairCost = cost;
    }
    getEnchantListDisplay() {
        let list = [];
        this.enchantData.forEach(e => {
            list.push(e.getDisplay());
        });
        return list;
    }
    getEnchantListDisplayString() {
        return this.getEnchantListDisplay().join("\n");
    }
    getEnchantListString() {
        return this.getEnchantList().map(e => e.getDisplay()).join("\n");
    }
    getEnchantListStringWithId() {
        return this.getEnchantList().map(e => `${e.getId()} ${e.getDisplay()}`).join("\n");
    }
    getEnchantListStringWithIdAndLevel() {
        return this.getEnchantList().map(e => `${e.getId()} ${e.getLevel()} ${e.getDisplay()}`).join("\n");
    }
    getEnchantListStringWithLevel() {
        return this.getEnchantList().map(e => `${e.getLevel()} ${e.getDisplay()}`).join("\n");
    }
    getEnchantListStringWithLevelAndId() {
        return this.getEnchantList().map(e => `${e.getLevel()} ${e.getId()} ${e.getDisplay()}`).join("\n");
    }
    getEnchantListStringWithLevelAndIdAndName() {
        return this.getEnchantList().map(e => `${e.getLevel()} ${e.getId()} ${e.getName()}`).join("\n");
    }
    getEnchantListStringWithLevelAndName() {
        return this.getEnchantList().map(e => `${e.getLevel()} ${e.getName()}`).join("\n");
    }
    getEnchantListStringWithName() {
        return this.getEnchantList().map(e => `${e.getName()}`).join("\n");
    }
}

//////////////////////////////// GUI //////////////////////////////////////////
class EnchantFormHelper {
    enchantManager;
    player;
    constructor(player, item) {
        this.player = player;
        this.item = item;
        this.enchantManager = new EnchantManager(item);
    }
    commitEnchantData() {
        this.enchantManager.applyEnchantData();
        this.player.refreshItems();
    }
    addEnchant(enchant) {
        this.enchantManager.addEnchant(enchant);
        this.commitEnchantData();
    }
    getEnchant(index) {
        return this.enchantManager.getEnchantList()[index];
    }
    removeEnchant(index) {
        this.enchantManager.getEnchantList().splice(index, 1);
    }
    getEnchantList() {
        return this.enchantManager.getEnchantList();
    }
    getRepairCost() {
        return this.enchantManager.repairCost;
    }
    setRepairCost(cost) {
        this.enchantManager.setRepairCost(cost);
    }
    // sendMenuForm() {
    //     let fm = mc.newSimpleForm();
    //     fm.setTitle("Enchant");
    //     fm.setContent("enchants");
    //     this.menus.forEach(menu => {
    //         fm.addButton(menu);
    //     });
    //     this.player.sendForm(fm, (fmpl, id) => {
    //         if (id == undefined) {
    //             return;
    //         }
    //         switch (id) {
    //             case 0:
    //                 this.sendAddForm();
    //                 break;
    //             case 1:
    //                 this.sendRemoveForm();
    //                 break;
    //             case 2:
    //                 this.sendEnchantmentList();
    //                 break;
    //         }
    //     });
    // }

    sendAddForm() {
        let fm = mc.newCustomForm();
        fm.setTitle("添加附魔");
        fm.addDropdown("附魔", EnchantNames);
        fm.addInput("附魔等级", "1", "1");
        this.player.sendForm(fm, (fmpl, results) => {
            if (results == undefined) {
                return;
            }
            let e = new Enchant(results[0], Number.parseInt(results[1]));
            this.addEnchant(e);
            this.sendListForm("添加附魔成功");
        });
    }
    sendEditForm(id) {
        let enchant = this.getEnchant(id);
        let fm = mc.newCustomForm();
        fm.setTitle("编辑附魔");
        fm.addDropdown("附魔类型", EnchantNames, enchant.getId());
        fm.addInput("附魔等级", "" + enchant.getLevel(), "" + enchant.getLevel());
        fm.addSwitch("移除附魔", false);
        this.player.sendForm(fm, (fmpl, results) => {
            if (results == undefined) {
                return;
            }
            if (results[2]) {
                this.removeEnchant(id);
                this.sendListForm("移除附魔成功！");
                return;
            }
            enchant.set(results[0], Number.parseInt(results[1]));
            this.commitEnchantData();
            this.sendListForm("编辑附魔成功！");
        });
    }
    sendRepairCostForm() {
        let fm = mc.newCustomForm();
        fm.setTitle("修复价格");
        fm.addInput("修复价格", "" + this.getRepairCost(), "" + this.getRepairCost());
        this.player.sendForm(fm, (fmpl, results) => {
            if (results == undefined) {
                return;
            }
            let cost = Number.parseInt(results[0]);
            if(cost == NaN) {
                this.sendListForm("§c修复价格设置失败！§r");
                return;
            }
            this.setRepairCost();
            this.commitEnchantData();
            this.sendListForm("修复价格设置成功！");
        });
    }

    sendListForm(content = "请选择附魔或操作") {
        let fm = mc.newSimpleForm();
        fm.setTitle("附魔列表");
        fm.setContent(`§e${content}\n§7物品：${this.item.name} x ${this.item.count}`);
        this.getEnchantList().forEach(e => {
            fm.addButton(e.getDisplay());
        });
        fm.addButton(`§1§l修复花费§r : §4§l${this.getRepairCost()}§r`);
        fm.addButton("添加附魔");
        fm.addButton("移除所有附魔");
        fm.addButton("退出");
        this.player.sendForm(fm, (fmpl, id) => {
            if (id == undefined) {
                return;
            }
            if (id < this.getEnchantList().length) {
                this.sendEditForm(id);
            } else {
                switch (id - this.getEnchantList().length) {
                    case 0:
                        this.sendRepairCostForm();
                        break;
                    case 1:
                        this.sendAddForm();
                        break;
                    case 2:
                        this.enchantManager.removeAll();
                        this.commitEnchantData();
                        this.sendListForm("移除所有附魔成功！");
                        break;
                }
            }
        });
    }
}

function enchantGUI(player) {
    new EnchantFormHelper(player, player.getHand()).sendListForm();
}

//////////////////////////////// CLI ////////////////////////////////////////// 
function getOrCreateEnchsTag(nbt) {
    let tag = nbt.getTag("tag");
    if (!tag) {
        nbt.setTag("tag", new NbtCompound());
        tag = nbt.getTag("tag");
    }
    let enchs = tag.getTag("ench");
    if (!enchs) {
        tag.setTag("ench", new NbtList());
        enchs = tag.getTag("ench");
    }
    return enchs;
}

function addEnchToEnchsTag(enchs, enchId, level) {
    for (let i = 0; i < enchs.getSize(); i++) {
        let ench = enchs.getTag(i);
        if (ench.getTag("id").get() == enchId) {
            let newLevel = level + ench.getTag("lvl").get();
            if (newLevel == 0) {
                enchs.removeTag(i);
                break;
            }
            ench.setShort("lvl", newLevel);
            return;
        }
    }
    ench = new NbtCompound();
    ench.setShort("id", enchant);
    ench.setShort("lvl", level);
    enchs.addTag(ench);
    return;
}
function addEnchantment(item, enchantId, level) {
    let manager = new EnchantManager(item);
    manager.addLevel(enchantId, level);
    manager.applyEnchantData();
}
function removeEnchantment(item, enchantId) {
    let manager = new EnchantManager(item);
    manager.removeEnchant(enchantId);
    manager.applyEnchantData();
}
function getEnchantment(item, enchantId) {
    return new EnchantManager(item).getEnchant(enchantId);
}
function getEnchantments(item) {
    return new EnchantManager(item).getEnchants();
}
function setEnchantment(item, enchantId, level) {
    let manager = new EnchantManager(item);
    manager.setEnchant(new Enchant(enchantId, level));
    manager.applyEnchantData();
}
function removeAllEnchantments(item) {
    let manager = new EnchantManager(item);
    manager.removeAll();
    manager.applyEnchantData();
}

function getEnchantId(results) {
    // logger.warn(`${JSON.stringify(results)}`);
    if(results.enchantId != undefined) {
        return results.enchantId;
    }else if (EnchantIds.hasOwnProperty(results.enchantName)){
        return EnchantIds[results.enchantName];
    }else if (EnchantNames.indexOf(results.enchantName) != -1) {
        return EnchantNames.indexOf(results.enchantName);
    }else {
        logger.error(`${results.enchantName} is not a valid enchant name!`);
        return -1;
    }
}

function getEnchantLevel(results) {
    return results.level == undefined ? 1 : results.level;
}

function enchantCLI(origin, output, results) {
    let players = results.player;
    if (players == undefined) {
        players = [];
        if (origin.player != undefined)
            players.push(origin.player);
    }
    if (players.length == 0) {
        output.error("没有玩家");
        return;
    }
    players.forEach(player => {
        let item = player.getHand();
        if (item == undefined || item.isNull()) {
            output.error("没有物品");
            return;
        }
        let action = results.action;
        if (action.endsWith("as")) {
            action = action.substring(0, action.length - 2);
        }
        switch (action) {
            case "add":
                addEnchantment(item, getEnchantId(results), getEnchantLevel(results));
                output.success("添加成功");
                break;
            case "remove":
                removeEnchantment(item, getEnchantId(results));
                output.success("移除成功");
                break;
            case "set":
                setEnchantment(item, getEnchantId(results), getEnchantLevel(results));
                output.success("设置成功");
                break;
            case "removeall":
                removeAllEnchantments(item);
                output.success("移除成功");
                break;
        }
        player.refreshItems();
    });
}

function onExecute(command, origin, output, results) {
    let action = results["action"];
    if (action == undefined || action == "gui" || action == "guias") {
        if (action == "guias") {
            if (results["player"].length == 0) {
                output.error("没有玩家");
                return;
            }
            results["player"].forEach(player => {
                enchantGUI(player);
            });
        } else {
            if (origin.player == undefined) {
                output.error("没有玩家");
                return;
            }
            enchantGUI(origin.player);
        }
        return;
    } else {
        enchantCLI(origin, output, results);
    }
    return;
}


if(false) // 将所有重载放到一个指令里
//ench <add|set> <player: target> (EnchNameOrId) [level: int]
//ench <remove> <player: target> (EnchNameOrId)
//ench <add|set> (EnchNameOrId) [level: int]
//ench <remove> (EnchNameOrId)
//ench <removeall|gui> [player: target]
//!! EnchNameOrId: <enchantId: int> or <enchantName: string>
mc.listen("onServerStarted", () => {
    let cmd = mc.newCommand("enchantutil", "对玩家选定的物品增加一项附魔", PermType.GameMasters, 0x80);
    cmd.alias("ench")
    cmd.setEnum("EnchantChangeAction", ["add", "set"]);
    cmd.setEnum("EnchantRemoveAction", ["remove"]);
    cmd.setEnum("EnchantOtherAction", ["removeall", "gui"]);
    cmd.setEnum("PlayerEnchantChangeAction", ["addas", "setas"]);
    cmd.setEnum("PlayerEnchantRemoveAction", ["removeas"]);
    cmd.setEnum("PlayerEnchantOtherAction", ["removeallas", "guias"]);
    cmd.setEnum("EnchName", Object.keys(EnchantIds).concat(EnchantNames));

    cmd.mandatory("player", ParamType.Player);
    cmd.mandatory("enchantId", ParamType.Int);
    cmd.mandatory("enchantName", ParamType.Enum, "EnchName");
    cmd.optional("level", ParamType.Int);

    cmd.mandatory("action", ParamType.Enum, "EnchantChangeAction", 1);
    cmd.mandatory("action", ParamType.Enum, "EnchantRemoveAction", 1);
    cmd.mandatory("action", ParamType.Enum, "EnchantOtherAction", 1);
    cmd.mandatory("action", ParamType.Enum, "PlayerEnchantChangeAction", 1);
    cmd.mandatory("action", ParamType.Enum, "PlayerEnchantRemoveAction", 1);
    cmd.mandatory("action", ParamType.Enum, "PlayerEnchantOtherAction", 1);

    cmd.overload("PlayerEnchantChangeAction", "player", "enchantId", "level");  //ench <addas|setas> <player: target> <enchantId: int> [level: int]
    cmd.overload("PlayerEnchantChangeAction", "player", "enchantName", "level");//ench <addas|setas> <player: target> <enchantName: EnchName> [level: int]
    cmd.overload("PlayerEnchantRemoveAction", "player", "enchantId");//ench <removeas> <player: target> <enchantId: int>
    cmd.overload("PlayerEnchantRemoveAction", "player", "enchantName");//ench <removeas> <player: target> <enchantName: EnchName>
    cmd.overload("PlayerEnchantOtherAction", "player");//ench <removeallas|guias> <player: target>
    cmd.overload("EnchantChangeAction", "enchantId", "level");//ench <add|set> <enchantId: int> [level: int]
    cmd.overload("EnchantChangeAction", "enchantName", "level");//ench <add|set> <enchantName: EnchName> [level: int]
    cmd.overload("EnchantRemoveAction", "enchantId");//ench <remove> <enchantId: int>
    cmd.overload("EnchantRemoveAction", "enchantName");//ench <remove> <enchantName: EnchName>
    cmd.overload("EnchantOtherAction");//ench <removeall|gui>
    cmd.overload();//ench

    cmd.setCallback((command, origin, output, results) => {
        let action = results["action"];
        if (action == undefined || action == "gui" || action == "guias") {
            if (action == "guias") {
                if (results["player"].length == 0) {
                    output.error("没有玩家");
                    return;
                }
                results["player"].forEach(player => {
                    enchantGUI(player);
                });
            } else {
                if (origin.player == undefined) {
                    output.error("没有玩家");
                    return;
                }
                enchantGUI(origin.player);
            }
            return;
        } else {
            enchantCLI(origin, output, results);
        }
        return;
    });
    cmd.setup();
});
else // 将于有玩家参数和无玩家参数的指令分开
//ench <add|set> (EnchNameOrId) [level: int]
//ench <remove> (EnchNameOrId)
//ench <removeall|gui>
//enchas <player> <add|set> (EnchNameOrId) [level: int]
//enchas <player> <remove> (EnchNameOrId)
//enchas <player> <removeall|gui>
mc.listen("onServerStarted", () => {
    let cmd = mc.newCommand("enchantutil", "对玩家选定的物品增加一项附魔", PermType.GameMasters, 0x80|1);
    cmd.setAlias("ench");
    cmd.setEnum("EnchantChangeAction", ["add", "set"]);
    cmd.setEnum("EnchantRemoveAction", ["remove"]);
    cmd.setEnum("EnchantOtherAction", ["removeall", "gui"]);
    cmd.setEnum("EnchName", Object.keys(EnchantIds).concat(EnchantNames));

    cmd.mandatory("enchantId", ParamType.Int);
    cmd.mandatory("enchantName", ParamType.Enum, "EnchName");
    cmd.optional("level", ParamType.Int);

    cmd.mandatory("action", ParamType.Enum, "EnchantChangeAction", 1);
    cmd.mandatory("action", ParamType.Enum, "EnchantRemoveAction", 1);
    cmd.mandatory("action", ParamType.Enum, "EnchantOtherAction", 1);
    
    cmd.overload("EnchantChangeAction", "enchantId", "level");//ench <add|set> <enchantId: int> [level: int]
    cmd.overload("EnchantChangeAction", "enchantName", "level");//ench <add|set> <enchantName: EnchName> [level: int]
    cmd.overload("EnchantRemoveAction", "enchantId");//ench <remove> <enchantId: int>
    cmd.overload("EnchantRemoveAction", "enchantName");//ench <remove> <enchantName: EnchName>
    cmd.overload("EnchantOtherAction");//ench <removeall|gui>
    cmd.overload();//ench

    cmd.setCallback(onExecute);
    cmd.setup();

    let cmdas = mc.newCommand("enchantasutil", "对玩家选定的物品增加一项附魔", PermType.GameMasters, 0x80);
    cmdas.setAlias("enchas");
    
    // cmdas.setEnum("EnchantChangeAction", ["add", "set"]);
    // cmdas.setEnum("EnchantRemoveAction", ["remove"]);
    // cmdas.setEnum("EnchantOtherAction", ["removeall", "gui"]);
    // cmdas.setEnum("EnchName", Object.keys(EnchantIds));

    cmdas.mandatory("player", ParamType.Player);
    cmdas.mandatory("enchantId", ParamType.Int);
    cmdas.mandatory("enchantName", ParamType.Enum, "EnchName");
    cmdas.optional("level", ParamType.Int);

    cmdas.mandatory("action", ParamType.Enum, "EnchantChangeAction", 1);
    cmdas.mandatory("action", ParamType.Enum, "EnchantRemoveAction", 1);
    cmdas.mandatory("action", ParamType.Enum, "EnchantOtherAction", 1);



    cmdas.overload("EnchantChangeAction", "player", "enchantId", "level");  //ench <addas|setas> <player: target> <enchantId: int> [level: int]
    cmdas.overload("EnchantChangeAction", "player", "enchantName", "level");//ench <addas|setas> <player: target> <enchantName: EnchName> [level: int]
    cmdas.overload("EnchantRemoveAction", "player", "enchantId");//ench <removeas> <player: target> <enchantId: int>
    cmdas.overload("EnchantRemoveAction", "player", "enchantName");//ench <removeas> <player: target> <enchantName: EnchName>
    cmdas.overload("EnchantOtherAction", "player");//ench <removeallas|guias> <player: target>

    cmdas.setCallback(onExecute);

    cmdas.setup();
});

logger.info(`${PLUGIN_NAME} Loaded, Version: ${VERSION_STRING}, Author: ${AUTHOR}`);