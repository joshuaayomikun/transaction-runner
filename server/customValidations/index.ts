
export const validateAmount = (value: any, { req, path }:any) => {
    if (+value < 100) {
        throw new Error("You can only make transaction with a minimum of #100");

    } else {
        return value
    }
}