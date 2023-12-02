let data = require('../../get_data')(2);

const SETTINGS = {
    'red': 12,
    'green': 13,
    'blue': 14
};

const games = data.split('\n').map(line => {
    const [gameInfo, gameSetting] = line.split(':');
    const gameNumber = Number(gameInfo.split(' ')[1]);
    const sets = gameSetting.split(';').map(setString => {
        return setString.split(',').map(value => {
            const [number, identifier] = value.trim().split(' ');

            return {
                number: Number(number),
                identifier
            }
        })
        
    });

    return {
        game: gameNumber,
        sets
    }
});

const result = games.filter(game => game.sets.every(set => set.every(val => SETTINGS[val.identifier] >= val.number))).reduce((a, b) => a + b.game, 0);

console.log(result);