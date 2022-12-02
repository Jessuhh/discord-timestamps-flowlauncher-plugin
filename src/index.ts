import { Flow } from "flow-launcher-helper";
import open from "open";

const { params, on, showResult, run } = new Flow("app.png");

on("query", () => {
    showResult({
        title: "Hello World Typescript",
        subtitle: `Showing your query parameters: ${params}. Click to open Flow's website`,
        method: "do_something_for_query",
        params: ["https://github.com/Flow-Launcher/Flow.Launcher"],
    });
});

on("do_something_for_query", () => {
    const url = params;
    open(url);
});

run();
