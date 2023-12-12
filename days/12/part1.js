let data = require('../../get_data')(12);

const result = data.split('\n').map(e => {
    const [springs, criteria] = e.split(' ');

    return {
        springs: [...springs],
        criteria: [...criteria.split(',').map(Number).reverse(), 0],
        unknown: [...springs].filter(e => e === '?').length
    }
}).map(parsed => {
    let result = 0;
    numbers: for(let pot = 0; pot < Math.pow(2, parsed.unknown); pot++){
        let reducer = pot;
        let index = parsed.springs.length - 1;
        for(let c of parsed.criteria){
            while(parsed.springs[index] === '.' ||  parsed.springs[index] === '?'){
                if(index === -1){
                    continue numbers;
                }
                if(parsed.springs[index] === '?'){
                    if(reducer & 1 === 1){
                        break;
                    } else {
                        reducer = reducer >> 1;
                    }
                }
                index--;
            }

            for(let i = 0; i < c; i++){
                if(index === -1){
                    continue numbers;
                }
                if(parsed.springs[index] === '.'){
                    continue numbers;
                }
                if(parsed.springs[index] === '?')
                {
                    if((reducer & 1) === 0){
                        continue numbers;
                    } else {
                        reducer = reducer >> 1;
                    }
                }
                index--;
            }

            if(parsed.springs[index] === '#'){
                continue numbers;
            }

            if(parsed.springs[index] === '?' && reducer & 1 === 1){
                continue numbers;
            }
        }
        
        result++;        
    }
    console.log(result)
    return result;
}).reduce((a, b) => a + b);

console.log(result);