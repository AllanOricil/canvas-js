import {
    removeWhiteSpaces
} from '../utils/string.js';

export default class Color {

    static get htmlColors() {
        return {
            INDIANRED: 'rgb(205, 92, 92)',
            LIGHTCORAL: 'rgb(240, 128, 128)',
            SALMON: 'rgb(250, 128, 114)',
            DARKSALMON: 'rgb(233, 150, 122)',
            LIGHTSALMON: 'rgb(255, 160, 122)',
            CRIMSON: 'rgb(220, 20, 60)',
            RED: 'rgb(255, 0, 0)',
            FIREBRICK: 'rgb(178, 34, 34)',
            DARKRED: 'rgb(139, 0, 0)',
            PINK: 'rgb(255, 192, 203)',
            LIGHTPINK: 'rgb(255, 182, 193)',
            HOTPINK: 'rgb(255, 105, 180)',
            DEEPPINK: 'rgb(255, 20, 147)',
            MEDIUMVIOLETRED: 'rgb(199, 21, 133)',
            PALEVIOLETRED: 'rgb(219, 112, 147)',
            LIGHTSALMON: 'rgb(255, 160, 122)',
            CORAL: 'rgb(255, 127, 80)',
            TOMATO: 'rgb(255, 99, 71)',
            ORANGERED: 'rgb(255, 69, 0)',
            DARKORANGE: 'rgb(255, 140, 0)',
            ORANGE: 'rgb(255, 165, 0)',
            GOLD: 'rgb(255, 215, 0)',
            YELLOW: 'rgb(255, 255, 0)',
            LIGHTYELLOW: 'rgb(255, 255, 224)',
            LEMONCHIFFON: 'rgb(255, 250, 205)',
            LIGHTGOLDENRODYELLOW: 'rgb(250, 250, 210)',
            PAPAYAWHIP: 'rgb(255, 239, 213)',
            MOCCASIN: 'rgb(255, 228, 181)',
            PEACHPUFF: 'rgb(255, 218, 185)',
            PALEGOLDENROD: 'rgb(238, 232, 170)',
            KHAKI: 'rgb(240, 230, 140)',
            DARKKHAKI: 'rgb(189, 183, 107)',
            LAVENDER: 'rgb(230, 230, 250)',
            THISTLE: 'rgb(216, 191, 216)',
            PLUM: 'rgb(221, 160, 221)',
            VIOLET: 'rgb(238, 130, 238)',
            ORCHID: 'rgb(218, 112, 214)',
            FUCHSIA: 'rgb(255, 0, 255)',
            MAGENTA: 'rgb(255, 0, 255)',
            MEDIUMORCHID: 'rgb(186, 85, 211)',
            MEDIUMPURPLE: 'rgb(147, 112, 219)',
            REBECCAPURPLE: 'rgb(102, 51, 153)',
            BLUEVIOLET: 'rgb(138, 43, 226)',
            DARKVIOLET: 'rgb(148, 0, 211)',
            DARKORCHID: 'rgb(153, 50, 204)',
            DARKMAGENTA: 'rgb(139, 0, 139)',
            PURPLE: 'rgb(128, 0, 128)',
            INDIGO: 'rgb(75, 0, 130)',
            SLATEBLUE: 'rgb(106, 90, 205)',
            DARKSLATEBLUE: 'rgb(72, 61, 139)',
            MEDIUMSLATEBLUE: 'rgb(123, 104, 238)',
            GREENYELLOW: 'rgb(173, 255, 47)',
            CHARTREUSE: 'rgb(127, 255, 0)',
            LAWNGREEN: 'rgb(124, 252, 0)',
            LIME: 'rgb(0, 255, 0)',
            LIMEGREEN: 'rgb(50, 205, 50)',
            PALEGREEN: 'rgb(152, 251, 152)',
            LIGHTGREEN: 'rgb(144, 238, 144)',
            MEDIUMSPRINGGREEN: 'rgb(0, 250, 154)',
            SPRINGGREEN: 'rgb(0, 255, 127)',
            MEDIUMSEAGREEN: 'rgb(60, 179, 113)',
            SEAGREEN: 'rgb(46, 139, 87)',
            FORESTGREEN: 'rgb(34, 139, 34)',
            GREEN: 'rgb(0, 128, 0)',
            DARKGREEN: 'rgb(0, 100, 0)',
            YELLOWGREEN: 'rgb(154, 205, 50)',
            OLIVEDRAB: 'rgb(107, 142, 35)',
            OLIVE: 'rgb(128, 128, 0)',
            DARKOLIVEGREEN: 'rgb(85, 107, 47)',
            MEDIUMAQUAMARINE: 'rgb(102, 205, 170)',
            DARKSEAGREEN: 'rgb(143, 188, 139)',
            LIGHTSEAGREEN: 'rgb(32, 178, 170)',
            DARKCYAN: 'rgb(0, 139, 139)',
            TEAL: 'rgb(0, 128, 128)',
            AQUA: 'rgb(0, 255, 255)',
            CYAN: 'rgb(0, 255, 255)',
            LIGHTCYAN: 'rgb(224, 255, 255)',
            PALETURQUOISE: 'rgb(175, 238, 238)',
            AQUAMARINE: 'rgb(127, 255, 212)',
            TURQUOISE: 'rgb(64, 224, 208)',
            MEDIUMTURQUOISE: 'rgb(72, 209, 204)',
            DARKTURQUOISE: 'rgb(0, 206, 209)',
            CADETBLUE: 'rgb(95, 158, 160)',
            STEELBLUE: 'rgb(70, 130, 180)',
            LIGHTSTEELBLUE: 'rgb(176, 196, 222)',
            POWDERBLUE: 'rgb(176, 224, 230)',
            LIGHTBLUE: 'rgb(173, 216, 230)',
            SKYBLUE: 'rgb(135, 206, 235)',
            LIGHTSKYBLUE: 'rgb(135, 206, 250)',
            DEEPSKYBLUE: 'rgb(0, 191, 255)',
            DODGERBLUE: 'rgb(30, 144, 255)',
            CORNFLOWERBLUE: 'rgb(100, 149, 237)',
            MEDIUMSLATEBLUE: 'rgb(123, 104, 238)',
            ROYALBLUE: 'rgb(65, 105, 225)',
            BLUE: 'rgb(0, 0, 255)',
            MEDIUMBLUE: 'rgb(0, 0, 205)',
            DARKBLUE: 'rgb(0, 0, 139)',
            NAVY: 'rgb(0, 0, 128)',
            MIDNIGHTBLUE: 'rgb(25, 25, 112)',
            CORNSILK: 'rgb(255, 248, 220)',
            BLANCHEDALMOND: 'rgb(255, 235, 205)',
            BISQUE: 'rgb(255, 228, 196)',
            NAVAJOWHITE: 'rgb(255, 222, 173)',
            WHEAT: 'rgb(245, 222, 179)',
            BURLYWOOD: 'rgb(222, 184, 135)',
            TAN: 'rgb(210, 180, 140)',
            ROSYBROWN: 'rgb(188, 143, 143)',
            SANDYBROWN: 'rgb(244, 164, 96)',
            GOLDENROD: 'rgb(218, 165, 32)',
            DARKGOLDENROD: 'rgb(184, 134, 11)',
            PERU: 'rgb(205, 133, 63)',
            CHOCOLATE: 'rgb(210, 105, 30)',
            SADDLEBROWN: 'rgb(139, 69, 19)',
            SIENNA: 'rgb(160, 82, 45)',
            BROWN: 'rgb(165, 42, 42)',
            MAROON: 'rgb(128, 0, 0)',
            WHITE: 'rgb(255, 255, 255)',
            SNOW: 'rgb(255, 250, 250)',
            HONEYDEW: 'rgb(240, 255, 240)',
            MINTCREAM: 'rgb(245, 255, 250)',
            AZURE: 'rgb(240, 255, 255)',
            ALICEBLUE: 'rgb(240, 248, 255)',
            GHOSTWHITE: 'rgb(248, 248, 255)',
            WHITESMOKE: 'rgb(245, 245, 245)',
            SEASHELL: 'rgb(255, 245, 238)',
            BEIGE: 'rgb(245, 245, 220)',
            OLDLACE: 'rgb(253, 245, 230)',
            FLORALWHITE: 'rgb(255, 250, 240)',
            IVORY: 'rgb(255, 255, 240)',
            ANTIQUEWHITE: 'rgb(250, 235, 215)',
            LINEN: 'rgb(250, 240, 230)',
            LAVENDERBLUSH: 'rgb(255, 240, 245)',
            MISTYROSE: 'rgb(255, 228, 225)',
            GAINSBORO: 'rgb(220, 220, 220)',
            LIGHTGRAY: 'rgb(211, 211, 211)',
            SILVER: 'rgb(192, 192, 192)',
            DARKGRAY: 'rgb(169, 169, 169)',
            GRAY: 'rgb(128, 128, 128)',
            DIMGRAY: 'rgb(105, 105, 105)',
            LIGHTSLATEGRAY: 'rgb(119, 136, 153)',
            SLATEGRAY: 'rgb(112, 128, 144)',
            DARKSLATEGRAY: 'rgb(47, 79, 79)',
            BLACK: 'rgb(0, 0, 0)'
        };
    }

