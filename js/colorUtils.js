export const munsellColorTable = [
    { name: "Red (5R)", hue: "5R", value: 5, chroma: 14, rgb: [200, 35, 35], note: "C4", lab: null },
    { name: "Dark Red (5R)", hue: "5R", value: 3, chroma: 10, rgb: [140, 20, 20], note: "C4", lab: null },
    { name: "Blue (5B)", hue: "5B", value: 5, chroma: 10, rgb: [35, 85, 150], note: "D4", lab: null },
    { name: "Light Blue (5B)", hue: "5B", value: 7, chroma: 6, rgb: [70, 120, 180], note: "D4", lab: null },
    { name: "Green (5G)", hue: "5G", value: 5, chroma: 8, rgb: [50, 150, 50], note: "E4", lab: null },
    { name: "Dark Green (5G)", hue: "5G", value: 3, chroma: 6, rgb: [30, 100, 30], note: "E4", lab: null },
    { name: "Yellow (5Y)", hue: "5Y", value: 8, chroma: 12, rgb: [220, 200, 50], note: "F4", lab: null },
    { name: "Light Yellow (5Y)", hue: "5Y", value: 9, chroma: 10, rgb: [230, 220, 100], note: "F4", lab: null },
    { name: "Purple (5P)", hue: "5P", value: 4, chroma: 10, rgb: [100, 50, 120], note: "G4", lab: null },
    { name: "Light Purple (5P)", hue: "5P", value: 6, chroma: 8, rgb: [130, 80, 150], note: "G4", lab: null },
    { name: "Orange (5YR)", hue: "5YR", value: 6, chroma: 12, rgb: [210, 120, 40], note: "A4", lab: null },
    { name: "Dark Orange (5YR)", hue: "5YR", value: 4, chroma: 10, rgb: [180, 90, 30], note: "A4", lab: null },
    { name: "Pink (5RP)", hue: "5RP", value: 6, chroma: 8, rgb: [200, 120, 140], note: "B4", lab: null },
    { name: "Light Pink (5RP)", hue: "5RP", value: 8, chroma: 6, rgb: [220, 150, 170], note: "B4", lab: null }
];

munsellColorTable.forEach(color => {
    color.lab = window.colorConvert.rgb.lab(color.rgb);
});

function rgbToLab(rgb) {
    console.log("colorUtils.js: Checking if colorConvert is available:", !!window.colorConvert);
    if (!window.colorConvert) {
        throw new Error("color-convert library not loaded. Ensure the script is included and loaded correctly.");
    }
    try {
        const lab = colorConvert.rgb.lab(rgb);
        console.log("colorUtils.js: Converted RGB to Lab:", rgb, "->", lab); // Temporary logging
        return lab;
    } catch (error) {
        console.error("colorUtils.js: Error converting RGB to Lab:", error);
        return [50, 0, 0]; // Fallback to a neutral Lab value
    }
}

function labDistance(lab1, lab2) {
    const [L1, a1, b1] = lab1;
    const [L2, a2, b2] = lab2;
    return Math.sqrt(
        Math.pow(L1 - L2, 2) +
        Math.pow(a1 - a2, 2) +
        Math.pow(b1 - b2, 2)
    );
}

export function detectColor(r, g, b, colorTable) {
    try {
        // Convert RGB to Lab
        const detectedLab = rgbToLab([r, g, b]);

        // Find the closest color in the table based on Lab distance
        let closestColor = null;
        let minDistance = Infinity;

        colorTable.forEach(color => {
            const distance = labDistance(detectedLab, color.lab);
            console.log(`colorUtils.js: Distance to ${color.name}: ${distance}`); // Temporary logging
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = color;
            }
        });

        if (closestColor) {
            console.log(`colorUtils.js: Closest color: ${closestColor.name} (Distance: ${minDistance})`); // Temporary logging
            return closestColor;
        }

        // Fallback if no close match is found
        return {
            name: "unknown",
            hue: "unknown",
            value: 5,
            chroma: 5,
            rgb: [r, g, b],
            note: "C4"
        };
    } catch (error) {
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
        let [r, g, b] = [pixel[0], pixel[1], pixel[2]];

        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const regionSize = 5;
        const startX = Math.max(0, x - Math.floor(regionSize / 2));
        const startY = Math.max(0, y - Math.floor(regionSize / 2));
        const endX = Math.min(width, x + Math.floor(regionSize / 2));
        const endY = Math.min(height, y + Math.floor(regionSize / 2));

        let maxR = 0, maxG = 0, maxB = 0;
        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                const sample = ctx.getImageData(i, j, 1, 1).data;
                maxR = Math.max(maxR, sample[0]);
                maxG = Math.max(maxG, sample[1]);
                maxB = Math.max(maxB, sample[2]);
            }
        }

        const maxChannel = Math.max(maxR, maxG, maxB);
        if (maxChannel > 0) {
            r = (r / maxChannel) * 255;
            g = (g / maxChannel) * 255;
            b = (b / maxChannel) * 255;
        }

        console.log("colorUtils.js: Normalized RGB:", [r, g, b]); // Temporary logging
        return [Math.round(r), Math.round(g), Math.round(b)];
    } catch (error) {
        console.error("colorUtils.js: Error in getPixelFromCanvas:", error);
        return [0, 0, 0];
    }
}


