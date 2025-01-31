import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";

export const Claude = () => {
    const [serverURL, setServerURL] = useState("http://localhost");
    const [port, setPort] = useState(3005);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {

        chrome.storage.sync.get("ClaudeConfig", (res) => {

            if (res.ClaudeConfig) {
                setServerURL(res.ClaudeConfig.serverURL);
                setPort(res.ClaudeConfig.port);
            } else {
                chrome.storage.sync.set({ ClaudeConfig: { serverURL, port } });
            }
        });
    }, [])
    const handleSave = async () => {
        setIsLoading(true);
        await chrome.storage.sync.set({ ClaudeConfig: { serverURL, port } });
        setIsLoading(false);
        toast.success('Successfully Updated!')


    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === "number") {
            setPort(parseInt(e.target.value));
        } else {
            setServerURL(e.target.value);
        }


    }
    return (
        <>
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
                <h1 className="text-xl font-semibold">Claude API Options</h1>
                <p className="text-sm text-gray-400">This options for claude server reversed API, Download it From <a href="https://github.com/gitnasr/Exam-Solver/releases/tag/claude" target="_blank" className="underline decoration-cyan-400 underline-offset-2">here.</a></p>
                <div className="my-3 flex w-full flex-wrap gap-4">
                    <div className="flex flex-col gap-2">
                        <label>Server URL</label>
                        <input
                            onChange={handleOnChange}
                            value={serverURL}
                            type="text" placeholder="http://localhost" className="rounded-xl border border-cyan-700 bg-transparent p-2 outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Port</label>
                        <input
                            onChange={handleOnChange}
                            value={port}
                            type="number" className="rounded-xl border border-cyan-700 bg-transparent p-2 outline-none" placeholder="3005" />
                    </div>

                    <button disabled={isLoading} onClick={handleSave} className="
                    hover:bg-green-800
                    w-full rounded-xl bg-green-700 text-white p-2 disabled:bg-green-900 disabled:cursor-not-allowed">Save</button>

                </div>
                <small
                >These default values are the values that are compatible with our Python server. <br /> DO NOT CHANGE them unless you know what you're doing</small>

            </div>
        </>
    )
}