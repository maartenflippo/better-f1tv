/**
 * Generates a sources ZIP that can be submitted next to the actual extension
 * bundle. The script requires the "manifest.json" file to be generated and
 * present in the "public" folder in this project.
 */

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const info = require("../package.json");

const outputDir = path.resolve(__dirname, "../web-ext-artifacts");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const outputPath = path.resolve(
    __dirname,
    `../web-ext-artifacts/f1tv_tweaks-${info.version}-src.zip`
);

const output = fs.createWriteStream(outputPath);
const archive = archiver("zip");

output.on("close", function () {
    console.log("Built sources artifact.");
});

archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
        console.error(err);
    } else {
        throw err;
    }
});

archive.on("error", function (err) {
    throw err;
});

archive.pipe(output);

archive.directory(path.resolve(__dirname, "../src"), "src");
archive.directory(path.resolve(__dirname, "../tasks"), "tasks");
archive.directory(path.resolve(__dirname, "../public/icons"), "public/icons");

archive.file(path.resolve(__dirname, "../public/manifest.json"), {
    name: "manifest.json",
});
archive.file(path.resolve(__dirname, "../public/layout.css"), {
    name: "public/layout.css",
});
archive.file(path.resolve(__dirname, "../rollup.config.js"), {
    name: "rollup.config.js",
});
archive.file(path.resolve(__dirname, "../package.json"), {
    name: "package.json",
});
archive.file(path.resolve(__dirname, "../package-lock.json"), {
    name: "package-lock.json",
});
archive.file(path.resolve(__dirname, "../README.md"), {
    name: "README.md",
});

archive.finalize();
