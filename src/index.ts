import { Flow, JSONRPCResponse } from "flow-launcher-helper";
import ms from "ms";
import dayjs from "dayjs";
import "dayjs/locale/nl.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import childProcess from "child_process";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const copy = (content: string) => childProcess.spawn("clip").stdin.end(content);

type Methods = "copy_result";

const { params, on, showResult, run } = new Flow("app.png");

on("query", () => {
    let message = "";

    let date: dayjs.Dayjs = dayjs();

    try {
        const timestamp = dayjs(params);

        if (!timestamp.isValid()) {
            message = "using ms";
            date = dayjs(Date.now() + ms(params), ["HH:mm"]);
        } else {
            message = "using dayjs";
            date = timestamp;
        }

        const results: JSONRPCResponse<Methods>[] = [
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

        showResult(...results);
    } catch (error) {
        message = "User input was not valid";
        // Tell the user input is not recognized
        showResult({
            title: message,
        });
    }
});

on("copy_result", () => {
    copy(params);
});

run();
