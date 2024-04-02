import { Distance } from "./distance.js"

Hooks.once("init", function () {
	Distance.setKeybinds();
});

Hooks.on("hoverToken", Distance.onHoverToken);
