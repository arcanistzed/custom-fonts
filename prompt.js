Hooks.on("ready", () => {
  new Dialog({
    title: "DEPRECATED: Forien's Custom Fonts",
    content: "This module will not receive anymore updates and should be uninstalled. A new <a href=\"https://foundryvtt.com/packages/custom-fonts\">Custom Fonts</a> module has been released and should now be installed.",
    buttons: {
      next: {
        label: "Disable this module and return to Setup",
        callback: async () => {
          await game.settings.storage.get("world").getSetting("core.moduleConfiguration").update({
            value: JSON.stringify({
              ...game.settings.get("core", "moduleConfiguration"),
              "forien-custom-fonts": false,
            })
          });
          ui.notifications.info("Forien's Custom Fonts has been disabled. Returning to Setup...");
          setTimeout(() => game.shutDown(), 5000);
        },
      },
    },
    default: "next"
  }).render(true);
});
