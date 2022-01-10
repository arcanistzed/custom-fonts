Hooks.on("ready", () => {

  // Enable the new module if it's installed but not active
  if (game.modules.get("custom-fonts")?.active === false) {
    game.settings.set("core", "moduleConfiguration", {
      ...game.settings.get("core", "moduleConfiguration"),
      "custom-fonts": true,
    });
  }

  // Show prompt
  new Dialog({
    title: "DEPRECATED: Forien's Custom Fonts",
    content: "<p>This module will not receive anymore updates and should be uninstalled. A new <a href=\"https://foundryvtt.com/packages/custom-fonts\">Custom Fonts</a> module has been released and should now be installed.</p><blockquote>Select Migrate below if you would like to migrate your custom font settings to the new module. You must enable the new module before attempting migration.</blockquote>",
    buttons: {
      migration: {
        label: "Migrate settings",
        callback: async () => {
          // Register old setting to pull value from
          game.settings.register("forien-custom-fonts", "fonts", {
            name: "Fonts",
            scope: "world",
            config: true,
            type: String,
          });
          const fonts = game.settings.get("forien-custom-fonts", "fonts");

          // Automatic if new module is installed
          if (game.modules.get("custom-fonts")?.active) {
            game.settings.set("custom-fonts", "fonts", fonts);
            ui.notifications.notify("Migration complete.");
          } else {
            console.warn(fonts);
            navigator.clipboard?.writeText(fonts);
            ui.notifications.error("Automatic migration failed since the new Custom Fonts module is not installed. Your font list has been copied to your clipboard and you may manually paste it into the new module. If there's nothing in your clipboard, you can copy the list from the console (F12) instead.", { permanent: true });
          }
        },
      },
      next: {
        label: "Disable this module",
        callback: async () => {
          ui.notifications.info("Forien's Custom Fonts will be disabled. You may uninstall it now. Hopefully you'll be able to use the new Custom Fonts module instead!", { permanent: true });
          setTimeout(() => {
            game.settings.set("core", "moduleConfiguration", {
              ...game.settings.get("core", "moduleConfiguration"),
              "forien-custom-fonts": false,
            });
          }, 5000);
        },
      },
    },
    default: "next"
  }).render(true);
});
