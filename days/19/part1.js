let data = require('../../get_data')(19);

const OPERATIONS = {
    '<': (first, second) => first < second,
    '>': (first, second) => first > second,
}

const [workflowText, partText] = data.split('\n\n');

const workflows = workflowText.split('\n').map(line =>{
    const [_, id, ruleText] = line.match(/([a-z]+)\{(.+)\}/);
    const rules = ruleText.split(',').map((rule, i, a) => {
        if(a.length === i + 1){
            return {
                redirect: rule,
                matches: () => true,
            }
        }

        const [_, tile, operator, criteria, redirect] = rule.match(/([xmas])([<>])([0-9]+):([a-z]+|[AR])/);
        const criteriaNumber = Number(criteria);
        const operation = OPERATIONS[operator];

        return {
            redirect,
            matches: (part) => operation(part[tile], criteriaNumber)
        }
    });

    return {
        id, rules
    }
});

workflows.forEach(e => {
    for(let rule of e.rules){
        rule.redirect = workflows.find(f => f.id === rule.redirect) || rule.redirect;
    }
});

const result = partText.split('\n').map(line => {
    const part = line.slice(1, -1).split(',').map(e => {
        const [tile, number] = e.split('=');
        return {
            tile, number: Number(number)
        }
    }).reduce((a, b) => {
        a[b.tile] = b.number;
        return a;
    }, {});

    let current = workflows.find(e => e.id === 'in');
    while(current.id){
        for(let rule of current.rules){
            if(rule.matches(part)){
                current = rule.redirect;
                break;
            }
        }
    }
    
    return {
        accepted: current === 'A',
        score: Object.values(part).reduce((a, b) => a + b)
    };
}).filter(e => e.accepted).reduce((a, b) => a + b.score, 0)

console.log(result);