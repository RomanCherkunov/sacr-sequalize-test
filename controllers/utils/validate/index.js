const checkVal = (fn, validate) => {
    if(typeof fn === 'function') {
        validate.forEach(item => {
            if(typeof item === 'object' && !Array.isArray(item) && item.params) {
                const check = fn(...item.params)
                console.log(`${item.name} check result with param: ${item.params.join(',')} - ${check === item.val ? '===' : '!='} ${item.val}`)
            }
         })
    }
}

module.exports = {checkVal}