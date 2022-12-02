import { calc } from './main';
import BigNumber  from 'bignumber.js'
describe('calc', () => {
    it('should work', async () => {
        const csvDict = [
            {"timestamp":0,"CoinAAmount":1,"CoinASymbol":"A","CoinBAmount":1,"CoinBSymbol":"B","LPAmount":1},
            {"timestamp":0,"CoinAAmount":-1,"CoinASymbol":"A","CoinBAmount":-1,"CoinBSymbol":"B","LPAmount":-1},
        ]
        const result = await calc(csvDict);
        expect(result).toEqual({"A__B":{"CoinAAmount":BigNumber(0),"CoinBAmount":BigNumber(0),"LPAmount":BigNumber(0)}})
        expect(result).not.toEqual({"A__B":{"CoinAAmount":0,"CoinBAmount":0,"LPAmount":0}})
    });
    it('calclate work', async () => {
        const csvDict = [
            {"timestamp":0,"CoinAAmount":100,"CoinASymbol":"A","CoinBAmount":200,"CoinBSymbol":"B","LPAmount":100},
            {"timestamp":0,"CoinAAmount":-90,"CoinASymbol":"A","CoinBAmount":-220,"CoinBSymbol":"B","LPAmount":-100},
        ]
        const result = await calc(csvDict);
        expect(result).toEqual({"A__B":{"CoinAAmount":BigNumber(10),"CoinBAmount":BigNumber(-20),"LPAmount":BigNumber(0)}})
    });
    it('calclate work2', async () => {
        const csvDict = [
            {"timestamp":0,"CoinAAmount":200,"CoinASymbol":"A","CoinBAmount":400,"CoinBSymbol":"B","LPAmount":200},
            {"timestamp":0,"CoinAAmount":-90,"CoinASymbol":"A","CoinBAmount":-220,"CoinBSymbol":"B","LPAmount":-100},
            {"timestamp":0,"CoinAAmount":-45,"CoinASymbol":"A","CoinBAmount":-110,"CoinBSymbol":"B","LPAmount":-50},
        ]
        const result = await calc(csvDict);
        expect(result).toEqual({"A__B":{"CoinAAmount":BigNumber(65),"CoinBAmount":BigNumber(70),"LPAmount":BigNumber(50)}})
    });


});