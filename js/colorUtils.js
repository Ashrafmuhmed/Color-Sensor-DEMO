export const defaultColorTable = [
    { name: "red", rgb: [255, 0, 0], note: "C4" },
    { name: "blue", rgb: [0, 0, 255], note: "D4" },
    { name: "green", rgb: [0, 255, 0], note: "E4" },
    { name: "yellow", rgb: [255, 255, 0], note: "F4" },
    { name: "purple", rgb: [128, 0, 128], note: "G4" },
    { name: "orange", rgb: [255, 165, 0], note: "A4" },
    { name: "pink", rgb: [255, 192, 203], note: "B4" }
];

export function detectColor(r, g, b, colorTable) {
    let closestColor = null;
    let minDistance = Infinity;

    for (const color of colorTable) {
        const [r1, g1, b1] = color.rgb;
        const dist = Math.sqrt((r1 - r) ** 2 + (g1 - g) ** 2 + (b1 - b) ** 2);
        if (dist < minDistance) {
            minDistance = dist;
            closestColor = color;
        }
    }
    return closestColor || { name: "unknown", rgb: [r, g, b], note: "C4" };
}

export function getRGBString(rgb) {
    return `rgb(${rgb.join(',')})`;
}

export function getPixelFromCanvas(ctx, x, y) {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return [pixel[0], pixel[1], pixel[2]];
} 