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
            tile,
            operator,
            criteria: criteriaNumber,
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

const queue = [{
    workflow: workflows.find(e => e.id === 'in'),
    tiles: {
        'x': {start: 1, end: 4000},
        'm': {start: 1, end: 4000},
        'a': {start: 1, end: 4000},
        's': {start: 1, end: 4000},
    },
}];

const approved = [];

while(queue.length){
    const current = queue.shift();

    if(current.workflow === 'A'){
        approved.push(current);
        continue;
    }

    if(current.workflow === 'R'){
        continue;
    }

    for(let rule of current.workflow.rules){
        if(rule.operator === undefined){
            current.workflow = rule.redirect
            queue.push(current);
            continue;
        }

        const copy1 = JSON.parse(JSON.stringify(current.tiles));

        if(rule.operator === '<'){
            copy1[rule.tile].end = rule.criteria - 1;
        } else {
            copy1[rule.tile].start = rule.criteria + 1;
        }

        if(copy1[rule.tile].start > copy1[rule.tile].end){
            continue;
        }

        queue.push({
            workflow: rule.redirect,
            tiles: copy1
        });
        
        if(rule.operator === '<'){
            current.tiles[rule.tile].start = rule.criteria;
        } else {
            current.tiles[rule.tile].end = rule.criteria;
        }
    }
}

const result = approved.map(e => Object.values(e.tiles).reduce((a, b) => a * (b.end - b.start + 1), 1)).reduce((a, b) => a + b);
console.log(result);