"use server";

import { get } from "@vercel/edge-config";

async function request(scores: number[][], operation: string) {
    return await fetch(
        'https://api.vercel.com/v1/edge-config/ecfg_sxojxxshgshyzrfdyknbzt8835eh/items',
        {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [
                    { operation, key: 'scores', value: scores },
                ],
            }),
        }
    );

}

export async function submit(scores: number[]) {
    const data = await getScores();
    data.push(scores);

    if ('error' in await (await request(data, 'update')).json()) {
        await request(data, 'create');
    }
}

export async function getScores(): Promise<number[][]> {
    return await get<number[][]>("scores") ?? [];
}