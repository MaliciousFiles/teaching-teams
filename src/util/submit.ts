"use server";

import {readFile, writeFile} from "node:fs/promises";

export async function submit(scores: number[]) {
    const data = await readFile("data/scores.json");

    const scoresObj = JSON.parse(data.toString());
    scoresObj.push(scores);
    await writeFile("data/scores.json", JSON.stringify(scoresObj));
}

export async function getScores(): Promise<number[][]> {
    return JSON.parse((await readFile("data/scores.json")).toString());
}