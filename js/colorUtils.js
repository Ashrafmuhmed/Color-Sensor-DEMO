
export const munsellColorTable = [
    { name: "Red (5R)", hue: "5R", value: 5, chroma: 14, rgb: [200, 35, 35], note: "C4" },
    { name: "Blue (5B)", hue: "5B", value: 5, chroma: 10, rgb: [35, 85, 150], note: "D4" },
    { name: "Green (5G)", hue: "5G", value: 5, chroma: 8, rgb: [50, 150, 50], note: "E4" },
    { name: "Yellow (5Y)", hue: "5Y", value: 8, chroma: 12, rgb: [220, 200, 50], note: "F4" },
    { name: "Purple (5P)", hue: "5P", value: 4, chroma: 10, rgb: [100, 50, 120], note: "G4" },
    { name: "Orange (5YR)", hue: "5YR", value: 6, chroma: 12, rgb: [210, 120, 40], note: "A4" },
    { name: "Pink (5RP)", hue: "5RP", value: 6, chroma: 8, rgb: [200, 120, 140], note: "B4" }
];

// Convert RGB to Lab using color-convert (global variable from CDN)
function rgbToLab(rgb) {
    if (!window.colorConvert) {
        throw new Error("color-convert library not loaded. Ensure the script is included and loaded correctly.");
    }
    try {
        return colorConvert.rgb.lab(rgb);
    } catch (error) {
        console.error("colorUtils.js: Error converting RGB to Lab:", error);
        return [50, 0, 0]; // Fallback to a neutral Lab value
    }
}

// Approximate Munsell Hue from Lab (simplified)
function labToMunsellHue(lab) {
    try {
        const [L, a, b] = lab;
        const hueAngle = Math.atan2(b, a) * (180 / Math.PI);
        // Map hue angle to Munsell hues (simplified mapping)
        if (hueAngle >= 0 && hueAngle < 30) return "5R";
        if (hueAngle >= 30 && hueAngle < 90) return "5YR";
        if (hueAngle >= 90 && hueAngle < 150) return "5Y";
        if (hueAngle >= 150 && hueAngle < 210) return "5G";
        if (hueAngle >= 210 && hueAngle < 270) return "5B";
        if (hueAngle >= 270 && hueAngle < 330) return "5P";
        return "5RP";
    } catch (error) {
        console.error("colorUtils.js: Error in labToMunsellHue:", error);
        return "5R"; // Fallback hue
    }
}

export function detectColor(r, g, b, colorTable) {
    try {
        const lab = rgbToLab([r, g, b]);

        const detectedHue = labToMunsellHue(lab);

        return colorTable.find(color => color.hue === detectedHue) || {
            name: "unknown",
            hue: detectedHue,
            value: 5,
            chroma: 5,
            rgb: [r, g, b],
            note: "C4"
        };
    } catch (error) {
        console.error("colorUtils.js: Error in detectColor:", error);
        return { name: "error", hue: "unknown", value: 5, chroma: 5, rgb: [r, g, b], note: "C4" };
    }
}

export function getRGBString(rgb) {
    try {
        return `rgb(${rgb.join(',')})`;
    } catch (error) {
        console.error("colorUtils.js: Error in getRGBString:", error);
        return "rgb(0,0,0)";
    }
}

export function getPixelFromCanvas(ctx, x, y) {
    try {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        return [pixel[0], pixel[1], pixel[2]];
    } catch (error) {
        console.error("colorUtils.js: Error in getPixelFromCanvas:", error);
        return [0, 0, 0];
    }
}