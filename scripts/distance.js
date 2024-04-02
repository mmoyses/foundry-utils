function distance(token1, token2) {
    const {x: x1, y: y1} = token1.center
    const {x: x2, y: y2} = token2.center
    return roundToNearestMultipleOfFive(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) / canvas.dimensions.distancePixels)
}

function roundToNearestMultipleOfFive(num) {
    return Math.round(num / 5) * 5
}

function createText(controlled, token) {
    const color = "#ffffff"
    const stroke = "#000000"
    const fontSize = 24 * 4
    const desc = "" + distance(controlled, token) + " ft"
    const position = 2
    const height = 40
    const yPosition = token.tooltip.y + height
    if (!token.distance?._texture) {
        const userTextStyle = {
            fontSize,
            fontFamily: CONFIG.canvasTextStyle.fontFamily,
            fill: color,
            stroke,
            strokeThickness: 12,
            padding: 5,
            dropShadow: true,
            dropShadowColor: "black",
            lineJoin: "round",
        }
        token.distance = token.addChild(new PIXI.Text(desc, userTextStyle));
        token.distance.scale.set(0.25);
        token.distance.anchor.set(0.5, 1);
        token.distance.position.set(token.tooltip.x, (token.tooltip.x * position) + yPosition);
    } else {
        token.distance.style.fontSize = fontSize;
        token.distance.text = desc;
        token.distance.style.fill = color;
        token.distance.style.stroke = stroke;
        token.distance.visible = true;
        token.distance.position.set(token.tooltip.x, (token.tooltip.x * position) + yPosition);
    }
}

export class Distance {

    static onHoverToken(token, hovered) {
        if (canvas.tokens?.controlled.length === 1 && token.isVisible) {
            if (hovered) {
                // display distance only if there is one controlled token
                createText(canvas.tokens.controlled[0], token)
            } else if (token.distance) {
                token.distance.visible = false
            }
            
        }
    }

    static setKeybinds() {
        game.keybindings.register("distance", "checkAll", {
            name: "checkAll",
            hint: "Key to press to show distances to all visible tokens",
            editable: [
                { key: "AltLeft" },
                { key: "AltRight" },
            ],
            onDown: () => {
                canvas.tokens?.objects.children.forEach(token => {
                    if (!canvas.tokens?.controlled.length == 1 || !token.isVisible) return
                    createText(canvas.tokens.controlled[0], token)
                })
            },
            onUp: () => {
                canvas.tokens?.objects.children.forEach(token => {
                    if (token.distance) {
                        token.distance.visible = false
                    }
                })
            },
            restricted: false,
            precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        });
    }
}
