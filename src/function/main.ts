import {readFileSync} from 'fs';
import {parse} from 'csv-parse/sync';
import BigNumber from 'bignumber.js';

export interface LPCoinObj {
    timestamp: number;
    CoinAAmount: number;
    CoinASymbol: string;
    CoinBAmount: number;
    CoinBSymbol: string;
    LPAmount: number;
}

interface LPStruct {
    CoinAAmount:BigNumber,
    CoinBAmount:BigNumber,
    LPAmount:BigNumber,
}
interface LPStructObj {
    [prop: string]: LPStruct
}

export function main() {
    const fileStr = readFile("import2.csv");
    const csvDict = parseCsv(fileStr);
    calc(csvDict);
}

export function readFile(filename:string) {
  const fileStr = readFileSync(filename);
  return fileStr.toString();
}

export function parseCsv(fileStr:string){
    const csvArray = parse(fileStr);
    const header = csvArray.shift(); //header
    // console.log(header);
    const csvDict = csvArray.map((x:any)=>{
        let array:any = {}
        for(let i=0;i<header.length;i++){
            array[header[i]] = x[i];
        }
        return array
    })
    return csvDict
}

export async function calc(csvDict:LPCoinObj[]):Promise<LPStructObj>{

    // console.log(csvDict);
    const LPDict:LPStructObj = {}
    const coinConcat=(CoinASymbol:string,CoinBSymbol:string)=>{
        return `${CoinASymbol+'__'+CoinBSymbol}`
    }
    const checkLP=(CoinASymbol:string,CoinBSymbol:string)=>{
        return !Object.hasOwn(LPDict,coinConcat(CoinASymbol,CoinBSymbol))
    }
    const insertNewLP=(CoinASymbol:string,CoinBSymbol:string)=>{
        const LPName = coinConcat(CoinASymbol,CoinBSymbol)
        LPDict[LPName] = {CoinAAmount:new BigNumber(0),CoinBAmount:new BigNumber(0),LPAmount:new BigNumber(0)}
    }
    const calcLossProfit=(coinName:string,coinAmount:BigNumber,timestamp:number)=>{
        if(coinAmount.lt(0)){// <0
            console.log(`${new Date(timestamp).toString()},LOSS,Source,0,${coinName},${coinAmount},0,JPY,0,JPY`)
        }
        else if(coinAmount.gt(0)){// >0
            console.log(`${new Date(timestamp).toString()},BONUS,Source,0,${coinName},${coinAmount},,JPY,0,JPY`)
        }
    }
    for(const line of csvDict){
        const LPName = await coinConcat(line.CoinASymbol,line.CoinBSymbol)
        // console.log(JSON.stringify(LPDict))
        if(line.LPAmount > 0){
            if(checkLP(line.CoinASymbol,line.CoinBSymbol)){
                await insertNewLP(line.CoinASymbol,line.CoinBSymbol)
            }
        }
        if(line.LPAmount < 0){
            const LPRatio = await BigNumber(line.LPAmount).div(LPDict[LPName].LPAmount).times(-1)
            // console.log(`${LPRatio}`)
            // console.log(LPDict[LPName].CoinAAmount.times(LPRatio))
            const CoinAAmount = await LPDict[LPName].CoinAAmount.times(LPRatio).plus(line.CoinAAmount).times(-1)
            // console.log(CoinAAmount);
            calcLossProfit(line.CoinASymbol,CoinAAmount,line.timestamp);
            const CoinBAmount = await LPDict[LPName].CoinBAmount.times(LPRatio).plus(line.CoinBAmount).times(-1)
            // console.log(CoinBAmount);
            calcLossProfit(line.CoinBSymbol,CoinBAmount,line.timestamp);
        }
        // console.log(JSON.stringify(LPDict))
        LPDict[LPName].CoinAAmount = await BigNumber(line.CoinAAmount).plus(LPDict[LPName].CoinAAmount)
        LPDict[LPName].CoinBAmount = await BigNumber(line.CoinBAmount).plus(LPDict[LPName].CoinBAmount)
        LPDict[LPName].LPAmount = await BigNumber(line.LPAmount).plus(LPDict[LPName].LPAmount)
        if(LPDict[LPName].LPAmount.lt(0)) throw new Error("LPAmount Lather than 0!!")
    }
    return LPDict
}