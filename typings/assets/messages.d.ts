export function joinMessage(gamePin: any, botName: any, blook: any): string;
export function authorize(authToken: any): string;
export namespace gold {
    export function joinMessage_1(gamePin: any, botName: any, blook: any): string;
    export { joinMessage_1 as joinMessage };
    export function steal(gamePin: any, botName: any, randomBlook: any, victimName: any): string;
    export function give(gamePin: any, botName: any, randomBlook: any, victimName: any): string;
}
export namespace racing {
    function endGame(gamePin: any, botName: any, goalAmount: any): string;
}
