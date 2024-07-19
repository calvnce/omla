import { baseurl } from "./utils";

export async function getArtisanStats(artisanId?:string) {
    try {
        const url = `${baseurl}generic/artisan/stats/${artisanId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return {
                erro: `HTTP error! status: ${response.status}`,
                message: response.statusText
            };
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {
            erro: error
        };
    }
}