    static isRGB(color) {
        return color.match(/^rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/gi) !== null;
    };

    static isRGBA(color) {
        return color.match(/^rgba\((\d+),(\d+),(\d+),(\d+\.\d+)\)$/gi) !== null;
    };

    static isHEX(color) {
        return color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/gi) !== null;
    };

    static string2Color(color) {
        const htmlColor = Color.htmlColors[color.toUpperCase()];
        if (htmlColor) color = htmlColor;
        color = removeWhiteSpaces(color);
        if (Color.isRGB(color) || Color.isRGBA(color)) {
            let colors = color.replace('rgb(', '').replace('rgba(', '').replace(')', '').split(',');
            return {
                red: colors[0],
                green: colors[1],
                blue: colors[2],
                alpha: colors[3] || 1
            };
        } else if (Color.isHEX(color)) {
            color = color.replace('#', '');
            const pace = color.length / 3;
            return {
                red: parseInt(color.substring(0, pace), 16),
                green: parseInt(color.substring(pace, 2 * pace), 16),
                blue: parseInt(color.substring(2 * pace, 3 * pace), 16),
                alpha: 1
            };
        } else {
            return {
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0
            };
        }
    }

    static rgbToHex(rgb) {
        rgb = rgb.replace(/\s/g, "");
        const rgbNumbers = rgb.replace('rgb(', '').replace('rgba(', '').replace(')', '').split(',');
        let hex = '#';
        rgbNumbers.forEach((rgbValue, index) => {
            if (index != 3) {
                const hexDigit = Number(rgbValue).toString(16);
                hex += hexDigit.length === 2 ? hexDigit : (`0${hexDigit}`);
            }
        });
        return hex;
    };

    constructor(color) {
        if (typeof color === 'string') color = Color.string2Color(color);
        this._red = color.red;
        this._green = color.green;
        this._blue = color.blue;
        this._alpha = color.alpha || 1;
    }

    get rgb() {
        return `rgb(${this._red},${this._green},${this._blue})`;
    }

    get rgba() {
        return `rgba(${this._red},${this._green},${this._blue},${this._alpha})`;
    }

    get hex() {
        return Color.rgbToHex(this.rgb);
    }

}