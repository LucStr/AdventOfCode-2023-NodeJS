let data = require('../../get_data')(2);

const games = data.split('\n').map(line => {
    const [gameInfo, gameSetting] = line.split(':');
    const gameNumber = Number(gameInfo.split(' ')[1]);
    const requirements = {
        'red': 0,
        'blue': 0,
        'green': 0,
    };

    const sets = gameSetting.split(';').map(setString => {
        return setString.split(',').map(value => {
            const [number, identifier] = value.trim().split(' ');

            requirements[identifier] = Math.max(number, requirements[identifier]);

            return {
                number: Number(number),
                identifier
            }
        })
        
    });

    const power = Object.values(requirements).reduce((a, b) => a * b);

    return {
        game: gameNumber,
        sets,
        power,
        requirements
    }
});

const result = games.reduce((a, b) => a + b.power, 0)

console.log(result);