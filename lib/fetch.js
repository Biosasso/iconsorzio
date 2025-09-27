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
    // Prepara i dati per l'invio, convertendo Date objects in timestamp Unix
    const dataToSend = { ...args[0].data };
    
    // Se selectedData è un Date object, convertilo in timestamp Unix
    if (dataToSend.selectedData instanceof Date) {
        dataToSend.selectedData = Math.floor(dataToSend.selectedData.getTime() / 1000);
        console.log('DEBUG fetcherDisponibilitaVeicoli: Converted Date to Unix timestamp:', dataToSend.selectedData);
    }

    const res = await fetch(args[0].url, {
        method: 'POST',
        body: JSON.stringify(dataToSend),
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