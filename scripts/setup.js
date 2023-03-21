console.log("%c Momo's Global Resource Tracker: Loaded", "color: green; font-size: 15px");

Hooks.on("init", function () {
    game.settings.register("momo-global-resource-tracker", "attributeName", {
        scope: "world",
        config: false,
        type: String,
        default: "Resource"
    });
    game.settings.register("momo-global-resource-tracker", "valueCurrent", {
        scope: "world",
        config: false,
        type: String,
        default: "0"
    });
    game.settings.register("momo-global-resource-tracker", "valueMax", {
        scope: "world",
        config: false,
        type: String,
        default: "0"
    });
});

let socket;
Hooks.once("socketlib.ready", function() {
    socket = socketlib.registerModule("momo-global-resource-tracker");
});

let eventsRegistered = false;
Hooks.on("renderPlayerList", async function (playerList, html, data) {
    let isGM = game.users.current.role >= 4;

    let resourceTrackerHTML = await renderTemplate("/modules/momo-global-resource-tracker/html/resourceTracker.html", { isGM });
    let resourceTracker = html.prepend(resourceTrackerHTML);

    let attributeName = resourceTracker.find("input.attribute-name")[0];
    let valueCurrent = resourceTracker.find("input.value-current")[0];
    let valueMax = resourceTracker.find("input.value-max")[0];


    if (eventsRegistered == false){
        eventsRegistered = true;

        socket.register("updateAttributeName", function(value){
            attributeName.value = value;
        });
        socket.register("updateValueCurrent", function(value){
            valueCurrent.value = value;
        });
        socket.register("updateValueMax", function(value){
            valueMax.value = value;
        });

        attributeName.value = game.settings.get("momo-global-resource-tracker", "attributeName");
        valueCurrent.value = game.settings.get("momo-global-resource-tracker", "valueCurrent");
        valueMax.value = game.settings.get("momo-global-resource-tracker", "valueMax");
    }

    if (isGM){
        attributeName.addEventListener("change", function(event){
            socket.executeForOthers("updateAttributeName", attributeName.value);
            game.settings.set("momo-global-resource-tracker", "attributeName",  attributeName.value);
        });
        valueCurrent.addEventListener("change", function(event){
            socket.executeForOthers("updateValueCurrent", valueCurrent.value);
            game.settings.set("momo-global-resource-tracker", "valueCurrent",  valueCurrent.value);
        });
        valueMax.addEventListener("change", function(event){
            socket.executeForOthers("updateValueMax", valueMax.value);
            game.settings.set("momo-global-resource-tracker", "valueMax",  valueMax.value);
        });
    }
});