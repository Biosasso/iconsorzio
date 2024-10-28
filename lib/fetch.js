export default async function fetcher(...args) {
    const res = await fetch(...args)
    return res.json()
}

export async function fetcherWithData(...args) {

    const res = await fetch(args[0].url, {
        method: 'POST',
        body: JSON.stringify(args[0].data),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    return res.json()
}

export async function fetcherDisponibilitaVeicoli(...args) {

    const res = await fetch(args[0].url, {
        method: 'POST',
        body: JSON.stringify(args[0].data),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const result = await res.json();
    const arr = []
    result.map(item => {
        arr.push(new Date(item.inizioServizio * 1000))
        if (item.durataMinuti === 60) {
            arr.push(new Date(item.inizioServizio * 1000 + 30 * 60 * 1000))
        }
    })
    return arr
}