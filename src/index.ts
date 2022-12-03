import { Flow, JSONRPCResponse } from "flow-launcher-helper";
import ms from "ms";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import childProcess from "child_process";
import * as chrono from "chrono-node";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const copy = (content: string) => childProcess.spawn("clip").stdin.end(content);

type Methods = "copy_result";

const { params, on, showResult, run } = new Flow("app.png");

on("query", () => {
    let date: dayjs.Dayjs = dayjs();

    // Use chrono
    if (params.length > 0) {
        const timestamp = chrono.parseDate(params);
        date = dayjs(timestamp);
    }

    if (date.isValid()) {
        showResult(...getResults(date));
        return;
    }

    // Parse through ms
    date = dayjs(new Date(Date.now() + ms(params)));

    if (date.isValid()) {
        showResult(...getResults(date));
        return;
    }

    showResult({
        title: "Invalid input",
    });
});

function getResults(date: dayjs.Dayjs): JSONRPCResponse<Methods>[] {
    return [
        {
            title: date.format("L"),
            subtitle: `<t:${date.unix()}:d>`,
            method: "copy_result",
            params: [`<t:${date.unix()}:d>`],
        },
        {
            title: date.format("LL"),
            subtitle: `<t:${date.unix()}:D>`,
            method: "copy_result",
            params: [`<t:${date.unix()}:D>`],
        },
        {
            title: date.format("LT"),
            subtitle: `<t:${date.unix()}:t>`,
            method: "copy_result",
            params: [`<t:${date.unix()}:t>`],
        },
        {
            title: date.format("LTS"),
            subtitle: `<t:${date.unix()}:T>`,
            method: "copy_result",
            params: [`<t:${date.unix()}:T>`],
        },
        {
            title: date.format("LLL"),
            subtitle: `<t:${date.unix()}:f>`,
            method: "copy_result",
            params: [`<t:${date.unix()}:f>`],
        },
        {
            title: date.format("LLLL"),
            subtitle: `<t:${date.unix()}:F>`,
            method: "copy_result",
            params: [`<t:${date.unix()}:F>`],
        },
        {
            title: date.fromNow(),
            subtitle: `<t:${date.unix()}:R>`,
            method: "copy_result",
            params: [`<t:${date.unix()}:R>`],
        },
        {
            title: date.unix().toString(),
            subtitle: date.unix().toString(),
            method: "copy_result",
            params: [date.unix().toString()],
        },
    ];
}

on("copy_result", () => {
    copy(params);
});

run();
