export default {
    sourceDir: "dist",
    run: {
        firefox: "firefox",
        args: [
            "-jsconsole",  // avab Browser Console’i
            "about:debugging#/runtime/this-firefox"
        ]
    },
    verbose: true
};
