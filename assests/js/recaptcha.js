const getElemValuesByIds = (ids) => {
    return Array.from(ids).map(id => {
        const elem = document.getElementById(id)
        return elem.value
    })
} 


